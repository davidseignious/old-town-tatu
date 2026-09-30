const fs = require('fs');
const path = require('path');

const USERNAME = 'tonywulfman.art';
const OUTPUT = path.join(process.cwd(), 'lib', 'generated-instagram-reels.js');
const HARD_BLOCKED_IDS = new Set([
  'Dcjy0dVQsOs',
  'Dchw2bdt3rV',
  'DcfDzlxtXZQ',
  'DbrR0zozlw7',
  'Db_X0i3zNdR',
]);

const rejectedWords = [
  'booking out', 'booking', 'book now', 'book with', 'appointment', 'appointments',
  'availability', 'available', 'openings', 'spots open', 'spot open', 'dm to book',
  'dm me', 'schedule', 'deposit', 'flash sale', 'discount',
  'skull', 'astronaut',
];

const tattooWords = [
  'tattoo', 'tattoos', 'tattooed', 'ink', 'inked', 'piece', 'sleeve',
  'black and grey', 'black & grey', 'blackwork', 'fine line', 'fineline',
  'realism', 'portrait', 'geometric', 'ornamental', 'floral', 'religious',
  'micro realism', 'micro-realism', 'cover up', 'cover-up', 'whip shading',
];

function captionFor(node) {
  return node?.edge_media_to_caption?.edges?.[0]?.node?.text || '';
}

function metadataText(node) {
  try {
    return (captionFor(node) + ' ' + JSON.stringify(node)).toLowerCase();
  } catch {
    return captionFor(node).toLowerCase();
  }
}

function requestedScreenshotScore(node) {
  const text = metadataText(node);
  let score = 0;

  // Dragon back-piece screenshot: caption tags @cielos_fitness; audio shows DEPORTIVO.
  if (text.includes('cielos_fitness') || text.includes('deportivo')) score += 100;

  // Tiger forearm screenshot: visible caption + BbY WOW audio.
  if (
    text.includes('artist') && text.includes('tattooer') && text.includes('creator') ||
    text.includes('obsessed with creating') ||
    text.includes('bby wow') ||
    text.includes('karol g')
  ) score += 95;

  // Spider-web screenshot: motivational 10,000-hours overlay / omari.too audio.
  if (
    text.includes('10,000 hours') ||
    text.includes('10000 hours') ||
    text.includes('next level') ||
    text.includes('omari.too')
  ) score += 90;

  return score;
}

function isTattooReel(node) {
  if (!node?.is_video || !node?.shortcode || HARD_BLOCKED_IDS.has(node.shortcode)) return false;
  const caption = captionFor(node).toLowerCase();
  if (rejectedWords.some((word) => caption.includes(word))) return false;
  return tattooWords.some((word) => caption.includes(word));
}

async function main() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36',
    'X-IG-App-ID': '936619743392459',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.instagram.com/' + USERNAME + '/',
  };

  try {
    const candidateMap = new Map();

    const addCandidate = (candidate) => {
      if (!candidate?.shortcode || HARD_BLOCKED_IDS.has(candidate.shortcode)) return;
      const existing = candidateMap.get(candidate.shortcode);
      if (!existing) {
        candidateMap.set(candidate.shortcode, candidate);
        return;
      }
      // Prefer richer metadata when the same reel appears in more than one source.
      if (!captionFor(existing) && captionFor(candidate)) {
        candidateMap.set(candidate.shortcode, candidate);
      }
    };

    // Source 1: Instagram's public profile/video timeline JSON.
    try {
      const response = await fetch(
        'https://www.instagram.com/api/v1/users/web_profile_info/?username=' + encodeURIComponent(USERNAME),
        { headers }
      );

      if (response.ok) {
        const json = await response.json();
        const user = json?.data?.user || {};
        const videoEdges = user?.edge_felix_video_timeline?.edges || [];
        const timelineEdges = user?.edge_owner_to_timeline_media?.edges || [];

        for (const edge of [...videoEdges, ...timelineEdges]) {
          const node = edge?.node;
          if (node?.is_video && node?.shortcode) addCandidate(node);
        }
      } else {
        console.warn('[instagram] profile JSON returned', response.status);
      }
    } catch (error) {
      console.warn('[instagram] profile JSON fetch failed:', error?.message || error);
    }

    // Source 2: public Reels page HTML. Instagram sometimes exposes more reel
    // shortcodes here than it returns in the profile JSON timeline.
    try {
      const response = await fetch('https://www.instagram.com/' + USERNAME + '/reels/', { headers });
      if (response.ok) {
        const html = await response.text();
        const codePatterns = [
          /"shortcode":"([A-Za-z0-9_-]+)"/g,
          /"code":"([A-Za-z0-9_-]+)"/g,
        ];

        for (const pattern of codePatterns) {
          let match;
          while ((match = pattern.exec(html))) {
            const shortcode = match[1];
            if (!shortcode || HARD_BLOCKED_IDS.has(shortcode)) continue;

            const left = Math.max(0, match.index - 2200);
            const right = Math.min(html.length, match.index + 2200);
            const context = html.slice(left, right).toLowerCase();

            // Don't admit obvious booking/promotional material from the HTML-only pool.
            if (rejectedWords.some((word) => context.includes(word))) continue;

            addCandidate({
              shortcode,
              is_video: true,
              __htmlContext: context,
              edge_media_to_caption: { edges: [] },
            });
          }
        }
      } else {
        console.warn('[instagram] reels HTML returned', response.status);
      }
    } catch (error) {
      console.warn('[instagram] reels HTML fetch failed:', error?.message || error);
    }

    const deduped = [...candidateMap.values()];

    const isRejected = (node) => {
      if (requestedScreenshotScore(node) > 0) return false;
      if (HARD_BLOCKED_IDS.has(node.shortcode)) return true;
      const text = metadataText(node);
      return rejectedWords.some((word) => text.includes(word));
    };

    const requestedFromScreenshots = deduped
      .filter((node) => !isRejected(node) && requestedScreenshotScore(node) > 0)
      .sort((a, b) => requestedScreenshotScore(b) - requestedScreenshotScore(a));

    const strongTattooMatches = deduped.filter((node) => !isRejected(node) && isTattooReel(node));

    const otherNonPromoVideos = deduped.filter(
      (node) =>
        !isRejected(node) &&
        !requestedFromScreenshots.some((match) => match.shortcode === node.shortcode) &&
        !strongTattooMatches.some((match) => match.shortcode === node.shortcode)
    );

    const combined = [...requestedFromScreenshots, ...strongTattooMatches, ...otherNonPromoVideos];
    const selected = [];
    const selectedIds = new Set();

    for (const node of combined) {
      if (!selectedIds.has(node.shortcode)) {
        selectedIds.add(node.shortcode);
        selected.push(node);
      }
      if (selected.length >= 12) break;
    }

    const reels = selected.map((node) => ({
      id: node.shortcode,
      permalink: 'https://www.instagram.com/p/' + node.shortcode + '/',
    }));

    if (reels.length < 8) {
      throw new Error('[instagram] need at least 8 usable public video posts; found ' + reels.length);
    }

    const file =
      "// Auto-generated at build time from Tony Wulfman's public Instagram.\n" +
      "// Booking/promotional posts and rejected subjects are filtered out.\n" +
      'export const INSTAGRAM_REELS = ' + JSON.stringify(reels, null, 2) + ';\n';

    fs.writeFileSync(OUTPUT, file);
    console.log(
      '[instagram] generated tattoo reels:',
      selected.map((node) => ({
        id: node.shortcode,
        requestedScore: requestedScreenshotScore(node),
        caption: captionFor(node).slice(0, 80),
      }))
    );
  } catch (error) {
    console.error('[instagram] reel generation failed:', error?.message || error);
    process.exitCode = 1;
    throw error;
  }
}

main();

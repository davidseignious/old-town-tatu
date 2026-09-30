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
  try {
    const response = await fetch(
      'https://www.instagram.com/api/v1/users/web_profile_info/?username=' + encodeURIComponent(USERNAME),
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36',
          'X-IG-App-ID': '936619743392459',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.instagram.com/' + USERNAME + '/',
        },
      }
    );

    if (!response.ok) {
      console.warn('[instagram] public profile request failed:', response.status);
      return;
    }

    const json = await response.json();
    const user = json?.data?.user || {};
    const videoEdges = user?.edge_felix_video_timeline?.edges || [];
    const timelineEdges = user?.edge_owner_to_timeline_media?.edges || [];

    const allVideoNodes = [...videoEdges, ...timelineEdges]
      .map((edge) => edge.node)
      .filter((node) => node?.is_video && node?.shortcode);

    const deduped = [];
    const seen = new Set();
    for (const node of allVideoNodes) {
      if (!seen.has(node.shortcode)) {
        seen.add(node.shortcode);
        deduped.push(node);
      }
    }

    const isRejected = (node) => {
      // The three reels the user explicitly supplied by screenshot override older guessed exclusions.
      if (requestedScreenshotScore(node) > 0) return false;
      if (HARD_BLOCKED_IDS.has(node.shortcode)) return true;
      const caption = captionFor(node).toLowerCase();
      return rejectedWords.some((word) => caption.includes(word));
    };

    const strongTattooMatches = deduped.filter((node) => isTattooReel(node));
    const otherNonPromoVideos = deduped.filter(
      (node) => !isRejected(node) && !strongTattooMatches.some((match) => match.shortcode === node.shortcode)
    );

    const requestedFromScreenshots = deduped
      .filter((node) => !isRejected(node) && requestedScreenshotScore(node) > 0)
      .sort((a, b) => requestedScreenshotScore(b) - requestedScreenshotScore(a));

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
      permalink: 'https://www.instagram.com/reel/' + node.shortcode + '/',
    }));

    if (reels.length < 8) {
      throw new Error('[instagram] need at least 8 usable public video posts; found ' + reels.length);
    }

    const file = "// Auto-generated at build time from Tony Wulfman's public Instagram.\\n" +
      "// Booking/promotional posts and rejected subjects are filtered out.\\n" +
      'export const INSTAGRAM_REELS = ' + JSON.stringify(reels, null, 2) + ';\\n';

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
    console.warn('[instagram] fetch failed; keeping fallback reel:', error?.message || error);
  }
}

main();

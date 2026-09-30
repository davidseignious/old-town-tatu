export default async function handler(req, res) {
  const username = 'tonywulfman.art';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36',
    'X-IG-App-ID': '936619743392459',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.instagram.com/' + username + '/',
  };
  const out = { profile: [], feed: [], errors: [] };
  try {
    const r = await fetch('https://www.instagram.com/api/v1/users/web_profile_info/?username=' + encodeURIComponent(username), { headers });
    const j = await r.json();
    const user = j?.data?.user;
    const clean = (n) => ({
      code: n?.shortcode || null,
      caption: n?.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      is_video: !!n?.is_video,
      thumbnail: n?.display_url || n?.thumbnail_src || null,
    });
    const videoEdges = user?.edge_felix_video_timeline?.edges || [];
    const timelineEdges = user?.edge_owner_to_timeline_media?.edges || [];
    out.profile = [...videoEdges, ...timelineEdges].map(e => clean(e.node)).filter(x => x.code);
    if (user?.id) {
      const f = await fetch('https://www.instagram.com/api/v1/feed/user/' + user.id + '/?count=50', { headers });
      const fj = await f.json();
      out.feed = (fj?.items || []).map(item => ({
        code: item.code || null,
        caption: item.caption?.text || '',
        media_type: item.media_type,
        product_type: item.product_type || null,
        thumbnail: item.image_versions2?.candidates?.[0]?.url || null,
      })).filter(x => x.code);
    }
  } catch (e) {
    out.errors.push(String(e));
  }
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(out);
}

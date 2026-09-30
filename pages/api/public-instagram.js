export default async function handler(req, res) {
  const username = 'tonywulfman.art';
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36',
    'X-IG-App-ID': '936619743392459',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.instagram.com/' + username + '/',
  };

  const result = { username, profile: null, feed: null, errors: [] };

  try {
    const r = await fetch(
      'https://www.instagram.com/api/v1/users/web_profile_info/?username=' + encodeURIComponent(username),
      { headers }
    );
    const text = await r.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    const user = json?.data?.user;
    const cleanNode = (n) => ({
      id: n?.id,
      shortcode: n?.shortcode,
      is_video: n?.is_video,
      video_view_count: n?.video_view_count,
      product_type: n?.product_type,
      typename: n?.__typename,
      caption: n?.edge_media_to_caption?.edges?.[0]?.node?.text || '',
      display_url: n?.display_url || null,
      thumbnail_src: n?.thumbnail_src || null,
      taken_at_timestamp: n?.taken_at_timestamp || null,
    });
    result.profile = {
      status: r.status,
      id: user?.id || null,
      timeline: (user?.edge_owner_to_timeline_media?.edges || []).map(e => cleanNode(e.node)),
      videos: (user?.edge_felix_video_timeline?.edges || []).map(e => cleanNode(e.node)),
      keys: user ? Object.keys(user) : [],
      raw_error: r.ok ? null : text.slice(0,1000),
    };

    if (user?.id) {
      try {
        const f = await fetch(
          'https://www.instagram.com/api/v1/feed/user/' + user.id + '/?count=50',
          { headers }
        );
        const ftext = await f.text();
        let fj = null;
        try { fj = JSON.parse(ftext); } catch {}
        result.feed = {
          status: f.status,
          more_available: fj?.more_available,
          next_max_id: fj?.next_max_id || null,
          items: (fj?.items || []).map(item => ({
            id: item.id,
            code: item.code,
            media_type: item.media_type,
            product_type: item.product_type,
            taken_at: item.taken_at,
            caption: item.caption?.text || '',
            video_versions: (item.video_versions || []).slice(0,2).map(v => ({url:v.url,width:v.width,height:v.height})),
            image_versions: (item.image_versions2?.candidates || []).slice(0,2).map(v => ({url:v.url,width:v.width,height:v.height})),
          })),
          raw_error: f.ok ? null : ftext.slice(0,1000),
        };
      } catch (e) {
        result.errors.push('feed: ' + String(e));
      }
    }
  } catch (e) {
    result.errors.push('profile: ' + String(e));
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(result);
}

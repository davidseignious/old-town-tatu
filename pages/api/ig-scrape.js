export default async function handler(req, res) {
  const username = 'tonywulfman.art';
  const out = { ok: false, username, profile: null, html: null, errors: [] };

  try {
    const r = await fetch('https://www.instagram.com/api/v1/users/web_profile_info/?username=' + encodeURIComponent(username), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/' + username + '/',
      },
      redirect: 'follow',
    });
    const text = await r.text();
    out.profile = { status: r.status, body: text.slice(0, 200000) };
    if (r.ok) out.ok = true;
  } catch (e) {
    out.errors.push('profile: ' + String(e));
  }

  try {
    const r = await fetch('https://www.instagram.com/' + username + '/reels/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/136 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });
    const text = await r.text();
    const codes = [];
    for (const re of [/"shortcode":"([^"]+)"/g, /"code":"([^"]+)"/g]) {
      let m;
      while ((m = re.exec(text)) && codes.length < 100) {
        if (!codes.includes(m[1])) codes.push(m[1]);
      }
    }
    out.html = { status: r.status, bytes: text.length, shortcodes: codes, sample: text.slice(0, 10000) };
  } catch (e) {
    out.errors.push('html: ' + String(e));
  }

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json(out);
}

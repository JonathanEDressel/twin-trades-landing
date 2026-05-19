// Netlify Function — returns the waitlist form submission count.
// Required env vars (set in Netlify dashboard → Site configuration → Environment variables):
//   NETLIFY_API_TOKEN  — a Personal Access Token from https://app.netlify.com/user/applications
//   NETLIFY_SITE_ID    — found in Site configuration → General → Site details

exports.handler = async () => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const token  = process.env.NETLIFY_API_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  if (!token || !siteId) {
    return { statusCode: 200, headers, body: JSON.stringify({ count: null }) };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/forms`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ count: null }) };
    }

    const forms = await res.json();
    const waitlist = forms.find(f => f.name === 'waitlist');
    const count = waitlist ? waitlist.submission_count : 0;

    return { statusCode: 200, headers, body: JSON.stringify({ count }) };
  } catch {
    return { statusCode: 200, headers, body: JSON.stringify({ count: null }) };
  }
};

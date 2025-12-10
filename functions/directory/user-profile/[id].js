export async function onRequest({ params, env }) {
  try {
    // 1. Fetch profile from your API
    const apiUrl = `https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api/profile/public/${params.id}`;
    const response = await fetch(apiUrl);
    const json = await response.json();

    // Ensure valid shape
    const profile = json?.data?.data || null;

    // Extract fields
    const name = profile
      ? `${profile.first_name} ${profile.last_name}`
      : "CNESS User";

    const image =
      profile?.profile_picture ||
      "https://cdn.cness.io/default-avatar.svg";

    const description = `Check out ${name}'s profile on CNESS`;

    // 2. Load the built index.html from Cloudflare Pages static assets
    const indexRes = await env.ASSETS.fetch("https://dev.cness.io/");
    let html = await indexRes.text();

    // 3. Inject dynamic meta tags
    html = html.replace(
      /<head>/i,
      `<head>
        <meta property="og:title" content="${name} - CNESS" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${name} - CNESS" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${image}" />
    `
    );

    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    return new Response("Server Error", { status: 500 });
  }
}

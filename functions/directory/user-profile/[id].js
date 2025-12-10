const BOT_UAS = [
  "twitterbot",
  "facebookexternalhit",
  "linkedinbot",
  "whatsapp",
  "slackbot",
  "discordbot",
  "telegrambot",
  "curl", // debuggers
];

function isBot(userAgent = "") {
  const ua = userAgent.toLowerCase();
  return BOT_UAS.some((bot) => ua.includes(bot));
}

export async function onRequest({ params, request }) {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";

  // 1) If it's a normal browser → do NOT touch. Let React/Vite handle it.
  if (!isBot(userAgent)) {
    // Returning null tells Cloudflare Pages to fall back to static assets.
    return;
  }

  // 2) For bots (Twitter/WhatsApp/etc.) → build static OG HTML
  let profile = null;

  try {
    const apiUrl = `https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api/profile/public/${params.id}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const json = await res.json();
      profile = json?.data?.data || null;
    }
  } catch (err) {
    // swallow errors; we'll use fallbacks
  }

  const name = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "CNESS User";

  const image =
    profile?.profile_picture ||
    "https://cdn.cness.io/default-avatar.svg";

  const description = `Check out ${name}'s profile on CNESS`;

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />

    <title>${name} - CNESS</title>
    <meta name="description" content="${description}" />

    <!-- Open Graph -->
    <meta property="og:title" content="${name} - CNESS" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url.href}" />
    <meta property="og:site_name" content="CNESS" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${name} - CNESS" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  </head>
  <body>
    <p>Preview for ${name}'s profile.</p>
  </body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

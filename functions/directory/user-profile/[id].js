const BOT_UAS = [
    "twitterbot",
    "facebookexternalhit",
    "linkedinbot",
    "whatsapp",
    "slackbot",
    "discordbot",
    "telegrambot",
    "curl",
];

function isBot(ua = "") {
    ua = ua.toLowerCase();
    return BOT_UAS.some((b) => ua.includes(b));
}

export async function onRequest({ params, request, env }) {
    const userAgent = request.headers.get("user-agent") || "";
    const url = new URL(request.url);

    // 1) Normal browser → return the SPA normally
    if (!isBot(userAgent)) {
        return env.ASSETS.fetch(request); // <-- THIS FIXES YOUR ERROR
    }

    // 2) Bot → return preview HTML
    let profile = null;

    try {
        const apiUrl = `${env.API_BASE_URL}/profile/public/${params.id}`;
        console.log("🔵 Fetching API:", apiUrl);
        const res = await fetch(apiUrl);
        console.log("🟢 API Status:", res.status);
        console.log("🟢 API res.ok Status:", res.ok);

        if (res.ok) {
            const json = await res.json();
            console.log("🟣 API Response JSON:", JSON.stringify(json));
            profile = json?.data?.data?.data || null;
        }
    } catch (e) {
        // ignore
        console.error("🔴 API Error:", e);
    }

    const name = profile
        ? `${profile.first_name} ${profile.last_name}`
        : "CNESS User";

    const image =
        profile?.profile_picture ??
        "https://cdn.cness.io/default-avatar.svg";

    const description = `Check out ${name}'s profile on CNESS`;

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${name} - CNESS</title>
    <meta name="description" content="${description}" />

    <meta property="og:title" content="${name} - CNESS" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url.href}" />
    <meta property="og:site_name" content="CNESS" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${name} - CNESS" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
  </head>
  <body>Preview for ${name}</body>
</html>`;

    return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}

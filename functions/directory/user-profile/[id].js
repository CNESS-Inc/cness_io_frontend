const BOT_UAS = [
    "whatsapp",
    "facebookexternalhit",
    "twitterbot",
    "linkedinbot",
    "slackbot",
    "discordbot",
    "telegrambot",
    "curl",
    "bot",
    "embed"
];

function isBot(ua = "") {
    ua = ua.toLowerCase();
    return BOT_UAS.some((b) => ua.includes(b));
}

export async function onRequest({ params, request, env }) {
    const userAgent = request.headers.get("user-agent") || "";
    console.log('userAgent', userAgent)
    const url = new URL(request.url);
    const origin = request.headers.get("origin") || "";

    // 🔵 If scraper (bot) → return preview HTML
    if (isBot(userAgent)) {
        let profile = null;

        try {
            const apiUrl = `${env.VITE_API_BASE_URL}/profile/public/${params.id}`;
            const res = await fetch(apiUrl, {
                headers: {
                    "Origin": origin,
                    "User-Agent": userAgent,
                    "Accept": "application/json"
                }
            });

            if (res.ok) {
                const json = await res.json();
                profile = json?.data?.data || null;
            }
        } catch (e) {
            console.error("API Error:", e);
        }

        const name = profile
            ? `${profile.first_name} ${profile.last_name}`
            : "CNESS User";

        const image =
            profile?.profile_picture ??
            "https://cdn.cness.io/default_image.jpeg";

        const description = `Check out ${name}'s profile on CNESS`;

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta property="og:title" content="${name} - CNESS">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:url" content="${url.href}">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body>Preview for ${name}</body>
</html>`;

        return new Response(html, {
            headers: { "Content-Type": "text/html; charset=utf-8" },
        });
    }

    // 🔵 Normal user → load SPA
    return env.ASSETS.fetch(request);
}

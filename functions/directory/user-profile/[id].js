export async function onRequest(context) {
  const { params } = context;

  // 1. Fetch user data from your API
  const apiUrl = `https://z3z1ppsdij.execute-api.us-east-1.amazonaws.com/api/profile/public/${params.id}`;
  const user = await fetch(apiUrl).then((res) => res.json());

  // 2. Generate dynamic meta tags
  const title = `${user.name} - CNESS`;
  const description = `Check out ${user.name}'s profile on CNESS`;
  const image = user.profileImage ?? "https://cdn.cness.io/default-avatar.svg";

  // 3. Return modified HTML while letting Vite handle the React app
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="${title}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:image:secure_url" content="${image}" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${title}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${image}" />

        <title>${title}</title>
      </head>

      <body>
        <div id="root"></div>
        <script type="module" src="/src/main.jsx"></script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { "Content-Type": "text/html" },
  });
}

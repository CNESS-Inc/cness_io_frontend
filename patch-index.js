import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to dist/index.html
const indexPath = path.join(__dirname, "dist", "index.html");

fs.readFile(indexPath, "utf8", (err, html) => {
  if (err) {
    console.error("❌ Failed to read index.html:", err);
    return;
  }

  let modifiedHtml = html;

  // 🧠 Extract all <script type="module" src="..."> to preload them
  const scriptRegex = /<script\s+type="module"\s+[^>]*src="([^"]+)"[^>]*><\/script>/g;
  const moduleScripts = [...html.matchAll(scriptRegex)].map(match => match[1]);

  // Add <link rel="modulepreload"> for each script if not already there
  const existingPreloads = new Set();
  const preloadRegex = /<link\s+rel="modulepreload"[^>]+href="([^"]+)"/g;
  for (const match of html.matchAll(preloadRegex)) {
    existingPreloads.add(match[1]);
  }

  const preloadLinks = moduleScripts
    .filter(src => !existingPreloads.has(src))
    .map(src => `<link rel="modulepreload" href="${src}" crossorigin>`)
    .join("\n");

  if (preloadLinks) {
    modifiedHtml = modifiedHtml.replace("<head>", `<head>\n  ${preloadLinks}`);
  }

  // 🎨 Convert blocking CSS to preload + noscript fallback
  modifiedHtml = modifiedHtml.replace(
    /<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/,
    (match, href) => {
      return `
<link rel="preload" as="style" href="${href}" crossorigin onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="${href}" crossorigin></noscript>`;
    }
  );

  // 🧘 Delay layout-sensitive JS execution
  const layoutDelayScript = `
<script>
  requestIdleCallback(() => {
    try {
      setTimeout(() => {
        document.querySelectorAll(".layout-sensitive").forEach(el => el.offsetWidth);
      }, 200);
    } catch (e) {}
  });
</script>
`;

  if (!modifiedHtml.includes("requestIdleCallback")) {
    modifiedHtml = modifiedHtml.replace("</body>", `${layoutDelayScript}\n</body>`);
  }

  // ✅ Write back modified file
  fs.writeFile(indexPath, modifiedHtml, "utf8", (err) => {
    if (err) {
      console.error("❌ Failed to write patched index.html:", err);
    } else {
      console.log("✅ index.html successfully patched with preload and reflow fixes.");
    }
  });
});

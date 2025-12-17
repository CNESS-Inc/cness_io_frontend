const FILE_BASE =
  import.meta.env.VITE_FILE_BASE_URL || "https://dev.cness.io";

export function normalizeFileUrl(raw?: string): string {
  if (!raw) return "";
  let url = raw.trim();

  // Unwrap: https://dev.cness.io/file/https://res.cloudinary.com/...
  url = url.replace(/^https?:\/\/[^/]+\/file\/(https?:\/\/.*)$/i, "$1");

  // If still wrapped but inner part is a relative path: /file/uploads/xyz.jpg
  const m = url.match(/^https?:\/\/[^/]+\/file\/(.+)$/i);
  if (m && !/^https?:\/\//i.test(m[1])) {
    const inner = m[1].replace(/^\/+/, "");
    url = `${FILE_BASE.replace(/\/$/, "")}/${inner}`;
  }

  // Fix duplicate extensions: .jpg.jpg → .jpg (covers jpg|jpeg|png|webp)
  url = url.replace(/(\.(?:jpg|jpeg|png|webp))(?:\1)+$/i, "$1");

  // Force https
  url = url.replace(/^http:\/\//i, "https://");

  return encodeURI(url);
}
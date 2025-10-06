import { useEffect, useRef, useState } from "react";

type Props = {
  /** Public Zoho form URL (formperma link). You can pass with or without ?zf_rszfm=1 */
  src: string;
  title?: string;
  minHeight?: number;
};

export default function Marketform({
  src,
  title = "Marketplace Form",
  minHeight = 600,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Auto-resize based on Zoho's postMessage: "<perma>|<height>|..."
  useEffect(() => {
    const onMsg = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      const parts = event.data.split("|");
      if (parts.length < 2) return;
      const [perma, h] = parts;
      if (!perma || !h) return;

      // Only handle messages for this iframe/form
      if (src.includes(perma) && iframeRef.current) {
        const newH = `${parseInt(h, 10) + 15}px`;
        iframeRef.current.style.height = newH;
      }
    };

    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [src]);

  // Ensure zf_rszfm=1 is present so Zoho posts height
  const srcWithResize = src.includes("zf_rszfm=1")
    ? src
    : `${src}${src.includes("?") ? "&" : "?"}zf_rszfm=1`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {!loaded && <div className="p-6 text-sm text-gray-500">Loading form…</div>}
      <iframe
        ref={iframeRef}
        title={title}
        aria-label={title}
        src={srcWithResize}
        className="w-full border-0"
        style={{ minHeight }}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
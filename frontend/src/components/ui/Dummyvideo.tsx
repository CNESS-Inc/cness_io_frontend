import  { useEffect } from "react";
import { X, PlayCircle, Volume2, Maximize } from "lucide-react";

type ComingSoonVideoProps = {
  open: boolean;
  onClose: () => void;
};

export default function ComingSoonVideo({ open, onClose }: ComingSoonVideoProps) {
  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4
                "
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal container */}
      <div
        className="
          relative w-full max-w-[900px] aspect-video
          rounded-[18px] bg-[#0F1113]
          shadow-[0_20px_80px_rgba(0,0,0,0.6)]
          border-[5px] border-white/90
          overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full p-1.5
                     text-white/70 hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

        {/* Center content: Play + text */}
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex items-center gap-4">
            <PlayCircle className="w-16 h-16 text-white/90" />
            <span className="text-white/90 text-2xl font-light tracking-wide">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Bottom controls bar (fake) */}
        <div className="absolute left-0 right-0 bottom-0">
          {/* Progress */}
          <div className="px-5 pb-2">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[10%] bg-[#E11D48]" />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between px-4 pb-3 text-white/80 text-sm">
            <div className="flex items-center gap-3">
              {/* Play icon (fake) */}
              <div className="w-6 h-6 grid place-items-center rounded-full border border-white/30">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              {/* Volume */}
              <Volume2 className="w-5 h-5 opacity-80" />
              {/* Timestamp */}
              <span className="ml-2">0:00</span>
            </div>

            <div className="flex items-center gap-3">
              <span>0:30</span>
              <Maximize className="w-5 h-5 opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

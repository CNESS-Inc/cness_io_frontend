// PopupOnboardingModal.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type PopupOnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  /** Left panel image. Defaults to your asset. */
  imageSrc?: string;
  /** Overlay click closes modal (default: true) */
  closeOnOverlay?: boolean;
  /** Right panel content (forms/steps/etc.) */
  children?: React.ReactNode;
};

export default function PopupOnboardingModal({
  open,
  onClose,
  imageSrc = "https://cdn.cness.io/signup.webp",
  closeOnOverlay = true,
  children,
}: PopupOnboardingModalProps) {
  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
  <div className="fixed inset-0 z-[100]">
    {/* Overlay */}
    <div
      className="absolute inset-0 bg-black/50"
      onClick={() => closeOnOverlay && onClose()}
      aria-hidden
    />

    {/* Center container */}
    <div className="absolute inset-0 grid place-items-center p-4">
      {/* Modal frame matches: 1020w x 730h, gap 10, radius 32, padding 30 */}
      <div
        role="dialog"
        aria-modal="true"
        className="
         relative grid grid-cols-1 md:grid-cols-[475px_475px]
    w-full max-w-[1020px] h-auto md:h-[730px]
    rounded-[32px] p-[20px] md:p-[30px]
    shadow-2xl bg-white
        "
      >
        

        {/* Left pane: 475x670, padding: 60px (pt/pb 86px), radius 32 */}
        <div
          className="
            relative overflow-hidden rounded-[32px]
            w-[475px] h-[670px]
            px-[60px] pt-[86px] pb-[86px]
          "
        >
          <img
            src={imageSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
         <div
  className="absolute inset-0"
  style={{
    background: "linear-gradient(135deg, #FFFFFF 0%, #FEDEDE 40%, #EE9CE5 100%)",
    opacity: 0.6,
  }}
/>
          
          {/* (Optional) left-side content can be slotted here later */}
        </div>

        {/* Right pane: 475x670, white, px:30, radius 32 */}
        <div
          className="
            relative rounded-[32px] bg-white
            w-[475px] h-[670px]
            px-[30px] py-[30px]
            
          "
        >
          {/* Close (mobile) */}
          <button
            onClick={onClose}
            aria-label="Close"
    className=" absolute right-0 top-0 "
          >
            <X className="h-7 w-7 stroke-[#9EA8B6]" />
          </button>

          {/* Right-side content slot */}
          {children}
        </div>
      </div>
    </div>
  </div>,
  document.body
  );
}

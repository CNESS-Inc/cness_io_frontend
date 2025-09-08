// PopupOnboardingModal.tsx
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Transition } from "@headlessui/react";

type PopupOnboardingModalProps = {
  open: boolean;
  onClose: () => void;
  imageSrc?: string;
  closeOnOverlay?: boolean;
  children?: React.ReactNode;
};

export default function PopupOnboardingModal({
  open,
  onClose,
  imageSrc = "https://cdn.cness.io/signup.webp",
  closeOnOverlay = true,
  children,
}: PopupOnboardingModalProps) {
  // Lock body scroll
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
    w-full max-w-[1020px] h-auto md:min-h-[850px]
    rounded-[32px] p-[20px] md:p-[30px]
    shadow-2xl bg-white
        "
      >
        

        {/* Left pane: 475x670, padding: 60px (pt/pb 86px), radius 32 */}
        <div
          className="
            relative overflow-hidden rounded-[32px]
            w-[475px] h-[800px]
            px-[60px] pt-[86px] pb-[86px]
          "

        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => closeOnOverlay && onClose()}
            aria-hidden
          />

          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #FEDEDE 40%, #EE9CE5 100%)",
              opacity: 0.6,
            }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full">
            <h2 className="text-center font-[Poppins] font-medium text-[42px] leading-[100%] tracking-[-0.03em] mb-5 bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text">Welcome!</h2>
            <span className="text-[#64748B] text-center text-[16px]">Discover certifications, connect with like-<br/>minded people, grow your ideas, and make an<br/> impact—all in one place.</span>
          </div>
          
          {/* (Optional) left-side content can be slotted here later */}
        </div>


        {/* Center container */}
        <div className="absolute inset-0 grid place-items-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="ease-in duration-200"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
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
              {/* Left pane */}
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
                    background:
                      "linear-gradient(135deg, #FFFFFF 0%, #FEDEDE 40%, #EE9CE5 100%)",
                    opacity: 0.6,
                  }}
                />
              </div>

              {/* Right pane */}
              <div
                className="
                  relative rounded-[32px] bg-white
                  w-[475px] h-[670px]
                  px-[30px] py-[30px]
                "
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-4 top-4"
                >
                  <X className="h-7 w-7 stroke-[#9EA8B6]" />
                </button>

                {/* Slot for form / content */}
                {children}
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>,
    document.body
  );
}

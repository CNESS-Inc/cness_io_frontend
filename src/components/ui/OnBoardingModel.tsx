// PopupOnboardingModal.tsx
import React, { useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Transition } from "@headlessui/react";

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
    <Transition appear show={open} as={Fragment}>
      <div className="fixed inset-0 z-[100]">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => closeOnOverlay && onClose()}
            aria-hidden
          />
        </Transition.Child>

        {/* Center container */}
        <div className="absolute inset-0 grid place-items-center p-4">
          {/* Modal */}
          <Transition.Child
            as={Fragment}
            enter="transform ease-out duration-500"
            enterFrom="translate-y-full opacity-0"
            enterTo="translate-y-0 opacity-100"
            leave="transform ease-in duration-400"
            leaveFrom="translate-y-0 opacity-100"
            leaveTo="translate-y-full opacity-0"
          >
            <div
              role="dialog"
              aria-modal="true"
              className="
                relative grid grid-cols-1 md:grid-cols-2
                w-full max-w-[1020px] h-auto max-h-[95vh]
                rounded-[24px] p-4 md:p-[30px]
                shadow-2xl bg-white
                overflow-y-auto
              "
            >
              {/* Left panel */}
              <div
                className="
                  relative overflow-hidden rounded-[24px]
                  hidden md:block
                  flex-1 h-full
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
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-center w-full px-6">
  <h2  style={{ fontFamily: "Poppins, sans-serif" }} className="text-center font-medium text-3xl md:text-[42px] leading-tight mb-5 bg-gradient-to-b from-[#232323] to-[#4E4E4E] text-transparent bg-clip-text">
    Welcome!
  </h2>
  <p className="text-[#64748B] text-center text-sm md:text-base leading-relaxed max-w-[380px] mx-auto">
    Discover certifications, connect with like-minded people, grow your ideas,
    and make an impact—all in one place.
  </p>
</div>
              </div>

              {/* Right panel */}
              <div
                className="
                  relative rounded-[24px] bg-white
                  w-full h-full
                  px-4 md:px-[30px] py-[20px] md:py-[30px]
                "
              >
                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-4 top-4"
                >
                  <X className="h-6 w-6 md:h-7 md:w-7 stroke-[#9EA8B6]" />
                </button>

                {/* Right-side content */}
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

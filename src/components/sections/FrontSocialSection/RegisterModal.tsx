import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "center" | "bottom"; // Add position prop
}

export default function Modal({
  isOpen,
  onClose,
  children,
  position = "center",
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine positioning classes based on position prop
  const positionClasses = {
    center: "items-center justify-center",
    bottom: "items-end justify-center",
  };

  const modalSizeClasses = {
    center: "max-w-[1080px] w-full mx-auto my-8",
    bottom: "w-full max-w-full my-0",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className={`flex min-h-screen p-4 sm:p-6 ${positionClasses[position]}`}
      >
        <div
          className="fixed inset-0 transition-opacity duration-500 ease-in-out opacity-60 bg-black"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal content */}
        <div
          className={`relative bg-white rounded-2xl shadow-xl transition-all transform ${modalSizeClasses[position]}`}
          style={{
            maxHeight: "90vh",
            overflowY: "auto", 
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Modal content */}
          <div className="p-6 sm:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

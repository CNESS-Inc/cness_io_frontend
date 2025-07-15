import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'center' | 'bottom'; // Add position prop
}

export default function Modal({ isOpen, onClose, children, position = 'center' }: ModalProps) {
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
    bottom: "items-end justify-center"
  };

  const modalSizeClasses = {
    center: "max-w-lg mx-auto my-8",
    bottom: "w-full max-w-full my-0"
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className={`flex min-h-screen p-4 sm:p-0 ${positionClasses[position]}`}>
        <div 
          className={`fixed inset-0 transition-opacity duration-1000 ease-in-out opacity-75 bg-black`}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal content */}
        <div 
          className={`relative overflow-hidden bg-white rounded-lg shadow-xl transition-all transform ${modalSizeClasses[position]}`}
          style={{
            maxHeight: "90vh",
            overflowY: "auto"
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 focus:outline-none z-50"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          
          {/* Modal content */}
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
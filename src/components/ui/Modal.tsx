import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal positioning trick for centering */}
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal content */}
        <div 
          className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-t-lg shadow-xl sm:rounded-lg sm:align-middle sm:max-w-lg"
          style={{
            maxHeight: "90vh",
            overflowY: "auto"
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button for mobile */}
          <button
            type="button"
            className="absolute top-4 right-4 text-white sm:top-6 sm:right-6"
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
          
          {children}
        </div>
      </div>
    </div>
  );
}
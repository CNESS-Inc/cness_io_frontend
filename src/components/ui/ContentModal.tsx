import { useEffect } from "react";
import { IoCloseOutline } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "center" | "bottom"; // Add position prop

  modalKey?: string;
  completionStatus?: number; // 👈 add optional prop
  completedStep?: number; // 👈 add optional prop
}
let activeModalKey: string | null = null;

export default function Modal({
  isOpen,
  onClose,
  children,
  position = "center",

  modalKey,
  completionStatus,
  completedStep,
}: ModalProps) {
  const resolvedCompletionStatus =
    completionStatus ??
    Number(localStorage.getItem("person_organization") || "0");
  const resolvedCompletedStep =
    completedStep ?? Number(localStorage.getItem("completed_step") || "0");
  if (
    isOpen &&
    modalKey === "person" &&
    resolvedCompletionStatus > 0 &&
    resolvedCompletedStep > 0
  ) {
    // optional: actively close parent state instead of just not rendering
    // setTimeout(onClose, 0);
    return null;
  }

  useEffect(() => {
    if (isOpen && modalKey) {
      // close any previous modal
      if (activeModalKey && activeModalKey !== modalKey) {
        // auto-close previous modal
        document.dispatchEvent(
          new CustomEvent("closeModal", { detail: activeModalKey })
        );
      }
      activeModalKey = modalKey;
    }

    return () => {
      if (activeModalKey === modalKey) {
        activeModalKey = null;
      }
    };
  }, [isOpen, modalKey]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail === modalKey) {
        onClose();
      }
    };
    document.addEventListener("closeModal", handler);
    return () => document.removeEventListener("closeModal", handler);
  }, [modalKey, onClose]);

  const positionClasses = {
    center: "items-center justify-center",
    bottom: "items-end justify-center",
  };

  const modalSizeClasses = {
    center: "max-w-lg mx-auto my-8",
    bottom: "w-full max-w-full my-0",
  };

  if (!isOpen) return null;
  return (
<div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[3000]">
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
            width:"100%",
            maxWidth: "1100px"
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            type="button"
            className="absolute lg:top-4 md:top-4 top-1 lg:right-4 md:right-4 right-1 p-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IoCloseOutline className="text-[#E1056D]" size={36} />
          </button>

          {/* Modal content */}
          <div className="p-6 sm:p-10">{children}</div>
        </div>
      </div>
    </div>
  );
}

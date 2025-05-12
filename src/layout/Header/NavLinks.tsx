import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm.tsx";

const links = [
  { name: "Why", href: "/" },
  { name: "What", href: "/" },
  { name: "About", href: "/" },
];

export default function NavLinks({ className }: { className?: string }) {
  const [activeModal, setActiveModal] = useState<"signup" | "login" | null>(null);

  const openSignupModal = () => setActiveModal("signup");
  const openLoginModal = () => setActiveModal("login");
  const closeModal = () => setActiveModal(null);

  return (
    <>
      <nav 
        aria-label="Main navigation" 
        className={cn("flex items-center gap-8", className)}
      >
        <ul className="flex space-x-8">
          {links.map((link) => (
            <li key={link.name}>
              <Link
                to={link.href}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <Button
          className="bg-[#7077FE] py-[16px] px-[24px] rounded-full transition-colors duration-500 ease-in-out"
          variant="primary"
          withGradientOverlay
          onClick={openSignupModal}
        >
          Sign Up
        </Button>
      </nav>

      <Modal isOpen={activeModal === "signup"} onClose={closeModal}>
        <SignupForm 
          onSuccess={closeModal} 
          onSwitchToLogin={() => setActiveModal("login")} 
        />
      </Modal>

      <Modal isOpen={activeModal === "login"} onClose={closeModal}>
        <LoginForm 
          onSuccess={closeModal} 
          onSwitchToSignup={() => setActiveModal("signup")} 
        />
      </Modal>
    </>
  );
}
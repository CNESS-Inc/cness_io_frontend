// src/app/components/layout/Header/MobileMenu.tsx

import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const links = [
{ name: "Why", href: "/why" },
  // { name: "What", href: "/what" },
  { name: "About", href: "/about" },
  { name: "Directory", href: "/directory" },
];

export default function MobileMenu({ isOpen }: { isOpen: boolean }) {
  const [activeModal, setActiveModal] = useState<"signup" | "login" | null>(
    null
  );

  const openSignupModal = () => setActiveModal("signup");
  const openLoginModal = () => setActiveModal("login");
  const closeModal = () => setActiveModal(null);

  const completed_step = localStorage.getItem("completed_step");
  const showDashboardButton = completed_step === "1" || completed_step === "2";
  return (
    <>
      <div
        className={`md:hidden bg-white transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[1000px] py-4" : "max-h-0 py-0"
        }`}
      >
        <nav aria-label="Mobile navigation" className="px-4">
          <ul className="flex flex-col space-y-4">
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  
                  className="block text-gray-700 hover:text-primary-600 transition-colors py-2 px-4"
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {showDashboardButton ? (
              <>
                <li>
                  <Link to="/dashboard">
                    <Button
                      variant="gradient-primary"
                      className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
                    >
                      Go to Dashboard
                    </Button>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Button
                    variant="white-outline"
                    className="w-[104px] h-[39px] rounded-[100px] px-6 py-3 gap-3 border 
    font-['Plus Jakarta Sans'] font-medium text-[12px] leading-[12px]"
                 
                    onClick={openSignupModal}
                  >
                    Sign Up
                  </Button>
                </li>
                <li>
<Button
  variant="gradient-primary"
  className="
    w-[104px] h-[39px] rounded-[100px] p-0
    font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
    flex items-center justify-center
  "
  onClick={openLoginModal}
>
  <span className="w-full text-center">Login</span>
</Button>
                </li>
              </>
            )}
            {/* <li>
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 px-6 rounded-full transition-colors duration-500 ease-in-out"
                variant="primary"
                withGradientOverlay
                onClick={openSignupModal}
              >
                Sign Up
              </Button>
            </li>
            <li>
              <Button
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 py-3 px-6 rounded-full transition-colors duration-500 ease-in-out"
                variant="primary"
                withGradientOverlay
                onClick={openSignupModal}
              >
                Sign Up
              </Button>
            </li> */}
          </ul>
        </nav>
      </div>
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

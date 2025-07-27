import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { cn } from "../../lib/utils";
import { useState } from "react";
import Modal from "../../components/ui/Modal";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm.tsx";

const links = [
  { name: "Why", href: "/why" },
  // { name: "What", href: "/what" },
  { name: "About", href: "/about" },
  { name: "Directory", href: "/directory" },
  { name: "Social", href: "/social" },
];

export default function NavLinks({ className }: { className?: string }) {
  const [activeModal, setActiveModal] = useState<"signup" | "login" | null>(
    null
  );

  const navigate = useNavigate()

  const openSignupModal = () => navigate("/sign-up");
  const openLoginModal = () => navigate("/log-in");
  const closeModal = () => setActiveModal(null);

  const completed_step = localStorage.getItem("completed_step"); 
  const showDashboardButton = completed_step === "1" || completed_step === "2";
  const personOrganization = localStorage.getItem("person_organization");
  const showSocialLink = personOrganization === "1";

  // Filter links based on conditions
  const filteredLinks = links.filter(link => {
    if (link.name === "Social") {
      return showSocialLink;
    }
    return true;
  });

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={cn("flex items-center gap-8", className)}
      >
        <ul className="flex space-x-8">
          {filteredLinks.map((link) => (
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
        <div className="flex gap-4">
          {showDashboardButton ? (
            <Link to="/dashboard">
              <Button
                variant="gradient-primary"
                className="rounded-[100px] py-3 px-8 self-stretch transition-colors duration-500 ease-in-out"
              >
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Button 
              variant="white-outline"   
              className="w-[104px] h-[39px] rounded-[100px] p-0
    font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
    flex items-center justify-center"
              onClick={openSignupModal}>
                <span className="relative top-[0.5px]">Sign Up</span>
              </Button>
              
              <Button
                variant="gradient-primary"
               className="w-[104px] h-[39px] rounded-[100px] p-0
    font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
    flex items-center justify-center"
                onClick={openLoginModal}
              >
 <span className="relative top-[0.5px]">Login</span>
               </Button>
            </>
          )}
        </div>
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
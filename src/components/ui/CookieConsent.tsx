import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if consent was already given via cookie
    const consentGiven = Cookies.get("cookieConsent") === "accepted";
    if (!consentGiven) {
      setActiveModal("cookiemodal");
    }
    return () => setMounted(false);
  }, []);

  const handleAccept = () => {
    if (mounted) {
      Cookies.set("cookieConsent", "accepted", { expires: 365, path: '/' });
      setActiveModal(null);
    }
  };

  const handleDecline = () => {
    if (mounted) {
      Cookies.set("cookieConsent", "declined", { expires: 365, path: '/' });
      setActiveModal(null);
    }
  };

  const closeModal = () => {
    if (mounted) {
      setActiveModal(null);
    }
  };

  if (!mounted) return null;

  return (
    <Modal isOpen={activeModal === "cookiemodal"} onClose={closeModal}>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-2">Cookie Policy</h2>
        <p className="mb-4">
          We use cookies to enhance your experience on our website. By
          continuing to browse, you agree to our use of cookies.
        </p>
        <div className="flex justify-end gap-4 mt-4">
          <Button 
            type="button" 
            variant="white-outline" 
            onClick={handleDecline}
          >
            Decline
          </Button>
          <Button 
            type="button"
            variant="gradient-primary"
            className="rounded-full py-3 px-8 transition-all" 
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CookieConsent;
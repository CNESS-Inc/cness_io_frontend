import { useState, useEffect } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Cookies from "js-cookie";

const CookieConsent = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consentGiven = Cookies.get("cookieConsent") === "accepted";
    if (!consentGiven) {
      setActiveModal("cookiemodal");
    }
    return () => setMounted(false);
  }, []);

  const handleAccept = () => {
    if (mounted) {
      Cookies.set("cookieConsent", "accepted", { expires: 365, path: "/" });
      setActiveModal(null);
    }
  };

  const handleDecline = () => {
    if (mounted) {
      Cookies.set("cookieConsent", "declined", { expires: 365, path: "/" });
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
    <Modal isOpen={activeModal === "cookiemodal"} onClose={closeModal} position="bottom">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-2">Cookie Policy</h2>
              <p className="text-sm">
                We use cookies to enhance your experience on our website. By
                continuing to browse, you agree to our use of cookies.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="white-outline"
                size="sm"
                onClick={handleDecline}
              >
                Decline
              </Button>
              <Button
                type="button"
                variant="gradient-primary"
                size="sm"
                onClick={handleAccept}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CookieConsent;

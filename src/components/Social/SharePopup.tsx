import React from "react";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebook,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

interface SharePopupProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const SharePopup: React.FC<SharePopupProps> = ({
  isOpen,
  url,
  position = "bottom",
  className = "",
}) => {
  const shareUrl = url || `https://dev.cness.io/directory/user-profile/${localStorage.getItem("Id")}`;

  if (!isOpen) return null;

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-0 mb-2";
      case "bottom":
        return "top-full left-0 mt-2";
      case "left":
        return "right-full top-0 mr-2";
      case "right":
        return "left-full top-0 ml-2";
      default:
        return "top-full left-0 mt-2";
    }
  };

  return (
    <div
      className={`absolute ${getPositionClasses()} bg-white shadow-lg rounded-lg p-3 z-10 ${className}`}
    >
      <ul className="flex items-center gap-4">
        <li>
          <FacebookShareButton url={shareUrl}>
            <FaFacebook size={32} color="#4267B2" />
          </FacebookShareButton>
        </li>
        <li>
          <LinkedinShareButton url={shareUrl}>
            <FaLinkedin size={32} color="#0077B5" />
          </LinkedinShareButton>
        </li>
        <li>
          <TwitterShareButton url={shareUrl}>
            <FaTwitter size={32} color="#1DA1F2" />
          </TwitterShareButton>
        </li>
        <li>
          <WhatsappShareButton url={shareUrl}>
            <FaWhatsapp size={32} color="#25D366" />
          </WhatsappShareButton>
        </li>
      </ul>
    </div>
  );
};

export default SharePopup;
// src/components/Footer.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../../components/ui/Image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import BackToTopButton from "./BackToTop";
import vector from "../../assets/Vector.svg";
import ContentModal from "../../components/ui/ContentModal";

const Footer = () => {
  const [showTermModal, setShowTermModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [content, setContent] = useState("");
  const [privacyContent, privacySetContent] = useState("");
  const userId = localStorage.getItem("Id");

  useEffect(() => {
    fetch("/terms and conditions new.html")
      .then((res) => res.text())
      .then((data) => setContent(data));
  }, []);
  useEffect(() => {
    fetch("/CNESS privacy policy.htm")
      .then((res) => res.text())
      .then((data) => privacySetContent(data));
  }, []);

  return (
    <>
      <BackToTopButton />

      {/* Top Section */}
      <footer
        className="bg-[#F7F7F7] text-black py-6 md:py-12 px-4 sm:px-6 lg:px-8"
        style={{
          marginLeft: "var(--sidebar-w, 0px)",
          width: "calc(100% - var(--sidebar-w, 0px))",
        }}
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-12">
            {/* Logo + Description */}
            <div className="w-full lg:w-2/5 space-y-4">
              <Link to="/" className="flex items-center" aria-label="Home">
                <Image
                  src="https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd"
                  alt="Company Logo"
                  width={144}
                  className="hidden lg:block h-auto w-36"
                />
                <Image
                  src="/responsive-logo.png"
                  alt="Company Logo"
                  width={80}
                  height={45}
                  className="block lg:hidden h-auto w-auto max-w-20"
                />
              </Link>
              <p className="text-sm md:text-base font-normal font-openSans leading-relaxed text-[#1E1E1E] mt-2 md:mt-0">
                CNESS LIFE Conscious Social Media Super App.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 lg:gap-16 w-full lg:w-3/5">
              {/* Quick Links */}
              <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
                <h4 className="text-sm md:text-base lg:text-lg font-semibold text-[#6F74DD] poppins">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  {[
                    { to: `/dashboard/userprofile/${userId}`, label: "Profile" },
                    {
                      to: "/dashboard/assesmentcertification",
                      label: "Certification",
                    },
                    { to: "/dashboard/DashboardDirectory", label: "Directory" },
                    { to: "/dashboard/bestpractices", label: "Best Practices" },
                    { to: "/dashboard/feed", label: "Social" },
                  ].map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className="text-sm md:text-base font-openSans text-gray-700 hover:text-[#6F74DD] transition-colors duration-200"
                        onClick={() =>
                          window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social Links */}
              <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
                <h4 className="text-sm md:text-base lg:text-lg font-semibold text-[#6F74DD] poppins">
                  Follow Us
                </h4>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://www.facebook.com/share/1A8V21L6Qj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm md:text-base font-openSans text-gray-700 hover:text-[#6F74DD] transition-colors duration-200"
                    >
                      <FaFacebookF className="mr-2 w-4 h-4" /> Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/CnessInc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm md:text-base font-openSans text-gray-700 hover:text-[#6F74DD] transition-colors duration-200"
                    >
                      <img 
                        src={vector} 
                        alt="X" 
                        className="w-4 h-4 mr-2" 
                      /> 
                      X
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/cness.inc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm md:text-base font-openSans text-gray-700 hover:text-[#6F74DD] transition-colors duration-200"
                    >
                      <FaInstagram className="mr-2 w-4 h-4" /> Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@CNESSinc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm md:text-base font-openSans text-gray-700 hover:text-[#6F74DD] transition-colors duration-200"
                    >
                      <FaYoutube className="mr-2 w-4 h-4" /> YouTube
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[#373578] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile layout - Stacked */}
          <div className="flex flex-col gap-4 items-center lg:hidden">
            <div className="text-white text-sm font-medium font-[Plus Jakarta Sans] text-center">
              © {new Date().getFullYear()} Cness Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-white font-semibold">
              <button
                onClick={() => setShowTermModal(true)}
                className="text-sm hover:opacity-80 transition-opacity"
              >
                Terms & Conditions
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-sm hover:opacity-80 transition-opacity"
              >
                Privacy Policy
              </button>
            </div>
          </div>
          
          {/* Desktop layout - Side by side */}
          <div className="hidden lg:flex justify-between items-center gap-4">
            <div className="text-white text-base font-medium font-[Plus Jakarta Sans]">
              © {new Date().getFullYear()} Cness Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-8 text-white font-semibold">
              <button
                onClick={() => setShowTermModal(true)}
                className="text-base hover:opacity-80 transition-opacity"
              >
                Terms & Conditions
              </button>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="text-base hover:opacity-80 transition-opacity"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Term & condition Modal */}
      <ContentModal
        isOpen={showTermModal}
        onClose={() => setShowTermModal(false)}
      >
        <div className="p-0 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw]">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-black mb-4 text-center px-4">
            CNESS TERMS AND CONDITIONS
          </h3>
          <div
            className="bg-white bg-opacity-90 backdrop-blur-lg p-4 sm:p-6 rounded-lg w-full max-h-[60vh] sm:max-h-[70vh] overflow-y-auto content-container"
            style={{
              fontFamily: "'Open Sans', 'Poppins', sans-serif",
              fontSize: "14px sm:text-base",
              textAlign: "justify",
              lineHeight: "1.6",
              color: "#333",
            }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </ContentModal>
      
      {/* Privacy Policy Modal */}
      <ContentModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      >
        <div className="p-0 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw]">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-medium text-black mb-4 text-center px-4">
            CNESS PRIVACY POLICY
          </h3>
          <div
            className="bg-white bg-opacity-90 backdrop-blur-lg p-4 sm:p-6 rounded-lg w-full max-h-[60vh] sm:max-h-[70vh] overflow-y-auto content-container"
            style={{
              fontFamily: "'Open Sans', 'Poppins', sans-serif",
              fontSize: "14px sm:text-base",
              textAlign: "justify",
              lineHeight: "1.6",
              color: "#333",
            }}
            dangerouslySetInnerHTML={{ __html: privacyContent }}
          />
        </div>
      </ContentModal>
    </>
  );
};

export default Footer;
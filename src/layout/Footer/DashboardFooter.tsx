// src/components/Footer.jsx
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Image from "../../components/ui/Image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import BackToTopButton from "./BackToTop";
import vector from "../../assets/Vector.svg";
import ContentModal from "../../components/ui/ContentModal";
//import cnessicon from "../../assets/cnessi1.svg";

const Footer = () => {
 const [showTermModal, setShowTermModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [content, setContent] = useState("");
  const [privacyContent, privacySetContent] = useState("");

  
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
        className="bg-[#F7F7F7] text-black py-8 md:py-12 px-4 sm:px-6"
        style={{
          marginLeft: "var(--sidebar-w, 0px)",
          width: "calc(100% - var(--sidebar-w, 0px))",
        }}
      >
        <div className="w-full max-w-7xl mx-auto flex flex-row flex-wrap justify-between gap-8">
          {/* Logo + Description */}
          <div className="md:w-2/5 space-y-4">
            <Link to="/" className="flex items-center" aria-label="Home">
              <Image
                src="https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd"
                alt="Company Logo"
                width={144}
                className="hidden md:block h-auto w-[144px]"
              />
              <Image
                src="/responsive-logo.png"
                alt="Company Logo"
                width={120}
                className="block md:hidden h-auto max-w-[50px] w-auto"
              />
            </Link>
            <p className="text-[16px] font-[400] font-openSans leading-[160%] text-[#1E1E1E] hidden md:block">
Your global conscious hub where social connection,<br/> meaningful commerce, and community growth come together.

            </p>
          </div>

          {/* Quick Links */}
          <div className="md:w-1/5 space-y-3">
            <h4 className="text-[14px] md:text-lg font-semibold text-[#6F74DD] poppins">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { to: "/ecosystem", label: "Ecosystem" },
                { to: "/social", label: "Social" },
                { to: "/certifications", label: "Certification" },
                { to: "/premium", label: "Premium" },
                { to: "/whycness", label: "Why CNESS" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-[15px] font-openSans hover:underline"
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
          <div className="md:w-1/5 space-y-3">
            <h4 className="text-[14px] md:text-lg font-semibold text-[#6F74DD] poppins">
              Follow Us
            </h4>
            <ul className="space-y-2">

               {/*<li>
                    <a
                      href=""
                      className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <img src={cnessicon} alt="cnessicon"className="me-1 md:me-1  sm:me-2 w-5 h-5 object-contain "></img>
                      CNESS
                    </a>
                  </li> */}
              <li>
                <a
                  href="https://www.facebook.com/share/1A8V21L6Qj"
                  className="flex items-center text-[15px] font-openSans hover:underline"
                >
                  <FaFacebookF className="mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/CnessInc"
                  className="flex items-center text-[15px] font-openSans hover:underline"
                >
                  <img src={vector} alt="X" className="w-4 h-4 mr-2" /> X
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/cness.inc"
                  className="flex items-center text-[15px] font-openSans hover:underline"
                >
                  <FaInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@CNESSinc"
                  className="flex items-center text-[15px] font-openSans hover:underline"
                >
                  <FaYoutube className="mr-2" /> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Bottom Bar */}
            <div className="py-4 lg:bg-[#373578] md:bg-[#373578] bg-[#fff] px-4 sm:px-6">

        <div className="max-w-7xl mx-auto lg:flex flex-col md:flex-row justify-between items-center gap-2 hidden">
          {/* Left Side */}
          <div
            className="text-[15px] leading-[100%] font-[500] font-[Plus Jakarta Sans] text-white"
            style={{
              letterSpacing: "-0.2px",
              fontStyle: "normal",
            }}
          >
            © {new Date().getFullYear()} Cness Inc. All rights reserved.
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-6 text-white font-semibold text-[15px]">
             <button
              onClick={() => setShowTermModal(true)}
              className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

       {/* Term & condition Modal */}
            <ContentModal
              isOpen={showTermModal}
              onClose={() => setShowTermModal(false)}
            >
              <div className="p-0 lg:min-w-[450px] md:min-w-[450px] min-w-[300px]">
                <h3 className="lg:text-[36px] md:text-[30] text-[24px] font-[500] text-black mb-4 text-center">
                  CNESS TERMS AND CONDITIONS
                </h3>
                <div
                  className="bg-white bg-opacity-90 backdrop-blur-lg lg:p-6 p-0 rounded-lg w-full max-w-7xl max-h-[500px] overflow-y-auto content-container"
                  style={{
                    fontFamily: "'Open Sans', 'Poppins', sans-serif",
                    fontSize: "16px",
                    textAlign: "justify",
                    lineHeight: "1.6",
                    color: "#333",
                  }}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </ContentModal>
            <ContentModal
              isOpen={showPrivacyModal}
              onClose={() => setShowPrivacyModal(false)}
            >
              <div className="p-0 lg:min-w-[450px] md:min-w-[450px] min-w-[300px]">
                <h3 className="lg:text-[36px] md:text-[30] text-[24px] font-[500] text-black mb-4 text-center">
                  CNESS PRIVACY POLICY
                </h3>
                <div
                  className="bg-white bg-opacity-90 backdrop-blur-lg lg:p-6 p-0 rounded-lg w-full max-w-7xl max-h-[500px] overflow-y-auto content-container"
                  style={{
                    fontFamily: "'Open Sans', 'Poppins', sans-serif",
                    fontSize: "16px",
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

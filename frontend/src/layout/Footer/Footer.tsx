// src/components/Footer.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Image from "../../components/ui/Image";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaYoutube,
} from "react-icons/fa";
import BackToTopButton from "./BackToTop";
import vector from "../../assets/Vector.svg";
import ContentModal from "../../components/ui/ContentModal";
//import cnessicon from "../../assets/cnessi1.svg";
const Footer = () => {
  const [showTermModal, setShowTermModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [content, setContent] = useState("");
  const [privacyContent, privacySetContent] = useState("");
const [showCommunityModal, setShowCommunityModal] = useState(false);
const [communityContent, setCommunityContent] = useState("");

  useEffect(() => {
    fetch("/cness_terms_latest.html")
      .then((res) => res.text())
      .then((data) => setContent(data));
  }, []);
  useEffect(() => {
    fetch("/cness_privacy_latest.html")
      .then((res) => res.text())
      .then((data) => privacySetContent(data));
  }, []);

useEffect(() => {
  fetch("/community_guideline_latest.html")
    .then((res) => res.text())
    .then((data) => setCommunityContent(data));
}, []);

useEffect(() => {
  if (!showTermModal) return;

  const timer = setTimeout(() => {
    // Privacy
    const privacyLinks = document.querySelectorAll(".open-privacy");
    privacyLinks.forEach((el) => {
      const link = el as HTMLElement;
      link.onclick = (e: MouseEvent) => {
        e.preventDefault();
        setShowTermModal(false);
        setShowPrivacyModal(true);
      };
    });

    // Community Guidelines
    const communityLinks = document.querySelectorAll(".open-community");
    communityLinks.forEach((el) => {
      const link = el as HTMLElement;
      link.onclick = (e: MouseEvent) => {
        e.preventDefault();
        setShowTermModal(false);
        setShowCommunityModal(true);
      };
    });
 const termsLinks = document.querySelectorAll(".open-termsandconditions");
    termsLinks.forEach((el) => {
      const link = el as HTMLElement;
      link.onclick = (e: MouseEvent) => {
        e.preventDefault();
        //setShowTermModal(false);
        setShowTermModal(true);
      };
    });
    
  }, 50);

  return () => {
    clearTimeout(timer);

    document.querySelectorAll(".open-privacy").forEach((el) => {
      (el as HTMLElement).onclick = null;
    });

    document.querySelectorAll(".open-community").forEach((el) => {
      (el as HTMLElement).onclick = null;
    });
  };
}, [showTermModal]);

  return (
    <>
      <BackToTopButton />
      <footer className="bg-[#F7F7F7] text-black py-8 md:py-12 px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-6">
          {/* Main description - full width on mobile, then 2/5 on md+ */}
          <div className="lg:col-span-4 md:col-span-3 col-span-1 space-y-4">
            <Link to="/" className="flex items-center" aria-label="Home">
              <Image
                src="https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd"
                alt="Company Logo"
                width={120}
                className="h-auto w-[120px] md:w-[144.16px] lg:block md:block hidden"
              />
              <Image
                src="/responsive-logo.png"
                alt="Company Logo"
                width={30}
                className="h-auto w-[120px] md:w-[144.16px] lg:hidden md:hidden block"
              />
            </Link>
            <p className="text-[16px] font-normal font-openSans leading-[160%] text-[#1E1E1E] lg:block md:block hidden">
              CNESS LIFE Conscious Social Media Super App.
            </p>
          </div>
          <div className="col-span-8  sm:col-span-3 md:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* Quick Links section */}
              <div className="w-fit space-y-3 md:space-y-4 ">
                <h4 className="lg:text-base md:text-lg text-[14px]  font-semibold text-[#6F74DD] font-[poppins]">
                  Quick Links
                </h4>
                <ul className="space-y-1 md:space-y-2">
                  <li>
                    <Link
                      to="/ecosystem"
                      className="text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Ecosystem
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/social"
                      className="text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Social
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/certifications"
                      className="text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Certification
                    </Link>
                  </li>
                  {/*<li>
                    <Link
                      to="/premium"
                      className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Premium
                    </Link>
                  </li>*/}
                  <li>
                    <Link
                      to="/whycness"
                      className="text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Why CNESS
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cness-marketplace"
                      className="text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                      onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }
                    >
                      Become a seller
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Links section - full width on small mobile, then normal */}
              <div className="w-fit sm:col-span-1 space-y-3 md:space-y-4">
                <h4 className="lg:text-base md:text-lg text-[14px]  font-semibold text-[#6F74DD] font-[poppins]">
                  Follow Us
                </h4>
                <ul className="space-y-1 md:space-y-2">
                  {/* <li>
                    <a
                      href=""
                      className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <img src={cnessicon} alt="cnessicon"className="me-1 md:me-2  sm:me-2 w-5 h-5 object-contain "></img>
                      CNESS
                    </a>
                  </li> */}

                  <li>
                    <a
                      href="https://www.facebook.com/share/1A8V21L6Qj"
                      target="_blank"
                      className="flex items-center text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaFacebookF className="me-2 md:me-3" />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/CnessInc"
                      target="_blank"
                      className="flex items-center text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <img
                        src={vector}
                        alt="X"
                        className="w-4 h-4 me-2 md:me-3"
                      />
                      X
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.instagram.com/cness.inc"
                      target="_blank"
                      className="flex items-center text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaInstagram className="me-2 md:me-3" />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@CNESSinc"
                      target="_blank"
                      className="flex items-center text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaYoutube className="me-2 md:me-3" />
                      YouTube
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact section  */}
              <div className="space-y-3 md:space-y-4 md:-ml-4 lg:-ml-8">
                <h4 className="lg:text-base md:text-lg text-[14px] font-semibold text-[#6F74DD] font-[poppins]">
                  Contact Us
                </h4>
                <ul className="space-y-1 md:space-y-2">
                  <li>
                    <a
                      href="https://maps.google.com/?q=825+Wilshire+Blvd+%23333,+Santa+Monica,+CA+90401,+USA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline whitespace-normal"
                    >
                      <FaMapMarkerAlt className="me-2 md:me-3 mt-1" />
                      825 Wilshire Blvd #333, Santa Monica, CA 90401, USA.
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:Support@cness.io"
                      target="_blank"
                      className="flex items-center text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaEnvelope className="me-2 md:me-3" />
                      Support@cness.io
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+1456334445"
                      target="_blank"
                      className="flex items-center text-[16px] leading-[160%] font-normal font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaPhoneAlt className="me-2 md:me-3" />
                      +1 456 334 445
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom section */}
      <div className="py-4 lg:bg-[#373578] md:bg-[#373578] bg-white px-4 sm:px-6">
        <div className="max-w-7xl mx-auto lg:flex flex-col md:flex-row justify-between items-center gap-2 hidden">
          <div
            className="text-[15px] leading-[100%] font-medium font-[Plus Jakarta Sans] text-white"
            style={{
              letterSpacing: "-0.2px",
              fontStyle: "normal",
            }}
          >
            © {new Date().getFullYear()} Cness Inc. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-between gap-4 md:gap-16 lg:gap-24">
            {/* <Link to="/terms-and-conditions" className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white">
              Terms & Conditions
            </Link> */}
            <button
              onClick={() => setShowTermModal(true)}
              className="text-[15px] leading-[100%] font-semibold font-[Plus Jakarta Sans] text-white"
            >
              Terms & Conditions
            </button>
            {/* <Link to="/privacy-policy" className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white">
              Privacy Policy
            </Link> */}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-[15px] leading-[100%] font-semibold font-[Plus Jakarta Sans] text-white"
            >
              Privacy Policy
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto lg:hidden flex flex-row  justify-between items-center gap-2">
          <p className="text-xs md:text-sm jakarta font-semibold">
            © {new Date().getFullYear()} Cness Inc. All rights reserved.
          </p>
          {/* <Link to="/terms-and-conditions" className="text-xs md:text-sm hover:underline jakarta font-semibold">
              Terms & Conditions
            </Link> */}
          <button
            onClick={() => setShowTermModal(true)}
            className="text-xs md:text-sm hover:underline jakarta font-semibold"
          >
            Terms & Conditions
          </button>
          {/* <Link to="/privacy-policy" className="text-xs md:text-sm hover:underline jakarta font-semibold">
              Privacy Policy
            </Link> */}
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="text-xs md:text-sm hover:underline jakarta font-semibold"
          >
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Term & condition Modal */}
      <ContentModal
        isOpen={showTermModal}
        onClose={() => setShowTermModal(false)}
      >
        <div className="p-0 lg:min-w-[450px] md:min-w-[450px] min-w-[300px]">
          <h3 className="lg:text-[36px] md:text-[30] text-[24px] font-medium text-black mb-4 text-center">
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
          <h3 className="lg:text-[36px] md:text-[30] text-[24px] font-medium text-black mb-4 text-center">
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

      <ContentModal
  isOpen={showCommunityModal}
  onClose={() => setShowCommunityModal(false)}
>
  <div className="p-0 min-w-[300px] lg:min-w-[450px]">
    <h3 className="text-[24px] md:text-[30px] lg:text-[36px] font-medium text-black mb-4 text-center">
      CNESS COMMUNITY GUIDELINES &  CODE OF CONDUCT
    </h3>
    <div
 className="bg-white bg-opacity-90 backdrop-blur-lg lg:p-6 p-0 rounded-lg w-full max-w-7xl max-h-[500px] overflow-y-auto content-container"
            style={{
              fontFamily: "'Open Sans', 'Poppins', sans-serif",
              fontSize: "16px",
              textAlign: "justify",
              lineHeight: "1.6",
              color: "#333",
            }}      dangerouslySetInnerHTML={{ __html: communityContent }}
    />
  </div>
</ContentModal>
    </>
  );
};

export default Footer;

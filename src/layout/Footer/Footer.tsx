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
      <footer className="bg-[#F7F7F7] text-black py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto lg:flex md:grid flex justify-between lg:grid-cols-2 grid-cols-2 md:grid-cols-5 lg:gap-6 md:gap-8 gap-2">
          {/* Main description - full width on mobile, then 2/5 on md+ */}
          <div className="lg:col-span-2 lg:w-[40%] md:col-span-2  space-y-4">
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
            <p className="text-[16px] font-[400] font-openSans leading-[160%] text-[#1E1E1E] lg:block md:block hidden">
              CNESS is a consciousness-based certification and <br />
              growth platform designed to empower purpose-
              <br /> driven individuals and organizations.
            </p>
          </div>
          <div className="col-span-2 lg:w-[25%] md:w-[50%] w-[75%]  sm:col-span-3 md:col-span-3 space-y-4">
            <div className="flex justify-between gap-6 md:gap-8">
              {/* About section 
              <div className="w-fit space-y-3 md:space-y-4">
                <h4 className="lg:text-base md:text-lg text-[14px] font-semibold text-[#6F74DD] poppins">Company</h4>
                <ul className="space-y-1 md:space-y-2">
                  <li><a href="/sign-up" className="text-[13px] md:text-base hover:underline openSans">Try CNESS</a></li>
                  <li><Link to="/comingsoon" className="text-[13px] md:text-base hover:underline openSans">Marketplace</Link></li>
                  <li><Link to="/comingsoon" className="text-[13px] md:text-base hover:underline openSans">Community</Link></li>
                  <li><a href="/about" className="text-[13px] md:text-base hover:underline openSans">About</a></li>
                </ul>
              </div>*/}

              {/* Quick Links section */}
              <div className="w-fit space-y-3 md:space-y-4 ">
                <h4 className="lg:text-base md:text-lg text-[14px]  font-semibold text-[#373578] poppins">
                  Quick Links
                </h4>
                <ul className="space-y-1 md:space-y-2">
                  <li>
                    <Link
                      to="/ecosystem"
                      className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
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
                      className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
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
                      className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
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
                      className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
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
                      className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
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
                <h4 className="lg:text-base md:text-lg text-[14px]  font-semibold text-[#373578] poppins">
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
                      className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaFacebookF className="me-2 md:me-3" />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://x.com/CnessInc"
                      className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
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
                      className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaInstagram className="me-2 md:me-3" />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.youtube.com/@CNESSinc"
                      className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"
                    >
                      <FaYoutube className="me-2 md:me-3" />
                      YouTube
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom section */}
      <div className="py-4 lg:bg-[#373578] md:bg-[#373578] bg-[#fff] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto lg:flex flex-col md:flex-row justify-between items-center gap-2 hidden">
          <div
            className="text-[15px] leading-[100%] font-[500] font-[Plus Jakarta Sans] text-white"
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
              className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white"
            >
              Terms & Conditions
            </button>
            {/* <Link to="/privacy-policy" className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white">
              Privacy Policy
            </Link> */}
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="text-[15px] leading-[100%] font-[600] font-[Plus Jakarta Sans] text-white"
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

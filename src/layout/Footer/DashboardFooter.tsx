// src/components/Footer.jsx

import { Link } from "react-router-dom";
import Image from "../../components/ui/Image";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import BackToTopButton from "./BackToTop";
import vector from "../../assets/Vector.svg";

const Footer = () => {
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
                src="/cnesslogo.png"
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
              CNESS is a consciousness-based certification and growth platform
              designed to empower purpose-driven individuals and organizations.
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
      <div
        className="py-2 bg-[#373578] px-4 sm:px-6"
        style={{
          marginLeft: "var(--sidebar-w, 0px)",
          width: "calc(100% - var(--sidebar-w, 0px))",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
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
            <Link
              to="/terms-and-conditions"
              className="hover:underline whitespace-nowrap"
            >
              Terms &amp; Conditions
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:underline whitespace-nowrap"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;

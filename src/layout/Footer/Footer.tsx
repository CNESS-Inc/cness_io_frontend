// src/components/Footer.jsx

import { Link } from "react-router-dom";
import Image from "../../components/ui/Image";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import BackToTopButton from "./BackToTop";




const Footer = () => {
  return (
    <>
    
    <BackToTopButton/>
      <footer className="bg-[#F7F7F7] text-black py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto lg:flex md:grid flex justify-between lg:grid-cols-2 grid-cols-2 md:grid-cols-5 lg:gap-6 md:gap-8 gap-2">
          {/* Main description - full width on mobile, then 2/5 on md+ */}
          <div className="lg:col-span-2 lg:w-[40%] md:col-span-2  space-y-4">
            <Link to="/" className="flex items-center" aria-label="Home">
              <Image
                src="/logo.png"
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
            CNESS is a consciousness-based certification and <br />growth platform designed to empower purpose-
            <br /> driven individuals and organizations.
            </p>
          </div>
          <div className="col-span-2 lg:w-[25%]  sm:col-span-3 md:col-span-3 space-y-4">
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
                <h4 className="lg:text-base md:text-lg text-[14px]  font-semibold text-[#6F74DD] poppins">Quick Links</h4>
                <ul className="space-y-1 md:space-y-2">
                  <li><Link to="/" className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline"onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</Link></li>
                  <li><a href="/about" className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">About Us</a></li>
                   <li><a href="/directory" className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">Directory</a></li>
                  <li><a href="/sign-up" className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">Certifications</a></li>
                  <li><Link to="/comingsoon" className="text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">Career</Link></li>
                </ul>
              </div>

              {/* Social Links section - full width on small mobile, then normal */}
              <div className="w-fit sm:col-span-1 space-y-3 md:space-y-4">
                <h4 className="lg:text-base md:text-lg text-[14px]  font-semibold text-[#6F74DD] poppins">Follow Us</h4>
                <ul className="space-y-1 md:space-y-2">
                  <li>
                    <a href="https://www.facebook.com/share/1A8V21L6Qj" className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">
                      <FaFacebookF className="me-2 md:me-3" />
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a href="https://x.com/CnessInc" className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">
                      <FaTwitter className="me-2 md:me-3" />
                      X
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/cness.inc" className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">
                      <FaInstagram className="me-2 md:me-3" />
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youtube.com/@CNESSinc" className="flex items-center text-[16px] leading-[160%] font-[400] font-openSans text-[#1E1E1E] hover:underline">
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
      <div className="py-4 bg-[#C6C4FF] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto lg:flex flex-col md:flex-row justify-between items-center gap-2 hidden">
          <div
            className="text-[15px] leading-[100%] font-[500] font-[Plus Jakarta Sans] text-white"
            style={{
              letterSpacing: "-0.2px",
              fontStyle: "normal",
            }}
          >
            Copyright © {new Date().getFullYear()}
          </div>          
          <div className="flex flex-wrap justify-between gap-4 md:gap-16 lg:gap-24">

            <Link to="/terms-and-conditions" className="text-[15px] leading-[100%] font-[500] font-[Plus Jakarta Sans] text-white">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="text-[15px] leading-[100%] font-[500] font-[Plus Jakarta Sans] text-white">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto lg:hidden flex flex-row  justify-between items-center gap-2">
          <p className="text-xs md:text-sm jakarta font-semibold">Copyright © {new Date().getFullYear()}</p>
            <Link to="/terms-and-conditions" className="text-xs md:text-sm hover:underline jakarta font-semibold">
              Terms & Conditions
            </Link>
            <Link to="/privacy-policy" className="text-xs md:text-sm hover:underline jakarta font-semibold">
              Privacy Policy
            </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
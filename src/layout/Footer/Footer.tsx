// src/components/Footer.jsx

import { Link } from "react-router-dom";
import Image from "../../components/ui/Image";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-[#F7F7F7] text-black py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8">
          {/* Main description - full width on mobile, then 2/5 on md+ */}
          <div className="col-span-2 sm:col-span-3 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center" aria-label="Home">
              <Image
                src="/logo.png"
                alt="Company Logo"
                width={120}
                className="h-auto w-[120px] md:w-[144.16px]"
              />
            </Link>
            <p className="text-base md:text-xl font-semibold">
              The advantage of hiring a workspace with us is that gives you
              comfortable service and all-around facilities.
            </p>
          </div>

          {/* About section */}
          {/* <div className="col-span-1 space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-semibold">About</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/" className="text-sm md:text-base hover:underline">Company</Link></li>
              <li><Link to="/" className="text-sm md:text-base hover:underline">Benefits</Link></li>
              <li><Link to="/directory" className="text-sm md:text-base hover:underline">Directory</Link></li>
              <li><Link to="/" className="text-sm md:text-base hover:underline">Visionary Council</Link></li>
            </ul>
          </div> */}

          {/* Quick Links section */}
          <div className="col-span-1 space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-1 md:space-y-2">
              <li><Link to="/" className="text-sm md:text-base hover:underline">Home</Link></li>
              <li><Link to="/about" className="text-sm md:text-base hover:underline">About</Link></li>
              {/* <li><Link to="/" className="text-sm md:text-base hover:underline">Career</Link></li> */}
            </ul>
          </div>

          {/* Social Links section - full width on small mobile, then normal */}
          <div className="col-span-2 sm:col-span-1 space-y-3 md:space-y-4">
            <h4 className="text-base md:text-lg font-semibold">Follow Us</h4>
            <ul className="space-y-1 md:space-y-2">
              <li>
                <a href="#" className="flex items-center text-sm md:text-base hover:underline">
                  <FaFacebookF className="me-2 md:me-3" />
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm md:text-base hover:underline">
                  <FaTwitter className="me-2 md:me-3" />
                  X
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm md:text-base hover:underline">
                  <FaInstagram className="me-2 md:me-3" />
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center text-sm md:text-base hover:underline">
                  <FaYoutube className="me-2 md:me-3" />
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Bottom section */}
      <div className="py-4 bg-[#C6C4FF] px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xs md:text-sm">Copyright © {new Date().getFullYear()}</div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <a href="#" className="text-xs md:text-sm hover:underline">
              Terms & Conditions
            </a>
            <a href="#" className="text-xs md:text-sm hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
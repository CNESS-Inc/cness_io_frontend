import { useEffect, useState } from 'react';
import cnesslogo from "../assets/cnesslogo.png";
import SignupAnimation from "../components/ui/SignupAnimation";
import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch("/CNESS privacy policy.htm")
      .then((res) => res.text())
      .then((data) => setContent(data));
  }, []);

  return (
    <div className="relative w-full h-screen bg-animated">
      {/* Animated background */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <SignupAnimation />
      </div>

      {/* Logo */}
      <div className="fixed top-4 left-4 z-20">
        <Link to="/">
                      <img
                        src={cnesslogo}
                        alt="logo"
                        className="w-48 h-48 object-contain"
                      />
                    </Link>
      </div>

      {/* Terms content overlay */}
          <div className="flex items-center justify-center min-h-screen px-4 pt-30 pb-9 z-10 relative">
        <div
          className="bg-white bg-opacity-90 backdrop-blur-lg p-6 rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto shadow-xl"
          style={{
            fontFamily: "'Open Sans', 'Poppins', sans-serif",
            fontSize: "14px",
            textAlign: "justify",
            lineHeight: "1.6",
            color: "#333",
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default PrivacyPolicy;

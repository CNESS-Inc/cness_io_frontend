import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch("/terms and conditions new.html")
      .then((res) => res.text())
      .then((data) => setContent(data));
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-animated overflow-hidden">
      {/* Animated Background */}
      {/* <div className="absolute top-0 left-0 w-full h-full -z-10">
        <SignupAnimation />
      </div> */}

      {/* Logo */}
      <div className="fixed -top-8 left-4 z-20">
        <Link to="/">
          <img
            src={`https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd`}
            alt="logo"
            className="w-48 h-48 object-contain"
          />
        </Link>
      </div>

      {/* Terms Content */}
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

export default TermsAndConditions;

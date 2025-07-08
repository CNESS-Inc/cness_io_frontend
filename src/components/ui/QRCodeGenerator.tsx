import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

// Define props interface
interface QRCodeGeneratorProps {
  profileUrl: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ profileUrl }) => {
  const qrRef = useRef<HTMLDivElement>(null); // Explicitly type useRef

  // Download QR Code as an image
  const downloadQR = () => {
    if (!qrRef.current) return;

    const canvas = qrRef.current.querySelector("canvas");
    if (!canvas) {
      return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png"); // Convert QR code to PNG
    link.download = "profile-qr-code.png";
    link.click();
  };

  return (
    <div className="mt-3">
      {/* <h3 className='text-center'>My Profile QR Code</h3> */}
      <div ref={qrRef} className="flex justify-center">
        <QRCodeCanvas onClick={downloadQR} value={profileUrl} size={100} />
      </div>
      {/* <button className='w-full flex justify-center' onClick={downloadQR}>Download QR Code</button> */}

      <div style={{ marginTop: "20px" }}>
        {/* <h4 className='text-center'>Share Your Profile</h4> */}
        <div className="flex justify-center gap-3">
          <FacebookShareButton url={profileUrl}>
            <FaFacebook size={24} color="#4267B2" />
          </FacebookShareButton>

          <TwitterShareButton url={profileUrl}>
            <FaTwitter size={24} color="#1DA1F2" />
          </TwitterShareButton>

          <LinkedinShareButton url={profileUrl}>
            <FaLinkedin size={24} color="#0077B5" />
          </LinkedinShareButton>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;

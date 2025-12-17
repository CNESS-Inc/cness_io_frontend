import { useEffect, useState } from "react";
import url from "../../../assets/url.svg";
import file from "../../../assets/file.svg";
import socialmedia from "../../../assets/socialmedia.svg";
import frame from "../../../assets/bg-frame.png";
import cness from "../../../assets/cness.png";
import Button from "../../ui/Button";
import { AddPost, getUserBadgeDetails } from "../../../Common/ServerAPI";
import indv_aspiring from "../../../assets/indv_aspiring.svg";
import indv_inspired from "../../../assets/indv_inspired.svg";
import indv_leader from "../../../assets/indv_leader.svg";
import jsPDF from "jspdf";
import { IoCloseOutline } from "react-icons/io5";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaTwitter,
} from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  TwitterShareButton,
} from "react-share";
import { useToast } from "../../ui/Toast/ToastProvider";
import { useNavigate } from "react-router-dom";

export default function ShareModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isCnessPosting, setIsCnessPosting] = useState(false);
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");
  const [activeButton, setActiveButton] = useState<"btn1" | "btn2" | "btn3">(
    "btn1"
  );
  const [showTermModal, setShowTermModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [embedCodes, setEmbedCodes] = useState<string[]>([]);
  const [staticImageURL, setStaticImageURL] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const [certificationLevel, setCertificationLevel] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedRatio, setSelectedRatio] = useState("");
  const [logoScale, setLogoScale] = useState(100);
  const [isDownloading, setIsDownloading] = useState(false);

  const [copy, setCopy] = useState(false);
  const urldata = "your-url-here"; // Your actual URL
  const tweetText = "Your tweet text here"; // Your tweet text

  const fetchUserBadge = async () => {
    try {
      const res = await getUserBadgeDetails();
      const level = res.data.data.level;
      setCertificationLevel(res.data.data.slug);

      // Set image based on user level
      switch (level.toLowerCase()) {
        case "aspiring":
          setStaticImageURL(indv_aspiring);
          break;
        case "inspired":
          setStaticImageURL(indv_inspired);
          break;
        case "leader":
          setStaticImageURL(indv_leader);
          break;
        default:
          setStaticImageURL(indv_aspiring);
      }
    } catch (error) {
      console.error("Error fetching badge details:", error);
      setStaticImageURL(indv_aspiring);
    }
  };

  useEffect(() => {
    fetchUserBadge();
  }, []);

  useEffect(() => {
    if (!staticImageURL) return;

    const uniqueKey = Math.random().toString(36).substring(2, 15);
    const securedImageURL = `${staticImageURL}?authKey=${uniqueKey}`;
    const currentDomain = window.location.origin;

    // const rawHTML = `
    //   <div style='display: flex; align-items: center; font-family: sans-serif;'>
    //     <img src='${securedImageURL}' alt='Badge' style='width: 40px; height: 40px; border-radius: 50%;' />
    //   </div>
    // `;
    const rawHTML = `
    <div style="display: flex; align-items: center; font-family: sans-serif;">
      <img src="${currentDomain}${securedImageURL}" alt="Badge" style="width: 40px; height: 40px; border-radius: 50%;" />
    </div>
  `;

    const base64HTML = btoa(unescape(encodeURIComponent(rawHTML)));

    const iframeCode = `
      <iframe 
      srcdoc="<script>document.write(decodeURIComponent(escape(atob('${base64HTML}'))))</script>" 
      style="border: none; width: 60px; height: 60px;"></iframe>`.trim();

    const directHTMLCode = `
      <div style="display: flex; align-items: center; font-family: sans-serif;">
      <img 
          src="${currentDomain}${securedImageURL}"
          alt="Badge" 
          style="width: 40px; height: 40px; border-radius: 50%;" 
      />
      </div>`.trim();

    const scriptEmbedCode = `
      <div id="badge-container"></div>
      <script>
      (function () {
          var img = document.createElement("img");
          img.src = "${currentDomain}${securedImageURL}";
          img.alt = "Badge";
          img.style.width = "40px";
          img.style.height = "40px";
          img.style.borderRadius = "50%";
          document.getElementById("badge-container").appendChild(img);
      })();
      </script>`.trim();

    setEmbedCodes([iframeCode, directHTMLCode, scriptEmbedCode]);
  }, [staticImageURL]);

  const activeCode =
    activeButton === "btn1"
      ? embedCodes[0]
      : activeButton === "btn2"
        ? embedCodes[1]
        : embedCodes[2];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  const fileFormats = ["PNG", "JPEG", "PDF", "SVG"];
  const ratios = [
    { label: "1:1 (Square)", value: "1:1", width: 1080, height: 1080 },
    { label: "16:9 (Landscape)", value: "16:9", width: 1920, height: 1080 },
    { label: "9:16 (Portrait)", value: "9:16", width: 1080, height: 1920 },
    { label: "4:3 (Standard)", value: "4:3", width: 1440, height: 1080 },
  ];

  const tabs = [
    { id: "tab1", label: "Public URL", subText: "Shared and Embed", icon: url },
    { id: "tab2", label: "File", subText: "Format and Type", icon: file },
    {
      id: "tab3",
      label: "Social Media",
      subText: "Media and Post",
      icon: socialmedia,
    },
  ];

  const generateBadgeFile = async (): Promise<File> => {
    return new Promise<File>((resolve, reject) => {
      // 1. Create a canvas (fixed 1080x1080 square for social)
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return reject(new Error("Failed to create canvas context"));
      }

      // White background so it looks clean
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Load the badge image (your SVG or whatever staticImageURL points to)
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = staticImageURL;

      img.onload = () => {
        // Keep aspect ratio, fit into 80% of canvas
        const maxSize = canvas.width * 0.8; // 80% of width/height
        const scale = Math.min(maxSize / img.width, maxSize / img.height);

        const drawWidth = img.width * scale;
        const drawHeight = img.height * scale;

        const x = (canvas.width - drawWidth) / 2;
        const y = (canvas.height - drawHeight) / 2;

        ctx.drawImage(img, x, y, drawWidth, drawHeight);

        // 3. Export as PNG blob
        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error("Failed to create badge image blob"));
          }

          // 4. Wrap in a File so it behaves just like the upload in CreatePostModal
          const file = new File([blob], "cness-badge.png", {
            type: "image/png",
          });
          resolve(file);
        }, "image/png");
      };

      img.onerror = () => {
        reject(new Error("Failed to load badge image"));
      };
    });
  };

  const handleShareToCness = async () => {
    if (!staticImageURL) {
      showToast({
        message: "Unable to find your badge image. Please try again.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setIsCnessPosting(true);

      const badgeFile = await generateBadgeFile();

      const level =
        certificationLevel === "aspiring"
          ? "AspiredCertification"
          : certificationLevel === "inspired"
            ? "InspiredCertification"
            : certificationLevel === "leader"
              ? "LeaderCertification"
              : "";

      const formData = new FormData();
      formData.append(
        "content",
        `I just earned my CNESS badge! 🎉 #CNESS #${level}`
      );
      formData.append("file", badgeFile);

      const response = await AddPost(formData);

      if (response?.data?.data) {
        showToast({
          message: "Shared your badge to CNESS successfully!",
          type: "success",
          duration: 3000,
        });

        // Close the share modal
        onClose();

        navigate("/dashboard/feed");
      } else {
        showToast({
          message: "Something went wrong while sharing your badge.",
          type: "error",
          duration: 4000,
        });
      }
    } catch (error: any) {
      console.error("Failed to share badge to CNESS:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to share your badge. Please try again.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsCnessPosting(false);
    }
  };


  const buttons = [
    { id: "btn1", label: "Iframe Embed Code" },
    { id: "btn2", label: "Direct HTML Code" },
    {
      id: "btn3",
      label: "Script Embed Code",
    },
  ];

  const socialMedia = [
    {
      id: "cness",
      component: null,
      icon: cness,
      color: "",
    },
    {
      id: "facebook",
      component: FacebookShareButton,
      icon: FaFacebook,
      color: "#4267B2",
    },
    {
      id: "linkedin",
      component: LinkedinShareButton,
      icon: FaLinkedin,
      color: "#0077B5",
    },
    {
      id: "instagram",
      component: null, // Instagram doesn't have a direct share button
      icon: FaInstagram,
      color: "#C13584",
    },
    {
      id: "whatsapp",
      component: WhatsappShareButton,
      icon: FaWhatsapp,
      color: "#25D366",
    },
    {
      id: "twitter",
      component: TwitterShareButton,
      icon: FaTwitter,
      color: "#1DA1F2",
    },
  ];

  // Download handler
  const handleDownload = async () => {
    if (!selectedFormat) {
      alert("Please select a file format");
      return;
    }

    if (!selectedRatio) {
      alert("Please select an aspect ratio");
      return;
    }

    setIsDownloading(true);

    try {
      const ratio = ratios.find((r) => r.value === selectedRatio);
      if (!ratio) {
        alert("Invalid ratio selected");
        setIsDownloading(false);
        return;
      }

      // Create a canvas with the exact dimensions user selected
      const canvas = document.createElement("canvas");
      canvas.width = ratio.width;
      canvas.height = ratio.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert("Failed to create canvas");
        setIsDownloading(false);
        return;
      }

      // Only add background for JPEG and PDF (not PNG or SVG)
      const includeBackground =
        selectedFormat === "JPEG" || selectedFormat === "PDF";

      if (includeBackground) {
        // White background for JPEG and PDF
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const frameImg = new Image();
        frameImg.crossOrigin = "anonymous";

        await new Promise((resolve, reject) => {
          frameImg.onload = resolve;
          frameImg.onerror = reject;
          frameImg.src = frame;
        });

        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      }

      // Load and draw logo at center with user's selected scale
      const logoImg = new Image();
      logoImg.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = staticImageURL;
      });

      // Calculate logo dimensions based on user's scale
      const maxLogoWidth = canvas.width * 0.8;
      const maxLogoHeight = canvas.height * 0.8;

      const scaledWidth = maxLogoWidth * (logoScale / 100);
      const scaledHeight = maxLogoHeight * (logoScale / 100);

      const logoAspect = logoImg.width / logoImg.height;
      let finalWidth = scaledWidth;
      let finalHeight = scaledWidth / logoAspect;

      if (finalHeight > scaledHeight) {
        finalHeight = scaledHeight;
        finalWidth = scaledHeight * logoAspect;
      }

      const x = (canvas.width - finalWidth) / 2;
      const y = (canvas.height - finalHeight) / 2;

      ctx.drawImage(logoImg, x, y, finalWidth, finalHeight);

      // Download based on format
      const filename = `CNESS-Badge-${selectedRatio.replace(
        ":",
        "x"
      )}-${logoScale}%-${Date.now()}`;

      switch (selectedFormat) {
        case "PNG":
          // PNG with transparent background
          canvas.toBlob((blob) => {
            if (blob) {
              downloadBlob(blob, `${filename}.png`);
              setIsDownloading(false);
            }
          }, "image/png");
          break;

        case "JPEG":
          // JPEG with white background
          canvas.toBlob(
            (blob) => {
              if (blob) {
                downloadBlob(blob, `${filename}.jpeg`);
                setIsDownloading(false);
              }
            },
            "image/jpeg",
            0.95
          );
          break;

        case "PDF":
          // PDF with white background
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: ratio.width > ratio.height ? "landscape" : "portrait",
            unit: "px",
            format: [ratio.width, ratio.height],
          });
          pdf.addImage(imgData, "PNG", 0, 0, ratio.width, ratio.height);
          pdf.save(`${filename}.pdf`);
          setIsDownloading(false);
          break;

        case "SVG":
          // SVG with transparent background
          const svgCanvas = document.createElement("canvas");
          svgCanvas.width = ratio.width;
          svgCanvas.height = ratio.height;
          const svgCtx = svgCanvas.getContext("2d");

          if (svgCtx) {
            // Draw only the logo, no background
            svgCtx.drawImage(logoImg, x, y, finalWidth, finalHeight);

            const svgContent = `
              <svg xmlns="http://www.w3.org/2000/svg" width="${ratio.width
              }" height="${ratio.height}">
                <image href="${svgCanvas.toDataURL("image/png")}" width="${ratio.width
              }" height="${ratio.height}"/>
              </svg>
            `;
            const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
            downloadBlob(svgBlob, `${filename}.svg`);
          }
          setIsDownloading(false);
          break;
      }
    } catch (error: any) {
      console.error("Download failed:", error);
      alert(`Failed to download: ${error.message || "Unknown error"}`);
      setIsDownloading(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // File size estimation
  const getEstimatedSize = () => {
    const ratio = ratios.find((r) => r.value === selectedRatio);
    if (!ratio) return "Unknown";

    const pixels = ratio.width * ratio.height;

    switch (selectedFormat) {
      case "PNG":
        return `~${Math.round(((pixels * 3) / 1024 / 1024) * 10) / 10} MB`;
      case "JPEG":
        return `~${Math.round(((pixels * 0.5) / 1024 / 1024) * 10) / 10} MB`;
      case "PDF":
        return `~${Math.round(((pixels * 3) / 1024 / 1024) * 10) / 10} MB`;
      case "SVG":
        return `~${Math.round(((pixels * 0.1) / 1024 / 1024) * 10) / 10} MB`;
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6 bg-black/60"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white py-[18px] px-3 rounded-xl order border-[#ECEEF2] overflow-hidden animate-fadeIn"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="w-full h-[600px] ps-3 pe-3.5 py-[18px]">
          <div
            onClick={onClose}
            className="absolute top-4 right-3 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer border border-[#ECEEF2] shadow-[0px_0.56px_5.63px_0px_rgba(0,0,0,0.1)]"
          >
            <IoCloseOutline className="text-[#E1056D]" />
          </div>
          <div className="w-full h-full flex flex-col lg:flex-row gap-[18px]">
            <div className="w-full lg:w-[35%] h-fit lg:h-full border-r border-[#ECEEF2] pr-3 flex flex-col gap-[18px]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "tab1" | "tab2" | "tab3")
                  }
                  className={`flex items-center py-2 px-3 gap-3 rounded-xl transition-all duration-200 whitespace-nowrap
                   ${activeTab === tab.id
                      ? "bg-[#FAFAFA]"
                      : "bg-white hover:bg-[#FAFAFA]"
                    }`}
                >
                  <img
                    src={tab.icon}
                    alt={tab.label}
                    className="w-[34px] h-[34px]"
                  />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#0D0D12] font-['Poppins',Helvetica]">
                      {tab.label}
                    </p>
                    <p className="text-xs font-normal text-[#A0A0A0] font-['Open_Sans',Helvetica]">
                      {tab.subText}
                    </p>
                  </div>
                </button>
              ))}
            </div>
            {activeTab === "tab1" ? (
              <div className="w-full lg:w-[65%] h-full pb-10 lg:pb-0 flex flex-col gap-[18px]">
                <div className="grid md:grid-cols-3 gap-3 pb-3 border-b border-[#FAFAFA]">
                  {buttons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() =>
                        setActiveButton(btn.id as "btn1" | "btn2" | "btn3")
                      }
                      className={`relative flex items-center justify-center p-3 rounded-lg bg-[#FAFAFA4D] transition-all duration-200 whitespace-nowrap
                   ${activeButton === btn.id
                          ? "shadow-[0_0_10px_0_rgba(0,0,0,0.1)]"
                          : "bg-white hover:bg-[#FAFAFA]"
                        }`}
                    >
                      <p className="text-sm font-medium text-[#0D0D12] font-['Poppins',Helvetica]">
                        {btn.label}
                      </p>

                      {activeButton === btn.id && (
                        <span className="absolute bottom-[-13px] left-0 w-full h-0.5 bg-[#ECEEF2] rounded-t-sm"></span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <textarea
                    readOnly
                    value={activeCode || ""}
                    rows={6}
                    className="w-full font-normal text-xs font-['Poppins',Helvetica] border border-[#E2E8F0] rounded-lg shadow-[0_0_2px_0_rgba(0,0,0,0.1)] px-4 py-2"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none font-['Open_Sans',Helvetica]">
                    {/* Custom Checkbox */}
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                      className="peer hidden"
                    />
                    <span
                      className={`w-4 h-4 flex items-center justify-center border border-[#D0D5DD] rounded-sm transition-all
          ${checked
                          ? "border-[#E1056D] bg-[#E1056D]"
                          : "border-gray-300 bg-white"
                        } shadow-[0_0_2px_0_rgba(0,0,0,0.1)]`}
                    >
                      {checked && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </span>

                    {/* Text */}
                    <span className="text-[13px] leading-none font-semibold text-xs">
                      By Selecting Agree and continue below, I agree{" "}
                      <button
                        onClick={() => setShowTermModal(true)}
                        className="text-[#7077FE] hover:underline"
                      >
                        Terms of Services
                      </button>{" "}
                      <span className="text-[#3366FF">and</span>{" "}
                      <button
                        onClick={() => setShowPrivacyModal(true)}
                        className="text-[#3366FF] hover:underline"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                </div>
                <Button
                  onClick={handleCopy}
                  disabled={!checked || !activeCode}
                  variant="gradient-primary"
                  className="rounded-full w-full py-3 px-4 self-stretch transition-colors duration-500 ease-in-out"
                >
                  <span className="font-normal text-sm font-['Poppins',Helvetica]">
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </span>
                </Button>
              </div>
            ) : activeTab === "tab2" ? (
              <div className="w-full lg:w-[65%] h-full pb-10 lg:pb-0 flex flex-col gap-[18px]">
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                      File Format
                    </label>

                    <div className="relative group">
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-full appearance-none p-3 text-sm border border-[#CBD5E1] rounded-xl font-['Poppins',Helvetica] text-[#64748B]"
                      >
                        <option value="" disabled>
                          Select Format
                        </option>
                        {fileFormats.map((format) => (
                          <option key={format} value={format}>
                            {format}
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-700 border-l border-gray-300 h-fit top-1/2 -translate-y-1/2">
                        <svg
                          className="fill-current text-[#ccc] h-5 w-5 group-focus-within:text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.516 7.548L10 12.032l4.484-4.484L16 9.064l-6 6-6-6z" />
                        </svg>
                      </div>
                    </div>
                    {selectedFormat && (
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated size: {getEstimatedSize()}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                      Ratio
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedRatio}
                        onChange={(e) => setSelectedRatio(e.target.value)}
                        className="w-full appearance-none p-3 text-sm border border-[#CBD5E1] rounded-xl font-['Poppins',Helvetica] text-[#64748B]"
                      >
                        <option value="" disabled>
                          Select Ratio
                        </option>
                        {ratios.map((ratio) => (
                          <option key={ratio.value} value={ratio.value}>
                            {ratio.label} - {ratio.width}×{ratio.height}px
                          </option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-700 border-l border-gray-300 h-fit top-1/2 -translate-y-1/2">
                        <svg
                          className="fill-current text-[#ccc] h-5 w-5 group-focus-within:text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M5.516 7.548L10 12.032l4.484-4.484L16 9.064l-6 6-6-6z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                      Preview
                    </label>
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      {/* Background frame */}
                      <img
                        src={frame}
                        alt="Background Frame"
                        className="w-full h-full object-cover rounded-lg"
                      />

                      {/* Centered Logo */}
                      {staticImageURL && (
                        <img
                          id="badge-preview"
                          src={staticImageURL}
                          alt="Logo"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain transition-all duration-300"
                          style={{
                            width: `${logoScale}%`,
                            height: `${logoScale}%`,
                            maxWidth: "80%",
                            maxHeight: "80%",
                          }}
                        />
                      )}

                      {!staticImageURL && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm text-gray-400">
                            Unable to fetch user badge
                          </p>
                        </div>
                      )}

                      {/* Dropdown - Top Right */}
                      {staticImageURL && (
                        <div className="absolute top-3 right-3.5">
                          <div className="relative">
                            <select
                              value={logoScale}
                              onChange={(e) =>
                                setLogoScale(Number(e.target.value))
                              }
                              className="appearance-none px-2 py-1.5 pr-7 text-[10px] border border-[#ECEEF2] rounded-md font-['Poppins',Helvetica] text-[#0D0D12] bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.1)] cursor-pointer hover:border-[#7077FE] transition-colors"
                            >
                              <option value={100}>100%</option>
                              <option value={75}>75%</option>
                              <option value={50}>50%</option>
                            </select>

                            <div className="pointer-events-none absolute top-1/2 right-2 transform -translate-y-1/2">
                              <svg
                                className="w-3 h-3 text-[#94A3B8]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M5.516 7.548L10 12.032l4.484-4.484L16 9.064l-6 6-6-6z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  variant="gradient-primary"
                  className="rounded-full w-full py-3 px-4 self-stretch transition-colors duration-500 ease-in-out"
                >
                  <span className="font-normal text-sm font-['Poppins',Helvetica]">
                    {isDownloading ? "Downloading..." : `Download`}
                  </span>
                </Button>
              </div>
            ) : (
              <div className="w-full lg:w-[65%] h-full pb-10 lg:pb-0 flex flex-col gap-[18px]">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                    Social Media
                  </label>
                  <ul className="flex items-center gap-4">
                    <li>
                      <button
                        key={"cness"}
                        onClick={handleShareToCness}
                        disabled={isCnessPosting}
                        className="p-2.5 flex gap-3 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Share your badge on CNESS"
                      >
                        <img
                          src={cness}
                          alt={"cness"}
                          className="w-8 h-8 object-contain"
                        />
                        {isCnessPosting && (
                          <span className="ml-1 text-xs text-gray-500">Posting…</span>
                        )}
                      </button>
                    </li>
                    {socialMedia.map((media) => {
                      const IconComponent = media.icon;

                      // if (media.id === "instagram") {
                      //   // Instagram special case (no share button)
                      //   return (
                      //     <li key={media.id}>
                      //       <button className="p-2">
                      //         <IconComponent size={32} color={media.color} />
                      //       </button>
                      //     </li>
                      //   );
                      // }

                      if (media.component) {
                        const ShareComponent = media.component;
                        return (
                          <li key={media.id}>
                            <ShareComponent
                              url={urldata}
                              {...(media.id === "twitter" && {
                                title: tweetText,
                              })}
                            >
                              <IconComponent size={32} color={media.color} />
                            </ShareComponent>
                          </li>
                        );
                      }

                      return null;
                    })}

                    {/* Copy link button */}
                    <li>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(urldata);
                          setCopy(true);
                          setTimeout(() => setCopy(false), 1500);
                        }}
                        className="flex items-center relative"
                        title="Copy link"
                      >
                        <MdContentCopy size={30} className="text-gray-600" />
                        {copy && (
                          <div className="absolute w-[100px] top-10 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all z-20">
                            Link Copied!
                          </div>
                        )}
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms Modal */}
        {showTermModal && (
          <div
            onClick={() => setShowTermModal(false)}
            className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/60"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowTermModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoCloseOutline className="text-xl text-gray-600" />
              </button>

              <h2 className="text-2xl font-semibold text-[#0D0D12] mb-4 pr-8">
                Terms of Services
              </h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  This is a demo Terms of Services content. The actual terms and
                  conditions will be integrated by the team.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                  accusantium doloremque laudantium, totam rem aperiam, eaque
                  ipsa quae ab illo inventore veritatis et quasi architecto
                  beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Policy Modal */}
        {showPrivacyModal && (
          <div
            onClick={() => setShowPrivacyModal(false)}
            className="fixed inset-0 z-10000 flex items-center justify-center p-4 bg-black/60"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoCloseOutline className="text-xl text-gray-600" />
              </button>

              <h2 className="text-2xl font-semibold text-[#0D0D12] mb-4 pr-8">
                Privacy Policy
              </h2>
              <div className="text-sm text-gray-600 space-y-3">
                <p>
                  This is a demo Privacy Policy content. The actual privacy
                  policy will be integrated by the team.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse
                  cillum dolore eu fugiat nulla pariatur. Excepteur sint
                  occaecat cupidatat non proident, sunt in culpa qui officia
                  deserunt mollit anim id est laborum.
                </p>
                <p>
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
                  odit aut fugit, sed quia consequuntur magni dolores eos qui
                  ratione voluptatem sequi nesciunt. Neque porro quisquam est,
                  qui dolorem ipsum quia dolor sit amet.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

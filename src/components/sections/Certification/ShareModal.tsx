import { useEffect, useState } from "react";
import url from "../../../assets/url.svg";
import file from "../../../assets/file.svg";
import socialmedia from "../../../assets/socialmedia.svg";
import grouplogo from "../../../assets/grouplogo.png";
import frame from "../../../assets/bg-frame.png";
import facebook from "../../../assets/facebook.png";
import insta from "../../../assets/insta.png";
import whatsapp from "../../../assets/whatsapp.png";
import Button from "../../ui/Button";

export default function ShareModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");
  const [activeButton, setActiveButton] = useState<"btn1" | "btn2" | "btn3">(
    "btn1"
  );
  const [checked, setChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileFormats = ["PDF", "DOCX", "PNG", "JPEG"];
  const ratios = [1, 1.25, 1.5, 2];

  const [selectedFormat, setSelectedFormat] = useState("");
  const [selectedRatio, setSelectedRatio] = useState("");
  const [logoScale, setLogoScale] = useState("100%");

  const codes = {
    btn1: `<iframe srcdoc="<script>document.write(decodeURIComponent(escape(atob('CiAgICA8ZGl2IHN0eWxlPSJkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBmb250LWZhbWlseTogc2Fucy1zZXJpZjsiPgogICAgICA8aW1nIHNyYz0iaHR0cHM6Ly91YXQuY25lc3MuaW8vYXNzZXRzL2luZHZfYXNwaXJpbmctVHotdk5VTU8uc3ZnP2F1</script>"></iframe>`,
    btn2: `<div class="custom-embed"><img src="https://yourdomain.com/embed-image.png" alt="Preview" /></div>`,
    btn3: `<script src="https://yourdomain.com/embed.js" async></script>`,
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes[activeButton]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      id: "facebook",
      label: "Facebook",
      icon: facebook,
    },
    {
      id: "instagram",
      label: "Instagram",
      icon: insta,
    },
    {
      id: "whatsapp",
      label: "Whatsapp",
      icon: whatsapp,
    },
  ];

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
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60"
    >
      {/* Modal Container */}
      <div
      onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white rounded-xl order border-[#ECEEF2] overflow-hidden animate-fadeIn"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div className="w-full h-[600px] ps-[12px] pe-[14px] py-[18px]">
          <div className="w-full h-full flex flex-col lg:flex-row gap-[18px]">
            <div className="w-full lg:w-[35%] h-fit lg:h-full border-r border-[#ECEEF2] pr-[12px] flex flex-col gap-[18px]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "tab1" | "tab2" | "tab3")
                  }
                  className={`flex items-center py-[8px] px-[12px] gap-[12px] rounded-xl transition-all duration-200 whitespace-nowrap
                   ${
                     activeTab === tab.id
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
                <div className="grid md:grid-cols-3 gap-[12px] pb-[12px] border-b border-[#FAFAFA]">
                  {buttons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() =>
                        setActiveButton(btn.id as "btn1" | "btn2" | "btn3")
                      }
                      className={`relative flex items-center justify-center p-[12px] rounded-lg bg-[#FAFAFA4D] transition-all duration-200 whitespace-nowrap
                   ${
                     activeButton === btn.id
                       ? "shadow-[0_0_10px_0_rgba(0,0,0,0.1)]"
                       : "bg-white hover:bg-[#FAFAFA]"
                   }`}
                    >
                      <p className="text-sm font-medium text-[#0D0D12] font-['Poppins',Helvetica]">
                        {btn.label}
                      </p>

                      {activeButton === btn.id && (
                        <span className="absolute bottom-[-13px] left-0 w-full h-[2px] bg-[#ECEEF2] rounded-t-sm"></span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-[12px]">
                  <textarea
                    readOnly
                    value={codes[activeButton]}
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
                      className={`w-[16px] h-[16px] flex items-center justify-center border border-[#D0D5DD] rounded-sm transition-all
          ${
            checked
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
                      <a href="#" className="text-[#7077FE] hover:underline">
                        Terms of Services
                      </a>{" "}
                      <span className="text-[#3366FF">and</span>{" "}
                      <a href="#" className="text-[#3366FF] hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
                <Button
                  onClick={handleCopy}
                  disabled={!checked}
                  variant="gradient-primary"
                  className="rounded-full w-full py-[12px] px-[16px] self-stretch transition-colors duration-500 ease-in-out"
                >
                  <span className="font-normal text-sm font-['Poppins',Helvetica]">
                    {copied ? "Copied!" : "Copy to clipboard"}
                  </span>
                </Button>
              </div>
            ) : activeTab === "tab2" ? (
              <div className="w-full lg:w-[65%] h-full pb-10 lg:pb-0 flex flex-col gap-[18px]">
                <div className="flex flex-col gap-[12px]">
                  <div>
                    <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                      File Format
                    </label>

                    <div className="relative group">
                      <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className="w-full appearance-none p-[12px] text-sm border border-[#CBD5E1] rounded-xl font-['Poppins',Helvetica] text-[#64748B]"
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
                  </div>

                  <div>
                    <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                      Ratio
                    </label>
                    <div className="relative group">
                      <select
                        value={selectedRatio}
                        onChange={(e) => setSelectedRatio(e.target.value)}
                        className="w-full appearance-none p-[12px] text-sm border border-[#CBD5E1] rounded-xl font-['Poppins',Helvetica] text-[#64748B]"
                      >
                        <option value="" disabled>
                          Select Ratio
                        </option>
                        {ratios.map((ratio) => (
                          <option key={ratio} value={ratio}>
                            {ratio}
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
                    <div className="relative w-full h-[160px] rounded-lg overflow-hidden">
                      {/* Background frame */}
                      <img
                        src={frame}
                        alt="Background Frame"
                        className="w-full h-full object-cover rounded-lg"
                      />

                      {/* Centered Logo */}
                      <img
                        src={grouplogo}
                        alt="Logo"
                        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain transition-transform duration-200 ${
                          logoScale === "75%"
                            ? "w-[187px] h-[75px]"
                            : "w-[250px] h-[100px]"
                        }`}
                      />

                      {/* Dropdown - Top Right */}
                      <div className="absolute top-3 right-3 w-[50px]">
                        <div className="relative">
                          <select
                            value={logoScale}
                            onChange={(e) => setLogoScale(e.target.value)}
                            className="w-full appearance-none px-[8px] py-[4px] text-[8px] border border-[#ECEEF2] rounded-[4px] font-['Poppins',Helvetica] text-[#0D0D12] bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.1)]"
                          >
                            <option value="100%">100%</option>
                            <option value="75%">75%</option>
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
                    </div>
                  </div>
                </div>
                <Button
                  variant="gradient-primary"
                  className="rounded-full w-full py-[12px] px-[16px] self-stretch transition-colors duration-500 ease-in-out"
                >
                  <span className="font-normal text-sm font-['Poppins',Helvetica]">
                    Share
                  </span>
                </Button>
              </div>
            ) : (
              <div className="w-full lg:w-[65%] h-full pb-10 lg:pb-0 flex flex-col gap-[18px]">
                <div className="flex flex-col gap-[12px]">
                  <label className="text-sm font-medium font-['Poppins',Helvetica] text-[#0D0D12] mb-2 block">
                    Social Media
                  </label>
                  <div className="flex items-center gap-[12px]">
                    {socialMedia.map((media) => (
                      <button
                        key={media.id}
                        className="p-[10px] flex gap-[12px] items-center justify-center"
                      >
                        <img
                          src={media.icon}
                          alt={media.label}
                          className="w-[32px] h-[32px] object-contain"
                        />
                        <span className="text-[#0D0D12] font-medium text-sm">
                          {media.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

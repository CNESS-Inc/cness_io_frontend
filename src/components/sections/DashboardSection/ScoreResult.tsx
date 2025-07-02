import { useEffect, useRef, useState } from "react";

// import frameim from "../../../assets/Frame-im.png";
// import frameqa from "../../../assets/Frame-qa.png";
// import framequ from "../../../assets/Frame-qu.png";
import cisscore from "../../../assets/cis score.png";
import framescr from "../../../assets/Frame-scr.png";

import "react-circular-progressbar/dist/styles.css";
import { GetReport, GetUserScoreResult } from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";
import { BiShare } from "react-icons/bi";

const tabs = [
  "Mission & Vision",
  "Client / Customer / Consumer",
  "Communities & Charities",
  "Vision & Legacy – Long-Term Contribution",
  "Leadership Best Practices",
];
const scoreData = [
  {
    title: "Mission & Vision",
    score: 79,
    scorecolor: "#404040",
    label: "Excellent",
    labelColor: "#6B7280",
    tip: "Almost There",
    tipColor: "text-[#FF5F7E]",
    color: "#9747FF",
  },
  {
    title: "Client / Customer / Consumer",
    score: 100,
    label: "Average",
    tip: "Excellence!",
    tipColor: "text-[#7B61FF]",
    color: "#9747FF",
  },
  {
    title: "Communities & Charities",
    score: 80,
    label: "Excellent",
    tip: "Verge of Completion!",
    tipColor: "text-[#4CAF50]",
    color: "#9747FF",
  },
  {
    title: "Vision & Legacy – Long-Term Contribution",
    score: 90,
    label: "Average",
    tip: "Almost Perfect!",
    tipColor: "text-[#A259FF]",
    color: "#9747FF",
  },
  {
    title: "Leadership Best Practices",
    score: 60,
    label: "Average",
    tip: "Almost Perfect!",
    tipColor: "text-[#A259FF]",
    color: "#9747FF",
  },
];

const SegmentedRing = ({
  value,
  label = "Score",
  color = "#9747FF",
  scoreColor = "#404040", // ✅ default fallback
  labelColor = "#404040",
  size = 116,
  thickness = 0.75,
  segments = 60,
  tickLength = 7,
  dotRadius = 0.6, // Smaller dot size
}: // Gap between line and dot
{
  value: number;
  label?: string;
  color?: string;
  scoreColor?: string;
  labelColor?: string;
  size?: number;
  thickness?: number;
  segments?: number;
  tickLength?: number;
  dotRadius?: number;
  dotGap?: number;
}) => {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - tickLength;
  const activeSegments = Math.round((segments * value) / 100);

  const elements = Array.from({ length: segments }).map((_, i) => {
    const angle = (360 / segments) * i;
    const rad = (angle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(rad);
    const y1 = cy + radius * Math.sin(rad);
    const x2 = cx + (radius - tickLength) * Math.cos(rad);
    const y2 = cy + (radius - tickLength) * Math.sin(rad);

    const tickColor = i < activeSegments ? color : "#E9EDF0";
    const dotColor = i < activeSegments ? color : "#D3D3D3"; // Visible gray
    const dotOffset = 2.5; // small gap between line end and dot
    const dotX = cx + (radius - tickLength + dotOffset - 6) * Math.cos(rad);
    const dotY = cy + (radius - tickLength + dotOffset - 6) * Math.sin(rad);

    return (
      <g key={i}>
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickColor}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
        <circle cx={dotX} cy={dotY} r={dotRadius} fill={dotColor} />
      </g>
    );
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <g>{elements}</g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg font-bold" style={{ color: scoreColor }}>
          {value}
        </div>
        <div className="text-xs" style={{ color: labelColor }}>
          {label}
        </div>
      </div>
    </div>
  );
};

const ScoreResult = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { showToast } = useToast();
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fetchRatingDetails = async () => {
    try {
      const res = await GetUserScoreResult();
      console.log("🚀 ~ fetchRatingDetails ~ res:", res);
      setScoreData(res.data.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRatingDetails();
  }, []);

  const myid = localStorage.getItem("Id");
  const urldata = `https://dev.cness.io/directory/user-profile/${myid}`;

  const tweetText = `Earned the CNESS Inspired Certification! Proud to lead with conscious values. Join us at cness.io`;

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };
  const handleReportDownload = async () => {
    try {
      const response = await GetReport();
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to get tip and color based on score
  const getScoreMeta = (score: number) => {
    if (score >= 90) {
      return {
        tip: "Excellence!",
        tipColor: "text-[#7B61FF]",
        label: "Excellent",
      };
    } else if (score >= 70) {
      return {
        tip: "Almost Perfect!",
        tipColor: "text-[#A259FF]",
        label: "Good",
      };
    } else if (score >= 50) {
      return {
        tip: "Almost There",
        tipColor: "text-[#FF5F7E]",
        label: "Average",
      };
    } else {
      return {
        tip: "Needs Improvement",
        tipColor: "text-[#FF0000]",
        label: "Below Average",
      };
    }
  };

  const SUB_SECTION_ORDER = [
    "Select all that apply",
    "Purpose Pause",
    "Suggested Uploads",
    "Best Practice",
  ];

  const sortSubSections = (subSections: any[]) => {
    return subSections.sort((a, b) => {
      const indexA = SUB_SECTION_ORDER.indexOf(a.sub_section_name);
      const indexB = SUB_SECTION_ORDER.indexOf(b.sub_section_name);
      return indexA - indexB;
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!scoreData) {
    return <div>No data available</div>;
  }

  return (
    <>
      {scoreData ? (
        <div className="w-full overflow-x-hidden">
          <div className="flex flex-col w-full min-h-screen bg-[#f9f9f9] pt-1 pb-10 px-2 sm:px-3 md:px-4 lg:pl-6 lg:pr-4 xl:px-6 font-[Poppins] overflow-x-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[24px] font-semibold text-[#222224]">
                Score & Results
              </h1>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    className="bg-white border cursor-pointer border-gray-200 text-[#64748B] text-sm font-medium px-5 py-2 rounded-full shadow-md"
                    onClick={toggleMenu}
                    style={{ cursor: "pointer" }}
                  >
                    Share
                  </button>
                  {showMenu && (
                    <div
                      className="absolute top-10 right-0 mt-3 bg-white shadow-lg rounded-lg p-3 z-10"
                      ref={menuRef}
                    >
                      <ul className="flex items-center gap-4">
                        <li>
                          <FacebookShareButton url={urldata}>
                            <FaFacebook size={32} color="#4267B2" />
                          </FacebookShareButton>
                        </li>
                        <li>
                          <LinkedinShareButton url={urldata}>
                            <FaLinkedin size={32} color="#0077B5" />
                          </LinkedinShareButton>
                        </li>
                        <li>
                          <FaInstagram size={32} color="#C13584" />
                        </li>
                        <li>
                          <TwitterShareButton url={urldata} title={tweetText}>
                            <FaTwitter size={32} color="#1DA1F2" />
                          </TwitterShareButton>
                        </li>
                        <li>
                          <WhatsappShareButton url={urldata}>
                            <FaWhatsapp size={32} color="#1DA1F2" />
                          </WhatsappShareButton>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  className="bg-[#FF6B81] text-white cursor-pointer text-sm font-medium px-5 py-2 rounded-full shadow-md"
                  onClick={handleReportDownload}
                >
                  Report
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-2">
              {/* Overall CIS Score Card */}
              <div
                className="min-h-[208px] p-4 rounded-[12px] border border-[#eceef2] shadow-sm sm:col-span-2 lg:col-span-2"
                style={{
                  background:
                    "linear-gradient(135deg, #f5f2fc 0%, #fef3f8 100%)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-[#e3d1f6] rounded-full flex items-center justify-center">
                    <img
                      src={cisscore}
                      alt="Lightning Icon"
                      className="w-6 h-6"
                    />
                  </div>
                  <span className="text-[16px] font-medium text-[#222224]">
                    Overall CIS Score
                  </span>
                </div>
                <hr className="border-t border-[#DADCE0] mb-3" />

                <div className="flex items-end gap-2 mb-3">
                  <span className="text-[32px] font-bold text-[#9747FF] leading-none">
                    {Math.round(scoreData.cis_score)}
                  </span>
                  <span className="text-sm font-semibold text-[#222224] mb-[2px]">
                    /100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f3f3f3] overflow-hidden mb-1">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-[#a392f2] to-[#f07eff]"
                    style={{ width: `${scoreData.cis_score}%` }}
                  ></div>
                </div>
                <div className="flex justify-end text-xs text-[#222224] font-medium mb-1">
                  100%
                </div>
                <div className="text-xs font-medium text-[#818181]">
                  Above 70 is considered inspired
                </div>
              </div>

              {/* Badge Card */}
              <div className="h-[208px] p-3 rounded-[12px] border border-[#eceef2] shadow-sm bg-white relative">
                {/* Lock overlay - shown when badge is not earned */}
                {!scoreData?.badge?.level && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-[12px] shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
                    <svg
                      className="w-8 h-8 text-gray-700 opacity-80 mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#4F46E5"
                        d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z"
                      />
                      <path
                        fill="#4F46E5"
                        d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"
                      />
                    </svg>
                    <p className="text-sm text-gray-700 font-medium">
                      Badge Locked
                    </p>
                  </div>
                )}

                {/* Original badge content */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[#fff3c4] rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-[#FFCC00]">
                        ⚡
                      </span>
                    </div>
                    <span className="text-[16px] font-medium text-[#222224]">
                      Badge
                    </span>
                  </div>
                  <div className="text-xl text-[#999] leading-none cursor-pointer">
                    ⋯
                  </div>
                </div>

                <hr className="border-t border-[#dadce0] mb-2" />

                <div className="flex justify-center items-center h-full">
                  {scoreData?.badge?.level ? (
                    <>
                      <img
                        src="/Inspired _ Badge.png"
                        alt="CNESS Inspired"
                        className="h-[87px] object-contain"
                      />
                    </>
                  ) : (
                    <div className="h-[87px]"></div>
                  )}
                </div>
              </div>

              {/* Certification Level Card */}
              <div className="h-[208px] bg-white rounded-[12px] p-3 shadow-sm border border-[#eceef2] relative">
                {/* Lock overlay - shown when certification level is not available */}
                {!scoreData?.badge?.level && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-[12px] shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
                    <svg
                      className="w-8 h-8 text-gray-700 opacity-80 mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill="#4F46E5"
                        d="M10 2a4 4 0 00-4 4v3H5a1 1 0 000 2h10a1 1 0 000-2h-1V6a4 4 0 00-4-4zm-2 4a2 2 0 114 0v3H8V6z"
                      />
                      <path
                        fill="#4F46E5"
                        d="M4 11a1 1 0 011-1h10a1 1 0 011 1v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z"
                      />
                    </svg>
                    <p className="text-sm text-gray-700 font-medium">
                      Certification Level Locked
                    </p>
                  </div>
                )}

                {/* Original content */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-[#e2f2ff] rounded-full flex items-center justify-center">
                    <img
                      src="../public/Vector.png"
                      alt="icon"
                      className="w-[12px] h-[12px]"
                    />
                  </div>
                  <span className="text-[16px] font-semibold text-[#222224]">
                    Certification Level
                  </span>
                </div>

                <div className="border-t border-[#e6e6e6] mb-8"></div>

                <div className="flex justify-center items-center h-[72px]">
                  {scoreData?.badge?.level ? (
                    <span className="px-18 py-4 bg-[#eaf9f5] text-[#00bfa5] text-sm font-semibold rounded-[12px] inline-block">
                      {scoreData.badge.level}
                    </span>
                  ) : (
                    <div className="h-[56px]"></div>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-200 mb-2 mt-0" />

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 mt-0">
              <div className="w-full h-[151px] bg-white rounded-[12px] border border-[#eceef2] p-[12px] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={frameqa}
                      alt="Quantitative Icon"
                      className="w-7 h-7"
                    />
                    <span className="text-[16px] font-semibold text-[#222224]">
                      Quantitative Score
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-[24px] font-semibold text-[#222224]">
                    85
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-[4px] rounded-full font-medium">
                    + 5%
                  </span>
                </div>
              </div>

              <div className="w-full h-[151px] bg-white rounded-[12px] border border-[#eceef2] p-[12px] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={framequ}
                      alt="Quantitative Icon"
                      className="w-7 h-7"
                    />
                    <span className="text-[16px] font-semibold text-[#222224]">
                      Quantitative Score
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-[24px] font-semibold text-[#222224]">
                    90
                  </div>
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-[4px] rounded-full font-medium">
                    + 9%
                  </span>
                </div>
              </div>

              <div className="w-full h-[151px] bg-white rounded-[12px] border border-[#eceef2] p-[12px] flex flex-col justify-between shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={frameim}
                      alt="Quantitative Icon"
                      className="w-7 h-7"
                    />
                    <span className="text-[16px] font-semibold text-[#222224]">
                      Improvement Score
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div className="text-[24px] font-semibold text-[#222224]">
                    75
                  </div>
                  <span className="text-xs bg-[#ffe2e2] text-[#FF7878] px-2 py-[4px] rounded-full font-medium">
                    - 5%
                  </span>
                </div>
              </div>
            </div> */}

            {/* Section Header: Score Breakdown */}
            <div className="flex items-center gap-2 mt-1 mb-2">
              <img
                src={framescr}
                alt="Score Breakdown Icon"
                className="w-8 h-8"
              />
              <span className="text-[16px] font-semibold text-[#222224]">
                Score Breakdown
              </span>
            </div>
            <hr className="border-t border-gray-200 mb-2" />

            {/* <div className="w-full px-0 md:px-0">
              <div className="w-full overflow-x-auto no-scrollbar">
                <div className="inline-flex gap-2 w-full max-w-full px-2 sm:px-4">
                  {scoreData.cis_result.map((section: any, index: number) => (
                    <button
                      key={section.section_id}
                      onClick={() => setActiveTab(index)}
                      className={`
                  flex-shrink-0 
                  min-w-[120px] 
                  max-w-[200px] 
                  text-sm 
                  font-medium 
                  py-3 
                  px-4 
                  rounded-t-xl 
                  border 
                  border-[#ECEEF2] 
                  whitespace-nowrap 
                  overflow-hidden 
                  text-ellipsis 
                  text-center
                  transition-all
                  ${
                    activeTab === index
                      ? "bg-[#F8F3FF] text-[#9747FF] -mt-[6px] z-10"
                      : "bg-white text-[#334155] hover:bg-[#F1F5F9]"
                  }
                `}
                      title={section.section_name}
                    >
                      {section.section_name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#F8F3FF] rounded-[12px] border border-[#ECEEF2] p-6 -mt-1.5">
                <h2 className="text-center text-xl font-bold text-[#9747FF] mb-6">
                  {scoreData.cis_result[activeTab]?.section_name}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3 place-items-center">
                  {sortSubSections(
                    scoreData.cis_result[activeTab]?.sub_section_name || []
                  ).map((subSection: any, idx: number) => {
                    const scoreMeta = getScoreMeta(subSection.result);
                    return (
                      <div
                        key={idx}
                        className="bg-white rounded-[12px] p-4 w-full max-w-[258px] h-[303px] flex flex-col justify-between text-center"
                      >
                        <div>
                          <h3 className="text-[12px] font-semibold text-gray-800">
                            {subSection.sub_section_name}
                          </h3>
                          <hr className="border-t border-gray-200 my-2" />
                        </div>

                        <div className="flex justify-center items-center">
                          <SegmentedRing
                            value={subSection.result}
                            label={scoreMeta.label}
                            color="#9747FF"
                            scoreColor="#404040"
                            labelColor="#6B7280"
                          />
                        </div>

                        <div>
                          <p
                            className={`text-sm font-semibold ${scoreMeta.tipColor} leading-none mb-0`}
                          >
                            {scoreMeta.tip}
                          </p>
                          <p className="text-xs text-[#2E2E30] leading-none mt-[10px]">
                            Here are some tips on how to improve your score
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}

            <div className="w-full px-0 md:px-0">
              {/* Section Wrapper */}
              <div className="bg-[#F8F3FF] rounded-[12px] border border-[#ECEEF2] p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {scoreData.cis_result.map((section: any) => {
                    const scoreMeta = getScoreMeta(section.weight);
                    return (
                      <div
                        key={section.section_id}
                        className="bg-white rounded-[12px] p-4 w-full max-w-[258px] h-[303px] flex flex-col justify-between text-center border border-[#ECEEF2]"
                      >
                        <div>
                          <h3 className="text-[14px] font-semibold text-gray-800">
                            {section.section_name}
                          </h3>
                          <hr className="border-t border-gray-200 my-2" />
                          {/* <p className="text-xs text-gray-500">
                            Weight: {section.section_total_weight}%
                          </p> */}
                        </div>

                        <div className="flex justify-center items-center">
                          <SegmentedRing
                            value={section.weight}
                            // label={`Weight: ${section.section_total_weight}%`}
                            color="#9747FF"
                            scoreColor="#404040"
                            labelColor="#6B7280"
                          />
                        </div>

                        <div>
                          <p
                            className={`text-sm font-semibold ${scoreMeta.tipColor} leading-none mb-0`}
                          >
                            {scoreMeta.tip}
                          </p>
                          {/* <p className="text-xs text-[#2E2E30] leading-none mt-[10px]">
                            Score: {section.weight}%
                          </p> */}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mt-0 shadow overflow-hidden p-8 text-center">
          <div className="py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Score And Result Coming Soon
            </h2>
            <p className="text-gray-600 mb-6">
              We're working hard to bring this feature to you. Please check back
              later!
            </p>
            <div className="flex justify-center">
              <svg
                className="w-24 h-24 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScoreResult;
export { SegmentedRing };

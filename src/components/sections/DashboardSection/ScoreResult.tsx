import { useState } from "react";

import "react-circular-progressbar/dist/styles.css";

const tabs = [
  "Ethical Leadership",
  "Social Equity, Diversity",
  "Freedom, Culture",
  "Environmental Stewardship",
  "Social Responsibility",
  "Consciousness and Leadership",
];
const scoreData = [
  {
    title: "CODE OF ETHICS / CORE VALUES",
    score: 79,
    scorecolor: "#404040",
    label: "Excellent",
    labelColor: "#6B7280",
    tip: "Almost There",
    tipColor: "text-[#FF5F7E]",
    color: "#9747FF",
  },
  {
    title: "ACCOUNTABILITY MECHANISMS",
    score: 100,
    label: "Average",
    tip: "Excellence!",
    tipColor: "text-[#7B61FF]",
    color: "#9747FF",
  },
  {
    title: "STAKEHOLDER INCLUSIVITY",
    score: 80,
    label: "Excellent",
    tip: "Verge of Completion!",
    tipColor: "text-[#4CAF50]",
    color: "#9747FF",
  },
  {
    title: "TRANSPARENCY REPORTING",
    score: 90,
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
  return (

<div className="w-full px-2 sm:px-4 lg:px-5 pt-4 pb-10 bg-[#f9f9f9] min-h-screen font-[Poppins]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#222224]">
            Score & Results
          </h1>
          <div className="flex gap-2">
            <button className="bg-white border border-gray-200 text-[#64748B] text-sm font-medium px-5 py-2 rounded-full shadow-md">
              Share
            </button>
            <button className="bg-[#FF6B81] text-white text-sm font-medium px-5 py-2 rounded-full shadow-md">
              Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-6">
          {/* Overall CIS Score Card - will take full width on mobile, 2 cols on larger screens */}
          <div
            className="min-h-[208px] p-4 rounded-[12px] border border-[#eceef2] shadow-sm sm:col-span-2 lg:col-span-2"
            style={{
              background: "linear-gradient(135deg, #f5f2fc 0%, #fef3f8 100%)",
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 bg-[#e3d1f6] rounded-full flex items-center justify-center">
                <img
                  src="./cis score.png"
                  alt="Lightning Icon"
                  className="w-8 h-6"
                />
              </div>
              <span className="text-sm font-medium text-[#222224]">
                Overall CIS Score
              </span>
            </div>
            <hr className="border-t border-[#DADCE0] mb-3" />

            <div className="flex items-end gap-2 mb-3">
              <span className="text-[32px] font-bold text-[#9747FF] leading-none">
                72
              </span>
              <span className="text-sm font-semibold text-[#222224] mb-[2px]">
                /100
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#f3f3f3] overflow-hidden mb-1">
              <div className="w-[72%] h-2 rounded-full bg-gradient-to-r from-[#a392f2] to-[#f07eff]"></div>
            </div>
            <div className="flex justify-end text-xs text-[#222224] font-medium mb-1">
              100%
            </div>
            <div className="text-xs font-medium text-[#818181]">
              Above 70 is considered inspired
            </div>
          </div>

          {/* Badge Card - will stack below on mobile */}
          <div className="h-[208px] p-3 rounded-[12px] border border-[#eceef2] shadow-sm bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#fff3c4] rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-[#FFCC00]">⚡</span>
                </div>
                <span className="text-sm font-medium text-[#222224]">
                  Badge
                </span>
              </div>
              <div className="text-xl text-[#999] leading-none cursor-pointer">
                ⋯
              </div>
            </div>

            <hr className="border-t border-[#dadce0] mb-2" />

            <div className="flex justify-center items-center h-full">
              <img
                src="/Inspired _ Badge.png"
                alt="CNESS Inspired"
                className="h-[87px] object-contain"
              />
            </div>
          </div>

          {/* Certification Level Card - will stack below on mobile */}
          <div className="h-[208px] bg-white rounded-[12px] p-3 shadow-sm border border-[#eceef2]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#e2f2ff] rounded-full flex items-center justify-center">
                <img
                  src="../public/Vector.png"
                  alt="icon"
                  className="w-[12px] h-[12px]"
                />
              </div>
              <span className="text-sm font-semibold text-[#222224]">
                Certification Level
              </span>
            </div>
            <div className="border-t border-[#e6e6e6] mb-8"></div>
            <div className="flex justify-center items-center">
              <span className="px-18 py-4 bg-[#eaf9f5] text-[#00bfa5] text-sm font-semibold rounded-[12px] inline-block">
                Inspired
              </span>
            </div>
          </div>
        </div>

        {/* Metric Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="w-full h-[151px] bg-white rounded-[12px] border border-[#eceef2] p-[12px] flex flex-col justify-between shadow-sm">
            {/* Top Section: Icon and Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./Frame-qa.png"
                  alt="Quantitative Icon"
                  className="w-6 h-6"
                />
                <span className="text-sm font-semibold text-[#222224]">
                  Quantitative Score
                </span>
              </div>
            </div>

            {/* Bottom: Score Left, % Right */}
            <div className="flex items-end justify-between">
              <div className="text-[24px] font-semibold text-[#222224]">85</div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-[4px] rounded-full font-medium">
                + 5%
              </span>
            </div>
          </div>

          {/* Qualitative Score */}
          <div className="w-full h-[151px] bg-white rounded-[12px] border border-[#eceef2] p-[12px] flex flex-col justify-between shadow-sm">
            {/* Top Section: Icon and Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./Frame-qu.png"
                  alt="Quantitative Icon"
                  className="w-6 h-6"
                />
                <span className="text-sm font-semibold text-[#222224]">
                  Quantitative Score
                </span>
              </div>
            </div>

            {/* Bottom: Score Left, % Right */}
            <div className="flex items-end justify-between">
              <div className="text-[24px] font-semibold text-[#222224]">90</div>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-[4px] rounded-full font-medium">
                + 9%
              </span>
            </div>
          </div>

          {/* Improvement Score */}
          <div className="w-full h-[151px] bg-white rounded-[12px] border border-[#eceef2] p-[12px] flex flex-col justify-between shadow-sm">
            {/* Top Section: Icon and Label */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="./Frame-im.png"
                  alt="Quantitative Icon"
                  className="w-6 h-6"
                />
                <span className="text-sm font-semibold text-[#222224]">
                  Improvement Score
                </span>
              </div>
            </div>

            {/* Bottom: Score Left, % Right */}
            <div className="flex items-end justify-between">
              <div className="text-[24px] font-semibold text-[#222224]">75</div>
              <span className="text-xs bg-[#ffe2e2] text-[#FF7878] px-2 py-[4px] rounded-full font-medium">
                - 5%
              </span>
            </div>
          </div>
        </div>

        {/* Section Header: Score Breakdown */}
        <div className="flex items-center gap-2 mt-6 mb-2">
          <img
            src="./Frame-scr.png"
            alt="Score Breakdown Icon"
            className="w-8 h-8"
          />

          <span className="text-sm font-semibold text-[#222224]">
            Score Breakdown
          </span>
        </div>
        {/* Horizontal divider */}
        <hr className="border-t border-gray-200 mb-4" />

        {/* Tab Navigation */}
        {/* Tabs Container */}
        <div className="flex flex-col gap-0">
          {/* Tabs */}
<div className="w-full px-2 sm:px-4 lg:px-6 overflow-x-auto">
<div className="inline-flex gap-5 py-1 min-w-max mx-6 sm:mx-4 lg:mx-6">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-[200px] text-xs font-medium py-3 rounded-t-[12px] border border-[#ECEEF2] transition-all duration-200 ease-in-out 
                     ${
                    activeTab === index
                      ? "bg-[#F8F3FF] text-[#9747FF] -mt-[6px] z-10"
                      : "bg-white text-[#334155] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Section Wrapper */}
          <div className="bg-[#F8F3FF] rounded-[12px] border border-[#ECEEF2] p-6 -mt-1.5">
            <h2 className="text-center text-xl font-bold text-[#9747FF] mb-6">
              Ethical Leadership & Governance
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 place-items-center">
              {scoreData.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[12px] p-4 w-[258.75px] h-[303.25px] flex flex-col justify-between text-center"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <hr className="border-t border-gray-200 my-2" />
                  </div>

                  <div className="flex justify-center items-center">
                    <SegmentedRing
                      value={item.score}
                      label={item.label}
                      color={item.color}
                      scoreColor={item.scorecolor}
                      labelColor="#6B7280"
                    />
                  </div>

                  <div>
                    <p
                      className={`text-sm font-semibold ${item.tipColor} leading-none mb-0`}
                    >
                      {item.tip}
                    </p>
                    <p className="text-xs text-[#2E2E30] leading-none mt-[10px]">
                      Here are some tips on how to improve your score
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
   
  );
};

export default ScoreResult;
export { SegmentedRing };

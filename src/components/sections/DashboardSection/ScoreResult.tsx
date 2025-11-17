import { useEffect, useRef, useState } from "react";

// import frameim from "../../../assets/Frame-im.png";
// import frameqa from "../../../assets/Frame-qa.png";
// import framequ from "../../../assets/Frame-qu.png";
import cisscore from "../../../assets/cisscore.svg";
import framescr from "../../../assets/Frame-scr.png";
import html2pdf from "html2pdf.js";
import "react-circular-progressbar/dist/styles.css";
import { GetReport, GetUserScoreResult } from "../../../Common/ServerAPI";
import { useToast } from "../../ui/Toast/ToastProvider";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import badgeicon from "../../../assets/badgeicon.svg";
import { MdContentCopy } from "react-icons/md";
import certifications from "../../../assets/certifications.svg";

// import { BiShare } from "react-icons/bi";

// const tabs = [
//   "Mission & Vision",
//   "Client / Customer / Consumer",
//   "Communities & Charities",
//   "Vision & Legacy – Long-Term Contribution",
//   "Leadership Best Practices",
// ];
// const scoreData = [
//   {
//     title: "Mission & Vision",
//     score: 79,
//     scorecolor: "#404040",
//     label: "Excellent",
//     labelColor: "#6B7280",
//     tip: "Almost There",
//     tipColor: "text-[#FF5F7E]",
//     color: "#9747FF",
//   },
//   {
//     title: "Client / Customer / Consumer",
//     score: 100,
//     label: "Average",
//     tip: "Excellence!",
//     tipColor: "text-[#7B61FF]",
//     color: "#9747FF",
//   },
//   {
//     title: "Communities & Charities",
//     score: 80,
//     label: "Excellent",
//     tip: "Verge of Completion!",
//     tipColor: "text-[#4CAF50]",
//     color: "#9747FF",
//   },
//   {
//     title: "Vision & Legacy – Long-Term Contribution",
//     score: 90,
//     label: "Average",
//     tip: "Almost Perfect!",
//     tipColor: "text-[#A259FF]",
//     color: "#9747FF",
//   },
//   {
//     title: "Leadership Best Practices",
//     score: 60,
//     label: "Average",
//     tip: "Almost Perfect!",
//     tipColor: "text-[#A259FF]",
//     color: "#9747FF",
//   },
// ];

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
  // const [activeTab, setActiveTab] = useState(0);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { showToast } = useToast();
  const [scoreData, setScoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [copy, setCopy] = useState<Boolean>(false);

  const fetchRatingDetails = async () => {
    try {
      const res = await GetUserScoreResult();
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
    setIsGeneratingPDF(true);
    const response = await GetReport();
    
    // Updated data extraction to match new response structure
    const data = {
      array: response.data.data.array,
      final_score: response.data.data.final_score,
    };

    let html = "";

    // Generate HTML content for sections
    for (const section of data.array) {
      html += `<div style="margin-bottom: 25px;"><h2 style="margin-bottom: 10px;">Section: ${section.section.name} - (${section.section.weight} / ${section.section.total_weight})</h2>`;
      
      for (const sub of section.question_data) {
        html += `<div style="margin-bottom: 25px;"><h3>Sub Section: ${sub.sub_section.name} - (${sub.sub_section.weight} / 5)</h3>`;
        
        for (const ques of sub.questions) {
          html += `<p><b>Question:</b> ${ques.question}</p><ul>`;
          
          // Handle different answer scenarios
          if (ques.answer && ques.answer.length > 0) {
            for (const ans of ques.answer) {
              if (ans === null || ans === undefined) {
                html += `<li>No answer provided</li>`;
              } else if (ques.is_link) {
                html += `<li><a href="${ans}" target="_blank">Click To View Uploaded File</a></li>`;
              } else {
                html += `<li>${ans}</li>`;
              }
            }
          } else {
            html += `<li>No answer provided</li>`;
          }
          
          html += `</ul>`;
        }
        html += ` </div><br/> `;
      }
      html += ` </div><br/> `;
    }

    // Complete HTML template
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>CNESS Inspired Certification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            h1 {
                color: #4CAF50;
                text-align: center;
                margin-bottom: 30px;
            }
            .mb{
                margin-bottom: 30px;
            }
            h2 {
                color: #333;
                margin-top: 30px;
                border-bottom: 2px solid #4CAF50;
                padding-bottom: 5px;
            }
            h3 {
                color: #555;
                margin-top: 20px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                margin-bottom: 30px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #4CAF50;
                color: white;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #f5f5f5;
            }
            li {
                color: #666;
                margin-bottom: 5px;
            }
            a {
                color: #2196F3;
                text-decoration: underline;
            }
            a:hover {
                color: #1976D2;
            }
            .footer {
                margin-top: 40px;
                font-style: italic;
                color: #666;
                text-align: center;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            .mb {
                margin-bottom: 20px;
            }
            .section-container {
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                margin-bottom: 25px;
                border-left: 4px solid #4CAF50;
            }
            .question-container {
                background-color: white;
                padding: 15px;
                border-radius: 5px;
                margin: 10px 0;
                border: 1px solid #e0e0e0;
            }
        </style>
    </head>
    <body>
        <h1>CNESS Inspired Certification – Self-Assessment Report</h1>
        <p class="mb">This report is auto-generated based on your self-assessment for the CNESS Inspired Certification.</p>

        <div class="section-container">
        ${html}
        </div>

        <h2 id='summary-table'>Summary Table</h2>
        <table>
            <tr>
                <th>Pillar</th>
                <th>Max Points</th>
                <th>Score</th>
                <th>Percentage</th>
            </tr>
            ${data.array
              .map(
                (item: any) => `
            <tr>
                <td>${item.section.name}</td>
                <td>${item.section.total_weight}</td>
                <td>${item.section.weight}</td>
                <td>${Math.round(
                  (item.section.weight / item.section.total_weight) * 100
                )}%</td>
            </tr>
            `
              )
              .join("")}
            <tr style="background-color: #e8f5e8;">
                <td colspan="2"><strong>Total Score</strong></td>
                <td colspan="2"><strong>${data.final_score} / 100</strong></td>
            </tr>
        </table>

        <div class="footer">
            <p>Thank you for your dedication to conscious growth.</p>
            <p class="mb">Generated on: ${new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
        </div>
    </body>
    </html>`;

    // Generate PDF from HTML with correct typing
    const options = {
      margin: 15,
      filename: `CNESS_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        async: true,
      },
      jsPDF: {
        unit: "mm" as const,
        format: "a4" as const,
        orientation: "portrait" as const,
      },
      pagebreak: {
        mode: "avoid-all" as const,
        before: " #summary-table",
        avoid: "img, table",
      },
    };

    // Generate and download PDF
    await html2pdf().set(options).from(template).save();
    
  } catch (error: any) {
    showToast({
      message:
        error?.response?.data?.error?.message || "Failed to generate report",
      type: "error",
      duration: 5000,
    });
  } finally {
    setIsGeneratingPDF(false);
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

  // const SUB_SECTION_ORDER = [
  //   "Select all that apply",
  //   "Purpose Pause",
  //   "Suggested Uploads",
  //   "Best Practice",
  // ];

  // const sortSubSections = (subSections: any[]) => {
  //   return subSections.sort((a, b) => {
  //     const indexA = SUB_SECTION_ORDER.indexOf(a.sub_section_name);
  //     const indexB = SUB_SECTION_ORDER.indexOf(b.sub_section_name);
  //     return indexA - indexB;
  //   });
  // };

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
          <div className="flex flex-col w-full min-h-screen bg-[#f9f9f9] pt-1 pb-10 px-2 sm:px-2 md:px-2 lg:pl-6 lg:pr-4 xl:px-1 font-[Poppins] overflow-x-hidden max-w-full lg:max-w-none">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-[20px] sm:text-[22px] md:text-[24px] font-semibold text-black">
                Score & Results
              </p>
              {scoreData.is_submitted_by_head &&
              scoreData.cis_result.length > 0 ? (
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
                        className="absolute top-10 sm:left-auto sm:right-0 mt-3 bg-white shadow-lg rounded-lg p-3 z-10"
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
                          {/* <li>
                            <FaInstagram size={32} color="#C13584" />
                          </li> */}
                          <TwitterShareButton url={urldata} title={tweetText}>
                            <FaTwitter size={32} color="#1DA1F2" />
                          </TwitterShareButton>
                          <li>
                            <WhatsappShareButton url={urldata}>
                              <FaWhatsapp size={32} color="#1DA1F2" />
                            </WhatsappShareButton>
                          </li>
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
                              <MdContentCopy
                                size={30}
                                className="text-gray-600"
                              />
                              {copy && (
                                <div className="absolute w-[100px] top-10 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow transition-all z-20">
                                  Link Copied!
                                </div>
                              )}
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-[#FF6B81] text-white cursor-pointer text-sm font-medium px-5 py-2 rounded-full shadow-md flex items-center justify-center gap-2"
                    onClick={handleReportDownload}
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Report
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <div className="relative">
                    <button
                      className="bg-white border cursor-not-allowed border-gray-200 text-[#64748B] text-sm font-medium px-5 py-2 rounded-full shadow-md"
                      disabled
                    >
                      Share
                    </button>
                  </div>
                  <button
                    className="bg-[#FF6B81] text-white cursor-not-allowed text-sm font-medium px-5 py-2 rounded-full shadow-md flex items-center justify-center gap-2"
                    disabled
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Report
                  </button>
                </div>
              )}
            </div>

            {/* Summary Cards */}
            <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-2">
              {/* Overall CIS Score Card */}
              <div
                className="min-h-52 p-4 rounded-xl border border-[#eceef2] shadow-sm sm:col-span-2 lg:col-span-2 relative"
                style={{
                  background:
                    "linear-gradient(135deg, #f5f2fc 0%, #fef3f8 100%)",
                }}
              >
                {/* Lock overlay - shown when cis_score is 0 */}
                {(!scoreData.is_assessment_submited ||
                  !scoreData.is_submitted_by_head ||
                  scoreData.cis_score === 0) && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
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
                      {!scoreData.is_assessment_submited
                        ? "Complete Inspired Assessment to Unlock"
                        : !scoreData.is_submitted_by_head
                        ? "Score Under Review"
                        : "Score Not Available"}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-[#E8CDFD] w-7 h-7 flex items-center justify-center rounded-full p-2">
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
                  <span className="text-sm font-semibold text-[#222224] mb-0.5">
                    /100
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#f3f3f3] overflow-hidden mb-1">
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-[#a392f2] to-[#f07eff]"
                    style={{ width: `${scoreData.cis_score}%` }}
                  ></div>
                </div>
                <div className="flex justify-end text-xs text-[#222224] font-medium mb-1">
                  100%
                </div>
                <div className="text-xs font-medium text-[#818181]">
                  Above 60 is considered inspired
                </div>
              </div>

              {/* Badge Card */}
              <div className="h-52 p-3 rounded-xl border border-[#eceef2] shadow-sm bg-white relative">
                {/* Lock overlay - shown when badge is not earned */}
                {!scoreData?.badge?.level && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
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
                    <p className="text-[16px] font-medium text-[#222224]">
                      Badge Locked
                    </p>
                  </div>
                )}

                {/* Original badge content */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FFCC0033] w-8 h-8 flex items-center justify-center rounded-full p-2">
                      <img
                        className="w-6 h-6"
                        alt="Badge icon"
                        src={badgeicon}
                      />
                    </div>
                    <span className="text-[16px] font-medium text-[#222224]">
                      Badge
                    </span>
                  </div>
                </div>

                <hr className="border-t border-[#dadce0] mb-2" />

                <div className="flex justify-center items-center h-full">
                  {scoreData?.badge?.level ? (
                    <div className="flex justify-center items-center py-[17px] -mt-[50px]">
                      <img
                        src={
                          scoreData.badge.level === "Aspiring"
                            ? 'https://cdn.cness.io/aspiringlogo.svg'
                            : 'https://cdn.cness.io/inspired1.svg'
                        }
                        // src={
                        //   scoreData.badge.level === "Aspiring"
                        //     ? indv_aspiring
                        //     : scoreData.badge.level === "Inspired"
                        //       ? indv_inspried
                        //       : indv_leader
                        // }
                        alt={`${scoreData.badge.level} Badge`}
                        className="h-[87px] w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-[87px]"></div>
                  )}
                </div>
              </div>

              {/* Certification Level Card */}
              <div className="h-52 bg-white rounded-xl p-3 shadow-sm border border-[#eceef2] relative">
                {/* Lock overlay - shown when certification level is not available */}
                {!scoreData?.badge?.level && (
                  <div className="absolute inset-0 bg-white/30 backdrop-blur-md border border-white/30 rounded-xl shadow-inner flex flex-col items-center justify-center z-10 px-4 text-center">
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
                    <p className="text-[16px] font-medium text-[#222224]">
                      Certification Level Locked
                    </p>
                  </div>
                )}

                {/* Original content */}
                <div className="flex items-center gap-2 mb-2">
                  <div className=" flex items-center justify-center">
                    <img
                      src={certifications}
                      alt="icon"
                      className="w-[30px] h-[30px]"
                    />
                  </div>
                  <span className="text-[16px] font-medium text-[#222224]">
                    Certification Level
                  </span>
                </div>

                <div className="border-t border-[#e6e6e6] mb-8"></div>

                <div className="flex justify-center items-center h-[72px]">
                  {scoreData?.badge?.level ? (
                    <span className="px-18 py-4 bg-[#eaf9f5] text-[#00bfa5] text-sm font-semibold rounded-xl inline-block">
                      {scoreData.badge.level}
                    </span>
                  ) : (
                    <div className="h-14"></div>
                  )}
                </div>
              </div>
            </div>
            {/*<hr className="border-t border-gray-200 mb-2 mt-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 mt-0">
              <div className="w-full h-[151px] bg-white rounded-xl border border-[#eceef2] p-3 flex flex-col justify-between shadow-sm">
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
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    + 5%
                  </span>
                </div>
              </div>

              <div className="w-full h-[151px] bg-white rounded-xl border border-[#eceef2] p-3 flex flex-col justify-between shadow-sm">
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
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                    + 9%
                  </span>
                </div>
              </div>

              <div className="w-full h-[151px] bg-white rounded-xl border border-[#eceef2] p-3 flex flex-col justify-between shadow-sm">
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
                  <span className="text-xs bg-[#ffe2e2] text-[#FF7878] px-2 py-1 rounded-full font-medium">
                    - 5%
                  </span>
                </div>
              </div>
            </div> */}

            {scoreData.is_assessment_submited ? (
              <>
                {/* Section Header: Score Breakdown */}
                <div className="flex items-center gap-2 mt-3 mb-3">
                  <img
                    src={framescr}
                    alt="Score Breakdown Icon"
                    className="w-8 h-8"
                  />
                  {scoreData.cis_result.length > 0 ? (
                    <span className="text-[16px] font-medium text-[#222224]">
                      Score Breakdown
                    </span>
                  ) : (
                    <span className="text-[16px] font-semibold text-[#222224]">
                      Assessment Under review - Please wait for the score
                      breakdown
                    </span>
                  )}
                </div>

                {/* <div className="w-full px-0 md:px-0">
              <div className="w-full overflow-x-auto no-scrollbar">
                <div className="inline-flex gap-2 w-full max-w-full px-2 sm:px-4">
                  {scoreData.cis_result.map((section: any, index: number) => (
                    <button
                      key={section.section_id}
                      onClick={() => setActiveTab(index)}
                      className={`
                  shrink-0 
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
                      ? "bg-[#F8F3FF] text-[#9747FF] -mt-1.5 z-10"
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

              <div className="bg-[#F8F3FF] rounded-xl border border-[#ECEEF2] p-6 -mt-1.5">
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
                        className="bg-white rounded-xl p-4 w-full max-w-[258px] h-[303px] flex flex-col justify-between text-center"
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
                          <p className="text-xs text-[#2E2E30] leading-none mt-2.5">
                            Here are some tips on how to improve your score
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div> */}

                {scoreData.is_submitted_by_head ? (
                  <div className="w-full px-0 md:px-0">
                    {/* Section Wrapper */}
                    <div className="bg-[#F8F3FF] rounded-xl border border-[#ECEEF2] p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                        {scoreData.cis_result.map((section: any) => {
                          const scoreMeta = getScoreMeta(section.weight);
                          return (
                            <div
                              key={section.section_id}
                              className="bg-white rounded-xl p-3 sm:p-4 w-full lg:max-w-[258px] min-h-[303px] flex flex-col justify-between text-center border border-[#ECEEF2]"
                            >
                              <div>
                                <h3 className="text-[16px] font-medium text-[#222224]">
                                  {section.section_name}
                                </h3>
                                <hr className="border-t border-gray-200 my-2" />
                              </div>

                              <div className="flex justify-center items-center">
                                <SegmentedRing
                                  value={section.weight}
                                  color="#9747FF"
                                  scoreColor="#404040"
                                  labelColor="#6B7280"
                                />
                              </div>

                              <div>
                                <p
                                  className={`text-sm font-semibold ${scoreMeta.tipColor} leading-none mb-0`}
                                >
                                  {section.status}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F8F3FF] rounded-xl border border-[#ECEEF2] p-6 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <svg
                        className="w-12 h-12 text-purple-500 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        Your Score is Under Review
                      </h3>
                      <p className="text-sm text-gray-600 max-w-md">
                        Your assessment has been submitted and is currently
                        being reviewed. You'll be able to see your detailed
                        score breakdown once approved.
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  Please complete and submit your assessment to view your scores
                  and results.
                </p>
              </div>
            )}
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

import { useEffect, useRef, useState } from "react";
import {
  DashboardDetails,
  GetReport,
  GetUserScoreResult,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import score from "../assets/score.svg";
import badge from "../assets/badge.svg";
import bg from "../assets/certification_bg.png";
import icon1 from "../assets/Frame 1.svg";
import arrow from "../assets/arrow.svg";
import shareicon from "../assets/shareicon.svg";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import CertificationPlans from "../components/sections/Certification/CertificationPlans";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import html2pdf from "html2pdf.js";
import ShareModal from "../components/sections/Certification/ShareModal";
import "react-circular-progressbar/dist/styles.css";

const UpgradeBadge = () => {
  const myid = localStorage.getItem("Id");
  const urldata = `${window.location.origin}/directory/user-profile/${myid}`;
  const tweetText = `Earned the CNESS Inspired Certification! Proud to lead with conscious values. Join us at cness.io`;
  const [user, setUser] = useState<any | null>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { showToast } = useToast();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [copy, setCopy] = useState<Boolean>(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchRatingDetails();
  }, []);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  const handleReportDownload = async () => {
    try {
      setIsGeneratingPDF(true);
      const response = await GetReport();

      const data = {
        array: response.data.data.array,
        final_score: response.data.data.final_score,
      };

      let html = "";

      for (const section of data.array) {
        html += `<div style="margin-bottom: 25px;"><h2 style="margin-bottom: 10px;">Section: ${section.section.name} - (${section.section.weight} / ${section.section.total_weight})</h2>`;

        for (const sub of section.question_data) {
          html += `<div style="margin-bottom: 25px;"><h3>Sub Section: ${sub.sub_section.name} - (${sub.sub_section.weight} / 5)</h3>`;

          for (const ques of sub.questions) {
            html += `<p><b>Question:</b> ${ques.question}</p><ul>`;

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
            <p class="mb">Generated on: ${new Date().toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}</p>
        </div>
    </body>
    </html>`;

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

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchDashboard = async () => {
    try {
      const response: any = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
        localStorage.setItem("name", response.data.data?.name);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

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
    }
  };

  const LockOverlay = ({ message }: { message: string }) => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm border border-white/30 rounded-xl flex flex-col items-center justify-center z-10 px-4 text-center">
      <svg
        className="w-6 h-6 md:w-8 md:h-8 text-gray-700 mb-2"
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
      <p className="text-xs md:text-sm text-gray-700 font-medium px-2">
        {message}
      </p>
    </div>
  );

  const showProgressLock = !scoreData?.is_assessment_submited;
  const showCISScoreLock =
    !scoreData?.is_assessment_submited ||
    !scoreData?.is_submitted_by_head ||
    scoreData?.cis_score === 0;
  const showBadgeLock = !scoreData?.badge?.level;

  return (
    <>
      <section className="w-full px-3 sm:px-4 md:px-6 lg:px-8 pt-4 pb-10">
        {/* Header Section */}
        <header className="w-full mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-['Poppins',Helvetica] text-xl sm:text-2xl text-[#222224] font-semibold">
                Certification Journey
              </h1>
            </div>
            {scoreData?.cis_result?.length > 0 &&
            scoreData?.is_submitted_by_head ? (
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <button
                    className="bg-white border border-gray-200 text-[#64748B] text-sm font-medium px-4 sm:px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
                    onClick={toggleMenu}
                  >
                    Share
                  </button>
                  {showMenu && (
                    <div
                      className="absolute top-12 right-0 sm:left-auto mt-2 bg-white shadow-lg rounded-lg p-3 z-50 min-w-[200px]"
                      ref={menuRef}
                    >
                      <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                        <li>
                          <FacebookShareButton url={urldata}>
                            <FaFacebook
                              className="w-6 h-6 sm:w-8 sm:h-8"
                              color="#4267B2"
                            />
                          </FacebookShareButton>
                        </li>
                        <li>
                          <LinkedinShareButton url={urldata}>
                            <FaLinkedin
                              className="w-6 h-6 sm:w-8 sm:h-8"
                              color="#0077B5"
                            />
                          </LinkedinShareButton>
                        </li>
                        <li>
                          <TwitterShareButton url={urldata} title={tweetText}>
                            <FaTwitter
                              className="w-6 h-6 sm:w-8 sm:h-8"
                              color="#1DA1F2"
                            />
                          </TwitterShareButton>
                        </li>
                        <li>
                          <WhatsappShareButton url={urldata}>
                            <FaWhatsapp
                              className="w-6 h-6 sm:w-8 sm:h-8"
                              color="#25D366"
                            />
                          </WhatsappShareButton>
                        </li>
                        <li className="relative">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(urldata);
                              setCopy(true);
                              setTimeout(() => setCopy(false), 1500);
                            }}
                            className="flex items-center"
                            title="Copy link"
                          >
                            <MdContentCopy className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600" />
                          </button>
                          {copy && (
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-semibold shadow whitespace-nowrap">
                              Link Copied!
                            </div>
                          )}
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <button
                  className="bg-[#FF6B81] text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                  onClick={handleReportDownload}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
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
                      <span className="hidden sm:inline">Generating...</span>
                      <span className="sm:hidden">Processing</span>
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
            ) : null}
          </div>
        </header>

        {/* Main Cards Grid - Stack on mobile, horizontal on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          {/* Progress Card */}
          <div className="bg-white rounded-xl p-4 sm:p-6 relative">
            {showProgressLock && (
              <LockOverlay message="Complete Inspired Assessment to Unlock" />
            )}
            <div>
              <h2 className="font-['Poppins',Helvetica] font-medium text-base md:text-lg bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                You're making great progress
              </h2>
              <p className="py-3 font-['Open_Sans',Helvetica] text-sm text-[#242424]">
                You've successfully achieved Aspired certification and are
                currently working towards Inspired level. Complete the remaining
                requirements to unlock your next milestone.
              </p>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl md:text-2xl text-[#222224] font-medium">
                  {scoreData?.cis_score || 0}%
                </div>
                <div
                  className={`text-sm md:text-base font-medium ${
                    (scoreData?.cis_score || 0) >= 100
                      ? "text-[#4CAF50]"
                      : "text-[#9747ff]"
                  }`}
                >
                  {(scoreData?.cis_score || 0) >= 100
                    ? "Completed"
                    : "In Progress"}
                </div>
              </div>
              <div className="flex items-center gap-1 w-full">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={`flex-1 h-4 sm:h-5 md:h-6 rounded ${
                      index < Math.floor((user?.cis_score || 0) / (100 / 6))
                        ? "bg-linear-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]"
                        : "bg-[#EDEAFF]"
                    }`}
                  />
                ))}
              </div>
              <p className="pt-3 text-xs text-[#818181]">
                A score above 70 indicates a level of inspiration.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* CIS Score Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 relative">
              {showCISScoreLock && (
                <LockOverlay
                  message={
                    !scoreData?.is_assessment_submited
                      ? "Complete Inspired Assessment"
                      : !scoreData?.is_submitted_by_head
                      ? "Score Under Review"
                      : "Score Not Available"
                  }
                />
              )}
              <div className="pb-3 flex items-center gap-3 border-b border-black/10">
                <div className="bg-[rgba(232,205,253,0.2)] w-8 h-8 rounded-full flex justify-center items-center shrink-0">
                  <img src={score} alt="score icon" className="w-4 h-4" />
                </div>
                <h3 className="text-base font-medium text-[#222224]">
                  CIS Score
                </h3>
              </div>
              <div className="pt-5 flex justify-center">
                <div className="relative w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[140px] md:h-[140px]">
                  <CircularProgressbar
                    value={user?.cis_score || 0}
                    strokeWidth={10}
                    styles={buildStyles({
                      rotation: 0.6,
                      pathColor: "url(#gradient)",
                      trailColor: "#f5f5f5",
                      pathTransitionDuration: 0.5,
                    })}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-2xl sm:text-3xl text-[#242731]">
                      {user?.cis_score || 0}%
                    </span>
                  </div>
                  <svg style={{ height: 0 }}>
                    <defs>
                      <linearGradient id="gradient" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="50%" stopColor="#FFE88F" />
                        <stop offset="100%" stopColor="#FFA96E" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>

            {/* Badge Card */}
            <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col relative">
              {showBadgeLock && <LockOverlay message="Badge Locked" />}
              <div className="pb-3 flex items-center justify-between border-b border-black/10">
                <div className="flex items-center gap-2">
                  <div className="bg-[rgba(255,204,0,0.2)] w-8 h-8 rounded-full flex justify-center items-center shrink-0">
                    <img src={badge} alt="badge icon" className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-medium text-[#222224]">
                    Badge
                  </h3>
                </div>
                <button
                  onClick={() => setShareOpen(true)}
                  className="h-8 w-8 flex items-center justify-center rounded-full bg-white hover:bg-gray-50 shadow-sm"
                >
                  <img src={shareicon} alt="share icon" className="w-3 h-3" />
                </button>
              </div>
              {scoreData?.badge?.level ? (
                <div className="flex-1 flex items-center justify-center pt-4">
                  <img
                    src={
                      scoreData.badge.level === "Aspiring"
                        ? "https://cdn.cness.io/aspiringlogo.svg"
                        : "https://cdn.cness.io/inspired1.svg"
                    }
                    alt={`${scoreData.badge.level} Badge`}
                    className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain"
                  />
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">No badge earned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gradient Banner Section */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <img
            src={bg}
            alt="gradient background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative px-4 sm:px-6 py-8 md:py-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="font-['Poppins',Helvetica] font-semibold text-xl sm:text-2xl bg-linear-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent mb-3">
                Unlock Your Full Potential
              </h2>
              <p className="font-['Open_Sans'] text-sm text-[#242424] opacity-90">
                Advance through our certification levels to access exclusive
                features, expand your network, and amplify your conscious
                impact.
              </p>
            </div>
            <div className="mt-6">
              <CertificationPlans data={scoreData} />
            </div>
          </div>
        </div>

        {/* Rules Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3 pb-3 border-b border-[#E9EDF0] mb-4">
            <img
              src={icon1}
              alt="rules icon"
              className="w-6 h-6 sm:w-8 sm:h-8 mt-1"
            />
            <h3 className="text-base sm:text-lg font-medium text-[#081021]">
              Certification Renewal and Reassessment Rules
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={arrow}
                alt="bullet"
                className="w-4 h-4 mt-1 shrink-0"
              />
              <p className="text-sm text-[#222224]">
                Certification validity: 1 year.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <img
                src={arrow}
                alt="bullet"
                className="w-4 h-4 mt-1 shrink-0"
              />
              <p className="text-sm text-[#222224]">
                You are eligible for reassessment after 3 months if they seek a
                higher tier.
              </p>
            </div>
          </div>
        </div>
      </section>
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
};

export default UpgradeBadge;

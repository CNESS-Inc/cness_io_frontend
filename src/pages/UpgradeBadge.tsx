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

const UpgradeBadge = () => {
  const myid = localStorage.getItem("Id");
  const urldata = `${window.location.origin}/directory/user-profile/${myid}`;
  const tweetText = `Earned the CNESS Inspired Certification! Proud to lead with conscious values. Join us at cness.io`;
  const [user, setUser] = useState<any | null>(null);
  const [scoreData, setScoreData] = useState<any>(null);
  console.log("🚀 ~ UpgradeBadge ~ scoreData:", scoreData)
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

      // Generate HTML content for sections
      for (const section of data.array) {
        html += `<div style="margin-bottom: 25px;"><h2 style="margin-bottom: 10px;">Section: ${section.section.name} - (${section.section.weight} / ${section.section.total_weight})</h2>`;
        for (const sub of section.question_data) {
          html += `<div style="margin-bottom: 25px;"><h3>Sub Section: ${sub.sub_section.name} - (${sub.sub_section.weight} / 5)</h3>`;
          for (const ques of sub.questions) {
            html += `<p><b>Question:</b> ${ques.question}</p><ul>`;
            for (const ans of ques.answer) {
              if (ques.is_link) {
                html += `<li><a href="${ans}" target="_blank">Click To View Uploaded File</a></li>`;
              } else {
                html += `<li>${ans}</li>`;
              }
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
              }
              h1 {
                  color: #4CAF50;
              }
              h2 {
                  color: #333;
                  margin-top: 30px;
              }
              h3 {
                  color: #555;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
                  margin-bottom: 30px;
              }
              th, td {
                  border: 1px solid #ddd;
                  padding: 12px;
                  text-align: left;
              }
              th {
                  background-color: #4CAF50;
                  color: white;
              }
              tr:nth-child(even) {
                  background-color: #f2f2f2;
              }
              li {
                  color: #666;
              }
              a {
                  color: blue;
                  text-decoration: underline;
              }
              .footer {
                  margin-top: 20px;
                  font-style: italic;
                  color: #666;
              }
              .mb {
                  margin-bottom: 20px;
              }
          </style>
      </head>
      <body>
          <h1>CNESS Inspired Certification – Self-Assessment Report</h1>
          <p>This report is auto-generated based on your self-assessment for the CNESS Inspired Certification.</p>

          ${html}

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
              <tr>
                  <th colspan="2">Total Score</th>
                  <th colspan="2">${data.final_score} / 100</th>
              </tr>
          </table>

          <div class="footer">
              <p>Thank you for your dedication to conscious growth.</p>
              <p class="mb">Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
      </body>
      </html>`;

      // Generate PDF from HTML with correct typing
      const options = {
        margin: 10,
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
          before: ".section , #summary-table",
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

  // Lock overlay component for reusability
  const LockOverlay = ({ message }: { message: string }) => (
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
      <p className="text-sm text-gray-700 font-medium">{message}</p>
    </div>
  );

  // Conditions for showing lock overlays
  const showProgressLock = !scoreData?.is_assessment_submited;
  const showCISScoreLock = !scoreData?.is_assessment_submited || !scoreData?.is_submitted_by_head || scoreData?.cis_score === 0;
  const showBadgeLock = !scoreData?.badge?.level;

  return (
    <>
      <section className="w-full px-2 sm:px-4 lg:px-0.5 pt-4 pb-10">
        <header className="w-full">
          <div className="flex items-center justify-between">
            <div className="">
              <p className="font-['Poppins',Helvetica] text-2xl text-[#222224] font-semibold">
                Certification Journey
              </p>
            </div>
                          {
              scoreData?.cis_result.length > 0 ? (
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
                <div className="flex gap-2 items-center hidden">
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
        </header>
        <div className="pt-5 flex items-scretch justify-center w-full gap-3">
          {/* Progress Card with Lock Overlay */}
          <div className="w-3/5 bg-white rounded-xl p-6 relative">
            {showProgressLock && (
              <LockOverlay message="Complete Inspired Assessment to Unlock" />
            )}
            <div>
              <h1 className="font-['Poppins',Helvetica] font-medium text-base text-wrap bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                You're making great progress
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-sm font-light text-[#242424]">
                You've successfully achieved Aspired certification and are
                currently working towards Inspired level. Complete the remaining
                requirements to unlock your next milestone.
              </h5>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="text-xl md:text-2xl text-[#222224] font-medium">
                  {scoreData?.cis_score || 0}%
                </div>
                <div
                  className={`font-['Poppins',Helvetica] text-sm md:text-base font-medium ${
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
                    className={`flex-1 h-5 md:h-[24px] rounded ${
                      index <
                      Math.floor((user?.assesment_progress || 0) / (100 / 6))
                        ? "bg-gradient-to-b from-[rgba(79,70,229,1)] to-[rgba(151,71,255,1)]"
                        : "bg-[#EDEAFF]"
                    }`}
                  />
                ))}
              </div>
              <h5 className="py-3 font-['Poppins',Helvetica] text-xs font-medium text-[#818181]">
                A score above 70 indicates a level of inspiration.
              </h5>
            </div>
          </div>

          {/* CIS Score Card with Lock Overlay */}
          <div className="w-1/5 bg-white rounded-xl px-3 pt-3 pb-6 relative">
            {showCISScoreLock && (
              <LockOverlay 
                message={
                  !scoreData?.is_assessment_submited 
                    ? "Complete Inspired Assessment to Unlock" 
                    : !scoreData?.is_submitted_by_head 
                    ? "Score Under Review" 
                    : "Score Not Available"
                } 
              />
            )}
            <div className="pb-3 flex justify-start items-center gap-[14px] border-b border-black/10">
              <div className="bg-[rgba(232,205,253,0.2)] w-8 h-8 rounded-full padding-[5px] flex justify-center items-center">
                <img
                  src={score}
                  alt="score icon"
                  className="w-[18px] h-[18px]"
                />
              </div>
              <h5 className="py-3 font-['Poppins',Helvetica] text-base font-medium text-[#222224]">
                CIS Score
              </h5>
            </div>
            <div className="pt-5 flex justify-center">
              <div className="relative w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[147px] md:h-[147px]">
                <CircularProgressbar
                  value={user?.profile_progress}
                  strokeWidth={10}
                  styles={buildStyles({
                    rotation: 0.6,
                    pathColor: "url(#gradient)",
                    trailColor: "#f5f5f5",
                    textColor: "#242731",
                    pathTransitionDuration: 0.5,
                  })}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-['open sans'] font-bold text-[28px] sm:text-[31.51px] text-[#242731]">
                    {user?.profile_progress}%
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

          {/* Badge Card with Lock Overlay */}
          <div className="w-1/5 bg-white rounded-xl px-3 pt-3 pb-6 flex flex-col relative">
            {showBadgeLock && (
              <LockOverlay message="Badge Locked" />
            )}
            <div className="pb-3 flex items-center justify-between w-full gap-[14px] border-b border-black/10">
              <div className="flex items-center gap-2">
                <div className="bg-[rgba(255,204,0,0.2)] w-8 h-8 rounded-full padding-[5px] flex justify-center items-center">
                  <img
                    src={badge}
                    alt="badge icon"
                    className="w-[18px] h-[18px]"
                  />
                </div>
                <h5 className="py-3 font-['Poppins',Helvetica] text-base font-medium text-[#222224]">
                  Badge
                </h5>
              </div>

              <button
                onClick={() => setShareOpen(true)}
                className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white hover:bg-[#EEF0F5]"
                style={{ boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.1)" }}
              >
                <img
                  src={shareicon}
                  alt="share icon"
                  className="w-[12px] h-[12px]"
                />
              </button>
            </div>
            {scoreData?.badge?.level ? (
              <div className="flex-1 flex items-center justify-center ">
                <img
                  src={
                    scoreData.badge.level === "Aspiring"
                      ? "https://cdn.cness.io/aspiring.webp"
                      : "https://cdn.cness.io/inspired.webp"
                  }
                  alt={`${scoreData.badge.level} Badge`}
                  className="max-w-[136px] h-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-[87px]"></div>
            )}
          </div>
        </div>
        
        {/* Rest of your component remains the same */}
        <div className="relative my-5 flex flex-col items-center justify-center w-full h-full px-6 pt-6 pb-8 md:pb-12 rounded-xl">
          <img
            src={bg}
            alt="gradient"
            className="absolute top-0 left-0 w-full h-full object-cover rounded-xl"
          />
          <div className="relative flex flex-col items-center justify-center text-center gap-3 py-3 px-6">
            <h1 className="font-['Poppins',Helvetica] font-semibold text-2xl text-wrap bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
              Unlock Your Full Potential
            </h1>
            <h5 className="font-['Open_Sans',Helvetica] text-sm font-light text-[#242424] w-[64%]">
              Advance through our certification levels to access exclusive
              features, expand your network, and amplify your conscious impact.
            </h5>
          </div>
          <div className="w-full relative">
            <CertificationPlans data={scoreData} />
          </div>
        </div>
        <div className="my-5 bg-white flex flex-col w-full h-full px-[18px] pt-[18px] pb-6 rounded-xl">
          <div className="flex flex-col gap-2">
            <div className="flex justify-start items-center gap-2 border-b border-[#E9EDF0] pb-3">
              <img src={icon1} alt="icon" className="w-[32px] h-[32px]" />
              <h3 className="font-['Poppins',Helvetica] text-base font-medium text-[#081021]">
                Certification Renewal and Reassessment Rules
              </h3>
            </div>
            <div className="space-y-3">
              <div className="pt-3 flex justify-start items-center gap-3">
                <img src={arrow} alt="icon" className="w-4 h-4" />
                <h3 className="font-['Open_Sans',Helvetica] text-sm font-normal text-[#222224]">
                  Certification validity: 1 year.
                </h3>
              </div>

              <div className="pt-3 flex justify-start items-center gap-3">
                <img src={arrow} alt="icon" className="w-4 h-4" />
                <h3 className="font-['Open_Sans',Helvetica] text-sm font-normal text-[#222224]">
                  You are eligible for reassessment after 3 months if they seek
                  a higher tier.
                </h3>
              </div>

              <div className="pt-3 flex justify-start items-start gap-3">
                <img src={arrow} alt="icon" className="w-4 h-4 mt-0.5" />
                <div className="text-sm text-[#222224] font-['Open_Sans',Helvetica] font-normal space-y-1">
                  <p>Renewal requires:</p>
                  <ul className="list-disc list-inside pl-2 space-y-1">
                    <li>LMS course completion.</li>
                    <li>Proof of continuous improvement.</li>
                    <li>Shortened reassessment form submission.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
};

export default UpgradeBadge;
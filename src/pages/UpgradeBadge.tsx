import { useEffect, useState } from "react";
import { DashboardDetails } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import score from "../assets/score.svg";
import badge from "../assets/badge.svg";
import logo from "../assets/cnesslogo.svg";
import bg from "../assets/certification_bg.png";
import icon1 from "../assets/Frame 1.svg";
import arrow from "../assets/arrow.svg";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import CertificationPlans from "../components/sections/Certification/CertificationPlans";

const UpgradeBadge = () => {
  const [user, setUser] = useState<any | null>(null);
  const { showToast } = useToast();

  const fetchDashboard = async () => {
    try {
      const response: any = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
        localStorage.setItem("name", response.data.data?.name);
        // localStorage.setItem("profile_picture",response.data.data?.profile_picture);
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);
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
            <div className="flex items-center justify-center gap-3 pr-3">
              <button
                type="submit"
                className="font-['Plus Jakarta Sans'] rounded-full px-6 py-2 text-xs font-medium text-[#64748B] hover:text-white bg-white hover:bg-[#5e5ecc] transition-colors duration-500 ease-in-out"
                style={{
                  border: "1px solid rgba(236, 238, 242, 1)",
                  boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                Share
              </button>
              <button
                type="submit"
                className="font-['Plus Jakarta Sans'] rounded-full px-8 py-2 text-xs font-medium text-white bg-[#FF708A] hover:bg-[#5e5ecc] transition-colors duration-500 ease-in-out"
                style={{
                  boxShadow: "0px 4px 8px 0px rgba(0, 0, 0, 0.1)",
                }}
              >
                Share
              </button>
            </div>
          </div>
        </header>
        <div className="pt-5 flex items-scretch justify-center w-full gap-3">
          <div className="w-3/5 bg-white rounded-xl p-6">
            <div>
              <h1 className="font-['Poppins',Helvetica] font-medium text-base text-wrap bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">
                You’re making great progress
              </h1>
              <h5 className="py-3 font-['Open_Sans',Helvetica] text-sm font-normal text-[#7A7A7A]">
                You've successfully achieved Aspired certification and are
                currently working towards Inspired level. Complete the remaining
                requirements to unlock your next milestone.
              </h5>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="text-xl md:text-2xl text-[#222224] font-medium">
                  {user?.assesment_progress || 0}%
                </div>
                <div
                  className={`font-['Poppins',Helvetica] text-sm md:text-base font-medium ${
                    (user?.assesment_progress || 0) >= 100
                      ? "text-[#4CAF50]" // Green color for completed
                      : "text-[#9747ff]" // Purple color for in progress
                  }`}
                >
                  {(user?.assesment_progress || 0) >= 100
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
          <div className="w-1/5 bg-white rounded-xl px-3 pt-3 pb-6">
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
                {/* Custom-styled text overlaid manually */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-['open sans'] font-bold text-[28px] sm:text-[31.51px] text-[#242731]">
                    {user?.profile_progress}%
                  </span>
                </div>

                {/* Gradient definition */}
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
          <div className="w-1/5 bg-white rounded-xl px-3 pt-3 pb-6 flex flex-col">
            <div className="pb-3 flex justify-start items-center gap-[14px] border-b border-black/10">
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
            <div className="flex-1 flex items-center justify-center">
              <img
                src={logo}
                alt="badge logo"
                className="max-w-[136px] h-auto object-contain"
              />
            </div>
          </div>
        </div>
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
            <h5 className="font-['Open_Sans',Helvetica] text-sm font-normal text-[#7A7A7A] w-[64%]">
              Advance through our certification levels to access exclusive
              features, expand your network, and amplify your conscious impact.
            </h5>
          </div>
          <div className="w-full relative">
            <CertificationPlans />
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
                  Organizations eligible for reassessment after 3 months if they
                  seek a higher tier.
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

              <div className="pt-3 flex justify-start items-center gap-3">
                <img src={arrow} alt="icon" className="w-4 h-4" />
                <h3 className="font-['Open_Sans',Helvetica] text-sm font-normal text-[#222224]">
                  Organizations eligible for reassessment after 3 months if they
                  seek a higher tier.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UpgradeBadge;
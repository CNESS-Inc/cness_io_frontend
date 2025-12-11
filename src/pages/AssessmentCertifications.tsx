import Button from "../components/ui/Button";
import list1 from "../assets/list1.svg";
import list2 from "../assets/list2.svg";
import list3 from "../assets/list3.svg";
import list4 from "../assets/list4.svg";
import { useNavigate, useLocation } from "react-router-dom";
import Nomimationmodel from "../components/Nomination/Nominationapp";
import { useEffect, useState, useRef } from "react";
import { GetCertificationDetails } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

interface Certification {
  profile_progress: number;
  level: string;
  slug: string;
  message: string | null;
  status: number;
  start_date: string | null;
  end_date: string | null;
  nomination_form_submited?: boolean;
}

const AssessmentCertification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  // Refs for each section
  const aspiringRef = useRef<HTMLDivElement>(null);
  const inspiredRef = useRef<HTMLDivElement>(null);
  const leaderRef = useRef<HTMLDivElement>(null);
  console.log("Location state:", location.state);

  const fetchCertificationDetails = async () => {
    try {
      const response = await GetCertificationDetails();
      const res = response?.data?.data || [];
      setCertifications(res);
    } catch (error: any) {
      showToast({
        message:
          error?.response?.data?.error?.message || "Failed to fetch questions",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchCertificationDetails();
  }, []);

  // Scroll to section based on URL state or parameters
  useEffect(() => {
    // Check if we have scroll target in location state
    const scrollToSection = location.state?.scrollTo;

    if (scrollToSection) {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        switch (scrollToSection) {
          case "inspired":
            inspiredRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          case "aspiring":
            aspiringRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          case "leader":
            leaderRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            break;
          default:
            break;
        }

        // Clear the state to prevent scrolling on subsequent renders
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location.state]);

  // Helper function to get certification by slug
  const getCertificationBySlug = (slug: string): Certification | undefined => {
    return certifications.find((cert) => cert.slug === slug);
  };

  // Helper function to render button or message based on status
  const renderCertificationStatus = (
    slug: string,
    buttonText: string,
    navigateTo: string
  ) => {
    const cert = getCertificationBySlug(slug);
    if (!cert) return null;

    const isLeaderDisabled = slug === "leader" && cert.status === 0;

    // Check if previous certification is required and completed
    const isPreviousLevelCompleted = () => {
      if (slug === "inspired") {
        // For Inspired, check if Aspiring is completed (status 1 or 2)
        const aspiringCert = getCertificationBySlug("aspiring");
        return (
          aspiringCert &&
          (aspiringCert.status === 1 || aspiringCert.status === 2)
        );
      }
      if (slug === "leader") {
        // For Leader, check if Aspiring is completed (status 1 or 2)
        const aspiringCert = getCertificationBySlug("aspiring");
        return (
          aspiringCert &&
          (aspiringCert.status === 1 || aspiringCert.status === 2)
        );
      }
      return true; // No previous level required for Aspiring
    };

    const handleButtonClick = () => {
      if (cert.profile_progress !== 100) {
        showToast({
          message:
            "Please complete your profile first before applying for certification",
          type: "error",
          duration: 5000,
        });
        return;
      }

      // Check if previous level is completed for Inspired and Leader
      if (slug === "inspired" && !isPreviousLevelCompleted()) {
        const requiredLevel = slug === "inspired" ? "Aspiring" : "Aspiring";
        showToast({
          message: `You need to complete ${requiredLevel} certification first before applying for ${slug} certification`,
          type: "error",
          duration: 5000,
        });
        return;
      }

      if (isLeaderDisabled) {
        setIsModalOpen(true);
      } else {
        navigate(navigateTo);
      }
    };

    if (cert.status === 0) {
      // For Inspired and Leader, check if previous level is completed
      if (slug === "inspired" && !isPreviousLevelCompleted()) {
        const requiredLevel = slug === "inspired" ? "Aspiring" : "Aspiring";
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="font-['Open_Sans'] font-normal text-[14px] leading-[160%] text-yellow-800">
              You need to complete {requiredLevel} certification first before
              applying for {slug} certification.
            </p>
          </div>
        );
      }

      // For Leader specifically, show disabled button if Aspiring not completed
      if (slug === "leader" && !isPreviousLevelCompleted()) {
        return (
          <button
            disabled
            className="font-plusJakarta font-medium text-[16px] leading-[100%] text-center text-gray-400 px-5 py-4 rounded-full transition-all duration-300 ease-out bg-gray-200 cursor-not-allowed"
          >
            {buttonText}
          </button>
        );
      }

      return (
        <>
          <button
            onClick={handleButtonClick}
            className={`font-plusJakarta font-medium text-[16px] leading-[100%] text-center text-white px-5 py-4 rounded-full transition-all duration-300 ease-out bg-linear-to-r from-[#7077FE] to-[#F07EFF] hover:opacity-90`}
          >
            {buttonText}
          </button>
        </>
      );
    } else if (cert.status === 1 || cert.status === 2) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="font-['Open_Sans'] font-normal text-[14px] leading-[160%] text-blue-800">
            {cert.message ||
              `Your ${cert.level} certification is ${
                cert.status === 1 ? "pending approval" : "approved"
              }.`}
          </p>
          {cert.start_date && cert.end_date && (
            <p className="font-['Open_Sans'] font-normal text-[12px] leading-[160%] text-blue-600 mt-2">
              Valid from {new Date(cert.start_date).toLocaleDateString()} to{" "}
              {new Date(cert.end_date).toLocaleDateString()}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  // Helper function specifically for Leader nomination button
  const renderLeaderNominationButton = () => {
    const leaderCert = getCertificationBySlug("leader");
    const aspiringCert = getCertificationBySlug("aspiring");

    if (leaderCert?.nomination_form_submited) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-1">
          <p className="font-['Open_Sans'] font-normal text-[14px] leading-[160%] text-blue-800">
            Your nomination details have been submitted.
          </p>
        </div>
      );
    }

    const isAspiringCompleted =
      aspiringCert && (aspiringCert.status === 1 || aspiringCert.status === 2);

    return (
      <Button
        onClick={() => isAspiringCompleted && setIsModalOpen(true)}
        variant="white-outline"
        disabled={!isAspiringCompleted}
        className={`font-plusJakarta font-medium text-[16px] leading-[100%] tracking-[0] text-center px-5 py-2.5 rounded-full ${
          isAspiringCompleted
            ? "text-black border border-[#9C4DF4] bg-gray-50 hover:bg-gray-100 cursor-pointer"
            : "text-gray-400 border border-gray-300 bg-gray-100 cursor-not-allowed"
        }`}
      >
        Nominate a Leader
      </Button>
    );
  };

  const isAspiringCompleted = () => {
    const cert = getCertificationBySlug("aspiring");
    return cert && (cert.status === 1 || cert.status === 2);
  };

  const isInspiredCompleted = () => {
    const cert = getCertificationBySlug("inspired");
    return cert && (cert.status === 1 || cert.status === 2);
  };

  return (
    <>
      <h2 className="font-[poppins] font-medium text-[20px] md:text-[24px] text[#000000] mb-8 mt-2 text-center md:text-left px-2">
        Know Our Certifications
      </h2>

      {/* Aspiring Section */}
      <section
        ref={aspiringRef}
        className="bg-white rounded-2xl py-12 px-5 sm:px-8 md:px-16 border-b border-gray-100"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-3 space-y-2 md:space-y-0 mb-6">
          <img
            src="https://cdn.cness.io/aspiringlogo.svg"
            alt="Aspiring Certification"
            className="w-15 h-15"
          />
          <div>
            <h3 className="font-[poppins] font-medium text-[24px] leading-[115%] tracking-[0] text[#000000] ">
              Aspiring Certification
            </h3>
            <p className="font-[poppins] font-medium text-[14px] leading-[100%] tracking-[0] text-black-500 mt-3">
              Start your conscious journey
            </p>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Section */}
          <div>
            <h4 className="font-[poppins] font-semibold text-[26px] md:text-[34px] leading-[140%] tracking-[0] text[#000000] mb-3">
              Get Your Aspiring Certification in 2 Steps
            </h4>

            <ol className="list-decimal list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] text-[#1E1E1E] space-y-2 mb-6">
              <li>
                Complete these True Profile fields (First & Last Name,
                Profession, Date of Birth, Phone Number, Email, and Country)
              </li>
              <li>Select Conscious Values you aspire to follow</li>
            </ol>

            {/* Conditionally render button or message */}
            {renderCertificationStatus(
              "aspiring",
              "Start Your Journey",
              "/dashboard/aspiring-assessment"
            )}

            {/* Description */}
            <div className="mt-8">
              <h5 className="font-[poppins] font-medium text-[16px] leading-[100%] tracking-[0] text[#000000] mb-2">
                What It Means:
              </h5>
              <ul className="list-disc list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
                <li>
                  Your first step toward a conscious professional identity.
                </li>
                <li>
                  Aspiring certification represents your intent and alignment
                  with conscious values.
                </li>
              </ul>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col space-y-3 md:items-end items-center mt-4 sm:mt-4 md:mt-8">
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://cdn.cness.io/aspiringcard.svg"
                alt="Aspiring Certification Card"
                className="w-[250px] h-[271px] md:w-[275px] md:h-[271px] drop-shadow-md"
              />
              <div className="font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-center md:translate-x-4 sm:translate-x-2">
                Price: $9/month
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-10">
          <h5 className="font-[poppins] font-semibold text-[20px] leading-[100%] tracking-[0] text[#000000] mb-4">
            Unlocks Trust, Growth, and Purpose
          </h5>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                title: "Marketplace listing access",
                desc: "Start selling and grow your business on our marketplace.",
              },
              {
                title: "Directory Listing",
                desc: "Get discovered by showcasing your profile in our directory.",
              },
              {
                title: "Aspiring badge",
                desc: "Let your conscious intent shine out into the world.",
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: "12px",
                  background: "#F9FAFB",
                  padding: "20px",
                }}
              >
                <svg
                  key={i}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                    pointerEvents: "none",
                  }}
                >
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="12"
                    ry="12"
                    stroke="#D1D5DB"
                    strokeWidth="1"
                    strokeDasharray="5,7"
                    fill="none"
                  />
                </svg>

                <h6 className="font-[poppins] font-medium text-[14.76px] leading-[22.14px] tracking-[-0.03em] text-[#000000] mb-2 align-middle">
                  {item.title}
                </h6>
                <p className="font-['Open_Sans'] font-normal text-[14px] leading-[18.01px] tracking-[0px] text-[#64748B]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspired Section */}

      <div className="relative">
        {/* Glassy overlay when locked */}
        {!isAspiringCompleted() && (
          <div
            className="
        absolute inset-0
        bg-white/10
       
        flex items-center justify-center 
        z-10 
        rounded-2xl
      "
          >
            <div className="flex flex-col items-center">
              {/* Your custom lock icon */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-600"
              >
                <path
                  d="M17 10H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z"
                  fill="#4F46E5"
                  fillOpacity="0.85"
                />
                <path
                  d="M12 2a4 4 0 00-4 4v4h2V6a2 2 0 114 0v4h2V6a4 4 0 00-4-4z"
                  fill="#4F46E5"
                />
              </svg>
              <p className="text-gray-700 font-medium text-sm">
                Complete Aspiring to Unlock
              </p>
            </div>
          </div>
        )}

        <section
          ref={inspiredRef}
          className={`bg-white rounded-2xl py-16 px-6 md:px-16 border-b border-gray-100 mt-6 
      ${!isAspiringCompleted() ? "opacity-40 pointer-events-none" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <img
              src="https://cdn.cness.io/inspiredlogo.svg"
              alt="Inspired Certification"
              className="w-15 h-15"
            />
            <div>
              <h3 className="font-[poppins] font-medium text-[24px] leading-[115%] tracking-[0] text[#000000]">
                Inspired Certification
              </h3>
              <p className="font-[poppins] font-medium text-[14px] leading-[100%] tracking-[0] text-black-500 mt-3">
                Unlock the next tier of recognition and capability.
              </p>
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-10 items-start">
            {/* Left Section */}
            <div>
              <h4 className="font-[poppins] font-semibold text-[34px] leading-[140%] tracking-[0] text[#000000] mb-3">
                Earn your Inspired Certification in one simple step.
              </h4>

              <ol className="list-decimal list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
                <li>
                  Upload proofs under Conscious Pillars <br />
                  (Mission, Ethics, Team Spirit, Community, and Leadership)
                </li>
              </ol>

              {/* Conditionally render button or message */}
              {renderCertificationStatus(
                "inspired",
                "Upgrade To Inspired",
                "/dashboard/inspired-assessment"
              )}

              {/* Description */}
              <div className="mt-8">
                <h5 className="font-[poppins] font-medium text-[16px] leading-[100%] tracking-[0] text[#000000] mb-2">
                  What It Means:
                </h5>
                <ul className="list-disc list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
                  <li>
                    The Inspired level validates your conscious actions and
                    professional contributions.
                  </li>
                  <li>
                    It reflects proof-based alignment with CNESS values and
                    credibility within the ecosystem.
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col space-y-3 md:items-end items-center mt-4 sm:mt-4 md:mt-8">
              <div className="flex flex-col items-center space-y-2">
                <img
                  src="https://cdn.cness.io/inspired.svg"
                  alt="Inspired Certification Card"
                  className="w-[250px] h-[271px] md:w-[275px] md:h-[271px] drop-shadow-md"
                />
                {/*<div className="font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-center md:translate-x-4 sm:translate-x-2">
                Price: $108
              </div>*/}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-10">
            <h5 className="font-[poppins] font-semibold text-[20px] leading-[100%] tracking-[0] text[#000000] mb-4">
              What you will gain with Inspired certification
            </h5>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  title: "Premium Directory visibility",
                  desc: "Gain enhanced visibility in the premium directory",
                },
                //{
                //title: "Ability to Create Circles",
                // desc: "build your own conscious community",
                //},
                //{
                //  title: "Eligibility for",
                //  desc: "Featured stories, collaborations, and partner projects",
                //},
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    background: "#F9FAFB",
                    padding: "20px",
                  }}
                >
                  <svg
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px",
                      pointerEvents: "none",
                    }}
                  >
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="12"
                      ry="12"
                      stroke="#D1D5DB"
                      strokeWidth="1"
                      strokeDasharray="5,7"
                      fill="none"
                    />
                  </svg>

                  <h6 className="font-[poppins] font-medium text-[14.76px] leading-[22.14px] tracking-[-0.03em] text-[#000000] mb-2 align-middle">
                    {item.title}
                  </h6>
                  <p className="font-['Open_Sans'] font-normal text-[14px] leading-[18.01px] tracking-[0px] text-[#64748B]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Leader Section */}
      <div className="relative">
        {/* Glassy overlay when locked */}
        {!isInspiredCompleted() && (
          <div
            className="
        absolute inset-0
        bg-white/10 
       
        flex items-center justify-center 
        z-10 
        rounded-2xl
      "
          >
            <div className="flex flex-col items-center">
              {/* Your custom lock icon */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-indigo-600"
              >
                <path
                  d="M17 10H7a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2z"
                  fill="#4F46E5"
                  fillOpacity="0.85"
                />
                <path
                  d="M12 2a4 4 0 00-4 4v4h2V6a2 2 0 114 0v4h2V6a4 4 0 00-4-4z"
                  fill="#4F46E5"
                />
              </svg>
              <p className="text-gray-700 font-medium text-sm">
                Complete Inspired to Unlock
              </p>
            </div>
          </div>
        )}

        <section
          ref={leaderRef}
          className={`bg-white rounded-2xl py-16 px-6 md:px-16 border-b border-gray-100 mt-6 
      ${!isInspiredCompleted() ? "opacity-40 pointer-events-none" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <img
              src="https://cdn.cness.io/leaderlogo.svg"
              alt="Leader Certification"
              className="w-15 h-15"
            />
            <div>
              <h3 className="font-[poppins] font-medium text-[24px] leading-[115%] tracking-[0] text[#000000]">
                Leader Certification
              </h3>
              <p className="font-[poppins] font-medium text-[14px] leading-[100%] tracking-[0] text-black-500 mt-3">
                Prove your leadership standards. Earn a verifiable badge.
              </p>
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-10 items-start">
            {/* Left Section */}
            <div className="md:col-span-2">
              <h4 className="font-[poppins] font-semibold text-[34px] leading-[140%] tracking-[0] text-gray-900 mb-3">
                Who Is Eligible for This Level of Certification?
              </h4>

              <ol className="list-decimal list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
                <li>You lead teams or initiatives.</li>
                <li>You influence decisions, budgets, or outcomes.</li>
                <li>You commit to transparent, people-first practices.</li>
              </ol>

              {/* Conditionally render buttons or message for Leader */}
              <div className="flex flex-col md:flex-row items-center gap-3">
                {renderCertificationStatus(
                  "leader",
                  "Apply for Leader Certification",
                  "/dashboard/leader-application"
                )}

                {/* Use the separate helper for nomination button */}
                {renderLeaderNominationButton()}
              </div>

              {/* Nomination Process */}
              <div className="w-full max-w-[639px] rounded-[30px] border border-gray-200 bg-[#FAFAFA] flex flex-col gap-3.5 p-6 md:p-[30px] px-10 mt-10">
                <h4 className="font-[poppins] font-semibold text-[18px] leading-[120%] text[#000000] mb-3">
                  Nomination Process
                </h4>

                <p className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-1">
                  There are two paths to becoming a Leader:
                </p>

                {/* Apply as a Leader */}
                <div className="mb-4">
                  <h5 className="font-[poppins] font-medium text-[16px] leading-[120%] text[#000000] mb-2">
                    Apply as a Leader (Self-Nomination):
                  </h5>
                  <ul className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-gray-700 space-y-1">
                    <li className="flex items-start gap-3">
                      <img
                        src={list1}
                        alt="bullet"
                        className="w-7 h-7 mt-1 shrink-0"
                      />
                      <span className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E]">
                        Inspired users can apply for Leader Certification
                        directly.
                      </span>
                    </li>

                    <li className="flex items-start gap-3">
                      <img
                        src={list2}
                        alt="bullet"
                        className="w-7 h-7 mt-1 shrink-0"
                      />
                      <span className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E]">
                        They fill out a reflection-based form and submit their
                        conscious leadership story.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Nominate a Leader */}
                <div>
                  <h5 className="font-[poppins] font-medium text-[16px] leading-[120%] text[#000000] mb-2">
                    Nominate a Leader:
                  </h5>
                  <ul className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-1">
                    <li className="flex items-start gap-3">
                      <img
                        src={list3}
                        alt="bullet"
                        className="w-7 h-7 mt-0.5 shrink-0"
                      />
                      <span className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E]">
                        Any certified (Aspiring/Inspired) user can nominate a
                        deserving individual.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <img
                        src={list4}
                        alt="bullet"
                        className="w-7 h-7 mt-0.5 shrink-0"
                      />
                      <span className="font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E]">
                        The form captures the nominee's profile, reason for
                        nomination, and evidence of impact.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h5 className="font-[poppins] font-medium text-[16px] leading-[100%] tracking-[0] text[#000000] mb-2">
                  What It Means:
                </h5>
                <ul className="list-disc list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
                  <li>
                    The Leader Certification honors visionaries and changemakers
                    who inspire others through conscious leadership, measurable
                    impact, and authentic influence.
                  </li>
                  <li>
                    It is nomination or application-based, recognizing those
                    shaping the future of conscious business and living.
                  </li>
                </ul>
              </div>

              <div className="mt-8">
                <h5 className="font-[poppins] font-medium text-[16px] leading-[100%] tracking-[0] text[#000000] mb-2">
                  Program inclusions
                </h5>
                <ul className="list-disc list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
                  <li>Self-assessment + scenario tasks</li>
                  <li>Peer/mentor feedback option</li>
                  <li>Score report with strengths & focus areas</li>
                  <li>Badge + profile placement + directory highlight</li>
                </ul>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col space-y-3 md:items-end items-center mt-8 md:col-span-1">
              <div className="flex flex-col items-center space-y-2">
                <img
                  src="https://cdn.cness.io/leader1.svg"
                  alt="Leader Certification Card"
                  className="w-[200px] h-auto md:w-[275px] md:h-[271px] drop-shadow-md"
                />
                {/*<div className="font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-center md:translate-x-4 sm:translate-x-2">
                Price: $508
              </div>*/}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-10">
            <h5 className="font-[poppins] font-semibold text-[20px] leading-[100%] tracking-[0] text[#000000] mb-4">
              Unlocks Trust, Growth, and Purpose
            </h5>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  title: "Credibility",
                  desc: "A verifiable badge you can share on LinkedIn and your profile.",
                },
                {
                  title: "Trust",
                  desc: "A clear, public standard your team and partners can rely on.",
                },
                {
                  title: "Growth",
                  desc: "Access to curated mentors, partner programs, and speaking opportunities.",
                },
                {
                  title: "Purpose",
                  desc: "A framework to align daily decisions with your values.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: "12px",
                    background: "#F9FAFB",
                    padding: "20px",
                  }}
                >
                  <svg
                    key={i}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "12px",
                      pointerEvents: "none",
                    }}
                  >
                    <rect
                      x="1"
                      y="1"
                      width="calc(100% - 2px)"
                      height="calc(100% - 2px)"
                      rx="12"
                      ry="12"
                      stroke="#D1D5DB"
                      strokeWidth="1"
                      strokeDasharray="5,7"
                      fill="none"
                    />
                  </svg>

                  <h6 className="font-[poppins] font-medium text-[14.76px] leading-[22.14px] tracking-[-0.03em] text-[#000000] mb-2 align-middle">
                    {item.title}
                  </h6>
                  <p className="font-['Open_Sans'] font-normal text-[14px] leading-[18.01px] tracking-[0px] text-[#64748B]">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      {isModalOpen && (
        <Nomimationmodel
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            fetchCertificationDetails();
          }}
        />
      )}
    </>
  );
};

export default AssessmentCertification;

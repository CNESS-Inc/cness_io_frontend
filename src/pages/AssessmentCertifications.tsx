import Button from "../components/ui/Button";
import list1 from "../assets/list1.svg";
import list2 from "../assets/list2.svg";
import list3 from "../assets/list3.svg";
import list4 from "../assets/list4.svg";
import { useNavigate } from "react-router-dom";
import Nomimationmodel from "../components/Nomination/Nominationapp";
import { useEffect, useState } from "react";
import { GetCertificationDetails } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

interface Certification {
  level: string;
  slug: string;
  message: string | null;
  status: number;
  start_date: string | null;
  end_date: string | null;
  nomination_form_submited?: boolean; // Add this optional field
}

const AssessmentCertification = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const fetchCertificationDetails = async () => {
    try {
      const response = await GetCertificationDetails();
      const res = response?.data?.data || [];
      console.log("🚀 ~ fetchCertificationDetails ~ res:", res);
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

    // Disable leader button when status is 0
    const isLeaderDisabled = slug === "leader" && cert.status === 0;

    if (cert.status === 0) {
      return (
        <button
          onClick={() => !isLeaderDisabled && navigate(navigateTo)}
          disabled={isLeaderDisabled}
          className={`font-plusJakarta font-medium text-[16px] leading-[100%] text-center text-white px-5 py-2.5 rounded-full transition-all duration-300 ease-out
          ${
            isLeaderDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-[#7077FE] to-[#F07EFF] hover:opacity-90"
          }`}
        >
          {buttonText}
        </button>
      );
    } else if (cert.status === 1 || cert.status === 2) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="font-['Open_Sans'] font-normal text-[14px] leading-[160%] text-blue-800">
            {cert.message}
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
  // Helper function specifically for Leader nomination button
  const renderLeaderNominationButton = () => {
    const leaderCert = getCertificationBySlug("leader");
    const aspiringCert = getCertificationBySlug("aspiring");

    // Check if nomination form has been submitted
    if (leaderCert?.nomination_form_submited) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-1">
          <p className="font-['Open_Sans'] font-normal text-[14px] leading-[160%] text-blue-800">
            Your nomination details have been submitted.
          </p>
        </div>
      );
    }

    // Check if Aspiring certification has status 1 or 2 (enabled condition)
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

  return (
    <>
      <h2 className="font-[poppins] font-medium text-[20px] md:text-[24px] text[#000000] mb-8 mt-5 text-center md:text-left">
        Know Our Certifications
      </h2>

      {/* Aspiring Section */}
      <section className="bg-white rounded-2xl py-12 px-4 sm:px-8 md:px-16 border-b border-gray-100">
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
            <p className="font-[poppins] font-medium text-[14px] leading-[100%] tracking-[0] text-black-500 mt-2">
              Start your conscious journey
            </p>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Section */}
          <div>
            <h4 className="font-[poppins] font-semibold text-[26px] md:text-[34px] leading-[100%] tracking-[0] text[#000000] mb-3">
              Get Your Aspiring Certification in 2 Steps
            </h4>

            <ol className="list-decimal list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] text-[#1E1E1E] space-y-2 mb-6">
              <li>
                Complete your True Profile (photo, bio, contact, profession,
                interests)
              </li>
              <li>Select 5 Conscious Values you aspire to follow</li>
            </ol>

            {/* Conditionally render button or message */}
            {renderCertificationStatus(
              "aspiring",
              "Get Aspiring Badge",
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
                src="https://cdn.cness.io/aspiring1.svg"
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
                title: "Aspiring Creator directory visibility",
                desc: "Get discovered by showcasing your profile in our directory.",
              },
              {
                title: "Feed visibility boost",
                desc: "Increase your content reach and get noticed in the feed.",
              },
              {
                title: "Community participation",
                desc: "Join discussions and connect with like-minded members.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5"
                style={{ borderWidth: "3px" }}
              >
                <h6 className="font-[poppins] font-medium text-[14.76px] leading-[22.14px] tracking-[-0.03em] text[#000000] mb-2 align-middle">
                  {item.title}
                </h6>
                <p className="font-['Open_Sans'] font-normal text-[12px] leading-[18.01px] tracking-[0px] text-[#64748B]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspired Section */}
      <section className="bg-white rounded-2xl py-16 px-6 md:px-16 border-b border-gray-100 mt-6">
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
            <p className="font-[poppins] font-medium text-[14px] leading-[100%] tracking-[0] text-black-500 mt-2">
              Start your conscious journey
            </p>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Left Section */}
          <div>
            <h4 className="font-[poppins] font-semibold text-[34px] leading-[100%] tracking-[0] text[#000000] mb-3">
              Get Your Inspired Certification in 1 Step
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
              <div className="font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-center md:translate-x-4 sm:translate-x-2">
                Price: $108
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
                title: "Premium Directory visibility",
                desc: "Start selling and grow your business on our marketplace.",
              },
              {
                title: "Ability to Create Circles",
                desc: "build your own conscious community",
              },
              {
                title: "Eligibility for",
                desc: "Featured stories, collaborations, and partner projects",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5"
                style={{ borderWidth: "3px" }}
              >
                <h6 className="font-[poppins] font-medium text-[14.76px] leading-[22.14px] tracking-[-0.03em] text[#000000] mb-2 align-middle">
                  {item.title}
                </h6>
                <p className="font-['Open_Sans'] font-normal text-[12px] leading-[18.01px] tracking-[0px] text-[#64748B]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leader Section */}
      <section className="bg-white rounded-2xl py-16 px-6 md:px-16 border-b border-gray-100 mt-6">
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
            <p className="font-[poppins] font-medium text-[14px] leading-[100%] tracking-[0] text-black-500 mt-2">
              Lead the conscious revolution.
            </p>
          </div>
        </div>

        <hr className="border-gray-200 mb-8" />

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Left Section */}
          <div className="md:col-span-2">
            <h4 className="font-[poppins] font-semibold text-[34px] leading-[100%] tracking-[0] text-gray-900 mb-3">
              Who Is Eligible for This Level of Certification?
            </h4>

            <ol className="list-decimal list-inside font-['Open_Sans'] font-normal text-[16px] leading-[220%] tracking-[0] text-[#1E1E1E] space-y-2 mb-6">
              <li>Demonstrated leadership or community impact</li>
              <li>
                Must be nominated by another certified user or self-nominated
                with justification
              </li>
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
            <div className="w-full max-w-[639px] rounded-[30px] border border-gray-200 bg-[#FAFAFA] flex flex-col gap-[14px] p-6 md:p-[30px] px-[40px] mt-10">
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
                      className="w-7 h-7 mt-1 flex-shrink-0"
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
                      className="w-7 h-7 mt-1 flex-shrink-0"
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
                      className="w-7 h-7 mt-[2px] flex-shrink-0"
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
                      className="w-7 h-7 mt-[2px] flex-shrink-0"
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
          </div>

          {/* Right Section */}
          <div className="flex flex-col space-y-3 md:items-end items-center mt-8 md:col-span-1">
            <div className="flex flex-col items-center space-y-2">
              <img
                src="https://cdn.cness.io/leader1.svg"
                alt="Leader Certification Card"
                className="w-[200px] h-auto md:w-[275px] md:h-[271px] drop-shadow-md"
              />
              <div className="font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-center md:translate-x-4 sm:translate-x-2">
                Price: $508
              </div>
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
                title: "Verified Leader Badge across web & mobile",
                desc: "Trusted leadership, recognized everywhere.",
              },
              {
                title: "Top-tier visibility in Directory & Marketplace",
                desc: "Get seen by the right audience, everywhere in our network.",
              },
              {
                title: "Leader Circles, exclusive events, & collaborations",
                desc: " collaboration opportunities with top professionals.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5"
                style={{ borderWidth: "3px" }}
              >
                <h6 className="font-[poppins] font-medium text-[14.76px] leading-[22.14px] tracking-[-0.03em] text[#000000] mb-2 align-middle">
                  {item.title}
                </h6>
                <p className="font-['Open_Sans'] font-normal text-[12px] leading-[18.01px] tracking-[0px] text-[#64748B]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen && <Nomimationmodel onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default AssessmentCertification;

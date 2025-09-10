import { useEffect, useState } from "react";
import { useToast } from "../../ui/Toast/ToastProvider";
import { DashboardDetails } from "../../../Common/ServerAPI";
import bulb from "../../../assets/yellow-bulb.svg";
import bg from "../../../assets/star-bg.png";
import aspired from "../../../assets/aspired.png";
import inspired from "../../../assets/inspired.png";
import leader from "../../../assets/leader.png";
import Directory from "../../../assets/Directory.png";
import object from "../../../assets/object.jpg";
import comunity from "../../../assets/comunity.png";
import poster from "../../../assets/best practice poster.png";
import learningLab from "../../../assets/learning lab.png";
import marketplace from "../../../assets/marketplace.png";
import { HiOutlineLockClosed } from "react-icons/hi2";

export default function DashboardFirsttimeSection() {
  const { showToast } = useToast();
  const [user, setUser] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(true);

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

  const badgeLevels = [
    {
      title: "Aspired",
      image: aspired,
    },
    {
      title: "Inspired",
      image: inspired,
    },
    {
      title: "Leader",
      image: leader,
    },
  ];

  return (
    <section className="flex flex-col w-full items-start gap-3 py-2 pb-12">
      {/* Header Section */}
      <header className="w-full">
        <div className="flex flex-col lg:flex-row items-start justify-start lg:justify-between gap-4">
          <div className="order-2 lg:order-1">
            <div className="md:py-2 flex items-center gap-2.5">
              <h1 className="font-['Poppins',Helvetica] text-2xl font-medium md:text-[32px] leading-8">
                <span className="text-[#222224]">Hello </span>
                <span className="text-[#A392F2]">
                  {user?.name?.charAt(0)?.toUpperCase() +
                    user?.name?.slice(1) || ""}
                </span>
              </h1>
            </div>
            <div className="inline-flex items-center pt-1 pb-2 md:pt-2 md:pb-3">
              <p className="font-['Open_Sans',Helvetica] text-[#7a7a7a] text-xs sm:text-sm font-normal">
                Welcome to your CNESS Dashboard
              </p>
            </div>
          </div>
          {isVisible && (
            <div className="order-1 lg:order-2 w-full max-w-sm bg-[rgba(255,204,0,0.1)] font-medium text-xs text-[#222224] px-3 py-2.5 flex items-center justify-between rounded-lg">
              <div className="flex items-center gap-2">
                <div className="flex w-6 h-6 2xl:w-10 2xl:h-10 items-center justify-center">
                  <img
                    src={bulb}
                    alt="bulb icon"
                    className="w-[7px] 2xl:w-[16px] h-[10px] 2xl:h-[16px]"
                  />
                </div>
                <span className="font-['Poppins',Helvetica]">
                  Next Suggested Steps.
                </span>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                aria-label="Close banner"
                className="text-black text-lg"
              >
                ×
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="flex flex-col lg:flex-row gap-3 w-full h-full">
        {/* First Card */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center gap-3">
          <div
            className="w-full relative p-6 rounded-xl bg-[#6E62E5]"
            style={{
              border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
            }}
          >
            <img
              src={bg}
              alt="star bg"
              className="absolute top-0 left-0 w-full h-full pointer-events-none select-none z-0"
              aria-hidden="true"
            />
            <h6 className="font-['Open_Sans',Helvetica] font-normal text-white">
              TRUE PROFILE
            </h6>
            <h5 className="pt-3 pe-5 font-['Poppins',Helvetica] font-medium text-xl md:text-2xl text-white leading-[32px]">
              Access your True profile and begin exploring the various products
              we offer.
            </h5>
            <div className="pt-12">
              <button className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full">
                <span className="font-['Open_Sans',Helvetica]">
                  Create Profile
                </span>
                <div className="w-6 h-6 bg-[#F07EFF] rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div
            className="w-full relative p-6 rounded-xl bg-white"
            style={{ borderColor: "var(--Stroke, rgba(236, 238, 242, 1))" }}
          >
            <h6 className="font-['Poppins',Helvetica] font-medium text-[22px] sm:text-[28px] text-[#222224]">
              Certification Makes It Official.
            </h6>
            <h5 className="pt-3 font-['Open_Sans',Helvetica] font-normal text-base sm:text-lg text-[#999999] leading-[32px]">
              Get your conscious identity verified and unlock everything CNESS
              has to offer.
            </h5>
            <div className="py-5">
              <button
                className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full"
                style={{
                  border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
                  boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.05)",
                }}
              >
                <span className="font-['Open_Sans',Helvetica]">
                  Start Certification Profile
                </span>
                <div className="w-7 h-7 bg-[#F07EFF] text-white rounded-full flex items-center justify-center">
                  <HiOutlineLockClosed />
                </div>
              </button>
            </div>
            <div
              className="relative p-6 rounded-xl bg-white gap-6"
              style={{
                background:
                  "linear-gradient(90deg, rgba(163, 146, 242, 0.1) 0%, rgba(240, 126, 255, 0.1) 100%)",
                border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
              }}
            >
              <h6 className="font-['Open_Sans',Helvetica] font-normal text-base sm:text-lg text-[#222224]">
                Certification Levels
              </h6>
              <div className="grid sm:grid-cols-3 gap-[18px] w-full h-full pt-6">
                {badgeLevels.map((badge, index) => (
                  <div
                    key={index}
                    className="w-full h-full bg-white px-6 py-[16px] rounded-[18px] flex flex-col justify-center items-center gap-3"
                    style={{
                      border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
                    }}
                  >
                    <div className="w-10 h-10">
                      <img
                        src={badge.image}
                        alt="aspired image"
                        className="w-full h-full"
                      />
                    </div>
                    <h6 className="font-['Poppins',Helvetica] font-semibold text-base sm:text-lg text-[#222224]">
                      {badge.title}
                    </h6>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div
            className="w-full relative p-6 pb-32 rounded-xl bg-[#F3F2FF]"
            style={{
              border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
            }}
          >
            <img
              src={Directory}
              alt="star bg"
              className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
              aria-hidden="true"
            />
            <div className="relative">
              <h6 className="font-['Poppins',Helvetica] font-medium text-xl md:text-2xl text-black">
                Directory
              </h6>
              <h5 className="pt-3 pe-5 font-['Open_Sans',Helvetica] font-normal text-sm text-[#898989]">
                Check out our diverse selection of eco-friendly products made by
                trusted creators who care about sustainability and ethical
                practices!
              </h5>
              <div className="pt-3">
                <button className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full">
                  <span className="font-['Open_Sans',Helvetica]">
                    Work With Us
                  </span>
                  <div className="w-6 h-6 bg-[#F07EFF] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/5 flex flex-col gap-3">
          <div
            className="w-full h-full rounded-xl"
            style={{
              border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
              boxShadow: "0px 2px 100px 10px rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="relative w-full h-[438px] lg:h-full">
              <img
                src={object}
                alt="object bg"
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none rounded-xl select-none z-0"
                aria-hidden="true"
              />
              <div className="absolute top-1 right-0 px-3 pt-3 z-10">
                <div className="flex items-center gap-1 max-w-fit">
                  <img
                    src={comunity}
                    alt="comunity"
                    className="w-[80px] h-[25px] object-contain pointer-events-none select-none"
                    aria-hidden="true"
                  />
                  <h5 className="font-['Open_Sans',Helvetica] font-normal text-xs text-[#222224] leading-[32px]">
                    2000+ Happy Users
                  </h5>
                </div>
              </div>
              <div
                className="absolute bottom-0 px-3 pt-3 pb-[18px] w-full rounded-b-xl rounded-tr-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(100px)",
                }}
              >
                <div className="relative w-full h-full">
                  <h6 className="font-['Poppins',Helvetica] font-medium text-xl md:text-2xl text-white">
                    Social Media
                  </h6>
                  <h5 className="pe-5 font-['Open_Sans',Helvetica] text-base font-normal text-white leading-[32px]">
                    Reimagined for conscious expressions
                  </h5>
                  <div className="pt-6">
                    <button className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full">
                      <span className="font-['Open_Sans',Helvetica]">
                        Create Profile
                      </span>
                      <div className="w-6 h-6 bg-[#F07EFF] rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-full h-full relative py-6 px-[18px] rounded-xl bg-white"
            style={{
              border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
            }}
          >
            <img
              src={poster}
              alt="star bg"
              className="w-full h-[290px] pointer-events-none select-none z-0 rounded-xl"
              aria-hidden="true"
            />
            <div className="pt-5">
              <h6 className="font-['Poppins',Helvetica] text-xl md:text-2xl font-medium text-black">
                Best Practices
              </h6>
              <h5 className="pt-3 pe-5 font-['Open_Sans',Helvetica] font-normal text-sm text-[#898989]">
                Discover our extensive selection of sustainable products made by
                trusted artisans committed to eco-friendly methods and ethical
                principles!
              </h5>
              <div className="pt-5">
                <button
                  className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full"
                  style={{
                    border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
                    boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <span className="font-['Open_Sans',Helvetica]">
                    Explore Now
                  </span>
                  <div className="w-6 h-6 bg-[#F07EFF] rounded-full flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-3 w-full h-full">
        {/* First Card */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center gap-3">
          <div
            className="w-full h-full relative py-6 px-[18px] rounded-xl bg-white"
            style={{
              border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
            }}
          >
            <img
              src={learningLab}
              alt="Learning Lab"
              className="w-full max-h-[350px] 2xl:max-h-none 2xl:h-auto pointer-events-none select-none z-0 rounded-xl object-cover"
              aria-hidden="true"
            />
            <div className="pt-5">
              <h6 className="font-['Poppins',Helvetica] text-xl md:text-2xl font-medium text-black">
                Learning Lab
              </h6>
              <h5 className="pt-3 pe-5 font-['Open_Sans',Helvetica] font-normal text-sm text-[#898989]">
                Explore our wide range of sustainable products crafted by
                reliable creators dedicated to eco-friendly practices and
                ethical standards!
              </h5>
              <div className="pt-5">
                <button className="flex items-center gap-2 px-[18px] py-[12px] rounded-full bg-[rgba(112,119,254,0.1)] text-[#7077FE] text-sm font-normal">
                  Coming Soon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/5 flex flex-col gap-3">
          <div
            className="w-full h-full relative py-8 px-[20px] px-[18px] rounded-xl bg-[#FAFAFA]"
            style={{
              border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
            }}
          >
            <img
              src={marketplace}
              alt="star bg"
              className="w-full max-h-[324px] 2xl:max-h-none 2xl:h-auto pointer-events-none select-none z-0 rounded-xl"
              aria-hidden="true"
            />
            <div className="pt-5">
              <h6 className="font-['Poppins',Helvetica] text-xl md:text-2xl font-medium text-black">
                Marketplace
              </h6>
              <h5 className="pt-3 pe-5 font-['Open_Sans',Helvetica] font-normal text-sm text-[#898989]">
                Explore a wide range of conscious products crafted by verified
                creators who prioritize sustainability and ethical practices.
              </h5>
              <div className="pt-5">
                <button className="flex items-center gap-2 px-[18px] py-[12px] rounded-full bg-[rgba(112,119,254,0.1)] text-[#7077FE] text-sm font-normal">
                  Coming Soon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

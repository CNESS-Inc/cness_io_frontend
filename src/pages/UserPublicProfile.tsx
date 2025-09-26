import { Button } from "@headlessui/react";
import { UserRoundPlus, Share2, Link } from "lucide-react";
import BestPracticeCard from "../components/ui/BestPracticesCard";
import insta from "../assets/instagram.svg";
import facebook from "../assets/facebook.svg";
import linkedin from "../assets/linkedin.svg";
import twitter from "../assets/twitter.svg";
import fluent from "../assets/fluent.svg";
import work from "../assets/work.svg";
import bio from "../assets/bio.svg";
import education from "../assets/education.svg";
import {
  UnFriend,
  // GetUserProfileDetails,
  SendConnectionRequest,
  GetPublicProfileDetails,
  GetProfileDetailsById,
  GetFollowBestpractices,
  GetBestpracticesByUserProfile,
  //SendFollowRequest,
  //UnFriend,
} from "../Common/ServerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useState, useEffect } from "react";
//import banner from "../assets/aspcom2.png";
import bcard1 from "../assets/Bcard1.png";
import bcard2 from "../assets/Bcard2.png";
import bcard3 from "../assets/Bcard3.png";
import bcard4 from "../assets/Bcard4.png";
// import { normalizeFileUrl } from "../components/ui/Normalizefileurl";
import { FaLocationDot } from "react-icons/fa6";
import SharePopup from "../components/Social/SharePopup";
import { buildShareUrl } from "../lib/utils";

const levels = [
  {
    key: "Aspiring",
    label: "ASPIRED",
    img: "https://cdn.cness.io/aspiring.webp",
  },
  {
    key: "Inspired",
    label: "INSPIRED",
    img: "https://cdn.cness.io/inspired.webp",
  },
  {
    key: "Leader",
    label: "LEADER",
    img: "https://cdn.cness.io/leader1.webp",
  },
];

const fmtOpts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" }; // "Jan 2025"

const formatDateSafe = (value?: string | Date | null, opts = fmtOpts) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, opts).format(d);
};

export const formatRange = (
  start?: string | Date | null,
  end?: string | Date | null,
  isCurrent?: boolean,
  opts = fmtOpts
) => {
  const s = formatDateSafe(start, opts);
  const e = isCurrent ? "Present" : formatDateSafe(end, opts);
  return [s, e].filter(Boolean).join(" – ");
};

export default function UserProfileView() {
  const [userDetails, setUserDetails] = useState<any>();
  const [publicUserDetails, setPublicUserDetails] = useState<any>();
  const [myBP, setMyBP] = useState<any>([]);
  const [followBP, setFollowBP] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("about");
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const handleShareToggle = () => setIsShareOpen((prev) => !prev);
  const handleShareClose = () => setIsShareOpen(false);
  const loggedInUserID = localStorage.getItem("Id");
  const isOwnProfile =
    (id && String(id) === String(loggedInUserID)) ||
    (userDetails?.user_id &&
      String(userDetails.user_id) === String(loggedInUserID));
  const userLevel = userDetails?.level?.level;

  let displayLevels: typeof levels = [];
  if (userLevel === "Aspiring") {
    displayLevels = levels.slice(0, 1);
  } else if (userLevel === "Inspired") {
    displayLevels = levels.slice(0, 2);
  } else if (userLevel === "Leader") {
    displayLevels = levels;
  }

  const slugify = (str: string) => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const fetchUserDetails = async () => {
    try {
      // const res = await GetUserProfileDetails(id);
      const res = await GetProfileDetailsById(id);
      setUserDetails(res?.data?.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchPublicUserDetails = async () => {
    try {
      const res = await GetPublicProfileDetails();
      setPublicUserDetails(res?.data?.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchAllBestPractises = async () => {
    try {
      const res = await GetBestpracticesByUserProfile(id);
      setMyBP(res?.data?.data?.rows);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchFollowBestPractises = async () => {
    try {
      const res = await GetFollowBestpractices();
      setFollowBP(res?.data?.data?.rows);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchPublicUserDetails();
    fetchAllBestPractises();
    fetchFollowBestPractises();
  }, []);

  const handleFriend = async (userId: string) => {
    try {
      if (
        userDetails.friend_request_status !== "ACCEPT" &&
        userDetails.friend_request_status !== "PENDING" &&
        !userDetails.if_friend
      ) {
        const formattedData = {
          friend_id: userId,
        };
        await SendConnectionRequest(formattedData);
        setUserDetails({
          ...userDetails,
          if_friend: false,
          friend_request_status: "PENDING",
        });
      } else {
        if (
          userDetails.friend_request_status == "ACCEPT" &&
          userDetails.if_friend
        ) {
          const formattedData = {
            friend_id: userId,
          };
          await UnFriend(formattedData);
          setUserDetails({
            ...userDetails,
            if_friend: false,
            friend_request_status: null,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  //bestpractices props
  {
    /*const data = [
    {
      name: "Emily Johnson",
      username: "EmilyJohnson",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Green Office Initiative",
      description:
        "Use LED lighting, energy-saving devices, and smart thermostats to reduce electricity consumption.",
      link: "#",
    },
    {
      name: "Sarah Miller",
      username: "SarahMiller",
      profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Waste Reduction",
      description:
        "Implement recycling programs, reduce single-use plastics, and encourage digital documentation.",
      link: "#",
    },
    {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
     {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
     {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
     {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
  ];
*/
  }

  return (
    <div className="relative mx-auto w-full mx-auto px-3 mt-4">
      {/* Banner */}
      <div className="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] xl:h-[320px] rounded-[8px]">
        <img
          src={
            userDetails?.profile_banner || "https://cdn.cness.io/banner.webp"
          }
          alt="Profile Banner"
          className="w-full h-full object-cover rounded-[8px]"
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row justify-between gap-[24px] bg-white">
        <div className="relative w-full lg:w-[35%] xl:w-[25%] ms-5">
          <div className="w-full -mt-[70px] sm:-mt-[90px] md:-mt-[110px] lg:-mt-[120px]">
            <div className="rounded-[10px] p-[6px] bg-white object-cover shadow w-[150px] lg:w-full h-[110px] sm:h-[140px] md:h-[190px] lg:h-[250px] 2xl:h-[320px]">
              <img
                src={
                  userDetails?.profile_picture &&
                  userDetails?.profile_picture !== "http://localhost:5026/file/"
                    ? userDetails?.profile_picture
                    : "/profile.png"
                }
                alt="userlogo1"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  // Fallback if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
              ></img>
            </div>
            <div className="w-full px-3 py-[10px] mt-5 pe-14 lg:pe-0">
              <h2 className="font-['Poppins'] font-semibold text-[24px] leading-[21px] text-[#000000]">
                {userDetails?.first_name} {userDetails?.last_name}
              </h2>
              <p
                className="mt-3 font-['Open_Sans'] font-semibold text-[16px] leading-[24px] 
             bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
              >
                {/* {userDetails?.public_title} */}
                {publicUserDetails?.title}
              </p>
              <p className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B] max-w-full md:max-w-[500px] break-words">
                {publicUserDetails?.about_us}
              </p>

              <div className="mt-3 font-['Open_Sans'] font-normal text-[16px] leading-[100%] text-[#64748B]">
                <div className="flex items-start gap-1 text-[#64748B] text-sm">
                  <div className="pt-[4px] flex-shrink-0 flex items-center">
                    <FaLocationDot className="w-3 h-3" stroke="#64748B" />
                  </div>
                  <div className="leading-snug">
                    {userDetails?.address}, {userDetails?.location?.city || ""},{" "}
                    {userDetails?.country?.name}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-3 text-center">
                <span>
                  <span className="font-['Open_Sans'] font-bold text-sm leading-[100%] text-[#64748B]">
                    2M
                  </span>
                  <span className="ml-1 font-['Open_Sans'] font-semibold text-sm leading-[100%] text-[#64748B]">
                    Resonators
                  </span>
                </span>

                <span>
                  <span className="font-['Open_Sans'] font-bold text-sm leading-[100%] text-[#64748B]">
                    500+
                  </span>
                  <span className="ml-1 font-['Open_Sans'] font-semibold text-sm leading-[100%] text-[#64748B]">
                    Connections
                  </span>
                </span>
              </div>

              {/* Buttons */}
              <div className="pt-4 pb-10 space-y-2 border-b border-[#E5E5E5]">
                {!isOwnProfile && (
                  <button
                    className="w-full h-9 rounded-full 
                bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF] 
                font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                text-white align-middle"
                  >
                    + Resonate
                  </button>
                )}
                {!isOwnProfile && (
                  <button
                    onClick={() => handleFriend(userDetails?.user_id)}
                    disabled={userDetails?.user_id === loggedInUserID} // 👈 disable on own profile
                    className={`w-full h-9 rounded-full border border-[#ECEEF2] 
             font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
             flex items-center justify-center gap-2
             ${
               userDetails?.user_id === loggedInUserID
                 ? "bg-gray-200 text-gray-500 cursor-not-allowed" // 👈 styling when disabled
                 : userDetails?.if_friend &&
                   userDetails?.friend_request_status === "ACCEPT"
                 ? "bg-green-100 text-green-700"
                 : !userDetails?.if_friend &&
                   userDetails?.friend_request_status === "PENDING"
                 ? "bg-yellow-100 text-yellow-700"
                 : "bg-[#FFFFFF] text-[#0B3449] hover:bg-indigo-600"
             }`}
                  >
                    <UserRoundPlus className="w-4 h-4" />
                    {userDetails?.if_friend &&
                    userDetails?.friend_request_status === "ACCEPT"
                      ? "Connected"
                      : !userDetails?.if_friend &&
                        userDetails?.friend_request_status === "PENDING"
                      ? "Requested..."
                      : "Connect"}
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={handleShareToggle}
                    className="w-full h-9 rounded-full border border-[#ECEEF2] 
             font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
             text-[#0B3449] flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  {isShareOpen && (
                    <SharePopup
                      isOpen={true}
                      onClose={handleShareClose}
                      url={buildShareUrl()} // 👈 pass dynamic or static url
                      position="bottom"
                    />
                  )}
                </div>
              </div>

              {/* Achievements */}
              {displayLevels.length > 0 && (
                <div className="border-b border-[#E5E5E5] pt-10 pb-10">
                  <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] text-[#000000] mb-3">
                    Achievements
                  </h3>

                  <div className="flex items-center justify-center gap-6">
                    {displayLevels.map((lvl) => (
                      <div
                        key={lvl.key}
                        className="flex flex-col items-center justify-center"
                      >
                        <img
                          src={lvl.img}
                          alt={`${lvl.label} Badge`}
                          className="w-12 h-12"
                        />
                        <span className="mt-1 font-['Open_Sans'] font-semibold text-[12px] leading-[100%] uppercase text-center text-[#222224]">
                          {lvl.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* On The Web */}
              <div className="border-b border-[#E5E5E5] pt-10 pb-10">
                <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] text-[#000000] mb-3">
                  On The Web
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      key: "linkedin",
                      label: "LinkedIn",
                      icon: linkedin,
                    },
                    {
                      key: "facebook",
                      label: "Facebook",
                      icon: facebook,
                    },
                    {
                      key: "twitter",
                      label: "X", // Twitter rebranded
                      icon: twitter,
                    },
                    {
                      key: "instagram",
                      label: "Instagram",
                      icon: insta,
                    },
                  ]
                    .filter(
                      (platform) => userDetails?.social_links?.[platform.key]
                    )
                    .map((platform) => (
                      <a
                        key={platform.key}
                        href={userDetails.social_links[platform.key]}
                        className="flex items-center justify-between w-full h-[45px] border border-[#ECEEF2] rounded-lg px-3 py-2 gap-[10px] hover:bg-gray-50"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={platform.icon}
                            alt={platform.key}
                            className="w-7 h-7"
                          />
                          <span className="font-['Open_Sans'] font-bold text-[12px] leading-[100%] tracking-[0px] text-[#000000]">
                            {platform.label}
                          </span>
                          <Link className="w-4 h-4 text-[#64748B]" />
                        </div>
                        <img
                          src={fluent}
                          alt="navigation"
                          className="w-5 h-5"
                        />
                      </a>
                    ))}
                </div>
              </div>

              {/* My Interests */}
              <div className="border-b border-[#E5E5E5] pt-10 pb-10">
                <h3
                  className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
                   text-[#000000] mb-3"
                >
                  My Interests
                </h3>
                <div className="flex flex-wrap gap-3">
                  {userDetails?.interests?.map(
                    (interest: any, index: number) => (
                      <span
                        key={interest.id || index}
                        className="px-[16px] py-[7px] rounded-[30px] border border-[#CBD5E1] 
                         bg-[#FCFCFD] font-['Open_Sans'] font-normal text-[12px] 
                         leading-[100%] tracking-[0px] text-[#64748B]"
                      >
                        {interest.name}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* My Professions */}
              <div className="pt-10 pb-10">
                <h3
                  className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
             text-[#000000] mb-3"
                >
                  My Professions
                </h3>
                <div className="flex flex-wrap gap-3">
                  {userDetails?.professions?.map((pro: any, index: number) => (
                    <span
                      key={pro.id || index}
                      className="px-[16px] py-[7px] rounded-[30px] border border-[#CBD5E1] 
                   bg-[#FCFCFD] font-['Open_Sans'] font-normal text-[12px] 
                   leading-[100%] tracking-[0px] text-[#64748B]"
                    >
                      {pro.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[65%] xl:w-[75%]">
          <div className="px-6 relative flex flex-col md:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 pt-3 md:pt-5">
            <span
              className="absolute bottom-0 right-0 h-px bg-[#ECEEF2]
                   left-6 md:left-6"
            />
            <div className="flex justify-center gap-6 -mt-2">
              <Button
                onClick={() => setActiveTab("about")}
                className={`relative py-3 font-['Open_Sans'] text-[14px] leading-[100%] ${
                  activeTab === "about"
                    ? "font-bold bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
                    : "font-normal text-[#64748B]"
                }`}
              >
                About Me
                {activeTab === "about" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF]" />
                )}
              </Button>

              <Button
                onClick={() => setActiveTab("best")}
                className={`relative py-3 font-['Open_Sans'] text-[14px] leading-[100%] ${
                  activeTab === "best"
                    ? "font-bold bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
                    : "font-normal text-[#64748B]"
                }`}
              >
                My Best Practices
                {activeTab === "best" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF]" />
                )}
              </Button>
            </div>
          </div>
          <div className="w-full p-6 flex flex-col">
            {activeTab === "about" && (
              <>
                {/* Bio */}

                <div className="pb-5 border-b border-[#ECEEF2]">
                  <h3
                    className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] 
             text-[#000000]"
                  >
                    <span className="flex items-center gap-2 ">
                      <img src={bio} alt="bio" className="w-6 h-6 " />
                    </span>{" "}
                    Bio
                  </h3>
                  <p
                    className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
             tracking-[0px] text-[#64748B]"
                  >
                    {userDetails?.bio || "No Bio available"}
                  </p>
                </div>

                {/* Educations */}
                <div className="py-6 border-b border-[#ECEEF2]">
                  <h3
                    className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] 
             text-[#000000]"
                  >
                    <span className="flex items-center gap-2">
                      <img src={education} alt="bio" className="w-6 h-6" />
                    </span>{" "}
                    Education
                  </h3>
                  <ul className="mt-2 space-y-4">
                    {userDetails?.education?.map((edu: any) => (
                      <li key={edu.id}>
                        {/* Degree */}
                        <p
                          className="font-['Open_Sans'] font-semibold text-[16px] leading-[20px] 
                   tracking-[0px] text-[#000000] mt-2 "
                        >
                          {edu.degree}
                        </p>

                        {/* Institution */}
                        <p
                          className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
                   tracking-[0px] text-[#64748B] mt-2"
                        >
                          {edu.institution}
                        </p>

                        {/* Date range */}
                        {(edu.start_date ||
                          edu.end_date ||
                          edu.currently_studying) && (
                          <span className="text-xs text-gray-400 mt-1 block">
                            {formatRange(
                              edu.start_date,
                              edu.end_date,
                              edu.currently_studying
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Work Experience */}
                <div className="py-6 border-b border-[#ECEEF2]">
                  <h3 className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000]">
                    <span className="flex items-center gap-2">
                      <img src={work} alt="work" className="w-6 h-6" />
                    </span>
                    Work Experience
                  </h3>

                  <div className="mt-2 space-y-5">
                    {userDetails?.work_experience?.map((job: any) => (
                      <div key={job.id}>
                        {/* Position + Company */}
                        <p className="font-['Open_Sans'] font-semibold text-[16px] leading-[20px] tracking-[0px] text-[#000000]">
                          {job.position} {job.company && `at ${job.company}`}
                        </p>

                        {/* Location + Dates */}
                        <p className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] tracking-[0px] text-[#64748B] mt-2">
                          <span className="flex items-center gap-1 text-[#64748B] text-sm">
                            <FaLocationDot
                              className="w-3 h-3"
                              stroke="#64748B"
                            />

                            {[job.work_city, job.work_state, job.work_country]
                              .filter(Boolean)
                              .join(", ") || "Location not specified"}

                            <br />
                          </span>
                          {(job.start_date ||
                            job.end_date ||
                            job.currently_working) && (
                            <span className="text-xs text-gray-400 mt-1 block">
                              {formatRange(
                                job.start_date,
                                job.end_date,
                                job.currently_working
                              )}
                            </span>
                          )}
                        </p>

                        {/* Responsibilities (if array) */}
                        {job.roles_responsibilities && (
                          <div className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B]">
                            {/*  <span className="font-semibold text-[#000]">Roles & Responsibilities:</span>*/}
                            <p className="mt-1 whitespace-pre-line">
                              {job.roles_responsibilities}
                            </p>
                          </div>
                        )}

                        {/* Responsibilities Array (if you keep tasks as an array) */}
                        {job.responsibilities?.length > 0 && (
                          <ul className="mt-2 list-disc pl-5 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B] space-y-1">
                            {job.responsibilities.map(
                              (task: string, idx: number) => (
                                <li key={idx}>{task}</li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Best Practices Tab */}
            {activeTab === "best" &&
              userDetails?.best_practices_questions?.length > 0 && (
                <div className="pt-6 pb-12 border-b border-[#ECEEF2]">
                  <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000] mb-6">
                    Best Practices Aligned CNESS
                  </h3>

                  <div className="pt-4 grid gap-4 md:gap-5 justify-start xl:grid-cols-3">
                    {userDetails.best_practices_questions.map(
                      (section: any, index: number) => {
                        const allQuestions = section.sub_sections?.flatMap(
                          (sub: any) => sub.questions
                        );

                        if (!allQuestions?.length) return null;

                        return allQuestions.map((question: any) => {
                          const cardImages = [bcard1, bcard2, bcard3, bcard4];
                          const imageForCard =
                            cardImages[index % cardImages.length];

                          return (
                            <BestPracticeCard
                              key={question.id}
                              name={
                                userDetails.first_name +
                                " " +
                                userDetails.last_name
                              }
                              username={userDetails.first_name}
                              profileImage={
                                userDetails.profile_picture || "/profile.png"
                              }
                              coverImage={imageForCard}
                              title={section.section.name}
                              description={
                                question.answer?.answer || "No answer provided"
                              }
                              link={
                                question.answer?.show_question_in_public
                                  ? "#read-more"
                                  : undefined
                              }
                            />
                          );
                        });
                      }
                    )}
                  </div>
                </div>
              )}

            {/* Best Practices profession */}
            {activeTab === "best" &&
              myBP?.length > 0 && (
                <div className="pt-6 pb-12 border-b border-[#ECEEF2]">
                  <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
                    My Best Practices 
                  </h3>

                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"> */}
                  <div className="pt-4 grid gap-4 md:gap-5 justify-start xl:grid-cols-3">
                    {myBP?.map(
                      (practice: any) => {
                        return (
                          <div
                            key={practice?.id}
                            onClick={(e) => {
                              // Only navigate if it's not the Read More button
                              if (
                                !(e.target as HTMLElement).closest(
                                  ".read-more-btn"
                                )
                              ) {
                                navigate(
                                  `/dashboard/bestpractices/${
                                    practice.id
                                  }/${slugify(practice.title)}`,
                                  {
                                    state: {
                                      likesCount: practice.likesCount,
                                      isLiked: practice.isLiked,
                                    },
                                  }
                                );
                              }
                            }}
                          >
                            <BestPracticeCard
                              name={
                                `${practice?.profile?.first_name || ""} ${
                                  practice?.profile?.last_name || ""
                                }`.trim() || "CNESS User"
                              }
                              username={practice?.user?.username || "user"}
                              profileImage={
                                practice?.profile?.profile_picture
                                  ? practice.profile.profile_picture
                                  : "/profile.png"
                              }
                              coverImage={
                                practice?.file
                                  ? practice.file
                                  : bcard1 || "https://cdn.cness.io/banner.webp"
                              }
                              title={
                                practice?.title ||
                                practice?.profession_data?.title ||
                                "Untitled"
                              }
                              description={practice?.description || ""}
                              link={`/dashboard/bestpractices/${
                                practice.id
                              }/${slugify(practice.title)}`}
                            />
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              )}

            {activeTab === "best" && followBP?.length > 0 && (
              <div className="pt-6 pb-12 border-b border-[#ECEEF2]">
                <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
                  Best Practices Aligned Follow
                </h3>

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"> */}
                <div className="pt-4 grid gap-4 md:gap-5 justify-start xl:grid-cols-3">
                  {followBP?.map((practice: any) => {
                    return (
                      <div
                        key={practice?.id}
                        onClick={(e) => {
                          // Only navigate if it's not the Read More button
                          if (
                            !(e.target as HTMLElement).closest(".read-more-btn")
                          ) {
                            navigate(
                              `/dashboard/bestpractices/${
                                practice.id
                              }/${slugify(practice.title)}`,
                              {
                                state: {
                                  likesCount: practice.likesCount,
                                  isLiked: practice.isLiked,
                                },
                              }
                            );
                          }
                        }}
                      >
                        <BestPracticeCard
                          name={
                            `${practice?.profile?.first_name || ""} ${
                              practice?.profile?.last_name || ""
                            }`.trim() || "CNESS User"
                          }
                          username={practice?.user?.username || "user"}
                          profileImage={
                            practice?.profile?.profile_picture
                              ? practice.profile.profile_picture
                              : "/profile.png"
                          }
                          coverImage={
                            practice?.file
                              ? practice.file
                              : bcard1 || "https://cdn.cness.io/banner.webp"
                          }
                          title={
                            practice?.title ||
                            practice?.profession_data?.title ||
                            "Untitled"
                          }
                          description={practice?.description || ""}
                          link={`/dashboard/bestpractices/${
                            practice.id
                          }/${slugify(practice.title)}`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Member Since */}
          <div
            className="pl-6 pb-12 font-['Open_Sans'] font-semibold text-[12px] leading-[20px] 
             tracking-[0px] text-[#000000]"
          >
            <p>
              Member Since:{" "}
              {userDetails?.createdAt
                ? new Date(userDetails.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <a
              href="#"
              className="font-['Open_Sans'] font-normal text-[12px] leading-[21px] 
             tracking-[0px] text-[#64748B] underline"
            >
              Report
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

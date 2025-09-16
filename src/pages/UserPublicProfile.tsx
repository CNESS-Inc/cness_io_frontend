import { Button } from "@headlessui/react";
import {UserRoundPlus,Share2,
Link ,MapPin, TrendingUp} from "lucide-react";
import BestPracticeCard  from "../components/ui/BestPracticesCard";
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
  GetUserProfileDetails,
  SendConnectionRequest,
  SendFollowRequest,
  //SendFollowRequest,
  //UnFriend,
} from "../Common/ServerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import  { useState, useEffect } from "react"; 
//import banner from "../assets/aspcom2.png";
import bcard1 from "../assets/Bcard1.png";
import bcard2 from "../assets/Bcard2.png";
import bcard3 from "../assets/Bcard3.png";
import bcard4 from "../assets/Bcard4.png";
// import { normalizeFileUrl } from "../components/ui/Normalizefileurl";
import inspiredbadge from "../assets/Inspired _ Badge.png";
import SharePopup from "../components/Social/SharePopup";
import { buildShareUrl } from "../lib/utils";


export default function UserProfileView() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [userDetails, setUserDetails] = useState<any>();
 const [activeTab, setActiveTab] = useState("about");
       const { id } = useParams();
 const navigate = useNavigate();
         const { showToast } = useToast();
          //const navigate = useNavigate();
           const loggedInUserID = localStorage.getItem("Id");
 
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

  const handleFollow = async (userId: string) => {
    try {
      const formattedData = {
        following_id: userId,
      };
      await SendFollowRequest(formattedData);
      setIsFollowing(!isFollowing);
      showToast({
        message: isFollowing ? "Stopped resonating" : "Started resonating!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error following user:", error);
      showToast({
        message: "Failed to update resonate status",
        type: "error",
        duration: 3000,
      });
    }
  };

  const fetchUserDetails = async () => {
    try {
      const res = await GetUserProfileDetails(id);
      console.log(res?.data?.data, "res?.data?.data------------");
      setUserDetails(res?.data?.data);
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
  
    useEffect(() => {
      fetchUserDetails();
    }, []);



 

//bestpractices props
{/*const data = [
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
*/}


  return (
<div className="relative w-full max-w-[2000px] mx-auto px-3 mt-4">
  {/* Banner */}
  <div className="w-full h-[200px] md:h-[250px] rounded-[8px] overflow-hidden">
   
    <img
  src={userDetails?.profile_banner || "https://cdn.cness.io/banner.webp"}
  alt="Profile Banner"
  className="w-full h-full object-cover rounded-[8px]"
/>
   
  </div>

  {/* White Card (equal width to banner) */}
  <div className="relative w-full bg-white rounded-t-[12px] shadow border border-[#ECEEF2] -mt-[2px] px-6 pt-[35px]">
    {/* Profile Image (overlapping left) */}
<div className="absolute -top-[80px] left-1 md:-top-[120px] md:left-[10px]">
    <div className="w-[150px] h-[150px] md:w-[250px] md:h-[250px] rounded-[10px] border-[6px] border-white object-cover shadow">
      <img
                src={
                  userDetails?.profile_picture &&
                  userDetails?.profile_picture !== "http://localhost:5026/file/"
                    ? userDetails?.profile_picture
                    : "/profile.png"
                }
                alt="userlogo1"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
    ></img>
      </div>
    </div>  

   {/* Tabs - inside white card */}
<div className="relative flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mt-4 md:-mt-2">
  {/* Tabs */}
   <div>
      {/* Tabs */}
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

    
    

  {/* Border line */}
  <span className="absolute bottom-0 left-[300px] right-0 h-[1px] bg-[#ECEEF2]" />
</div>
  {/* GRID Layout */}

  
<div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6 pb-10">
  {/* LEFT column */}
<div className="col-span-12 lg:col-span-3 mt-[60px] w-full lg:w-[250px] lg:-ml-3">
    {/* Profile Section */}
    <div className=" border-b border-[#E5E5E5] p-4">
      <h2 className="font-['Poppins'] font-semibold text-[24px] leading-[21px] text-[#000000]">{userDetails?.first_name} {userDetails?.last_name}</h2>
      <p className="mt-3 font-['Open_Sans'] font-semibold text-[16px] leading-[14px] 
             bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent">{userDetails?.public_title}</p>
   <p className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B] max-w-full md:max-w-[500px] break-words">
  {userDetails?.about_us}
</p>

      <div className="mt-3  
             font-['Open_Sans'] font-normal text-[16px] leading-[100%] 
             text-[#64748B] ">
<span className="flex items-center gap-1 text-[#64748B] text-sm">
 <MapPin className="w-3 h-3" stroke="#64748B"></MapPin>
   {userDetails?.address},   {userDetails?.location?.city || ""},{userDetails?.country?.name}</span>     
</div>

    <div className="mt-3 flex gap-3 text-center">
  <span>
    <span className="font-['Open_Sans'] font-bold text-[16px] leading-[100%] text-[#64748B]">
      2M
    </span>
    <span className="ml-1 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] text-[#64748B]">
      Resonators
    </span>
  </span>

  <span>
    <span className="font-['Open_Sans'] font-bold text-[16px] leading-[100%] text-[#64748B]">
      500+
    </span>
    <span className="ml-1 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] text-[#64748B]">
      Connections
    </span>
  </span>
</div>

      {/* Buttons */}
      <div className="mt-4 space-y-2">
        <button 
          onClick={() => handleFollow(userDetails?.user_id)}
          disabled={userDetails?.user_id === loggedInUserID}
          className={`w-full h-9 rounded-full font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                    flex items-center justify-center gap-2 transition-colors
                    ${userDetails?.user_id === loggedInUserID
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : isFollowing
                        ? "bg-transparent text-[#7077FE] border border-[#7077FE] hover:text-[#7077FE]/80"
                        : "bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF] text-white hover:opacity-90"
                    }`}
        >
          {userDetails?.user_id === loggedInUserID ? (
            "It's You"
          ) : isFollowing ? (
            <>
              <TrendingUp className="w-4 h-4 text-[#7077FE]" />
              Resonating
            </>
          ) : (
            "+ Resonate"
          )}
        </button>
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
  {userDetails?.user_id === loggedInUserID
    ? "It's You" // 👈 label when disabled
    : userDetails?.if_friend &&
      userDetails?.friend_request_status === "ACCEPT"
    ? "Connected"
    : !userDetails?.if_friend &&
      userDetails?.friend_request_status === "PENDING"
    ? "Requested..."
    : "Connect"}
</button>

        <button 
          onClick={() => setShowSharePopup(!showSharePopup)}
          className="w-full h-9 rounded-full border border-[#ECEEF2] 
                    font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                    text-[#0B3449] flex items-center justify-center gap-2 relative">
          <Share2 className="w-4 h-4" />
          Share
          {showSharePopup && (
            <SharePopup
              isOpen={showSharePopup}
              onClose={() => setShowSharePopup(false)}
              url={buildShareUrl(`https://dev.cness.io/directory/user-profile/${userDetails?.user_id}`)}
              position="top"
            />
          )}
        </button>
      </div>
    </div>

    {/* Achievements */}
   <div className="border-b border-[#E5E5E5] pt-5 pb-5 px-4 mt-4">
  <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] text-[#000000] mb-3">
    Achievements
  </h3>

  <div className="flex flex-col items-center justify-center">
    <img
      src={
        userDetails?.level?.level === "Aspiring"
          ? "https://cdn.cness.io/aspiring.webp"
          : userDetails?.level?.level === "Inspired"
          ? "https://cdn.cness.io/inspired.webp"
          : userDetails?.level?.level === "Leader"
          ? "https://cdn.cness.io/leader1.webp"
          : inspiredbadge // fallback if null or undefined
      }
      alt={`${userDetails?.level?.level || "CNESS"} Badge`}
      className="w-12 h-12"
    />
    <span className="mt-1 font-['Open_Sans'] font-semibold text-[12px] leading-[100%] uppercase text-center text-[#222224]">
      {userDetails?.level?.level || "CNESS"}
    </span>
  </div>



</div>
    {/* On The Web */}
    <div className="border-b border-[#E5E5E5] pt-5 pb-5 px-4 mt-4">
       <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
             text-[#000000] mb-3">On The Web</h3>

      <div className="space-y-3">
        {/* LinkedIn */}
        <a
          href="#"
          className="flex items-center justify-between w-[230px] h-[45px] 
             border border-[#ECEEF2] rounded-lg px-3 py-2 gap-[10px] 
             hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <img src={linkedin} alt="linkedin" className="w-7 h-7" />
            <span className="font-['Open_Sans'] font-bold text-[12px] leading-[100%] tracking-[0px] text-[#000000]">LinkedIn </span>
            <Link className="w-4 h-4 text-[#64748B]"/>
          </div>
          <img src={fluent} alt="navigation"className="w-5 h-5" />
        </a>

        {/* Facebook */}
        <a
          href="#"
          className="flex items-center justify-between w-[230px] h-[45px] 
             border border-[#ECEEF2] rounded-lg px-3 py-2 gap-[10px] 
             hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <img src={facebook} alt="linkedin" className="w-7 h-7" />
            <span className="font-['Open_Sans'] font-bold text-[12px] leading-[100%] tracking-[0px] text-[#000000]">Facebook</span>
            <Link className="w-4 h-4 text-[#64748B]"/>
          </div>
          <img src={fluent} alt="navigation"className="w-5 h-5" />
        </a>

        {/* X (Twitter icon தான் use செய்யலாம் Lucide-ல) */}
        <a
          href="#"
          className="flex items-center justify-between w-[230px] h-[45px] 
             border border-[#ECEEF2] rounded-lg px-3 py-2 gap-[10px] 
             hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <img src={twitter} alt="linkedin" className="w-7 h-7" />
            <span className="font-['Open_Sans'] font-bold text-[12px] leading-[100%] tracking-[0px] text-[#000000]">X</span>
            <Link className="w-4 h-4 text-[#64748B]"/>
          </div>
          <img src={fluent} alt="navigation"className="w-5 h-5" />
        </a>

        {/* Instagram */}
        <a
          href="#"
          className="flex items-center justify-between w-[230px] h-[45px] 
             border border-[#ECEEF2] rounded-lg px-3 py-2 gap-[10px] 
             hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <img src={insta} alt="linkedin" className="w-7 h-7" />
            <span className="font-['Open_Sans'] font-bold text-[12px] leading-[100%] tracking-[0px] text-[#000000]">Instagram</span>
            <Link className="w-4 h-4 text-[#64748B]"/>
          </div>
          <img src={fluent} alt="navigation"className="w-5 h-5" />
       </a>
      </div>
    </div>


       {/* My Professions */}
<div className="border-b border-[#E5E5E5] pt-5 pb-5 px-4 mt-4">
      <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
             text-[#000000] mb-">My Professions</h3>
      <div className="flex flex-wrap gap-2">
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

    {/* My Interests */}
    <div className="border-b border-[#E5E5E5] pt-5 pb-5 px-4 mt-4">
  <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
             text-[#000000] mb-3">My Interests</h3>
  <div className="flex flex-wrap gap-[12px]">
   
   
   {userDetails?.interests?.map((interest: any, index: number) => (
      <span
       key={interest.id || index}
        className="px-[16px] py-[7px] rounded-[30px] border border-[#CBD5E1] 
                   bg-[#FCFCFD] font-['Open_Sans'] font-normal text-[12px] 
                   leading-[100%] tracking-[0px] text-[#64748B]"
      >
       {interest.name}
      </span>
    ))}
  </div>
</div>

 
</div>


{/* RIGHT column */}

<div className="col-span-12 lg:col-span-9">
        

  <div className="w-full  p-6 flex flex-col divide-y divide-[#ECEEF2]">
   {activeTab === "about" && (
        <>
    {/* Bio */}
    <div className="pb-6">
      <h3 className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] 
             text-[#000000]">
        <span className="flex items-center gap-2 "> 
            <img src={bio}alt="bio" className="w-6 h-6 " />
            </span> Bio
      </h3>
      <p className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
             tracking-[0px] text-[#64748B]">
     {userDetails?.bio  || "No Bio available"}
      </p>
    </div>

    {/* Educations */}
    <div className="py-6">
      <h3 className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] 
             text-[#000000]">
        <span className="flex items-center gap-2"> 
            <img src={education}alt="bio" className="w-6 h-6" />
            </span> Education   
      </h3>
      <ul className="space-y-4">
  {userDetails?.education?.map((edu: any) => (
    <li key={edu.id}>
      {/* Degree */}
      <p className="font-['Open_Sans'] font-semibold text-[16px] leading-[20px] 
                   tracking-[0px] text-[#000000]">
        {edu.degree}
      </p>

      {/* Institution */}
      <p className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
                   tracking-[0px] text-[#64748B]">
        {edu.institution}
      </p>

      {/* Date range */}
      {(edu.start_date || edu.end_date) && (
        <span className="text-xs text-gray-400 mt-1 block">
          {edu.start_date} – {edu.currently_studying ? "Present" : edu.end_date}
        </span>
      )}
    </li>
  ))}
</ul>
    </div>

    {/* Work Experience */}
   <div className="py-6">
  <h3 className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000]">
    <span className="flex items-center gap-2">
      <img src={work} alt="work" className="w-6 h-6" />
    </span>
    Work Experience
  </h3>

  <div className="mt-3 space-y-5">
    {userDetails?.work_experience?.map((job: any) => (
      <div key={job.id}>
        {/* Position + Company */}
        <p className="font-['Open_Sans'] font-semibold text-[16px] leading-[20px] tracking-[0px] text-[#000000]">
          {job.position} {job.company && `at ${job.company}`}
        </p>

        {/* Location + Dates */}
          <p className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] tracking-[0px] text-[#64748B]">
         <span className="flex items-center gap-1 text-[#64748B] text-sm">
  <MapPin className="w-3 h-3" stroke="#64748B" />

          {[
            job.work_city,
            job.work_state,
            job.work_country,
          ].filter(Boolean).join(", ") || "Location not specified"}
         
          <br />
          </span>
                    {job.start_date} – {job.currently_working ? "Present" : job.end_date}

        </p>

        {/* Responsibilities (if array) */}
        {job.roles_responsibilities && (
          <div className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B]">
           {/*  <span className="font-semibold text-[#000]">Roles & Responsibilities:</span>*/}
            <p className="mt-1 whitespace-pre-line">{job.roles_responsibilities}</p>
          </div>
        )}

        {/* Responsibilities Array (if you keep tasks as an array) */}
        {job.responsibilities?.length > 0 && (
          <ul className="mt-2 list-disc pl-5 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B] space-y-1">
            {job.responsibilities.map((task: string, idx: number) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
</div>

   
            </>
      )}
            </div>

            {/* Best Practices Tab */}
     {activeTab === "best" && userDetails?.best_practices_questions?.length > 0 && (
  <>
    <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000] mb-6">
      Best Practices Aligned CNESS
    </h3>
    <div className="border-t my-4" style={{ borderColor: "#0000001A" }} />

    <div className="grid gap-4 md:gap-5 [grid-template-columns:repeat(auto-fit,minmax(251px,1fr))]">
      {userDetails.best_practices_questions.map((section: any, index: number) => {
        const allQuestions = section.sub_sections?.flatMap(
          (sub: any) => sub.questions
        );

        if (!allQuestions?.length) return null;

        return allQuestions.map((question: any) => {
          const cardImages = [bcard1, bcard2, bcard3, bcard4];
          const imageForCard = cardImages[index % cardImages.length];

          return (
            <BestPracticeCard
              key={question.id}
              name={userDetails.first_name + " " + userDetails.last_name}
              username={userDetails.first_name}
              profileImage={userDetails.profile_picture || "/profile.png"}
              coverImage={imageForCard}
              title={section.section.name}
              description={question.answer?.answer || "No answer provided"}
              link={question.answer?.show_question_in_public ? "#read-more" : undefined}
            />
          );
        });
      })}
    </div>
  </>
)}

   {/* Best Practices profession */}
{activeTab === "best" && userDetails?.public_best_practices?.length > 0 && (
  <div className="  px-6 py-8 mt-5">
    <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
      Best Practices Aligned Professions
    </h3>

    <div className="border-t my-4" style={{ borderColor: "#0000001A" }} />

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {userDetails?.public_best_practices?.map((practice: any) => {
        return (
        <div
            key={practice?.id}
            onClick={(e) => {
                // Only navigate if it's not the Read More button
                if (!(e.target as HTMLElement).closest(".read-more-btn")) {
                    navigate(
                        `/dashboard/bestpractices/${practice.id}/${slugify(practice.title)}`,
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
                name={`${practice?.profile?.first_name || ""} ${practice?.profile?.last_name || ""}`.trim() || "CNESS User"}
                username={practice?.user?.username || "user"}
                profileImage={
                    practice?.profile?.profile_picture
                        ? practice.profile.profile_picture
                        : "/profile.png"
                }
                coverImage={
                    practice?.file
                        ? practice.file // normalizeFileUrl(practice.file)
                        : bcard1 || "https://cdn.cness.io/banner.webp"
                }
                title={practice?.title || practice?.profession_data?.title || "Untitled"}
                description={practice?.description || ""}
                link={`/dashboard/bestpractices/${practice.id}/${slugify(practice.title)}`}
            />
        </div>
        );
      })}
    </div>
  </div>
)}
      {/* Member Since */}
    <div className="pt-10 pl-6 font-['Open_Sans'] font-semibold text-[16px] leading-[20px] 
             tracking-[0px] text-[#000000]">
  <p>Member Since: August 14, 2020</p>
  <a href="#" className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
             tracking-[0px] text-[#64748B] underline">
    Report
  </a>
</div>
     
            </div>
     




          </div>
      </div>
    </div>
  );
}

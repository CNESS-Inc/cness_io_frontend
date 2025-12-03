import React from "react";
import { useNavigate } from "react-router-dom";
//import { useParams } from "react-router-dom";

import profilefill from "../../assets/profile-fill.svg";
import { Pencil } from "lucide-react";
const interests = [
  "Climate Action",
  "Renewable Energy",
  "Sustainable Development",
  "Wildlife",
  "Yoga",
  "Agriculture",
];

const professions = ["UI/UX Designer", "Developer"];


interface TagButtonProps {
  text: string;
}

const TagButton: React.FC<TagButtonProps> = ({ text }) => {
  return (
    <button className="bg-gray-50 border border-slate-300 text-slate-600 px-3 py-1.5 rounded-full text-xs hover:bg-gray-100 transition-colors">
      {text}
    </button>
  );
};

interface ProfileCardNewProps {
  profileImage: string;
  name: string;
  username: string;
  following: string;
  followers: string;
tabs: { label: string; icon:  React.ReactNode }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
}

const ProfileCardNew: React.FC<ProfileCardNewProps> = ({
  profileImage,
  name,
  username,
  //following,
  //followers,
  tabs,
  activeTab,
  onTabChange,
  //onOpenFollowers,
  //onOpenFollowing,
}) => {

  //const { id } = useParams();
//const userId = id || "defaultUserId"; // Fallback to a default value if id is undefined
const navigate = useNavigate();
  return (
<div className="p-6 pb-5 bg-white rounded-2xl ">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-[120px] h-[80px] flex-shrink-0">
  {/* Badge image (background) */}
  <img
    src="badge-image-url.png"
    alt="Badge"
    className="absolute top-0 right-0 w-[60px] h-[60px] object-contain z-0"
  />

  {/* Profile image (front) */}
  <img
    src={profileImage}
    alt="Profile"
    className="absolute top-1 left-0 w-[75px] h-[75px] rounded-full object-cover border-2 border-white z-10"
  />
</div>
          <div className="flex flex-col gap-3">
            <h1 className="text-base font-medium text-black font-poppins">
              {name} (<span className="text-slate-500">@{username}</span>)
            </h1>

            <div className="flex gap-3.5">
              {/*<span
                className="text-sm text-purple-600 font-jakarta cursor-pointer"
                onClick={onOpenFollowers}
              >
                {followers} Followers
              </span>}
       

              <span
                className="text-sm text-pink-500 font-jakarta cursor-pointer"
                onClick={onOpenFollowing}
              >
                {following} Following
              </span>*/}

                        <span className="font-jakarta font-normal text-[14px] text-purple-600"
  style={{
    lineHeight: "100%",
    letterSpacing: "0",
  }}>100 Resonators</span>
            <span className="font-jakarta font-normal text-[14px] text-pink-500"
  style={{
    lineHeight: "100%",
    letterSpacing: "0",
  }}>1k Resonating</span>
            <span className="font-jakarta font-normal text-[14px] text-purple-600"
  style={{
    lineHeight: "100%",
    letterSpacing: "0",
  }}>62 posts</span>
            </div>
          </div>
        </div>

       <button 
  onClick={() => navigate(`/dashboard/Profile/editprofile`)}
  className="relative z-50 bg-[#7077FE] hover:bg-[#7077FE] text-white px-6 py-2 rounded-full flex items-center gap-2 text-sm font-semibold"
>
          <Pencil
          
            className="w-4 h-4"
          />
          Edit Profile
        </button>
      </div>

      {/*about*/}
<div className="bg-white rounded-xl p-5 pl-0 w-full flex flex-col items-start">
      <div className="flex items-center gap-3 mb-4">
        <img 
          src=
          {profilefill} 
          alt="Profile" 
          className="w-6 h-6"
        />
       <h3
  className="font-[poppins] font-semibold text-[16px]  text-black"
  style={{
    lineHeight: "150%",   // 150% = 1.5
    letterSpacing: "0",
  }}
>About</h3>
      </div>
     <p
  className="text-[14px] font-normal"
  style={{
    fontFamily: "Open Sans, sans-serif",
    lineHeight: "21px",
    letterSpacing: "0",
    color: "#64748B",
  }}
>
  Rachel Anderson is a dedicated Environmental Activist and Sustainability Consultant with
  over a decade of experience in driving eco-conscious initiatives. She has worked with
  nonprofits, businesses, and communities to design strategies that reduce environmental
  impact, promote renewable energy adoption, and create long-term sustainable growth.
  Passionate about climate action and corporate responsibility, Rachel combines advocacy
  with practical solutions to help organizations align purpose with impact.
</p>
    </div>
      {/* INTERESTS */}
      <div className="mb-6 mt-4">
        <h3
  className="font-[poppins] font-semibold text-[16px] mb-2.5 text-black"
  style={{
    lineHeight: "150%",   // 150% = 1.5
    letterSpacing: "0",
  }}
>
  My Interests
</h3>
        <div className="flex flex-wrap gap-2.5">
          {interests.map((interest, index) => (
            <TagButton key={index} text={interest} />
          ))}
        </div>
      </div>

      {/* PROFESSIONS */}
      <div className="mb-6">
       <h3
  className="font-[poppins] font-semibold text-[16px] mb-2.5 text-black"
  style={{
    lineHeight: "150%",   // 150% = 1.5
    letterSpacing: "0",
  }}
>
          My Professions
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {professions.map((profession, index) => (
            <TagButton key={index} text={profession} />
          ))}
        </div>
      </div>

  {/* Tabs */}
      
      <div
        className="flex border-t border-gray-200"
        style={{
          height: "50px",
          gap: "20px",
          paddingTop: "8px",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.label}
onClick={() => onTabChange(tab.label)}
            className="relative transition-colors flex items-center justify-center gap-2"
            style={{
              width: "161.66px",
              height: "60px",
              paddingTop: "6px",
              paddingRight: "12px",
              paddingBottom: "12px",
              paddingLeft: "12px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: "14px",
              fontStyle: "normal",
              lineHeight: "100%",
              letterSpacing: "0",
              color: activeTab === tab.label ? "#9747FF" : "#374151",
            }}
          >
            {activeTab === tab.label && (
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 bottom-0 rounded-t-xl
              bg-linear-to-b from-[#FFFFFF] via-[#F5F2FF] to-[rgba(151,71,255,0.14)] z-0"
              />
            )}
            <span
              className="relative z-10 flex items-center gap-3"
              style={{
                color: "#222224",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                fontStyle: "normal", // 'Medium' handled by fontWeight
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0",
              }}
            >
              {tab.icon}
              {tab.label}
            </span>
            {activeTab === tab.label && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9747FF] rounded-full" />
            )}
          </button>
        ))}
      </div>

    </div>
  );
};

export default ProfileCardNew;

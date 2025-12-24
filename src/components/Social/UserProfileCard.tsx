import React from "react";
import profilefill from "../../assets/profile-fill.svg";

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
  followers: string;
  following: string;
  postCount?: string;
  about?: string;
  interests?: any[];
  professions?: any[];
  location?: string;
  badge?: any;
  tabs: { label: string; icon: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
}

const levels = [
  {
    key: "Aspiring",
    label: "ASPIRED",
    img: "https://cdn.cness.io/aspiringlogo.svg",
  },
  {
    key: "Inspired",
    label: "INSPIRED",
    img: "https://cdn.cness.io/inspired1.svg",
  },
  {
    key: "Leader",
    label: "LEADER",
    img: "https://cdn.cness.io/leader1.webp",
  },
];

const UserProfileCard: React.FC<ProfileCardNewProps> = ({
  profileImage,
  name,
  username,
  followers,
  following,
  badge,
  postCount = "0",
  interests = [],
  professions = [],
  tabs,
  about,
  activeTab,
  onTabChange,
  onOpenFollowers,
  onOpenFollowing,
}) => {
  const badgeImg = badge?.level
    ? levels.find((el) => el.key === badge?.level)?.img
    : "";

  return (
    <div className="px-3 sm:px-6 py-1 bg-white rounded-2xl">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-[120px] h-20 shrink-0 flex items-center">
            {/* Badge image (background) - you can update this with actual badge logic */}
            {badgeImg && (
              <div
                className="absolute top-1/2 -translate-y-1/2 right-1.5
                    w-[70px] h-[70px] z-0
                    flex items-center justify-center
                    rounded-full border border-gray-400"
              >
                <img
                  src={badgeImg}
                  alt="Badge"
                  className="w-[35px] h-[35px] object-contain"
                />
              </div>
            )}

            {/* Profile image (front) */}
            <img
              src={profileImage ? profileImage : "/profile.png"}
              alt="Profile"
              className="w-[75px] h-[75px] rounded-full object-cover border-2 border-white z-10"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-base font-medium text-black font-poppins">
              {name} (<span className="text-slate-500">@{username}</span>)
            </h1>

            <div className="flex gap-3.5">
              <span
                className="text-sm text-purple-600 font-jakarta cursor-pointer"
                onClick={onOpenFollowers}
              >
                {followers} Followers
              </span>

              <span
                className="text-sm text-pink-500 font-jakarta cursor-pointer"
                onClick={onOpenFollowing}
              >
                {following} Following
              </span>

              <span
                className="text-sm text-purple-600 font-jakarta cursor-pointer mt-1"
                style={{
                  lineHeight: "100%",
                  letterSpacing: "0",
                }}
              >
                {postCount} posts
              </span>
            </div>
          </div>
        </div>

        {/* <button
          onClick={() => navigate(`/dashboard/Profile/editprofile`)}
          className="bg-[#7077FE] text-white px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 text-sm font-semibold"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </button> */}
      </div>

      {/* About */}
      <div className="bg-white rounded-xl p-3 pl-0 w-full flex flex-col items-start">
        <div className="flex items-center gap-3 mb-4">
          <img src={profilefill} alt="Profile" className="w-6 h-6" />
          <h3
            className="font-[poppins] font-semibold text-[16px]  text-black"
            style={{
              lineHeight: "150%",
              letterSpacing: "0",
            }}
          >
            About
          </h3>
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
          {about || "No description available"}
        </p>
      </div>

      {/* INTERESTS */}
      {interests.length > 0 && (
        <div className="mb-6 mt-4">
          <h3
            className="font-[poppins] font-semibold text-[16px] mb-2.5 text-black"
            style={{
              lineHeight: "150%",
              letterSpacing: "0",
            }}
          >
            My Interest
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {interests.map((interest, index) => (
              <TagButton key={index} text={interest.name} />
            ))}
          </div>
        </div>
      )}

      {/* PROFESSIONS */}
      {professions.length > 0 && (
        <div className="mb-6">
          <h3
            className="font-[poppins] font-semibold text-[16px] mb-2.5 text-black"
            style={{
              lineHeight: "150%",
              letterSpacing: "0",
            }}
          >
            My Profession
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {professions.map((profession, index) => (
              <TagButton key={index} text={profession.title} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="-mx-3 sm:-mx-6">
        <div className="w-full border-t border-gray-200"></div>

        <div className="flex justify-start pt-2 px-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                onClick={() => onTabChange(tab.label)}
                className="relative transition-colors flex items-center justify-center gap-2 h-[50px] px-3 py-2"
                style={{
                  width: "161.66px",
                  height: "60px",
                  paddingTop: "6px",
                  paddingRight: "12px",
                  paddingBottom: "0px",
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
                    className="absolute top-0 left-0 right-0 bottom-0 rounded-t-xl bg-linear-to-b from-[#FFFFFF] via-[#F5F2FF] to-[rgba(151,71,255,0.14)] z-0"
                  />
                )}
                <span
                  className="relative z-10 flex items-center gap-2 sm:gap-3"
                  style={{
                    color: "#222224",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    fontStyle: "normal",
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
      </div>
    </div>
  );
};

export default UserProfileCard;

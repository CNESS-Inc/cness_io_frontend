import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { useParams } from "react-router-dom";

import profilefill from "../../assets/profile-fill.svg";
import { Pencil } from "lucide-react";
import { GetSocialProfileDetails } from "../../Common/ServerAPI";

// Updated interfaces to match API response
interface Interest {
  id: string;
  name: string;
}

interface Profession {
  profession_id: string;
  title: string;
  description: string | null;
}

interface Location {
  city: string;
  postal_code: string;
  address: string;
}

interface Country {
  id: string;
  name: string;
}

interface User {
  id: string;
  username: string;
}

interface ProfileData {
  id: string;
  badge?: {
    level: string;
    slug: string;
    id: string;
  } | null;
  user_id: string;
  first_name: string;
  last_name: string;
  profile_picture: string;
  location: Location;
  interests: Interest[];
  professions: Profession[];
  country: Country;
  user: User;
  about_us: string;
  following_count: number;
  followers_count: number;
  post_count: number;
}

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

const ProfileCardNew: React.FC<ProfileCardNewProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onOpenFollowers,
  onOpenFollowing,
}) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const badgeImg = profileData?.badge?.level ? levels.find((el) => el.key === profileData.badge?.level)?.img : '';

  const fetchMeDetails = async () => {
    try {
      setLoading(true);
      const res = await GetSocialProfileDetails();
      console.log("🚀 ~ fetchMeDetails ~ res:", res);

      if (res?.success?.status && res?.data?.data) {
        setProfileData(res.data.data);
      } else {
        setError("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching profile details:", error);
      setError("An error occurred while fetching profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeDetails();
  }, []);

  if (loading) {
    return (
      <div className="p-6 pb-5 bg-white rounded-2xl">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-[120px] h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="flex gap-3.5">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-full w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pb-5 bg-white rounded-2xl">
        <div className="text-center text-red-500">{error}</div>
        <button
          onClick={fetchMeDetails}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full mx-auto block"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  // Prepare data from API response
  const fullName = `${profileData.first_name} ${profileData.last_name}`;
  const username = profileData.user.username;
  const profileImage = profileData.profile_picture;
  const aboutText = profileData.about_us;
  const interests = profileData.interests.map(interest => interest.name);
  const professions = profileData.professions.map(profession => profession.title);

  // Use counts from API
  const followers = profileData.followers_count.toString();
  const following = profileData.following_count.toString();
  const postCount = profileData.post_count.toString();

  return (
    <div className="p-4 sm:p-6 pb-5 bg-white rounded-2xl">
      {/* TOP SECTION */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-[120px] h-20 shrink-0 flex items-center">
            {/* Badge image (background) - you can update this with actual badge logic */}

            <div className="absolute top-[50%] translate-y-[-50%] right-1.5 w-[70px] h-[70px] object-contain z-0 border flex justify-center items-center border-gray-400 rounded-full">
              <img
                src={badgeImg}
                alt="Badge"
                className="w-[35px] h-[35px] object-contain z-0"
              />

            </div>


            {/* Profile image (front) */}
            <img
              src={profileImage ? profileImage : "/profile.png"}
              alt="Profile"
              className="w-[75px] h-[75px] rounded-full object-cover border-2 border-white z-10"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-base font-medium text-black font-poppins">
              {fullName} (<span className="text-slate-500">@{username}</span>)
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

        <button
          onClick={() => navigate(`/dashboard/Profile/editprofile`)}
          className="bg-[#7077FE] text-white px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 text-sm font-semibold"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      {/* About */}
      <div className="bg-white rounded-xl p-5 pl-0 w-full flex flex-col items-start">
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
          {aboutText || "No description available"}
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
            My Interests
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {interests.map((interest, index) => (
              <TagButton key={index} text={interest} />
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
            My Professions
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {professions.map((profession, index) => (
              <TagButton key={index} text={profession} />
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex justify-start border-t border-gray-200 pt-2">
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
  );
};

export default ProfileCardNew;
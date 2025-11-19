import React from "react";
import type { ReactElement } from "react";
import { Pen } from "lucide-react";
import { useNavigate } from "react-router-dom";

type TabType = { label: string; icon: ReactElement };

type ProfileCardProps = {
  profileImage?: string;
  name?: string;
  username?: string;
  following?: string;
  followers?: string;
  tabs: TabType[];
  onTabChange?: (tab: string) => void;
  onOpenFollowing: () => void;
  onOpenFollowers: () => void;
  activeTab: string;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  profileImage,
  name,
  username,
  following,
  followers,
  tabs,
  onTabChange,
  onOpenFollowers,
  onOpenFollowing,
  activeTab,
}) => {
  //const [activeTab, setActiveTab] = useState(tabs[0]?.label || "");

  const navigate = useNavigate();
  const handleTabClick = (tab: string) => {
    if (onTabChange) onTabChange(tab); // Notify parent
  };

  return (
    <div
      className="rounded-xl border border-gray-200 bg-white flex flex-col"
      style={{
        width: "100%",
        gap: "18px",
        paddingTop: "18px",
        paddingBottom: "18px",
      }}
    >
      {/* Profile Info */}
      <div
        className="flex items-center justify-between px-6"
        style={{ height: "57px" }}
      >
        <div className="flex items-center gap-4">
          <img
            src={
              !profileImage ||
              profileImage === "null" ||
              profileImage === "undefined"
                ? "/profile.png"
                : profileImage
            }
            alt={name}
            className="w-[60px] h-[60px] rounded-full object-cover"
          />
          <div>
            {name && (
              <h3 className="text-lg font-semibold text-gray-800">{name || ""}</h3>
            )}
            {username && <p className="text-sm text-gray-500">@{username || ""}</p>}
            <div
              className="flex gap-4 mt-1"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                fontStyle: "normal", // Regular
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0",
              }}
            >
              <span
                className="text-[#9747FF] font-medium cursor-pointer"
                onClick={() => onOpenFollowing()}
              >
                {following} Following
              </span>
              <span
                className="text-[#D748EA] font-medium cursor-pointer"
                onClick={() => onOpenFollowers()}
              >
                {followers} Followers
              </span>
            </div>
          </div>
        </div>

        <button
          className="px-4 py-2 bg-[#7C4DFF] hover:bg-[#6a3de6] text-white rounded-full text-sm flex items-center gap-2"
          onClick={() => navigate("/dashboard/user-profile")}
        >
          <Pen className="h-4 w-4" />
          Edit Profile
        </button>
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
            onClick={() => handleTabClick(tab.label)}
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

export default ProfileCard;

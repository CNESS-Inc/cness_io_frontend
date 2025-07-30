import {
  // BellIcon,
  SearchIcon,
  SettingsIcon,
  LogOutIcon,
  BellIcon,
  HelpCircleIcon,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import hambur from "../../assets/hambur.png";
import { GetUserNotificationCount, LogOut } from "../../Common/ServerAPI";
import { useToast } from "../../components/ui/Toast/ToastProvider";

const DashboardHeader = ({ toggleMobileNav }: any) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add state for name values
  const [name, setName] = useState(localStorage.getItem("main_name") || "");

const [notificationCount, setNotificationCount] = useState(
  localStorage.getItem("notification_count") || "0"
);
  const [margaretName, setMargaretName] = useState(
    localStorage.getItem("margaret_name") || ""
  );
  const [profilePic, setProfilePic] = useState(
    localStorage.getItem("profile_picture") || ""
  );
  
  const { showToast } = useToast();
  


  // Watch for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setName(localStorage.getItem("main_name") || "");
      setMargaretName(localStorage.getItem("margaret_name") || "");
      setProfilePic(localStorage.getItem("profile_picture") || "");
      setNotificationCount(localStorage.getItem("notification_count") || "0");
    };

    // Listen for storage events (changes from other tabs)
    window.addEventListener("storage", handleStorageChange);

    // Also check for changes periodically (in case changes happen in the same tab)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    const personOrganization = localStorage.getItem("person_organization");

    if (personOrganization === "2") {
      navigate("/dashboard/company-profile");
    } else if (personOrganization === "1") {
      navigate("/dashboard/user-profile");
    }
  };

  const defaultAvatar =
    "https://c.animaapp.com/magahlmqpONVZN/img/ellipse-3279.svg";

  const handleLogout = async () => {
    try {
      const response = await LogOut();

      if (response) {
        localStorage.clear();
        toggleMobileNav();
        navigate("/");
      }
    } catch (error: any) {
      console.error("Logout failed:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#0000001a] relative px-4 py-[18px] md:pl-[260px] flex items-center justify-between">
      {/* Left side - Hamburger (mobile) and Search */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger only */}
        <div className="block md:hidden">
          <button
            onClick={toggleMobileNav}
            className="flex items-center justify-center w-[41px] h-[41px] bg-white rounded-xl border border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d] cursor-pointer transition"
          >
            <img src={hambur} alt="Menu" className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="ml-2 sm:ml-4 md:ml-6 flex items-center justify-between p-3 relative bg-white rounded-xl border border-solid border-slate-300 w-full md:w-[440px]">
          <Input
            className="border-0 shadow-none p-0 h-auto font-['Open_Sans',Helvetica] text-[#afb1b3] text-sm placeholder:text-[#afb1b3] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search"
          />
          <SearchIcon className="w-[15px] h-[15px] text-[#afb1b3]" />
        </div>
      </div>

      {/* Right side - Icons and User Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Logout Button */}
          <div className="relative group">
            <div
              onClick={handleLogout}
              className="flex w-[32px] h-[32px] items-center justify-center relative bg-white rounded-xl overflow-hidden border-[0.59px] border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d] cursor-pointer hover:bg-gray-50 transition"
            >
              <LogOutIcon className="w-[15px] h-[15px] text-[#897AFF]" />
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Logout
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
            </span>
          </div>

          {/* Logout Button */}
          <div className="relative group">
            <div
              onClick={() => navigate("/dashboard/support")}
              className="flex w-[32px] h-[32px] items-center justify-center relative bg-white rounded-xl overflow-hidden border-[0.59px] border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d] cursor-pointer hover:bg-gray-50 transition"
            >
              <HelpCircleIcon className="w-[15px] h-[15px] text-[#897AFF]" />
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Support
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
            </span>
          </div>

          {/* Notification Button */}
          <div className="relative group">
            <div
              onClick={() => navigate("/dashboard/notification")}
              className="flex w-[32px] h-[32px] items-center justify-center relative bg-white rounded-xl overflow-hidden border-[0.59px] border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d] cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="relative">
                <BellIcon className="w-[15px] h-[15px] text-[#897AFF]" />
                {notificationCount != "0" && (
                  <div className="w-[12px] h-[12px] absolute -top-1 left-1 bg-[#60c750] rounded-full flex items-center justify-center">
                    <span className="font-['Poppins',Helvetica] font-normal text-white text-[7px]">
                      {notificationCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Notifications
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
            </span>
          </div>

          {/* Settings Button */}
          <div className="relative group">
            <div
              onClick={() => navigate("/dashboard/setting")}
              className="flex w-[32px] h-[32px] items-center justify-center relative bg-white rounded-xl overflow-hidden border-[0.59px] border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d] cursor-pointer hover:bg-gray-50 transition"
            >
              <SettingsIcon className="w-[15px] h-[15px] text-[#897AFF]" />
            </div>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none">
              Settings
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></span>
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center relative" ref={dropdownRef}>
          <button
            onClick={handleProfile}
            className="flex items-center focus:outline-none cursor-pointer"
          >
            <Avatar>
              <AvatarImage
                src={profilePic || defaultAvatar}
                alt="User avatar"
                className="w-[44.25px] h-[44.25px] rounded-full border-[0.39px] border-transparent bg-gradient-to-r from-[#9747FF] to-[#F3CCF3]"
              />
            </Avatar>

            {name !== "null null" && (
              <div className="flex flex-col items-start">
                <div className="px-2 py-0.5 flex items-center">
                  <div className="font-['Poppins',Helvetica] font-medium text-[#222224] text-sm">
                    {name}
                  </div>
                </div>

                <div className="px-2 py-0.5">
                  <div className="font-['Open_Sans',Helvetica] font-normal text-[#7a7a7a] text-[10px]">
                    {margaretName}
                  </div>
                </div>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOutIcon className="w-4 h-4 mr-3 text-gray-500" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile-only avatar icon with dropdown */}
        <div className="md:hidden flex items-center relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="focus:outline-none cursor-pointer"
          >
            <Avatar>
              <AvatarImage
                src={profilePic || defaultAvatar}
                alt="User avatar"
                className="w-[44.25px] h-[44.25px] rounded-full border-[0.39px] border-transparent bg-gradient-to-r from-[#9747FF] to-[#F3CCF3]"
              />
            </Avatar>
          </button>

          {/* Mobile Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <LogOutIcon className="w-4 h-4 mr-3 text-gray-500" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

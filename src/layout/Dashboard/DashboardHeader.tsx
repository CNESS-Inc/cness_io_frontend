import {
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
import { GetUserNotification, LogOut,GetUserNotificationCount  } from "../../Common/ServerAPI";
import { useToast } from "../../components/ui/Toast/ToastProvider";
import { initSocket } from "../../Common/socket";
import { BsCaretDownFill } from "react-icons/bs";

// Define the notification interface
interface Notification {
  id: string;
  notification_type: string;
  is_read: boolean;
  sender_id: string | null;
  receiver_id: string;
  title: string;
  description: string;
  createdAt: string;
  redirection: string | null;
  data_id: string | null;
  sender_user: {
    id: string;
    role: string | null;
    is_active: boolean;
  } | null;
  sender_profile: {
    user_id: string;
    first_name: string;
    last_name: string;
  } | null;
}

const DashboardHeader = ({
  toggleMobileNav,
  isMobileNavOpen,
}: {
  toggleMobileNav: () => void;
  isMobileNavOpen: boolean;
}) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSupportDropdownOpen, setIsSupportDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationDropdownRef = useRef<HTMLDivElement>(null);

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

  // State for notifications from API
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const socket = initSocket(token);

    const handleConnect = () => {
      console.log("✅ Connected to socket server");
    };

    const handleError = (err: any) => {
      console.error("❌ Connection failed:", err.message);
    };

    const handleNotification = (data: {
      redirection: any;
      data_id: any;
      id: string;
      notification_type: string;
      is_read: boolean;
      sender_id: string | null;
      createdAt: any;
      receiver_id: string;
      sender_profile: {
        user_id: string;
        first_name: string;
        last_name: string;
      } | null;
      sender_user: {
        id: string;
        role: string | null;
        is_active: boolean;
      } | null;
      count: number;
      message: { title: string; description: string };
    }) => {
      // Update notification count
      setNotificationCount(data.count.toString());
      localStorage.setItem("notification_count", data.count.toString());

      // Add new notification to the top of the list
      if (data.message) {
        const newNotification: Notification = {
          id: data?.id,
          notification_type: data?.notification_type,
          is_read: data?.is_read,
          sender_id: data?.sender_id,
          receiver_id: data?.receiver_id,
          title: data.message?.title,
          description: data?.message?.description,
          createdAt: data?.createdAt?.toISOString(),
          sender_user: data?.sender_user,
          sender_profile: data?.sender_profile,
          redirection: data?.redirection,
          data_id: data?.data_id,
        };

        setNotifications((prev: Notification[]) => [
          newNotification,
          ...prev.slice(0, 9),
        ]);

        // Show notification message as toast
        showToast({
          message: data.message.description,
          title: data.message.title,
          type: "notification",
          duration: 5000,
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleError);
    socket.on("notificationCount", handleNotification);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleError);
      socket.off("notificationCount", handleNotification);
    };
  }, [showToast]);

  // Watch for localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      setName(localStorage.getItem("main_name") || "");
      setMargaretName(localStorage.getItem("margaret_name") || "");
      setProfilePic(localStorage.getItem("profile_picture") || "");
      setNotificationCount(localStorage.getItem("notification_count") || "0");
    };

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsNotificationDropdownOpen(false);
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

  const getNotification = async () => {
    try {
      const res = await GetUserNotification();
      console.log("🚀 ~ getNotification ~ res:", res);

      if (res?.data?.data) {
        // Get first 10 notifications from the API response
        const firstTenNotifications = res.data.data.slice(0, 10);
        setNotifications(firstTenNotifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    // Mark all notifications as read when opening the dropdown
    if (!isNotificationDropdownOpen) {
      setNotifications((prev: Notification[]) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      // setNotificationCount("0");
    }
  };

  const handleViewAllNotifications = () => {
    setIsNotificationDropdownOpen(false);
    navigate("/dashboard/notification");
  };

  // Handle notification click and redirect based on redirection type
  const handleNotificationItemClick = (notification: Notification) => {
    setIsNotificationDropdownOpen(false);

    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
    );

    // Build query string
    const query = `?openpost=true&dataset=${notification.data_id || ""}`;

    // Handle redirection based on notification type
    switch (notification.redirection) {
      case "profile":
        if (notification.data_id) {
          navigate(`/dashboard/userprofile/${notification.data_id}`);
        }
        break;

      case "post":
        if (notification.data_id) {
          navigate(`/dashboard/profile${query}`);
        }
        break;

      default:
        // For notifications without specific redirection or unknown types
        navigate(`/dashboard/notification${query}`);
        break;
    }
  };

  // Format the date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    // Convert both dates to timestamps (numbers) before subtraction
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} min ago`;
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  // Get sender name from notification
  const getSenderName = (notification: Notification) => {
    if (notification.sender_profile) {
      return `${notification.sender_profile.first_name} ${notification.sender_profile.last_name}`;
    }
    return "System";
  };

  useEffect(() => {
    getNotification();
  }, []);


  const fetchNotificationCount = async () => {
  try {
    const res = await GetUserNotificationCount();
    if (res?.data?.data) {
      setNotificationCount(res.data.data.count.toString());
      localStorage.setItem("notification_count", res.data.data.count.toString());
    }
  } catch (error) {
    console.error("Error fetching notification count:", error);
  }
};
useEffect(() => {
  fetchNotificationCount();
}, []);

  return (
    <header className="w-full bg-white border-b border-[#0000001a] relative px-4 py-[18px] flex items-center justify-between">
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
        <div
          className={`hidden lg:flex items-center justify-between p-3 relative bg-white rounded-xl border border-solid border-slate-300 w-full lg:w-[430px] xl:w-[450px] ${
            isMobileNavOpen ? "ml-6" : "ml-14"
          }`}
        >
          <Input
            className="border-0 shadow-none p-0 h-auto font-['Open_Sans',Helvetica] text-[#afb1b3] text-sm placeholder:text-[#afb1b3] focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Search"
          />
          <SearchIcon className="w-[15px] h-[15px] text-[#afb1b3]" />
        </div>
        <div
          className={`flex lg:hidden items-center ${
            isMobileNavOpen ? "ml-6" : "ml-0"
          }`}
        >
          <button
            onClick={() => setSearchOpen(true)}
            className="p-3 bg-white rounded-xl border border-slate-300 hover:bg-gray-50 transition"
            aria-label="Open search"
          >
            <SearchIcon className="w-[20px] h-[20px] text-[#afb1b3]" />
          </button>
          {searchOpen && (
            <div
              className={`fixed top-0 bottom-0 right-0 z-50 bg-black/30 flex items-start justify-center ${
                isMobileNavOpen ? "md:left-[256px]" : "md:left-0"
              } left-0`}
              style={{
                // Optionally, for extra control:
                left: isMobileNavOpen && window.innerWidth >= 768 ? 256 : 0,
              }}
            >
              <div className="w-full max-w-2xl mx-10 mt-10 bg-white rounded-xl shadow-lg flex items-center px-6 py-4 relative">
                <Input
                  autoFocus
                  className="flex-1 border-0 shadow-none p-0 h-auto font-['Open_Sans',Helvetica] text-[#222] text-lg placeholder:text-[#afb1b3] focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="ml-4 text-[#afb1b3] hover:text-gray-700 text-xl"
                  aria-label="Close search"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Icons and User Profile */}
      <div className="flex items-center justify-end sm:justify-cneter gap-3">
        <div className="hidden sm:flex items-center gap-2">
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

          {/* Support Button */}
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

          {/* Notification Button with Dropdown */}
          <div className="relative group" ref={notificationDropdownRef}>
            <div
              onClick={handleNotificationClick}
              className="flex w-[32px] h-[32px] items-center justify-center relative bg-white rounded-xl overflow-hidden border-[0.59px] border-solid border-[#eceef2] shadow-[0px_0px_4.69px_1.17px_#0000000d] cursor-pointer hover:bg-gray-50 transition"
            >
              <div className="relative">
                <BellIcon className="w-[15px] h-[15px] text-[#897AFF]" />
                {notificationCount !== "0" && (
                  <div className="w-[12px] h-[12px] absolute -top-1 left-1 bg-[#60c750] rounded-full flex items-center justify-center">
                    <span className="font-['Poppins',Helvetica] font-normal text-white text-[7px]">
                      {notificationCount}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notification Dropdown */}
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                </div>

                <div className="max-h-60 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications
                      .slice(0, 5)
                      .map((notification: Notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                            !notification.is_read ? "bg-blue-50" : ""
                          }`}
                          onClick={() =>
                            handleNotificationItemClick(notification)
                          }
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium text-sm text-gray-800">
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.description}
                          </p>
                          {notification.sender_profile && (
                            <p className="text-xs text-gray-500 mt-1">
                              From: {getSenderName(notification)}
                            </p>
                          )}
                        </div>
                      ))
                  ) : (
                    <div className="px-4 py-3 text-center text-gray-500">
                      No notifications
                    </div>
                  )}
                </div>

                <div
                  className="px-4 py-2 text-center border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={handleViewAllNotifications}
                >
                  <span className="text-sm text-[#897AFF] font-medium">
                    View All Notifications
                  </span>
                </div>
              </div>
            )}
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

        {/* Mobile Actions Dropdown (sm and below) */}
        <div className="sm:hidden relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSupportDropdownOpen(!isSupportDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-xl border border-[#eceef2] shadow-sm transition hover:bg-gray-50"
          >
            <BsCaretDownFill
              className={`w-[18px] h-[18px] text-[#897AFF] transition-transform duration-300 ${
                isSupportDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {isSupportDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-2 animate-fadeIn">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full transition"
              >
                <LogOutIcon className="w-4 h-4 text-[#897AFF]" /> Logout
              </button>

              <button
                onClick={() => navigate("/dashboard/support")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full transition"
              >
                <HelpCircleIcon className="w-4 h-4 text-[#897AFF]" /> Support
              </button>

              <button
                onClick={handleNotificationClick}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full transition"
              >
                <BellIcon className="w-4 h-4 text-[#897AFF]" /> Notifications
              </button>

              <button
                onClick={() => navigate("/dashboard/setting")}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 w-full transition"
              >
                <SettingsIcon className="w-4 h-4 text-[#897AFF]" /> Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

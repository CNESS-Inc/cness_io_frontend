import { useState } from "react";
import {
  AwardIcon,
  BadgePlusIcon,
  BellIcon,
  FileBarChartIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UploadIcon,
  UserIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const DashboardNavbar = ({ isMobileNavOpen, toggleMobileNav }: any) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const navigate = useNavigate();
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
=======
    const { showToast } = useToast();
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});
  const showFilterSidebar =
    currentPath.includes("/dashboard/DashboardDirectory/technology") ||
    currentPath.includes("/dashboard/search-listing");
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes

  const handleLogout = () => {
    try {
      localStorage.clear();
      setIsProfileOpen(false); // if dropdown open, close it
      toggleMobileNav(); // close sidebar on mobile
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items data
  const mainNavItems = [
    {
      icon: <LayoutDashboardIcon className="w-5 h-5" />,
      label: "Dashboard",
      active: true,
      path: "/dashboard",
    },
    {
      icon: <AwardIcon className="w-5 h-5" />,
      label: "Get Certified",
      active: false,
    },
    {
      icon: <UploadIcon className="w-5 h-5" />,
      label: "Upload Proof",
      active: false,
    },
    {
      icon: <FileBarChartIcon className="w-5 h-5" />,
      label: "Score & Results",
      active: true,
<<<<<<< Updated upstream
      path: "/score-result",
=======
<<<<<<< HEAD
      path: "/score-result",
=======
      path: "/dashboard/DashboardDirectory",
      isDirectoryDropdown: true,
      childPaths: ["/dashboard/search-listing"],
      children: [
        { label: "Search Listing", path: "/dashboard/search-listing" },
        { label: "Edit Public Listing", path: "/dashboard/editpubliclisting" },

      ],
    },


    {
      id: "Best Practices Hub",
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Best Practices Hub",
      active: true,
      path: "/dashboard/bestpractices",
      isbestpractices: true,
      children: [
        { label: "Manage Best Practices", path: "/dashboard/manage_bestpractices" },
      ],
    },

    {
      id: "market-place",
      icon: <img src={iconMap["market"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Market Place",
      active: true,
      path: "/dashboard/market-place",
      isMarketplaceDropdown: true,
      childPaths: ["/dashboard/DigitalProducts"],
      children: [
        { label: "Buy Digital Products", path: "/dashboard/digital_products" },
        { label: "Sell your Products", path: "/dashboard/SellProducts" },
        { label: "Track Purchase & Sales", path: "/dashboard/Tracking" },
        { label: "Creator Guideline", path: "/dashboard/CreatorGuideline" },
      ],
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes
    },
    {
      icon: <GraduationCapIcon className="w-5 h-5" />,
      label: "Learning Lab (LMS)",
      active: false,
    },
    {
      icon: <BadgePlusIcon className="w-5 h-5" />,
      label: "Upgrade Badge",
      active: false,
    },
    {
      icon: <UserIcon className="w-5 h-5" />,
      label: "Directory Profile",
      active: false,
    },
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
=======

    {
      icon: <BadgePlus className="w-5 h-5" />,
      label: "Generate Badge Code",
      active: false,
      path: "/dashboard/GenerateBadgeCode",
    },
    {
      icon: <img src={iconMap["community"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Affiliate",
      active: false,
      path: "/dashboard/GenerateAffiliateCode",
    },

>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes
  ];

  const secondaryNavItems = [
    {
      icon: <BellIcon className="w-5 h-5" />,
      label: "Notifications",
      active: false,
      hasNotification: true,
    },
    {
      icon: <SettingsIcon className="w-5 h-5" />,
      label: "Settings",
      active: false,
    },
    {
      icon: <HelpCircleIcon className="w-5 h-5" />,
      label: "Support",
      active: false,
    },
    {
      icon: <LogOutIcon className="w-5 h-5" />,
      label: "Logout",
      active: false,
      customAction: handleLogout,
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileNav}
        />
      )}

      {/* Navbar Container */}
      <nav
        className={`
        fixed md:relative
        h-full w-[280px]
        bg-white border-r border-[#0000001a]
        transition-all duration-300 ease-in-out
        z-50
        ${isMobileNavOpen ? "left-0" : "-left-full md:left-0"}
      `}
      >
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Mobile Close Button */}
          <div className="md:hidden flex justify-end px-2">
            <button onClick={toggleMobileNav} className="p-2">
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
<<<<<<< Updated upstream
=======
=======
        <div className="flex flex-col h-full overflow-y-auto font-poppins leading-[20px]">
          <div className="flex items-center justify-between w-full py-[18px] px-4 md:px-6">
            <Link to="/dashboard">
              <img
                className="w-[108.12px] h-[46.51px]"
                alt="Company Logo"
                src="https://c.animaapp.com/magahlmqpONVZN/img/component-1.svg"
              />
            </Link>
            <div className="hidden md:block ml-auto">
              <button
                onClick={toggleMobileNav}
                className="p-2 cursor-pointer focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                <img src={hambur} alt="Toggle Menu" className="w-6 h-6" />
              </button>
            </div>
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes
          </div>

          {/* Logo */}
          <div className="flex flex-col items-start gap-[7.5px] py-[18px] px-6">
            <img
              className="w-[108.12px] h-[46.51px]"
              alt="Company Logo"
              src="https://c.animaapp.com/magahlmqpONVZN/img/component-1.svg"
            />
          </div>

          {/* Main Menu Items */}
          <div className="flex flex-col items-start gap-1 px-3 w-full">
            {mainNavItems.map((item, index) => (
              <NavItem key={index} item={item} onClick={toggleMobileNav} />
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px">
            <img
              className="w-full h-px object-cover"
              alt="Divider"
              src="https://c.animaapp.com/magahlmqpONVZN/img/line-1.svg"
            />
          </div>

          {/* Profile Dropdown (tight, clean layout) */}
          <div className="w-full px-3">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-between w-full px-4 py-[10px] rounded-xl cursor-pointer text-slate-500 hover:bg-[#f3e8ff] transition"
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Profile</span>
              </div>
              {isProfileOpen ? (
                <ChevronUpIcon className="w-4 h-4" />
              ) : (
                <ChevronDownIcon className="w-4 h-4" />
              )}
            </button>

            {isProfileOpen && (
              <div className="flex flex-col gap-[2px] mt-[2px] ml-[52px]">
                <NavLink
                  to="/user-profile"
                  onClick={toggleMobileNav}
                  className={({ isActive }) =>
                    `text-sm px-3 py-[6px] rounded-lg w-full transition ${
                      isActive
                        ? "bg-[#f3e8ff] text-[#9747FF] font-semibold"
                        : "text-slate-500 hover:bg-[#f9f9f9]"
                    }`
                  }
                >
                  My Profile
                </NavLink>
                <NavLink
                  to="/company-profile"
                  onClick={toggleMobileNav}
                  className={({ isActive }) =>
                    `text-sm px-3 py-[6px] rounded-lg w-full transition ${
                      isActive
                        ? "bg-[#f3e8ff] text-[#9747FF] font-semibold"
                        : "text-slate-500 hover:bg-[#f9f9f9]"
                    }`
                  }
                >
                  Company Profile
                </NavLink>
              </div>
            )}
          </div>

          {/* Secondary Menu Items */}
          <div className="flex flex-col items-start gap-1 px-3 w-full">
            {secondaryNavItems.map((item, index) => (
              <NavItem key={index} item={item} onClick={toggleMobileNav} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

// Extracted NavItem component for cleaner code
const NavItem = ({ item, onClick }: any) => {
  const baseClasses =
    "flex items-center gap-3 px-4 py-3 w-full rounded-xl cursor-pointer";
  const activeClasses = "bg-[#f3e8ff] text-[#9747FF] font-semibold";
  const inactiveClasses = "text-slate-500 hover:bg-[#f3e8ff]";

  const content = (
    <>
      <div className="inline-flex items-start gap-2.5">{item.icon}</div>
      <div className="font-medium text-sm">{item.label}</div>
      {item.hasNotification && (
        <div className="absolute w-2 h-2 top-[13px] -left-px bg-orange-500 rounded-full border border-white" />
      )}
    </>
  );

  const handleClick = () => {
    if (item.customAction) {
      item.customAction(); 
    } else {
      onClick();
    }
  };

  return item.path ? (
    <NavLink
      to={item.path}
      onClick={handleClick}
      className={({ isActive }) =>
        `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
      }
    >
      <div className="flex items-start gap-3 w-full relative">{content}</div>
    </NavLink>
  ) : (
    <div className={`${baseClasses} ${inactiveClasses}`} onClick={handleClick}>
      <div className="flex items-start gap-3 w-full relative">{content}</div>
    </div>
  );
};

export default DashboardNavbar;

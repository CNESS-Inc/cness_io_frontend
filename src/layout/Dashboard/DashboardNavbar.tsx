import { useState, useEffect } from "react";
import {
  BellIcon,
  HelpCircleIcon,
  SettingsIcon,
  XIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
} from "lucide-react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { iconMap } from '../../assets/icons';
import hambur from "../../assets/hambur.png";

const DashboardNavbar = ({ isMobileNavOpen, toggleMobileNav }: any) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    if (
      location.pathname.startsWith('/dashboard/user-profile') || 
      location.pathname.startsWith('/dashboard/company-profile')
    ) {
      setIsProfileOpen(true);
    } else {
      setIsProfileOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    try {
      localStorage.clear();
      setIsProfileOpen(false);
      toggleMobileNav();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const mainNavItems = [
    {
      icon: <img src={iconMap["home"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Home/Dashboard",
      active: true,
      path: "/dashboard",
    },
    {
      icon: <img src={iconMap["usericon"]} alt="Home Icon" className="w-5 h-5" />,
      label: "True Profile",
      active: false,
      isProfileDropdown: true,
      childPaths: [
        "/dashboard/user-profile",
        "/dashboard/company-profile"
      ]
    },
    {
      icon: <img src={iconMap["certify"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Certifications",
      active: false,
      isCertificationsDropdown: true,
      childPaths: ["/dashboard/assesment", "/dashboard/score-result","/dashboard/upgrade-badge"],
      children: [
        { label: "Get Certified", path: "/dashboard/assesment" },
        { label: "Upload Proof", path: "" },
        { label: "Score & Results", path: "/dashboard/score-result" },
        { label: "Upgrade Badge", path: "/dashboard/upgrade-badge" },
      ],
    },
    {
      icon: <img src={iconMap["directory"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Directory",
      active: false,
      isDirectoryDropdown: true,
      childPaths: ["/dashboard/search_listing"],
      children: [
        { label: "Search Listing", path: "/dashboard/search_listing" },
        { label: "Edit Public Listing", path: "" },
        { label: "Visibility Settings", path: "" },
        { label: "Rating & Reviews", path: "" },
      ],
    },
    {
      icon: <img src={iconMap["market"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Market Place",
      active: true,
      path: "/dashboard/market_place",
      isMarketplaceDropdown: true,
      childPaths: ["/dashboard/DigitalProducts"],
      children: [
        { label: "Buy Digital Products", path: "/dashboard/digital_products" },
        { label: "Sell ypur Products", path: "" },
        { label: "Track Purchase & Sales", path: "" },
        { label: "Creator Guideline", path: "" },
      ],
    },
    {
      icon: <img src={iconMap["social"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Social",
      active: false,
      isSocialDropdown: true,
      childPaths: ["/dashboard/Feed"],
      children: [
        { label: "Feed", path: "/dashboard/Feed" },
        { label: "Profile", path: "" },
        { label: "My Connections", path: "" },
        { label: "Messagings", path: "" },
      ],
    },
    {
      icon: <img src={iconMap["community"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Community",
      active: false,
      isCommunityDropdown: true,
      childPaths: ["/dashboard/SearchExplore"],
      children: [
        { label: "Search & Explore", path: "/dashboard/SearchExplore" },
        { label: "Create Circles (Coming Soon)", path: "" },
        { label: "Manage Circles (Coming Soon)", path: "" },
        { label: "Messagings", path: "" },
      ],
    },
    {
      icon: <img src={iconMap["mentor"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Mentor Partner Hub",
      active: false,
      isMentorDropdown: true,
      childPaths: ["/dashboard/BecomeMentor"],
      children: [
        { label: "Became an Mentor", path: "/dashboard/Become_mentor" },
        { label: "Mentor Dashboard", path: "" },
        { label: "Track Progress", path: "" },
        { label: "Partner License & Toolkit", path: "" },
        { label: "Partner Dashboard", path: "" },
      ],
    },
    {
      icon: <img src={iconMap["learning"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Learning Lab",
      active: false,
      isLearningLabDropdown: true,
      childPaths: ["/dashboard/learning-lab"],
      children: [
        { label: "Modules", path: "/dashboard/learning-lab" },
        { label: "Learning Progress", path: "" },
        { label: "Renewal", path: "" },
        { label: "Resources", path: "" },
      ],
    },
  ];

  const secondaryNavItems = [
    {
      icon: <BellIcon className="w-5 h-5" />,
      label: "Notifications",
      active: false,
      hasNotification: true,
      path: "/dashboard/notification",
    },
    {
      icon: <SettingsIcon className="w-5 h-5" />,
      label: "Settings",
      active: false,
      path: "/dashboard/setting",
    },
    {
      icon: <HelpCircleIcon className="w-5 h-5" />,
      label: "Support",
      active: false,
      path: "/dashboard/support",
    },
    {
      icon: <LogOutIcon className="w-5 h-5" />,
      label: "Logout",
      active: false,
      customAction: handleLogout,
    },
  ];
  // NavItem component with profile dropdown support
  const NavItem = ({ item, onClick }: any) => {
    const location = useLocation();
const isDropdownOpen = openDropdown === item.label;
    const isActiveChild = item.childPaths?.some((path:any) => 
      location.pathname.startsWith(path)
    );

const baseClasses = "flex items-center gap-3 px-3 py-2.5 w-full rounded-xl cursor-pointer font-poppins text-sm font-medium leading-[20px]";
    const activeClasses = "bg-[#f3e8ff] text-[#9747FF] font-semibold";
    const inactiveClasses = "text-slate-500 hover:bg-[#f3e8ff]";

    const content = (
      <>
        <div className="inline-flex items-start gap-2.5">{item.icon}</div>
        <div className="font-medium text-sm whitespace-nowrap">{item.label}</div>
        {item.hasNotification && (
          <div className="absolute w-2 h-2 top-[13px] -left-px bg-orange-500 rounded-full border border-white" />
        )}
      </>
    );

    const handleClick = () => {
      if (item.customAction) {
        item.customAction();
      } else {
        // onClick();
      }
    };

    if (item.isProfileDropdown) {
      return (
        <div className="w-full">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`${baseClasses} ${
              isActiveChild ? activeClasses : inactiveClasses
            }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
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
                to="/dashboard/user-profile"
                onClick={onClick}
                className={({ isActive }) =>
                  `text-sm px-3 py-[6px] rounded-lg w-full transition whitespace-nowrap ${
                    isActive
                      ? " text-[#F07EFF] font-semibold"
                      : "text-slate-500 hover:bg-[#f9f9f9]"
                  }`
                }
              >
                My Profile
              </NavLink>
              <NavLink
                to="/dashboard/company-profile"
                onClick={onClick}
                className={({ isActive }) =>
                  `text-sm px-3 py-[6px] rounded-lg w-full transition whitespace-nowrap ${
                    isActive
                      ? " text-[#F07EFF] font-semibold"
                      : "text-slate-500 hover:bg-[#f9f9f9]"
                  }`
                }
              >
                Company Profile
              </NavLink>
            </div>
          )}
        </div>
      );
    }

 // Handle Dropdown Menus
if (item.children?.length > 0) {
  return (
    <div className="w-full">
      <button
        onClick={() => {
          if (item.path) {
            navigate(item.path); // ✅ Navigate to main menu page
          }
  setOpenDropdown(isDropdownOpen ? null : item.label);
        }}
        className={`${baseClasses} ${isActiveChild ? activeClasses : inactiveClasses}`}
      >
        <div className="flex items-start gap-3 w-full relative">{content}</div>
        {isDropdownOpen ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="flex flex-col gap-1 mt-1 ml-[36px]">
          {item.children.map((child: any, idx: number) => (
            <NavLink
              key={idx}
              to={child.path}
              onClick={onClick}
              className={({ isActive }) =>
  `text-sm px-4 py-2 w-full rounded-md transition whitespace-nowrap ${
                  isActive
      ? "text-[#F07EFF] font-semibold"
      : "text-gray-600 hover:text-[#F07EFF]"
  }`
}
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
    );
  }



    return item.path ? (
      
      <NavLink
        to={item.path}
        end={item.path === "/dashboard"}
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


  return (
    <>
      {isMobileNavOpen && (
        <div
          onClick={toggleMobileNav}
          className="fixed inset-0 bg-transparent z-40 md:hidden"
        />
      )}
     <nav
  className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200
    transform transition-transform duration-300 ease-in-out
    ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}
  `}
>
<div className="flex flex-col h-full overflow-y-auto font-poppins text-sm font-medium leading-[20px]">
          {/* Mobile Close Button 
          <div className="md:hidden flex justify-end px-2">
            <button onClick={toggleMobileNav} className="p-2">
              <XIcon className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Logo */}
<div className="flex items-center justify-between w-full py-[18px] px-4 md:px-6">
            <Link to="/">
              <img
                className="w-[108.12px] h-[46.51px]"
                alt="Company Logo"
                src="https://c.animaapp.com/magahlmqpONVZN/img/component-1.svg"
              />
            </Link>
{/* Hamburger button (always visible) */}
{/* Desktop hamburger only */}
<div className="hidden md:block ml-auto">
  <button onClick={toggleMobileNav} className="p-2 cursor-pointer focus:outline-none" >
    <img src={hambur} alt="Toggle Menu" className="w-8 h-8" />
  </button>
</div>
</div>

            

            
       

          {/* Main Menu Items */}
          <div className="flex flex-col items-start gap-1 px-3 w-full">
            {mainNavItems.map((item, index) => (
              <NavItem key={index} item={item} openDropdown={openDropdown}
  setOpenDropdown={setOpenDropdown} onClick={toggleMobileNav} />

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

          {/* Secondary Menu Items */}
          <div className="flex flex-col items-start gap-1 px-3 w-full">
            {secondaryNavItems.map((item, index) => (
              <NavItem key={index} item={item} openDropdown={openDropdown}
  setOpenDropdown={setOpenDropdown} onClick={toggleMobileNav} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNavbar;
import { useState, useEffect } from "react";
import {
  BellIcon,
  HelpCircleIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
  BadgePlus ,
  ExternalLinkIcon,
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
    { id: "dashboard",
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
    { id: "Certifications",
      icon: <img src={iconMap["certify"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Certifications",
      active: false,
      isCertificationsDropdown: true,
      childPaths: ["/dashboard/assesment", "/dashboard/score-result","/dashboard/upgrade-badge"],
      children: [
        { label: "Get Certified", path: "/dashboard/assesment" },
        { label: "Upload Proof", path: "/dashboard/UploadProof" },
        { label: "Score & Results", path: "/dashboard/score-result" },
        { label: "Upgrade Badge", path: "/dashboard/upgrade-badge" },
      ],
    },
    {
        id: "directory", 
    icon: <img src={iconMap["directory"]} alt="Directory Icon" className="w-5 h-5" />,
    label: (
      <div className="flex items-center gap-3">
        <span>Directory</span>
        <a
          href="/directory"
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()} // Prevents closing dropdown
          className="text-gray-400 hover:text-[#9747FF]"
        >
          <ExternalLinkIcon className="w-3.5 h-3.5" />
        </a>
      </div>
    ),
    isDirectoryDropdown: true,
    childPaths: ["/dashboard/search_listing"],
    children: [
      { label: "Search Listing", path: "/dashboard/search_listing" },
      { label: "Edit Public Listing", path: "/dashboard/editpubliclisting" },
      { label: "Visibility Settings", path: "/dashboard/VisibilitySettings" },
      { label: "Rating & Reviews", path: "/dashboard/RatingReviews" },
    ],
    },
    { id: "market_place", 
      icon: <img src={iconMap["market"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Market Place",
      active: true,
      path: "/dashboard/market_place",
      isMarketplaceDropdown: true,
      childPaths: ["/dashboard/DigitalProducts"],
      children: [
        { label: "Buy Digital Products", path: "/dashboard/digital_products" },
        { label: "Sell your Products", path: "/dashboard/SellProducts" },
        { label: "Track Purchase & Sales", path: "/dashboard/Tracking" },
        { label: "Creator Guideline", path: "/dashboard/CreatorGuideline" },
      ],
    },
    {id: "Social", 
      icon: <img src={iconMap["social"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Social",
      active: true,
      path:"/dashboard/DashboardSocial",
      isSocialDropdown: true,
      childPaths: ["/dashboard/Feed"],
      children: [
        { label: "Feed", path: "/dashboard/Feed" },
        { label: "Profile", path: "/dashboard/Profile" },
        { label: "My Connections", path: "/dashboard/MyConnection" },
        { label: "Messagings", path: "/dashboard/ComingSoon" },
      ],
    },
    {id: "Community", 
      icon: <img src={iconMap["community"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Community",
      active: false,
      isCommunityDropdown: true,
      childPaths: ["/dashboard/SearchExplore"],
      children: [
        { label: "Search & Explore", path: "/dashboard/SearchExplore" },
        { label: "Create Circles (Coming Soon)", path: "/dashboard/ComingSoon" },
        { label: "Manage Circles (Coming Soon)", path: "/dashboard/ComingSoon" },
        { label: "Messagings", path: "/dashboard/ComingSoon" },
      ],
    },
    {id: "MentorPartnerHub",
      icon: <img src={iconMap["mentor"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Mentor Partner Hub",
      active: false,
      isMentorDropdown: true,
      childPaths: ["/dashboard/BecomeMentor"],
      children: [
        { label: "Became an Mentor", path: "/dashboard/Become_mentor" },
        { label: "Mentor Dashboard", path: "/dashboard/ComingSoon" },
        { label: "Track Progress", path: "/dashboard/ComingSoon" },
        { label: "Partner License & Toolkit", path: "/dashboard/ComingSoon" },
        { label: "Partner Dashboard", path: "/dashboard/ComingSoon" },
      ],
    },
    {id: "Learning_Lab",
      icon: <img src={iconMap["learning"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Learning Lab",
      active: false,
      isLearningLabDropdown: true,
      childPaths: ["/dashboard/learning-lab"],
      children: [
        { label: "Modules", path: "/dashboard/learning-lab" },
        { label: "Learning Progress", path: "/dashboard/ComingSoon" },
        { label: "Renewal", path: "/dashboard/ComingSoon" },
        { label: "Resources", path: "/dashboard/ComingSoon" },
      ],
    },

{
      icon: <BadgePlus  className="w-5 h-5" />,
      label: "Generate Badge Code",
      active: false,
      path: "/dashboard/GenerateBadgeCode",
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
const isDropdownOpen = openDropdown === item.id;
    const isActiveChild = item.childPaths?.some((path:any) => 
      location.pathname.startsWith(path)
    );

const baseClasses = "flex items-center gap-3 px-3 py-2.5 w-full rounded-xl cursor-pointer dashboard_nav font-medium leading-[20px]";
    const activeClasses = "bg-[#f3e8ff] text-[#9747FF] font-semibold";
    const inactiveClasses = "dashboard_nav hover:bg-[#f3e8ff]";

    const content = (
      <>
        <div className="inline-flex items-start gap-2.5">{item.icon}</div>
        <div className="dashboard_nav dashboard_nav whitespace-nowrap">{item.label}</div>
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
                  `dashboard_nav px-3 py-[6px] rounded-lg w-full transition whitespace-nowrap ${
                    isActive
                      ? " text-[#F07EFF] font-semibold"
                      : " hover:bg-[#f9f9f9]"
                  }`
                }
              >
                My Profile
              </NavLink>
              <NavLink
                to="/dashboard/company-profile"
                onClick={onClick}
                className={({ isActive }) =>
                  `dashboard_nav px-3 py-[6px] rounded-lg w-full transition whitespace-nowrap ${
                    isActive
                      ? " text-[#F07EFF] font-semibold"
                      : "dashboard_nav hover:bg-[#f9f9f9]"
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
              setOpenDropdown(openDropdown === item.id ? null : item.id); // ✅ toggles only one

          }
setOpenDropdown(isDropdownOpen ? null : item.id);
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
  `dashboard_nav px-4 py-2 w-full rounded-md transition whitespace-nowrap ${
                  isActive
      ? "text-[#F07EFF] font-semibold"
      : "dashboard_nav hover:text-[#F07EFF]"
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
  item.path.startsWith("/directory") ? (
    // External-style link to full-width directory
    <a
      href={item.path}
      onClick={handleClick}
      className={`${baseClasses} ${inactiveClasses}`}
    >
      <div className="flex items-start gap-3 w-full relative">{content}</div>
    </a>
  ) : (
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
  )
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
<div className="flex flex-col h-full overflow-y-auto font-poppins dashboard_nav leading-[20px]">
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
  <button
    onClick={toggleMobileNav}
    className="p-2 cursor-pointer focus:outline-none"
    aria-label="Toggle Navigation Menu"
  >
    <img src={hambur} alt="Toggle Menu" className="w-6 h-6" />
  </button>
</div>
</div>

            

            
       

          {/* Main Menu Items */}
<div className="flex flex-col items-start space-y-3 px-3 w-full">
            {mainNavItems.map((item, index) => (
              <NavItem
  key={index}
  item={item}
  openDropdown={openDropdown}
  setOpenDropdown={setOpenDropdown}
/>

            ))}
          </div>

          {/* Divider */}
          <div className="w-full my-3">
            <img
              className="w-full h-px object-cover"
              alt="Divider"
              src="https://c.animaapp.com/magahlmqpONVZN/img/line-1.svg"
            />
          </div>

          {/* Secondary Menu Items */}
<div className="flex flex-col items-start space-y-3 px-3 w-full">
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
import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrendingUp,
  Zap,
} from "lucide-react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { iconMap } from "../../assets/icons";
import hambur from "../../assets/hambur.png";

const DashboardNavbar = ({
  isMobileNavOpen,
  toggleMobileNav,
}: {
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  currentPath: string;
  selectedDomain: string;
  setSelectedDomain: React.Dispatch<React.SetStateAction<string>>;
  sort: "az" | "za";
  setSort: React.Dispatch<React.SetStateAction<"az" | "za">>;
}) => {
  //const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});
  const loggedInUserID = localStorage.getItem("Id");

  // Automatically detect environment based on domain (no .env needed)
  const hostname = window.location.hostname.toLowerCase();
  const showMarketplaceNew = hostname.includes("localhost") || hostname.includes("dev");

  // Auto-open dropdowns based on current route
  useEffect(() => {
    const newOpenDropdown: { [key: string]: boolean } = {};
    
    mainNavItems.forEach(item => {
      if (item.children) {
        // Check if any child path matches current route
        const isChildActive = item.children.some(child => 
          location.pathname === child.path || 
          location.pathname.startsWith(child.path + '/')
        );
        
        if (isChildActive) {
          newOpenDropdown[item.id] = true;
        }
      }
      
      // Special handling for profile dropdown
      if (item.id === "TrueProfile" && (
        location.pathname.startsWith("/dashboard/user-profile") ||
        location.pathname.startsWith("/dashboard/company-profile") ||
        location.pathname.includes("/dashboard/userprofile/")
      )) {
        newOpenDropdown[item.id] = true;
      }
    });
    
    setOpenDropdown(newOpenDropdown);
  }, [location.pathname]);

  const mainNavItems = [
    {
      id: "dashboard",
      icon: <img src={iconMap["home"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Home",
      active: true,
      path: "/dashboard",
    },
    {
      id: "TrueProfile",
      icon: (
        <img src={iconMap["usericon"]} alt="Home Icon" className="w-5 h-5" />
      ),
      label: "True Profile",
      active: false,
      isProfileDropdown: true,
      childPaths: ["/dashboard/user-profile", "/dashboard/company-profile", `/dashboard/userprofile/${loggedInUserID}`],
    },
    {
      id: "Certifications",
      icon: (
        <img src={iconMap["certify"]} alt="Home Icon" className="w-5 h-5" />
      ),
      label: "Certifications",
      active: false,
      isCertificationsDropdown: true,
      childPaths: [
        "/dashboard/assesment",
        "/dashboard/score-result",
        "/dashboard/upgrade-badge",
        "/dashboard/assesmentcertification"
      ],
      children: [
        { label: "Get Certified", path: "/dashboard/assesmentcertification" },
        { label: "Score & Results", path: "/dashboard/score-result" },
        { label: "Upgrade Badge", path: "/dashboard/upgrade-badge" },
      ],
    },
    {
      id: "directory",
      icon: (
        <img
          src={iconMap["directory"]}
          alt="Directory Icon"
          className="w-5 h-5"
        />
      ),
      label: "Directory",
      active: true,
      isDirectoryDropdown: true,
      childPaths: ["/dashboard/search-listing", "/dashboard/DashboardDirectory", "/dashboard/editpubliclisting"],
      children: [
        { label: "Search Listing", path: "/dashboard/DashboardDirectory" },
        { label: "Edit Public Listing", path: "/dashboard/editpubliclisting" },
      ],
    },
    {
      id: "Best Practices Hub",
      icon: <TrendingUp className="w-5 h-5 text-[#64748B]" />,
      label: "Best Practices Hub",
      active: false,
      isbestpractices: true,
      childPaths: ["/dashboard/bestpractices", "/dashboard/manage_bestpractices"],
      children: [
        {
          label: "Best Practices",
          path: "/dashboard/bestpractices",
        },
        {
          label: "Manage Best Practices",
          path: "/dashboard/manage_bestpractices",
        },
      ],
    },
    {
      id: "Social",
      icon: <img src={iconMap["social"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Social",
      active: false,
      isSocialDropdown: true,
      childPaths: ["/dashboard/Feed", "/dashboard/Profile", "/dashboard/MyConnection"],
      children: [
        { label: "Feed", path: "/dashboard/feed" },
        { label: "Profile", path: "/dashboard/Profile" },
        { label: "Connections", path: "/dashboard/MyConnection" },
      ],
    },
    {
      id: "marketplace",
      icon: <img src={iconMap["market"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Marketplace (Beta)",
      active: true,
      path: "/dashboard/marketplace",
    },
    ...(showMarketplaceNew 
      ? [
        {
          id: "market-place",
          icon: <img src={iconMap["market"]} alt="Home Icon" className="w-5 h-5" />,
          label: "MarketplaceNew",
          active: false,
          path: "/dashboard/market-place",
          isMarketplaceDropdown: true,
          childPaths: ["/dashboard/market-place", "/dashboard/createshop", "/dashboard/Tracking", "/dashboard/CreatorGuideline", "/dashboard/seller-dashboard"],
          children: [
            { label: "Buy Digital Products", path: "/dashboard/market-place" },
            { label: "Sell your Products", path: "/dashboard/createshop" },
            { label: "Track Purchase & Sales", path: "/dashboard/Tracking" },
            { label: "Creator Guideline", path: "/dashboard/CreatorGuideline" },
            { label: "Seller Dashboard", path: "/dashboard/seller-dashboard" }
          ]
        },
      ]
      : []),
    {
      id: "MentorPartnerHub",
      icon: <Zap className="w-5 h-5 text-gray-500" />,
      label: "Business Hub",
      active: false,
      isMentorDropdown: true,
      childPaths: ["/dashboard/become-mentor", "/dashboard/Become_partner", "/dashboard/affiliate"],
      children: [
        { label: "Mentor", path: "/dashboard/become-mentor" },
        { label: "Partner", path: "/dashboard/Become_partner" },
        { label: "Affiliate", path: "/dashboard/affiliate" },
      ],
    },
  ];

  // NavItem component with proper active state management
  const NavItem = ({ item }: any) => {
    const isDropdownOpen = !!openDropdown[item.id];
    
    // Check if current route matches this item or its children
    const isActive = item.path 
      ? location.pathname === item.path || location.pathname.startsWith(item.path + '/')
      : false;
    
    const isActiveChild = item.childPaths?.some((path: string) =>
      location.pathname === path || location.pathname.startsWith(path + '/')
    );

    const baseClasses = `
      flex items-center gap-3 px-3 py-2.5 w-full rounded-xl cursor-pointer 
      font-poppins font-normal text-[14px] leading-[20px]
      transition duration-200 ease-in-out
      hover:translate-x-[2px] hover:text-black hover:bg-[#CDC1FF1A]
    `;
    
    const activeMainClasses = "bg-[#CDC1FF1A] text-[#9747FF] font-poppins font-normal text-[14px]";
    const inactiveMainClasses = "text-gray-500 hover:text-black font-poppins font-normal text-[14px]";
    const activeSubClasses = "text-[#F07EFF] font-poppins font-normal text-[14px]";
    const inactiveSubClasses = "text-gray-500 text-[14px] hover:text-[#F07EFF] font-poppins font-normal transition duration-200 ease-in-out hover:translate-x-[2px]";

    const content = (
      <>
        <div
          className={`inline-flex items-start gap-2.5 ${
            isActive || isActiveChild ? "text-[#9747FF]" : "text-gray-600"
          }`}
        >
          {item.icon}
        </div>
        <div className="whitespace-nowrap">{item.label}</div>
        {item.hasNotification && (
          <div className="absolute w-2 h-2 top-[13px] -left-px bg-orange-500 rounded-full border border-white" />
        )}
      </>
    );

    const handleClick = () => {
      if (item.customAction) {
        item.customAction();
      }
    };

    //to open all the navibar does NOT close the rest.

    //const toggleDropdown = () => {
      //setOpenDropdown(prev => ({
       // ...prev,
       // [item.id]: !prev[item.id]
     // }));
     // 
      // If item has a path and dropdown is being closed, navigate to it
     // if (item.path && !openDropdown[item.id]) {
      //  navigate(item.path);
     // }
  //  };

//closes the previous dropdown 
  const toggleDropdown = () => {
  setOpenDropdown(prev => {
    const isCurrentlyOpen = !!prev[item.id];

    // Close all
    const newState: { [key: string]: boolean } = {};
    Object.keys(prev).forEach(key => {
      newState[key] = false;
    });

    // Open only the clicked one if it was closed
    if (!isCurrentlyOpen) {
      newState[item.id] = true;
    }

    return newState;
  });
};


    // Special handling for profile dropdown
    if (item.isProfileDropdown) {
      const isProfileActive = 
        location.pathname.startsWith("/dashboard/user-profile") ||
        location.pathname.startsWith("/dashboard/company-profile") ||
        location.pathname.includes("/dashboard/userprofile/");
      
      const isProfileOpen = !!openDropdown["TrueProfile"];
      
      return (
        <div className="w-full">
          <button
            onClick={toggleDropdown}
            className={`${baseClasses} ${
              isProfileActive || isProfileOpen ? activeMainClasses : inactiveMainClasses
            }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
            </div>
            {isProfileOpen ? (
              <ChevronUpIcon className="w-4 h-4 text-[#9747FF]" />
            ) : (
              <ChevronDownIcon className={`w-4 h-4 ${isProfileActive ? "text-[#9747FF]" : "text-gray-600"}`} />
            )}
          </button>

          {isProfileOpen && (
            <div className="flex flex-col gap-1 mt-3 pl-8">
              <NavLink
                to={`/dashboard/userprofile/${loggedInUserID}`}
                end
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${
                    isActive ? activeSubClasses : inactiveSubClasses
                  }`
                }
                // onClick={toggleMobileNav}
              >
                Profile
              </NavLink>
              <NavLink
                to="/dashboard/user-profile"
                end
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${
                    isActive ? activeSubClasses : inactiveSubClasses
                  }`
                }
                // onClick={toggleMobileNav}
              >
                Edit Profile
              </NavLink>
            </div>
          )}
        </div>
      );
    }

    // Handling for dropdown items with children
    if (item.children?.length > 0) {
      return (
        <div className="w-full">
          <button
            onClick={toggleDropdown}
            className={`${baseClasses} ${
              isDropdownOpen || isActiveChild ? activeMainClasses : inactiveMainClasses
            }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
            </div>
            {isDropdownOpen ? (
              <ChevronUpIcon className="w-4 h-4 text-[#9747FF]" />
            ) : (
              <ChevronDownIcon className={`w-4 h-4 ${isActiveChild ? "text-[#9747FF]" : "text-gray-600"}`} />
            )}
          </button>

          {isDropdownOpen && (
            <div className="flex flex-col gap-1 mt-3 pl-8">
              {item.children.map((child: any, idx: number) =>
                child.path ? (
                  <NavLink
                    key={idx}
                    to={child.path}
                    end
                    className={({ isActive }) =>
                      `px-4 py-3 w-full rounded-md transition whitespace-nowrap ${
                        isActive ? activeSubClasses : inactiveSubClasses
                      }`
                    }
                    // onClick={toggleMobileNav}
                  >
                    {child.label}
                  </NavLink>
                ) : (
                  <button
                    key={idx}
                    onClick={child.customAction}
                    className={`px-4 py-3 w-full rounded-md transition whitespace-nowrap text-left ${inactiveSubClasses}`}
                  >
                    {child.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    // Handling for simple navigation items without dropdown
    return item.path ? (
      <NavLink
        to={item.path}
        end={item.path === "/dashboard"}
        onClick={() => {
          handleClick();
          // toggleMobileNav();
        }}
        className={({ isActive }) =>
          `${baseClasses} ${isActive ? activeMainClasses : inactiveMainClasses}`
        }
      >
        <div className="flex items-start gap-3 w-full relative">{content}</div>
      </NavLink>
    ) : (
      <div
        className={`${baseClasses} ${inactiveMainClasses}`}
        onClick={() => {
          handleClick();
          // toggleMobileNav();
        }}
      >
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto font-poppins leading-5">
          <div className="flex items-center justify-between w-full py-[18px] px-4 md:px-6">
            <Link to="/dashboard">
              <img
                className="h-auto w-[100px]"
                alt="Company Logo"
                src="https://res.cloudinary.com/diudvzdkb/image/upload/w_240,h_136,f_webp,q_auto/v1759918812/cnesslogo_neqkfd"
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
          </div>

          <div className="flex flex-col items-start space-y-3 px-3 w-full">
            {mainNavItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
              />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNavbar;
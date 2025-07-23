import { useState } from "react";
import {
  BellIcon,
  HelpCircleIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  LogOutIcon,
  BadgePlus,
  TrendingUp,
  Zap

} from "lucide-react";
import { NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { iconMap } from '../../assets/icons';
import hambur from "../../assets/hambur.png";
import { LogOut } from "../../Common/ServerAPI";
import { useToast } from "../../components/ui/Toast/ToastProvider";



const DashboardNavbar = ({
  isMobileNavOpen,
  toggleMobileNav,
  // currentPath,
  // selectedDomain,
  // setSelectedDomain,
  // sort,
  // setSort
}: {
  isMobileNavOpen: boolean;
  toggleMobileNav: () => void;
  currentPath: string;
  selectedDomain: string;
  setSelectedDomain: React.Dispatch<React.SetStateAction<string>>;
  sort: "az" | "za";
  setSort: React.Dispatch<React.SetStateAction<"az" | "za">>;
}) => {

  const navigate = useNavigate();
    const { showToast } = useToast();
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>({});
  // const showFilterSidebar =
  //   currentPath.includes("/dashboard/DashboardDirectory/technology") ||
  //   currentPath.includes("/dashboard/search-listing");



  const handleLogout = async () => {
    try {

      const response = await LogOut();

      if (response) {
        localStorage.clear();
        toggleMobileNav();
        navigate("/");
      }


    } catch (error:any) {
      console.error("Logout failed:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const mainNavItems = [
    {
      id: "dashboard",
      icon: <img src={iconMap["home"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Home / Dashboard",
      active: true,
      path: "/dashboard",
    },
    {
        id: "TrueProfile",
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
      id: "Certifications",
      icon: <img src={iconMap["certify"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Certifications",
      active: false,
      isCertificationsDropdown: true,
      childPaths: ["/dashboard/assesment", "/dashboard/score-result", "/dashboard/upgrade-badge"],
      children: [
        { label: "Get Certified", path: "/dashboard/assesment" },
        //{ label: "Upload Proof", path: "/dashboard/UploadProof" },
        { label: "Score & Results", path: "/dashboard/score-result" },
        { label: "Upgrade Badge", path: "/dashboard/upgrade-badge" },
      ],
    },
    {

      id: "directory",
      icon: <img src={iconMap["directory"]} alt="Directory Icon" className="w-5 h-5" />,
      label: "Directory",
      active: true,
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
    },
    {
      id: "Social",
      icon: <img src={iconMap["social"]} alt="Home Icon" className="w-5 h-5" />,
      label: "Social",
      active: true,
      path: "/dashboard/DashboardSocial",
      isSocialDropdown: true,
      childPaths: ["/dashboard/Feed"],
      children: [
        { label: "Feed", path: "/dashboard/Feed" },
        { label: "Profile", path: "/dashboard/Profile" },
        { label: "My Connections", path: "/dashboard/MyConnection" },
        { label: "Messagings", path: "/dashboard/ComingSoon" },
      ],
    },
    {
      id: "Community",
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
    {
      id: "MentorPartnerHub",
      icon: <Zap className="w-5 h-5 text-gray-500" />,
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
    {
      id: "Learning_Lab",
      icon: <img src={iconMap["learning"]} alt="Home Icon" className="w-6 h-6" />,
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
  const NavItem = ({ item }: any) => {
    const location = useLocation();
    const isDropdownOpen = !!openDropdown[item.id];
    const isActiveChild = item.childPaths?.some((path: any) =>
      location.pathname.startsWith(path)
    );

    const baseClasses = `
  flex items-center gap-3 px-3 py-2.5 w-full rounded-xl cursor-pointer 
  font-poppins font-normal text-[14px] leading-[20px]
  transition duration-200 ease-in-out
  hover:translate-x-[2px] hover:text-black hover:bg-[#CDC1FF1A]
`; const activeMainClasses = "bg-[#CDC1FF1A] text-[#9747FF] font-semibold";
    const inactiveMainClasses = "text-gray-600 hover:text-black";
    const activeSubClasses = "text-[#F07EFF] font-semibold";
    const inactiveSubClasses = "text-gray-600 hover:text-[#F07EFF] transition duration-200 ease-in-out hover:translate-x-[2px]";

    const content = (
      <>
        <div className={`inline-flex items-start gap-2.5 ${isActiveChild || location.pathname.startsWith(item.path || "")
          ? "text-[#9747FF]"
          : "text-gray-600"
          }`}>
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

    if (item.isProfileDropdown) {
      const isProfileActive = location.pathname.startsWith('/dashboard/user-profile') ||
        location.pathname.startsWith('/dashboard/company-profile');
      const isProfileOpen = !!openDropdown['TrueProfile'];
      return (
        <div className="w-full">
          <button
            onClick={() => {
             setOpenDropdown({ [item.id]: true });
            }}
            className={`${baseClasses} ${isProfileActive || isProfileOpen ? activeMainClasses : inactiveMainClasses
              }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
            </div>
            {isProfileOpen ? (
              <ChevronUpIcon className={`w-4 h-4 ${isProfileActive ? "text-[#9747FF]" : "text-gray-600"}`} />
            ) : (
              <ChevronDownIcon className={`w-4 h-4 ${isProfileActive ? "text-[#9747FF]" : "text-gray-600"}`} />
            )}
          </button>

          {isProfileOpen && (
            <div className="flex flex-col gap-1 mt-3 pl-8">
              <NavLink
                to="/dashboard/user-profile"

                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${isActive ? activeSubClasses : inactiveSubClasses
                  }`
                }
              >
                My Profile
              </NavLink>
              <NavLink
                to="/dashboard/company-profile"

                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${isActive ? activeSubClasses : inactiveSubClasses
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

if (item.children?.length > 0) {
  return (
    <div className="w-full">
      <button
        onClick={() => {
          // If the item has a path, navigate to it when clicking the main item
          if (item.path) {
            navigate(item.path);
          }
          setOpenDropdown({ [item.id]: !openDropdown[item.id] });
        }}
        className={`${baseClasses} ${isDropdownOpen || isActiveChild ? activeMainClasses : inactiveMainClasses
          }`}
      >
        <div className="flex items-start gap-3 w-full relative">{content}</div>
        {isDropdownOpen ? (
          <ChevronUpIcon className={`w-4 h-4 ${isActiveChild ? "text-[#9747FF]" : "text-gray-600"}`} />
        ) : (
          <ChevronDownIcon className={`w-4 h-4 ${isActiveChild ? "text-[#9747FF]" : "text-gray-600"}`} />
        )}
      </button>

      {isDropdownOpen && (
        <div className="flex flex-col gap-1 mt-3 pl-8">
          {item.children.map((child: any, idx: number) => (
            <NavLink
              key={idx}
              to={child.path}
              className={({ isActive }) =>
                `px-4 py-3 w-full rounded-md transition whitespace-nowrap ${isActive ? activeSubClasses : inactiveSubClasses
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
          `${baseClasses} ${isActive ? activeMainClasses : inactiveMainClasses
          }`
        }
      >
        <div className="flex items-start gap-3 w-full relative">{content}</div>
      </NavLink>
    ) : (
      <div
        className={`${baseClasses} ${inactiveMainClasses}`}
        onClick={handleClick}
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
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
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
          </div>

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

          <div className="w-full my-3">
            <img
              className="w-full h-px object-cover"
              alt="Divider"
              src="https://c.animaapp.com/magahlmqpONVZN/img/line-1.svg"
            />
          </div>

          <div className="flex flex-col items-start space-y-3 px-3 w-full">
            {secondaryNavItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                onClick={toggleMobileNav}
                isDropdownOpen={false}
                setOpenDropdown={setOpenDropdown}
              />
            ))}

            {/* {showFilterSidebar && (
              <div className="mt-6 w-full">
                <DashboardFilterSidebar
                  selectedDomain={selectedDomain}
                  setSelectedDomain={setSelectedDomain}
                  sort={sort}
                  setSort={setSort}
                />
              </div>
            )} */}
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNavbar;
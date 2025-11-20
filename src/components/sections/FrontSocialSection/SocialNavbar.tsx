import { useState } from "react";
import {
  // HelpCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { iconMap } from "../../../assets/icons";
import SignupModel from "../../OnBoarding/Signup";

interface LeftSocialProps {
  currentPath: string;
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  sort: "az" | "za";
  setSort: (sort: "az" | "za") => void;
}

const SocialNavbar: React.FC<LeftSocialProps> = () => {
  const navigate = useNavigate();
  // const { showToast } = useToast();
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [openSignup, setOpenSignup] = useState(false);

  const mainNavItems = [
    {
      id: "Login_Sign_up",
      icon: (
        <img
          src={iconMap["socialuser"]}
          alt="Home Icon"
          className="w-5 h-5 transition duration-200 group-hover:brightness-0 group-hover:invert"
        />
      ),
      label: "Login / Sing up",
      active: true,
      onClick: () => setOpenSignup(true),
    },
    // {
    //   id: "Home",
    //   icon: (
    //     <img
    //       src={iconMap["socialhome"]}
    //       alt="Home Icon"
    //       className="w-5 h-5 transition duration-200 group-hover:brightness-0 group-hover:invert"
    //     />
    //   ),
    //   label: "Home",
    //   active: false,
    //   path: "/",
    // },
    // {
    //   id: "Search",
    //   icon: (
    //     <img
    //       src={iconMap["socialsearch"]}
    //       alt="Home Icon"
    //       className="w-5 h-5 transition duration-200 group-hover:brightness-0 group-hover:invert"
    //     />
    //   ),
    //   label: "Search",
    //   active: false,
    //   onClick: () => setOpenSignup(true),
    // },
    // {
    //   id: "Trending",
    //   icon: (
    //     <img
    //       src={iconMap["socialtrending"]}
    //       alt="Home Icon"
    //       className="w-5 h-5 transition duration-200 group-hover:brightness-0 group-hover:invert"
    //     />
    //   ),
    //   label: "Trending",
    //   active: false,
    //   onClick: () => setOpenSignup(true),
    // },
  ];

  // NavItem component with profile dropdown support
  const NavItem = ({ item }: any) => {
    const location = useLocation();
    const isDropdownOpen = !!openDropdown[item.id];
    const isActiveChild = item.childPaths?.some((path: any) =>
      location.pathname.startsWith(path)
    );

    const baseClasses = `
  flex items-center gap-3 text-black px-3 py-4 w-full rounded-[100px] cursor-pointer 
  font-poppins font-normal text-[14px] leading-[20px]
  transition duration-200 ease-in-out
   hover:text-white hover:bg-gradient-to-r from-[#7077FE] to-[#F07EFF] 
`;
    const activeMainClasses =
      "bg-[#CDC1FF1A] text-[#9747FF] font-poppins font-normal text-[14px]";
    const inactiveMainClasses =
      "text-black hover:text-black font-poppins font-normal text-[14px]";
    const activeSubClasses =
      "text-[#F07EFF]  font-poppins font-normal text-[14px]";
    const inactiveSubClasses =
      "text-gray-500 text-[14px] hover:text-[#F07EFF] font-poppins font-normal transition duration-200 ease-in-out hover:translate-x-[2px]";

    const content = (
      <>
        <div
          className={`inline-flex items-start gap-2.5 ${
            isActiveChild || location.pathname.startsWith(item.path || "")
              ? "text-[#9747FF]"
              : "text-gray-600"
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

    if (item.isProfileDropdown) {
      const isProfileActive =
        location.pathname.startsWith("/dashboard/user-profile") ||
        location.pathname.startsWith("/dashboard/company-profile");
      const isProfileOpen = !!openDropdown["TrueProfile"];
      return (
        <div className="w-full">
          <button
            onClick={() => {
              setOpenDropdown((prev) => {
                const newState: { [key: string]: boolean } = {};
                Object.keys(prev).forEach((key) => {
                  newState[key] = false;
                });
                return {
                  ...newState,
                  [item.id]: !prev[item.id],
                };
              });
            }}
            className={`${baseClasses} ${
              isProfileActive || isProfileOpen
                ? activeMainClasses
                : inactiveMainClasses
            }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
            </div>
            {isProfileOpen ? (
              <ChevronUpIcon
                className={`w-4 h-4 ${
                  isProfileActive ? "text-[#9747FF]" : "text-gray-600"
                }`}
              />
            ) : (
              <ChevronDownIcon
                className={`w-4 h-4 ${
                  isProfileActive ? "text-[#9747FF]" : "text-gray-600"
                }`}
              />
            )}
          </button>

          {isProfileOpen && (
            <div className="flex flex-col gap-1 mt-3 pl-8">
              <NavLink
                to="/dashboard/user-profile"
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${
                    isActive ? activeSubClasses : inactiveSubClasses
                  }`
                }
              >
                My Profile
              </NavLink>
              <NavLink
                to="/dashboard/company-profile"
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${
                    isActive ? activeSubClasses : inactiveSubClasses
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
            className={`${baseClasses} ${
              isDropdownOpen || isActiveChild
                ? activeMainClasses
                : inactiveMainClasses
            }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
            </div>
            {isDropdownOpen ? (
              <ChevronUpIcon
                className={`w-4 h-4 ${
                  isActiveChild ? "text-[#9747FF]" : "text-gray-600"
                }`}
              />
            ) : (
              <ChevronDownIcon
                className={`w-4 h-4 ${
                  isActiveChild ? "text-[#9747FF]" : "text-gray-600"
                }`}
              />
            )}
          </button>

          {isDropdownOpen && (
            <div className="flex flex-col gap-1 mt-3 pl-8">
              {item.children.map((child: any, idx: number) =>
                child.path ? (
                  <NavLink
                    key={idx}
                    to={child.path}
                    className={({ isActive }) =>
                      `px-4 py-3 w-full rounded-md transition whitespace-nowrap ${
                        isActive ? activeSubClasses : inactiveSubClasses
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ) : (
                  <NavLink
                    key={idx}
                    to="#"
                    onClick={child.customAction}
                    className={`px-4 py-3 w-full rounded-md transition whitespace-nowrap ${inactiveSubClasses}`}
                  >
                    {child.label}
                  </NavLink>
                )
              )}
            </div>
          )}
        </div>
      );
    }

    if (item.id === "Login_Sign_up") {
      return (
        <button
          className={`
          flex items-center gap-3 px-3 py-4 w-full rounded-[100px] cursor-pointer
          font-poppins font-normal text-[14px] leading-[20px]
          bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white
          transition duration-200 ease-in-out
        `}
          onClick={() => {
            item.onClick();
          }}
        >
          <div className="inline-flex items-start gap-2.5">{item.icon}</div>
          <div className="whitespace-nowrap">{item.label}</div>
        </button>
      );
    }

    if (item.onClick) {
      const isActive = activeButton === item.id;
      return (
        <button
          onClick={() => {
            setActiveButton(item.id);
            item.onClick();
          }}
          className={`group  ${baseClasses} ${
            isActive ? activeMainClasses : inactiveMainClasses
          }`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      );
    }

    return item.path ? (
      <NavLink
        to={item.path}
        end={item.path === "/dashboard"}
        onClick={handleClick}
        className={({ isActive }) =>
          `group  ${baseClasses} ${
            isActive ? activeMainClasses : inactiveMainClasses
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
      <div
        // onClick={toggleMobileNav}
        className="fixed inset-0 bg-transparent z-40 md:hidden"
      />
      <nav
        className={` h-full flex pt-8 pb-8 flex-col justify-between items-start w-full bg-white rounded-[12px]
          transform transition-transform duration-300 ease-in-out translate-x-0
          `}
          // ${isMobileNavOpen ? "translate-x-0" : "-translate-x-full"}
      >
        <div className="flex flex-col w-full font-poppins leading-[20px] h-full">
          <div className="flex flex-col justify-between items-start space-y-3 px-3 w-full h-full">
            {mainNavItems.map((item, index) => (
              <NavItem
                key={index}
                item={item}
                openDropdown={openDropdown}
                setOpenDropdown={setOpenDropdown}
              />
            ))}
          </div>
        </div>
      </nav>
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </>
  );
};

export default SocialNavbar;

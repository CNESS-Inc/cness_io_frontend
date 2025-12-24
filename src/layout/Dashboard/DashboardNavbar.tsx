import { useState, useEffect } from "react";
import { Bell, ChevronDownIcon, ChevronUpIcon, TrendingUp, Zap } from "lucide-react";
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
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<{ [key: string]: boolean }>(
    {}
  );
  const loggedInUserID = localStorage.getItem("Id");
  const isSeller = localStorage.getItem("is_seller") === "true";

  // Check if viewing other user's profile
  const isViewingOtherUserProfile = () => {
    const loggedInUserID = localStorage.getItem("Id");
    const profilePathMatch = location.pathname.match(
      /^\/dashboard\/userprofile\/([^/]+)$/
    );
    const profileId = profilePathMatch ? profilePathMatch[1] : null;

    return profileId && profileId !== loggedInUserID;
  };

  // Check if viewing directory profile
  const isViewingDirectoryProfile = () => {
    return location.pathname.startsWith("/dashboard/directory-profile/");
  };

  // Check if viewing social user profile
  const isViewingSocialUserProfile = () => {
    return location.pathname.match(
      /^\/dashboard\/social\/user-profile\/[^/]+$/
    );
  };

  // Check if viewing feed-related routes
  const isViewingFeedRoutes = () => {
    return (
      location.pathname === "/dashboard/feed" ||
      location.pathname.startsWith("/dashboard/feed/") ||
      location.pathname.startsWith("/dashboard/trendingpost") ||
      location.pathname.includes("/feed/search") ||
      location.pathname.includes("?topic=") ||
      location.pathname.includes("?tag=")
    );
  };

  // Auto-open dropdowns based on current route
  useEffect(() => {
    const newOpenDropdown: { [key: string]: boolean } = {};

    mainNavItems.forEach((item) => {
      if (item.children) {
        // Check if any child path matches current route
        const isChildActive = item.children.some((child) => {
          // For social routes, we need to handle special cases
          if (item.id === "Social") {
            // Check if current route is a social user profile
            if (isViewingSocialUserProfile()) {
              // Social user profiles should activate Connections item
              return child.label === "Connections";
            }
            // Check for feed-related routes
            if (child.label === "Feed") {
              return (
                location.pathname === child.path ||
                location.pathname.startsWith("/dashboard/feed/") ||
                location.pathname.startsWith("/dashboard/trendingpost") ||
                location.pathname.includes("/feed/search") ||
                location.pathname.includes("?topic=") ||
                location.pathname.includes("?tag=")
              );
            }
            // Check direct path matches
            return (
              location.pathname === child.path ||
              location.pathname.startsWith(child.path + "/")
            );
          }

          // For Directory - check for search-listing routes
          if (item.id === "directory") {
            if (child.label === "Search Listing") {
              return (
                location.pathname === "/dashboard/DashboardDirectory" ||
                location.pathname.startsWith("/dashboard/search-listing") ||
                location.pathname === "/dashboard/DashboardDirectory" ||
                location.pathname.includes("search-listing")
              );
            }
          }

          // For Best Practices Hub - check nested routes
          if (item.id === "Best Practices Hub") {
            if (child.label === "Best Practices") {
              return (
                location.pathname === child.path ||
                location.pathname.startsWith("/dashboard/bestpractices/")
              );
            }
            if (child.label === "Manage Best Practices") {
              return (
                location.pathname === child.path ||
                location.pathname.startsWith("/dashboard/manage_bestpractices/")
              );
            }
          }

          // For Certifications - check for aspiring-assessment routes
          if (item.id === "Certifications") {
            if (child.label === "Get Certified") {
              return (
                location.pathname === child.path ||
                location.pathname.startsWith("/dashboard/aspiring-assessment") ||
                location.pathname.startsWith("/dashboard/assesment") ||
                location.pathname.includes("aspiring-assessment") ||
                location.pathname.includes("assesmentcertification")
              );
            }
          }

          // For other dropdowns
          return (
            location.pathname === child.path ||
            location.pathname.startsWith(child.path + "/")
          );
        });

        if (isChildActive) {
          newOpenDropdown[item.id] = true;
        }
      }

      // Special handling for profile dropdown
      if (
        item.id === "TrueProfile" &&
        (location.pathname === `/dashboard/userprofile/${loggedInUserID}` ||
          location.pathname.startsWith("/dashboard/user-profile") || // edit profile
          location.pathname.startsWith("/dashboard/company-profile"))
      ) {
        newOpenDropdown[item.id] = true;
      }

      // Directory dropdown - keep open when viewing other user profiles OR directory profiles
      if (item.id === "directory") {
        const loggedId = localStorage.getItem("Id");
        const profilePathMatch = location.pathname.match(
          /^\/dashboard\/userprofile\/([^/]+)$/
        );
        const profileId = profilePathMatch ? profilePathMatch[1] : null;

        // Check if viewing other user's profile
        if (profileId && profileId !== loggedId) {
          newOpenDropdown[item.id] = true;
        }

        // Check if viewing directory profile
        if (location.pathname.startsWith("/dashboard/directory-profile/")) {
          newOpenDropdown[item.id] = true;
        }

        // Check for search-listing routes with query parameters
        if (
          location.pathname === "/dashboard/DashboardDirectory" ||
          location.pathname.startsWith("/dashboard/search-listing") ||
          location.pathname.includes("search-listing")
        ) {
          newOpenDropdown[item.id] = true;
        }

        // Also check if on any directory child path
        if (
          item.childPaths?.some(
            (path: string) =>
              location.pathname === path ||
              location.pathname.startsWith(path + "/") ||
              (path === "/dashboard/search-listing" &&
                location.pathname.includes("search-listing"))
          )
        ) {
          newOpenDropdown[item.id] = true;
        }
      }

      // Certifications dropdown - keep open when viewing certification routes
      if (item.id === "Certifications") {
        // Check if viewing certification routes
        if (
          location.pathname.startsWith("/dashboard/aspiring-assessment") ||
          location.pathname.startsWith("/dashboard/assesment") ||
          location.pathname.startsWith("/dashboard/score-result") ||
          location.pathname.startsWith("/dashboard/upgrade-badge") ||
          location.pathname.startsWith("/dashboard/assesmentcertification") ||
          location.pathname.includes("aspiring-assessment") ||
          location.pathname.includes("assesment")
        ) {
          newOpenDropdown[item.id] = true;
        }

        // Also check if on any certification child path
        if (
          item.childPaths?.some(
            (path: string) =>
              location.pathname === path ||
              location.pathname.startsWith(path + "/") ||
              location.pathname.includes("/aspiring-assessment") ||
              location.pathname.includes("/assesment") ||
              location.pathname.includes("/score-result") ||
              location.pathname.includes("/upgrade-badge")
          )
        ) {
          newOpenDropdown[item.id] = true;
        }
      }

      // Best Practices Hub dropdown - keep open when viewing best practices routes
      if (item.id === "Best Practices Hub") {
        // Check if viewing best practices routes
        if (
          location.pathname.startsWith("/dashboard/bestpractices/") ||
          location.pathname.startsWith("/dashboard/manage_bestpractices/") ||
          location.pathname === "/dashboard/bestpractices" ||
          location.pathname === "/dashboard/manage_bestpractices"
        ) {
          newOpenDropdown[item.id] = true;
        }

        // Also check if on any best practices child path
        if (
          item.childPaths?.some(
            (path: string) =>
              location.pathname === path ||
              location.pathname.startsWith(path + "/") ||
              location.pathname.includes("/bestpractices/") ||
              location.pathname.includes("/manage_bestpractices/")
          )
        ) {
          newOpenDropdown[item.id] = true;
        }
      }

      // Social dropdown - keep open when viewing social user profiles or feed routes
      if (item.id === "Social") {
        // Check if viewing social user profile
        if (isViewingSocialUserProfile()) {
          newOpenDropdown[item.id] = true;
        }

        // Check if viewing feed-related routes
        if (isViewingFeedRoutes()) {
          newOpenDropdown[item.id] = true;
        }

        // Check if viewing Profile routes
        if (
          location.pathname === "/dashboard/Profile" ||
          location.pathname.startsWith("/dashboard/Profile/")
        ) {
          newOpenDropdown[item.id] = true;
        }

        // Check if viewing Connections routes
        if (
          location.pathname === "/dashboard/MyConnection" ||
          location.pathname.startsWith("/dashboard/MyConnection/")
        ) {
          newOpenDropdown[item.id] = true;
        }

        // Also check if on any social child path
        if (
          item.childPaths?.some(
            (path: string) =>
              location.pathname === path ||
              location.pathname.startsWith(path + "/") ||
              location.pathname.startsWith("/dashboard/social/") ||
              location.pathname.startsWith("/dashboard/trendingpost") ||
              location.pathname.includes("/feed/")
          )
        ) {
          newOpenDropdown[item.id] = true;
        }
      }
    });

    setOpenDropdown(newOpenDropdown);
  }, [location.pathname, loggedInUserID]);

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
      label: "Legacy Profile",
      active: false,
      isProfileDropdown: true,
      childPaths: [
        "/dashboard/user-profile",
        "/dashboard/company-profile",
        `/dashboard/userprofile/${loggedInUserID}`,
      ],
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
        "/dashboard/assesmentcertification",
        "/dashboard/aspiring-assessment", 
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
      childPaths: [
        "/dashboard/search-listing",
        "/dashboard/DashboardDirectory",
        "/dashboard/editpubliclisting",
        "/dashboard/directory-profile",
      ],
      children: [
        { label: "Search Listing", path: "/dashboard/DashboardDirectory" },
        { label: "Edit Directory", path: "/dashboard/edit-profile" },
        { label: "My Enquiry", path: "/dashboard/my-enquiry" },
      ],
    },
    {
      id: "Best Practices Hub",
      icon: <TrendingUp className="w-5 h-5 text-[#64748B]" />,
      label: "Best Practices Hub",
      active: false,
      isbestpractices: true,
      childPaths: [
        "/dashboard/bestpractices",
        "/dashboard/manage_bestpractices",
      ],
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
      childPaths: [
        "/dashboard/Feed",
        "/dashboard/Profile",
        "/dashboard/MyConnection",
        "/dashboard/Certification",
        "/dashboard/social",
        "/dashboard/feed",
        "/dashboard/trendingpost", // Add trendingpost route
      ],
      children: [
        { label: "Feed", path: "/dashboard/feed" },
        { label: "Dashboard", path: "/dashboard/Profile" },
        { label: "Connections", path: "/dashboard/MyConnection" },
      ],
    },
    // Conditionally include marketplace item
    ...(import.meta.env.VITE_ENV_STAGE === "test" ||
    import.meta.env.VITE_ENV_STAGE === "uat"
      ? [
          // {
          //   id: "market-place",
          //   icon: (
          //     <img
          //       src={iconMap["market"]}
          //       alt="Home Icon"
          //       className="w-5 h-5"
          //     />
          //   ),
          //   label: "Marketplace",
          //   active: false,
          //   path: "/dashboard/market-place",
          //   isMarketplaceDropdown: true,
          //   childPaths: [
          //     "/dashboard/market-place",
          //     "/dashboard/createshop",
          //     "/dashboard/Tracking",
          //     "/dashboard/CreatorGuideline",
          //     "/dashboard/seller-dashboard",
          //   ],
          //   children: [
          //     {
          //       label: "Buy Digital Products",
          //       path: "/dashboard/market-place",
          //     },
          //     { label: "Sell your Products", path: "/dashboard/createshop" },
          //     ...(isSeller
          //       ? [
          //           {
          //             label: "Seller Dashboard",
          //             path: "/dashboard/seller-dashboard",
          //           },
          //         ]
          //       : []),
          //   ],
          // },
        ]
      : []),
    {
      id: "MentorPartnerHub",
      icon: <Zap className="w-5 h-5 text-gray-500" />,
      label: "Cness Works",
      active: false,
      isMentorDropdown: true,
      childPaths: [
        "/dashboard/become-mentor",
        "/dashboard/Become_partner",
        "/dashboard/affiliate",
      ],
      children: [
        { label: "Mentor", path: "/dashboard/become-mentor" },
        { label: "Partner", path: "/dashboard/Become_partner" },
      ],
    },
    {
      id: "notifications",
      icon: <Bell className="w-5 h-5 text-gray-500" />,
      label: "Notifications",
      active: true,
      path: "/dashboard/notification",
    },
  ];

  const NavItem = ({ item }: any) => {
    const isDropdownOpen = !!openDropdown[item.id];

    // Check if current route matches this item or its children
    const isActive = item.path
      ? location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/")
      : false;

    const isActiveChild = item.childPaths?.some(
      (path: string) =>
        location.pathname === path || location.pathname.startsWith(path + "/")
    );

    // Special handling for directory item
    const isDirectoryActive =
      item.id === "directory" &&
      (isActiveChild ||
        isViewingOtherUserProfile() ||
        isViewingDirectoryProfile() ||
        location.pathname.startsWith("/dashboard/search-listing") ||
        location.pathname.includes("search-listing") ||
        location.pathname === "/dashboard/DashboardDirectory");

    // Special handling for Social item
    const isSocialActive =
      item.id === "Social" &&
      (isActiveChild ||
        isViewingSocialUserProfile() ||
        isViewingFeedRoutes() ||
        location.pathname.startsWith("/dashboard/social/") ||
        location.pathname.startsWith("/dashboard/feed/") ||
        location.pathname.startsWith("/dashboard/trendingpost") ||
        location.pathname === "/dashboard/Profile" ||
        location.pathname.startsWith("/dashboard/Profile/") ||
        location.pathname === "/dashboard/MyConnection" ||
        location.pathname.startsWith("/dashboard/MyConnection/"));

    const isBestPracticesActive =
      item.id === "Best Practices Hub" &&
      (isActiveChild ||
        location.pathname.startsWith("/dashboard/bestpractices/") ||
        location.pathname.startsWith("/dashboard/manage_bestpractices/"));

    // Special handling for Certifications item
    const isCertificationsActive =
      item.id === "Certifications" &&
      (isActiveChild ||
        location.pathname.startsWith("/dashboard/aspiring-assessment") ||
        location.pathname.startsWith("/dashboard/assesment") ||
        location.pathname.startsWith("/dashboard/score-result") ||
        location.pathname.startsWith("/dashboard/upgrade-badge") ||
        location.pathname.startsWith("/dashboard/assesmentcertification"));

    const baseClasses = `
      flex items-center gap-3 px-3 py-2.5 w-full rounded-xl cursor-pointer 
      font-poppins font-normal text-[14px] leading-[20px]
      transition duration-200 ease-in-out
      hover:translate-x-[2px] hover:text-black hover:bg-[#CDC1FF1A]
    `;

    const activeMainClasses =
      "bg-[#CDC1FF1A] text-[#9747FF] font-poppins font-normal text-[14px]";
    const inactiveMainClasses =
      "text-gray-500 hover:text-black font-poppins font-normal text-[14px]";
    const activeSubClasses =
      "text-[#F07EFF] font-poppins font-normal text-[14px]";
    const inactiveSubClasses =
      "text-gray-500 text-[14px] hover:text-[#F07EFF] font-poppins font-normal transition duration-200 ease-in-out hover:translate-x-[2px]";

    const content = (
      <>
        <div
          className={`inline-flex items-start gap-2.5 ${
            isActive ||
            isActiveChild ||
            isDirectoryActive ||
            isSocialActive ||
            isBestPracticesActive ||
            isCertificationsActive
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

    const toggleDropdown = () => {
      setOpenDropdown((prev) => {
        const isCurrentlyOpen = !!prev[item.id];

        // Close all
        const newState: { [key: string]: boolean } = {};
        Object.keys(prev).forEach((key) => {
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
        location.pathname === `/dashboard/userprofile/${loggedInUserID}`;

      const isProfileOpen = !!openDropdown["TrueProfile"];

      return (
        <div className="w-full">
          <button
            onClick={toggleDropdown}
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
              <ChevronUpIcon className="w-4 h-4 text-[#9747FF]" />
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
                to={`/dashboard/userprofile/${loggedInUserID}`}
                end
                className={({ isActive }) =>
                  `px-3 py-3 rounded-lg w-full transition whitespace-nowrap ${
                    isActive ? activeSubClasses : inactiveSubClasses
                  }`
                }
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
      const shouldSocialBeActive =
        item.id === "Social" &&
        (isDropdownOpen ||
          isActiveChild ||
          isViewingSocialUserProfile() ||
          isViewingFeedRoutes() ||
          location.pathname.startsWith("/dashboard/feed/") ||
          location.pathname.startsWith("/dashboard/trendingpost") ||
          location.pathname === "/dashboard/Profile" ||
          location.pathname.startsWith("/dashboard/Profile/") ||
          location.pathname === "/dashboard/MyConnection" ||
          location.pathname.startsWith("/dashboard/MyConnection/"));

      const shouldDirectoryBeActive =
        item.id === "directory" &&
        (isDropdownOpen ||
          isActiveChild ||
          isViewingOtherUserProfile() ||
          isViewingDirectoryProfile() ||
          location.pathname.startsWith("/dashboard/search-listing") ||
          location.pathname.includes("search-listing") ||
          location.pathname === "/dashboard/DashboardDirectory");

      const shouldBestPracticesBeActive =
        item.id === "Best Practices Hub" &&
        (isDropdownOpen ||
          isActiveChild ||
          location.pathname.startsWith("/dashboard/bestpractices/") ||
          location.pathname.startsWith("/dashboard/manage_bestpractices/"));

      const shouldCertificationsBeActive =
        item.id === "Certifications" &&
        (isDropdownOpen ||
          isActiveChild ||
          location.pathname.startsWith("/dashboard/aspiring-assessment") ||
          location.pathname.startsWith("/dashboard/assesment") ||
          location.pathname.startsWith("/dashboard/score-result") ||
          location.pathname.startsWith("/dashboard/upgrade-badge") ||
          location.pathname.startsWith("/dashboard/assesmentcertification"));

      const shouldBeActive =
        item.id === "Social"
          ? shouldSocialBeActive
          : item.id === "directory"
          ? shouldDirectoryBeActive
          : item.id === "Best Practices Hub"
          ? shouldBestPracticesBeActive
          : item.id === "Certifications"
          ? shouldCertificationsBeActive
          : isDropdownOpen || isActiveChild;

      return (
        <div className="w-full">
          <button
            onClick={toggleDropdown}
            className={`${baseClasses} ${
              shouldBeActive ? activeMainClasses : inactiveMainClasses
            }`}
          >
            <div className="flex items-start gap-3 w-full relative">
              {content}
            </div>
            {isDropdownOpen ? (
              <ChevronUpIcon className="w-4 h-4 text-[#9747FF]" />
            ) : (
              <ChevronDownIcon
                className={`w-4 h-4 ${
                  shouldBeActive ? "text-[#9747FF]" : "text-gray-600"
                }`}
              />
            )}
          </button>

          {isDropdownOpen && (
            <div className="flex flex-col gap-1 mt-3 pl-8">
              {item.children.map((child: any, idx: number) => {
                // Special handling for Connections when viewing social profiles
                const isForcedActiveForSocial =
                  item.id === "Social" &&
                  child.label === "Connections" &&
                  isViewingSocialUserProfile();

                // Special handling for Best Practices child
                const isForcedActiveForBestPractices =
                  item.id === "Best Practices Hub" &&
                  child.label === "Best Practices" &&
                  (location.pathname.startsWith("/dashboard/bestpractices/") ||
                    location.pathname === "/dashboard/bestpractices");

                // Special handling for Manage Best Practices child
                const isForcedActiveForManageBestPractices =
                  item.id === "Best Practices Hub" &&
                  child.label === "Manage Best Practices" &&
                  location.pathname.startsWith(
                    "/dashboard/manage_bestpractices/"
                  );

                // Special handling for Search Listing child
                const isForcedActiveForSearchListing =
                  item.id === "directory" &&
                  child.label === "Search Listing" &&
                  (location.pathname === "/dashboard/DashboardDirectory" ||
                    location.pathname.startsWith("/dashboard/search-listing") ||
                    location.pathname.includes("search-listing"));

                // Special handling for Get Certified child
                const isForcedActiveForGetCertified =
                  item.id === "Certifications" &&
                  child.label === "Get Certified" &&
                  (location.pathname.startsWith("/dashboard/aspiring-assessment") ||
                    location.pathname.startsWith("/dashboard/assesment") ||
                    location.pathname === "/dashboard/assesmentcertification");

                // Special handling for Score & Results child
                const isForcedActiveForScoreResults =
                  item.id === "Certifications" &&
                  child.label === "Score & Results" &&
                  location.pathname.startsWith("/dashboard/score-result");

                // Special handling for Upgrade Badge child
                const isForcedActiveForUpgradeBadge =
                  item.id === "Certifications" &&
                  child.label === "Upgrade Badge" &&
                  location.pathname.startsWith("/dashboard/upgrade-badge");

                // Special handling for Feed child
                const isForcedActiveForFeed =
                  item.id === "Social" &&
                  child.label === "Feed" &&
                  (location.pathname === "/dashboard/feed" ||
                    location.pathname.startsWith("/dashboard/feed/") ||
                    location.pathname.startsWith("/dashboard/trendingpost") ||
                    location.pathname.includes("/feed/search") ||
                    location.pathname.includes("?topic=") ||
                    location.pathname.includes("?tag="));

                // Special handling for Dashboard child
                const isForcedActiveForDashboard =
                  item.id === "Social" &&
                  child.label === "Dashboard" &&
                  (location.pathname === "/dashboard/Profile" ||
                    location.pathname.startsWith("/dashboard/Profile/"));

                // Special handling for Connections child
                const isForcedActiveForConnections =
                  item.id === "Social" &&
                  child.label === "Connections" &&
                  (location.pathname === "/dashboard/MyConnection" ||
                    location.pathname.startsWith("/dashboard/MyConnection/") ||
                    isViewingSocialUserProfile());

                return child.path ? (
                  <NavLink
                    key={idx}
                    to={child.path}
                    end
                    className={({ isActive }) => {
                      const forcedActive =
                        isForcedActiveForSocial ||
                        isForcedActiveForBestPractices ||
                        isForcedActiveForManageBestPractices ||
                        isForcedActiveForSearchListing ||
                        isForcedActiveForGetCertified ||
                        isForcedActiveForScoreResults ||
                        isForcedActiveForUpgradeBadge ||
                        isForcedActiveForFeed ||
                        isForcedActiveForDashboard ||
                        isForcedActiveForConnections ||
                        (child.label === "Search Listing" &&
                          (isViewingOtherUserProfile() ||
                            isViewingDirectoryProfile())) ||
                        (child.label === "Search Listing" &&
                          location.pathname ===
                            "/dashboard/DashboardDirectory");

                      return `px-4 py-3 w-full rounded-md transition whitespace-nowrap ${
                        isActive || forcedActive
                          ? activeSubClasses
                          : inactiveSubClasses
                      }`;
                    }}
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
                );
              })}
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
              <NavItem key={index} item={item} />
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNavbar;
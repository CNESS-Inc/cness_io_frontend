import { 
  AwardIcon, BadgePlusIcon, BellIcon, FileBarChartIcon, 
  GraduationCapIcon, HelpCircleIcon, LayoutDashboardIcon, 
  SettingsIcon, UploadIcon, UserIcon, XIcon 
} from "lucide-react";

const DashboardNavbar = ({ isMobileNavOpen, toggleMobileNav }:any) => {
  // Navigation items data
  const mainNavItems = [
    { icon: <LayoutDashboardIcon className="w-5 h-5" />, label: "Dashboard", active: true },
    { icon: <AwardIcon className="w-5 h-5" />, label: "Get Certified", active: false },
    { icon: <UploadIcon className="w-5 h-5" />, label: "Upload Proof", active: false },
    { icon: <FileBarChartIcon className="w-5 h-5" />, label: "Score & Results", active: false },
    { icon: <GraduationCapIcon className="w-5 h-5" />, label: "Learning Lab (LMS)", active: false },
    { icon: <BadgePlusIcon className="w-5 h-5" />, label: "Upgrade Badge", active: false },
    { icon: <UserIcon className="w-5 h-5" />, label: "Directory Profile", active: false },
  ];

  const secondaryNavItems = [
    { icon: <BellIcon className="w-5 h-5" />, label: "Notifications", active: false, hasNotification: true },
    { icon: <SettingsIcon className="w-5 h-5" />, label: "Settings", active: false },
    { icon: <HelpCircleIcon className="w-5 h-5" />, label: "Support", active: false },
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
      <nav className={`
        fixed md:relative
        h-full w-[280px]
        bg-white border-r border-[#0000001a]
        transition-all duration-300 ease-in-out
        z-50
        ${isMobileNavOpen ? 'left-0' : '-left-full md:left-0'}
      `}>
        <div className="flex flex-col h-full gap-11 overflow-y-auto">
          {/* Mobile Close Button */}
          <div className="md:hidden flex justify-end px-2">
            <button onClick={toggleMobileNav} className="p-2">
              <XIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex flex-col items-start gap-[7.5px] px-6">
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
const NavItem = ({ item, onClick }:any) => (
  <div
    className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl cursor-pointer hover:bg-[#cdc1ff33] ${
      item.active ? "bg-[#cdc1ff33]" : "rounded-[99px]"
    }`}
    onClick={!item.active ? onClick : undefined}
  >
    <div className="flex items-start gap-3 w-full relative">
      <div className="inline-flex items-start gap-2.5">{item.icon}</div>
      <div className={`font-medium text-sm ${
        item.active ? "text-indigo-600" : "text-slate-500"
      }`}>
        {item.label}
      </div>
      {item.hasNotification && (
        <div className="absolute w-2 h-2 top-[13px] -left-px bg-orange-500 rounded-full border border-white" />
      )}
    </div>
  </div>
);

export default DashboardNavbar;
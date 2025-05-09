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
  } from "lucide-react";
  import React from "react";
  
  export const NavBarByAnima = (): JSX.Element => {
    // Navigation items data for main menu
    const mainNavItems = [
      {
        icon: <LayoutDashboardIcon className="w-5 h-5" />,
        label: "Dashboard",
        active: true,
      },
      {
        icon: <AwardIcon className="w-5 h-5" />,
        label: "Get Certified",
        active: false,
      },
      {
        icon: <UploadIcon className="w-5 h-5" />,
        label: "UploadIcon Proof",
        active: false,
      },
      {
        icon: <FileBarChartIcon className="w-5 h-5" />,
        label: "Score & Results",
        active: false,
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
    ];
  
    // Navigation items data for secondary menu
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
    ];
  
    return (
      <nav className="flex flex-col h-full w-[280px] gap-11 py-8 bg-white border-r border-[#0000001a]">
        <div className="flex flex-col items-start gap-[7.5px] px-6">
          <img
            className="w-[108.12px] h-[46.51px]"
            alt="Company Logo"
            src="https://c.animaapp.com/magahlmqpONVZN/img/component-1.svg"
          />
        </div>
  
        <div className="flex flex-col items-start gap-1 px-3 w-full">
          {mainNavItems.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl ${
                item.active ? "bg-[#cdc1ff33]" : "rounded-[99px]"
              }`}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="inline-flex items-start gap-2.5">{item.icon}</div>
  
                <div
                  className={`font-base-medium font-[number:var(--base-medium-font-weight)] text-[length:var(--base-medium-font-size)] tracking-[var(--base-medium-letter-spacing)] leading-[var(--base-medium-line-height)] whitespace-nowrap [font-style:var(--base-medium-font-style)] ${
                    item.active ? "text-indigo-600" : "text-slate-500"
                  }`}
                >
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="w-full h-px">
          <img
            className="w-full h-px object-cover"
            alt="Divider"
            src="https://c.animaapp.com/magahlmqpONVZN/img/line-1.svg"
          />
        </div>
  
        <div className="flex flex-col items-start gap-1 px-3 w-full">
          {secondaryNavItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-[99px]"
            >
              <div className="flex items-start gap-3 w-full relative">
                <div className="inline-flex items-start gap-2.5">{item.icon}</div>
  
                <div className="font-base-medium font-[number:var(--base-medium-font-weight)] text-slate-500 text-[length:var(--base-medium-font-size)] tracking-[var(--base-medium-letter-spacing)] leading-[var(--base-medium-line-height)] whitespace-nowrap [font-style:var(--base-medium-font-style)]">
                  {item.label}
                </div>
  
                {item.hasNotification && (
                  <div className="absolute w-2 h-2 top-[13px] -left-px bg-orange-500 rounded-[99px] border border-solid border-white" />
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>
    );
  };
  
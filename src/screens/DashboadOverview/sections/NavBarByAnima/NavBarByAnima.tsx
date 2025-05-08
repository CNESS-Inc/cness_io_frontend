import React from "react";
import Button from "../../../../components/ui/Button";
import { Separator } from "../../../../components/ui/separator";

export const NavBarByAnima = () => {
  // Navigation menu items data
  const mainNavItems = [
    { label: "Dashboard", isActive: true },
    { label: "Get Certified", isActive: false },
    { label: "Upload Proof", isActive: false },
    { label: "Score & Results", isActive: false },
    { label: "Learning Lab (LMS)", isActive: false },
    { label: "Upgrade Badge", isActive: false },
    { label: "Directory Profile", isActive: false },
  ];

  const secondaryNavItems = [
    { label: "Notifications", isActive: false, hasNotification: true },
    { label: "Settings", isActive: false },
    { label: "Support", isActive: false },
  ];

  return (
    <nav className="flex flex-col h-full w-[280px] gap-11 py-8 bg-white border-r border-[#0000001a]">
      {/* Logo */}
      <div className="flex flex-col items-start px-6">
        <img
          className="w-[108.12px] h-[46.51px]"
          alt="Component"
          src="https://c.animaapp.com/mae5miq5mElmTn/img/component-1.svg"
        />
      </div>

      {/* Main Navigation Items */}
      <div className="flex flex-col items-start gap-1 px-3 w-full">
        {mainNavItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className={`flex items-center justify-start gap-3 px-4 py-3 w-full h-11 rounded-xl ${
              item.isActive
                ? "bg-[#cdc1ff33] text-indigo-600"
                : "text-slate-500"
            }`}
          >
            <div className="flex items-start gap-2.5">
              <img
                className="w-5 h-5"
                alt="Icon"
                src="https://c.animaapp.com/mae5miq5mElmTn/img/icon.svg"
              />
            </div>
            <span className="font-base-medium font-[number:var(--base-medium-font-weight)] text-[length:var(--base-medium-font-size)] tracking-[var(--base-medium-letter-spacing)] leading-[var(--base-medium-line-height)] [font-style:var(--base-medium-font-style)]">
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      {/* Divider */}
      <Separator className="w-full" />

      {/* Secondary Navigation Items */}
      <div className="flex flex-col items-start gap-1 px-3 w-full">
        {secondaryNavItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            className="flex items-center justify-start gap-3 px-4 py-3 w-full h-11 rounded-[99px] text-slate-500 relative"
          >
            <div className="flex items-start gap-2.5">
              <img
                className="w-5 h-5"
                alt="Icon"
                src="https://c.animaapp.com/mae5miq5mElmTn/img/icon.svg"
              />
            </div>
            <span className="font-base-medium font-[number:var(--base-medium-font-weight)] text-[length:var(--base-medium-font-size)] tracking-[var(--base-medium-letter-spacing)] leading-[var(--base-medium-line-height)] [font-style:var(--base-medium-font-style)]">
              {item.label}
            </span>
            {item.hasNotification && (
              <div className="absolute w-2 h-2 top-[13px] -left-px bg-orange-500 rounded-[99px] border border-solid border-white" />
            )}
          </Button>
        ))}
      </div>
    </nav>
  );
};

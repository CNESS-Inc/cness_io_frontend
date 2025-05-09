import { ChevronDownIcon } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../components/ui/navigation-menu";
import { Separator } from "../components/ui/separator";

export const NavBarByAnima = (): JSX.Element => {
  // Navigation items data for main menu
  const mainNavItems = [
    {
      name: "Dashboard",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon.svg",
      active: true,
    },
    {
      name: "Get Certified",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-7.svg",
      active: false,
    },
    {
      name: "Upload Proof",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-6.svg",
      active: false,
    },
    {
      name: "Score & Results",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-4.svg",
      active: false,
    },
    {
      name: "Learning Lab (LMS)",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-2.svg",
      active: false,
    },
    {
      name: "Upgrade Badge",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-1.svg",
      active: false,
    },
    {
      name: "Directory",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-9.svg",
      active: false,
    },
  ];

  // Navigation items data for user menu
  const userNavItems = [
    {
      name: "Profile",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-9.svg",
      hasDropdown: true,
      active: false,
    },
    {
      name: "Notifications",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-5.svg",
      hasNotification: true,
      active: false,
    },
    {
      name: "Settings",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-3.svg",
      active: false,
    },
    {
      name: "Support",
      icon: "https://c.animaapp.com/magbsx1oc1vPoR/img/icon-8.svg",
      active: false,
    },
  ];

  return (
    <aside className="flex flex-col w-[280px] h-[1180px] gap-11 py-8 bg-white border-r border-[#0000001a]">
      <div className="flex flex-col items-start gap-[7.5px] px-6 w-full">
        <img
          className="w-[108.12px] h-[46.51px]"
          alt="Logo"
          src="https://c.animaapp.com/magbsx1oc1vPoR/img/component-1.svg"
        />
      </div>

      <NavigationMenu orientation="vertical" className="w-full max-w-none">
        <NavigationMenuList className="flex flex-col items-start gap-1 px-3 w-full">
          {mainNavItems.map((item, index) => (
            <NavigationMenuItem key={index} className="w-full">
              <Button
                asChild
                variant="ghost"
                className={`w-full justify-start px-4 py-3 h-11 rounded-xl ${
                  item.active
                    ? "bg-[#cdc1ff33] text-indigo-600"
                    : "text-slate-500"
                }`}
              >
                <NavigationMenuLink>
                  <div className="flex items-start gap-3 w-full">
                    <div className="inline-flex items-start">
                      <img
                        className="w-5 h-5"
                        alt={`${item.name} icon`}
                        src={item.icon}
                      />
                    </div>
                    <span className="font-base-medium font-[number:var(--base-medium-font-weight)] text-[length:var(--base-medium-font-size)] tracking-[var(--base-medium-letter-spacing)] leading-[var(--base-medium-line-height)] [font-style:var(--base-medium-font-style)]">
                      {item.name}
                    </span>
                  </div>
                </NavigationMenuLink>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <Separator className="w-full" />

      <NavigationMenu orientation="vertical" className="w-full max-w-none">
        <NavigationMenuList className="flex flex-col items-start gap-1 px-3 w-full">
          {userNavItems.map((item, index) => (
            <NavigationMenuItem key={index} className="w-full">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-11 rounded-[99px] text-slate-500"
              >
                <NavigationMenuLink>
                  <div className="flex items-center gap-3 w-full">
                    <div className="inline-flex items-start relative">
                      <img
                        className="w-5 h-5"
                        alt={`${item.name} icon`}
                        src={item.icon}
                      />
                      {item.hasNotification && (
                        <div className="absolute w-2 h-2 top-0 -left-px bg-orange-500 rounded-[99px] border border-solid border-white" />
                      )}
                    </div>
                    <span className="font-base-medium font-[number:var(--base-medium-font-weight)] text-[length:var(--base-medium-font-size)] tracking-[var(--base-medium-letter-spacing)] leading-[var(--base-medium-line-height)] [font-style:var(--base-medium-font-style)] flex-1">
                      {item.name}
                    </span>
                    {item.hasDropdown && (
                      <ChevronDownIcon className="w-[14.74px] h-[14.74px]" />
                    )}
                  </div>
                </NavigationMenuLink>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </aside>
  );
};

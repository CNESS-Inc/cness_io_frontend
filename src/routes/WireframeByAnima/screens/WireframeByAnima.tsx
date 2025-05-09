import { Button } from "../../NavBarByAnima/components/ui/button";
import { Card } from "../../NavBarByAnima/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "../../NavBarByAnima/components/ui/navigation-menu";

export const WireframeByAnima = (): JSX.Element => {
  // Navigation menu items
  const navItems = [
    { label: "Why", href: "#" },
    { label: "What", href: "#" },
    { label: "About", href: "#" },
  ];

  return (
    <div className="w-full h-[800px] relative bg-white">
      <Card className="absolute w-[1415px] h-[692px] top-[106px] left-3 bg-[#f9f9f9] rounded-xl overflow-hidden border-none">
        <div className="relative w-full h-full">
          <div className="flex items-center gap-[53.5px] absolute top-[-139px] left-[-743px] opacity-50">
            <div className="bg-[#00d1ff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
            <div className="bg-[#623fff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
            <div className="bg-[#ff994a] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
          </div>

          <div className="flex flex-col items-center gap-8 absolute top-[213px] left-[245px] right-[245px]">
            <div className="flex flex-col items-center gap-3">
              <h1 className="w-fit mt-[-1.00px] text-7xl">
                Build with Consciousness.
              </h1>

              <p className="w-[707px] [font-family:'Open_Sans',Helvetica] font-normal text-[#7a7a7a] text-xl text-center tracking-[0] leading-[30px]">
                The world's first conscious business platform — where
                individuals and organizations certify, connect, grow, and lead
                with integrity.
              </p>
            </div>

            <div className="flex items-center justify-center gap-[15px] w-full">
              <Button className="px-6 py-4 rounded-[100px] [background:linear-gradient(152deg,rgba(112,119,254,1)_0%,rgba(240,126,255,1)_100%)] [font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-white text-lg">
                Get Started
              </Button>

              <Button
                variant="outline"
                className="bg-white border border-solid border-[#2222241a] px-6 py-4 rounded-[100px] [font-family:'Plus_Jakarta_Sans',Helvetica] text-[#222224] font-medium text-lg"
              >
                Join the Visionary Council
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <header className="flex w-full items-center justify-between px-8 py-[18px] absolute top-0 left-0 bg-white">
        <div className="relative w-[144.16px] h-[62.01px]">
          <img
            className="absolute w-5 h-[23px] top-5 left-12"
            alt="Vector"
            src="https://c.animaapp.com/magbg19buoKwc2/img/vector.svg"
          />
          <img
            className="absolute w-[23px] h-[23px] top-5 left-[74px]"
            alt="Vector"
            src="https://c.animaapp.com/magbg19buoKwc2/img/vector-5.svg"
          />
          <img
            className="absolute w-[17px] h-[23px] top-[19px] left-[103px]"
            alt="Vector"
            src="https://c.animaapp.com/magbg19buoKwc2/img/vector-3.svg"
          />
          <img
            className="absolute w-[17px] h-[23px] top-[19px] left-[127px]"
            alt="Vector"
            src="https://c.animaapp.com/magbg19buoKwc2/img/vector-3.svg"
          />
          <div className="absolute w-[45px] h-[62px] top-0 left-0">
            <img
              className="absolute w-[22px] h-[23px] top-5 left-[19px]"
              alt="Vector"
              src="https://c.animaapp.com/magbg19buoKwc2/img/vector-2.svg"
            />
            <img
              className="absolute w-[13px] h-[13px] top-[25px] left-6"
              alt="Vector"
              src="https://c.animaapp.com/magbg19buoKwc2/img/vector-1.svg"
            />
          </div>
        </div>

        <div className="flex items-center gap-[46px]">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-[46px]">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  <a
                    href={item.href}
                    className="[font-family:'Plus_Jakarta_Sans',Helvetica] font-normal text-[#1a1a1a] text-base tracking-[0] leading-6"
                  >
                    {item.label}
                  </a>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <Button className="bg-[#7076fe] px-6 py-4 rounded-[100px] [font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-white text-lg">
            Sign Up
          </Button>
        </div>
      </header>
    </div>
  );
};

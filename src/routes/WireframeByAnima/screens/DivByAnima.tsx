import { Button } from "../../NavBarByAnima/components/ui/button";
import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";

export const DivByAnima = (): JSX.Element => {
  // Define journey steps data for mapping
  const journeySteps = [
    {
      id: 1,
      position: { top: 0, left: 0 },
      steps: [
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-7.svg",
          title: "Create Profile",
        },
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-8.svg",
          title: "Assessment",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
    {
      id: 2,
      position: { top: 120, left: 554 },
      steps: [
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-2.svg",
          title: "Certified",
        },
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-4.svg",
          title: "Receive Score",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
    {
      id: 3,
      position: { top: 319, left: 212 },
      steps: [
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame.svg",
          title: "Learn",
        },
        {
          icon: "https://c.animaapp.com/magbg19buoKwc2/img/frame-5.svg",
          title: "Unlock",
        },
      ],
      lineImg: "https://c.animaapp.com/magbg19buoKwc2/img/line-1.svg",
    },
  ];

  // Define connecting lines data
  const connectingLines = [
    {
      src: "https://c.animaapp.com/magbg19buoKwc2/img/line-1-1.svg",
      width: "153px",
      height: "123px",
      top: "65px",
      left: "403px",
    },
    {
      src: "https://c.animaapp.com/magbg19buoKwc2/img/line-4.svg",
      width: "293px",
      height: "161px",
      top: "227px",
      left: "675px",
    },
  ];

  // Define background blobs data
  const backgroundBlobs = [
    { color: "#00d1ff", position: 0 },
    { color: "#623fff", position: 1 },
    { color: "#ff994a", position: 2 },
  ];

  return (
    <div className="flex w-full max-w-[1440px] items-center justify-around gap-[38px] pl-0 pr-8 py-6 relative bg-[#f3f1ff] overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute w-[736px] h-[590px] top-[280px] left-[-45px]">
        <div className="relative w-[691px] h-[590px] left-[45px] bg-[100%_100%]">
          {Array(26)
            .fill(0)
            .map((_, index) => (
              <img
                key={`left-clip-${index}`}
                className="absolute w-[691px] h-[590px] top-0 left-0"
                alt="Clip path group"
              />
            ))}
        </div>
      </div>

      <div className="absolute w-[691px] h-[553px] top-[298px] left-[760px] rotate-180">
        <div className="relative w-[680px] h-[553px] left-[11px]">
          {Array(27)
            .fill(0)
            .map((_, index) => (
              <img
                key={`right-clip-${index}`}
                className="absolute w-[680px] h-[553px] top-0 left-0 -rotate-180"
                alt="Clip path group"
              />
            ))}
        </div>
      </div>

      <div className="gap-[80.62px] top-[193px] left-[-283px] inline-flex items-center absolute opacity-50">
        {backgroundBlobs.map((blob, index) => (
          <div
            key={`blob-${index}`}
            className="relative w-[550px] h-[550px] rounded-[275px] blur-[263.7px]"
            style={{ backgroundColor: blob.color }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="inline-flex flex-col items-center gap-[78px] px-0 py-6 relative flex-[0_0_auto] z-10">
        {/* Header section */}
        <div className="inline-flex flex-col items-center gap-[18px] relative flex-[0_0_auto]">
          <div className="relative self-stretch mt-[-1.00px] font-['Poppins',Helvetica] font-bold text-[#7076fe] text-lg text-center tracking-[3.15px] leading-[normal]">
            ACTIONS
          </div>

          <div className="flex flex-col items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex w-[601px] items-center justify-center gap-2.5 p-2.5 relative flex-[0_0_auto]">
              <h1 className="relative flex-1 mt-[-1.00px] font-['Poppins',Helvetica] font-semibold text-[#222224] text-[42px] text-center tracking-[0] leading-[normal]">
                Our Certification Journey
              </h1>
            </div>
          </div>
        </div>

        {/* Journey map */}
        <div className="relative w-[1026.44px] h-[451px]">
          <div className="relative w-[1026px] h-[451px]">
            {/* Connecting lines between steps */}
            {connectingLines.map((line, index) => (
              <img
                key={`connecting-line-${index}`}
                className="absolute"
                alt="Line"
                src={line.src}
                style={{
                  width: line.width,
                  height: line.height,
                  top: line.top,
                  left: line.left,
                }}
              />
            ))}

            {/* Journey step groups */}
            {journeySteps.map((group) => (
              <div
                key={`step-group-${group.id}`}
                className="flex w-[472px] h-[132px] items-center gap-0.5 absolute"
                style={{
                  top: `${group.position.top}px`,
                  left: `${group.position.left}px`,
                }}
              >
                {/* First step in the group */}
                <Card className="flex flex-col w-[140px] items-center gap-3 px-2 py-6 bg-white rounded-[32px] border border-solid border-transparent">
                  <CardContent className="p-0 flex flex-col items-center gap-3">
                    <img
                      className="relative w-8 h-8"
                      alt="Frame"
                      src={group.steps[0].icon}
                    />
                    <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                      <div className="relative flex-1 mt-[-1.00px] font-['Plus_Jakarta_Sans',Helvetica] font-medium text-[#2a2a2a] text-base text-center tracking-[0] leading-[20.1px]">
                        {group.steps[0].title}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connecting line between steps in the group */}
                <img
                  className="relative w-[190px] h-0.5"
                  alt="Line"
                  src={group.lineImg}
                />

                {/* Second step in the group */}
                <Card className="flex flex-col w-[140px] items-center gap-3 px-2 py-6 bg-white rounded-[32px] border border-solid border-transparent">
                  <CardContent className="p-0 flex flex-col items-center gap-3">
                    <img
                      className="relative w-8 h-8"
                      alt="Frame"
                      src={group.steps[1].icon}
                    />
                    <div className="flex items-center justify-center gap-2.5 px-0 py-2.5 relative self-stretch w-full">
                      <div className="relative flex-1 mt-[-1.00px] font-['Plus_Jakarta_Sans',Helvetica] font-medium text-[#2a2a2a] text-base text-center tracking-[0] leading-[20.1px]">
                        {group.steps[1].title}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <Button className="px-6 py-4 rounded-[100px] [background:linear-gradient(152deg,rgba(112,119,254,1)_0%,rgba(240,126,255,1)_100%)] hover:opacity-90">
          <span className="font-['Plus_Jakarta_Sans',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-[normal] whitespace-nowrap">
            Start Journey
          </span>
        </Button>
      </div>
    </div>
  );
};

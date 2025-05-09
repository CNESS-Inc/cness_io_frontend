import { Badge } from "../../NavBarByAnima/components/ui/badge";
import { Button } from "../../NavBarByAnima/components/ui/button";
import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";

// Module data for mapping
const modules = [
  {
    title: "Certification Engine",
    headline: "Proof of purpose. \nMeasured with precision.",
    features: [
      "Sector and size-specific assessment engine",
      "Conscious Impact Score (CIS)",
      "Public badge + year-long visibility",
    ],
    imagePosition: "left",
  },
  {
    title: "Learning Lab",
    headline: "Grow Beyond good Intentions.",
    features: [
      "Micro-modular LMS",
      "Six pillars of conscious leadership",
      "Required for renewals & upgrades",
    ],
    imagePosition: "right",
  },
  {
    title: "Directory",
    headline: "A new kind of  visibility.",
    features: [
      "Searchable by sector, geography, level",
      "Premium spotlight listings",
      "Conscious badges",
    ],
    imagePosition: "left",
  },
  {
    title: "Council | Mentors | Partners",
    headline: "Co-create the movement.",
    features: [
      "Early adopters & conscious leaders",
      "Revenue-share mentorship model",
      "Licensed implementation",
    ],
    imagePosition: "right",
  },
];

export const FrameWrapperByAnima = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-8 pt-8 pb-[52px] px-[52px] relative [background:linear-gradient(0deg,rgba(243,241,255,1)_0%,rgba(243,241,255,1)_100%),linear-gradient(0deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.2)_100%)]">
      <header className="flex flex-col items-center gap-6 px-0 py-6">
        <h3 className="self-stretch mt-[-1.00px] [font-family:'Poppins',Helvetica] font-bold text-[#7076fe] text-2xl text-center tracking-[0] leading-[normal]">
          PLATFORM MODULES OVERVIEW
        </h3>

        <h1 className="w-full max-w-[1046px] [font-family:'Poppins',Helvetica] font-medium text-[#222224] text-[52px] text-center tracking-[0] leading-[69px]">
          Crafting a meaningful narrative is essential for engaging
          communication.
        </h1>
      </header>

      {modules.map((module, index) => (
        <Card
          key={index}
          className="flex items-center justify-center gap-[133px] px-[100px] py-[52px] self-stretch w-full rounded-3xl overflow-hidden bg-white"
        >
          <CardContent className="p-0 flex items-center justify-center gap-[133px] w-full">
            {module.imagePosition === "left" && (
              <div className="relative w-[336px] h-[364px] rounded-[32px] overflow-hidden bg-cover bg-[50%_50%]">
                <img
                  className="absolute w-[336px] h-[364px] top-0 left-0 object-cover"
                  alt="Module illustration"
                />
              </div>
            )}

            <div className="flex flex-col w-[586px] items-start gap-6">
              <div className="flex items-center justify-center gap-2.5 px-2.5 py-1 relative self-stretch w-full">
                <h3 className="font-medium text-[#d747ea] text-xl relative flex-1 mt-[-1.00px] [font-family:'Poppins',Helvetica] tracking-[0] leading-[normal]">
                  {module.title}
                </h3>
              </div>

              <div className="flex items-center justify-center gap-2.5 px-3 py-2 relative self-stretch w-full">
                <h2 className="font-semibold text-[#222224] text-4xl relative flex-1 mt-[-1.00px] [font-family:'Poppins',Helvetica] tracking-[0] leading-[normal] whitespace-pre-line">
                  {module.headline}
                </h2>
              </div>

              <div className="flex flex-col items-start gap-2.5">
                {module.features.map((feature, featureIndex) => (
                  <Badge
                    key={featureIndex}
                    variant="secondary"
                    className="inline-flex items-center justify-center gap-3 px-[18px] py-3 bg-[#f7f7f7] rounded-[90px] hover:bg-[#f7f7f7]"
                  >
                    <span className="mt-[-1.00px] [font-family:'Open_Sans',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]">
                      {feature}
                    </span>
                  </Badge>
                ))}
              </div>

              <Button className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-[100px] [background:linear-gradient(152deg,rgba(112,119,254,1)_0%,rgba(240,126,255,1)_100%)] hover:opacity-90">
                <span className="mt-[-1.00px] [font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-white text-lg text-center tracking-[0] leading-[normal] whitespace-nowrap">
                  Learn more
                </span>
              </Button>
            </div>

            {module.imagePosition === "right" && (
              <div className="relative w-[336px] h-[364px] rounded-[32px] overflow-hidden bg-cover bg-[50%_50%]">
                <img
                  className="absolute w-[336px] h-[364px] top-0 left-0 object-cover"
                  alt="Module illustration"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

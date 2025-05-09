import { Button } from "../../NavBarByAnima/components/ui/button";
import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";

export const SectionComponentNodeByAnima = (): JSX.Element => {
  // Card data for mapping
  const cards = [
    {
      title: "Join as an Individual",
      description: "Get certified. Build your conscious portfolio.",
      imageHeight: "347px",
    },
    {
      title: "Certify Your Organization",
      description: "Lead with integrity. Build stakeholder trust.",
      imageHeight: "347px",
    },
    {
      title: "Mentor or Partner with CNESS",
      description: "Teach, guide, grow the movement.",
      imageHeight: "347px",
    },
  ];

  return (
    <section className="flex flex-col items-center gap-[52px] px-8 py-[60px] relative self-stretch w-full">
      <div className="flex flex-col items-center gap-[52px] relative self-stretch w-full">
        <header className="inline-flex flex-col items-center gap-10 relative">
          <h1 className="flex w-[818px] items-start justify-center gap-2.5 relative">
            <div className="relative flex-1 mt-[-1.00px] [font-family:'Plus_Jakarta_Sans',Helvetica] font-normal text-transparent text-[52px] text-center tracking-[0] leading-[65.3px]">
              <span className="font-semibold text-[#3a3a3a]">
                A Platform Driven by Awareness, Not Just{" "}
              </span>
              <span className="font-bold text-[#7076fe]">Rules</span>
            </div>
          </h1>
        </header>

        <div className="flex items-center gap-3 relative self-stretch w-full">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col items-start gap-2.5 p-3 relative flex-1 grow bg-white rounded-xl overflow-hidden border border-solid border-[#f1efec] backdrop-blur-[50px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)]"
            >
              <CardContent className="flex flex-col items-center gap-6 relative self-stretch w-full p-0">
                <div
                  className="relative self-stretch w-full rounded-xl bg-cover bg-[50%_50%]"
                  style={{ height: card.imageHeight }}
                />

                <div className="flex flex-col items-start justify-center gap-3 p-2 relative self-stretch w-full">
                  <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                    <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
                      <h2 className="mt-[-1.00px] font-semibold text-black text-2xl leading-8 relative self-stretch [font-family:'Open_Sans',Helvetica] tracking-[0]">
                        {card.title}
                      </h2>
                    </div>

                    <p className="font-normal text-[#6b6b6b] text-sm leading-[26px] relative self-stretch [font-family:'Open_Sans',Helvetica] tracking-[0]">
                      {card.description}
                    </p>
                  </div>

                  <Button className="inline-flex items-center justify-center gap-2.5 px-6 py-4 relative rounded-[100px] [background:linear-gradient(152deg,rgba(112,119,254,1)_0%,rgba(240,126,255,1)_100%)] [font-family:'Plus_Jakarta_Sans',Helvetica] font-medium text-white text-lg">
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

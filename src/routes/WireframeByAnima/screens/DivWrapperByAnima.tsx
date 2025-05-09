import { Avatar, AvatarImage } from "../../NavBarByAnima/components/ui/avatar";
import { Card, CardContent } from "../../NavBarByAnima/components/ui/card";

export const DivWrapperByAnima = (): JSX.Element => {
  // Testimonial data for mapping
  const testimonials = [
    {
      id: 1,
      name: "Anika Sharma",
      title: "Founder, Soulful Yoga Retreat",
      quote:
        "CNESS gave us a structure to grow with integrity. It's not just a badge — it's our internal compass.",
      backgroundUrl: "https://c.animaapp.com/magbg19buoKwc2/img/union-1.svg",
    },
    {
      id: 2,
      name: "Rishi Menon",
      title: "Head of Impact, GreenCloud Tech",
      quote:
        "\"We now know what 'conscious business' means beyond just values. CNESS operationalized it.\"",
      backgroundUrl: "https://c.animaapp.com/magbg19buoKwc2/img/union.svg",
    },
    {
      id: 3,
      name: "Anika Sharma",
      title: "Founder, Soulful Yoga Retreat",
      quote:
        "CNESS gave us a structure to grow with integrity. It's not just a badge — it's our internal compass.",
      backgroundUrl: "https://c.animaapp.com/magbg19buoKwc2/img/union-2.svg",
    },
  ];

  return (
    <section className="flex flex-col items-center gap-[72px] px-0 py-[52px] relative self-stretch w-full flex-[0_0_auto] bg-white">
      <header className="relative w-[499px]">
        <div className="flex flex-col w-[499px] items-center gap-[18px] relative">
          <h2 className="relative self-stretch mt-[-1.00px] font-['Poppins',Helvetica] font-bold text-[#6f74dd] text-lg text-center tracking-[3.15px] leading-[normal]">
            TESTIMONIALS
          </h2>
          <h1 className="relative self-stretch font-['Poppins',Helvetica] font-bold text-[#1e1e1e] text-[52px] text-center tracking-[0] leading-[normal]">
            Our Client Reviews
          </h1>
        </div>
      </header>

      <div className="flex items-center justify-center gap-[39px] relative self-stretch w-full flex-[0_0_auto]">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="relative w-[370px] h-[506px]">
            <div className="relative h-[506px]">
              <div className="absolute w-[370px] h-[506px] top-0 left-0">
                <div className="relative w-[400px] h-[556px] left-[-13px]">
                  <img
                    className="absolute w-[400px] h-[480px] top-[76px] left-0 object-cover"
                    alt="Testimonial background"
                  />
                  <img
                    className="absolute w-[370px] h-[476px] top-0 left-[13px] object-cover"
                    alt="Testimonial foreground"
                  />
                </div>
              </div>

              <Card
                className={`absolute w-[334px] h-[239px] top-[219px] left-[${testimonial.id === 1 ? "18" : "33"}px] bg-[url(${testimonial.backgroundUrl})] bg-[100%_100%] border-none shadow-none`}
              >
                <div className="absolute w-[50px] h-[55px] top-2 left-[142px]">
                  <div className="relative w-[76px] h-[76px] -top-2 left-[-13px] bg-cover bg-[50%_50%]">
                    <Avatar className="absolute w-[50px] h-[50px] top-2 left-[13px]">
                      <AvatarImage src="" alt={testimonial.name} />
                    </Avatar>
                  </div>
                </div>

                <CardContent
                  className={`flex flex-col w-[252px] items-center gap-[21px] absolute top-[${testimonial.id === 3 ? "90" : "71"}px] left-[42px] p-0`}
                >
                  <div className="relative w-[171px] h-11">
                    <h3 className="absolute top-0 left-[18px] font-['Poppins',Helvetica] font-semibold text-[#1e1e1e] text-lg text-center tracking-[0] leading-[normal]">
                      {testimonial.name}
                    </h3>
                    <p className="absolute top-7 left-0 opacity-60 font-['Open_Sans',Helvetica] font-normal text-[#1e1e1e] text-xs text-center tracking-[0] leading-[normal]">
                      {testimonial.title}
                    </p>
                  </div>
                  <p className="relative self-stretch opacity-80 font-['Open_Sans',Helvetica] font-normal text-[#1e1e1e] text-sm text-center tracking-[0] leading-[21px]">
                    {testimonial.quote}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

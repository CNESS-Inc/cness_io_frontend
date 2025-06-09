import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";

// Import your images (adjust the paths as needed)
import IndividualImage from "../../../assets/aware_1.jpg";
import OrganizationImage from "../../../assets/aware_2.jpg";
import MentorImage from "../../../assets/aware_3.jpg";
import { useNavigate } from "react-router-dom";

export default function AwarenessSection() {
  const navigate = useNavigate()
  const cards = [
    {
      title: "Join as an Individual",
      description: "Get certified. Build your conscious portfolio.",
      imageHeight: "347px",
      image: IndividualImage,
      altText: "Individual joining certification program",
    },
    {
      title: "Certify Your Organization",
      description: "Lead with integrity. Build stakeholder trust.",
      imageHeight: "347px",
      image: OrganizationImage,
      altText: "Organization certification process",
    },
    {
      title: "Mentor or Partner with CNESS",
      description: "Teach, guide, grow the movement.",
      imageHeight: "347px",
      image: MentorImage,
      altText: "Mentorship and partnership opportunities",
    },
  ];

  return (
    <div className="flex flex-col items-center space-y-8 p-4 md:p-8 bg-white">
      <div className="flex flex-col items-center gap-8 md:gap-[52px] relative self-stretch w-full">
        <header className="inline-flex flex-col items-center gap-6 md:gap-10 relative">
          <h1 className="flex w-full md:w-[818px] items-start justify-center gap-2.5 relative px-4">
            <div className="relative flex-1 mt-[-1.00px] jakarta font-normal text-transparent text-3xl md:text-[52px] text-center tracking-[0] leading-[1.2] md:leading-[65.3px]">
              <span className="font-semibold text-[#3a3a3a]">
                A Platform Driven by Awareness, Not Just{" "}
              </span>
              <span className="font-bold text-[#7076fe]">Rules</span>
            </div>
          </h1>
        </header>

        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-3 relative self-stretch w-full">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="flex flex-col items-start gap-2.5 p-3 relative w-full md:flex-1 grow bg-white rounded-xl overflow-hidden border border-solid border-[#f1efec] backdrop-blur-[50px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(50px)_brightness(100%)]"
            >
              <CardContent className="flex flex-col items-center gap-4 md:gap-6 relative self-stretch w-full p-0">
                <div
                  className="relative self-stretch w-full rounded-xl bg-cover bg-[50%_50%]"
                  style={{
                    height: "250px", // Fixed height for mobile
                    backgroundImage: `url(${card.image})`,
                  }}
                  aria-label={card.altText}
                />

                <div className="flex flex-col items-start justify-center gap-3 p-2 relative self-stretch w-full">
                  <div className="flex flex-col items-start gap-2 relative self-stretch w-full">
                    <div className="flex flex-col items-start gap-3 relative self-stretch w-full">
                      <h2 className="openSans mt-[-1.00px] font-semibold text-black text-xl md:text-2xl leading-7 md:leading-8 relative self-stretch openSans tracking-[0]">
                        {card.title}
                      </h2>
                    </div>

                    <p className="openSans font-normal text-[#6b6b6b] text-sm leading-[22px] md:leading-[26px] relative self-stretch openSans tracking-[0]">
                      {card.description}
                    </p>
                  </div>

                  <Button
                    variant="gradient-primary"
                    className="rounded-[100px] cursor-pointer py-3 px-8 transition-colors duration-500 ease-in-out"
                    onClick={() => navigate("/sign-up")}
                  >
                    Get Started
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

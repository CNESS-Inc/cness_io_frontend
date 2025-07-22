import "../../../App.css"
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Card, CardContent } from "../../ui/Card";

import LiamImage from "../../../assets/member-1.png";
import JenniferImage from "../../../assets/member-2.png";
import AvaImage from "../../../assets/member-3.png";
import MartinImage from "../../../assets/member-4.png";

import Badge1 from "../../../assets/badge-1.png";
import Badge2 from "../../../assets/badge-2.png";
import Badge3 from "../../../assets/badge-3.png";
import Badge4 from "../../../assets/badge-4.png";
import Badge5 from "../../../assets/badge-1.png";



export default function Team() {
  const cards = [
    {
      title: "Liam",
      SubTitle: "DEI Coach",
      description: "“CNESS helped me move from ideas to income. Now I’m guiding teams globally on inclusion and purpose.”",
      image: LiamImage,
      altText: "DEI Coach",
      badgeImage: Badge1,
    },
    {
      title: "Jennifer",
      SubTitle: "Eco Fashion Entrepreneur",
      description: "I’ve always worked consciously. But now I’m seen for it. Investors and buyers now ask about my CNESS badge.",
      image: JenniferImage,
      altText: "Eco Fashion Entrepreneur",
      badgeImage: Badge2,
    },
    {
      title: "Ava",
      SubTitle: "Podcast Host",
      description: "“Sharing reflections used to feel lonely. Now I’m part of a global stream of changemakers. I’m not alone anymore.”",
      image: AvaImage,
      altText: "Podcast Host",
      badgeImage: Badge3,
    },
    {
      title: "Martin",
      SubTitle: "DEI Coach",
      description: "“CNESS helped me move from ideas to income. Now I’m guiding teams globally on inclusion and purpose.”",
      image: MartinImage,
      altText: "DEI Coach",
      badgeImage: Badge4,
    },
    {
      title: "Liam",
      SubTitle: "DEI Coach",
      description: "“CNESS helped me move from ideas to income. Now I’m guiding teams globally on inclusion and purpose.”",
      image: LiamImage,
      altText: "DEI Coach",
      badgeImage: Badge5,
    },

  ];


  return (
    <div className="flex flex-col items-center space-y-8 py-12 px-4 bg-[#F7F7F7] team-section">
      <div className="max-w-[1336px] mx-auto w-full">
        <div className="flex flex-col items-center gap-8 md:gap-[52px] w-full">
          <div className="text-start w-full">
            <h2 className="poppins text-3xl md:text-[32px] font-semibold mb-4 leading-tight text-[#4E4E4E]">
              Proof That Consciousness Moves the World.
            </h2>
            <p className="text-[18px] text-[#64748B] font-regular openSans">Hear how CNESS helps purpose-driven professionals amplify their values and turn <br /> them into real-world change.</p>
          </div>

          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              480: { slidesPerView: 1 },
              767: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            modules={[Pagination, Autoplay]}
            className="w-full custom-swiper"
          >
            {cards.map((card, index) => (
              <SwiperSlide key={index}>
                <Card className="flex flex-col gap- mb-10 w-full rounded-[12px] overflow-hidden">
                  <CardContent className="flex flex-col w-full p-0">
                    {/* Top Image */}
                    <div
                      className="w-full bg-cover bg-center rounded-t-[12px]"
                      style={{
                        height: "250px",
                        backgroundImage: `url(${card.image})`,
                      }}
                      aria-label={card.altText}
                    />

                    {/* Content Area with Background Image */}
                    <div
                      className="flex flex-col gap-3 px-5 py-6 w-full rounded-b-[12px] bg-cover bg-center"
                    >
                      <div className="flex justify-between">
                        <div className="w-6/12">
                          <h2 className="poppins text-[16px] text-[#222224] font-semibold text-black leading-7 md:leading-8">
                            {card.title}
                          </h2>
                          <span className="openSans text-[#606060] text-[12px] font-regular text-nowrap">{card.SubTitle}</span>
                        </div>
                        <div className="badge">
                          <img
                            src={card.badgeImage}
                            alt="badge"
                            className="block w-15 h-15 object-contain"
                          />
                        </div>
                      </div>

                      <p className="openSans text-[12px] text-[#2A2A2A] font-regular leading-4 mb-2 mt-2">
                        {card.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

    </div>
  );
}

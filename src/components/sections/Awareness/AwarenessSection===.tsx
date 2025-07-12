import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { motion } from "framer-motion";
import Image from "../../ui/Image";

import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";

import IndividualImage from "../../../assets/aware_1.jpg";
import OrganizationImage from "../../../assets/aware_2.jpg";
import MentorImage from "../../../assets/aware_3.jpg";

export default function AwarenessSection() {
  const cards = [
    {
      title: "Sacred Symbols Icon Set",
      description: "100+ vector symbols with spiritual significance",
      image: IndividualImage,
      altText: "Individual joining certification program",
      button: "Add to cart",
      price: "$999",
      bg_image: "url('/product-bg-1.png')",
      badge: {
        label: "Top Rated",
        gradient: "linear-gradient(90deg, #544b40 0%, #64594b 100%)",
      },
    },
    {
      title: "Color Palettes Collection",
      description: "Curated color schemes for various design projects",
      image: OrganizationImage,
      altText: "Organization certification process",
      button: "Add to cart",
      price: "$49",
      bg_image: "url('/product-bg-2.png')",
      badge: {
        label: "New Arrival",
        gradient: "linear-gradient(90deg, #5f5a50 0%, #7f7463 100%)",
      },
    },
    {
      title: "Nature Photography Pack",
      description: "High-resolution images capturing the beauty of nature",
      image: MentorImage,
      altText: "Mentorship and partnership opportunities",
      button: "Add to cart",
      price: "$150",
      bg_image: "url('/product-bg-3.png')",
      badge: {
        label: "Trending",
        gradient: "linear-gradient(90deg, #39979c 0%, #5b898e 100%)",
      },
    },
    {
      title: "Mentor or Partner with CNESS",
      description: "Teach, guide, grow the movement.",
      image: MentorImage,
      altText: "Mentorship and partnership opportunities",
      button: "Add to cart",
      price: "$99",
      bg_image: "url('/product-bg-1.png')",
      badge: {
        label: "Trending",
        gradient: "linear-gradient(90deg, #39979c 0%, #5b898e 100%)",
      },
    },
    {
      title: "Sacred Symbols Icon Set",
      description: "100+ vector symbols with spiritual significance",
      image: IndividualImage,
      altText: "Individual joining certification program",
      button: "Add to cart",
      price: "$999",
      bg_image: "url('/product-bg-1.png')",
      badge: {
        label: "Top Rated",
        gradient: "linear-gradient(90deg, #544b40 0%, #64594b 100%)",
      },
    },
  ];

  return (
    <div className="space-y-8 py-24 px-8 bg-[#F7F7F7]">
      <div className="py-24 px-0 flex justify-between max-w-[777px] mx-auto">
        <div>
          <h3 className="poppins text-[32px] text-black font-regular">Where conscious creations</h3>
          <p className="openSans text-[#898989] font-regular text-[14px] mt-4">Explore a wide range of conscious products<br/> crafted by verified creators who prioritize<br/> sustainability and ethical practices.</p>
        </div>
        <div>
          <Image
            src="/creation.png"
            alt="Company Logo"
            width={335}
            height={96}
            className="w-14 h-14"
          />
          <h3 className="poppins bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text text-[32px] font-semibold mt-2">find their people</h3>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div className="max-w-[1336px] mx-auto">
          <div className="flex flex-col items-center gap-8 md:gap-[52px] w-full">
            <div className="text-center max-w-4xl">
              <h2 className="poppins text-3xl md:text-[32px] font-normal leading-tight">
                <span className="font-semibold bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
                  Where conscious creations{" "}
                </span>
                <span className="font-bold bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text">
                  find their people
                </span>
              </h2>
            </div>

            <Swiper
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              speed={5000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              allowTouchMove={false}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              modules={[Pagination, Navigation, Autoplay]}
              className="w-full"
            >
              {cards.map((card, index) => (
                <SwiperSlide key={index}>
                  <div className="transition-all duration-300">
                    <Card
                      className="flex flex-col h-full gap-3 w-full rounded-[12px] overflow-hidden transition-all duration-300"
                      style={{
                        transition: "filter 0.3s ease",
                      }}
                    >
                      <CardContent
                        className="flex flex-col w-full p-0"
                        style={{
                          transition: "filter 0.3s ease",
                        }}
                      >
                        <div
                          className="relative w-full bg-cover bg-center rounded-t-[12px] group-hover:brightness-110"
                          style={{
                            height: "250px",
                            backgroundImage: `url(${card.image})`,
                            filter: "brightness(1)",
                          }}
                        >
                          {card.badge && (
                            <div
                              className="absolute top-3 left-3 text-[11px] font-medium px-3 py-1 rounded-full text-white shadow-md flex items-center gap-2"
                              style={{
                                backgroundImage: card.badge.gradient,
                              }}
                            >
                              <span className="inline-block w-[6px] h-[6px] bg-[#60C750] rounded-full"></span>
                              <span className="text-[#fff] text-[11px] font-semibold">
                                {card.badge.label}
                              </span>
                            </div>
                          )}
                        </div>

                        <div
                          className="flex flex-col gap-2 px-5 py-4 w-full rounded-b-[12px] bg-cover bg-center group-hover:brightness-110"
                          style={{
                            backgroundImage: card.bg_image,
                            filter: "brightness(1) drop-shadow(0 0 10px rgba(148, 114, 255, 0.6))",
                          }}
                        >
                          <h2 className="text-[14px] font-semibold text-white leading-7 md:leading-8">
                            {card.title}
                          </h2>
                          <p className="text-[11px] text-[#ECEEF2] leading-6">
                            {card.description}
                          </p>
                          <div className="flex justify-between mt-0 items-center">
                            <p className="text-white text-[14px] font-semibold">
                              {card.price}
                            </p>
                            <Button
                              className="rounded-full py-2 px-6 bg-[#F07EFF] text-[12px] cursor-default"
                              style={{ pointerEvents: "none" }}
                            >
                              {card.button}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex max-w-[750px] w-full mx-auto mt-6">
              <p className="openSans w-6/12 text-[#898989] text-[14px] font-regular">
                Explore a wide range of conscious products
                <br />
                crafted by verified creators who prioritize
                <br />
                sustainability and ethical practices.
              </p>
              <div className="flex justify-end gap-6 w-6/12">
                <Button
                  variant="outline"
                  className="jakarta bg-white h-[42px] border-[#2222241a] px-4 sm:px-6 py-1 rounded-[100px] text-[#222224] font-medium text-[14px] w-full sm:w-auto"
                >
                  Start Selling
                </Button>
                <Button className="jakarta rounded-[100px] h-[42px] py-1 px-8 self-stretch text-[14px] bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-white">
                  Browse Marketplace
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>


  );
}

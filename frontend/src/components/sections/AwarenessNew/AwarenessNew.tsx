import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./AwarenessSection.css";
import creation1 from "../../../assets/creation1.jpg";
import creation2 from "../../../assets/creation2.jpg";
import creation3 from "../../../assets/creation3.jpg";
import creation4 from "../../../assets/creation4.png";

export default function AwarenessSection() {
  const cards = [
    {
      title: "E-books",
      description:
        "Discover our 21-day guided journaling ebook designed to help you reset your mindset and embrace a positive outlook.",
      image: creation3,
      altText: "Individual joining certification program",
      bg_image:
        "url('https://res.cloudinary.com/diudvzdkb/image/upload/w_311,h_348,c_fill,q_auto,f_auto/v1759911622/product-bg-1_y5vjzb.png')",
    },
    {
      title: "Musics",
      description:
        "Perfect for slow evenings, mindful moments, or letting your space fill with timeless groove.",
      image: creation1,
      altText: "Organization certification process",
      bg_image:
        "url('https://res.cloudinary.com/diudvzdkb/image/upload/w_311,h_348,c_fill,q_auto,f_auto/v1759911482/product-bg-2_pyjtzl.png')",
    },
    {
      title: "Podcasts",
      description:
        "From mindful talks to inspiring stories, each episode brings knowledge, clarity, and depth to your everyday listening.",
      image: creation4,
      altText:
        "Check out our 21-day guided journaling ebook, crafted to help you shift your mindset and cultivate a more positive perspective.",
      bg_image:
        "url('https://res.cloudinary.com/diudvzdkb/image/upload/w_311,h_348,c_fill,q_auto,f_auto/v1759911591/product-bg-3_jlrbrz.png')",
    },
    {
      title: "Our specially curated audio tapes.",
      description:
        "Listen to our 21-day guided journaling audio series, designed to help you transform your mindset and foster a more positive outlook.",
      image: creation2,
      altText: "Mentorship and partnership opportunities",
      bg_image:
        "url('https://res.cloudinary.com/diudvzdkb/image/upload/w_311,h_348,c_fill,q_auto,f_auto/v1759911622/product-bg-1_y5vjzb.png')",
    },
    // {
    //   title: "Library",
    //   description:
    //     "Discover our 21-day guided journaling ebook designed to help you reset your mindset and embrace a positive outlook",
    //   image:
    //     "https://res.cloudinary.com/diudvzdkb/image/upload/w_311,h_348,c_fill,q_auto,f_auto/v1759911302/library_gpys6o.webp",
    //   altText: "Individual joining certification program",
    //   bg_image:
    //     "url('https://res.cloudinary.com/diudvzdkb/image/upload/w_311,h_348,c_fill,q_auto,f_auto/v1759911622/product-bg-1_y5vjzb.png')",
    // },
  ];

  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);

  const handleMouseEnter = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleMouseLeave = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  const handleTouchStart = () => {
    swiperRef.current?.swiper?.autoplay?.stop();
  };

  const handleTouchEnd = () => {
    swiperRef.current?.swiper?.autoplay?.start();
  };

  return (
    <>
      {/* --- Second (Main) Section --- */}
      <motion.div
        key="second-load"
        className="second-load flex flex-col items-center gap-10 lg:gap-16 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 bg-[#F7F7F7]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        <div className="max-w-[1336px] mx-auto w-full">
          <div className="flex flex-col items-center gap-8 md:gap-[52px] w-full">
            <div className="text-center max-w-4xl mx-auto px-4">
              <h1
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="text-3xl md:text-[32px] font-500 leading-tight"
              >
                <span className="font-medium text-[#000000] bg-clip-text">
                  Where Conscious Creations{" "}
                </span>
                <span className="font-medium bg-linear-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                  Find Their People
                </span>
              </h1>

              <p className="mx-auto mt-3 md:mt-3 font-['Open_Sans'] font-light text-[16px] leading-6 tracking-[0px] text-[#242424] w-full md:max-w-[707px]">
                Explore a wide range of conscious products crafted by verified
                creators who
                <br />
                prioritize sustainability and ethical practices.
              </p>
            </div>

            <Swiper
              ref={swiperRef}
              className="w-full h-full"
              spaceBetween={20}
              slidesPerView={1}
              loop={true}
              speed={5000}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
              }}
              allowTouchMove={true}
              breakpoints={{
                480: { slidesPerView: 1 },
                767: { slidesPerView: 2 },
                1024: { slidesPerView: 4 },
              }}
              modules={[Pagination, Autoplay]}
            >
              {cards.map((card, index) => (
                <SwiperSlide key={index} className="h-full">
                  <div className="relative h-full">
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      className="h-full w-full"
                    >
                      <Card className="flex flex-col w-full rounded-xl overflow-hidden shadow-sm md:h-[360px] h-auto">
                        <div
                          className="relative w-full rounded-t-xl overflow-hidden"
                          style={{ height: "240px" }}
                        >
                          <img
                            src={card.image}
                            alt={card.altText}
                            width={311}
                            height={348}
                            loading="lazy"
                            className="w-full h-full object-contain rounded-t-xl"
                          />
                        </div>

                        <div className="relative grow flex flex-col">
                          <CardContent className="flex flex-col w-full p-0 h-full">
                            <div
                              className="px-5 py-4 w-full rounded-b-xl bg-cover bg-center h-full"
                              style={{
                                backgroundImage: card.bg_image,
                                marginTop: 0,
                              }}
                            >
                              <h2 className="text-[13px] sm:text-[14px] font-semibold text-white leading-6 sm:leading-7">
                                {card.title}
                              </h2>
                              <p className="font-['Open_Sans'] font-normal text-[12px] leading-[18px] text-[#ECEEF2]">
                                {card.description}
                              </p>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex flex-col md:flex-row items-center justify-between max-w-[700px] w-full mx-auto mt-10 gap-6 md:gap-4">
              <p className="lg:w-8/12 md:w-5/12 w-full font-['Open_Sans'] font-light text-[16px] leading-6 tracking-[0px] text-[#242424]">
                Showcase your products in our conscious marketplace, connect
                with the right audience, and grow your business in a
                Purpose-driven ecosystem.
              </p>
              <div className="flex justify-center md:justify-end w-full md:w-auto mt-4 md:mt-0">
                <Button
                  variant="gradient-primary"
                  className="
                    inline-flex items-center justify-center
                    rounded-[100px]
                    w-full md:w-40 h-[43px]
                    px-0 gap-[12.19px]
                    font-['Open Sans'] font-medium 
                    text-[16px] leading-[100%] tracking-[0]
                    text-white 
                  "
                  onClick={() => {
                    navigate("/cness-marketplace");
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  Become a Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* --- Bottom Section --- */}
      <div className="community-bottom bg-[url(https://res.cloudinary.com/diudvzdkb/image/upload/v1753780353/community-bg_cqdnuq.png)] bg-cover bg-center w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col items-center text-center">
        <h3
          style={{ fontFamily: "Poppins, sans-serif" }}
          className="lg:text-[32px] md:text-[32px] text-[23px] font-medium bg-linear-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3 text-center community-heading"
        >
          Connect with the trustworthy.
          <br />
          {" "}Work with the Reliable. Grow with the Dependable.
        </h3>
        <p className="font-['Open_Sans'] mt-2 lg:text-[16px] md:text-[16px] text-[16px] font-light text-[#494949] leading-6 text-center">
          On CNESS, every profile, product, and organization is aligned with
          values you can count on.
        </p>
      </div>
    </>
  );
}

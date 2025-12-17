import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Pagination as SwiperPagination } from "swiper/modules";
import carosuel1 from "../../assets/carosuel1.png";
import carosuel2 from "../../assets/carosuel2.png";
import carosuel3 from "../../assets/carosuel3.png";
import carosuel4 from "../../assets/carosuel4.png";


// Register Swiper modules
SwiperCore.use([Autoplay, SwiperPagination]);

import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    image: carosuel1,
    title: "Monetize Your Purpose and Passions for Good",
  },
  {
    id: 2,
    image: carosuel2,
    title: "Monetize Your Purpose and Passions for Good",
  },
  {
    id: 3,
    image: carosuel3,
    title: "Monetize Your Purpose and Passions for Good",
  },
  {
    id: 4,
    image: carosuel4,
    title: "Monetize Your Purpose and Passions for Good",
  },
];

const HeroCarousel = () => {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-lg flex-grow h-[408px]">
      <Swiper
        loop
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 z-10 text-white space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold max-w-xl leading-snug">
                  {slide.title}
                </h2>
                <button className="bg-transparent border border-white text-white px-6 py-2 rounded-full font-semibold inline-flex items-center gap-2 hover:bg-white hover:text-black transition">
                  Become a Seller
                  <span className="text-lg">›</span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Floating Icon Panel 
      <div className="absolute top-1/2 -translate-y-1/2 right-[-28px] z-20 hidden sm:flex flex-col items-center space-y-3 bg-white p-3 rounded-xl shadow-xl">
        <Music className="text-purple-500 w-5 h-5" />
        <Video className="text-purple-500 w-5 h-5" />
        <Mic className="text-purple-500 w-5 h-5" />
        <Book className="text-purple-500 w-5 h-5" />
        <Tv className="text-purple-500 w-5 h-5" />
      </div>*/}
    </div>
  );
};

export default HeroCarousel;

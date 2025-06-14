import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Pagination as SwiperPagination } from "swiper/modules";
import carosuel1 from "../../assets/carosuel1.png";
import carosuel2 from "../../assets/carosuel2.png";
import carosuel3 from "../../assets/carosuel3.png";
import carosuel4 from "../../assets/carosuel4.png";


// Register Swiper modules
SwiperCore.use([Autoplay, SwiperPagination]);

// Swiper styles (import globally OR use custom declarations if TS complains)
import "swiper/css";
import "swiper/css/pagination";

const heroSlides = [
  {
    id: 1,
    image: carosuel1, // Replace with your animated/static image
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
    <div className="w-[833px] h-[408px] rounded-[12px] overflow-hidden shadow-lg">
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
              <div className="absolute bottom-6 left-6 z-10 text-white space-y-5">
                <h2 className="text-2xl md:text-3xl font-bold max-w-xl">
                  {slide.title}
                </h2>
<button className="bg-transparent border border-white text-white px-8 py-2 rounded-full font-semibold inline-flex items-center gap-4 hover:bg-transparent transition">
  Become a Seller 
  <span className="text-xl">›</span>
</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;

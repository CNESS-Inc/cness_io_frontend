import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "../../ui/Image";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import IndividualImage from "../../../assets/aware_1.jpg";
import OrganizationImage from "../../../assets/aware_2.jpg";
import MentorImage from "../../../assets/aware_3.jpg";

// Add shimmer effect CSS
import './AwarenessSection.css';

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

  // Use a single isFlashing state for all cards
  const [isFlashing, setIsFlashing] = useState(false);
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setIsFlashing(true);
      timeout = setTimeout(() => setIsFlashing(false), 60); // super fast flash
    }, 300); // flash every 0.3s
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  // Transition logic for first-load/second-load
  const [showSecond, setShowSecond] = useState(false);
  const [startTransition, setStartTransition] = useState(false);
  const firstLoadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // IntersectionObserver to trigger transition
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !startTransition) {
          setStartTransition(true);
          setTimeout(() => setShowSecond(true), 5000); // 5s delay before transition
        }
      },
      { threshold: 0.5 }
    );
    if (firstLoadRef.current) observer.observe(firstLoadRef.current);
    return () => observer.disconnect();
  }, [startTransition]);

  // First-load image slider state
  const [currentImg, setCurrentImg] = useState(0);
  const [sliderDone, setSliderDone] = useState(false);

  // Play slider images in sequence, crossfade only
  useEffect(() => {
    if (!startTransition) return;
    if (sliderDone) return;
    if (currentImg < firstLoadImages.length - 1) {
      const t = setTimeout(() => setCurrentImg(i => i + 1), 2200); // 1.5s visible + 0.7s fade
      return () => clearTimeout(t);
    } else {
      // Last image: after delay, mark slider done and trigger second-load
      const t = setTimeout(() => setSliderDone(true), 2200);
      return () => clearTimeout(t);
    }
  }, [currentImg, startTransition, sliderDone]);

  // When slider is done, trigger second-load after a short delay
  useEffect(() => {
    if (sliderDone) {
      setTimeout(() => setShowSecond(true), 1500); // 0.4s overlap for smoothness
    }
  }, [sliderDone]);

  // First-load slider images
  const firstLoadImages = [
    { src: "/creation1.png", alt: "Company Logo 1" },
    { src: "/creation2.png", alt: "Company Logo 2" },
    { src: "/creation3.png", alt: "Company Logo 3" },
  ];

  return (
    <>
      <AnimatePresence>
        {!showSecond && (
          <motion.div
            ref={firstLoadRef}
            key="first-load"
            className="first-load flex flex-col items-center space-y-8 lg:py-24 py-15 px-4 bg-[#F7F7F7]"
            style={{ position: 'relative', zIndex: 2 }}
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div className="py-24 px-0 flex lg:flex-row flex-col justify-between max-w-[800px] w-full mx-auto">
              <div>
                <h3 className="poppins text-[32px] text-black font-regular">Where conscious creations</h3>
                <p className="openSans text-[#898989] font-regular text-[14px] mt-4">Explore a wide range of conscious products<br /> crafted by verified creators who prioritize<br /> sustainability and ethical practices.</p>

              </div>
              <div className="flex flex-col lg:items-center items-start justify-start relative ">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImg}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for premium smoothness
                    }}
                    className="relative"
                  >
                    <Image
                      src={firstLoadImages[currentImg].src}
                      alt={firstLoadImages[currentImg].alt}
                      width={335}
                      height={96}
                      className="w-14 h-14 lg:mt-0 mt-4"
                    />
                  </motion.div>
                </AnimatePresence>
                <h3 className="poppins text-start bg-gradient-to-r from-[#6340FF] to-[#D748EA] text-transparent bg-clip-text text-[32px] font-semibold mt-2">find their people</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSecond && (
          <motion.div
            key="second-load"
            className="second-load flex flex-col items-center space-y-8 lg:py-24 py-15 px-4 bg-[#F7F7F7]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div className="max-w-[1336px] mx-auto w-full">
              <div className="flex flex-col items-center gap-8 md:gap-[52px] w-full">
                <div className="text-center max-w-4xl">
                  <h1 className="jakarta text-3xl md:text-[32px] font-normal leading-tight">
                    <span className="font-semibold bg-gradient-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text">
                      Where conscious creations{" "}
                    </span>
                    <span className="font-bold bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                      find their people
                    </span>
                  </h1>
                </div>

                <Swiper
                  className="w-full h-full"  // 👈 ensures swiper container is full height
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
                    480: { slidesPerView: 1 },
                    767: { slidesPerView: 2 },
                    1024: { slidesPerView: 4 },
                  }}
                  modules={[Pagination, Navigation, Autoplay]}
                >
                  {cards.map((card, index) => (
                    <SwiperSlide key={index} className="h-full"> {/* 👈 make slide full height */}
                      <div className="relative h-full">
                        <Card className="flex flex-col md:h-[350px] h-full w-full rounded-[12px] overflow-hidden">
                          {/* Image section */}
                          <div
                            className="relative w-full rounded-t-[12px] overflow-hidden"
                            style={{ height: "200px" }} // 👈 fixed image height
                          >
                            <img
                              src={card.image}
                              alt={card.altText}
                              className="w-full h-full object-cover rounded-t-[12px]"
                            />
                            {card.badge && (
                              <div
                                className="absolute top-3 left-3 text-[11px] font-medium px-3 py-1 rounded-full text-white shadow-md flex items-center gap-2"
                                style={{ backgroundImage: card.badge.gradient }}
                              >
                                <span className="inline-block w-[6px] h-[6px] bg-[#60C750] rounded-full"></span>
                                <span className="text-[#fff] text-[11px] font-semibold">{card.badge.label}</span>
                              </div>
                            )}
                          </div>

                          {/* Flash effect + content */}
                          <div className="card-flash-area relative flex-grow flex flex-col">
                            {isFlashing && <span className="flash-blink-effect" />}
                            <CardContent className="flex flex-col w-full p-0 h-full">
                              <div
                                className="flex flex-col gap-2 px-5 py-4 w-full rounded-b-[12px] bg-cover bg-center h-full"
                                style={{ backgroundImage: card.bg_image, marginTop: 0 }}
                              >
                                <h2 className="text-[14px] font-semibold text-white leading-7 md:leading-8">
                                  {card.title}
                                </h2>
                                <p className="text-[11px] text-[#ECEEF2] leading-6">
                                  {card.description}
                                </p>
                                <div className="flex justify-between mt-auto items-center">
                                  <p className="text-white text-[14px] font-semibold">
                                    {card.price}
                                  </p>
                                  <Button
                                    className="rounded-full w-fit font-regular py-2 px-6 bg-[#F07EFF] text-[12px] cursor-default"
                                    style={{ pointerEvents: "none" }}
                                  >
                                    <p className="text-[12px] font-normal">{card.button}</p>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>


                <div className="flex lg:flex-row md:flex-row flex-col max-w-[750px] w-full mx-auto mt-6">
                  <p className="lg:w-6/12 md:w-5/12 w-full text-[#898989] text-[14px] font-regular">
                    Explore a wide range of conscious products
                    <br />
                    crafted by verified creators who prioritize
                    <br />
                    sustainability and ethical practices.
                  </p>
                  <div className="flex justify-end md:gap-6 gap-2 lg:w-6/12 md:w-7/12 w-full lg:-mt-0 md:mt-0 mt-4">
                    <Button
                      variant="outline"
                      className="bg-white h-[42px] border-[#2222241a] md:px-4 px-1 sm:px-6 py-1 rounded-[100px] text-[#222224] font-medium md:text-[14px] text-[12px] lg:w-full md:w-full w-[40%]  "
                    >
                      Start Selling
                    </Button>
                    <Button className="rounded-[100px] h-[42px] py-1 md:px-4 px-1 lg:w-full md:w-full w-[60%] self-stretch md:text-[14px] text-[12px] bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-white">
                      Browse Marketplace
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import LottieOnView from "../../ui/LottieOnView";
import { useNavigate } from "react-router-dom";

// Add shimmer effect CSS
import './AwarenessSection.css';

export default function AwarenessSection() {
  const cards = [
    {
      title: "E Books",
      description: "Discover our 21-day guided journaling ebook designed to help you reset your mindset and embrace a positive outlook.",
      image: 'https://cdn.cness.io/ebooks.webp',
      altText: "Individual joining certification program",
      //button: "Add to cart",
      //price: "$999",
      bg_image: "url('/product-bg-1.png')", 
      //badge: {
       // label: "Top Rated",
        //gradient: "linear-gradient(90deg, #544b40 0%, #64594b 100%)",
      //},
    },
    {
      title: "Digital Books",
      description: "Join our 21-day guided journaling webinar to refresh your mindset and cultivate positivity.",
      image: 'https://cdn.cness.io/digitalbooks.webp',
      altText: "Organization certification process",
      //button: "Add to cart",
      //price: "$49",
      bg_image: "url('/product-bg-2.png')",
      //badge: {
        //label: "New Arrival",
        //gradient: "linear-gradient(90deg, #5f5a50 0%, #7f7463 100%)",
      //},
    },
    {
      title: "Library",
      description: "High-resolution images capturing the beauty of nature",
      image: 'https://cdn.cness.io/library.webp',
      altText: "Check out our 21-day guided journaling ebook, crafted to help you shift your mindset and cultivate a more positive perspective.",
      //button: "Add to cart",
      //price: "$150",
      bg_image: "url('/product-bg-3.png')",
      //badge: {
        //label: "Trending",
        //gradient: "linear-gradient(90deg, #39979c 0%, #5b898e 100%)",
      //},
    },
    {
      title: "Our specially curated audio tapes.",
      description: "Listen to our 21-day guided journaling audio series, designed to help you transform your mindset and foster a more positive outlook.",
      image: 'https://cdn.cness.io/audiotapes.webp',
      altText: "Mentorship and partnership opportunities",
      //button: "Add to cart",
      //price: "$99",
      bg_image: "url('/product-bg-1.png')",
      //badge: {
        //label: "Trending",
        //gradient: "linear-gradient(90deg, #39979c 0%, #5b898e 100%)",
      //},
    },
    {
      title: "Library",
      description: "Discover our 21-day guided journaling ebook designed to help you reset your mindset and embrace a positive outlook",
      image: 'https://cdn.cness.io/library.webp',
      altText: "Individual joining certification program",
      //button: "Add to cart",
      //price: "$999",
      bg_image: "url('/product-bg-1.png')",
      //badge: {
        //label: "Top Rated",
        //gradient: "linear-gradient(90deg, #544b40 0%, #64594b 100%)",
      //},
    },
  ];

  // Use a single isFlashing state for all cards
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


  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("https://cnessioassets.project-69e.workers.dev/Rectangle-blink.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load Lottie JSON:", err));
  }, []);

  return (
    <>
      <AnimatePresence>
        {!showSecond && (
          <motion.div
            ref={firstLoadRef}
            key="first-load"
           className="first-load min-h-[960px] md:min-h-[1040px] lg:min-h-[1160px] flex flex-col items-center space-y-8 lg:py-24 py-15 px-4 bg-[#F7F7F7]"
            style={{ position: 'relative', zIndex: 2 }}
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div className="py-24 px-0 flex lg:flex-row flex-col items-center justify-between min-h-[720px] max-w-[1000px] w-full mx-auto">
              <div className="lg:w-6/12">
                <h3 style={{ fontFamily: "Poppins, sans-serif" }}
                className=" leading-9 text-[32px] text-black font-500">Where conscious creations</h3>
                <p className="openSans text-[#898989] font-regular text-[14px] mt-4">Explore a wide range of conscious products<br /> crafted by verified creators who prioritize<br /> sustainability and ethical practices.</p>

              </div>
              <div className="flex lg:w-6/12 flex-col lg:items-center items-start justify-start relative ">
                <AnimatePresence mode="wait">
                   <LottieOnView
                      animationData={animationData}
                      loop
                      style={{width:'100%', height:'100%'}}
                    />
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
            className="second-load h-[900px] flex flex-col items-center space-y-8 lg:py-24 py-15 px-4 bg-[#F7F7F7]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          >
            <div className="max-w-[1336px] mx-auto w-full">
              <div className="flex flex-col items-center gap-8 md:gap-[52px] w-full">
    <div className="text-center max-w-4xl mx-auto px-4">
                  <h1 style={{ fontFamily: "Poppins, sans-serif" }}
                  className="text-3xl md:text-[32px] font-500 leading-tight">
                    <span className="font-medium text-[#000000] bg-clip-text">
                      Where Conscious Creations{" "}
                    </span>
                    <span className="font-medium bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text">
                      Find Their People
                    </span>
                  </h1>

<p
        className="
          mx-auto mt-3 md:mt-3
          text-[#898989] text-[18px] leading-[27px] font-normal
          w-full md:max-w-[707px]
        "
      >
  Explore a wide range of conscious products crafted by verified creators who
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
                          <Card className="flex flex-col md:h-[408px] h-full w-full rounded-[12px] overflow-hidden">
                            <div
                              className="relative w-full rounded-t-[12px] overflow-hidden"
                              style={{ height: "290px" }}
                            >
                              <img
                                src={card.image}
                                alt={card.altText}
                                className="w-full h-full object-cover rounded-t-[12px]"
                              />
                             {/* {card.badge && (
                                <div
                                  className="absolute top-3 left-3 text-[11px] font-medium px-3 py-1 rounded-full text-white shadow-md flex items-center gap-2"
                                  style={{ backgroundImage: card.badge.gradient }}
                                >
                                  <span className="inline-block w-[6px] h-[6px] bg-[#60C750] rounded-full"></span>
                                  <span className="text-[#fff] text-[11px] font-semibold">{card.badge.label}</span>
                                </div>
                              )}*/}
                            </div>

                            <div className="relative flex-grow flex flex-col">
                              <CardContent className="flex flex-col w-full p-0 h-full">
                                <div
                                  className="flex flex-col gap-2 px-5 py-4 w-full rounded-b-[12px] bg-cover bg-center h-full"
                                  style={{ backgroundImage: card.bg_image, marginTop: 0 }}
                                >
                                  <h2 className="text-[14px] font-semibold text-white leading-7 md:leading-8">
                                    {card.title}
                                  </h2>
                                 <p className="font-['Open_Sans'] font-normal text-[12px] leading-[18px] text-[#ECEEF2]">
  {card.description}
</p>
                                  {/* <div className="flex justify-between mt-auto items-center">
                                    <p className="text-white text-[14px] font-semibold">
                                      {card.price}
                                    </p>
                                    <Button
                                      className="rounded-full w-fit py-2 px-6 bg-[#F07EFF] text-[12px] cursor-default"
                                      style={{ pointerEvents: "none" }}
                                    >
                                      <p className="text-[12px]">{card.button}</p>
                                    </Button>
                                  </div>*/}
                                </div>
                              </CardContent>
                            </div>
                          </Card>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className="flex lg:flex-row md:flex-row flex-col max-w-[550px] w-full mx-auto mt-0">
                  <p className="lg:w-8/12 md:w-5/12 w-full text-[#898989] text-[18px] font-regular">
                    Showcase your products in our conscious
  <br />
marketplace, connect with the right
<br />
audience, and grow your business in a
<br />
purpose-driven ecosystem.          

                  </p>
                  <div className="flex lg:justify-end justify-start md:gap-6 gap-2 lg:w-4/12 md:w-7/12 w-full lg:-mt-0 md:mt-0 mt-4">
                    {/*<Button
                      variant="outline"
                      className="bg-white awareness-btn w-fit h-[42px] border-[#2222241a] md:px-4 px-1 sm:px-6 py-1 rounded-[100px] text-[#222224] font-medium md:text-[14px] text-[12px] lg:w-full md:w-full"
                      onClick={() => navigate("/comingSoon")}>
                      Start Selling
                    </Button>*/}
                   <Button
  variant="gradient-primary"
  className="
    inline-flex items-center justify-center
    rounded-[100px]
    w-full md:w-[157px] h-[43px]
    px-0 gap-[12.19px]
    font-['Open Sans'] font-normal
    text-[16px] leading-[100%] tracking-[0]
    text-white
  "
  onClick={() => navigate('/comingSoon')}
>
  Become a Seller
</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          
        )}
          {/* Bottom Section */}
      <div className="community-bottom m-0 bg-[url(https://res.cloudinary.com/diudvzdkb/image/upload/v1753780353/community-bg_cqdnuq.png)] w-full lg:px-8 md:px-8 px-4 py-16 flex justify-center items-center flex-col bg-cover bg-center">
        <h3 style={{ fontFamily: "Poppins, sans-serif" }}
        className="lg:text-[32px] md:text-[32px] text-[23px] font-medium bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3 text-center community-heading">
          Connect with the trustworthy. Work with the <br />Reliable. Grow with the Dependable.
        </h3>
        <p className="openSans mt-2 lg:text-[18px] md:text-[16px] text-[14px] font-[400] text-[#494949] text-center">
          On CNESS, every profile, product, and organization is aligned with values you can count on.
        </p>
      </div>
      </AnimatePresence>
    </>
  );
}

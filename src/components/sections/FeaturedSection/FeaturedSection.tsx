import { useEffect, useRef, useState } from "react";
import OptimizeImage from "../../ui/OptimizeImage";

const thumbnails = [
  { src: "/featured-1.png", alt: "featured 1" },
  { src: "/featured-2.png", alt: "featured 2" },
  { src: "/featured-3.png", alt: "featured 3" },
  { src: "/featured-4.png", alt: "featured 4" },
  { src: "/featured-5.png", alt: "featured 5" },
  { src: "/featured-6.png", alt: "featured 6" },
];

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); 
  const [imagesIn, setImagesIn] = useState(0); 
  const [imagesMove, setImagesMove] = useState(false); 
  const [animationComplete, setAnimationComplete] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current && !animationComplete) {
          triggered.current = true;
          startSequence();
        }
      },
      { threshold: 0.3 }
    );
    
    if (sectionRef.current) observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, [animationComplete]);

  const startSequence = () => {
    setStep(1);
    
    // Faster step transitions
    setTimeout(() => setStep(2), 300);
    setTimeout(() => setStep(3), 600);
    
    setTimeout(() => {
      setStep(4);
      
      // Show all images faster with reduced delays
      let visibleCount = 0;
      const imageInterval = setInterval(() => {
        if (visibleCount < thumbnails.length) {
          setImagesIn(visibleCount + 1);
          visibleCount++;
        } else {
          clearInterval(imageInterval);
          
          // Faster move animation
          setTimeout(() => {
            setImagesMove(true);
            
            // Mark as complete and don't reset
            setTimeout(() => {
              setAnimationComplete(true);
            }, 800);
          }, 800);
        }
      }, 150);
    }, 600); 
  };

  const heading = (
    <h2 
      style={{ fontFamily: "Poppins, sans-serif" }}
      className="poppins featured-heading lg:text-[42px] md:text-[42px] text-[28px] font-medium bg-linear-to-b from-[#4E4E4E] to-[#232323] text-transparent bg-clip-text overflow-x-hidden"
    >
      Share Your Voice with a <br />
      Supportive{" "}
      <span
        className={
          step >= 1
            ? "bg-linear-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text transition-all duration-500"
            : "text-[#232323] transition-all duration-500"
        }
      >
        Community.
      </span>
    </h2>
  );

  return (
    <section className="bg-white px-4 sm:px-6 pb-8 sm:pb-12 lg:py-[72px] pt-10" ref={sectionRef}>
      <div className="max-w-[1336px] mx-auto relative h-[600px]">
        <div className="w-full text-center absolute lg:top-[50%] md:top-[35%] top-[30%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
          {heading}
        </div>

        <div className="w-full h-full flex absolute top-0 left-0 pointer-events-none">
          {thumbnails.map((thumb, i) => {
            const pos = [
              "absolute top-0 left-0",
              "absolute top-0 left-1/2 -translate-x-1/2",
              "absolute top-0 right-0",
              "absolute lg:bottom-1/2 md:bottom-1/2 bottom-65 lg:left-20 left-0 lg:translate-y-1/2 md:translate-y-1/2",
              "absolute lg:bottom-0 md:bottom-45 bottom-65 left-1/2 -translate-x-1/2",
              "absolute lg:bottom-0 md:bottom-45 bottom-65 right-0",
            ][i];
            
            return (
              <div
                key={thumb.src}
                className={
                  `${pos} transition-all duration-300 ease-in-out ` +
                  (step < 4
                    ? "opacity-0 scale-90"
                    : imagesIn > i && !imagesMove
                    ? "opacity-100 scale-105"
                    : imagesMove
                    ? `opacity-100 -rotate-45`
                    : "opacity-0 scale-90")
                }
                style={{ 
                  zIndex: 2, 
                  transitionDelay: animationComplete ? "0s" : `${i * 0.05}s` 
                }}
              >
                <OptimizeImage
                  src={thumb.src}
                  alt={thumb.alt}
                  width={117}
                  height={117}
                  className="w-[117px] h-[117px] rounded-xl thumb-img"
                />
              </div>
            );
          })}
        </div>

        <div
          className={
            `absolute bottom-0 left-0 transition-all duration-500 ease-in-out z-20 lg:mt-0 md:mt-0 mt-4 ` +
            (step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8")
          }
        >
          <h5 className="poppins font-medium text-[18px] mb-2">
            Go live. Share your voice. Be seen by the conscious world.
          </h5>
          <p className="font-['Open_Sans'] font-light text-[16px] leading-6 tracking-[0px] text-[#242424]">
            Host Live Talks. Stream Music. Share Reflections. Submit Your Content <br className="lg:block md:block hidden" />
            To Be Featured On AriOme — Our Curated Stream Of Purpose-Led <br className="lg:block md:block hidden" />
            Creators, Artists, And Changemakers.
          </p>
        </div>
      </div>
    </section>
  );
}
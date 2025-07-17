import React, { useState, useEffect, useRef } from 'react';
import './Community.css';
import Image from "../../ui/Image";

// Background cards
const backgroundCards = [
  { id: 1, type: 'image', src: '/community-1.png', alt: 'Community Feature 1' },
  { id: 2, type: 'image', src: '/community-2.png', alt: 'Community Feature 2' },
  { id: 3, type: 'image', src: '/community-3.png', alt: 'Community Feature 3' },
  { id: 4, type: 'image', src: '/community-4.png', alt: 'Community Feature 4' },
  { id: 5, type: 'image', src: '/community-5.png', alt: 'Community Feature 5' },
  { id: 6, type: 'image', src: '/community-6.png', alt: 'Community Feature 6' },
  { id: 7, type: 'image', src: '/community-7.png', alt: 'Community Feature 7' }
];

// Images for steps
const desktopStepImages = [
  '/step-1.png',
  '/step-2.jpg',
  '/step-3.jpg',
  '/step-4.jpg'
];
const tabletStepImages = [
  '/step-1-tablet.png',
  '/step-2.jpg',
  '/step-3.jpg',
  '/step-4.jpg'
];

const mobileStepImages = [
  '/step-1-mobile.png',
  '/step-2.jpg',
  '/step-3.jpg',
  '/step-4.jpg'
];

const Community: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const startAnimation = () => {
      setIsVisible(true);
      setTimeout(() => {
        animateSteps();
      }, 1000);
    };
    startAnimation();
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const animateSteps = () => {
    const stepDuration = 3000;
    const totalSteps = 4;
    const runStep = (step: number) => {
      setCurrentStep(step);

      if (step === 3) {
        setTimeout(() => setCardsVisible(true), 500);
      } else {
        setCardsVisible(false);
      }

      animationRef.current = setTimeout(() => {
        runStep((step + 1) % totalSteps);
      }, stepDuration);
    };
    runStep(0);
  };

  const getImageStepClass = (step: number) => {
    if (step === 0) return 'step-1';
    if (step === 1) return 'step-2';
    if (step === 2) return 'step-4';
    if (step === 3) return 'step-3';
    return 'step-4';
  };

  const [stepImages, setStepImages] = useState<string[]>(desktopStepImages);

  useEffect(() => {
    const updateImages = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setStepImages(mobileStepImages);     // Mobile: <768px
      } else if (width < 1024) {
        setStepImages(tabletStepImages);     // Tablet: 768px–1023px
      } else {
        setStepImages(desktopStepImages);    // Desktop: ≥1024px
      }
    };

    updateImages();
    window.addEventListener('resize', updateImages);
    return () => window.removeEventListener('resize', updateImages);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`community-section ${isVisible ? 'animate-in' : ''}`}
    >
      <div className="community-header">
        <h2 className="poppins text-[32px] font-[600] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3 w-fit mx-auto">
          A Community Built Around
          <span className="bg-gradient-to-r from-[#7077FE] to-[#9747FF] text-transparent bg-clip-text"> Conscious Living</span>
        </h2>
        <p className="openSans text-[#64748B] text-[18px] text-center w-fit mx-auto">
          Whether you're here to grow your career, share your passion, or simply<br />
          connect with others who care — CNESS gives you a space to belong, be<br />
          seen, and evolve together.
        </p>
      </div>

      <div className="animation-container">
        {/* Background Cards */}
        <div className="background-cards">
          {backgroundCards.map((card, index) => (
            <div
              key={card.id}
              className={`background-card bg-card-${index + 1} ${cardsVisible ? 'visible' : 'fade-out'}`}
            >
              <div className="bg-card-content">
                <div className="bg-card-icon">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    width={'100%'}
                    height={'100%'}
                    className="bg-card-image"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Community Image */}
        <div className={`main-image-container ${getImageStepClass(currentStep)}`}>
          {/* <h2>1 Million Conscious Professionals by 2030</h2> */}
          <Image
            src={stepImages[currentStep]}
            alt={`Community Step ${currentStep + 1}`}
            width={'100%'}
            height={'100%'}
            className="main-community-image"
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="community-bottom m-0 bg-[url(/community-bg.png)] w-full lg:px-8 md:px-8 px-4 py-12 flex justify-center items-center flex-col bg-cover bg-center">
        <h3 className="poppins lg:text-[32px] md:text-[32px] text-[23px] font-[600] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3 text-center community-heading">
          Connect with the trustworthy. Work with the <br />reliable. Grow with the Dependable.
        </h3>
        <p className="openSans mt-2 lg:text-[18px] md:text-[16px] text-[14px] font-[400] text-[#494949] text-center">
          On CNESS, every profile, product, and organization is aligned with values you can count on.
        </p>
      </div>
    </section>
  );
};

export default Community;

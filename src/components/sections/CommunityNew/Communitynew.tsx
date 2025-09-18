import React, { useState, useEffect, useRef } from 'react';
import './Communitynew.css';
import Image from "../../ui/Image";

// Background cards
const backgroundCards = [
  { id: 1, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779752/community-1_lfhqfv.png', alt: 'Community Feature 1' },
  { id: 2, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779752/community-2_eshhqq.png', alt: 'Community Feature 2' },
  { id: 3, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779752/community-3_zyj6ua.png', alt: 'Community Feature 3' },
  { id: 4, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779752/community-4_fg6svu.png', alt: 'Community Feature 4' },
  { id: 5, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779753/community-5_xbtjdi.png', alt: 'Community Feature 5' },
  { id: 6, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779753/community-6_eezcrn.png', alt: 'Community Feature 6' },
  { id: 7, type: 'image', src: 'https://res.cloudinary.com/diudvzdkb/image/upload/v1753779753/community-7_ezfjjb.png', alt: 'Community Feature 7' }
];

// Images for steps
const desktopStepImages = [
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp'
];
const tabletStepImages = [
 'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp'
];
const mobileStepImages = [
 'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp',
  'https://cdn.cness.io/Frame%202121453477.webp'
];

const Communitynew: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    const stepDuration = 1500; // 🔥 Faster speed here (was 2000)
    const totalSteps = 4;
    const runStep = (step: number) => {
      setCurrentStep(step);

      if (step === 3) {
        setTimeout(() => setCardsVisible(true), 300); // quicker card appearance
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
    //if (step === 0) return 'step-1';
    if (step === 2) return 'step-4';
    if (step === 3) return 'step-3';
    return 'step-4';
  };

  const [stepImages, setStepImages] = useState<string[]>(desktopStepImages);

  useEffect(() => {
    const isMacSafari =
      navigator.userAgent.includes('Macintosh') &&
      navigator.userAgent.includes('Safari') &&
      !navigator.userAgent.includes('Chrome');
    const updateImages = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setStepImages(mobileStepImages);
      } else if (width < 1024) {
        setStepImages(tabletStepImages);
      } else {
        setStepImages(desktopStepImages);
      }
    };
    if (isMacSafari) {
      document.body.classList.add('mac-safari');
    }
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
        <h2 style={{ fontFamily: "Poppins, sans-serif" }}
        className="poppins lg:leading-16 md:leading-14 leading-9 text-[32px] font-[500] bg-gradient-to-b from-[#4E4E4E] to-[#232323] 
               text-transparent bg-clip-text mb-3 w-fit mx-auto">
          A Community Built Around
          <span className="bg-gradient-to-r from-[#a545f4] to-[#B646F1] text-transparent bg-clip-text"> Conscious Living</span>
        </h2>
        <p className="openSans font-[300] text-[16px] leading-[24px] tracking-[0px] text-[#64748B] text-center w-fit mx-auto">
          Whether you're here to grow your career, share your passion, or simply<br />
          connect with others who care — CNESS gives you a space to belong, be<br />
          seen, and evolve together.
        </p>
      </div>

      <div className="animation-container relative w-full h-[600px] lg:h-[700px]">
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
        <div
          className={`main-image-container absolute inset-0 flex items-center justify-center z-10 ${getImageStepClass(currentStep)}`}
        >
          <Image
            src={stepImages[currentStep]}
            alt={`Community Step ${currentStep + 1}`}
            width={'100%'}
            height={'100%'}
            className="main-community-image object-cover"
          />
        </div>
      </div>

    
    </section>
  );
};

export default Communitynew;

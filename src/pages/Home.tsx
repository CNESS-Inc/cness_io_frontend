import AwarenessNew from "../components/sections/AwarenessNew";
import JoiningSection from "../components/sections/Joiningsection";
import MobileSection from "../components/sections/MobileSection";
import SocialMedia from "../components/sections/SocialMedia";
// import Stepper from "../components/sections/Stepper";
import Community from "../components/sections/CommunityNew";
import Highlight from "../components/sections/Highlight";
 import Footer from "../layout/Footer/Footer";
import Header from "../layout/Header";
import HeroSection from "../components/sections/HerosectionNew";
import Certification from "../components/sections/Certification";
// import Team from "../components/sections/Team";
import FeaturedSection from "../components/sections/FeaturedSection";
import LazySection from "../components/ui/LazySection";
import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";

const Home = () => {
  return (
    <>  
      <Header />    
      <LazySection effect="fade-up" delay={0.2}>
        <HeroSection />
      </LazySection>
      <LazySection effect="fade-up" delay={0.1}>
        <Highlight />
      </LazySection>
      <LazySection effect="fade-up" delay={0.1}>
        <SocialMedia />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <FeaturedSection/>
      </LazySection>
      <LazySection effect="fade-up" delay={0.1} className="belowFold">
        <MobileSection />
      </LazySection>
      <LazySection effect="fade-up" delay={0.1} className="belowFold">
        <Community />
      </LazySection>
      {/* <Stepper /> */}
      <LazySection effect="fade-up" delay={0.3} className="belowFold">
        <AwarenessNew />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2} className="belowFold">
        <Certification />
      </LazySection>
      {/* <LazySection effect="fade-up" delay={0.1}>
        <Team />
      </LazySection> */}
      <LazySection effect="fade-up" delay={0.2} className="belowFold">
        <JoiningSection />
      </LazySection>
       <LazySection effect="fade-up" delay={0.2} className="belowFold">
        <GetInTouch />
      </LazySection> 
      {/* <LazySection effect="fade-up" delay={0.2}>
        <Subscribe />
      </LazySection>*/}
      <Footer/>
    </>
  );
};

export default Home;

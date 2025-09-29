import Highlight from "../components/sections/Highlight";
import Footer from "../layout/Footer/Footer";
import Header from "../layout/Header";
import HeroSection from "../components/sections/HerosectionNew";
import React from "react";
import LazySection from "../components/ui/LazySection";
const SocialMedia = React.lazy(() => import("../components/sections/SocialMedia"));
const FeaturedSection = React.lazy(() => import("../components/sections/FeaturedSection"));
const MobileSection = React.lazy(() => import("../components/sections/MobileSection"));
const Community = React.lazy(() => import("../components/sections/CommunityNew"));
const AwarenessNew = React.lazy(() => import("../components/sections/AwarenessNew"));
const Certification = React.lazy(() => import("../components/sections/Certification"));
const JoiningSection = React.lazy(() => import("../components/sections/Joiningsection"));
const GetInTouch = React.lazy(() => import("../components/sections/GetInTouch"));
// import Stepper from "../components/sections/Stepper";
// import Team from "../components/sections/Team";
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
      <LazySection effect="fade-up" delay={0.1}>
        <MobileSection />
      </LazySection>
      <LazySection effect="fade-up" delay={0.1}>
        <Community />
      </LazySection>
      {/* <Stepper /> */}
      <LazySection effect="fade-up" delay={0.3}>
        <AwarenessNew />
      </LazySection>
      <LazySection effect="fade-up" delay={0.2}>
        <Certification />
      </LazySection>
      {/* <LazySection effect="fade-up" delay={0.1}>
        <Team />
      </LazySection> */}
      <LazySection effect="fade-up" delay={0.2}>
        <JoiningSection />
      </LazySection>
       <LazySection effect="fade-up" delay={0.2}>
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

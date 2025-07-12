import AwarenessSection from "../components/sections/Awareness";
import JoiningSection from "../components/sections/Joiningsection";
import MobileSection from "../components/sections/MobileSection";
import SocialMedia from "../components/sections/SocialMedia";
// import Stepper from "../components/sections/Stepper";
import Community from "../components/sections/Community";
import Highlight from "../components/sections/Highlight";
 import Footer from "../layout/Footer/Footer";
import Header from "../layout/Header";
import HeroSection from "../components/sections/Herosection";
import Certification from "../components/sections/Certification";
import Team from "../components/sections/Team";
import FeaturedSection from "../components/sections/FeaturedSection";

const Home = () => {
  return (
    <>  
      <Header />
      <HeroSection />
      <Highlight />
      <SocialMedia />
      <FeaturedSection/>
      <MobileSection />
      <Community />
      {/* <Stepper /> */}
      <AwarenessSection />
      <Certification />
      <Team />
      <JoiningSection />
      <Footer/>
    </>
  );
};

export default Home;

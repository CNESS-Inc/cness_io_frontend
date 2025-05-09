import AwarenessSection from "../components/sections/Awareness";
import HeroSection from "../components/sections/Herosection";
import JoiningSection from "../components/sections/Joiningsection";
import Plateformrootedsection from "../components/sections/PlatformRooted";
import Platformsections from "../components/sections/PlatformsModule";
import Stepper from "../components/sections/Stepper";
import Testimonialsection from "../components/sections/Testimonial";
import WhySection from "../components/sections/Whysection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <WhySection />
      <Platformsections />
      <Plateformrootedsection />
      <Testimonialsection />
      <Stepper />
      <AwarenessSection/>
      <JoiningSection/>
    </>
  );
};

export default Home;

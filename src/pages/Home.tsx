import HeroSection from "../components/sections/Herosection";
import Plateformrootedsection from "../components/sections/PlatformRooted";
import Platformsections from "../components/sections/PlatformsModule";
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
      {/* <Stepper /> */}
    </>
  );
};

export default Home;

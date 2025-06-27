import AwarenessSection from "../components/sections/Awareness";
import HeroSection from "../components/sections/Herosection";
import JoiningSection from "../components/sections/JoiningSection";
import Plateformrootedsection from "../components/sections/PlatformRooted";
import Platformsections from "../components/sections/PlatformsModule";
import Stepper from "../components/sections/Stepper";
import Testimonialsection from "../components/sections/Testimonial";
import WhySection from "../components/sections/Whysection";
import Footer from "../layout/Footer/Footer";
import Header from "../layout/Header";

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <WhySection />
      <Platformsections />
      <Plateformrootedsection />
      <Testimonialsection />
      <Stepper />
      <AwarenessSection />
      <JoiningSection />
      <Footer/>
    </>
  );
};

export default Home;

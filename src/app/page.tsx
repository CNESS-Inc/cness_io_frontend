import Header from "./components/layout/Header";
import HeroSection from "./components/sections/Herosection";
import Plateformrootedsection from "./components/sections/PlatformRooted";
import Platformsections from "./components/sections/PlatformsModule";
import Stepper from "./components/sections/Stepper/Stepper";
import Testimonialsection from "./components/sections/Testimonial";
import WhySection from "./components/sections/Whysection";

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <WhySection />
      <Platformsections/>
      <Plateformrootedsection/>
      <Testimonialsection/>
      <Stepper />
    </>
  );
}

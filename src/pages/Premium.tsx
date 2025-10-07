import PremiumHero from "../components/Premimum/PremiumHero";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
import Footer from "../layout/Footer/Footer";
import Plans from "../components/Premimum/Plans";
import CompareFeatures from "../components/Premimum/CompareFeatures";
import GetInTouch from "../components/sections/GetInTouch";
import { useState } from "react";
import SignupModel from "../components/OnBoarding/Signup";
//import Subscribe from "../components/sections/Subscribe";

const Premium = () => {
  const [openSignup, setOpenSignup] = useState(false);
  return (
    <>
      <main>
        <Header />
        <LazySection effect="fade-up" delay={0.2}>
          <PremiumHero />
        </LazySection>
        <LazySection effect="fade-up" delay={0.4}>
          <Plans onOpenSignup={() => setOpenSignup(true)} />
        </LazySection>
        <LazySection effect="fade-up" delay={0.4}>
          <CompareFeatures />
        </LazySection>
        <LazySection effect="fade-up" delay={0.4}>
          <GetInTouch />
        </LazySection>
        {/*<LazySection effect="fade-up" delay={0.4}>
        <Subscribe />
      </LazySection>*/}
        <Footer />
      </main>
      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </>
  );
};
export default Premium;

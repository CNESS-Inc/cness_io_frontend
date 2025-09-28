import PremiumHero from "../components/Premimum/PremiumHero";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
import Footer from "../layout/Footer/Footer";
import Plans from "../components/Premimum/Plans";
import CompareFeatures from "../components/Premimum/CompareFeatures";
import GetInTouch from "../components/sections/GetInTouch";
//import Subscribe from "../components/sections/Subscribe";

const Premium = () => {
  return (
    <>
      <Header />
      <LazySection effect="fade-up" delay={0.2}>
        <PremiumHero />
      </LazySection>
      <LazySection effect="fade-up" delay={0.4}>
        <Plans />
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
    </>
  );
};
export default Premium;

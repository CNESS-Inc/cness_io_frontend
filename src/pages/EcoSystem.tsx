import EcoHero from "../components/ecoSystem/EcoHero";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";


export default function EcoSystem() {
  return (
    <>
    <Header />  
     <LazySection effect="fade-up" delay={0.2}>
      <EcoHero />

     </LazySection>
    </>
  )
}

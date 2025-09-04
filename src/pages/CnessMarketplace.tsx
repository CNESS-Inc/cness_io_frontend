import MarketplaceHero from "../components/marketplaceComponents/MarketplaceHero";
import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
 import Footer from "../layout/Footer/Footer";
 import Seller from "../components/marketplaceComponents/Seller";
import SellerForm from "../components/marketplaceComponents/SellerForm";

const Marketplace = () => {

    return(
        <>  
        <Header />
        <LazySection effect="fade-up" delay={0.2}>
                <MarketplaceHero />
                </LazySection>
                <LazySection effect="fade-up" delay={0.1}>
                <Seller />  
                </LazySection>
                <LazySection effect="fade-up" delay={0.2}>
             <SellerForm />
             </LazySection>
             <Footer/>
    </>
    );
}
export default Marketplace
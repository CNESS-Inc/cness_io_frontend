import MarketplaceHero from "../components/marketplaceComponents/MarketplaceHero";
//import LazySection from "../components/ui/LazySection";
import Header from "../layout/Header";
 import Footer from "../layout/Footer/Footer";
 import Seller from "../components/marketplaceComponents/Seller";
import SellerForm from "../components/marketplaceComponents/SellerForm";

const Marketplace = () => {

    return(
        <>  
        <Header />
       
                <MarketplaceHero />

                <Seller />  
             <SellerForm />
             <Footer/>
    </>
    );
}
export default Marketplace
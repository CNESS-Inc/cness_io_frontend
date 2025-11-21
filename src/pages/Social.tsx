import { useState } from "react";
import LeftSocial from "../components/sections/FrontSocialSection/SocialNavbar.tsx";
import { useLocation } from "react-router-dom";
import Header from "../layout/Header/Header.tsx";
import Footer from "../layout/Footer/Footer.tsx";
import SocialFeed from "../components/sections/FrontSocialSection/SocialFeed.tsx";

const Social = () => {
  // const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [sort, setSort] = useState<"az" | "za">("az");
  const location = useLocation();

  // useEffect(() => {
  //   if (window.innerWidth >= 768) {
  //     setIsMobileNavOpen(true);
  //   }
  // }, []);

  return (
    <>
      <Header />

      <div className="flex flex-col w-full bg-[#F7F7F7] gap-4 p-4 md:flex-row h-full">
        {/* First Part (1/3 width on medium screens and above) */}
        <div className="w-full md:w-[20%] bg-white rounded-xl h-[300px]">
          <LeftSocial
            // isMobileNavOpen={isMobileNavOpen}
            currentPath={location.pathname}
            selectedDomain={selectedDomain}
            setSelectedDomain={setSelectedDomain}
            sort={sort}
            setSort={setSort}
          />
        </div>
        <div className="w-full md:w-[80%] h-full">
          <SocialFeed />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Social;

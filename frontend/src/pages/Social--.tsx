import LeftSocial from "../components/Social/LeftSocial.tsx";
import { Outlet, useLocation } from "react-router-dom";
import RightSocial from "../components/Social/RightSocial.tsx";
import Header from "../layout/Header/Header.tsx";
import Footer from "../layout/Footer/Footer.tsx";
import AllSocialPost from "../components/Social/AllSocialPost.tsx";

const Social = () => {
  const location = useLocation();

  const isSinglePost = location.pathname.includes("singlepost");

  return (
    <>
      <Header />

      <div className="flex flex-col w-full gap-4 p-4 md:flex-row">
        {/* First Part (1/3 width on medium screens and above) */}
        <div className="w-full md:w-1/4 md:sticky ">
          <LeftSocial />
        </div>

        {/* Second Part (2/3 width on medium screens and above) */}
        {!isSinglePost && <AllSocialPost />}
        <Outlet />

        {/* Third Part (1/3 width on medium screens and above) */}
        <div className="w-full md:w-1/4  md:sticky">
          <RightSocial />
        </div>
      </div>

      {/* <StoryPostModel isModalOpen={isModalOpen} closeModal={closeModal} /> */}

      <Footer />
    </>
  );
};

export default Social;

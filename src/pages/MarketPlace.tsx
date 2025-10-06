// import { useState } from "react";
import MarketplaceHero from "../components/marketplaceComponents/MarketplaceHero";
import LazySection from "../components/ui/LazySection";
import Marketform from "../components/zohoforms/Marketform";
import Seller from "../components/marketplaceComponents/Seller";
// import HeroCarousel from "../components/marketplaceComponents/HeroCarousel";
// import CnessRecommendations from "../components/marketplaceComponents/CnessRecommendations";
// import sorticon from "../assets/sort.png"; // update the path as needed
// import MarketplaceSection from "../components/marketplaceComponents/MarketplaceSection";

// import musicimg from "../assets/musicimg.jpg";
// import moviesimg from "../assets/moviesimg.jpg"; // <- exact file name
// import ebookimg from "../assets/ebookimg.jpg";
// import ebookimg1 from "../assets/ebook1img.jpg";
// //import courseimg from "../assets/courseimg.jpg";
// import webinarimg from "../assets/webinarimg.jpg";

// import Ebooktag from "../assets/Ebooktag.png";
// import Moviestag from "../assets/Moviestag.png";
// import webinartag from "../assets/webinarstag.png";
// import musictag from "../assets/Musictag.png";

// import person1 from "../assets/person1.jpg";
// import person2 from "../assets/person2.jpg";
// import person3 from "../assets/person3.jpg";

// import { Filter, TrendingUp, Star, ClockFading } from "lucide-react";

// const featuredProducts = [
//   {
//     id: "1",
//     title: "Ways to craft work that adds significance.",
//     image: ebookimg,
//     badge: "Ebook",
//     badgeImage: Ebooktag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person1,
//   },

//   {
//     id: "2",
//     title: "A comprehensive guide to harmonizing your chakras.",
//     image: moviesimg,
//     badge: "Movies",
//     badgeImage: Moviestag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person3,
//   },

//   {
//     id: "3",
//     title: "Yoga routines for mothers on the go.",
//     image: webinarimg,
//     badge: "Movies",
//     badgeImage: webinartag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person2,
//   },
// ];

// const trendingProducts = [
//   {
//     id: "1",
//     title: "Ways to craft work that adds significance.",
//     image: ebookimg,
//     badge: "Ebook",
//     badgeImage: Ebooktag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person1,
//   },

//   {
//     id: "2",
//     title: "A comprehensive guide to harmonizing your chakras.",
//     image: moviesimg,
//     badge: "Movies",
//     badgeImage: Moviestag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person3,
//   },

//   {
//     id: "3",
//     title: "Yoga routines for mothers on the go.",
//     image: webinarimg,
//     badge: "Movies",
//     badgeImage: webinartag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person2,
//   },

//   {
//     id: "4",
//     title: "Ways to craft work that adds significance.",
//     image: ebookimg1,
//     badge: "Movies",
//     badgeImage: Ebooktag,
//     rating: 2,
//     author: "Alex",
//     authorAvatar: person2,
//   },

//   {
//     id: "5",
//     title: "A comprehensive guide to harmonizing your chakras.",
//     image: musicimg,
//     badge: "Movies",
//     badgeImage: musictag,
//     rating: 2,
//     author: "Alex",
//     authorAvatar: person2,
//   },
// ];

// const latestProducts = [
//   {
//     id: "1",
//     title: "Ways to craft work that adds significance.",
//     image: ebookimg,
//     badge: "Ebook",
//     badgeImage: Ebooktag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person1,
//   },

//   {
//     id: "2",
//     title: "A comprehensive guide to harmonizing your chakras.",
//     image: moviesimg,
//     badge: "Movies",
//     badgeImage: Moviestag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person3,
//   },

//   {
//     id: "3",
//     title: "Yoga routines for mothers on the go.",
//     image: webinarimg,
//     badge: "Movies",
//     badgeImage: webinartag,
//     rating: 4,
//     author: "Alex",
//     authorAvatar: person2,
//   },
// ];

export default function MarketplacePage() {
  //const [_currentPage, _setCurrentPage] = useState(1);
  // const itemsPerPage = 6;

  // const start = (currentPage - 1) * itemsPerPage;
  // const end = start + itemsPerPage;
  // const paginatedProducts = featuredProducts.slice(start, end);
  // const totalPages = Math.ceil(featuredProducts.length / itemsPerPage);

  return (
    <>
      {/* <div className="w-full bg-[#f9f9f9] flex">
        <div className="w-full max-w-[1600px] px-2 sm:px-4 lg:px-6">
          <div className="pt-4 flex flex-col lg:flex-row gap-6 w-full">
            <HeroCarousel />
            <CnessRecommendations />
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between mt-6 gap-4 w-full">
            <div className="w-full">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </span>
              <div className="flex items-center gap-2">
                <div className="relative w-[1000px]">
                  <input
                    type="text"
                    placeholder="Search for any materials"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8A6CFF]"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
                    //🔍
                  </span>
                </div>

                <button className="flex items-center gap-2 bg-[#7077FE] text-white px-5 py-2 rounded-full font-medium hover:bg-[#7c60ff] transition">
                  <span>Filter</span>
                  <Filter className="w-4 h-4 text-white" strokeWidth={2.5} />
                </button>

                <button className="flex items-center gap-2 bg-white text-[#1C2274] px-5 py-2 rounded-full font-medium shadow-sm border border-gray-100 hover:shadow-md transition">
                  <span>Sort</span>
                  <img
                    src={sorticon}
                    alt="Sort Icon"
                    className="w-[16px] h-[14px] object-contain"
                  />
                </button>
              </div>

              <div className="w- h-px bg-[#E1E0E0] mt-6" />
            </div>
          </div>


          <div className="w-full mt-6">
            <MarketplaceSection
              title="Featured"
              icon={<Star className="text-pink-500 w-4 h-4" />}
              products={paginatedProducts}
            />
            <MarketplaceSection
              title="Trending Products"
              icon={<TrendingUp className="text-red-500" />}
              products={trendingProducts}
            />
            <MarketplaceSection
              title="Latest Products"
              icon={<ClockFading className="text-yellow-500" />}
              products={latestProducts}
            />


            <div className="flex justify-center items-center gap-1 py-6">
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 rounded bg-white text-sm shadow hover:bg-gray-100"
              >
                &laquo;
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 rounded bg-white text-sm shadow hover:bg-gray-100"
              >
                &lsaquo;
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm shadow ${
                      currentPage === page
                        ? "bg-[#7077FE] text-white"
                        : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="px-3 py-1 rounded bg-white text-sm shadow hover:bg-gray-100"
              >
                &rsaquo;
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 rounded bg-white text-sm shadow hover:bg-gray-100"
              >
                &raquo;
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <LazySection effect="fade-up" delay={0.2}>
        <MarketplaceHero />
      </LazySection>
      <LazySection effect="fade-up" delay={0.1}>
        <Seller />
      </LazySection>

      <section className="bg-[linear-gradient(135deg,rgba(255,255,255,1)_10%,rgba(253,237,237,1)_70%,rgba(249,211,242,1)_100%)] pt-18 pb-18">
        <div className="max-w-[1500px] mx-auto px-4 flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12 ">
              <div className="w-full shadow-lg rounded-[28px]  lg:w-[60%] bg-white  p-4 sm:p-6 md:p-10 flex flex-col">
                <Marketform
                  src="https://forms.zohopublic.com/vijicn1/form/SellerForm/formperma/cg_YdZsqMd1myB1bzzytsXvBByc4kI4DzhufAv4Cu2s"
                  title="Marketplace Submission"
                  minHeight={400}
                />
              </div>
              {/* Side Image */}
              <div className="w-full lg:w-[40%] flex">
                <img
                  src="https://cdn.cness.io/neon.webp"
                  alt="Sell on CNESS"
                  className="w-full h-full rounded-[28px] shadow-lg object-cover"
                />
              </div>
            </div>
      </section>
    
    </>
  );
}

import MoodSelector from "../components/Moodselector";
import ProductLabel from "../components/ProductLabel";
import { useState } from "react";
import { Star, Flame } from "lucide-react";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import Responsivefiletr from "../components/Ui/Responsivefilter";
import LoadMoreButton from "../components/Ui/LoadmoreButton";
import FeatureSeller from "../components/FeatureSeller";
import TopSellerCard from "../components/TopSellerCard";
import SellerCard from "../components/SellerCard";

interface TopSellers {
  id: number;
  title: string;
  description: string;
  rating: number;
  image: string;
  impactor: boolean;
}
interface Sellers {
  id: number;
  title: string;
  description: string;
  rating: number;
  image: string;
  impactor: boolean;
}

const Featuresellers = [
  {
    id: 1,
    title: 'Nandhiji',
    description: 'Nandhiji Siddha Yoga Master empowers individuals to awaken to the highest potential of Consciousness. Live the Joy of Turiya States Beyond Enlightenment.',
    rating: 5,
    image: 'https://cdn.cness.io/marketplace-temp/image%2013.png',
    impactor: true,
  },
  {
    id: 2,
    title: 'Clay van Dijk',
    description: 'One of the things that I love most about being in the music industry is meeting people who share my obsession with music.  We quickly bond and become friends. We become family.',
    rating: 3.5,
    image: 'https://cdn.cness.io/marketplace-temp/image%2014.png',
    impactor: true,
  },

];

const topSellers: TopSellers[] = [
  {
    id: 1,
    title: "Thelma Golden",
    description: 'Artistic Director at the Serpentine Galleries in London, Obrist is one of the most well-known Sellers in the contemporary art world, celebrated for his experimental exhibitions and deep engagement with artists.',
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/image%2013%20(1).png",
    impactor: true,
  },
  {
    id: 2,
    title: "Hans Ulrich Obrist",
    description: 'Director and Chief Curator at The Studio Museum in Harlem, she’s renowned for championing African-American artists and reshaping conversations around identity and culture in art.',
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/image%2013%20(2).png",
    impactor: true,
  },
  {
    id: 3,
    title: "Okwui Enwezor",
    description: 'A visionary curator and scholar, Enwezor was the first African-born curator of Documenta and Venice Biennale',
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/image%2013%20(3).png",
    impactor: true,
  },
];

const sellers: Sellers[] = [
  {
    id: 1,
    title: "Rockstar",
    description: "Crafting soundscapes that speak where words fall silent.",
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image.png",
    impactor: false,
  },
  {
    id: 2,
    title: "Rockstar",
    description: "Crafting soundscapes that speak where words fall silent.",
    rating: 4,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(1).png",
    impactor: false,
  },
  {
    id: 3,
    title: "Lifegiver",
    description: "Nurturing ideas, fostering growth in every endeavor.",
    rating: 4,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(2).png",
    impactor: true,
  },
  {
    id: 4,
    title: "Trailblazer",
    description: "Pioneering paths uncharted, inspiring others to follow.",
    rating: 3,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(3).png",
    impactor: false,
  },
  {
    id: 5,
    title: "Talisman",
    description: "Envisioning futures, transforming the impossible into possible.",
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(4).png",
    impactor: true,
  },
  {
    id: 6,
    title: "Dreamweaver",
    description: "Weaving visions into reality, igniting imaginations.",
    rating: 0,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(5).png",
    impactor: false,
  },
  {
    id: 7,
    title: "Rockstar",
    description: "Crafting soundscapes that speak where words fall silent.",
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(6).png",
    impactor: false,
  },
  {
    id: 8,
    title: "Lifegiver",
    description: "Crafting soundscapes that speak where words fall silent.",
    rating: 4,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(7).png",
    impactor: true,
  },
  {
    id: 9,
    title: "Dreamweaver",
    description: "Weaving visions into reality, igniting imaginations.",
    rating: 0,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(8).png",
    impactor: false,
  },
  {
    id: 10,
    title: "peaceful",
    description: "Nurturing ideas, fostering growth in every endeavor.",
    rating: 4,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(9).png",
    impactor: true,
  },
  {
    id: 11,
    title: "Trailblazer",
    description: "Pioneering paths uncharted, inspiring others to follow.",
    rating: 3,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(10).png",
    impactor: false,
  },
  {
    id: 12,
    title: "Visionary",
    description: "Envisioning futures, transforming the impossible into possible.",
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(11).png",
    impactor: false,
  },
  {
    id: 13,
    title: "Dreamweaver",
    description: "Weaving visions into reality, igniting imaginations.",
    rating: 0,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(12).png",
    impactor: false,
  },
  {
    id: 14,
    title: "Rockstar",
    description: "Crafting soundscapes that speak where words fall silent.",
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(13).png",
    impactor: false,
  },
  {
    id: 15,
    title: "Rockstar",
    description: "Crafting soundscapes that speak where words fall silent.",
    rating: 4,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(14).png",
    impactor: false,
  },
  {
    id: 16,
    title: "Lifegiver",
    description: "Pioneering paths uncharted, inspiring others to follow.",
    rating: 3,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(15).png",
    impactor: true,
  },
  {
    id: 17,
    title: "Visionary",
    description: "Envisioning futures, transforming the impossible into possible.",
    rating: 5,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(16).png",
    impactor: false,
  },
  {
    id: 18,
    title: "Lifegiver",
    description: "Nurturing ideas, fostering growth in every endeavor.",
    rating: 4,
    image: "https://cdn.cness.io/marketplace-temp/Product%20image%20(17).png",
    impactor: false,
  },
];



export default function Curators() {
  const [page, setPage] = useState(1);
  const ITEMS_PER_LOAD = 6;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const visiblesellers = sellers.slice(0, visibleCount);
  const visibleTopSellers = topSellers.slice(0, visibleCount);


  return (
    <div className="w-full flex flex-col  relative px-3 sm:px-0">
      {/* ================= MOOD SELECTOR ================= */}
      <section className="w-full px-[1px]">

      </section>
      {/* ================= CATEGORY + CNESSS ================= */}
      <section className="w-full ">

      </section>

      <section className="w-full sm:px-[20px] mt-18">
        <MoodSelector />
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <ProductLabel
        title="Featured Sellers"
        icon={<Star size={21} />}
        currentPage={page}
        totalItems={48}
        itemsPerPage={6}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

      <div className="mt-1 sm:mt-2">
        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-[20px]
          sm:px-4 lg:px-5
        ">
          {Featuresellers.map((seller) => (
            <FeatureSeller key={seller.id} {...seller} />
          ))}
        </div>
      </div>

      {/* ================= Trending PRODUCTS ================= */}





      {/* Mobile Filter (Hamburger + Drawer) */}
      <div className="px-4 lg:hidden mt-3">
        <Responsivefiletr title="Filters">
          <Filter />
        </Responsivefiletr>
      </div>
      <div>
        <div className="px-5 mt-5">
          <div className="flex items-center gap-[10px]">
            <div className="text-[#FF6A55] flex items-center">
              <Flame size={20} />
            </div>
            <h2 className="font-[Poppins] text-[20px] font-medium text-[#080F20]">
              Top Sellers
            </h2>
          </div>
        </div>
        <div className="flex mt-3">
          <div className="flex-1 mb-3">
            <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
              {visibleTopSellers.map((p) => (
                <TopSellerCard key={p.id} {...p} />
              ))}
            </div>

            <div className="py-3">
              <div className="flex items-center gap-[10px]">
                <div className="text-[#FF6A55] flex items-center">
                  <Flame size={20} />
                </div>
                <h2 className="font-[Poppins] text-[20px] font-medium text-[#080F20]">
                  List of Sellers
                </h2>
              </div>
            </div>
            <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(122px,1fr))]">
              {visiblesellers.map((p) => (
                <SellerCard key={p.id} {...p} />
              ))}
            </div>

            {visibleCount < sellers.length && (
              <LoadMoreButton
                onClick={() =>
                  setVisibleCount((prev) => prev + ITEMS_PER_LOAD)
                }
              />
            )}


          </div>

          <div className="hidden lg:block w-[280px]">
            <Filter />
          </div>
        </div>
      </div>

      { /* ================= Testimonial ================= */}

      <Testimonial />
      <Footer />
    </div>


  );
}

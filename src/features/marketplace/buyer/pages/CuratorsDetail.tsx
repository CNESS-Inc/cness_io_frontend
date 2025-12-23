import { useState } from "react";
import { Flame } from "lucide-react";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import LoadMoreButton from "../components/Ui/LoadmoreButton";
import SingleSeller from "../components/SingleSeller";
import SellerInfo from "../components/SellerInfo";
import type { ProductCategory } from "../components/ProductCard";   
import happy from "../../../../assets/happy.svg";
import whycness from "../../../../assets/whycness.jpg";
import wbinar from "../../../../assets/webinarimg.jpg";
import nandhiji from "../../../../assets/nandhiji.svg";
import TrendingTabs from "../components/Trendingtabs";
import SellerProductCard from "../components/SellerProductCard";
import ReviewsSection from "../components/Products/ReviewsSection";
import RelatedProducts from "../components/Products/RelatedProducts";
import MarketBreadcrumbs, { type BreadcrumbItem } from "../components/Ui/MarketBreadCrumbs";

interface TrendingProduct {
    id: number;
    title: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category: ProductCategory;
    author: string;
    rating: number;
    reviews: number;
    image: string;
    logo: string;
    creator: boolean;
}


const Seller = [
    {
        id: 1,
        title: 'Nandhiji',
        description: 'Nandhiji Siddha Yoga Master empowers individuals to awaken to the highest potential of Consciousness. Live the Joy of Turiya States Beyond Enlightenment.',
        rating: 5,
        image: 'https://cdn.cness.io/marketplace-temp/image%2013.png',
        url: "www. Nandhiji.com"
    }
];


const trendingProducts: TrendingProduct[] = [
    {
        id: 1,
        title: "Dance of Siddhars",
        price: 89,
        originalPrice: 99,
        discount: 10,
        category: "Ebook",
        author: "Nandhiji",
        rating: 5,
        reviews: 70,
        image: happy,
        logo: nandhiji,
        creator: true
    },
    {
        id: 2,
        title: "Dance of Siddhars",
        price: 89,
        originalPrice: 99,
        discount: 10,
        category: "Music",
        author: "Nandhiji",
        rating: 5,
        reviews: 97,
        image: whycness,
        logo: nandhiji,
        creator: true
    },
    {
        id: 3,
        title: "Dance of Siddhars",
        price: 89,
        originalPrice: 99,
        discount: 10,
        category: "Music",
        author: "Nandhiji",
        rating: 5,
        reviews: 97,
        image: wbinar,
        logo: nandhiji,
        creator: true
    },
    {
        id: 4,
        title: "Dance of Siddhars",
        price: 89,
        originalPrice: 99,
        discount: 10,
        category: "Music",
        author: "Nandhiji",
        rating: 5,
        reviews: 97,
        image: wbinar,
        logo: nandhiji,
        creator: true
    },

    {
        id: 4,
        title: "Dance of Siddhars",
        price: 89,
        originalPrice: 99,
        discount: 10,
        category: "Ebook",
        author: "Nandhiji",
        rating: 5,
        reviews: 97,
        image: happy,
        logo: nandhiji,
        creator: true
    },
    {
        id: 1,
        title: "Dance of Siddhars",
        price: 89,
        originalPrice: 99,
        discount: 10,
        category: "Podcast",
        author: "Nandhiji",
        rating: 5,
        reviews: 97,
        image: happy,
        logo: nandhiji,
        creator: true
    },
];



export default function CuratorsDetail() {
    const [activeTab, setActiveTab] = useState("trending");

    const ITEMS_PER_LOAD = 6;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
    const visibleTrendingProducts = trendingProducts.slice(0, visibleCount);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Sellers", href: "/dashboard/new-marketplace/curators" },
        { label: Seller[0].title },
    ];
    return (
        <div className="w-full flex flex-col  relative px-3 sm:px-0">
            {/* ================= MOOD SELECTOR ================= */}
            <section className="w-full px-[1px]">

            </section>
            {/* ================= CATEGORY + CNESSS ================= */}
            <section className="w-full ">

            </section>

            <div className="px-[20px] py-[12px] mt-20 bg-white">
                <MarketBreadcrumbs items={breadcrumbs} />
            </div>

            <div className="mt-1 sm:mt-2">
                <div className="
                    grid
                    grid-cols-1
                ">
                    {Seller.map((seller) => (
                        <SingleSeller key={seller.id} {...seller} />
                    ))}
                </div>
            </div>

            {/* ================= Trending PRODUCTS ================= */}
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-3">
                    <div className="flex-1 mb-3 lg:col-span-2">
                        <SellerInfo />

                        <TrendingTabs
                            title={`Top Products of ${Seller[0].title}`}
                            icon={<Flame size={20} />}
                            tabs={[
                                { id: "trending", label: "Trending" },
                                { id: "best", label: "Best Sellers" },
                                { id: "latest", label: "Latest" },
                            ]}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />
                        <div className="flex-1 mt-4.5">

                            {activeTab === "trending" && (
                                <div className="grid gap-3
                                      grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
                                    {visibleTrendingProducts.map((p) => (
                                        <SellerProductCard key={p.id} {...p} />
                                    ))}
                                </div>
                            )}

                            {visibleCount < trendingProducts.length && (
                                <LoadMoreButton
                                    onClick={() =>
                                        setVisibleCount((prev) => prev + ITEMS_PER_LOAD)
                                    }
                                />
                            )}
                            {activeTab === "best" && <div>Best sellers</div>}
                            {activeTab === "latest" && <div>Latest products</div>}


                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <ReviewsSection />
                    </div>
                </div>
            </div>


            <RelatedProducts />


            { /* ================= Testimonial ================= */}

            <Testimonial />
            <Footer />
        </div>


    );
}

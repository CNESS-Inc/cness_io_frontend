//import { useParams } from "react-router-dom";
import { ProductHero } from "../components/Products/ProductHero";
import ProductDescription from "../components/Products/ProductDescription";
import ReviewsSection from "../components/Products/ReviewsSection";
import RelatedProducts from "../components/Products/RelatedProducts";
import TestimonialSection from "../components/Testimonial";
import Footer from "../components/Footer";
import MarketBreadcrumbs from "../components/Ui/MarketBreadCrumbs";
import type { BreadcrumbItem } from "../components/Ui/MarketBreadCrumbs";


const MOCK_PRODUCT = {

  title: " Dance of Siddhars",
  description:
    "Awaken the primal desire to unite! Call of ancientMaster of Light within ourselves. Let's begin theinner journey through the sacred resonance setting alight the inner lamp of the root chakra! The Magical moment of the awakened moment of NOW!",
  image:
    "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/XsD14XXDaj.png",
  rating: 5,
  reviews: 97,
  originalPrice: "$99.00",
  currentPrice: "$89.00",
  discount: "-10%",
  categories: [
    { label: "Music", color: "purple" as const },
    { label: "Spiritual", color: "yellow" as const },
  ],
  author: {
    name: "Nandhiji",
    avatar:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/kBBYtAuENt.png",
    collection: "Echoes of Imagination",
  },
};

export default function MarketProductDetail() {
  //const { id } = useParams<{ id: string }>();
  const product = MOCK_PRODUCT;

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Categories", href: "/dashboard/new-marketplace/categories" },
    { label: product.categories[0].label },
    { label: product.title },
  ];

  return (
    <>
      <div className="w-full flex flex-col gap-[16px] pt-[72px]">
        <div className="px-[20px] py-[12px]  bg-white">
          <MarketBreadcrumbs items={breadcrumbs} />
        </div>

        <ProductHero product={MOCK_PRODUCT} />
        <div className="flex flex-col items-start self-stretch shrink-0 flex-nowrap relative">
          <div className="flex pt-0 pr-[20px] pb-0 pl-[20px] flex-col gap-[10px] items-start self-stretch shrink-0 flex-nowrap relative">
            <div className="flex pt-[20px] pr-0 pb-[20px] pl-0 flex-col gap-[33px] justify-center items-start self-stretch shrink-0 flex-nowrap rounded-[24px] relative">
              <div className="flex gap-[20px] items-start self-stretch shrink-0 flex-nowrap relative">
                <div className="flex flex-col gap-[33px] items-start self-stretch grow shrink-0 basis-0 flex-nowrap relative">
                  <ProductDescription />
                </div>
                <ReviewsSection />
              </div>
            </div>
          </div>
        </div>


      </div>
      <RelatedProducts />
      <TestimonialSection />
      <Footer />

    </>

  );
}

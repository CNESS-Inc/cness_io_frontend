import RatingBanner from "./RatingBanner";
import ProductInfo from "./ProductInfo";

interface ProductData {
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
}

interface OrderContentProps {
  product: ProductData;
  showRatingBanner?: boolean;
}

export default function OrderContent({
  product,
  showRatingBanner,
}: OrderContentProps) {
  return (
    <div
      className="
        w-full
        px-4 sm:px-6 lg:px-10
        py-4 sm:py-5
        flex flex-col
        gap-4 sm:gap-6
        rounded-b-2xl
        border border-t-0 border-[#f3f3f3]
        bg-[#F3F3F3]/10
      "
    >
      {showRatingBanner && <RatingBanner />}

      <div className="flex flex-col gap-4 sm:gap-6 w-full">
        <ProductInfo product={product} />
      </div>
    </div>
  );
}

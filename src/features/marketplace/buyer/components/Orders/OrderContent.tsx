import RatingBanner from './RatingBanner';
import ProductInfo from './ProductInfo';


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

export default function OrderContent({ product, showRatingBanner }: OrderContentProps) {
  return (
    <div className="flex pt-[20px] pr-[45px] pb-[20px] pl-[45px] flex-col gap-[20px] items-start self-stretch shrink-0 flex-nowrap rounded-tl-none rounded-tr-none rounded-br-[20px] rounded-bl-[20px] border-solid border-t border-t-[#f3f3f3] border-solid border-l border-l-[#f3f3f3] border-solid border-r border-r-[#f3f3f3] bg-[#F3F3F3]/10 relative overflow-hidden">
      {showRatingBanner && <RatingBanner />}
      <div className="flex flex-col gap-[30px] items-start self-stretch shrink-0 flex-nowrap relative">
        <ProductInfo product={product} />
      </div>
    </div>
  );
}

import { Star } from "lucide-react";

export interface Product {
  id: string;
  title: string;
  image: string;
  badge: string;
  badgeImage: string;
  rating: number;
  author: string;
  authorAvatar: string;
}

interface MarketplaceSectionProps {
  title: string;
  icon?: React.ReactNode;
  products: Product[];
}

const ProductCard = ({ data }: { data: Product }) => (
  <div className="rounded-[12px] border border-[#E5E7EB] p-5  bg-gradient-to-b from-[rgba(112,119,254,0.05)] to-[#F07EFF0D] shadow-sm">
    <div className="relative rounded-[8px] overflow-hidden mb-4">
      <img
        src={data.image}
        alt={data.title}
        className="w-full h-[180px] object-cover rounded-[8px]"
      />
      <button
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#F04E23] hover:scale-110 transition-transform"
        title="Add to Wishlist"
        onClick={() => console.log("Wishlisted!")}
      >
        ❤️
      </button>
    </div>

    <div className="flex items-center justify-between mb-3">
      {data.badgeImage ? (
        <img
          src={data.badgeImage}
          alt={data.badge}
          className="h-6 w-auto object-contain"
        />
      ) : (
        <span className="text-sm px-4 py-[4px] rounded-full font-semibold bg-gray-200 text-gray-800">
          {data.badge}
        </span>
      )}
      <div className="flex items-center gap-[2px] text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < data.rating ? "currentColor" : "none"}
            strokeWidth={1.5}
          />
        ))}
      </div>
    </div>

    <h3 className="text-base font-semibold text-[#1C1C1C] leading-snug mb-2 line-clamp-2">
      {data.title}
    </h3>

    <div className="flex items-center gap-2 text-sm text-[#1C1C1C] mb-4">
      <img
        src={data.authorAvatar}
        alt={data.author}
        className="w-6 h-6 rounded-full"
      />
      <span>{data.author}</span>
    </div>

    <div className="flex justify-between gap-2 mt-4">
      <button className="flex-1 bg-gradient-to-r from-[#7077FE] to-[#7077FE] text-white px-2 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transition">
        Add to Cart
      </button>
      <button className="flex-1 bg-white border border-gray-200 px-2 py-2 rounded-full text-sm font-semibold text-gray-800 shadow-sm hover:shadow-md transition">
        Buy Now
      </button>
    </div>
  </div>
);

const MarketplaceSection = ({ title, icon, products }: MarketplaceSectionProps) => {
  return (
    <section className="space-y-10 px-4 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          {icon}
          {title}
        </h2>
<button className="bg-white px-5 py-2 rounded-full text-sm font-medium shadow hover:shadow-md transition">
          Show all &gt;&gt;
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} data={p} />
        ))}
      </div>
    </section>
  );
};

export default MarketplaceSection;

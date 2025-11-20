import React, { useEffect, useState } from "react";
import {
  Play,
  Download,
  Star,
  Pencil,
  X,
  Video,
  Music,
  BookOpen,
  FileAudio,
  FileText,
  Palette,
} from "lucide-react";
import {
  DeleteSellerProduct,
  GetSellerDashboard,
  GetSellerProducts,
  GetSellerBestSellingProducts, // ⬅️ Add implementation as shown below!
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";

// ---------- Types ----------
interface StatCardProps {
  title: string;
  value: string;
  icon: string;
}

interface ProductItemProps {
  title: string;
  price: string;
  category: any;
  downloads: string;
  rating: string;
  image: string;
}

interface ProductRowProps {
  id: string;
  video_details?: any;
  product_name: string;
  price: string;
  original_price: string;
  discount_percentage: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  updated_date: string;
  status: string;
  is_published: boolean;
  is_active: boolean;
  index: number;
  currentPage: number;
  handleDelete: (id: string) => void;
}

// For Best Selling Products API
interface BestSellingProduct {
  id: string;
  product_name: string;
  image_url: string | null;
  price: number;
  total_downloads: number;
  rating: number | null;
  category: string;
}

// ---------- Components ----------
const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-gray-700 font-[400] text-[14px] leading-[100%] capitalize font-['Open_Sans']">
        {title}
      </h3>
      <div className="w-[40px] h-[40px]">
        <img src={icon} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
    <div className="text-gray-900 font-['Poppins'] font-semibold text-[28px] leading-[100%]">
      {value}
    </div>
  </div>
);

const ProductItem: React.FC<ProductItemProps> = ({
  title,
  price,
  category,
  downloads,
  rating,
  image,
}) => (
  <div className="gap-1 py-1 sm:gap-3 sm:py-3 md:gap-2 md:py-2 lg:flex border-b border-gray-100 last:border-none">
    <img
      src={image}
      alt={title}
      className="sm:w-20 sm:h-16 md:w-20 md:h-16 border-b border-gray-100 last:border-none rounded-lg object-cover flex-shrink-0"
    />
    <div className="flex-1 space-y-1">
      <h4 className="text-gray-900 sm:text-[12px] md:text-[12px] lg:text-[12px] font-medium line-clamp-2">
        {title}
      </h4>
      <div className="flex items-center justify-between">
        <span className="text-gray-900 text-sm font-semibold">{price}</span>
        <div className="flex items-center gap-1 text-xs text-gray-700">
          <span className="bg-purple-50 px-2 py-1 rounded-full text-gray-700">
            🕊️ Peaceful
          </span>
          <div className="flex items-center gap-1">
            <Play className="w-3 h-3" />
            <span>{category}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{rating}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    Video: <Video className="w-5 h-5 text-black" />,
    Music: <Music className="w-5 h-5 text-black" />,
    Course: <BookOpen className="w-5 h-5 text-black" />,
    Podcast: <FileAudio className="w-5 h-5 text-black" />,
    eBook: <FileText className="w-5 h-5 text-black" />,
    Art: <Palette className="w-5 h-5 text-black" />,
  };
  return iconMap[categoryName] || <BookOpen className="w-5 h-5 text-black" />;
};

const getCategoryIconLarge = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    Video: <Video className="w-8 h-8 text-white" />,
    Music: <Music className="w-8 h-8 text-white" />,
    Course: <BookOpen className="w-8 h-8 text-white" />,
    Podcast: <FileAudio className="w-8 h-8 text-white" />,
    eBook: <FileText className="w-8 h-8 text-white" />,
    Art: <Palette className="w-8 h-8 text-white" />,
  };
  return iconMap[categoryName] || <BookOpen className="w-8 h-8 text-white" />;
};

const getCategoryColor = (categoryName: string) => {
  const colorMap: { [key: string]: string } = {
    Video: "bg-gradient-to-br from-red-500 to-pink-500",
    Music: "bg-gradient-to-br from-purple-500 to-indigo-500",
    Course: "bg-gradient-to-br from-blue-500 to-cyan-500",
    Podcast: "bg-gradient-to-br from-orange-500 to-yellow-500",
    eBook: "bg-gradient-to-br from-emerald-500 to-teal-500",
    Art: "bg-gradient-to-br from-pink-500 to-rose-500",
  };
  return colorMap[categoryName] || "bg-gradient-to-br from-gray-500 to-slate-500";
};

const ProductRow: React.FC<ProductRowProps & { onEdit: (id: string, slug: string) => void }> = ({
  id,
  video_details,
  product_name,
  price,
  original_price,
  discount_percentage,
  category,
  updated_date,
  status,
  onEdit,
  handleDelete,
}) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-yellow-100 text-yellow-600";
      case "pending":
        return "bg-purple-100 text-purple-600";
      case "published":
        return "bg-green-100 text-green-600";
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const displayPrice = () => {
    const hasDiscount = discount_percentage && parseFloat(discount_percentage) > 0;
    if (hasDiscount) {
      return (
        <div className="flex flex-col">
          <span className="text-[#1A1A1A] text-base font-semibold">${price}</span>
          <span className="text-gray-400 text-xs line-through">${original_price}</span>
        </div>
      );
    }
    return <span className="text-[#1A1A1A] text-base font-semibold">${price}</span>;
  };

  const renderThumbnail = () => {
    const isVideo = category.slug.toLowerCase() === "video";
    if (isVideo) {
      const thumbnailUrl =
        video_details?.main_video?.thumbnail ||
        video_details?.thumbnail_url ||
        video_details?.thumbnail;
      if (thumbnailUrl) {
        return (
          <img
            src={thumbnailUrl}
            alt={product_name}
            className="w-[90px] h-[58px] rounded-md object-cover shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://cdn.cness.io/VIDEO%20(1).svg";
            }}
          />
        );
      }
    }
    // For other categories, show a professional box with icon
    return (
      <div
        className={`w-[90px] h-[58px] rounded-lg ${getCategoryColor(
          category.name
        )} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`}
      >
        {getCategoryIconLarge(category.name)}
      </div>
    );
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-6 px-6 text-[#1A1A1A] text-base">{id}</td>
      <td className="py-6 px-6">{renderThumbnail()}</td>
      <td
        className="py-6 px-6 text-[#1A1A1A] text-sm leading-5 max-w-[220px] truncate"
        title={product_name}
      >
        {product_name}
      </td>
      <td className="py-6 px-6">{displayPrice()}</td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          {getCategoryIcon(category.name)}
          <span className="text-[#1A1A1A] text-base">{category.name}</span>
        </div>
      </td>
      <td className="py-6 px-6 text-[#1A1A1A] text-base">
        {formatDate(updated_date)}
      </td>
      <td className="py-6 px-6">
        <span
          className={`px-5 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(
            status
          )}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          <button
            className="text-gray-600 hover:text-gray-800 transition-colors p-1 rounded hover:bg-gray-100"
            onClick={() => onEdit(id, category?.slug)}
            title="Edit product"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
            title="Delete product"
            onClick={() => handleDelete(id)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const VendorDashboard: React.FC = () => {
  const [productData, setProductData] = useState<ProductRowProps[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);

  // Best Selling Products State
  const [bestSelling, setBestSelling] = useState<BestSellingProduct[]>([]);
  const [isLoadingBestSelling, setIsLoadingBestSelling] = useState(false);
  const [bestSellingError, setBestSellingError] = useState<string | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    fetchProductsData();
    fetchBestSellingProducts();
  }, []);

  const fetchProductsData = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await GetSellerProducts();
      const products = response?.data?.data?.products || [];
      setProductData(products);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error?.message || "Failed to load products.";
      showToast({
        message: errorMessage,
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchDashboard = async () => {
    try {
      setIsLoadingProducts(true);
      const res = await GetSellerDashboard();
      const data = res?.data?.data || null;
      setDashboard(data);
      // ADD THIS:
      console.log("DASHBOARD API RAW:", res);
      console.log("DASHBOARD EXTRACTED:", data);
    } catch (err) {
      console.log("Dashboard fetch error:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };


  // Fetch Best Selling Products
  const fetchBestSellingProducts = async () => {
    try {
      setIsLoadingBestSelling(true);
      setBestSellingError(null);

      const res = await GetSellerBestSellingProducts({
        limit: 4,
        sort_by: "revenue",
      });
    console.log("Best-selling API raw response:", res);

      const apiProducts = res?.data?.data?.products && Array.isArray(res.data.data.products)
      ? res.data.data.products
      : [];
        console.log("Best-selling API TEST:", res);

    setBestSelling(
      apiProducts.map((p: any) => ({
        id: p.product_id ?? "",
        product_name: p.product_title ?? "",
        image_url: p.thumbnail_url ?? null,
        price: Number(p.final_price ?? p.price ?? 0),
        total_downloads: Number(p.total_sales ?? p.total_quantity_sold ?? 0),
        rating: p.rating ? Number(p.rating) : null,
        category: p.category ?? "Course",
      }))
    );


    } catch (error: any) {
      setBestSellingError(
        error?.response?.data?.error?.message ||
          "Failed to load best-selling products."
      );
    } finally {
      setIsLoadingBestSelling(false);
    }
  };

  const handleEditProduct = (productId: string, categorySlug: string) => {
    const routeMap: { [key: string]: string } = {
      video: `/dashboard/products/edit-video/${productId}`,
      music: `/dashboard/products/edit-music/${productId}`,
      course: `/dashboard/products/edit-course/${productId}`,
      podcast: `/dashboard/products/edit-podcast/${productId}`,
      ebook: `/dashboard/products/edit-ebook/${productId}`,
      art: `/dashboard/products/edit-art/${productId}`,
    };
    const route = routeMap[categorySlug] || `/dashboard/products/edit/${productId}`;
    navigate(route);
  };

  const handleDelete = (productId: string) => {
    setDeleteProductId(productId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (deleteProductId) {
      try {
        await DeleteSellerProduct(deleteProductId);
        setShowDeleteModal(false);
        showToast({
          message: "Product deleted successfully.",
          type: "success",
          duration: 3000,
        });
        fetchProductsData();
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.error?.message || "Failed to delete product.";
        showToast({
          message: errorMessage,
          type: "error",
          duration: 3000,
        });
      }
    }
  };

  const chartData =
    dashboard?.revenue_trends?.last_5_weeks?.map((w: any) => ({
      week: w.week,
      date: `${w.week_start} - ${w.week_end}`,
      value: `$${w.revenue}`,
      height: Math.min(250, w.revenue * 2),
    })) || [];

  console.log("chartData output:", chartData);


  return (
    <>
      {/* Top Cards */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${dashboard?.earnings?.lifetime_sales || "0.00"}`}
          icon="https://static.codia.ai/image/2025-10-29/6i7pEM917T.png"
        />
        <StatCard
          title="Pending Amount"
          value={`$${dashboard?.earnings?.pending_withdrawals || "0.00"}`}
          icon="https://static.codia.ai/image/2025-10-29/e3MnRCeett.png"
        />
        <StatCard
          title="Total Purchases"
          value={dashboard?.business_metrics?.total_orders ?? 0}
          icon="https://static.codia.ai/image/2025-10-29/t5WgNvrOim.png"
        />
        <StatCard
          title="Total Products"
          value={dashboard?.business_metrics?.total_products ?? 0}
          icon="https://static.codia.ai/image/2025-10-29/2Z99YrY7fk.png"
        />
      </div>

      {/* Sales Summary + Best Selling */}
      <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 mt-5">
        {/* Sales Summary */}
        <div className="col-span-2 bg-white border border-[#E6E8EC] rounded-xl p-6 shadow-sm">
          <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] mb-1">
            Sales Summary
          </h2>
          <p className="text-gray-500 text-sm mb-6 font-['Open_Sans']">
            Will update every week’s data
          </p>
          <div className="relative h-[350px] px-3 pb-6 flex items-end gap-1 overflow-hidden">
            {chartData.map((bar: any, i: number) => {
              const CIRCLE_OFFSET = 15;
              const CHART_MAX_HEIGHT = 330;
              const circleBottom = bar.height - CIRCLE_OFFSET;
              const dashedLineHeight = CHART_MAX_HEIGHT - bar.height;
              return (
                <div
                  key={i}
                  className="relative flex-1 min-w-[60px] flex flex-col items-center justify-end group"
                >
                  <div className="absolute -top-[90px] left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                    <div className="bg-white border border-[#B197FC] rounded-xl shadow-lg px-3 py-2 text-center min-w-[140px]">
                      <div className="text-gray-500 text-[12px]">{bar.date}</div>
                      <div className="text-gray-900 font-semibold text-[16px] mt-[2px]">
                        {bar.value}
                      </div>
                    </div>
                  </div>
                  <svg
                    className="absolute left-1/2 -translate-x-1/2 z-[5]"
                    width="2"
                    height={dashedLineHeight}
                    style={{ bottom: `${bar.height}px` }}
                  >
                    <line
                      x1="1"
                      y1={0}
                      x2="1"
                      y2={dashedLineHeight}
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeDasharray="12 10"
                      opacity="0.6"
                    />
                  </svg>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 z-20"
                    style={{ bottom: `${circleBottom}px` }}
                  >
                    <div className="relative w-[54px] h-[54px] flex items-center justify-center">
                      <svg width="54" height="54" viewBox="0 0 54 54" className="absolute">
                        <circle
                          cx="27"
                          cy="27"
                          r="25"
                          fill="transparent"
                          stroke="#7077FE"
                          strokeWidth="1"
                          strokeDasharray="10,8"
                        />
                      </svg>
                      <div className="w-[40px] h-[40px] rounded-full bg-[#7177FE] shadow-md"></div>
                    </div>
                  </div>
                  <div className="w-[42px] rounded-t-full relative overflow-hidden" style={{ height: bar.height }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#E2E4FF]/100 via-[#E2E4FF] to-[#B3B8FA]"></div>
                  </div>
                  <span className="text-gray-600 text-[14px] mt-3">{bar.week}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Selling */}
        
        <div className="bg-white border border-gray-200 rounded-[12px] p-[10px] h-auto shadow-sm">
          <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] mb-1">
            Best Selling
          </h2>
          <p className="text-gray-500 text-sm mb-5 font-['Open_Sans']">
            Top 4 Best-Selling Products
          </p>
          {isLoadingBestSelling ? (
            <div className="py-6 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : bestSellingError ? (
            <p className="text-sm text-red-500">{bestSellingError}</p>
          ) : bestSelling.length === 0 ? (
            <p className="text-sm text-gray-400">
              No best-selling products to show yet.
            </p>
          ) : (
            <div className="space-y-0">
              {bestSelling.map((product) => (
                <ProductItem
                  key={product.id}
                  title={product.product_name}
                  price={`$${product.price.toFixed(2)}`}
                  category={product.category}
                  downloads={`${product.total_downloads}`}
                  rating={product.rating !== null ? product.rating.toString() : "—"}
                  image={product.image_url || "https://static.codia.ai/image/2025-10-29/MqPwkBCmiC.png"}
                />

              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Submission Queue */}
      <div className="space-y-4 mt-10">
        <div>
          <h2 className="text-gray-800 font-['Poppins'] font-semibold text-[18px] leading-[130%] tracking-[0] capitalize mb-0.5">
            Product Submission Queue
          </h2>
          <p className="text-gray-600 font-['Open_Sans'] font-[400] text-[14px] leading-[115%] tracking-[0] mt-2">
            Check the status of all newly submitted digital products and take action quickly
          </p>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden">
          {isLoadingProducts ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[8%]">
                    P.No
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">
                    Thumbnail
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[20%]">
                    Course name
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">
                    Price
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[12%]">
                    Categories
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">
                    Uploaded Date
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[10%]">
                    Status
                  </th>
                  <th className="py-5 px-6 font-['Open_Sans'] font-semibold text-[16px] leading-[100%] tracking-[0] text-[#8A8A8A] text-left w-[8%]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {productData.length > 0 ? (
                  productData.map((product: ProductRowProps, index: number) => (
                    <ProductRow
                      key={product.id}
                      {...product}
                      index={index}
                      onEdit={handleEditProduct}
                      handleDelete={handleDelete}
                      video_details={product.video_details}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-gray-400 mb-2">
                          <Video className="w-16 h-16" />
                        </div>
                        <p className="text-gray-600 font-medium">No products found</p>
                        <p className="text-gray-400 text-sm mt-1">
                          You haven't added any products yet. Start by adding your first one!
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-[20px] shadow-lg p-8 w-[450px]">
            <h3 className="text-[20px] font-semibold font-['Poppins'] text-[#242E3A] mb-4">
              Delete Product?
            </h3>
            <p className="text-[14px] text-[#665B5B] font-['Open_Sans'] mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VendorDashboard;

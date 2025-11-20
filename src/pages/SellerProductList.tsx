import React, { useEffect, useState } from "react";
import { Video, Pencil, X, Plus, Music, BookOpen, FileAudio, FileText, Palette } from "lucide-react";
import Pagination from "../components/MarketPlace/Pagination";
import CategoryModal from "../components/MarketPlace/CategoryModel";
import { useNavigate } from "react-router-dom";
import { DeleteSellerProduct, GetMarketPlaceCategories, GetSellerProducts } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import LoadingSpinner from "../components/ui/LoadingSpinner";

interface ProductRowProps {
  id: string;
  video_details?: any;
  thumbnail_url?: any;
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

const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    "Video": <Video className="w-5 h-5 text-black" />,
    "Music": <Music className="w-5 h-5 text-black" />,
    "Course": <BookOpen className="w-5 h-5 text-black" />,
    "Podcast": <FileAudio className="w-5 h-5 text-black" />,
    "eBook": <FileText className="w-5 h-5 text-black" />,
    "Art": <Palette className="w-5 h-5 text-black" />,
  };

  return iconMap[categoryName] || <BookOpen className="w-5 h-5 text-black" />;
};

// const getCategoryIconLarge = (categoryName: string) => {
//   const iconMap: { [key: string]: any } = {
//     "Video": <Video className="w-8 h-8 text-white" />,
//     "Music": <Music className="w-8 h-8 text-white" />,
//     "Course": <BookOpen className="w-8 h-8 text-white" />,
//     "Podcast": <FileAudio className="w-8 h-8 text-white" />,
//     "eBook": <FileText className="w-8 h-8 text-white" />,
//     "Art": <Palette className="w-8 h-8 text-white" />,
//   };

//   return iconMap[categoryName] || <BookOpen className="w-8 h-8 text-white" />;
// };

// const getCategoryColor = (categoryName: string) => {
//   const colorMap: { [key: string]: string } = {
//     "Video": "bg-gradient-to-br from-red-500 to-pink-500",
//     "Music": "bg-gradient-to-br from-purple-500 to-indigo-500",
//     "Course": "bg-gradient-to-br from-blue-500 to-cyan-500",
//     "Podcast": "bg-gradient-to-br from-orange-500 to-yellow-500",
//     "eBook": "bg-gradient-to-br from-emerald-500 to-teal-500",
//     "Art": "bg-gradient-to-br from-pink-500 to-rose-500",
//   };

//   return colorMap[categoryName] || "bg-gradient-to-br from-gray-500 to-slate-500";
// };

const ProductRow: React.FC<ProductRowProps & { onEdit: (id: string, slug: string) => void }> = ({
  id,
  thumbnail_url,
  product_name,
  price,
  original_price,
  discount_percentage,
  category,
  updated_date,
  status,
  onEdit,
  index,
  currentPage,
  handleDelete
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
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
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

  // const renderThumbnail = () => {
  //   const isVideo = category.slug.toLowerCase() === 'video';

  //   if (isVideo) {
  //     const thumbnailUrl = video_details?.main_video?.thumbnail ||
  //       video_details?.thumbnail_url ||
  //       video_details?.thumbnail;

  //     if (thumbnailUrl) {
  //       return (
  //         <img
  //           src={thumbnailUrl}
  //           alt={product_name}
  //           className="w-[90px] h-[58px] rounded-md object-cover shadow-sm"
  //           onError={(e) => {
  //             // Fallback to default video icon on error
  //             (e.target as HTMLImageElement).src = 'https://cdn.cness.io/VIDEO%20(1).svg';
  //           }}
  //         />
  //       );
  //     }
  //   }

  //   // For other categories, show a professional box with icon
  //   return (
  //     <div className={`w-[90px] h-[58px] rounded-lg ${getCategoryColor(category.name)} flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200`}>
  //       {getCategoryIconLarge(category.name)}
  //     </div>
  //   );
  // };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="py-6 px-6 text-[#1A1A1A] text-base">
        P{String((currentPage - 1) * 10 + index + 1).padStart(4, '0')}
      </td>
      <td className="py-6 px-6">
        {category.slug === 'video' ? (
          <img
            src='https://cdn.cness.io/VIDEO%20(1).svg'
            alt={product_name}
            className="w-[90px] h-[58px] rounded-md object-cover shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://cdn.cness.io/VIDEO%20(1).svg';
            }}
          />
        ) : (
          <img
            src={thumbnail_url}
            alt={product_name}
            className="w-[90px] h-[58px] rounded-md object-cover shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://cdn.cness.io/VIDEO%20(1).svg';
            }}
          />
        )}
      </td>
      <td className="py-6 px-6 text-[#1A1A1A] text-sm leading-5 max-w-[220px] truncate" title={product_name}>
        {product_name}
      </td>
      <td className="py-6 px-6">
        {displayPrice()}
      </td>
      <td className="py-6 px-6">
        <div className="flex items-center gap-2">
          {getCategoryIcon(category.name)}
          <span className="text-[#1A1A1A] text-base">{category.name}</span>
        </div>
      </td>
      <td className="py-6 px-6 text-[#1A1A1A] text-base">{formatDate(updated_date)}</td>
      <td className="py-6 px-6">
        <span
          className={`px-5 py-1.5 rounded-full text-xs font-medium ${getStatusStyle(status)}`}
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

const SellerProductList: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductRowProps[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleEditProduct = (productId: string, productCategory: string) => {
    navigate(`/dashboard/products/edit/${productId}?category=${productCategory}`);
  };

  useEffect(() => {
    fetchProductsData();
  }, [currentPage]);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetMarketPlaceCategories();
        if (response?.data?.data) {
          setCategories(response.data.data);
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.error?.message || "Failed to load categories.";
        setError(errorMessage);
        showToast({
          message: errorMessage,
          type: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductsData = async () => {
    setIsLoadingProducts(true);
    try {
      const response = await GetSellerProducts(currentPage);
      const products = response?.data?.data?.products || [];
      const pagination = response?.data?.data?.pagination || {};

      const filteredProducts = products.filter((product: any) => product.status.toLowerCase() !== "deleted");

      setProductData(filteredProducts);
      setTotalPages(pagination.total_pages || 1);

      if (filteredProducts.length === 0 && currentPage > 1) {
        setCurrentPage(1);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || "Failed to load products.";
      showToast({
        message: errorMessage,
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleSelectCategory = (categoryName: string) => {
    setIsOpen(false);

    const routeMap: { [key: string]: string } = {
      "Video": "/dashboard/products/add-video",
      "Music": "/dashboard/products/add-music",
      "Course": "/dashboard/products/add-course",
      "Podcast": "/dashboard/products/add-podcast",
      "Podcasts": "/dashboard/products/add-podcast",
      "eBook": "/dashboard/products/add-ebook",
      "Ebook": "/dashboard/products/add-ebook",
      "Art": "/dashboard/products/add-arts",
    };

    const route = routeMap[categoryName];
    if (route) {
      navigate(route, { state: { categoryName } });
    } else {
      showToast({
        message: `No route found for category: ${categoryName}`,
        type: "error",
        duration: 3000,
      });
    }
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

  return (
    <>
      {/* Product Submission Queue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px] leading-[130%] capitalize mb-0.5">
            Product List
          </h2>
          <p className="text-[#665B5B] font-['Open_Sans'] font-normal text-[14px] leading-[115%] mt-1 max-w-[700px]">
            View and manage all your uploaded products in one place. To add a
            new product, click the <strong>"Add Product"</strong> button.
          </p>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#7077FE] hover:bg-[#665EE0] text-white text-sm font-semibold rounded-lg px-5 py-2.5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {isLoadingProducts ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  P.No
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Thumbnail
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Product Name
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Price
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Category
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Uploaded Date
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
                  Status
                </th>
                <th className="py-4 px-6 font-['Open_Sans'] font-semibold text-[14px] text-[#8A8A8A]">
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
                    currentPage={currentPage}
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
                      <button
                        onClick={() => setIsOpen(true)}
                        className="mt-4 px-5 py-2 bg-[#7077FE] text-white rounded-lg hover:bg-[#5a60ea] transition-colors"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {productData.length > 0 && (
        <div className="flex justify-end mt-10">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page: number) => setCurrentPage(page)}
          />
        </div>
      )}

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

      <CategoryModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSelect={handleSelectCategory}
        loading={loading}
        error={error}
        category={categories}
      />
    </>
  );
};

export default SellerProductList;
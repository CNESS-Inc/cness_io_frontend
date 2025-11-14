import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GetCollectionListById } from '../Common/ServerAPI';
import { useToast } from '../components/ui/Toast/ToastProvider';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ArrowLeft, Play } from 'lucide-react';

type CollectionProduct = {
  collection_item_id: string;
  order_number: number;
  added_at: string;
  id: string;
  product_title: string;
  overview: string;
  thumbnail_url: string;
  price: string;
  final_price: string;
  currency: string;
  rating: string;
  total_reviews: number;
  product_category_id: string;
  product_category: {
    id: string;
    name: string;
    slug: string;
  };
};

type CollectionDetail = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  is_public: boolean;
  sample_product_thumbnail: string;
  thumbnail_url: string;
  product_count: number;
  createdAt: string;
  updatedAt: string;
  products: CollectionProduct[];
};

const defaultImage = 'https://cdn.cness.io/collection1.svg';

export default function CollectionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCollectionDetails();
    }
  }, [id]);

  const fetchCollectionDetails = async () => {
    setIsLoading(true);
    try {
      const response = await GetCollectionListById(id);
      const data = response?.data?.data;

      setCollection(data);
    } catch (error: any) {
      console.error("Failed to load collection details:", error);
      showToast({
        message: "Failed to load collection details",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductClick = (productId: string) => {
    navigate(`/dashboard/library/course/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Collection not found</p>
      </div>
    );
  }

  return (
    <div className="transition-all duration-300 md:ml-0 pt-5 px-6 md:px-8 py-8 overflow-x-hidden">
      <button
        onClick={() => navigate('/dashboard/collections')}
        className="flex items-center gap-2 text-[#7077FE] hover:text-[#5E65F6] mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Collections</span>
      </button>

      {/* Collection Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={ collection.sample_product_thumbnail || collection.thumbnail_url || defaultImage}
              alt={collection.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultImage;
              }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <h1 className="font-['Poppins'] font-semibold text-2xl text-[#1A1A1A]">
                {collection.name}
              </h1>
            </div>

            {collection.description && (
              <p className="text-gray-600 mb-4">{collection.description}</p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>
                <strong className="text-gray-900">{collection.product_count}</strong> products
              </span>
              <span>•</span>
              <span>
                Created {new Date(collection.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="font-semibold text-lg text-[#1A1A1A] mb-4">
          Products in this Collection
        </h2>

        {collection.products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Yet
            </h3>
            <p className="text-gray-500">
              Add products to this collection from the marketplace
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collection.products.map((product) => (
              <div
                key={product.collection_item_id}
                onClick={() => handleProductClick(product.id)}
                className="overflow-hidden cursor-pointer"
              >
                <div className='relative overflow-hidden group'>
                  <img
                    src={
                      product.thumbnail_url ||
                      "https://cdn.cness.io/collection1.svg"
                    }
                    alt={product.product_title}
                    className="w-full h-[150px] object-cover rounded-xl"
                  />
                  <div className="absolute rounded-xl inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                    <div className="w-10 h-10 rounded-full bg-[#7077FEBF] flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[14px] text-[#111827] font-semibold leading-snug line-clamp-2">
                  {product.product_title}
                </p>

                {/* <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">
                    {product.product_category.name}
                  </div>
                  <h3 className="font-medium text-sm text-[#1A1A1A] mb-2 line-clamp-2">
                    {product.product_title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#7077FE]">
                      ${product.final_price}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <span className="text-yellow-500">★</span>
                      <span>{parseFloat(product.rating).toFixed(1)}</span>
                      <span className="text-gray-400">({product.total_reviews})</span>
                    </div>
                  </div>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
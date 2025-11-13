import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ui/Toast/ToastProvider';
import { useEffect, useState } from 'react';
import { GetCollectionList } from '../Common/ServerAPI';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_public: boolean;
  thumbnail_url: string;
  product_count: number;
  createdAt: string;
  updatedAt: string;
};

const defaultImage = 'https://cdn.cness.io/collection1.svg';

export default function MyCollections() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await GetCollectionList();
      const data = response?.data?.data;

      setCollections(data?.collections || []);
      setPagination(data?.pagination || {});
    } catch (error: any) {
      console.error("Failed to load collections:", error);
      showToast({
        message: "Failed to load collections",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollectionClick = (collection: Collection) => {
    navigate(`/dashboard/my-collections/${collection.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }


  return (
    <div className="transition-all duration-300 md:ml-0 pt-5 px-6 md:px-8 py-8 overflow-x-hidden">
      {/* Frame 1: Heading container (1128x30 with 20px gap below) */}
      <div className="mx-auto w-full h-[30px] mb-5 flex gap-2 items-center">
        <h1 className="font-['Poppins'] font-semibold text-[20px] leading-[100%] tracking-[0] text-[#1A1A1A] w-[149px]">
          My Collections
        </h1>
        {pagination?.total > 0 && (
          <span className="text-sm text-gray-600">
            ({pagination.total} {pagination.total === 1 ? 'Collection' : 'Collections'})
          </span>
        )}
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Collections Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first collection to organize your products
          </p>
        </div>
      ) : (
        <div className="mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-6 gap-5">
            {collections.map((collection) => (
              <div
                key={collection.id}
                onClick={() => handleCollectionClick(collection)}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-[10px]  bg-white w-full">
                  <img
                    src={collection.thumbnail_url || defaultImage}
                    alt={collection.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = defaultImage;
                    }}
                  />
                  <div className="px-2 mt-2.5 text-center text-[14px] font-medium text-[#1A1A1A]">
                    {collection.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
      }
    </div>
  );
}

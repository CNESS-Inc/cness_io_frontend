import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../components/MarketPlace/Filter";
import { Play, Search, ChevronDown, Video, Music, BookOpen, FileAudio, FileText, Palette, Star, Clock } from "lucide-react";
import filter from "../assets/filter.svg";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { GetCollectionList, GetContinueWatchingProductList, GetLibraryrDetails, GetLibraryrFilters } from "../Common/ServerAPI";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EmptyPageLibrary from "./EmptyPageLibrary";

type ContinueWatchingProduct = {
  progress_id: string;
  product_id: string;
  product_name: string;
  thumbnail_url: string;
  category: {
    name: string;
    slug: string;
  };
  price: string;
  final_price: string;
  progress_percentage: number;
  is_completed: boolean;
  last_watched_at: string;
  current_content: any;
};

type LibraryProduct = {
  product_id: string;
  product_title: string;
  thumbnail_url: string;
  price: string;
  final_price: string;
  overview: string;
  category: {
    name: string;
    slug: string;
  };
  moods: {
    id: string;
    name: string;
    icon: string;
    slug: string;
  }[];
  rating: {
    average: any;
    total_reviews: any;
  };
  seller: {
    shop_name: string;
  };
  duration: string
  purchased_at: string;
  continue_watching: any;
};

const CATEGORY_TABS = [
  "All",
  "Video",
  "Podcast",
  "Music",
  "eBook",
  "Art",
  "Course",
] as const;
type Category = (typeof CATEGORY_TABS)[number];
type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_public: boolean;
  sample_product_thumbnail: string
  thumbnail_url: string;
  product_count: number;
  createdAt: string;
  updatedAt: string;
};
const CATEGORY_SLUG_MAP: Record<string, string> = {
  Video: "video",
  Podcast: "podcast",
  Music: "music",
  eBook: "ebook",
  Art: "art",
  Course: "course",
};

const ContinueWatchingThumb: React.FC<{
  product: ContinueWatchingProduct;
}> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="relative rounded-t-xl overflow-hidden group cursor-pointer"
        onClick={() =>
          navigate(`/dashboard/library/course/${product.product_id}`)
        }
      >
        <img
          src={
            product.thumbnail_url ||
            "https://cdn.cness.io/collection1.svg"
          }
          alt={product.product_name}
          className="w-full h-[150px] object-cover"
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
          <div className="w-10 h-10 rounded-full bg-[#7077FEBF] flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Progress Bar at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#D9D9D9]">
          <div
            className="h-full bg-[#7077FE] transition-all"
            style={{ width: `${product.progress_percentage}%` }}
          ></div>
        </div>

        {/* Progress Percentage Badge */}
        {/* <div className="absolute top-2 right-2 bg-[#7077FEBF] text-white text-xs px-2 py-1 rounded-full">
        {product.progress_percentage}%
      </div> */}
      </div>
      <p className="mt-2 text-[14px] text-[#111827] font-semibold leading-snug line-clamp-2">
        {product.product_name}
      </p>
    </div>
  );
};
const CollectionThumb: React.FC<{ src: string; label?: string }> = ({
  src,
  label,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative rounded-xl overflow-hidden group"  >
      <img src={src} alt={"collection"} className="w-full h-32 object-cover" />
      <button onClick={() => navigate(`/dashboard/my-collections/${label}`)} className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
        <span className="flex items-center gap-2 text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
          <Play size={16} />
          Watch
        </span>
      </button>
    </div>
  )
};

const ProductCard: React.FC<{ p: LibraryProduct }> = ({ p }) => {
  const navigate = useNavigate();

  const getCategoryIcon = (categoryName: string) => {
    const iconMap: { [key: string]: any } = {
      Video: <Video className="w-4 h-4 text-gray-800" />,
      Music: <Music className="w-4 h-4 text-gray-800" />,
      Course: <BookOpen className="w-4 h-4 text-gray-800" />,
      Podcast: <FileAudio className="w-4 h-4 text-gray-800" />,
      eBook: <FileText className="w-4 h-4 text-gray-800" />,
      Art: <Palette className="w-4 h-4 text-gray-800" />,
    };

    return iconMap[categoryName] || "📦";
  };

  return (
    <div
      className="bg-white rounded-[14px] border-[0.5px] border-[#CBD5E1] box-border shadow-sm overflow-hidden">
      <div className="relative">
        <img
          src={
            p.thumbnail_url ||
            "https://static.codia.ai/image/2025-10-15/oXL6MSyn60.png"
          }
          alt={p.product_title}
          className="w-full h-[180px] object-cover rounded-xl sm:h-[150px] md:h-[180px] lg:h-[200px]"
        />
      </div>

      <div className="p-2">
        {/* Top meta: category + seller */}
        <div className="flex items-center justify-between text-[12px] mb-2">
          {p?.moods && p?.moods.length > 0 ? p?.moods?.map((i:any)=>{
            return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280]">
              {i?.icon} {i?.name}
            </span>
          }) :<></>}
          {/* <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-[#6B7280]">
            {p?.moods?.icon} {p?.mood?.name}
          </span> */}
          <span className="inline-flex items-center gap-1 text-[#6B7280]">
            <Star size={14} className="text-[#7077FE] fill-[#7077FE]" />
            <span className="text-[#111827] font-medium">{p.rating.average}</span>
            <span className="text-gray-500">({p.rating.total_reviews})</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[14px] font-medium text-[#111827] leading-snug line-clamp-2"> {p.product_title}</h3>

        {/* Author */}
        <div className="mt-1 text-[12px] text-gray-600">  by {p.seller.shop_name}</div>

        {/* Watch Now button inside content */}
        <button
          onClick={() => navigate(`/dashboard/library/course/${p.product_id}`)}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-[#7077FE] hover:bg-[#5a60ef] text-white text-sm font-medium py-2.5 border border-transparent rounded-[3px] shadow">
          <Play size={20} /> Watch Now
        </button>

        {/* Bottom meta row: Videos on left, duration on right */}
        <div className="mt-3 flex items-center justify-between text-[12px] text-gray-600">
          <span className="inline-flex items-center gap-2">
            {getCategoryIcon(p.category.name)} {p.category.name}
          </span>
          {p.duration && (
            <span className="inline-flex items-center gap-1 text-gray-500">
              <Clock size={14} /> {p.duration}
            </span>
          )}
        </div>
      </div>
    </div >
  )
};

const Library: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("Recently Added");
  const [selectedValue, setSelectedValue] = useState("recently_added");
  const [isOpen, setIsOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  const [continueWatching, setContinueWatching] = useState<
    ContinueWatchingProduct[]
  >([]);
  const [libraryProducts, setLibraryProducts] = useState<LibraryProduct[]>([]);
  const [allLibraryProducts, setAllLibraryProducts] = useState<LibraryProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLibrary, setHasLibrary] = useState(true);
  const [libraryFilterOptions, setLibraryFilterOptions] = useState<any>(null);
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  // const [pagination, setPagination] = useState<any>({});

  useEffect(() => {
    fetchLibraryFilters();
  }, []);

  useEffect(() => {
    fetchContinueWatching();
    fetchCollections();
  }, []);

  useEffect(() => {
    fetchLibrary();
  }, [activeCategory, selectedValue, appliedFilters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== undefined) {
        fetchLibrary();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchLibraryFilters = async () => {
    try {
      const response = await GetLibraryrFilters();
      setLibraryFilterOptions(response?.data?.data || null);
    } catch (error: any) {
      console.error("Failed to load library filters:", error);
    }
  };

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      const response = await GetCollectionList();
      const data = response?.data?.data;

      setCollections(data?.collections || []);
    } catch (error: any) {
      showToast({
        message: "Failed to load collections",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchContinueWatching = async () => {
    try {
      const response = await GetContinueWatchingProductList();
      const data = response?.data?.data;
      setContinueWatching(data?.continue_watching || []);
    } catch (error: any) {
      console.error("Failed to load continue watching:", error);
    }
  };

  const fetchLibrary = async () => {
    setIsLoading(true);
    try {
      const categorySlug =
        activeCategory === "All"
          ? undefined
          : CATEGORY_SLUG_MAP[activeCategory];

      const params: any = {
        page: 1,
        limit: 100,
        category_slug: categorySlug,
        sort_by: selectedValue,
        ...appliedFilters,
      };

      const response = await GetLibraryrDetails(params);

      const data = response?.data?.data;
      let products = data?.library || [];

      // Store all products to check if user truly has empty library
      if (activeCategory === "All" && !query && Object.keys(appliedFilters).length === 0) {
        setAllLibraryProducts(products);
        setHasLibrary(products.length > 0);
      }

      // Apply search filter
      if (query) {
        products = products.filter((p: LibraryProduct) =>
          p.product_title.toLowerCase().includes(query.toLowerCase())
        );
      }

      setLibraryProducts(products);
    } catch (error: any) {
      console.error("Failed to load library:", error);
      showToast({
        message: "Failed to load library",
        type: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const countsByCategory = React.useMemo(() => {
    const map: Record<string, number> = { All: allLibraryProducts.length };

    CATEGORY_TABS.forEach((cat) => {
      if (cat === "All") return;

      map[cat] = allLibraryProducts.filter(
        (p) => p.category.name === cat
      ).length;
    });

    return map;
  }, [allLibraryProducts]);

  const handleFilterChange = (filters: any) => {
    setAppliedFilters(filters);
    fetchLibrary();
  };

  const hasActiveFilters = () => {
    return (
      query ||
      activeCategory !== "All" ||
      Object.keys(appliedFilters).some(
        (key) => appliedFilters[key] !== undefined && appliedFilters[key] !== ""
      )
    );
  };

  if (!hasLibrary && !isLoading) {
    return <EmptyPageLibrary />;
  }

  return (

    <div className="bg-[#FFFFFF] overflow-hidden flex-1 min-h-screen">
      {/* <MarketHeader /> */}

      <div className="mx-auto px-4 sm:px-6 md:px-0 py-2 grid grid-cols-1 md:grid-cols-[1fr_267px] gap-6 overflow-hidden">
        {/* Main content (left) */}
        <main className="space-y-6">
          {/* Continue watching */}
          {continueWatching.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] sm:text-lg font-semibold text-[#111827]">
                  Continue watching
                </h2>
                <button
                  className="text-[#7077FE] text-sm hover:underline"
                  onClick={() => navigate("/dashboard/continue-watching")}
                >
                  View all
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {continueWatching.slice(0, 4).map((product) => (
                  <ContinueWatchingThumb
                    key={product.progress_id}
                    product={product}
                  />
                ))}
              </div>
            </section>
          )}

          {/* My Collections */}
          {collections.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[16px] sm:text-lg font-semibold text-[#111827]">My Collections</h2>
                <button className="text-[#7077FE] text-sm" onClick={() => navigate('/dashboard/collections')}>View all</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {collections?.map((c) => (
                  <CollectionThumb key={c.name} src={c.sample_product_thumbnail} label={c.id} />
                ))}
              </div>
            </section>
          )}

          {/* Search and sort */}
          <section className="grid grid-cols-1 sm:grid-cols-[auto_1fr] sm:items-center gap-3">
            <div className="relative sm:justify-self-start">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-[90vw] max-w-[450px] md:w-[200px] h-9 rounded-[20px] border border-gray-200 bg-white pl-4 pr-10 text-[16px] leading-[150%] tracking-[-0.019em] placeholder-gray-400 focus:outline-none focus:ring-0 focus:border-gray-200"

              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7077FE] hover:opacity-80"
              >
                <Search size={18} />
              </button>
            </div>
            <div className="relative w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between gap-2 px-4 py-[10px] bg-white border border-[#7077FE] rounded-full shadow-sm text-[#7077FE] font-medium text-sm md:text-base hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-2">
                  <img src={filter} alt="filter" className="w-5 h-5" />
                  <span className="truncate">{selected}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && libraryFilterOptions?.sort_options && (
                <div className="absolute top-full mt-2 w-full sm:w-60 bg-white border border-[#7077FE] rounded-2xl shadow-lg z-10 p-4 space-y-3">
                  {libraryFilterOptions.sort_options.map((option: any) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelected(option.label); // Set display label
                        setSelectedValue(option.value); // Set API value
                        setIsOpen(false);
                      }}
                      className={`block w-full text-left font-poppins font-normal text-[16px] leading-[100%] px-2 py-1 rounded-lg transition-colors ${selected === option.label
                        ? "text-[#7077FE] font-semibold"
                        : "text-gray-700 hover:text-[#7077FE]"
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Category chips with item counts (no toggle icon) */}
          <section className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((c) => {
              const active = c === activeCategory;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition ${active
                    ? "bg-[#EEF2FF] border-[#7077FE] text-[#3F51F5]"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span>{c}</span>
                  <span className="ml-1 inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs border border-gray-200 text-gray-600 bg-white">
                    {countsByCategory[c] ?? 0}
                  </span>
                </button>
              );
            })}
          </section>

          {/* My products grid */}
          <section>
            <h3 className="text-[16px] sm:text-lg font-semibold text-[#111827] mb-3">
              My products ({libraryProducts.length})
            </h3>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : libraryProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search size={48} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hasActiveFilters()
                    ? "No products found"
                    : "No products in your library"}
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {query
                    ? `No results found for "${query}". Try different keywords.`
                    : hasActiveFilters()
                      ? "No products match your current filters. Try adjusting your filters."
                      : "Start shopping to add products to your library"}
                </p>
                {hasActiveFilters() && (
                  <button
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                      setAppliedFilters({});
                      setSelected("Recently Added");
                      setSelectedValue("recently_added");
                    }}
                    className="bg-[#7077FE] text-white px-6 py-3 rounded-lg hover:bg-[#5E65F6] transition font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {libraryProducts.map((p) => (
                  <ProductCard key={p.product_id} p={p} />
                ))}
              </div>
            )}

          </section>
        </main>

        {/* Sidebar (right) */}
        <div>
          <FilterSidebar
            filters={appliedFilters}
            onFilterChange={handleFilterChange}
            customFilterOptions={libraryFilterOptions}
            filterConfig={{
              showCategory: true,
              showPrice: false,
              showLanguage: true,
              showDuration: true,
              showRating: false,
              showOrderTime: true,
              showCreatorSearch: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Library;
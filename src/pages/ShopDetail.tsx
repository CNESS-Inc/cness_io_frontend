import { useNavigate, useParams } from "react-router-dom";
import ProductCard from '../components/MarketPlace/ProductCard';
import ShopCard from '../components/MarketPlace/Shopcard';
import { GetMarketPlaceShopById, GetMarketPlaceShops } from "../Common/ServerAPI";
import { useEffect, useState } from "react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CiFacebook, CiInstagram, CiLinkedin, CiYoutube } from "react-icons/ci";
import { RiTwitterXFill } from "react-icons/ri";
import { IoLogoTiktok } from "react-icons/io5";
import { FaPinterestP } from "react-icons/fa";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const socialMediaIcons: Record<string, any> = {
  facebook: <CiFacebook size={30} className='text-white' />,
  instagram: <CiInstagram size={30} className='text-white' />,
  youtube: <CiYoutube size={30} className='text-white' />,
  twitter: <RiTwitterXFill size={30} className='text-white' />,
  tiktok: <IoLogoTiktok size={30} className='text-white' />,
  linkedin: <CiLinkedin size={30} className='text-white' />,
  pinterest: <FaPinterestP size={30} className='text-white' />,
};

const ShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [shop, setShop] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoadingShops, setIsLoadingShops] = useState(false);

  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await GetMarketPlaceShopById(id);
        const shopData = response?.data?.data;
        setShop(shopData);
        setFilteredProducts(shopData?.products || []);
      } catch (error: any) {
        showToast({
          message: "Failed to load shop details",
          type: "error",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShopDetails();
  }, [id]);

  useEffect(() => {
    const fetchShops = async () => {
      setIsLoadingShops(true);
      try {
        const response = await GetMarketPlaceShops({
          limit: 8,
          page: 1,
        });

        const products = response?.data?.data?.shops || [];
        setShops(products);
      } catch (error: any) {
        showToast({
          message: "Failed to load products.",
          type: "error",
          duration: 3000,
        });
        setShops([]);
      } finally {
        setIsLoadingShops(false);
      }
    };

    fetchShops();
  }, []);

  const getCategoryCounts = () => {
    if (!shop?.products) return {};

    const counts: Record<string, number> = {};
    shop.products.forEach((product: any) => {
      const categorySlug = product.category?.slug;
      if (categorySlug) {
        counts[categorySlug] = (counts[categorySlug] || 0) + 1;
      }
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  const handleCategoryClick = (categorySlug: string) => {
    setActiveCategory(categorySlug);

    if (categorySlug === "all") {
      setFilteredProducts(shop?.products || []);
    } else {
      const filtered = shop?.products?.filter(
        (product: any) => product.category?.slug === categorySlug
      ) || [];
      setFilteredProducts(filtered);
    }
  };

  const policies = [
    {
      title: "Refund policy",
      description: "48 hours from the time of purchase are allowed for refunds if a valid reason is provided.",
      icon: "https://static.codia.ai/image/2025-10-24/a00NtDv8Wz.png"
    },
    {
      title: "Licensing & Usage Policy",
      description: "Products include standard personal and commercial usage rights.",
      icon: "https://static.codia.ai/image/2025-10-24/10sgZadFOa.png"
    },
    {
      title: "Terms & Conditions",
      description: "Using this shop means you agree to our terms and conditions.",
      icon: "https://static.codia.ai/image/2025-10-24/Jt1ssOkNvo.png"
    }
  ]

  //const scrollRef = useRef<HTMLDivElement>(null);
  //const [scrollIndex, setScrollIndex] = useState(0);

  //const visibleCards = 5; // number of visible cards at once
  //const cardGap = 24; // gap between cards (in px)
  //const cardWidth = 300; // approximate card width
  //const totalCards = shops.length;

  //const scroll = (direction: "left" | "right") => {
  //if (!scrollRef.current) return;
  //const maxIndex = Math.max(0, totalCards - visibleCards);

  //let newIndex = scrollIndex;
  // if (direction === "right" && scrollIndex < maxIndex) newIndex++;
  //if (direction === "left" && scrollIndex > 0) newIndex--;

  // setScrollIndex(newIndex);
  //scrollRef.current.style.transform = `translateX(-${
  //  newIndex * (cardWidth + cardGap)
  //}px)`;
  //};

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Shop not found</p>
      </div>
    );
  }

  return (
    <main>
      <div className="w-full h-auto ">
        <div className="w-full h-[340px] relative rounded-lg">
          <img
            src={(shop?.shop_banner && shop?.shop_banner !== null) ? shop?.shop_banner : "https://static.codia.ai/image/2025-10-24/d7xW9qdQUK.png"}
            alt={shop?.shop_name || "Store Image"}
            className="w-full h-full object-cover rounded-4xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://static.codia.ai/image/2025-10-24/d7xW9qdQUK.png';
            }}
          />
        </div>

        {/* Shop Info Section */}
        <div className="bg-white/80 rounded-[30px] p-[18px] flex justify-between items-center gap-[27px] h-[162px] mt-8">
          <div className="flex items-center gap-6">
            {!shop?.shop_logo ? (
              <div className="w-[125px] h-[125px] rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-white font-semibold text-[36px]">{shop?.shop_name.charAt(0)}</span>
              </div>
            ) : (
              <img
                src={shop?.shop_logo}
                alt="Products Icon"
                className="w-[125px] h-[125px] rounded-full object-cover"
              />
            )}

            <div className="flex flex-col gap-[14px]">
              <h1 className="font-['open_sans'] font-bold text-[22px] leading-[29.96px] text-[#1A1A1A]">
                {shop?.shop_name}
              </h1>

              <p className="font-['open_sans'] font-normal text-[14px] leading-[19.07px] text-[#665B5B] max-w-[645px]">
                {shop?.about_shop}
              </p>

              <div className="flex items-center gap-3">
                <div className="bg-[#7077FE]/10 rounded-full px-3 py-2 flex items-center gap-3">
                  <img
                    src="https://static.codia.ai/image/2025-10-24/HYMtr97dRz.png"
                    alt="Products Icon"
                    className="w-[18px] h-[18px]"
                  />
                  <span className="font-['open_sans'] text-[12px] text-[#7077FE]">{shop?.product_count || 0} products
                  </span>
                </div>

                <div className="bg-[#7077FE]/10 rounded-full px-3 py-2 flex items-center gap-3">
                  <img
                    src="https://static.codia.ai/image/2025-10-24/nJpNgLwgh9.png"
                    alt="Star Icon"
                    className="w-[18px] h-[18px]"
                  />
                  <span className="font-['open_sans'] text-[12px] text-[#7077FE]">
                    {shop?.rating || "0"} Ratings
                  </span>
                  <div className="w-[3px] h-[3px] bg-[#7077FE] rounded-full"></div>
                  <span className="font-['open_sans'] text-[12px] text-[#7077FE]">
                    {shop?.reviews || "0"} Reviews
                  </span>
                </div>

                <div className="bg-[#7077FE]/10 rounded-full px-3 py-2 flex items-center gap-3">
                  <img
                    src="https://static.codia.ai/image/2025-10-24/AXoOYUGFBm.png"
                    alt="Followers Icon"
                    className="w-[18px] h-[18px]"
                  />
                  <span className="font-['open_sans'] text-[12px] text-[#7077FE]">
                    {shop?.followers || "0"} Followers
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button className="bg-[#7077FE] rounded-md px-5 py-[10px] flex items-center gap-[10px] h-12">
            <img
              src="https://static.codia.ai/image/2025-10-24/xfP7JzOEXk.png"
              alt="Follow Icon"
              className="w-[22px] h-[22px]"
            />
            <span className="font-plus-jakarta font-medium text-[16px] leading-[20.16px] text-white">
              Follow
            </span>
          </button>
        </div>

        {/* Image Gallery Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
          {shop?.extra_banners && shop.extra_banners.length > 0 ? (
            shop.extra_banners
              .sort((a: any, b: any) => a.display_order - b.display_order)
              .slice(0, 3)
              .map((banner: any, index: number) => (
                <img
                  key={banner.id}
                  src={banner.banner_url}
                  alt={`Gallery Image ${index + 1}`}
                  className={`w-[360px] h-[200px] object-cover ${index > 0 ? 'rounded-[14px]' : ''
                    }`}
                />
              ))
          ) : (
            null
          )}
        </div>

        <div className="bg-white rounded-[12px] shadow-[0px_4px_24px_rgba(0,0,0,0.1)] p-[30px_16px] flex flex-col gap-5 mt-8">
          <div className="flex flex-col gap-[13px]">
            <h2 className="font-[poppins] font-semibold text-[18px] leading-[27px] text-black">
              About {shop?.shop_name}
            </h2>

            <p className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
              {shop?.about_shop || ""}
            </p>

            {shop?.why_choose_your_shop && (
              <>
                <h3 className="font-[poppins] font-semibold text-[18px] leading-[27px] text-black">
                  Why choose {shop?.shop_name}?
                </h3>
                <p className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
                  {shop.why_choose_your_shop}
                </p>
              </>
            )}

            <div className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
              <ul className="list-disc list-inside space-y-2">
                <li>
                  <strong>Premium Quality:</strong> Every digital product is curated with attention to detail, usability, and reliability.
                </li>
                <li>
                  <strong>Innovation:</strong> Cutting-edge tools and content designed to inspire and streamline creativity.
                </li>
                <li>
                  <strong>Accessible Learning:</strong> Digital solutions that make skill-building and professional growth easier and more engaging.
                </li>
                <li>
                  <strong>Creative Freedom:</strong> Products that empower creators, learners, and professionals to unlock their full potential.
                </li>
              </ul>
            </div>

            {shop?.shop_philosophy && (
              <>
                <h3 className="font-[poppins] font-semibold text-[18px] leading-[27px] text-black">
                  Our Philosophy
                </h3>
                <p className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
                  {shop.shop_philosophy}
                </p>
              </>
            )}
          </div>

          <div className="flex justify-between items-center gap-7">
            <div className="flex items-center gap-7">
              {shop?.based_on?.country_name && (
                <div className="flex items-center gap-[6px]">
                  <img
                    src="https://static.codia.ai/image/2025-10-24/aeJ6oQZQe1.png"
                    alt="Location Icon"
                    className="w-[22px] h-[22px]"
                  />
                  <span className="font-['open_sans'] font-semibold text-[16px] leading-[21.79px] text-black">
                    Based in :
                  </span>
                  <span className="font-['open_sans'] font-normal text-[16px] leading-[21.79px] text-[#665B5B]">
                    {shop.based_on.country_name}
                  </span>
                </div>
              )}

              {shop?.languages_supported && shop.languages_supported.length > 0 && (
                <div className="flex items-center gap-[6px]">
                  <img
                    src="https://static.codia.ai/image/2025-10-24/CWY7KgB5yL.png"
                    alt="Globe Icon"
                    className="w-[22px] h-[22px]"
                  />
                  <span className="font-['open_sans'] font-semibold text-[16px] leading-[21.79px] text-black">
                    Languages :
                  </span>
                  <span className="font-['open_sans'] font-normal text-[16px] leading-[21.79px] text-[#665B5B]">
                    {shop.languages_supported.join(", ")}
                  </span>
                </div>
              )}

              {shop?.since_date && (
                <div className="flex items-center gap-[6px]">
                  <img
                    src="https://static.codia.ai/image/2025-10-24/BxwyA2MPUa.png"
                    alt="Calendar Icon"
                    className="w-[22px] h-[22px]"
                  />
                  <span className="font-['open_sans'] font-semibold text-[16px] leading-[21.79px] text-black">
                    Active since :
                  </span>
                  <span className="font-['open_sans'] font-normal text-[16px] leading-[21.79px] text-[#665B5B]">
                    {new Date(shop.since_date).getFullYear()}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {shop?.social_links && Object.entries(shop.social_links).map(([platform, url]) => {
                if (!url) return null;

                return (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[42px] h-[42px] bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:bg-[#7077FE]"
                  >
                    {socialMediaIcons[platform] || null}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/*team menbers*/}
        {shop?.team_members && shop.team_members.length > 0 && (
          <div className="bg-white rounded-[12px] shadow-[0px_4px_24px_rgba(0,0,0,0.1)] p-[20px_16px] flex flex-col gap-[10px] mt-8">
            <h2 className="font-[poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A]">
              Our Team
            </h2>

            <div className="flex items-center gap-5 flex-wrap">
              {shop.team_members
                .sort((a: any, b: any) => a.display_order - b.display_order)
                .map((member: any) => (
                  <div
                    key={member.id}
                    className="bg-[#7077FE]/10 rounded-[10px] px-3 py-2 flex items-center gap-2"
                  >
                    <img
                      src={member.profile_image || "https://static.codia.ai/image/2025-10-24/Zf5XeKUZ30.png"}
                      alt={member.name}
                      className="w-[40px] h-[40px] rounded-full object-cover"
                    />
                    <span className="font-['open_sans'] text-[12px] text-[#7077FE]">
                      {member.name}
                    </span>
                    <div className="w-[3px] h-[3px] bg-[#7077FE] rounded-full"></div>
                    <span className="font-['open_sans'] text-[12px] text-[#665B5B]">
                      {member.role}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}


        <div className="bg-white rounded-[12px] shadow-[0px_4px_24px_rgba(0,0,0,0.1)] p-[20px_16px] flex flex-col gap-[10px] mt-8">
          <h2 className="font-[poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A]">
            Store policy
          </h2>

          <div className="flex items-center gap-4">
            {policies.map((policy, index) => (
              <div key={index} className="bg-white border border-[#CBD5E1] rounded-[20px] p-[20px_16px] flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-[10px]">
                  <img
                    src={policy.icon}
                    alt={policy.title}
                    className="w-[40px] h-[40px]"
                  />
                  <h3 className="font-open-sans font-semibold text-[18px] leading-[24.51px] text-[#1A1A1A]">
                    {policy.title}
                  </h3>
                </div>
                <p className="font-open-sans font-normal text-[14px] leading-[19.07px] text-[#665B5B]">
                  {policy.description}
                </p>
              </div>
            ))}
          </div>
        </div>
        {/* Products Section */}

        {/* Products Grid */}

        <div className="flex flex-col justify-center items-center gap-[34px] mt-8">
          <div className="flex flex-col gap-5 w-full">
            <h2 className="font-[poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A]">
              Featured products
            </h2>

            {/* Category Tabs - Dynamic */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleCategoryClick("all")}
                className={`flex items-center gap-3 px-8 py-3 h-[54px] rounded-full border font-medium text-sm transition-all duration-200 ${activeCategory === "all"
                  ? "border-blue-500 text-blue-500 bg-white shadow-sm"
                  : "border-gray-300 text-gray-500 bg-white hover:border-gray-400"
                  }`}
              >
                <span>All</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                    }`}
                >
                  {shop?.product_count || 0}
                </span>
              </button>

              {Object.entries(categoryCounts).map(([slug, count]) => (
                <button
                  key={slug}
                  onClick={() => handleCategoryClick(slug)}
                  className={`flex items-center gap-3 px-8 py-3 h-[54px] rounded-full border font-medium text-sm transition-all duration-200 ${activeCategory === slug
                    ? "border-blue-500 text-blue-500 bg-white shadow-sm"
                    : "border-gray-300 text-gray-500 bg-white hover:border-gray-400"
                    }`}
                >
                  <span className="capitalize">{slug}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === slug
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Products Grid - Dynamic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.product_name,
                      author: `by ${shop.shop_name}`,
                      rating: 4.8,
                      reviews: 123,
                      currentPrice: parseFloat(product.discounted_price),
                      originalPrice:
                        parseFloat(product.discount_percentage) > 0
                          ? parseFloat(product.price)
                          : undefined,
                      discount:
                        parseFloat(product.discount_percentage) > 0
                          ? parseFloat(product.discount_percentage)
                          : undefined,
                      duration: product.duration || "00:00:00",
                      mood: `${product.mood_name || ""}`,
                      image:
                        product.thumbnail_url ||
                        "https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png",
                      category: product.category?.name || "",
                      isLike: product?.is_in_wishlist,
                      isCarted: product?.is_in_cart,
                    }}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">
                  No products found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Shops Section */}
        <div className="flex flex-col gap-6 px-1 sm:px-1 lg:px-1">
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <h2 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] lg:text-[22px] leading-[30px] text-[#242E3A]">
              Related Shops
            </h2>

            <div className="flex items-center gap-4 sm:gap-5">
              <button className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform duration-200">
                <img
                  src="https://static.codia.ai/image/2025-10-24/zRKX6S2Fpz.png"
                  alt="Previous"
                  className="w-full h-full"
                />
              </button>
              <button className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform duration-200">
                <img
                  src="https://static.codia.ai/image/2025-10-24/M6ufGZhDyb.png"
                  alt="Next"
                  className="w-full h-full"
                />
              </button>
            </div>
          </div>

          {/* ✅ Responsive Grid Section */}
          <div
            className="mb-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-5 sm:gap-6 md:gap-8"
          >
            {isLoadingShops ? (
              <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {shops.length > 0 ? (
                  shops.map((shop) => (
                    <div
                      key={shop?.id}
                      onClick={() => navigate(`/dashboard/shop-detail/${shop.id}`)}
                      className="sm:max-w-[320px] md:max-w-[350px] cursor-pointer h-full"
                    >
                      <ShopCard
                        id={shop?.id}
                        image={shop?.shop_image || 'https://static.codia.ai/image/2025-10-24/COYsFisEy4.png'}
                        name={shop?.shop_name}
                        description={shop?.description || ''}
                        rating={shop?.rating || 0}
                        logo={shop?.shop_logo}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10 text-gray-500">
                    No products found for this category
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/*<div className="px-10 py-8">
        <h1 className="text-3xl font-semibold text-gray-900">{store?.name}</h1>
        <p className="text-gray-600 mt-4 text-base max-w-3xl">{store?.description}</p>
      </div>*/}
      </div>
    </main>
  );
};

export default ShopDetail;

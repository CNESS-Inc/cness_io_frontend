import { Banknote, Box, ImagePlus, SquarePen, Store, Star } from "lucide-react";
import { StarRating } from "../../buyer/components/Products/StarRating";

// Define TypeScript interface for props
export interface SellerProfileProps {
  // Required props
  title: string;
  image: string;
  rating: number;

  // Optional props with defaults
  isOnline?: boolean;
  sellerSince?: string;
  totalProducts?: number | string;
  revenue?: string;

  // Customizable stats
  stats?: Array<{
    label: string;
    value: string;
    icon: 'Store' | 'Box' | 'Banknote' | 'Star';
  }>;

  // Feature toggles
  showEditButton?: boolean;
  showHelpButton?: boolean;
  showImageUpload?: boolean;

  // Event handlers
  onEditClick?: () => void;
  onHelpClick?: () => void;
  onImageUploadClick?: () => void;
}

// Icon mapping
const iconMap = {
  Store: Store,
  Box: Box,
  Banknote: Banknote,
  Star: Star,
};

export default function SellerProfile({
  title,
  image,
  rating,
  isOnline = true,
  sellerSince = 'December 1, 2025',
  totalProducts = 16,
  revenue = '$54,000.00',
  stats,
  showEditButton = true,
  showHelpButton = true,
  showImageUpload = true,
  onEditClick,
  onHelpClick,
  onImageUploadClick,
}: SellerProfileProps) {

  // Default stats if not provided
  const defaultStats = [
    {
      label: 'Seller Since',
      value: sellerSince,
      icon: 'Store' as const,
    },
    {
      label: 'Total Products',
      value: totalProducts.toString(),
      icon: 'Box' as const,
    },
    {
      label: 'Revenue',
      value: revenue,
      icon: 'Banknote' as const,
    },
    {
      label: 'Rating',
      value: rating.toFixed(1),
      icon: 'Star' as const,
    },
  ];

  const displayStats = stats || defaultStats;

  // Default event handlers
  const handleEditClick = () => {
    if (onEditClick) onEditClick();
    else console.log('Edit clicked for:', title);
  };

  const handleHelpClick = () => {
    if (onHelpClick) onHelpClick();
    else console.log('Get Help clicked for:', title);
  };

  const handleImageUploadClick = () => {
    if (onImageUploadClick) onImageUploadClick();
    else console.log('Image upload clicked for:', title);
  };

  return (
    <div
      className="
        w-full
        flex flex-col sm:flex-row
        gap-4 sm:gap-4
        p-4 sm:p-[15px]
        rounded-[18px] sm:rounded-[22px]
        border border-[#F3F3F3]
        bg-transparent
        transition-all
      "
    >
      {/* ===== IMAGE SECTION ===== */}
      <div
        className="
          relative
          w-full
          sm:w-[40%] md:w-[45%] lg:w-[50%]
          sm:max-w-[161px]
          aspect-[4/3] sm:aspect-[161/161]
          rounded-[14px] sm:rounded-[18px]
          overflow-hidden
          flex-shrink-0
          mx-auto sm:mx-0
        "
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {showImageUpload && (
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleImageUploadClick}
              className="w-10 h-10 flex items-center justify-center border-[2px] border-[#fff] bg-[#008282] rounded-full hover:bg-[#006666] transition-colors"
              aria-label="Upload image"
            >
              <ImagePlus color="#fff" size={20} />
            </button>
          </div>
        )}
      </div>

      {/* ===== CONTENT SECTION ===== */}
      <div className="w-full flex-1">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4 sm:mb-5">
          {/* Title and Online Status */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 items-center mb-2">
              <h3 className="font-[Poppins] text-[20px] sm:text-[18px] font-medium text-[#000] leading-[1.2] break-words">
                {title}
              </h3>
              {showEditButton && (
                <button
                  onClick={handleEditClick}
                  className="hover:opacity-80 transition-opacity flex-shrink-0"
                  aria-label="Edit profile"
                >
                  <SquarePen color="#B5BBC2" size={20} />
                </button>
              )}
            </div>

            {isOnline && (
              <div className="flex gap-2 items-center">
                <div className="w-[8px] h-[8px] rounded-full bg-[#00CB36] flex-shrink-0"></div>
                <p className="font-open-sans font-normal text-[13px] leading-[135%] text-[#707C8B]">
                  Online now
                </p>
              </div>
            )}
          </div>

          {/* Help Button */}
          {showHelpButton && (
            <div className="self-start sm:self-center">
              <button
                onClick={handleHelpClick}
                className="
                  border 
                  border-[#7077FE] 
                  rounded-[10px]
                  py-2 sm:py-[10px]
                  px-3 sm:px-[20px]
                  font-poppins
                  font-medium
                  text-[14px] sm:text-[16px]
                  leading-[150%]
                  text-[#7077FE]
                  flex
                  items-center
                  justify-center
                  gap-1 sm:gap-[5px]
                  hover:bg-[#7077FE]
                  hover:text-white
                  transition-colors
                  w-full sm:w-auto
                "
              >
                Get Help
                <span className="flex items-center ml-1">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="border-t border-[#929BA7] pt-4 sm:pt-5">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {displayStats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon];
              return (
                <div key={index} className="min-w-0">
                  {/* Stat Label - Hide on smallest screens, show on sm and above */}
                  <p className="
                    font-poppins 
                    font-normal 
                    text-[12px] sm:text-[13px]
                    leading-[135%] 
                    text-[#707C8B]
                    truncate
                    hidden sm:block
                  ">
                    {stat.label}
                  </p>
                  <p className="
                    font-poppins 
                    font-normal 
                    text-[12px] sm:text-[13px]
                    leading-[135%] 
                    text-[#707C8B]
                    truncate
                    block sm:hidden
                  ">
                    {stat.label.split(' ').pop()}
                  </p>
                  
                  {/* Stat Value with Icon */}
                  <div className="flex items-center gap-2 mt-1">
                    <IconComponent 
                      color="#B5BBC2" 
                      size={18} 
                      className="flex-shrink-0"
                    />
                    <p className="
                      font-open-sans 
                      font-semibold 
                      text-[14px] sm:text-[16px]
                      leading-[135%] 
                      text-[#242424]
                      truncate
                      flex-1
                    ">
                      {stat.value}
                    </p>
                    
                    {/* Star Rating - Only for Star icon */}
                    {stat.icon === 'Star' && (
                      <div className="ml-1 flex-shrink-0">
                        <StarRating 
                          rating={rating} 
                          size="small" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
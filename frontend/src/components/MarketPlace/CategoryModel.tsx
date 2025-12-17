import React, { useState } from "react";
import {
  X,
  Music,
  Video,
  BookOpen,
  FileAudio,
  FileText,
  Palette,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (categoryName: string) => void;
  loading?: boolean;
  error?: any;
  category?: any[];
}

// Static icon mapping
const getCategoryIcon = (categoryName: string) => {
  const iconMap: { [key: string]: any } = {
    "Video": <Video className="w-8 h-8" />,
    "Music": <Music className="w-8 h-8" />,
    "Course": <BookOpen className="w-8 h-8" />,
    "Podcast": <FileAudio className="w-8 h-8" />,
    "Podcasts": <FileAudio className="w-8 h-8" />,
    "eBook": <FileText className="w-8 h-8" />,
    "Ebook": <FileText className="w-8 h-8" />,
    "Arts": <Palette className="w-8 h-8" />,
  };

  return iconMap[categoryName] || <BookOpen className="w-8 h-8" />;
};

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  onSelect,
  loading = false,
  error = null,
  category = [],
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  const handleSelect = (categoryName: string) => {
    setSelected(categoryName);
    onSelect(categoryName);
  };

  const lockedCategories = ["Course", "eBook", "Podcast"];


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-[20px] shadow-lg p-5 w-[832px] h-[612px] flex flex-col items-center justify-start animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mt-4 mb-6">
          <h2 className="text-[20px] font-semibold font-['Poppins'] text-[#242E3A] mb-1">
            Choose Product Category
          </h2>
          <p className="text-[14px] text-[#665B5B] font-['Open_Sans']">
            Select the most suitable category for your new product before
            proceeding with the upload.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {category.map((cat) => (
             <button
  key={cat.id}
  onClick={() => {
    if (lockedCategories.includes(cat.name)) return; // ❌ disable click
    handleSelect(cat.name);
  }}
  className={`
    group relative flex flex-col items-center justify-center rounded-xl border-[0.5px]
    transition-all duration-300 ease-in-out text-[16px] font-['Open_Sans'] font-semibold
    w-[253px] h-[211px]
    ${selected === cat.id
      ? "bg-[#F3F1FF] text-[#242E3A] border-[#7077FE] shadow-md"
      : "bg-[#F3F1FF] text-[#242E3A] border-[#F3F1FF]"
    }
    hover:border-[#7077FE] hover:bg-[#F6F5FF] hover:shadow-[0_0_0_2px_rgba(112,119,254,0.15)] hover:text-[#7077FE]
    ${lockedCategories.includes(cat.name)
      ? "opacity-60 blur-[0.5px] cursor-not-allowed"
      : ""
    }
  `}
  style={{
    paddingTop: "46px",
    paddingRight: "94px",
    paddingBottom: "46px",
    paddingLeft: "94px",
  }}
>
  {/* 🔒 LOCK OVERLAY */}
  {lockedCategories.includes(cat.name) && (
    <div className="absolute top-3 right-3 bg-[#00000080] backdrop-blur-sm p-2 rounded-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 1a5 5 0 00-5 5v4H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-1V6a5 5 0 00-5-5zm-3 5a3 3 0 016 0v4H9V6zm-1 6h10v9H8v-9z" />
      </svg>
    </div>
  )}

  {/* Optional Tooltip */}
  {lockedCategories.includes(cat.name) && (
    <span className="absolute bottom-3 text-[12px] text-[#7077FE] font-medium">
      Coming Soon
    </span>
  )}

  {/* Icon */}
  <div
    className={`transition-colors duration-200 ${
      selected === cat.id
        ? "text-[#242E3A]"
        : "text-[#242E3A] group-hover:text-[#7077FE]"
    }`}
  >
    {getCategoryIcon(cat.name)}
  </div>

  <span className="mt-4">{cat.name}</span>
</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryModal;
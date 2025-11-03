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

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (category: string) => void;
}

const categories = [
  { name: "Video",URL:"/dashboard/products/add-video" ,icon: <Video className="w-8 h-8" /> },
  { name: "Music", URL:"/dashboard/products/add-music",icon: <Music className="w-8 h-8" /> },
  { name: "Course", URL:"/dashboard/products/add-course",icon: <BookOpen className="w-8 h-8" /> },
  { name: "Podcasts",URL:"/dashboard/products/add-podcast", icon: <FileAudio className="w-8 h-8" /> },
  { name: "Ebook", URL:"/dashboard/products/add-ebook",icon: <FileText className="w-8 h-8" /> },
  { name: "Arts",URL:"/dashboard/products/add-arts", icon: <Palette className="w-8 h-8" /> },
];

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  const handleSelect = (category: string) => {
    setSelected(category);
    onSelect(category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-[20px] shadow-lg p-[20px] w-[832px] h-[612px] flex flex-col items-center justify-start animate-fadeIn">
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

        {/* Category Grid */}
        <div className="grid grid-cols-3 gap-6">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleSelect(cat.name)}
              className={`group flex flex-col items-center justify-center rounded-[12px] border-[0.5px]
                transition-all duration-300 ease-in-out text-[16px] font-['Open_Sans'] font-semibold
                w-[253px] h-[211px] 
                ${
                  selected === cat.name
                    ? "bg-[#F3F1FF] text-[#242E3A] border-[#7077FE] shadow-md"
                    : "bg-[#F3F1FF] text-[#242E3A] border-[#F3F1FF]"
                }
                hover:border-[#7077FE] hover:bg-[#F6F5FF] hover:shadow-[0_0_0_2px_rgba(112,119,254,0.15)] hover:text-[#7077FE]
              `}
              style={{
                paddingTop: "46px",
                paddingRight: "94px",
                paddingBottom: "46px",
                paddingLeft: "94px",
              }}
            >
              <div
                className={`transition-colors duration-200 ${
                  selected === cat.name
                    ? "text-[#242E3A]"
                    : "text-[#242E3A] group-hover:text-[#7077FE]"
                }`}
              >
                {cat.icon}
              </div>
              <span className="mt-4">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;

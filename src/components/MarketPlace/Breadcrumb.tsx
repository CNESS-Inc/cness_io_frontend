import React from "react";
import { ChevronRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface BreadcrumbProps {
  onAddProductClick: () => void;
  onSelectCategory?: (category: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ onAddProductClick, onSelectCategory }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.split("/").filter(Boolean).pop() || "";

  const labelMap: Record<string, string> = {
    "add-video": "Video",
    "add-music": "Music",
    "add-course": "Course",
    "add-ebook": "Ebook",
    "add-podcast": "Podcast",
    "add-arts": "Arts",
  };

  const currentLabel = labelMap[path] || "Product";
  const crumbs = ["Products", "Add product", currentLabel];

  return (
    <div className="flex items-center text-sm text-[#665B5B] font-['Open_Sans'] mb-6 space-x-1">
      {crumbs.map((label, i) => (
        <div key={i} className="flex items-center space-x-1">
          <span
            className={`${
              i === crumbs.length - 1
                ? "text-[#242E3A] font-semibold"
                : "text-[#665B5B] hover:text-[#242E3A] cursor-pointer"
            }`}
            onClick={() => {
              if (label === "Products") {
                navigate("/dashboard/products");
              } else if (label === "Add product") {
                onAddProductClick();
              } else if (onSelectCategory) {
                onSelectCategory(label); // will handle navigate from parent
              }
            }}
          >
            {label}
          </span>
          {i !== crumbs.length - 1 && (
            <ChevronRight className="w-4 h-4 text-[#665B5B]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;

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

  const path = location.pathname.split("/").filter(Boolean);
  const lastSegment = path[path.length - 1] || "";
  const secondLastSegment = path[path.length - 2] || "";

  // Check if it's an edit page (has UUID pattern or edit in path)
  const isEditPage = lastSegment.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) ||
    secondLastSegment.startsWith('edit-');

  const labelMap: Record<string, string> = {
    "add-video": "Video",
    "add-music": "Music",
    "add-course": "Course",
    "add-ebook": "Ebook",
    "add-podcast": "Podcast",
    "add-arts": "Arts",
  };

  let action = "Add product";
  let currentLabel = "Product";

  if (isEditPage) {
    action = "Edit product";
    currentLabel = labelMap[secondLastSegment] || "Product";
  } else {
    currentLabel = labelMap[lastSegment] || "Product";
  }
  const crumbs = ["Products", action, currentLabel];

  const handleCrumbClick = (label: string) => {
    if (label === "Products") {
      navigate("/dashboard/products");
    } else if (label === "Add product") {
      // Only handle "Add product" click, not "Edit product"
      if (!isEditPage) {
        onAddProductClick();
      }
    } else if (onSelectCategory && !isEditPage) {
      onSelectCategory(label);
    }
  };

  const isClickable = (label: string, index: number) => {
    if (label === "Products") return true;

    if (label === "Add product" && !isEditPage) return true;

    if (label === "Edit product") return false;

    if (index !== crumbs.length - 1 && !isEditPage && onSelectCategory) return true;

    return false;
  };

  return (
    <div className="flex items-center text-sm text-[#665B5B] font-['Open_Sans'] mb-6 space-x-1">
      {crumbs.map((label, i) => (
        <div key={i} className="flex items-center space-x-1">
          <span
            className={`${i === crumbs.length - 1
                ? "text-[#242E3A] font-semibold"
                : isClickable(label, i)
                  ? "text-[#665B5B] hover:text-[#242E3A] cursor-pointer"
                  : "text-[#665B5B]"
              }`}
            onClick={() => isClickable(label, i) && handleCrumbClick(label)}
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

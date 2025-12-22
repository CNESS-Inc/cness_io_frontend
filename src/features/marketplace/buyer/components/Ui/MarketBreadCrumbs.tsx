import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const MarketBreadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-[8px] text-[13px] text-[#6b7280]">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-[8px]">
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-[#7076fe] transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-[#363842] font-medium">
              {item.label}
            </span>
          )}

          {index < items.length - 1 && (
            <span className="text-[#9ca3af]">›</span>
          )}
        </div>
      ))}
    </nav>
  );
};

export default MarketBreadcrumbs;

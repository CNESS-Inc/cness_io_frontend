import home from "../../../../assets/house.svg";
import { Link } from "react-router-dom";


interface NavItem {
  label?: string;
  icon?: string;
  badge?: string;
  path: string;
}

export default function MarketplaceNavBar() {
const navItems: NavItem[] = [
  { icon: home, path: "/dashboard/new-marketplace" }, // Home
  { label: "Categories", path: "/dashboard/new-marketplace/categories" },
  { label: "Sellers", path: "/dashboard/new-marketplace/sellers" },
  { label: "Order History", path: "/dashboard/new-marketplace/ordershistory" },
  { label: "My Library", path: "/dashboard/new-marketplace/library" },
  { label: "Wishlist", path: "/dashboard/new-marketplace/wishlist" },
  { label: "Cart", badge: "05", path: "/dashboard/new-marketplace/cart" },
];

  return (
<header
  className="w-full
  bg-gradient-to-r from-white to-[#F1F3FF]
  border-b border-[#0000001a]"
>
<div className="flex w-full min-w-0 px-3 sm:px-6 py-3 sm:py-4 items-center gap-3">

    {/* LEFT NAVIGATION */}
    <nav
      className="
       flex-1 min-w-0 
    flex items-center gap-3 sm:gap-[18px]
    overflow-x-auto
    whitespace-nowrap
    scrollbar-hide
      "
    >
      {navItems.map((item, index) => (
      <Link
  key={index}
  to={item.path}
  className="
    relative
    flex items-center gap-2
    h-[44px] sm:h-[50px]
    px-2 sm:px-2.5
    cursor-pointer
    shrink-0
    hover:text-[#7076fe]
  "
>
          {item.icon && (
            <img
              src={item.icon}
              alt={item.label}
              className="w-[22px] sm:w-[24px] h-[22px] sm:h-[24px]"
            />
          )}

          {/* LABEL — hidden on small screens */}
          {item.label && (
            <span
              className="
                
                font-[Poppins]
                text-[14px]
                text-[#3d3d3d]
                whitespace-nowrap
              "
            >
              {item.label}
            </span>
          )}

          {/* BADGE */}
          {item.badge && (
            <span
              className="
              absolute
      top-2 right-0
      translate-x-1/2 -translate-y-1/2
      min-w-[18px] h-[18px]
      px-1
      text-[10px]
      font-medium
      text-white
      rounded-full
      bg-gradient-to-r from-[#D479D7] to-[#483EC5]
      flex items-center justify-center
      pointer-events-none
              "
            >
              {item.badge}
            </span>
          )}
       </Link>
      ))}
    </nav>

    {/* RIGHT ACTIONS */}
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">

      {/* Become Seller */}
      <button
        className="
          flex items-center gap-2
          text-[#623fff]
          font-[Poppins]
          text-[12px] sm:text-[14px]
          whitespace-nowrap
        "
      >
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/Bs4LxOMQTm.png"
          className="w-[14px] sm:w-[15px] h-[14px] sm:h-[15px]"
        />
        <span className="hidden sm:inline">Become a Seller</span>
      </button>

      <span className="hidden sm:block w-px h-[14px] bg-gray-300" />

      {/* Points */}
      <div
        className="
          flex items-center gap-2
          px-2 sm:px-3 py-1
          bg-[#f4f1ff]
          rounded-full
          border border-[#7076fe]
        "
      >
        <img
          src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/EZ890zwHkW.png"
          className="w-[14px] sm:w-[15px] h-[14px] sm:h-[15px]"
        />
        <span
          className="
            font-[Poppins]
            text-[12px] sm:text-[14px]
            font-semibold
            text-[#080f20]
          "
        >
          80pts
        </span>
      </div>
    </div>
  </div>
</header>

  );
}

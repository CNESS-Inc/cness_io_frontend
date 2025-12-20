import home from "../../../../assets/house.svg";


interface NavItem {
  label?: string;
  icon?: string;
  badge?: string;
  
}

export default function MarketplaceNavBar() {
const navItems: NavItem[] = [
  { icon: home },          // Home icon only
  { label: "Categories" },
  { label: "Sellers" },
  { label: "Order History" },
  { label: "My Library" },
  { label: "Wishlist" },
  { label: "Cart", badge: "05" },
];

  return (
<header className=" w-full
    bg-gradient-to-r from-white to-[#F1F3FF]
    border-b border-[#0000001a]">
<div className="flex w-full px-6 py-4 justify-between items-center">
        
        {/* LEFT NAVIGATION */}
        <nav className="flex items-center gap-[18px]">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="relative flex items-center gap-2 h-[50px] px-[10px] cursor-pointer"
            >
              {item.icon && (
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-[24px] h-[24px]"
                />
              )}

              <span className="font-[Poppins] text-[14px] text-[#3d3d3d] whitespace-nowrap">
                {item.label}
              </span>

              {item.badge && (
                <span className="absolute -top-1 -right-1
    flex items-center justify-center
    h-[20px]
    px-[4px] py-[8px]
    text-[10px] font-medium text-white
    rounded-[30px]
    bg-gradient-to-r from-[#D479D7] to-[#483EC5]
    leading-none">
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">
          {/* Become Seller */}
          <button className="flex items-center gap-2 text-[#623fff] font-[Poppins] text-[14px]">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/Bs4LxOMQTm.png"
              className="w-[15px] h-[15px]"
            />
            Become a Seller
          </button>

          <span className="w-px h-[14px] bg-gray-300" />

          {/* Points */}
          <div className="flex items-center gap-2 px-3 py-1 bg-[#f4f1ff] rounded-full border border-[#7076fe]">
            <img
              src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-18/EZ890zwHkW.png"
              className="w-[15px] h-[15px]"
            />
            <span className="font-[Poppins] text-[14px] font-semibold text-[#080f20]">
              80pts
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

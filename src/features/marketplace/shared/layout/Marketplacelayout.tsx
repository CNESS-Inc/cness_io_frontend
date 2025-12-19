import { Outlet } from "react-router-dom";
import MarketplaceNavBar from "../../buyer/components/MarketplaceNavBar";

export default function MarketplaceLayout() {
  return (
    <div className="w-full flex flex-col">
      {/* Marketplace-only header */}
      <MarketplaceNavBar />

      {/* Marketplace content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

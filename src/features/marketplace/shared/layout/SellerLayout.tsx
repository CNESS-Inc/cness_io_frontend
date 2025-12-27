import { Outlet } from "react-router-dom";

export default function SellerLayout() {
  return (
<div className="w-full flex flex-col overflow-x-hidden min-w-0">
      {/* Marketplace-only header */}
 
   

      {/* Marketplace content */}
  <div className="flex-1 min-w-0">
          <Outlet />
      </div>
    </div>
  );
}

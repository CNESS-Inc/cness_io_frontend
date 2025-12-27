import Search from "../Search";
import DateFilter from "../Ui/DateFilter";
import { useState } from "react";

interface HeaderProps {
  orderCount: number;
}

const dateOptions = [
  { label: "Past 3 months", value: "3m" },
  { label: "Past 6 months", value: "6m" },
  { label: "Past 1 year", value: "1y" },
];

export default function OrderHeader({ orderCount }: HeaderProps) {
  const [range, setRange] = useState("3m");

  return (
    <div className="w-full pt-8 sm:pt-12 lg:pt-20 px-4 sm:px-0">
      
      <div className="flex flex-wrap items-center justify-between gap-4">

        {/* LEFT: TITLE */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/3qxCx9HpNA.png)] bg-cover bg-no-repeat" />
          <span className="font-['Poppins'] text-lg sm:text-xl font-semibold text-black">
            Order History
          </span>
          <span className="px-2 py-0.5 bg-[#e9f0ff] rounded-md text-sm font-medium text-[#102b6b]">
            {orderCount.toString().padStart(2, "0")}
          </span>
        </div>

        {/* RIGHT: SEARCH + FILTER */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">

          {/* Search should grow */}
          <div className="flex-1 min-w-[220px]">
            <Search />
          </div>

          {/* Date filter should NOT shrink */}
          <div className="shrink-0 min-w-[160px]">
            <DateFilter
              options={dateOptions}
              value={range}
              onChange={setRange}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
import Search from '../Search';
import DateFilter from '../Ui/DateFilter';
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
    <div className="flex w-full pt-[80px] pr-0 pb-0 pl-[20px] gap-[20px] items-center shrink-0 flex-nowrap relative z-[1]">
      <div className="flex justify-between items-center grow shrink-0 basis-0 flex-nowrap relative z-[2]">
        <div className="flex w-[197px] gap-[10px] items-center shrink-0 flex-nowrap relative z-[3]">
          <div className="w-[24px] h-[24px] shrink-0 bg-[url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/3qxCx9HpNA.png)] bg-cover bg-no-repeat relative overflow-hidden z-[4]" />
          <span className="h-[30px] shrink-0 basis-auto font-['Poppins'] text-[20px] font-semibold leading-[30px] text-[#000] tracking-[-0.6px] relative text-left whitespace-nowrap z-[5]">
            Order History
          </span>
          <div className="flex w-[26px] pt-0 pr-[4px] pb-0 pl-[4px] flex-col gap-[10px] justify-center items-center self-stretch shrink-0 flex-nowrap bg-[#e9f0ff] rounded-[5px] relative z-[6]">
            <span className="h-[21px] self-stretch shrink-0 basis-auto font-['Poppins'] text-[14px] font-medium leading-[21px] text-[#102b6b] tracking-[-0.42px] relative text-left whitespace-nowrap z-[7]">
              {orderCount.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
        <div className="flex w-[447px] gap-[10px] items-center shrink-0 flex-nowrap relative z-[8]">
        <Search />
  <DateFilter
        options={dateOptions}
        value={range}
        onChange={setRange}
      />
        </div>
      </div>
    </div>
  );
}

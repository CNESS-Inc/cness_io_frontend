import { useState } from "react";
import DateFilter from "../../buyer/components/Ui/DateFilter";
import nandhiji from "../../../../assets/nandhiji.svg";


const dateOptions = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },
];

// Updated dummy chart data to match the image
const dummyChartData = [
    { month: nandhiji, revenue: 400 },
    { month: nandhiji, revenue: 300 },
    { month: nandhiji, revenue: 200 },
    { month: nandhiji, revenue: 100 },
    { month: nandhiji, revenue: 50 },
];

export default function TopBuyers() {
    const [range, setRange] = useState("7d");

    const maxRevenue = Math.max(...dummyChartData.map(item => item.revenue));
    const chartHeight = 250;

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-[15px] rounded-[18px] sm:rounded-[22px] border border-[#F3F3F3] bg-gradient-to-t from-[#FFFFFF] to-[#F2F4FF] transition-all">
            <div className="w-full">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="font-inter font-normal text-[14px] leading-[20px] tracking-normal text-[#B5BBC2]">
                            Statistics
                        </p>
                        <h3 className="font-inter font-bold text-[18px] leading-[28px] tracking-normal text-[#242424]">
                            Top Buyers
                        </h3>
                    </div>
                    <div>
                        <DateFilter
                            options={dateOptions}
                            value={range}
                            onChange={setRange}
                        />
                    </div>
                </div>

                {/* Chart Section */}
                <div className="flex items-end justify-between relative mb-3">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between items-end pr-2 text-[12px] text-gray-500 font-medium">
                        <span>400</span>
                        <span>300</span>
                        <span>200</span>
                        <span>100</span>
                        <span>0</span>
                    </div>

                    {/* Grid lines */}
                    <div className="absolute left-8 right-0 top-0 bottom-0 flex flex-col justify-between">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-t border-gray-200 w-full"></div>
                        ))}
                    </div>

                    {/* Bars */}
                    <div className="flex items-end justify-between w-full pl-10 pr-4 h-full">
                        {dummyChartData.map((item, index) => {
                            const barHeight = (item.revenue / maxRevenue) * (chartHeight - 50);
                            // const isLast = index === dummyChartData.length - 1;

                            return (
                                <div key={index} className="flex flex-col items-center justify-end h-full relative group">
                                    {/* Hover tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
                                        <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-center">
                                            <div className="text-gray-900 font-semibold text-[14px]">
                                                ${item.revenue}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bar */}
                                    <div
                                        className="w-[10px] rounded-t-lg relative overflow-hidden transition-all duration-300 hover:opacity-90"
                                        style={{ height: `${barHeight}px` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#6366F1] to-[#A5B4FC]"></div>
                                    </div>

                                    {/* Month label */}
                                    <span className="text-gray-600 text-[14px] font-medium mt-2">
                                        <img src={item.month} alt="" />
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* X-axis label */}
                    <div className="absolute -bottom-6 left-0 right-0 text-center">
                        <span className="text-gray-500 text-[12px] font-medium">Month</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
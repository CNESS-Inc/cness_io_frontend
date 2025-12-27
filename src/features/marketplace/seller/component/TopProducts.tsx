import { useState } from "react";
import DateFilter from "../../buyer/components/Ui/DateFilter";

const dateOptions = [
    { label: "Last 7 Days", value: "7d" },
    { label: "Last 30 Days", value: "30d" },
    { label: "Last 90 Days", value: "90d" },
];

// Updated dummy data to match the image style - product names with completion percentages
const dummyProductData = [
    { name: "Dance of sidh...", percentage: 95, color: "bg-[#4A3AFF]" },
    { name: "Soufful music...", percentage: 75, color: "bg-[#E0C6FD]" },
    { name: "God within you", percentage: 65, color: "bg-[#962DFF]" },
    { name: "Inner meditati...", percentage: 55, color: "bg-[#C6D2FD]" },
];

export default function TopProducts() {
    const [range, setRange] = useState("7d");

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-[15px] rounded-[18px] sm:rounded-[22px] border border-[#F3F3F3] bg-gradient-to-t from-[#FFFFFF] to-[#F2F4FF] transition-all">
            <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-inter font-normal text-[14px] leading-[20px] tracking-normal text-[#B5BBC2]">
                            Statistics
                        </p>
                        <h3 className="font-inter font-bold text-[18px] leading-[28px] tracking-normal text-[#242424]">
                            Top Products
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

                {/* Horizontal Progress Bars Section */}
                <div className="space-y-6">
                    {dummyProductData.map((product, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between  gap-4">
                                <span className="font-inter font-medium text-[14px] leading-[20px] text-[#242424] truncate flex-shrink-0 w-32">
                                    {product.name}
                                </span>
                                <div className="flex-grow">
                                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden relative">
                                        {/* Progress bar */}
                                        <div
                                            className={`h-full rounded-full ${product.color} transition-all duration-500 ease-out relative`}
                                            style={{ width: `${product.percentage}%` }}
                                        >
                                            {/* Optional: Add shimmer effect for better visual */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                        </div>
                                    </div>

                                    {/* Percentage scale - Only show under the last progress bar */}
                                    {index === dummyProductData.length - 1 && (
                                        <>
                                            {/* Percentage labels */}
                                            <div className="flex justify-between items-center mt-4 mb-1">
                                                <span className="font-inter font-normal text-[12px] leading-[16px] text-[#B5BBC2]">0%</span>
                                                <span className="font-inter font-normal text-[12px] leading-[16px] text-[#B5BBC2]">50%</span>
                                                <span className="font-inter font-normal text-[12px] leading-[16px] text-[#B5BBC2]">100%</span>
                                            </div>
                                            {/* Scale markers */}
                                            <div className="flex justify-between items-center px-1">
                                                <div className="w-1 h-1 bg-[#B5BBC2] rounded-full"></div>
                                                <div className="w-1 h-1 bg-[#B5BBC2] rounded-full"></div>
                                                <div className="w-1 h-1 bg-[#B5BBC2] rounded-full"></div>
                                                <div className="w-1 h-1 bg-[#B5BBC2] rounded-full"></div>
                                                <div className="w-1 h-1 bg-[#B5BBC2] rounded-full"></div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
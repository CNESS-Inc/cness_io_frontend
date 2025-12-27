export default function Revenue() {
    const availablePercentage = 65;
    const pendingPercentage = 35;
    const totalIncome = 54000;
    const radius = 60;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;
    const availableStrokeDashoffset = circumference - (availablePercentage / 100) * circumference;
    const pendingStrokeDashoffset = circumference - (pendingPercentage / 100) * circumference;

    return (
        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-8 p-3 sm:p-[15px] rounded-[18px] sm:rounded-[22px] border border-[#F3F3F3] bg-gradient-to-t from-[#FFFFFF] to-[#F2F4FF] transition-all">
            <div className="w-full">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="font-inter font-normal text-[14px] leading-[20px] tracking-normal text-[#B5BBC2]">
                            Statistics
                        </p>
                        <h3 className="font-inter font-bold text-[18px] leading-[28px] tracking-normal text-[#242424]">
                            Revenue
                        </h3>
                    </div>
                    <div>
                        <p className="font-inter font-medium text-[16px] leading-[28px] tracking-normal text-[#7077FE] underline underline-offset-[25%] decoration-[1.5px]">
                            Withdraw
                        </p>
                    </div>
                </div>
                <div className="">
                    <div className="relative">
                        {/* Donut Chart Container */}
                        <div className="relative w-[160px] h-[160px] m-auto">
                            {/* Background circle */}
                            <svg className="w-full h-full transform -rotate-90">
                                {/* Background track */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    stroke="#F0F0F0"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                />
                                {/* Available segment - Blue */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    stroke="#4A3AFF"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={availableStrokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700 ease-out"
                                />
                                {/* Pending segment - Purple */}
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    stroke="#962DFF"
                                    strokeWidth={strokeWidth}
                                    fill="transparent"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={pendingStrokeDashoffset}
                                    strokeLinecap="round"
                                    className="transition-all duration-700 ease-out"
                                    style={{
                                        strokeDashoffset: circumference - (pendingPercentage / 100) * circumference
                                    }}
                                />
                            </svg>

                            {/* Center text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="font-inter font-normal text-sm text-center text-[#615E83] leading-[18px] tracking-normal">
                                    Total income
                                </span>
                                <span className="font-inter font-bold text-base text-center text-[#1E1B39] leading-[28px] tracking-normal">
                                    ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Percentage indicators */}
                        <div className="flex items-center justify-center gap-4 mt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#4A3AFF]"></div>
                                <span className="font-inter font-medium text-[12px] leading-[16px] text-[#242424]">
                                    Available {availablePercentage}%
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#962DFF]"></div>
                                <span className="font-inter font-medium text-[12px] leading-[16px] text-[#242424]">
                                    Pending {pendingPercentage}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
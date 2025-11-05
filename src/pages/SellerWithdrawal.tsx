import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import availablebalance from "../assets/availablebalance.svg";
import pendingbalance from "../assets/pendingbalance.svg";
import totalbalance from "../assets/totalbalance.svg";

const balanceCards = [
    {
        title: "Total Balance",
        amount: "$23,456",
        iconBg: "#F2E9FF",
        icon: totalbalance,
    },
    {
        title: "Available Balance",
        amount: "$21,115",
        iconBg: "#FFE2CD",
        icon: availablebalance,
    },
    {
        title: "Pending Balance",
        amount: "$2,341",
        iconBg: "#E8F3F0",
        icon: pendingbalance,
    },
];

interface WithdrawalRowProps {
    amount: string;
    date: string;
    status: "Completed" | "Cancelled" | "Pending";
}

const withdrawalData = [
    {
        amount: "$1259",
        date: "12/12/2024",
        status: "Completed" as const,
    },
    {
        amount: "$5000",
        date: "07/11/2023",
        status: "Cancelled" as const,
    },
    {
        amount: "$12000",
        date: "12/12/2024",
        status: "Pending" as const,
    },
    {
        amount: "$394",
        date: "12/12/2024",
        status: "Completed" as const,
    },
    {
        amount: "$394",
        date: "12/12/2024",
        status: "Completed" as const,
    },
    {
        amount: "$230",
        date: "12/12/2024",
        status: "Completed" as const,
    },
    {
        amount: "$230",
        date: "12/12/2024",
        status: "Completed" as const,
    },
    {
        amount: "$230",
        date: "12/12/2024",
        status: "Completed" as const,
    },
];

// Helper function to get status style
const getStatusStyle = (status: string) => {
    switch (status) {
        case "Completed":
            return "bg-[#3D9A7D33] text-[#3D9A7D]";
        case "Cancelled":
            return "bg-[#E5E5E5] text-[#8D8D8D]";
        case "Pending":
            return "bg-[#E2E4FF] text-[#7077FE]";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

const WithdrawalRow: React.FC<WithdrawalRowProps> = ({ amount, date, status }) => (
    <tr className="hover:bg-[#F9FAFB] transition">
        <td className="py-4 px-6 text-center align-middle font-['Open_Sans'] text-[14px] text-[#1A1A1A]">
            {amount}
        </td>
        <td className="py-4 px-6 text-center align-middle font-['Open_Sans'] text-[14px] text-[#1A1A1A]">
            {date}
        </td>
        <td className="py-4 px-6 text-center align-middle">
            <span
                className={`inline-block w-full py-[6px] rounded-full text-[13px] font-semibold leading-[18px] ${getStatusStyle(
                    status
                )}`}
            >
                {status}
            </span>
        </td>
    </tr>
);


const SellerWithdrawal: React.FC = () => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    // sorting logic
    const sortedWithdrawals = useMemo(() => {
        let sorted = [...withdrawalData];
        if (sortConfig) {
            sorted.sort((a, b) => {
                const key = sortConfig.key as keyof typeof withdrawalData[0];

                if (key === "amount") {
                    const amountA = Number(a.amount.replace("$", ""));
                    const amountB = Number(b.amount.replace("$", ""));
                    return sortConfig.direction === "asc" ? amountA - amountB : amountB - amountA;
                }

                if (key === "date") {
                    const [dayA, monthA, yearA] = a.date.split("/").map(Number);
                    const [dayB, monthB, yearB] = b.date.split("/").map(Number);
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return sortConfig.direction === "asc"
                        ? dateA.getTime() - dateB.getTime()
                        : dateB.getTime() - dateA.getTime();
                }

                if (key === "status") {
                    const valA = a.status.toLowerCase();
                    const valB = b.status.toLowerCase();
                    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
                }

                return 0;
            });
        }
        return sorted;
    }, [sortConfig]);

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcons = (key: string) => {
        const isActive = sortConfig?.key === key;
        const isAsc = sortConfig?.direction === "asc";
        return (
            <div className="flex flex-col items-center -space-y-[2px]">
                <ChevronUp
                    className={`w-3 h-3 ${isActive && isAsc ? "text-black" : "text-gray-400"}`}
                />
                <ChevronDown
                    className={`w-3 h-3 ${isActive && !isAsc ? "text-black" : "text-gray-400"}`}
                />
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full overflow-hidden">
            {/* Header Row: Breadcrumb + Back button */}
            <div className="flex items-center justify-between">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-800">
                    <span
                        className="cursor-pointer hover:text-[#7077FE] transition"
                        onClick={() => navigate(-1)}
                    >
                       Sales
                    </span>
                    <span>›</span>
                    <span className="font-['Open_Sans'] font-normal text-[14px] leading-[26px] tracking-[0] text-[#8A8A8A]">
                        Withdrawal
                    </span>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="border border-[#D1D5DB] bg-white rounded-lg text-[#7077FE] px-5 py-2 text-sm font-medium hover:bg-[#7077FE] hover:text-white transition"
                >
                    Back
                </button>
            </div>

            <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-[15px]">
                <div className="w-full lg:w-2/3 h-full">
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-3 gap-4">
                            {balanceCards.map((card, index) => (
                                <div
                                    key={index}
                                    className="py-[15px] px-3 bg-white border border-[#CBD5E1] rounded-xl flex flex-col gap-2.5"
                                >
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-[#494949] font-['Open_Sans'] font-normal text-sm">
                                            {card.title}
                                        </h2>
                                        <div
                                            className="rounded-full p-3"
                                            style={{ backgroundColor: card.iconBg }}
                                        >
                                            <img
                                                src={card.icon}
                                                alt={`${card.title} icon`}
                                                className="w-[18px] h-[18px]"
                                            />
                                        </div>
                                    </div>
                                    <h2 className="text-[#222224] font-['Poppins'] font-semibold text-[28px]">
                                        {card.amount}
                                    </h2>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px]">
                                Transaction details
                            </h2>

                            <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
                                <table className="w-full border-separate border-spacing-0 text-sm">
                                    <thead>
                                        <tr className="bg-[#F8FAFC] text-center">
                                            <th
                                                onClick={() => requestSort("amount")}
                                                className="py-3 px-6 font-['Open_Sans'] font-semibold text-[13px] text-[#64748B] uppercase tracking-wide cursor-pointer select-none hover:text-[#7077FE]"
                                            >
                                                <div className="flex justify-center items-center gap-1">
                                                    Withdrawal Amount
                                                    {renderSortIcons("amount")}
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => requestSort("date")}
                                                className="py-3 px-6 font-['Open_Sans'] font-semibold text-[13px] text-[#64748B] uppercase tracking-wide cursor-pointer select-none hover:text-[#7077FE]"
                                            >
                                                <div className="flex justify-center items-center gap-1">
                                                    Date
                                                    {renderSortIcons("date")}
                                                </div>
                                            </th>
                                            <th
                                                onClick={() => requestSort("status")}
                                                className="py-3 px-6 font-['Open_Sans'] font-semibold text-[13px] text-[#64748B] uppercase tracking-wide cursor-pointer select-none hover:text-[#7077FE]"
                                            >
                                                <div className="flex justify-center items-center gap-1">
                                                    Status
                                                    {renderSortIcons("status")}
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E2E8F0] bg-white">
                                        {sortedWithdrawals.map((withdrawal, index) => (
                                            <WithdrawalRow
                                                key={index}
                                                amount={withdrawal.amount}
                                                date={withdrawal.date}
                                                status={withdrawal.status}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-1/3 h-full bg-white border border-[#CBD5E1] rounded-xl px-[14px] py-[18px]">
                    {isEdit ? (<>
                        <h2 className="text-[#222224] font-['Poppins'] font-semibold text-base">
                            Bank details
                        </h2>
                        <div className="mt-5 bg-[#F9F9F9] px-[14px] py-[17px] rounded-xl">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="accountNumber"
                                        className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]">
                                        Account Number
                                    </label>
                                    <input
                                        type="text"
                                        id="accountNumber"
                                        className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                        placeholder="Enter your account no"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="swiftCode"
                                        className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]">
                                        Swift Code
                                    </label>
                                    <input
                                        id="swiftCode"
                                        type="text"
                                        className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                        placeholder="Enter your swift code"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="accountType"
                                        className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]">
                                        Account Type
                                    </label>
                                    <input
                                        type="text"
                                        id="accountType"
                                        className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                        placeholder="Enter your account type"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                className="mt-6 font-['Plus Jakarta Sans'] w-full px-5 py-3 bg-[#7077FE] rounded-md cursor-pointer text-white text-base font-semibold"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsEdit(false)}
                                className="w-full px-5 py-3 bg-white border border-[#7077FE] rounded-md text-[#7077FE] font-['Plus Jakarta Sans'] font-medium text-sm w-auto">
                                Cancel
                            </button>
                        </div>
                    </>
                    ) : (
                        <>
                            <h2 className="text-[#222224] font-['Poppins'] font-semibold text-base">
                                Withdrawal
                            </h2>
                            <div className="pt-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center gap-2">
                                    <h2 className="text-[#222224] font-['Poppins'] font-medium text-[13px]">
                                        Enter Amount
                                    </h2>
                                    <h2 className="text-[#494949] font-['Poppins'] font-normal text-[13px]">
                                        Min: $100 | Max: $500000
                                    </h2>
                                </div>
                                <input
                                    type="text"
                                    className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                    placeholder="$0"
                                />
                            </div>
                            <div>
                                <button className="mt-6 font-['Plus Jakarta Sans'] w-full px-5 py-3 bg-[#7077FE] rounded-md cursor-pointer text-white text-base font-semibold">Withdraw now</button>
                                <h2 className="pt-2 text-[#494949] font-['Poppins'] font-normal text-[13px]">
                                    Usual processing time: 15 mins
                                </h2>
                            </div>
                            <div className="pt-7 flex flex-col justify-start items-start gap-2 w-auto">
                                <h2 className="pt-2 text-[#222224] font-['Poppins'] font-medium text-[13px]">
                                    Amount will be transferred to
                                </h2>
                                <button
                                    onClick={() => setIsEdit(true)}
                                    className="py-[10px] px-3 bg-white border border-[#7077FE] rounded-md text-[#7077FE] font-['Plus Jakarta Sans'] font-medium text-sm w-auto">
                                    Change details
                                </button>
                            </div>
                            <div className="mt-5 bg-[#F9F9F9] px-[14px] py-[17px] rounded-xl">
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#1A1A1A] font-['Open_Sans'] font-normal text-sm">
                                            Federal Bank
                                        </h2>
                                        <h2 className="text-[#222224] font-['Open_Sans'] font-semibold text-sm">
                                            xxxxxxxxxx5236
                                        </h2>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#1A1A1A] font-['Open_Sans'] font-normal text-sm">
                                            Swift Code
                                        </h2>
                                        <h2 className="text-[#222224] font-['Open_Sans'] font-semibold text-sm">
                                            FDRL0001054
                                        </h2>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-[#1A1A1A] font-['Open_Sans'] font-normal text-sm">
                                            Account Type
                                        </h2>
                                        <h2 className="text-[#222224] font-['Open_Sans'] font-semibold text-sm">
                                            Savings
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div >
        </div >
    );
};

export default SellerWithdrawal;
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import availablebalance from "../assets/availablebalance.svg";
import pendingbalance from "../assets/pendingbalance.svg";
import totalbalance from "../assets/totalbalance.svg";
import { get_wallet, update_bank_details, get_withdrawal_history, submit_withdrawal } from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

// Type for bank details
type BankDetails = {
  bank_name?: string;
  account_number?: string;
  swift_code?: string;
  account_type?: string;
};

// Type for wallet
type Wallet = {
  total_balance: string;
  available_balance: string;
  pending_balance: string;
  bank_details: BankDetails | null;
};

// Type for withdrawal history item
interface WithdrawalHistoryItem {
  id: string;
  withdrawal_amount: string;
  date: string;
  status: "completed" | "cancelled" | "pending";
}

interface WithdrawalRowProps {
  amount: string;
  date: string;
  status: "completed" | "cancelled" | "pending";
}

// Status style helper
const getStatusStyle = (status: string) => {
  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case "completed":
      return "bg-[#3D9A7D33] text-[#3D9A7D]";
    case "cancelled":
      return "bg-[#E5E5E5] text-[#8D8D8D]";
    case "pending":
      return "bg-[#E2E4FF] text-[#7077FE]";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Format status for display
const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

// Table row component
const WithdrawalRow: React.FC<WithdrawalRowProps> = ({ amount, date, status }) => (
  <tr className="hover:bg-[#F9FAFB] transition">
    <td className="py-4 px-6 text-center align-middle font-['Open_Sans'] text-[14px] text-[#1A1A1A]">{amount}</td>
    <td className="py-4 px-6 text-center align-middle font-['Open_Sans'] text-[14px] text-[#1A1A1A]">{date}</td>
    <td className="py-4 px-6 text-center align-middle">
      <span className={`inline-block w-full py-[6px] rounded-full text-[13px] font-semibold leading-[18px] ${getStatusStyle(status)}`}>{formatStatus(status)}</span>
    </td>
  </tr>
);

// Main component
const SellerWithdrawal: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Wallet state
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [walletError, setWalletError] = useState<string | null>(null);

  // Withdrawal history state
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Withdrawal form state
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);

  // Bank edit state
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [accountType, setAccountType] = useState("");
  const [savingBank, setSavingBank] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // Fetch wallet on mount
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoadingWallet(true);
        setWalletError(null);
        const res = await get_wallet();
        console.log('res.data.data', res.data.data)
        const data: any = res.data.data;
        console.log('data', data)
        setWallet(data);

        // Pre-fill bank edit fields if data exists
        if (data.bank_details) {
          setBankName(data.bank_details.bank_name || "");
          setAccountNumber(data.bank_details.account_number || "");
          setSwiftCode(data.bank_details.swift_code || "");
          setAccountType(data.bank_details.account_type || "");
        }
      } catch (err: any) {
        console.error(err);
        setWalletError("Failed to load wallet");
        showToast({
          message: err?.response?.data?.error?.message || "Failed to load wallet",
          type: "error"
        });
      } finally {
        setLoadingWallet(false);
      }
    };
    fetchWallet();
  }, []);

  // Fetch withdrawal history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoadingHistory(true);
        const res = await get_withdrawal_history();
        console.log('res.data.data', res.data.data)
        const data: WithdrawalHistoryItem[] = res.data.data;
        setWithdrawalHistory(data);
      } catch (err: any) {
        console.error(err);
        showToast({
          message: err?.response?.data?.error?.message || "Failed to load withdrawal history",
          type: "error"
        });
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, []);

  // Refresh wallet data
  const refreshWalletData = async () => {
    try {
      setLoadingWallet(true);
      const res = await get_wallet();
      const data: Wallet = res.data.data.data;
      setWallet(data);
    } finally {
      setLoadingWallet(false);
    }
  };

  // Refresh withdrawal history
  const refreshWithdrawalHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await get_withdrawal_history();
      const data: WithdrawalHistoryItem[] = res.data.data;
      setWithdrawalHistory(data);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Handle withdrawal request
  const handleWithdraw = async () => {
    // Validation
    const amount = parseFloat(withdrawalAmount);
    if (!withdrawalAmount || isNaN(amount)) {
      showToast({
        message: "Please enter a valid amount",
        type: "error"
      });
      return;
    }

    if (amount < 100) {
      showToast({
        message: "Minimum withdrawal amount is $100",
        type: "error"
      });
      return;
    }

    if (amount > 500000) {
      showToast({
        message: "Maximum withdrawal amount is $500,000",
        type: "error"
      });
      return;
    }

    try {
      setSubmittingWithdrawal(true);
      await submit_withdrawal({ amount });
      showToast({
        message: "Withdrawal request submitted successfully!",
        type: "success"
      });
      setWithdrawalAmount("");
      // Refresh data
      await refreshWalletData();
      await refreshWithdrawalHistory();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || "Failed to submit withdrawal request";
      showToast({
        message: errorMsg,
        type: "error"
      });
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  // Balance cards
  const balanceCards = useMemo(() => [
    { title: "Total Balance", amount: wallet?.total_balance ?? "0.00", iconBg: "#F2E9FF", icon: totalbalance },
    { title: "Available Balance", amount: wallet?.available_balance ?? "0.00", iconBg: "#FFE2CD", icon: availablebalance },
    { title: "Pending Balance", amount: wallet?.pending_balance ?? "0.00", iconBg: "#E8F3F0", icon: pendingbalance },
  ], [wallet]);

  // Format date from ISO to readable format
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // Withdrawals sorting
  const sortedWithdrawals = useMemo(() => {
    // Map withdrawal history to table format
    let sorted = withdrawalHistory.map(item => ({
      id: item.id,
      amount: `$${item.withdrawal_amount}`,
      date: formatDate(item.date),
      status: item.status
    }));

    if (sortConfig) {
      sorted.sort((a, b) => {
        const key = sortConfig.key as keyof WithdrawalRowProps;
        if (key === "amount") {
          const amountA = Number(a.amount.replace("$", ""));
          const amountB = Number(b.amount.replace("$", ""));
          return sortConfig.direction === "asc" ? amountA - amountB : amountB - amountA;
        }
        if (key === "date") {
          const [monthA, dayA, yearA] = a.date.split("/").map(Number);
          const [monthB, dayB, yearB] = b.date.split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return sortConfig.direction === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
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
  }, [withdrawalHistory, sortConfig]);

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
        <ChevronUp className={`w-3 h-3 ${isActive && isAsc ? "text-black" : "text-gray-400"}`} />
        <ChevronDown className={`w-3 h-3 ${isActive && !isAsc ? "text-black" : "text-gray-400"}`} />
      </div>
    );
  };

  const handleSaveBankDetails = async () => {
    try {
      setSavingBank(true);
      setBankError(null);
      await update_bank_details({
        bank_name: bankName,
        account_number: accountNumber,
        swift_code: swiftCode,
        account_type: accountType,
      });
      showToast({
        message: "Bank details updated successfully!",
        type: "success"
      });
      setIsEdit(false);
      await refreshWalletData();
    } catch (err: any) {
      const apiMsg = err?.response?.data?.error?.message || err?.response?.data?.message || "Failed to save bank details";
      setBankError(apiMsg);
      showToast({
        message: apiMsg,
        type: "error"
      });
    } finally {
      setSavingBank(false);
    }
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
                {loadingWallet && <div className="text-gray-500">Loading...</div>}
                {walletError && <div className="text-red-500">{walletError}</div>}
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
                                        {loadingHistory ? (
                                            <tr>
                                                <td colSpan={3} className="py-8 text-center text-gray-500">
                                                    Loading withdrawal history...
                                                </td>
                                            </tr>
                                        ) : sortedWithdrawals.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="py-8 text-center text-gray-500">
                                                    No withdrawal history found
                                                </td>
                                            </tr>
                                        ) : (
                                            sortedWithdrawals.map((withdrawal) => (
                                                <WithdrawalRow
                                                    key={withdrawal.id}
                                                    amount={withdrawal.amount}
                                                    date={withdrawal.date}
                                                    status={withdrawal.status}
                                                />
                                            ))
                                        )}
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
                                htmlFor="bankName"
                                className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]"
                            >
                                Bank Name
                            </label>
                            <input
                                id="bankName"
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                placeholder="Enter your bank name"
                            />
                            </div>

                            <div className="flex flex-col gap-1">
                            <label
                                htmlFor="accountNumber"
                                className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]"
                            >
                                Account Number
                            </label>
                            <input
                                id="accountNumber"
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                placeholder="Enter your account no"
                            />
                            </div>

                            <div className="flex flex-col gap-1">
                            <label
                                htmlFor="swiftCode"
                                className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]"
                            >
                                Swift Code
                            </label>
                           <input
                                id="swiftCode"
                                type="text"
                                value={swiftCode}
                                onChange={(e) => setSwiftCode(e.target.value)}
                                className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                placeholder="Enter your swift code"
                            />
                            </div>

                            <div className="flex flex-col gap-1">
                            <label
                                htmlFor="accountType"
                                className="text-[#1A1A1A] font-['Poppins'] font-medium text-[13px]"
                            >
                                Account Type
                            </label>
                            <input
                                id="accountType"
                                type="text"
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                placeholder="Enter your account type"
                            />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                    {bankError && (
                        <p className="text-sm text-red-500">{bankError}</p>
                    )}
                    <button
                        onClick={handleSaveBankDetails}
                        disabled={savingBank}
                        className="mt-6 font-['Plus Jakarta Sans'] w-full px-5 py-3 bg-[#7077FE] rounded-md cursor-pointer text-white text-base font-semibold disabled:opacity-60"
                    >
                        {savingBank ? "Saving..." : "Save"}
                    </button>
                    <button
                        onClick={() => setIsEdit(false)}
                        className="w-full px-5 py-3 bg-white border border-[#7077FE] rounded-md text-[#7077FE] font-['Plus Jakarta Sans'] font-medium text-sm"
                    >
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
                                    type="number"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                                    className="border border-[#CBD5E1] rounded-md w-full py-[10px] ps-[15px] placeholder-[rgba(19, 19, 19, 0.6)] placeholder:text-sm placeholder:font-light focus:outline-none focus:ring-2 focus:ring-[rgba(19, 19, 19, 0.6)]"
                                    placeholder="0"
                                    min="100"
                                    max="500000"
                                />
                            </div>
                            <div>
                                <button
                                    onClick={handleWithdraw}
                                    disabled={submittingWithdrawal}
                                    className="mt-6 font-['Plus Jakarta Sans'] w-full px-5 py-3 bg-[#7077FE] rounded-md cursor-pointer text-white text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {submittingWithdrawal ? "Processing..." : "Withdraw now"}
                                </button>
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
                                        {wallet?.bank_details?.bank_name || "Bank Name"}
                                    </h2>
                                    <h2 className="text-[#222224] font-['Open_Sans'] font-semibold text-sm">
                                        {/* Mask account number for privacy */}
                                        {wallet?.bank_details?.account_number
                                        ? `xxxxxx${wallet?.bank_details?.account_number.slice(-4)}`
                                        : "Account Number"}
                                    </h2>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                    <h2 className="text-[#1A1A1A] font-['Open_Sans'] font-normal text-sm">
                                        Swift Code
                                    </h2>
                                    <h2 className="text-[#222224] font-['Open_Sans'] font-semibold text-sm">
                                        {wallet?.bank_details?.swift_code || "Swift Code"}
                                    </h2>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                    <h2 className="text-[#1A1A1A] font-['Open_Sans'] font-normal text-sm">
                                        Account Type
                                    </h2>
                                    <h2 className="text-[#222224] font-['Open_Sans'] font-semibold text-sm">
                                        {wallet?.bank_details?.account_type || "Account Type"}
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
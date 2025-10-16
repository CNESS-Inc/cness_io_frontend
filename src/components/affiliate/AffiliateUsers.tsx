import { useEffect, useRef, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import {
  IoFilterSharp,
  IoLocationOutline,
  IoMailUnreadOutline,
  IoSearchSharp,
} from "react-icons/io5";

interface User {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  joined_date: string;
  last_activity: string;
  commission_earned: string;
  approved_commission: string;
  pending_commission: string;
  commission_status: "APPROVED" | "PENDING" | "PAID" | "NO_COMMISSION";
  total_payments: number;
  subscription_type: string;
  subscription_amount: string;
  payment_status: "Completed" | "Pending" | "Failed";
  commission_history: any[];
}

interface Props {
  users: User[];
  currentUsers: User[];
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  startIndex: number;
  endIndex: number;
}

export default function AffiliateUsers({
  users,
  currentUsers,
  totalPages,
  currentPage,
  setCurrentPage,
  startIndex,
  endIndex,
}: Props) {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<{
    completed: boolean;
    pending: boolean;
    failed: boolean;
  }>({
    completed: false,
    pending: false,
    failed: false,
  });
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (filterRef.current && !filterRef.current.contains(target)) {
        setShowFilter(false);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilter]);

  const filteredUsers = currentUsers.filter(user => {
    if (user.commission_status === "NO_COMMISSION") {
      return false;
    }

    if (Number(user.commission_earned) === 0 && Number(user.pending_commission) === 0) {
      return false;
    }

    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase());

    const hasActiveFilter = filterStatus.completed || filterStatus.pending || filterStatus.failed;

    if (!hasActiveFilter) {
      return matchesSearch;
    }

    const matchesStatus =
      (filterStatus.completed && (user.commission_status === "APPROVED" || user.commission_status === "PAID")) ||
      (filterStatus.pending && user.commission_status === "PENDING") ||
      (filterStatus.failed && user.payment_status === "Failed");

    return matchesSearch && matchesStatus;
  });

  const handleFilterChange = (status: keyof typeof filterStatus) => {
    setFilterStatus(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex gap-3 justify-between items-center pb-3 border-b border-[#E2E8F0]">
        <h3 className="font-medium text-base font-['Poppins',Helvetica] text-[#081021]">
          Affiliate Users
        </h3>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[20rem] p-3 rounded-xl border border-[#CBD5E1] bg-white text-sm text-[#64748B] placeholder-[#64748B] focus:outline-none"
            />
            <IoSearchSharp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#64748B] text-lg" />
          </div>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="p-3 rounded-xl border border-[#CBD5E1] bg-white hover:bg-gray-100 transition shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
            >
              <IoFilterSharp className="text-[#64748B] text-xl" />
              {(filterStatus.completed || filterStatus.pending || filterStatus.failed) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#7077FE] rounded-full"></span>
              )}
            </button>
            {showFilter && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-4 animate-fadeIn">
                <p className="text-sm text-[#334155] font-semibold mb-3">
                  Filters
                </p>

                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center text-sm text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 accent-[#64748B]"
                      checked={filterStatus.completed}
                      onChange={() => handleFilterChange('completed')}
                    />
                    Completed
                  </label>
                  <label className="inline-flex items-center text-sm text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 accent-[#64748B]"
                      checked={filterStatus.pending}
                      onChange={() => handleFilterChange('pending')}
                    />
                    Pending
                  </label>
                  <label className="inline-flex items-center text-sm text-[#475569] cursor-pointer">
                    <input
                      type="checkbox"
                      className="mr-2 accent-[#64748B]"
                      checked={filterStatus.failed}
                      onChange={() => handleFilterChange('failed')}
                    />
                    Failed
                  </label>
                </div>

                {(filterStatus.completed || filterStatus.pending || filterStatus.failed) && (
                  <button
                    onClick={() => setFilterStatus({ completed: false, pending: false, failed: false })}
                    className="w-full mt-3 text-xs text-[#7077FE] hover:underline"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl p-3 flex flex-col gap-3">
        <table className="w-full table-auto border-separate border-spacing-y-3">
          <thead className="w-full">
            <tr className="text-left">
              <th></th>
              <th className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                User
              </th>
              <th className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                Contact
              </th>
              <th className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                Joined Date
              </th>
              <th className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                Commission
              </th>
              <th className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

                const statusColor =
                  user.commission_status === "APPROVED" || user.commission_status === "PAID"
                    ? "bg-[#60C7501A] text-[#60C750]"
                    : user.commission_status === "PENDING"
                      ? "bg-[#F8BE261A] text-[#F8BE26]"
                      : "bg-[#F871711A] text-[#F87171]";

                const statusText =
                  user.commission_status === "APPROVED" || user.commission_status === "PAID"
                    ? "Completed"
                    : user.commission_status === "PENDING"
                      ? "Pending"
                      : "Failed";

                return (
                  <tr
                    key={user.user_id}
                    className="bg-white border border-[#ECEEF2] rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
                  >
                    <td className="py-[18px] px-3">
                      <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#9747FF1A] py-[8px] px[16px] text-[#9747FF] font-semibold text-sm">
                        {initials || user.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                    </td>
                    <td className="py-[18px] px-3">
                      <div className="flex flex-col gap-2">
                        <span className="font-semibold text-base text-[#222224] font-['Open_Sans',Helvetica]">
                          {user.first_name} {user.last_name}
                        </span>
                        {user.address && (
                          <div className="flex items-center gap-1 font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                            <IoLocationOutline />
                            {user.address}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-[18px] px-3">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                          <IoMailUnreadOutline />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                            <FiPhone />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-[18px] px-3">
                      <span className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                        {user.joined_date}
                      </span>
                    </td>
                    <td className="py-[18px] px-3">
                      <span className="font-bold text-base text-[#222224] font-['Open_Sans',Helvetica]">
                        ${user.commission_earned}
                      </span>
                    </td>
                    <td className="py-[18px] px-3">
                      <div
                        className={`w-[121px] text-center px-[18px] py-[10px] rounded-full font-semibold text-base font-['Open_Sans',Helvetica] ${statusColor}`}
                      >
                        {statusText}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center">
                      <IoSearchSharp className="w-8 h-8 text-[#64748B]" />
                    </div>
                    <p className="text-[#64748B] font-['Open_Sans',Helvetica]">
                      No users found
                    </p>
                    <p className="text-xs text-[#94A3B8] font-['Open_Sans',Helvetica]">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="py-[8px] px-3 flex justify-between items-center">
          <p className="font-normal text-sm text-[#64748B] font-['Open_Sans',Helvetica]">
            Showing {startIndex + 1} to {endIndex} of {users.length} Users
          </p>
          <div className="flex gap-1 items-center">
            <p className="font-semibold text-sm text-[#242424] font-['Open_Sans',Helvetica]">
              Page {currentPage} of {totalPages}
            </p>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="w-[40px] h-[40px] flex items-center justify-center disabled:opacity-30"
            >
              <FaAngleLeft />
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="w-[40px] h-[40px] flex items-center justify-center disabled:opacity-30"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

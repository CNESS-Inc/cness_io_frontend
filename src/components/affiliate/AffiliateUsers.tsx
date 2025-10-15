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
  id: number;
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  phone: string;
  joinedDate: string;
  revenue: string;
  status: "Completed" | "Pending" | "Failed";
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
            </button>
            {showFilter && (
              <div className="absolute top-full right-0 mt-2 w-36 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-4 animate-fadeIn">
                <p className="text-sm text-[#334155] font-semibold mb-3">
                  Filters
                </p>

                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center text-sm text-[#475569] cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-[#64748B]" />
                    Option 1
                  </label>
                  <label className="inline-flex items-center text-sm text-[#475569] cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-[#64748B]" />
                    Option 2
                  </label>
                  <label className="inline-flex items-center text-sm text-[#475569] cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-[#64748B]" />
                    Option 3
                  </label>
                </div>
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
            {currentUsers.map((user) => {
              const initials = `${user.firstName[0]}${user.lastName[0]}`;
              const statusColor =
                user.status === "Completed"
                  ? "bg-[#60C7501A] text-[#60C750]"
                  : user.status === "Pending"
                  ? "bg-[#F8BE261A] text-[#F8BE26]"
                  : "bg-[#F871711A] text-[#F87171]";

              return (
                <tr
                  key={user.id}
                  className="bg-white border border-[#ECEEF2] rounded-xl shadow-[0px_0px_4px_0px_rgba(0,0,0,0.1)]"
                >
                  <td className="py-[18px] px-3">
                    <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full bg-[#9747FF1A] py-[8px] px[16px] text-[#9747FF] font-semibold text-sm">
                      {initials}
                    </div>
                  </td>
                  <td className="py-[18px] px-3">
                    <div className="flex flex-col gap-2">
                      <span className="font-semibold text-base text-[#222224] font-['Open_Sans',Helvetica]">
                        {user.firstName} {user.lastName}
                      </span>
                      <div className="flex items-center gap-1 font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                        <IoLocationOutline />
                        {user.location}
                      </div>
                    </div>
                  </td>
                  <td className="py-[18px] px-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1 font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                        <IoMailUnreadOutline />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1 font-normal text-xs text-[#64748B] font-['Open_Sans',Helvetica]">
                        <FiPhone />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="py-[18px] px-3">
                    <span className="font-semibold text-base text-[#64748B] font-['Open_Sans',Helvetica]">
                      {user.joinedDate}
                    </span>
                  </td>
                  <td className="py-[18px] px-3">
                    <span className="font-bold text-base text-[#222224] font-['Open_Sans',Helvetica]">
                      {user.revenue}
                    </span>
                  </td>
                  <td className="py-[18px] px-3">
                    <div
                      className={`w-[121px] text-center px-[18px] py-[10px] rounded-full font-semibold text-base font-['Open_Sans',Helvetica] ${statusColor}`}
                    >
                      {user.status}
                    </div>
                  </td>
                </tr>
              );
            })}
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

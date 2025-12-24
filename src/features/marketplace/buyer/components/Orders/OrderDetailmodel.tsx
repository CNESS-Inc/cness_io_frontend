import React from "react";
import { X } from "lucide-react";
import { AuthorInfo } from "../Products/AuthorInfo";
import nandhiji from "../../../../../assets/nandhiji.svg";

interface OrderDetailsModalProps {
  onClose: () => void;
}

function PaymentRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#6b7280]">{label}</span>
      <span>{value}</span>
    </div>
  );
}


function TimelineItem({
  title,
  subtitle,
  time,
  isLast = false,
}: {
  title: string;
  subtitle: React.ReactNode;
  time?: string;
  isLast?: boolean;
}) {
  return (
<div className="relative flex justify-between gap-4 pl-[28px] pb-6">
      
      {/* Vertical line */}
      {!isLast && (
        <span className="absolute left-[9px] top-[22px] -bottom-18 w-[1px] bg-[#e5e7eb]" />
      )}

      {/* Icon */}
      <span className="absolute left-0 top-[4px] flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#22c55e] bg-white">
        <svg width="8" height="8" viewBox="0 0 10 8" fill="none">
          <path
            d="M1 4L4 7L9 1"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {/* Content */}
      <div>
        <p className="text-[14px] font-semibold text-[#080f20] font-[poppins]">
          {title}
        </p>
        <p className="text-[12px] text-[#6b7280] font-['open_sans']">
          {subtitle}
        </p>
      </div>

      {/* Time */}
      {time && (
        <p className="text-xs text-[#6b7280] whitespace-nowrap">
          {time}
        </p>
      )}
    </div>
  );
}



export default function OrderDetailsModal({ onClose }: OrderDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-[600px] rounded-2xl bg-white shadow-xl overflow-hidden">
        
        {/* ===== Header ===== */}
        <div className="flex items-start justify-between px-6 py-5 bg-[#F4F5FF]">
          <div>
            <p className="text-sm text-[#6b7280] font-['open_sans']">Order Details</p>
            <h2 className="text-lg font-semibold text-[#080f20] font-[poppins]">
              #012-23222-2343
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-[#ececec] flex items-center justify-center"
          >
            <X size={16} />
          </button>
        </div>

        {/* ===== Meta Info ===== */}
        <div className="px-6 py-4 grid grid-cols-3 gap-5 border-b">
          <div>
            <p className="text-xs text-[#6b7280] font-['open_sans']">Order Placed by</p>
            <p className="text-sm font-medium font-[poppins]">
              July 23, 2025 at 9:53 pm
            </p>
          </div>

<div className="flex flex-col items-center">
            <p className="text-xs text-[#6b7280] text-center font-['open_sans']">Payment</p>
            <span className="inline-block mt-2 px-2 py-[2px] text-xs rounded bg-green-700 text-white justify-center ">
              Paid
            </span>
          </div>

          <div>
            <p className="text-xs text-[#6b7280] font-['open_sans']">Status</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-[2px] text-xs rounded bg-[#eef0ff] text-[#4f5dff]">
                In Library
              </span>
              <button className="text-xs text-[#4f5dff]">View</button>
            </div>
          </div>
        </div>

        {/* ===== Timeline ===== */}
        <div className="px-6 py-4 border-b">
          <p className="text-sm font-medium mb-3 font-[poppins]">Timeline</p>

        <div className="space-y-6">
  <TimelineItem
    title="The item has been purchased"
    subtitle="Confirmed by Sridharan"
    time="July 23, 2025 at 9:53pm"
  />

  <TimelineItem
    title="The invoice has been sent"
    subtitle={
      <>
        Sent to{" "}
        <span className="text-[#4f5dff]">sri@cness.co</span>
      </>
    }
    time="July 23, 2025 at 9:54pm"
    isLast
  />
</div>
        </div>

        {/* ===== Item Details ===== */}
        <div className="px-6 py-4 border-b">
          <p className="text-sm font-medium mb-3 font-[poppins]">Item Details</p>

         <div className="flex items-center justify-between">
  <div className="flex items-center gap-3">
    <img
      src="https://cdn.cness.io/feat1.png"
      className="w-12 h-12 rounded-lg object-cover"
    />

    <div className="flex flex-col gap-[2px]">
      <p className="text-sm font-medium">Ultra Presence</p>

      {/* Author info component */}
      <AuthorInfo
        name="Nandhiji"
        avatar={nandhiji}
      />

      <p className="text-xs text-[#4f5dff]">Ebook</p>
    </div>
  </div>

  <p className="font-semibold">$99.00</p>
</div>
        </div>

        {/* ===== Payment Breakdown ===== */}
        <div className="px-6 py-4 border-b space-y-2">
          <p className="text-sm font-medium mb-2 font-[poppins]">Payment</p>

          <PaymentRow label="Sub Total" value="$99.00" />
          <PaymentRow
            label="Discount"
            value={
              <span className="flex items-center gap-2">
                <span className="px-2 py-[2px] text-xs rounded bg-[#eef0ff] text-[#4f5dff]">
                  10%
                </span>
                $89.00
              </span>
            }
          />
          <PaymentRow label="Tax" value="$1.00" />
          <PaymentRow label="Marketplace fee" value="$1.00" />
        </div>

        {/* ===== Total ===== */}
        <div className="px-6 py-4 flex justify-between items-center">
          <p className="font-semibold text-[#080f20] font-[poppins]">Total</p>
          <p className="font-semibold text-lg">$91.00</p>
        </div>
      </div>
    </div>
  );
}

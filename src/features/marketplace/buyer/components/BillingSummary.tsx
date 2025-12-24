import Nortonicon from "../../../../assets/Norton Icon.svg";

interface BillingSummaryProps {
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  points?: number;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-[#6b7280]">{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function BillingSummary({
  subtotal,
  discount,
  tax,
  total,
  points = 0,
}: BillingSummaryProps) {
  return (
    <div
      className="
        w-full
        rounded-2xl
        bg-gradient-to-t from-[#FFFFFF] to-[#F1F3FF]
        p-4 sm:p-6
        xl:sticky xl:top-24
      "
    >
      {/* Title */}
      <h3 className="font-semibold font-['open_sans'] mb-4 text-[16px]">
        Billing Summary
      </h3>

      {/* Rows */}
      <div className="space-y-3 text-sm font-['open_sans']">
        <Row label="Subtotal" value={subtotal} />
        <Row label="Discount" value={`-${discount}`} />
        <Row label="Tax" value={tax} />
      </div>

      <hr className="my-4" />

      {/* Grand total */}
      <div className="flex justify-between font-semibold text-[16px] sm:text-lg font-['open_sans']">
        <span>Grand Total</span>
        <span>{total}</span>
      </div>

      {/* Points */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-[#6b7280] mb-1">
          <span>Use Points</span>
          <span className="text-[#4f5dff]">
            Available Points {points}pt
          </span>
        </div>

        <input
          type="number"
          className="
            w-full
            border
            rounded-md
            px-3 py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-[#4f5dff]/40
          "
          placeholder="0"
        />
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 mt-4 text-xs text-[#6b7280]">
        <input type="checkbox" className="mt-[2px]" />
        <span>
          Please check to acknowledge our{" "}
          <span className="text-[#4f5dff] cursor-pointer">
            Privacy & Terms Policy
          </span>
        </span>
      </label>

      {/* Pay Button */}
      <button
        className="
          w-full
          mt-5
          rounded-lg
          bg-gradient-to-b from-[#3b82f6] to-[#2563eb]
          py-3
          text-white
          font-semibold
          text-sm sm:text-base
          hover:opacity-95
          transition
        "
      >
        Pay {total}
      </button>

      {/* Norton */}
      <div className="mt-3 flex justify-center">
        <img
          src={Nortonicon}
          alt="Norton"
          className="h-5 sm:h-6"
        />
      </div>
    </div>
  );
}
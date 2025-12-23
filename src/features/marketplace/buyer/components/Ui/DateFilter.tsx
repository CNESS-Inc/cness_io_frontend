import  { useState } from "react";

interface DateFilterOption {
  label: string;
  value: string;
}

interface DateFilterProps {
  options: DateFilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export default function DateFilter({
  options,
  value,
  onChange,
}: DateFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || value;

  return (
    <div className="relative inline-block">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-[38px] px-[20px] gap-[10px] justify-center items-center bg-[#f3f4ff] rounded-[10px]"
      >
        <span className="font-['Poppins'] text-[14px] font-medium text-[#102b6b] tracking-[-0.27px] whitespace-nowrap">
          {selectedLabel}
        </span>

        <div
          className={`w-[24px] h-[24px] bg-cover bg-no-repeat transition-transform ${
            open ? "rotate-180" : ""
          }`}
          style={{
            backgroundImage:
              "url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-12-22/L4R8FeA4t5.png)",
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-[180px] rounded-[10px] bg-white shadow-lg border border-[#eef0ff] z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className="w-full px-[16px] py-[10px] text-left font-['Poppins'] text-[14px] text-[#102b6b] hover:bg-[#f3f4ff]"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

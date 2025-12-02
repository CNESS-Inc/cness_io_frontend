import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const months = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec"
];

interface MonthpickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function Monthpicker({ value, onChange, placeholder }: MonthpickerProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectedYear = value ? Number(value.split("-")[0]) : null;
  const selectedMonth = value ? Number(value.split("-")[1]) - 1 : null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  // Measure input position for dropdown placement
  useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: any) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* INPUT FIELD */}
      <div
        ref={inputRef}
        onClick={() => setOpen(!open)}
        className="w-full h-[41px] px-4 py-2 bg-white border border-gray-300 rounded-xl 
                   text-sm flex items-center justify-between cursor-pointer 
                   hover:border-purple-500 transition"
      >
        {selectedYear !== null && selectedMonth !== null ? (
          <span>{months[selectedMonth]} {selectedYear}</span>
        ) : (
          <span className="text-gray-400">{placeholder || "Select Month & Year"}</span>
        )}

        {/* Arrow */}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* DROPDOWN (in Portal) */}
      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: coords.top,
              left: coords.left,
              width: coords.width,
              zIndex: 999999,
            }}
            className="rounded-xl bg-white shadow-lg p-4 border border-gray-200"
          >
            {/* Year selection */}
            <select
              value={selectedYear ?? ""}
              onChange={(e) => {
                const year = Number(e.target.value);
                if (selectedMonth !== null) {
                  onChange(`${year}-${String(selectedMonth + 1).padStart(2, "0")}`);
                }
              }}
              className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              <option value="">Select Year</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (!selectedYear) return;
                    onChange(`${selectedYear}-${String(i + 1).padStart(2, "0")}`);
                    setOpen(false);
                  }}
                  className={`py-[6px] rounded-lg text-sm border text-center transition 
                    ${
                      selectedMonth === i
                        ? "bg-purple-500 text-white border-purple-500"
                        : "bg-gray-50 hover:bg-gray-100 border-gray-300"
                    }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

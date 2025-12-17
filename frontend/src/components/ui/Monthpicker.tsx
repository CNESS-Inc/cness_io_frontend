import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface MonthpickerProps {
  value: string; // "2021-03"
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;

}

export default function Monthpicker({ value, onChange, onBlur, placeholder }: MonthpickerProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const selectedYear = value ? Number(value.split("-")[0]) : null;
  const selectedMonth = value ? Number(value.split("-")[1]) - 1 : null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

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

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
        onBlur?.(); // close & blur also triggers validation
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onBlur]);

  return (
    <>
      <div
        ref={inputRef}
        onClick={() => setOpen((s) => !s)}
        className="w-full h-[41px] px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm flex items-center justify-between cursor-pointer hover:border-purple-500"
      >
        {selectedYear !== null && selectedMonth !== null ? (
          <span>{months[selectedMonth]} {selectedYear}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}

        <svg className={`w-4 h-4 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

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
            <select
              value={selectedYear ?? currentYear}
              onChange={(e) => {
                const yr = Number(e.target.value);
                if (selectedMonth !== null) {
                  onChange(`${yr}-${String(selectedMonth + 1).padStart(2, "0")}`);
                  onBlur?.();
                }
              }}
              className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 text-sm"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-3 gap-2">
              {months.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    const yearToUse = selectedYear ?? currentYear;
                    onChange(`${yearToUse}-${String(i + 1).padStart(2, "0")}`);
                    onBlur?.();
                    setOpen(false);
                  }}
                  className={`py-[6px] rounded-lg text-sm border text-center ${
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

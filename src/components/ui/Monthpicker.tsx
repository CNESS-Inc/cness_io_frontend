import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import type { FieldError } from "react-hook-form";

interface MonthYearPickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  error?: FieldError;
}

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ value, onChange, error }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-800 mb-2">
        Month & Year
      </label>

      <DatePicker
        selected={value}
        onChange={onChange}
        dateFormat="MM/yyyy"
        showMonthYearPicker
        placeholderText="Please select month & year"
        className={`w-full h-[41px] px-4 py-2 border bg-white rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-500"
        }`}
      />

      {error?.message && (
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default MonthYearPicker;

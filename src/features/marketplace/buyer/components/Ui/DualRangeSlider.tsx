import { useState } from "react";

interface PriceRangeSliderProps {
  min?: number;
  max?: number;
  onChange?: (min: number, max: number) => void;
}

export default function PriceRangeSlider({
  min = 0,
  max = 2400,
  onChange,
}: PriceRangeSliderProps) {
  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  const minPercent = (minPrice / max) * 100;
  const maxPercent = (maxPrice / max) * 100;

const handleMinChange = (value: number) => {
  const newMin = Math.max(min, Math.min(value, maxPrice - 1));
  setMinPrice(newMin);
  onChange?.(newMin, maxPrice);
};

const handleMaxChange = (value: number) => {
  const newMax = Math.min(max, Math.max(value, minPrice + 1));
  setMaxPrice(newMax);
  onChange?.(minPrice, newMax);
};

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="flex items-center gap-3">
        <input
  type="text"
  inputMode="numeric"
  value={minPrice === 0 ? "" : `$${minPrice}`}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, ""); // remove $ and non-digits
    const value = Number(raw || 0);
    handleMinChange(value);
  }}
  className="w-full px-3 py-2 border rounded-lg text-sm"
  placeholder="$0"
/>
        <span className="text-gray-400">—</span>
        <input
  type="text"
  inputMode="numeric"
  value={`$${maxPrice}`}
  onChange={(e) => {
    const raw = e.target.value.replace(/\D/g, "");
    const value = Number(raw || 0);
    handleMaxChange(value);
  }}
  className="w-full px-3 py-2 border rounded-lg text-sm"
  placeholder="$2400"
/>
      </div>

      {/* Slider */}
      <div className="relative h-2">
        {/* Track */}
        <div className="absolute inset-0 bg-gray-200 rounded-full" />

        {/* Active range */}
        <div
          className="absolute h-2 bg-purple-600 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min thumb */}
       <input
  type="range"
  min={min}
  max={max}
  value={minPrice}
  onChange={(e) => handleMinChange(Number(e.target.value))}
  className="absolute w-full h-2 appearance-none bg-transparent z-20"
/>

{/* Max thumb */}
<input
  type="range"
  min={min}
  max={max}
  value={maxPrice}
  onChange={(e) => handleMaxChange(Number(e.target.value))}
  className="absolute w-full h-2 appearance-none bg-transparent z-30"
/>
      </div>
    </div>
  );
}

import React from "react";
import { Play } from "lucide-react";
import MarketHeader from "../components/MarketPlace/Buyerheader";

const THUMBS = [
  "https://cdn.cness.io/collection1.svg",
  "https://cdn.cness.io/collection2.svg",
  "https://cdn.cness.io/collection3.svg",
];

const items = Array.from({ length: 16 }).map((_, i) => ({
  id: i + 1,
  src: THUMBS[i % THUMBS.length],
  title: "Soft guitar moods that heals your inner pain",
}));

const Thumb: React.FC<{ src: string; label?: string }> = ({ src, label }) => (
  <div className="relative rounded-xl overflow-hidden group border border-gray-200">
    <img src={src} alt={label || "thumb"} className="w-full h-[160px] object-cover" />
    <button className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition">
      <span className="flex items-center gap-2 text-white text-sm font-medium px-3 py-1 bg-black/50 rounded-full">
        <Play size={16} />
        Watch
      </span>
    </button>
  </div>
);

const ContinueWatching: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Marketplace / Library header */}
      <MarketHeader />
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[18px] sm:text-xl font-semibold text-[#111827]">Continue watching</h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((it) => (
            <div key={it.id} className="flex flex-col gap-2">
              <Thumb src={it.src} />
              <p className="text-[14px] text-[#111827] font-semibold leading-snug line-clamp-2">
                {it.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContinueWatching;

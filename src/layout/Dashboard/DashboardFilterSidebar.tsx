import { useState } from "react";
import {
  Award,
  Wrench,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  SortAsc,
  SortDesc,
} from "lucide-react";

interface Props {
  selectedDomain: string;
  setSelectedDomain: (value: string) => void;
  sort: "az" | "za";
  setSort: (value: "az" | "za") => void;
}

const DashboardFilterSidebar = ({
  selectedDomain,
  setSelectedDomain,
  sort,
  setSort,
}: Props) => {
  const [open, setOpen] = useState<string | null>(null);
  const [selectedCert, setSelectedCert] = useState<string>("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // Unified options for all filters
  const levels = ["Inspired", "Aspiring", "Luminary"];

  return (
    <div className="w-full px-4 py-6 border-t border-gray-100 bg-white">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Filter</h2>
      <div className="space-y-8">

        {/* Certification */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === "cert" ? null : "cert")}
          >
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="font-medium text-sm">Certification Level</span>
            </div>
            {open === "cert" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {open === "cert" && (
            <div className="mt-3 space-y-4 pl-7 text-sm text-gray-600">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="cert" 
                    value={level}
                    checked={selectedCert === level}
                    onChange={() => setSelectedCert(level)}
                    className="accent-[#897AFF]"
                  />
                  <span className={`${selectedCert === level ? 'text-[#9747FF] font-medium' : ''}`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Industry */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === "industry" ? null : "industry")}
          >
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-sm">Industry</span>
            </div>
            {open === "industry" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {open === "industry" && (
            <div className="mt-3 space-y-4 pl-7 text-sm text-gray-600">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="industry" 
                    value={level}
                    checked={selectedIndustry === level}
                    onChange={() => setSelectedIndustry(level)}
                    className="accent-[#897AFF]"
                  />
                  <span className={`${selectedIndustry === level ? 'text-[#9747FF] font-medium' : ''}`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === "geo" ? null : "geo")}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <span className="font-medium text-sm">Geographic Location</span>
            </div>
            {open === "geo" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {open === "geo" && (
            <div className="mt-3 space-y-4 pl-7 text-sm text-gray-600">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="geo" 
                    value={level}
                    checked={selectedLocation === level}
                    onChange={() => setSelectedLocation(level)}
                    className="accent-[#897AFF]"
                  />
                  <span className={`${selectedLocation === level ? 'text-[#9747FF] font-medium' : ''}`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === "tags" ? null : "tags")}
          >
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-pink-500" />
              <span className="font-medium text-sm">Tags</span>
            </div>
            {open === "tags" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {open === "tags" && (
            <div className="mt-3 space-y-4 pl-7 text-sm text-gray-600">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="tags" 
                    value={level}
                    checked={selectedTag === level}
                    onChange={() => setSelectedTag(level)}
                    className="accent-[#897AFF]"
                  />
                  <span className={`${selectedTag === level ? 'text-[#9747FF] font-medium' : ''}`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Domains */}
        <div>
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOpen(open === "domain" ? null : "domain")}
          >
            <div className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-sm">Domains</span>
            </div>
            {open === "domain" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
          {open === "domain" && (
            <div className="mt-3 space-y-4 pl-7 text-sm text-gray-600">
              {levels.map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="domain"
                    value={level}
                    checked={selectedDomain === level}
                    onChange={() => setSelectedDomain(level)}
                    className="accent-[#897AFF]"
                  />
                  <span className={`${selectedDomain === level ? 'text-[#9747FF] font-medium' : ''}`}>
                    {level}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Sort */}
      <div className="mt-10">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Sort</h3>
        <div className="space-y-6 text-sm">
          <div
            className={`flex items-center gap-2 cursor-pointer ${sort === "az" ? "text-indigo-500 font-medium" : ""}`}
            onClick={() => setSort("az")}
          >
            <SortAsc size={16} /> Sort A-Z
          </div>
          <div
            className={`flex items-center gap-2 cursor-pointer ${sort === "za" ? "text-indigo-500 font-medium" : ""}`}
            onClick={() => setSort("za")}
          >
            <SortDesc size={16} /> Sort Z-A
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFilterSidebar;

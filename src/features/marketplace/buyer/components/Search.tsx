import { useState } from "react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <>
      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        className="w-full lg:w-[300px]"
      >
        <div
          className={`
            flex items-center rounded-[15px] border
            bg-[#FAFAFA] transition-all
            ${isActive ? "border-[#6366f1] shadow-md" : "border-[#e5e7eb]"}
          `}
        >
          <div className="flex items-center gap-[12px] px-[16px] py-[12px] flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              placeholder="Search for any materials"
              className="flex-1 bg-transparent outline-none text-[14px] placeholder:text-[#9ca3af]"
            />
          </div>

          <button type="submit" className="px-[14px] py-[12px]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className={isActive ? "text-[#6366f1]" : "text-[#9ca3af]"}
            >
              <path
                d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
}

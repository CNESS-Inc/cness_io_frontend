import { useState } from "react";

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState("happy");
  const [searchQuery, setSearchQuery] = useState("");
  const [isActive, setIsActive] = useState(false);

  const moods: MoodOption[] = [
    { id: "happy", label: "Happy", emoji: "😊" },
    { id: "calm", label: "Calm", emoji: "😌" },
    { id: "dreamy", label: "Dreamy", emoji: "🌙" },
    { id: "spiritual", label: "Spiritual", emoji: "🧘‍♀️" },
    { id: "creative", label: "Creative", emoji: "🎨" },
    { id: "relaxed", label: "Relaxed", emoji: "🧘" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="w-full">
      <div className="w-full rounded-[20px] p-[16px]">

        {/* ROW */}
        <div className="flex flex-col lg:flex-row gap-[16px] lg:items-center">

          {/* MOOD CHIPS */}
          <div className="flex flex-wrap gap-[10px] md:gap-[12px] flex-1">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={`
                  flex items-center gap-[8px]
                  px-[14px] py-[7px]
                  rounded-[25px] border
                  transition-all text-[14px]
                  ${
                    selectedMood === mood.id
                      ? "bg-[#F1F3FF] border-[#6366f1] text-black"
                      : "bg-[#F1F3FF] border-[#e5e7eb] text-[#6b7280] hover:border-[#6366f1] hover:text-[#6366f1]"
                  }
                `}
              >
                <span className="text-[16px]">{mood.emoji}</span>
                <span className="font-['Open_Sans'] font-medium whitespace-nowrap">
                  {mood.label}
                </span>
              </button>
            ))}
          </div>

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

              <button
                type="submit"
                className="px-[14px] py-[12px]"
              >
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

        </div>
      </div>
    </div>
  );
}

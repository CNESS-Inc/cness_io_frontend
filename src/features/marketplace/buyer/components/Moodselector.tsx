import  { useState } from 'react';

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<string>('happy');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };


  const moods: MoodOption[] = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'calm', label: 'Calm', emoji: '😌' },
    { id: 'energetic', label: 'Energetic', emoji: '⚡' },
    { id: 'focused', label: 'Focused', emoji: '🎯' },
    { id: 'creative', label: 'Creative', emoji: '🎨' },
    { id: 'relaxed', label: 'Relaxed', emoji: '🧘' }
  ];

  return (
  <div className="w-full">
    {/* Section background */}
    <div className="w-full bg-[#F6F7FF] rounded-[20px] p-[16px] flex flex-col gap-[14px]">

      {/* Mood buttons */}
      <div className="flex gap-[12px] items-center flex-wrap">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => setSelectedMood(mood.id)}
            className={`flex px-[16px] py-[8px] gap-[8px] items-center rounded-[25px] border transition-all duration-200
              ${
                selectedMood === mood.id
                  ? "bg-[#6366f1] border-[#6366f1] text-white"
                  : "bg-white border-[#e5e7eb] text-[#6b7280] hover:border-[#6366f1] hover:text-[#6366f1]"
              }`}
          >
            <span className="text-[16px]">{mood.emoji}</span>
            <span className="font-['Open_Sans'] text-[14px] font-medium whitespace-nowrap">
              {mood.label}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="w-full">
        <div
          className={`flex w-full items-center bg-white rounded-[15px] border transition-all duration-200
            ${
              isActive
                ? "border-[#6366f1] shadow-md"
                : "border-[#e5e7eb]"
            }`}
        >
          <div className="flex items-center gap-[12px] px-[16px] py-[12px] flex-1">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-colors ${
                isActive ? "text-[#6366f1]" : "text-[#9ca3af]"
              }`}
            >
              <path
                d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsActive(true)}
              onBlur={() => setIsActive(false)}
              placeholder="Search for any materials"
              className="flex-1 text-[14px] bg-transparent outline-none placeholder:text-[#9ca3af]"
            />
          </div>

          <button
            type="submit"
            className="px-[18px] py-[12px] bg-[#6366f1] text-white rounded-r-[15px] hover:bg-[#5855eb] transition"
          >
            Search
          </button>
        </div>
      </form>

    </div>
  </div>
);

    

}

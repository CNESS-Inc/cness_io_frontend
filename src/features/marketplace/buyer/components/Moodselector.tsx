import { useState } from "react";
import Search from "../components/Search";


interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState("happy");

  const moods: MoodOption[] = [
    { id: "happy", label: "Happy", emoji: "😊" },
    { id: "calm", label: "Calm", emoji: "😌" },
    { id: "dreamy", label: "Dreamy", emoji: "🌙" },
    { id: "spiritual", label: "Spiritual", emoji: "🧘‍♀️" },
    { id: "creative", label: "Creative", emoji: "🎨" },
    { id: "relaxed", label: "Relaxed", emoji: "🧘" },
  ];


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
                      ? "bg-gradient-to-b from-[#7077FE] to-[#424ADC] text-white"
                      : "bg-[#F1F3FF] text-[#6b7280] hover:text-white hover:bg-gradient-to-b  hover:from-[#7077FE] hover:to-[#424ADC]"
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
         <Search />
        </div>
      </div>
    </div>
  );
}

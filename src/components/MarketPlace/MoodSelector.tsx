import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  moods?: any;
}

const MoodSelector: React.FC<Props> = ({
  moods,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      navigate(`/dashboard/market-place/search?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMoodClick = (moodSlug: string) => {
    navigate(`/dashboard/market-place/search?mood_slug=${moodSlug}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <section className="sm:px-2 sm:py-4 md:px-4 md:py-8 lg:py-8  lg:px-8">
      <div className="flex flex-col items-center space-y-10">

        {/* Selected Mood + Search */}
<form
  onSubmit={handleSearchSubmit}
  className="flex items-center w-full max-w-xl sm:max-w-2xl md:max-w-4xl bg-white border border-gray-300 rounded-full px-3 sm:px-4 py-2 sm:py-3 space-x-2 sm:space-x-3"
>
          <div className="flex items-center space-x-2 flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
          <button type="submit" className="flex-shrink-0">
            <Search className="w-6 h-6 text-gray-500" />
          </button>
        </form>

        {/* Mood Options */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 px-4">
        {moods.length > 0 ? (
          moods.map((mood: any) => (
            <button
              key={mood.slug}
              onClick={() => handleMoodClick(mood.slug)}
              className="bg-gray-100 hover:bg-gray-200 rounded-full px-3 sm:px-5 py-2 sm:py-3 text-gray-600 text-xs sm:text-sm md:text-base transition-colors flex items-center gap-2"
            >
              {mood.icon} {mood.name}
            </button>
          ))
        ) : (
          <p className="text-gray-500 text-sm sm:text-base">No moods available.</p>
        )}
      </div>

      </div>
    </section >
  );
};

export default MoodSelector;

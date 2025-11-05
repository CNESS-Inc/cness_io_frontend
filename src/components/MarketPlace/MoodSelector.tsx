import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { useNavigate,useSearchParams  } from 'react-router-dom';

const MoodSelector: React.FC = () => {
  const moods = [
    '❤️ Self-Love',
    '💔 Heartbroken',
    '🌙 Dreamy',
    '🧘 Spiritual',
    '🙏 Grateful',
    '🎨 Creative'
  ];

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();

    const selectedMood = searchParams.get("mood");
  const searchedText = searchParams.get("search");

 useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        navigate(`/dashboard/market-place?search=${encodeURIComponent(searchQuery)}`);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery, navigate]);

    const clearSelection = () => {
    setSearchQuery("");
    navigate(`/dashboard/market-place`);
  };

  // Handle search change and redirect to marketplace page
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // ✅ Navigate to Marketplace when user starts typing
    if (value.length > 0) {
  navigate(`/dashboard/market-place/search?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <section className="px-8 py-8">
      <div className="flex flex-col items-center space-y-10">
        
        {/* Selected Mood + Search */}
       <div className="flex items-center w-full max-w-4xl bg-white border border-gray-300 rounded-full px-4 py-3 space-x-3">
  
  {/* ✅ Selected mood / search chip */}
  {(selectedMood || searchedText) && (
    <div className="flex items-center bg-gray-100 rounded-full px-5 py-2 mr-3">
      <span className="text-gray-600 text-sm">
        {selectedMood || searchedText}
      </span>
      <button onClick={clearSelection} className="ml-3">
        <X className="w-5 h-5" stroke="#848484" />
      </button>
    </div>
  )}

  {/* ✅ Search input area */}
  <div className="flex items-center space-x-2 flex-1">
    <input
    type="text"
    placeholder="Search moods..."
    value={searchQuery}
    onChange={handleSearchChange}
    className="flex-1 bg-transparent outline-none text-gray-700 text-sm placeholder-gray-400"
  />
    <Search className="w-6 h-6 text-gray-500 ml-2 flex-shrink-0" />

  </div>
</div>

        {/* Mood Options */}
        <div className="flex flex-wrap justify-center gap-8">
          {moods.map((mood, index) => (
            <button
              key={index}
              className="bg-gray-100 hover:bg-gray-200 rounded-full px-5 py-3 text-gray-600 text-sm transition-colors"
              onClick={() => navigate(`/dashboard/market-place?mood=${encodeURIComponent(mood)}`)}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoodSelector;

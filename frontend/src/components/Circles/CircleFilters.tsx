import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Globe, Flag, MapPin, Briefcase, Heart, Flame, Newspaper, Loader2 } from 'lucide-react';

interface CircleFiltersProps {
  selectedScope: string | null;
  setSelectedScope: (scope: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  userCountry?: string;
  userProvince?: string;
  onCountryDetected?: (country: string) => void;
  onProvinceDetected?: (province: string) => void;
}

const CircleFilters: React.FC<CircleFiltersProps> = ({
  selectedScope,
  setSelectedScope,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  userCountry,
  userProvince,
  onCountryDetected,
  onProvinceDetected,
}) => {
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(userCountry || null);
  const [detectedProvince, setDetectedProvince] = useState<string | null>(userProvince || null);

  const scopes = [
    { id: 'local', label: 'Local', icon: MapPin, color: 'blue' },
    { id: 'national', label: 'National', icon: Flag, color: 'purple' },
    { id: 'global', label: 'Global', icon: Globe, color: 'amber' },
  ];

  const categories = [
    { id: 'profession', label: 'Profession', icon: Briefcase, color: 'indigo' },
    { id: 'interest', label: 'Interest', icon: Heart, color: 'pink' },
    { id: 'living', label: 'Living', icon: Flame, color: 'orange' },
    { id: 'news', label: 'News & Events', icon: Newspaper, color: 'green' },
  ];

  const getChipStyle = (isSelected: boolean, color: string) => {
    if (isSelected) {
      const colorMap: Record<string, string> = {
        blue: 'bg-blue-500 text-white',
        purple: 'bg-purple-500 text-white',
        amber: 'bg-amber-500 text-white',
        indigo: 'bg-indigo-500 text-white',
        pink: 'bg-pink-500 text-white',
        orange: 'bg-orange-500 text-white',
        green: 'bg-green-500 text-white',
      };
      return colorMap[color] || 'bg-gray-500 text-white';
    }
    return 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300';
  };

  // Detect country from IP when National is clicked
  const detectCountryFromIP = async () => {
    if (detectedCountry) return detectedCountry;
    
    setDetectingCountry(true);
    try {
      // Use a free IP geolocation API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const country = data.country_name || data.country;
      
      if (country) {
        setDetectedCountry(country);
        onCountryDetected?.(country);
        return country;
      }
    } catch (error) {
      console.error('Error detecting country:', error);
      // Fallback to a secondary API
      try {
        const response = await fetch('https://ip-api.com/json/');
        const data = await response.json();
        const country = data.country;
        if (country) {
          setDetectedCountry(country);
          onCountryDetected?.(country);
          return country;
        }
      } catch (e) {
        console.error('Fallback country detection failed:', e);
      }
    }
    setDetectingCountry(false);
    return null;
  };

  const handleScopeClick = async (scopeId: string) => {
    if (selectedScope === scopeId) {
      setSelectedScope(null);
      return;
    }

    if (scopeId === 'national') {
      // Detect country first if not already detected
      const country = await detectCountryFromIP();
      setDetectingCountry(false);
    }

    setSelectedScope(scopeId);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
      {/* Top Row: Search and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search circles by name, profession, or interest..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="popular">Most Popular</option>
            <option value="active">Most Active</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Scope Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-sm text-gray-500 font-medium mr-2 self-center">Scope:</span>
        {scopes.map((scope) => {
          const Icon = scope.icon;
          const isSelected = selectedScope === scope.id;
          const showCountry = scope.id === 'national' && isSelected && detectedCountry;
          
          return (
            <button
              key={scope.id}
              onClick={() => handleScopeClick(scope.id)}
              disabled={detectingCountry && scope.id === 'national'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(isSelected, scope.color)} ${detectingCountry && scope.id === 'national' ? 'opacity-70' : ''}`}
            >
              {detectingCountry && scope.id === 'national' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {scope.label}
              {showCountry && (
                <span className="ml-1 opacity-90">({detectedCountry})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 font-medium mr-2 self-center">Category:</span>
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(isSelected ? null : category.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(isSelected, category.color)}`}
            >
              <Icon className="w-4 h-4" />
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CircleFilters;

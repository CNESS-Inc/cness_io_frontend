import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Globe, Flag, MapPin, Briefcase, Heart, Flame, Newspaper, Loader2, Activity, ChevronDown, X } from 'lucide-react';
import axios from 'axios';

interface Profession {
  _id: string;
  name: string;
}

interface Interest {
  id: string;
  name: string;
  interestName?: string;
}

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
  selectedProfession?: Profession | null;
  onProfessionSelect?: (profession: Profession | null) => void;
  selectedInterest?: Interest | null;
  onInterestSelect?: (interest: Interest | null) => void;
  showActivity?: boolean;
  onActivityToggle?: (show: boolean) => void;
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
  selectedProfession,
  onProfessionSelect,
  selectedInterest,
  onInterestSelect,
  showActivity,
  onActivityToggle,
}) => {
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(userCountry || null);
  const [detectedProvince, setDetectedProvince] = useState<string | null>(userProvince || null);
  
  // Profession dropdown state
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [professionSearch, setProfessionSearch] = useState('');
  const [loadingProfessions, setLoadingProfessions] = useState(false);
  const professionRef = useRef<HTMLDivElement>(null);
  
  // Interest dropdown state
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestSearch, setInterestSearch] = useState('');
  const [loadingInterests, setLoadingInterests] = useState(false);
  const interestRef = useRef<HTMLDivElement>(null);

  const scopes = [
    { id: 'local', label: 'Local', icon: MapPin, color: 'blue' },
    { id: 'national', label: 'National', icon: Flag, color: 'purple' },
    { id: 'global', label: 'Global', icon: Globe, color: 'amber' },
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
        cyan: 'bg-cyan-500 text-white',
      };
      return colorMap[color] || 'bg-gray-500 text-white';
    }
    return 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300';
  };

  // Fetch professions
  useEffect(() => {
    const fetchProfessions = async () => {
      setLoadingProfessions(true);
      try {
        const response = await axios.get('/api/professions');
        setProfessions(response.data.professions || []);
      } catch (error) {
        console.error('Error fetching professions:', error);
      }
      setLoadingProfessions(false);
    };
    fetchProfessions();
  }, []);

  // Fetch interests
  useEffect(() => {
    const fetchInterests = async () => {
      setLoadingInterests(true);
      try {
        const response = await axios.get('/api/interests');
        setInterests(response.data.interests || []);
      } catch (error) {
        console.error('Error fetching interests:', error);
      }
      setLoadingInterests(false);
    };
    fetchInterests();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (professionRef.current && !professionRef.current.contains(event.target as Node)) {
        setShowProfessionDropdown(false);
      }
      if (interestRef.current && !interestRef.current.contains(event.target as Node)) {
        setShowInterestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect location from IP
  const detectLocationFromIP = async (type: 'country' | 'province') => {
    if (type === 'country' && detectedCountry) return { country: detectedCountry, province: detectedProvince };
    if (type === 'province' && detectedProvince) return { country: detectedCountry, province: detectedProvince };
    
    setDetectingLocation(true);
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const country = data.country_name || data.country;
      const province = data.region || data.region_code || data.city;
      
      if (country) {
        setDetectedCountry(country);
        onCountryDetected?.(country);
      }
      if (province) {
        setDetectedProvince(province);
        onProvinceDetected?.(province);
      }
      return { country, province };
    } catch (error) {
      console.error('Error detecting location:', error);
      return { country: null, province: null };
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleScopeClick = async (scopeId: string) => {
    // Clear activity view when selecting scope
    onActivityToggle?.(false);
    
    if (selectedScope === scopeId) {
      setSelectedScope(null);
      return;
    }

    if (scopeId === 'national') {
      await detectLocationFromIP('country');
    } else if (scopeId === 'local') {
      await detectLocationFromIP('province');
    }

    setSelectedScope(scopeId);
  };

  const handleProfessionSelect = (profession: Profession) => {
    onProfessionSelect?.(profession);
    setSelectedCategory('profession');
    onInterestSelect?.(null);
    setShowProfessionDropdown(false);
    setProfessionSearch('');
    onActivityToggle?.(false);
  };

  const handleInterestSelect = (interest: Interest) => {
    onInterestSelect?.(interest);
    setSelectedCategory('interest');
    onProfessionSelect?.(null);
    setShowInterestDropdown(false);
    setInterestSearch('');
    onActivityToggle?.(false);
  };

  const handleActivityClick = () => {
    const newState = !showActivity;
    onActivityToggle?.(newState);
    if (newState) {
      // Clear other filters when viewing activity
      setSelectedCategory(null);
      onProfessionSelect?.(null);
      onInterestSelect?.(null);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    onActivityToggle?.(false);
    if (categoryId === 'profession' || categoryId === 'interest') {
      // These are handled by dropdowns now
      return;
    }
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    onProfessionSelect?.(null);
    onInterestSelect?.(null);
  };

  const clearProfessionFilter = () => {
    onProfessionSelect?.(null);
    if (selectedCategory === 'profession') {
      setSelectedCategory(null);
    }
  };

  const clearInterestFilter = () => {
    onInterestSelect?.(null);
    if (selectedCategory === 'interest') {
      setSelectedCategory(null);
    }
  };

  const filteredProfessions = professions.filter(p => 
    p.name.toLowerCase().includes(professionSearch.toLowerCase())
  );

  const filteredInterests = interests.filter(i => {
    const name = i.name || i.interestName || '';
    return name.toLowerCase().includes(interestSearch.toLowerCase());
  });

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
          const showProvince = scope.id === 'local' && isSelected && detectedProvince;
          
          return (
            <button
              key={scope.id}
              onClick={() => handleScopeClick(scope.id)}
              disabled={detectingLocation && (scope.id === 'national' || scope.id === 'local')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(isSelected, scope.color)} ${detectingLocation && (scope.id === 'national' || scope.id === 'local') ? 'opacity-70' : ''}`}
            >
              {detectingLocation && (scope.id === 'national' || scope.id === 'local') ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
              {scope.label}
              {showCountry && (
                <span className="ml-1 opacity-90">({detectedCountry})</span>
              )}
              {showProvince && (
                <span className="ml-1 opacity-90">({detectedProvince})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Row with Dropdowns */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500 font-medium mr-2">Category:</span>
        
        {/* All Professions Dropdown */}
        <div className="relative" ref={professionRef}>
          {selectedProfession ? (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-full text-sm font-medium">
              <Briefcase className="w-4 h-4" />
              {selectedProfession.name}
              <button 
                onClick={clearProfessionFilter}
                className="ml-1 hover:bg-indigo-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setShowProfessionDropdown(!showProfessionDropdown); setShowInterestDropdown(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(false, 'indigo')}`}
            >
              <Briefcase className="w-4 h-4" />
              All Professions
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          
          {showProfessionDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search professions..."
                  value={professionSearch}
                  onChange={(e) => setProfessionSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {loadingProfessions ? (
                  <div className="p-4 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-indigo-500" />
                  </div>
                ) : filteredProfessions.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No professions found</div>
                ) : (
                  filteredProfessions.slice(0, 50).map((prof) => (
                    <button
                      key={prof._id}
                      onClick={() => handleProfessionSelect(prof)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2"
                    >
                      <Briefcase className="w-4 h-4 text-indigo-500" />
                      {prof.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* All Interests Dropdown */}
        <div className="relative" ref={interestRef}>
          {selectedInterest ? (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-pink-500 text-white rounded-full text-sm font-medium">
              <Heart className="w-4 h-4" />
              {selectedInterest.name || selectedInterest.interestName}
              <button 
                onClick={clearInterestFilter}
                className="ml-1 hover:bg-pink-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setShowInterestDropdown(!showInterestDropdown); setShowProfessionDropdown(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(false, 'pink')}`}
            >
              <Heart className="w-4 h-4" />
              All Interests
              <ChevronDown className="w-4 h-4" />
            </button>
          )}
          
          {showInterestDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-hidden">
              <div className="p-3 border-b border-gray-100">
                <input
                  type="text"
                  placeholder="Search interests..."
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {loadingInterests ? (
                  <div className="p-4 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-pink-500" />
                  </div>
                ) : filteredInterests.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No interests found</div>
                ) : (
                  filteredInterests.slice(0, 50).map((interest) => (
                    <button
                      key={interest.id}
                      onClick={() => handleInterestSelect(interest)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-pink-50 transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 text-pink-500" />
                      {interest.name || interest.interestName}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Living */}
        <button
          onClick={() => handleCategoryClick('living')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(selectedCategory === 'living', 'orange')}`}
        >
          <Flame className="w-4 h-4" />
          Living
        </button>

        {/* News & Events */}
        <button
          onClick={() => handleCategoryClick('news')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${getChipStyle(selectedCategory === 'news', 'green')}`}
        >
          <Newspaper className="w-4 h-4" />
          News & Events
        </button>
      </div>
    </div>
  );
};

export default CircleFilters;

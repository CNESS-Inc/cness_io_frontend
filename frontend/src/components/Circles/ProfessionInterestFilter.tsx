import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Briefcase, Heart, Globe, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Profession {
  _id: string;
  name: string;
}

interface Interest {
  id: string;
  name: string;
}

interface ProfessionInterestFilterProps {
  selectedProfession: Profession | null;
  onProfessionSelect: (profession: Profession | null) => void;
  selectedInterest: Interest | null;
  onInterestSelect: (interest: Interest | null) => void;
}

const ProfessionInterestFilter: React.FC<ProfessionInterestFilterProps> = ({
  selectedProfession,
  onProfessionSelect,
  selectedInterest,
  onInterestSelect,
}) => {
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [professionSearch, setProfessionSearch] = useState('');
  const [interestSearch, setInterestSearch] = useState('');
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [loadingProfessions, setLoadingProfessions] = useState(false);
  const [loadingInterests, setLoadingInterests] = useState(false);

  const professionRef = useRef<HTMLDivElement>(null);
  const interestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Close dropdowns when clicking outside
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

  const fetchData = async () => {
    setLoadingProfessions(true);
    setLoadingInterests(true);
    
    const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || '';
    
    try {
      const [profRes, intRes] = await Promise.all([
        axios.get(`${backendUrl}/api/professions`),
        axios.get(`${backendUrl}/api/interests`)
      ]);
      setProfessions(profRes.data.professions || []);
      setInterests(intRes.data.interests || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
    setLoadingProfessions(false);
    setLoadingInterests(false);
  };

  const filteredProfessions = professions.filter(p =>
    (p.name || '').toLowerCase().includes(professionSearch.toLowerCase())
  );

  const filteredInterests = interests.filter(i =>
    (i.name || '').toLowerCase().includes(interestSearch.toLowerCase())
  );

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Profession Dropdown */}
      <div className="relative" ref={professionRef}>
        <button
          onClick={() => {
            setShowProfessionDropdown(!showProfessionDropdown);
            setShowInterestDropdown(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
            selectedProfession
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span className="font-medium">
            {selectedProfession ? selectedProfession.name : 'All Professions'}
          </span>
          {selectedProfession && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProfessionSelect(null);
              }}
              className="ml-1 p-0.5 hover:bg-indigo-200 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </button>

        {showProfessionDropdown && (
          <div className="absolute z-30 top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
              <h5 className="font-semibold text-indigo-800 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Professions
              </h5>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search professions..."
                  value={professionSearch}
                  onChange={(e) => setProfessionSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* All Professions Option */}
            <button
              onClick={() => {
                onProfessionSelect(null);
                setShowProfessionDropdown(false);
                setProfessionSearch('');
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Globe className="w-4 h-4 text-gray-500" />
              </div>
              <span className="font-medium">All Professions</span>
            </button>

            {/* Profession List */}
            <div className="max-h-60 overflow-y-auto">
              {loadingProfessions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                </div>
              ) : filteredProfessions.length === 0 ? (
                <p className="text-center py-4 text-gray-500 text-sm">No professions found</p>
              ) : (
                filteredProfessions.slice(0, 50).map((p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      onProfessionSelect(p);
                      setShowProfessionDropdown(false);
                      setProfessionSearch('');
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 flex items-center gap-3 ${
                      selectedProfession?._id === p._id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium text-xs">
                      {(p.name || '').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interest Dropdown */}
      <div className="relative" ref={interestRef}>
        <button
          onClick={() => {
            setShowInterestDropdown(!showInterestDropdown);
            setShowProfessionDropdown(false);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
            selectedInterest
              ? 'bg-pink-50 border-pink-300 text-pink-700'
              : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span className="font-medium">
            {selectedInterest ? selectedInterest.name : 'All Interests'}
          </span>
          {selectedInterest && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onInterestSelect(null);
              }}
              className="ml-1 p-0.5 hover:bg-pink-200 rounded-full"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </button>

        {showInterestDropdown && (
          <div className="absolute z-30 top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-gray-100">
              <h5 className="font-semibold text-pink-800 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Interests
              </h5>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search interests..."
                  value={interestSearch}
                  onChange={(e) => setInterestSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* All Interests Option */}
            <button
              onClick={() => {
                onInterestSelect(null);
                setShowInterestDropdown(false);
                setInterestSearch('');
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <Globe className="w-4 h-4 text-gray-500" />
              </div>
              <span className="font-medium">All Interests</span>
            </button>

            {/* Interest List */}
            <div className="max-h-60 overflow-y-auto">
              {loadingInterests ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-pink-600" />
                </div>
              ) : filteredInterests.length === 0 ? (
                <p className="text-center py-4 text-gray-500 text-sm">No interests found</p>
              ) : (
                filteredInterests.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => {
                      onInterestSelect(i);
                      setShowInterestDropdown(false);
                      setInterestSearch('');
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm hover:bg-pink-50 flex items-center gap-3 ${
                      selectedInterest?.id === i.id ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium text-xs">
                      {(i.name || '').charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{i.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionInterestFilter;

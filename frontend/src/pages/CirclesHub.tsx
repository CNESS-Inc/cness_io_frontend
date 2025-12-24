import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import type { Circle } from '../types/circles';
import { getCircles, getFeaturedCircles, getUserCircles } from '../services/circlesApi';
import CircleCard from '../components/Circles/CircleCard';
import FeaturedCarousel from '../components/Circles/FeaturedCarousel';
import CircleFilters from '../components/Circles/CircleFilters';
import CreateCircleModal from '../components/Circles/CreateCircleModal';
import ProfessionInterestFilter from '../components/Circles/ProfessionInterestFilter';

interface Profession {
  _id: string;
  name: string;
}

interface Interest {
  id: string;
  name: string;
}

const CirclesHub: React.FC = () => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [featuredCircles, setFeaturedCircles] = useState<Circle[]>([]);
  const [userCircleIds, setUserCircleIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [selectedScope, setSelectedScope] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [userCountry, setUserCountry] = useState<string | null>(null);
  const [userProvince, setUserProvince] = useState<string | null>(null);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [selectedInterest, setSelectedInterest] = useState<Interest | null>(null);

  const fetchCircles = async () => {
    setLoading(true);
    try {
      const params: any = {
        sort: sortBy,
        page: 1,
        limit: 50,
      };
      if (selectedScope) params.scope = selectedScope;
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      
      // Add country filter when national scope is selected
      if (selectedScope === 'national' && userCountry) {
        params.country = userCountry;
      }
      
      // Add profession filter
      if (selectedProfession) {
        params.profession_id = selectedProfession._id;
        params.category = 'profession';
      }
      
      // Add interest filter
      if (selectedInterest) {
        params.interest_id = selectedInterest.id;
        params.category = 'interest';
      }

      const [circlesRes, featuredRes, userCirclesRes] = await Promise.all([
        getCircles(params),
        getFeaturedCircles(5),
        getUserCircles(),
      ]);

      setCircles(circlesRes.circles || []);
      setFeaturedCircles(featuredRes.circles || []);
      
      const userIds = new Set<string>((userCirclesRes.circles || []).map((c: Circle) => c.id));
      setUserCircleIds(userIds);
    } catch (error) {
      console.error('Error fetching circles:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCircles();
  }, [selectedScope, selectedCategory, searchQuery, sortBy, userCountry, selectedProfession, selectedInterest]);

  const handleCountryDetected = (country: string) => {
    setUserCountry(country);
  };

  const handleProfessionSelect = (profession: Profession | null) => {
    setSelectedProfession(profession);
    if (profession) {
      setSelectedInterest(null); // Clear interest when profession is selected
    }
  };

  const handleInterestSelect = (interest: Interest | null) => {
    setSelectedInterest(interest);
    if (interest) {
      setSelectedProfession(null); // Clear profession when interest is selected
    }
  };

  const handleCircleCreated = () => {
    setShowCreateModal(false);
    fetchCircles();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Circles</h1>
            <p className="text-gray-600 mt-1">
              Join communities based on your profession, interests, and location
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchCircles}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg shadow-purple-500/25"
            >
              <Plus className="w-5 h-5" />
              Create Circle
            </button>
          </div>
        </div>

        {/* Featured Carousel */}
        {featuredCircles.length > 0 && (
          <FeaturedCarousel circles={featuredCircles} />
        )}

        {/* Filters */}
        <CircleFilters
          selectedScope={selectedScope}
          setSelectedScope={setSelectedScope}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          userCountry={userCountry || undefined}
          onCountryDetected={handleCountryDetected}
        />

        {/* Profession & Interest Filters */}
        <ProfessionInterestFilter
          selectedProfession={selectedProfession}
          onProfessionSelect={handleProfessionSelect}
          selectedInterest={selectedInterest}
          onInterestSelect={handleInterestSelect}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            {circles.length} {circles.length === 1 ? 'circle' : 'circles'} found
            {selectedProfession && ` for ${selectedProfession.name}`}
            {selectedInterest && ` for ${selectedInterest.name}`}
          </p>
        </div>

        {/* Circles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200" />
                </div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3" />
                <div className="flex justify-center gap-2 mb-3">
                  <div className="h-5 bg-gray-200 rounded-full w-16" />
                  <div className="h-5 bg-gray-200 rounded-full w-20" />
                </div>
                <div className="flex justify-center gap-4">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : circles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No circles found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedScope || selectedCategory
                ? 'Try adjusting your filters'
                : 'Be the first to create a circle!'}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
            >
              Create Circle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {circles.map((circle) => (
              <CircleCard
                key={circle.id}
                circle={circle}
                isMember={userCircleIds.has(circle.id)}
                onMembershipChange={fetchCircles}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Circle Modal */}
      {showCreateModal && (
        <CreateCircleModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCircleCreated}
        />
      )}
    </div>
  );
};

export default CirclesHub;

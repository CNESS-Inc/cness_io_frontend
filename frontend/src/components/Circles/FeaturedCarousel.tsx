import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Users, Sparkles } from 'lucide-react';
import { Circle } from '../../services/circlesApi';

interface FeaturedCarouselProps {
  circles: Circle[];
}

const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({ circles }) => {
  const navigate = useNavigate();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getScopeGradient = (scope: string) => {
    switch (scope) {
      case 'local':
        return 'from-blue-600 to-blue-400';
      case 'national':
        return 'from-purple-600 to-purple-400';
      case 'global':
        return 'from-amber-500 to-orange-400';
      default:
        return 'from-gray-600 to-gray-400';
    }
  };

  if (circles.length === 0) return null;

  return (
    <div className="relative mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h2 className="text-xl font-bold text-gray-900">Featured Circles</h2>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>

        {/* Cards Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-12 py-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {circles.map((circle) => (
            <div
              key={circle.id}
              onClick={() => navigate(`/dashboard/circles/${circle.id}`)}
              className={`flex-shrink-0 w-72 h-40 rounded-2xl bg-gradient-to-br ${getScopeGradient(circle.scope)} p-5 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="flex items-start gap-4 h-full">
                {/* Circle Image */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white/30 flex-shrink-0">
                  <img
                    src={circle.image_url}
                    alt={circle.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between text-white">
                  <div>
                    <h3 className="font-bold text-lg line-clamp-1">{circle.name}</h3>
                    <p className="text-white/80 text-sm line-clamp-2 mt-1">
                      {circle.intention}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="w-4 h-4" />
                      <span>{circle.member_count.toLocaleString()}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs capitalize">
                      {circle.scope}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default FeaturedCarousel;

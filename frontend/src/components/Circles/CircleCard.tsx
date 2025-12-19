import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, Briefcase, Heart, Flame, Newspaper } from 'lucide-react';
import type { Circle } from '../../types/circles';
import { joinCircle, leaveCircle } from '../../services/circlesApi';

interface CircleCardProps {
  circle: Circle;
  isMember?: boolean;
  onMembershipChange?: () => void;
}

const CircleCard: React.FC<CircleCardProps> = ({ circle, isMember = false, onMembershipChange }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [joining, setJoining] = useState(false);
  const [memberStatus, setMemberStatus] = useState(isMember);

  // Scope ring styles
  const getScopeRingStyle = () => {
    switch (circle.scope) {
      case 'local':
        return 'ring-4 ring-blue-500'; // Solid blue
      case 'national':
        return 'ring-4 ring-purple-600 ring-offset-2'; // Thick purple
      case 'global':
        return 'ring-4 ring-amber-500 ring-dashed'; // Dashed gold
      default:
        return 'ring-4 ring-gray-300';
    }
  };

  // Scope badge color
  const getScopeBadgeStyle = () => {
    switch (circle.scope) {
      case 'local':
        return 'bg-blue-100 text-blue-700';
      case 'national':
        return 'bg-purple-100 text-purple-700';
      case 'global':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Category icon
  const getCategoryIcon = () => {
    switch (circle.category) {
      case 'profession':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'interest':
        return <Heart className="w-3.5 h-3.5" />;
      case 'living':
        return <Flame className="w-3.5 h-3.5" />;
      case 'news':
        return <Newspaper className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  // Category badge color
  const getCategoryBadgeStyle = () => {
    switch (circle.category) {
      case 'profession':
        return 'bg-indigo-100 text-indigo-700';
      case 'interest':
        return 'bg-pink-100 text-pink-700';
      case 'living':
        return 'bg-orange-100 text-orange-700';
      case 'news':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleJoinLeave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setJoining(true);
    try {
      if (memberStatus) {
        await leaveCircle(circle.id);
        setMemberStatus(false);
      } else {
        await joinCircle(circle.id);
        setMemberStatus(true);
      }
      onMembershipChange?.();
    } catch (error) {
      console.error('Error changing membership:', error);
    }
    setJoining(false);
  };

  const handleEnterCircle = () => {
    navigate(`/dashboard/circles/${circle.id}`);
  };

  return (
    <div
      className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleEnterCircle}
    >
      {/* Circle Image with Scope Ring */}
      <div className="flex justify-center mb-4">
        <div className={`relative w-24 h-24 rounded-full overflow-hidden ${getScopeRingStyle()}`}>
          <img
            src={circle.image_url}
            alt={circle.name}
            className="w-full h-full object-cover"
          />
          {/* Online indicator */}
          {circle.online_now > 0 && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
      </div>

      {/* Circle Name */}
      <h3 className="text-lg font-semibold text-gray-900 text-center mb-1 line-clamp-1">
        {circle.name}
      </h3>

      {/* Intention */}
      <p className="text-sm text-gray-500 text-center mb-3 line-clamp-1">
        {circle.intention}
      </p>

      {/* Tags */}
      <div className="flex justify-center gap-2 mb-3 flex-wrap">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getScopeBadgeStyle()}`}>
          {circle.scope}
        </span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${getCategoryBadgeStyle()}`}>
          {getCategoryIcon()}
          {circle.category}
        </span>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{circle.member_count.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-green-600">{circle.active_today} active</span>
        </div>
      </div>

      {/* Hover Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center gap-3 transition-opacity">
          <button
            onClick={handleEnterCircle}
            className="px-6 py-2 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Enter Circle
          </button>
          <button
            onClick={handleJoinLeave}
            disabled={joining}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              memberStatus
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {joining ? '...' : memberStatus ? 'Joined' : 'Join'}
          </button>
        </div>
      )}
    </div>
  );
};

export default CircleCard;

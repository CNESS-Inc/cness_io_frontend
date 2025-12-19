import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, Users, 
  Activity, ArrowRight, UserPlus, Globe, Flag, MapPin 
} from 'lucide-react';
import { Circle, CirclePost, likeCirclePost } from '../../services/circlesApi';

interface CirclePostCardProps {
  post: CirclePost;
  circle?: Circle;
  showCircleInfo?: boolean;
}

const CirclePostCard: React.FC<CirclePostCardProps> = ({ 
  post, 
  circle,
  showCircleInfo = false 
}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes_count);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      await likeCirclePost(post.id);
      setLikes(prev => prev + 1);
      setLiked(true);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const getScopeBorderColor = () => {
    const scope = circle?.scope || post.circle_scope;
    switch (scope) {
      case 'local': return 'border-l-blue-500';
      case 'national': return 'border-l-purple-500';
      case 'global': return 'border-l-amber-500';
      default: return 'border-l-gray-300';
    }
  };

  const getScopeBgColor = () => {
    const scope = circle?.scope || post.circle_scope;
    switch (scope) {
      case 'local': return 'bg-blue-50/50';
      case 'national': return 'bg-purple-50/50';
      case 'global': return 'bg-amber-50/50';
      default: return 'bg-gray-50';
    }
  };

  const getScopeIcon = () => {
    const scope = circle?.scope || post.circle_scope;
    switch (scope) {
      case 'local': return <MapPin className="w-3 h-3" />;
      case 'national': return <Flag className="w-3 h-3" />;
      case 'global': return <Globe className="w-3 h-3" />;
      default: return null;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const circleName = circle?.name || post.circle_name;
  const circleImage = circle?.image_url || post.circle_image;
  const memberCount = circle?.member_count || post.circle_member_count || 0;
  const activeToday = circle?.active_today || post.circle_active_today || 0;

  return (
    <div className={`rounded-xl shadow-sm border border-gray-100 overflow-hidden ${getScopeBgColor()}`}>
      {/* Circle Badge Header */}
      <div className="bg-white px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
            Community Circle
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            {getScopeIcon()}
            <span className="capitalize">{circle?.scope || post.circle_scope}</span>
          </span>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreHorizontal className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Main Content with Left Border Accent */}
      <div className={`border-l-4 ${getScopeBorderColor()}`}>
        {/* Circle Info (if showing in feed) */}
        {showCircleInfo && (
          <div 
            className="px-4 py-3 bg-white/50 flex items-center gap-3 cursor-pointer hover:bg-white/80 transition-colors"
            onClick={() => navigate(`/dashboard/circles/${post.circle_id}`)}
          >
            <img
              src={circleImage}
              alt={circleName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{circleName}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {memberCount.toLocaleString()} members
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-500" />
                  {activeToday} active
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        )}

        {/* Post Content */}
        <div className="px-4 py-4 bg-white">
          {/* Author */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
              {post.user_id.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">User {post.user_id.slice(0, 8)}</div>
              <div className="text-xs text-gray-500">{formatDate(post.created_at)}</div>
            </div>
          </div>

          {/* Content */}
          <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>

          {/* Media */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="grid gap-2 mb-4">
              {post.media_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt=""
                  className="rounded-lg max-h-96 object-cover w-full"
                />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                  liked 
                    ? 'bg-red-100 text-red-600' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likes}</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.comments_count}</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-gray-600">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(`/dashboard/circles/${post.circle_id}`)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Enter Circle
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <UserPlus className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CirclePostCard;

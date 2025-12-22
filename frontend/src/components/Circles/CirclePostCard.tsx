import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, Users, 
  Activity, ArrowRight, UserPlus, Globe, Flag, MapPin,
  Copy, Facebook, Twitter, Linkedin
} from 'lucide-react';
import type { Circle, CirclePost } from '../../types/circles';
import { toggleLikePost, getLikeStatus, sharePost } from '../../services/circlesApi';
import CommentModal from './CommentModal';

interface CirclePostCardProps {
  post: CirclePost;
  circle?: Circle;
  showCircleInfo?: boolean;
  onUpdate?: () => void;
}

const CirclePostCard: React.FC<CirclePostCardProps> = ({ 
  post, 
  circle,
  showCircleInfo = false,
  onUpdate
}) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(post.likes_count);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    // Check if user has liked this post
    checkLikeStatus();
  }, [post.id]);

  const checkLikeStatus = async () => {
    try {
      const response = await getLikeStatus(post.id);
      setLiked(response.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await toggleLikePost(post.id);
      setLiked(response.liked);
      setLikes(response.likes_count);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (platform: string) => {
    const postUrl = `${window.location.origin}/dashboard/circles/${post.circle_id}?post=${post.id}`;
    const text = post.content.slice(0, 100) + '...';

    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        alert('Link copied to clipboard!');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
    }

    try {
      await sharePost(post.id, platform);
    } catch (error) {
      console.error('Error tracking share:', error);
    }
    setShowShareMenu(false);
  };

  const handleCommentAdded = () => {
    setComments(prev => prev + 1);
    onUpdate?.();
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
    <>
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
            <p className="text-gray-800 whitespace-pre-wrap mb-4">
              {post.content.split(/(@\S+)/g).map((part, i) => 
                part.startsWith('@') ? (
                  <span key={i} className="text-purple-600 font-medium">{part}</span>
                ) : part
              )}
            </p>

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

            {/* Engagement Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              {likes > 0 && (
                <span>{likes} {likes === 1 ? 'like' : 'likes'}</span>
              )}
              {comments > 0 && (
                <span>{comments} {comments === 1 ? 'comment' : 'comments'}</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    liked 
                      ? 'bg-red-100 text-red-600' 
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">Like</span>
                </button>

                {/* Comment Button */}
                <button 
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Comment</span>
                </button>

                {/* Share Button */}
                <div className="relative">
                  <button 
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>

                  {/* Share Menu */}
                  {showShareMenu && (
                    <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px] z-10">
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                        Copy link
                      </button>
                      <button
                        onClick={() => handleShare('facebook')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <Facebook className="w-4 h-4 text-blue-600" />
                        Facebook
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <Twitter className="w-4 h-4 text-sky-500" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                      >
                        <Linkedin className="w-4 h-4 text-blue-700" />
                        LinkedIn
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Comment Modal */}
      <CommentModal 
        postId={post.id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
};

export default CirclePostCard;

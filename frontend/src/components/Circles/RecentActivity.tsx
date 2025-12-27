import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, UserPlus, MessageSquare, Heart, FileText, 
  ChevronRight, X, Clock, Users, RefreshCw 
} from 'lucide-react';
import { getRecentActivities } from '../../services/circlesApi';

interface ActivityItem {
  id: string;
  type: 'member_join' | 'new_post' | 'comment' | 'like';
  action: string;
  user_id: string;
  user_name: string;
  circle_id: string;
  circle_name: string;
  circle_image?: string;
  post_id?: string;
  content_preview?: string;
  timestamp: string;
  description: string;
}

interface RecentActivityProps {
  circleId?: string; // Optional - if provided, shows activities for specific circle
  maxItems?: number; // Max items to show in collapsed view
}

const RecentActivity: React.FC<RecentActivityProps> = ({ circleId, maxItems = 5 }) => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(maxItems > 10); // Auto-show all for full page view
  const [allActivities, setAllActivities] = useState<ActivityItem[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const isFullPage = maxItems > 10;

  const fetchActivities = async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const response = await getRecentActivities({
        page: pageNum,
        limit: 20,
        circle_id: circleId
      });
      
      const newActivities = response.activities || [];
      
      if (append) {
        setAllActivities(prev => [...prev, ...newActivities]);
      } else {
        setActivities(newActivities.slice(0, maxItems));
        setAllActivities(newActivities);
      }
      
      setHasMore(response.has_more);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
    
    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    fetchActivities();
  }, [circleId]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchActivities(nextPage, true);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'member_join':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'new_post':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case 'like':
        return <Heart className="w-4 h-4 text-red-500 fill-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'member_join':
        return 'bg-green-50 border-green-100';
      case 'new_post':
        return 'bg-blue-50 border-blue-100';
      case 'comment':
        return 'bg-purple-50 border-purple-100';
      case 'like':
        return 'bg-red-50 border-red-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  const handleActivityClick = (activity: ActivityItem) => {
    if (activity.post_id) {
      navigate(`/dashboard/circles/${activity.circle_id}?post=${activity.post_id}`);
    } else {
      navigate(`/dashboard/circles/${activity.circle_id}`);
    }
  };

  const ActivityCard: React.FC<{ activity: ActivityItem; compact?: boolean }> = ({ activity, compact = false }) => (
    <div
      onClick={() => handleActivityClick(activity)}
      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all ${getActivityColor(activity.type)}`}
    >
      {/* Circle Image */}
      <div className="relative flex-shrink-0">
        <img
          src={activity.circle_image || 'https://cdn.cness.io/community1.webp'}
          alt={activity.circle_name}
          className="w-10 h-10 rounded-lg object-cover"
        />
        <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
          {getActivityIcon(activity.type)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">
          <span className="font-medium">{activity.user_name}</span>
          {' '}
          <span className="text-gray-600">{activity.description}</span>
        </p>
        {activity.content_preview && !compact && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            "{activity.content_preview}"
          </p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-400">{formatTimeAgo(activity.timestamp)}</span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </div>
  );

  // For full page mode, show activities directly without the card wrapper
  if (isFullPage) {
    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 animate-pulse">
              <div className="w-12 h-12 rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activities.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h3>
          <p className="text-gray-500">Activities will appear here when members interact with circles</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {allActivities.map((activity) => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
        
        {/* Load More */}
        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="w-full py-3 text-sm font-medium text-purple-600 hover:text-purple-700 bg-white hover:bg-purple-50 rounded-xl border border-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loadingMore ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Activities
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  // Regular card view for sidebar
  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Collapsed View */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
            {activities.length > 0 && (
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                {allActivities.length}+
              </span>
            )}
          </div>
          <button
            onClick={() => fetchActivities()}
            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No recent activity yet</p>
            <p className="text-gray-400 text-xs mt-1">Activities will appear here when members interact</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} compact />
              ))}
            </div>

            {allActivities.length > maxItems && (
              <button
                onClick={() => setShowAll(true)}
                className="w-full mt-4 py-2.5 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                View All Activity
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Full Activity Modal */}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setShowAll(false)} 
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">All Activity</h2>
                  <p className="text-sm text-gray-500">{allActivities.length} activities</p>
                </div>
              </div>
              <button
                onClick={() => setShowAll(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Activity List */}
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {allActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full mt-4 py-3 text-sm font-medium text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecentActivity;

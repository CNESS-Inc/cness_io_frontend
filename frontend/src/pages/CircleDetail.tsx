import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Users, Activity, Wifi, Globe, Flag, MapPin, 
  Briefcase, Heart, Flame, Newspaper, Share2, Settings,
  MessageSquare, BookOpen, UserPlus, Loader2, MessageCircle
} from 'lucide-react';
import type { Circle, CirclePost } from '../types/circles';
import { 
  getCircle, getCirclePosts, 
  checkMembership, joinCircle, leaveCircle, createCirclePost 
} from '../services/circlesApi';
import CirclePostCard from '../components/Circles/CirclePostCard';
import ChatRoomList from '../components/Circles/ChatRoomList';

const CircleDetail: React.FC = () => {
  const { circleId } = useParams<{ circleId: string }>();
  const navigate = useNavigate();
  
  const [circle, setCircle] = useState<Circle | null>(null);
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [memberRole, setMemberRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (circleId) {
      fetchCircleData();
    }
  }, [circleId]);

  const fetchCircleData = async () => {
    setLoading(true);
    try {
      const [circleRes, postsRes, membershipRes] = await Promise.all([
        getCircle(circleId!),
        getCirclePosts(circleId!, { limit: 50 }),
        checkMembership(circleId!),
      ]);
      
      setCircle(circleRes.circle);
      setPosts(postsRes.posts || []);
      setIsMember(membershipRes.is_member);
      setMemberRole(membershipRes.role);
    } catch (error) {
      console.error('Error fetching circle:', error);
    }
    setLoading(false);
  };

  const handleJoinLeave = async () => {
    setJoining(true);
    try {
      if (isMember) {
        await leaveCircle(circleId!);
        setIsMember(false);
        setMemberRole(null);
      } else {
        await joinCircle(circleId!);
        setIsMember(true);
        setMemberRole('member');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setJoining(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || !isMember) return;
    
    setPosting(true);
    try {
      await createCirclePost(circleId!, {
        content: newPostContent,
        post_type: 'regular'
      });
      setNewPostContent('');
      fetchCircleData();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setPosting(false);
  };

  const getScopeIcon = () => {
    switch (circle?.scope) {
      case 'local': return <MapPin className="w-4 h-4" />;
      case 'national': return <Flag className="w-4 h-4" />;
      case 'global': return <Globe className="w-4 h-4" />;
      default: return null;
    }
  };

  const getCategoryIcon = () => {
    switch (circle?.category) {
      case 'profession': return <Briefcase className="w-4 h-4" />;
      case 'interest': return <Heart className="w-4 h-4" />;
      case 'living': return <Flame className="w-4 h-4" />;
      case 'news': return <Newspaper className="w-4 h-4" />;
      default: return null;
    }
  };

  const getScopeRingStyle = () => {
    switch (circle?.scope) {
      case 'local': return 'ring-8 ring-blue-500';
      case 'national': return 'ring-8 ring-purple-600 ring-offset-4';
      case 'global': return 'ring-8 ring-amber-500';
      default: return 'ring-8 ring-gray-300';
    }
  };

  const getScopeBadgeStyle = () => {
    switch (circle?.scope) {
      case 'local': return 'bg-blue-100 text-blue-700';
      case 'national': return 'bg-purple-100 text-purple-700';
      case 'global': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryBadgeStyle = () => {
    switch (circle?.category) {
      case 'profession': return 'bg-indigo-100 text-indigo-700';
      case 'interest': return 'bg-pink-100 text-pink-700';
      case 'living': return 'bg-orange-100 text-orange-700';
      case 'news': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const [showChat, setShowChat] = useState(false);

  const tabs = [
    { id: 'feed', label: 'Feed', icon: MessageSquare },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'prompts', label: 'Prompts', icon: BookOpen },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!circle) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Circle not found</h2>
        <button
          onClick={() => navigate('/dashboard/circles')}
          className="text-purple-600 hover:text-purple-700"
        >
          Back to Circles
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/dashboard/circles')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Circles
          </button>

          {/* Circle Header */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Circle Image with Scope Ring */}
            <div className={`w-28 h-28 rounded-full overflow-hidden ${getScopeRingStyle()}`}>
              <img
                src={circle.image_url}
                alt={circle.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Circle Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{circle.name}</h1>
              
              {/* Badges */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getScopeBadgeStyle()}`}>
                  {getScopeIcon()}
                  {circle.scope}
                </span>
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize ${getCategoryBadgeStyle()}`}>
                  {getCategoryIcon()}
                  {circle.category}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{circle.description}</p>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span><strong>{circle.member_count.toLocaleString()}</strong> Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  <span className="text-green-600"><strong>{circle.active_today}</strong> Active Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-600"><strong>{circle.online_now}</strong> Online Now</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleJoinLeave}
                disabled={joining || memberRole === 'admin'}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
                  isMember
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                } disabled:opacity-50`}
              >
                {joining ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isMember ? (
                  'Joined'
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Join Circle
                  </>
                )}
              </button>
              <div className="flex gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
                {memberRole === 'admin' && (
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Settings className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === 'feed' && (
          <div className="space-y-4">
            {/* Create Post */}
            {isMember && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share something with the circle..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || posting}
                    className="px-5 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {posting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Post
                  </button>
                </div>
              </div>
            )}

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No posts yet</h3>
                <p className="text-gray-500">
                  {isMember ? 'Be the first to post!' : 'Join to see and create posts'}
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <CirclePostCard key={post.id} post={post} circle={circle} />
              ))
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl">
            {!isMember ? (
              <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Join to access chat</h3>
                <p className="text-gray-500 mb-4">Become a member to participate in chat rooms</p>
                <button
                  onClick={handleJoinLeave}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                >
                  Join Circle
                </button>
              </div>
            ) : (
              <div className="p-4">
                <button
                  onClick={() => setShowChat(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Open Chat Rooms
                </button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Create or join chat rooms to connect with other members
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'prompts' && (
          <div className="text-center py-12 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Prompts coming soon</h3>
            <p className="text-gray-500">Discussion prompts will appear here</p>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{circle.member_count} Members</h3>
            <p className="text-gray-500">Member list coming soon...</p>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="text-center py-12 bg-white rounded-xl">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Resources coming soon</h3>
            <p className="text-gray-500">Shared resources will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CircleDetail;

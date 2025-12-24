import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, LogOut, Users, Activity,
  Globe, Flag, MapPin, TrendingUp, BarChart3, RefreshCw,
  ChevronRight, Circle as CircleIcon, Briefcase, Heart, Search, X
} from 'lucide-react';
import axios from 'axios';

interface Statistics {
  circles: {
    total: number;
    by_scope: { global: number; national: number; local: number };
    by_category: { profession: number; interest: number; living: number; news: number };
    by_country: Record<string, number>;
  };
  posts: {
    total: number;
    by_status: { published: number; draft: number; suspended: number };
  };
  resources: {
    total: number;
    by_type: Record<string, number>;
  };
  members: {
    total_memberships: number;
    unique_users: number;
  };
  top_circles: any[];
}

const CircleAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('circleAdminToken');
    const user = localStorage.getItem('circleAdminUser');
    
    if (!token) {
      navigate('/circles/circleadmin');
      return;
    }
    
    setAdminUser(user || 'Admin');
    fetchStatistics();
  }, [navigate]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('circleAdminToken');
      const response = await axios.get(`/api/admin/statistics?admin_token=${token}`);
      setStatistics(response.data.statistics);
    } catch (error: any) {
      if (error.response?.status === 401) {
        handleLogout();
      }
      console.error('Error fetching statistics:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('circleAdminToken');
    localStorage.removeItem('circleAdminUser');
    navigate('/circles/circleadmin');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'posts', label: 'Manage Posts', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab statistics={statistics} loading={loading} onRefresh={fetchStatistics} />;
      case 'posts':
        return <PostsManagementTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab statistics={statistics} loading={loading} onRefresh={fetchStatistics} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Circles Admin</h1>
          <p className="text-sm text-gray-500 mt-1">{adminUser}</p>
        </div>
        
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-50 text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab: React.FC<{
  statistics: Statistics | null;
  loading: boolean;
  onRefresh: () => void;
}> = ({ statistics, loading, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Circles"
          value={statistics?.circles.total || 0}
          icon={CircleIcon}
          color="purple"
        />
        <StatCard
          title="Total Posts"
          value={statistics?.posts.total || 0}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Total Resources"
          value={statistics?.resources.total || 0}
          icon={BarChart3}
          color="green"
        />
        <StatCard
          title="Unique Users"
          value={statistics?.members.unique_users || 0}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Scope Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Circles by Scope</h3>
          <div className="space-y-4">
            <ScopeBar
              label="Global"
              value={statistics?.circles.by_scope.global || 0}
              total={statistics?.circles.total || 1}
              icon={Globe}
              color="amber"
            />
            <ScopeBar
              label="National"
              value={statistics?.circles.by_scope.national || 0}
              total={statistics?.circles.total || 1}
              icon={Flag}
              color="purple"
            />
            <ScopeBar
              label="Local"
              value={statistics?.circles.by_scope.local || 0}
              total={statistics?.circles.total || 1}
              icon={MapPin}
              color="blue"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Posts by Status</h3>
          <div className="space-y-4">
            <StatusBar
              label="Published"
              value={statistics?.posts.by_status.published || 0}
              total={statistics?.posts.total || 1}
              color="green"
            />
            <StatusBar
              label="Draft"
              value={statistics?.posts.by_status.draft || 0}
              total={statistics?.posts.total || 1}
              color="yellow"
            />
            <StatusBar
              label="Suspended"
              value={statistics?.posts.by_status.suspended || 0}
              total={statistics?.posts.total || 1}
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Top Circles */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Top Circles by Members</h3>
        <div className="space-y-3">
          {statistics?.top_circles.slice(0, 5).map((circle, index) => (
            <div key={circle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center bg-purple-100 text-purple-600 rounded-full font-semibold">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{circle.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{circle.scope} • {circle.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{circle.member_count?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">members</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: any;
  color: string;
}> = ({ title, value, icon: Icon, color }) => {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value.toLocaleString()}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Scope Bar Component
const ScopeBar: React.FC<{
  label: string;
  value: number;
  total: number;
  icon: any;
  color: string;
}> = ({ label, value, total, icon: Icon, color }) => {
  const percentage = Math.round((value / total) * 100);
  const colorClasses: Record<string, string> = {
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Status Bar Component
const StatusBar: React.FC<{
  label: string;
  value: number;
  total: number;
  color: string;
}> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const colorClasses: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Posts Management Tab
const PostsManagementTab: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [statusFilter, page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('circleAdminToken');
      const params = new URLSearchParams({
        admin_token: token || '',
        page: page.toString(),
        limit: '20'
      });
      if (statusFilter) params.append('status', statusFilter);

      const response = await axios.get(`/api/admin/posts?${params}`);
      setPosts(response.data.posts);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
    setLoading(false);
  };

  const updatePostStatus = async (postId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('circleAdminToken');
      await axios.patch(`/api/admin/posts/${postId}/status?admin_token=${token}`, {
        status: newStatus
      });
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const suspendPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to suspend this post?')) {
      await updatePostStatus(postId, 'suspended');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Posts</h2>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            onClick={fetchPosts}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Content</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Circle</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600" />
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No posts found
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-gray-900 line-clamp-2 max-w-md">{post.content}</p>
                    <p className="text-xs text-gray-500 mt-1">By: {post.user_id?.slice(0, 8)}...</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{post.circle_name || 'N/A'}</p>
                    <p className="text-xs text-gray-500 capitalize">{post.circle_scope}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' ? 'bg-green-100 text-green-700' :
                      post.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      post.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {post.status || 'published'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {post.status !== 'published' && (
                        <button
                          onClick={() => updatePostStatus(post.id, 'published')}
                          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                        >
                          Publish
                        </button>
                      )}
                      {post.status !== 'suspended' && (
                        <button
                          onClick={() => suspendPost(post.id)}
                          className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {posts.length} of {total} posts
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={posts.length < 20}
              className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab
const SettingsTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState('global');
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [createOptions, setCreateOptions] = useState({
    create_global: false,
    create_national: true,
    create_local: true,
    create_for_professions: true,
    create_for_interests: true
  });
  const [generating, setGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<any>(null);

  // Global circles state
  const [professions, setProfessions] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [selectedProfession, setSelectedProfession] = useState<any>(null);
  const [selectedInterest, setSelectedInterest] = useState<any>(null);
  const [professionSearch, setProfessionSearch] = useState('');
  const [interestSearch, setInterestSearch] = useState('');
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);
  const [loadingProfessions, setLoadingProfessions] = useState(false);
  const [loadingInterests, setLoadingInterests] = useState(false);
  const [generatingGlobal, setGeneratingGlobal] = useState(false);
  const [globalResult, setGlobalResult] = useState<any>(null);
  const [globalCirclesCount, setGlobalCirclesCount] = useState({ professions: 0, interests: 0 });

  const [rolePermissions, setRolePermissions] = useState<Record<string, any>>({});
  const [savingPermissions, setSavingPermissions] = useState(false);

  useEffect(() => {
    fetchCountries();
    fetchRolePermissions();
    fetchProfessionsAndInterests();
    fetchGlobalCirclesCount();
  }, []);

  const fetchCountries = async () => {
    try {
      const token = localStorage.getItem('circleAdminToken');
      const response = await axios.get(`/api/admin/settings/countries?admin_token=${token}`);
      setCountries(response.data.countries);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchProfessionsAndInterests = async () => {
    setLoadingProfessions(true);
    setLoadingInterests(true);
    try {
      // Use the external APIs as requested
      const [profRes, intRes] = await Promise.all([
        axios.get('https://uatapi.cness.io/api/profession/get-valid-profession'),
        axios.get('https://uatapi.cness.io/api/interests/get-interests')
      ]);
      
      // Parse professions from external API format
      const professionData = profRes.data?.success?.data || profRes.data?.data || [];
      setProfessions(Array.isArray(professionData) ? professionData : []);
      
      // Parse interests from external API format
      const interestData = intRes.data?.success?.data || intRes.data?.data || [];
      setInterests(Array.isArray(interestData) ? interestData : []);
    } catch (error) {
      console.error('Error fetching professions/interests:', error);
      // Fallback to local APIs
      try {
        const [profRes, intRes] = await Promise.all([
          axios.get('/api/professions'),
          axios.get('/api/interests')
        ]);
        setProfessions(profRes.data.professions || []);
        setInterests(intRes.data.interests || []);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
      }
    }
    setLoadingProfessions(false);
    setLoadingInterests(false);
  };

  const fetchGlobalCirclesCount = async () => {
    try {
      const [profCount, intCount] = await Promise.all([
        axios.get('/api/circles?scope=global&category=profession&limit=1'),
        axios.get('/api/circles?scope=global&category=interest&limit=1')
      ]);
      setGlobalCirclesCount({
        professions: profCount.data.total || 0,
        interests: intCount.data.total || 0
      });
    } catch (error) {
      console.error('Error fetching global circles count:', error);
    }
  };

  const fetchRolePermissions = async () => {
    try {
      const token = localStorage.getItem('circleAdminToken');
      const response = await axios.get(`/api/admin/settings/roles?admin_token=${token}`);
      setRolePermissions(response.data.permissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const generateGlobalCircle = async (type: 'profession' | 'interest') => {
    const selected = type === 'profession' ? selectedProfession : selectedInterest;
    if (!selected) return;
    
    const id = selected._id || selected.id;
    
    setGeneratingGlobal(true);
    setGlobalResult(null);
    try {
      const response = await axios.post('/api/circles/generate/global', {
        type,
        profession_id: type === 'profession' ? id : null,
        interest_id: type === 'interest' ? id : null
      });
      setGlobalResult(response.data);
      fetchGlobalCirclesCount();
      if (type === 'profession') {
        setSelectedProfession(null);
        setProfessionSearch('');
      } else {
        setSelectedInterest(null);
        setInterestSearch('');
      }
    } catch (error: any) {
      setGlobalResult({ error: error.response?.data?.detail || 'Failed to create global circle' });
    }
    setGeneratingGlobal(false);
  };

  // Filter professions based on search
  const filteredProfessions = professions.filter(p => 
    (p.name || '').toLowerCase().includes(professionSearch.toLowerCase())
  );

  // Filter interests based on search
  const filteredInterests = interests.filter(i => 
    (i.name || i.interestName || '').toLowerCase().includes(interestSearch.toLowerCase())
  );

  const generateAllGlobalCircles = async (type: 'professions' | 'interests') => {
    setGeneratingGlobal(true);
    setGlobalResult(null);
    try {
      const response = await axios.post('/api/circles/generate/all-global', { type });
      setGlobalResult(response.data);
      fetchGlobalCirclesCount();
    } catch (error: any) {
      setGlobalResult({ error: error.response?.data?.detail || 'Failed to generate global circles' });
    }
    setGeneratingGlobal(false);
  };

  const generateCircles = async () => {
    if (!selectedCountry) return;
    
    setGenerating(true);
    setGenerationResult(null);
    try {
      const response = await axios.post(
        `/api/circles/generate/for-country?user_id=admin`,
        {
          country: selectedCountry,
          ...createOptions
        }
      );
      setGenerationResult(response.data);
      fetchCountries();
    } catch (error: any) {
      setGenerationResult({ error: error.response?.data?.detail || 'Failed to generate circles' });
    }
    setGenerating(false);
  };

  const saveRolePermission = async (role: string) => {
    setSavingPermissions(true);
    try {
      const token = localStorage.getItem('circleAdminToken');
      await axios.put(`/api/admin/settings/roles?admin_token=${token}`, {
        role,
        ...rolePermissions[role]
      });
      alert('Permissions saved successfully');
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Failed to save permissions');
    }
    setSavingPermissions(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

      {/* Section Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveSection('global')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'global' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Global Circles
        </button>
        <button
          onClick={() => setActiveSection('country')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'country' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Country Circles
        </button>
        <button
          onClick={() => setActiveSection('permissions')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeSection === 'permissions' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Role Permissions
        </button>
      </div>

      {/* Global Circles Section */}
      {activeSection === 'global' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profession Global Circles</p>
                  <p className="text-xl font-bold text-gray-900">{globalCirclesCount.professions}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Interest Global Circles</p>
                  <p className="text-xl font-bold text-gray-900">{globalCirclesCount.interests}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Create Individual Global Circle */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Create Individual Global Circle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profession Searchable Dropdown */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  Create Profession Circle
                </h4>
                
                <div className="relative mb-3">
                  {/* Selected or Search Input */}
                  <div 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer"
                    onClick={() => setShowProfessionDropdown(!showProfessionDropdown)}
                  >
                    {selectedProfession ? (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{selectedProfession.name}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProfession(null);
                            setProfessionSearch('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select profession...</span>
                    )}
                  </div>

                  {/* Dropdown */}
                  {showProfessionDropdown && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 bg-indigo-50 border-b border-gray-100">
                        <h5 className="font-semibold text-indigo-800 flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          Professions
                        </h5>
                      </div>
                      
                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search professions..."
                            value={professionSearch}
                            onChange={(e) => setProfessionSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* All Professions Option */}
                      <button
                        onClick={() => {
                          setSelectedProfession(null);
                          setShowProfessionDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                          <Globe className="w-3 h-3 text-gray-500" />
                        </div>
                        All Professions
                      </button>

                      {/* Profession List */}
                      <div className="max-h-60 overflow-y-auto">
                        {loadingProfessions ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
                          </div>
                        ) : filteredProfessions.length === 0 ? (
                          <p className="text-center py-4 text-gray-500 text-sm">No professions found</p>
                        ) : (
                          filteredProfessions.slice(0, 50).map((p) => (
                            <button
                              key={p._id || p.id}
                              onClick={() => {
                                setSelectedProfession(p);
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

                <button
                  onClick={() => generateGlobalCircle('profession')}
                  disabled={!selectedProfession || generatingGlobal}
                  className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generatingGlobal ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
                  Create Global Profession Circle
                </button>
              </div>

              {/* Interest Searchable Dropdown */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-600" />
                  Create Interest Circle
                </h4>
                
                <div className="relative mb-3">
                  {/* Selected or Search Input */}
                  <div 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer"
                    onClick={() => setShowInterestDropdown(!showInterestDropdown)}
                  >
                    {selectedInterest ? (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{selectedInterest.name || selectedInterest.interestName}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInterest(null);
                            setInterestSearch('');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select interest...</span>
                    )}
                  </div>

                  {/* Dropdown */}
                  {showInterestDropdown && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 bg-pink-50 border-b border-gray-100">
                        <h5 className="font-semibold text-pink-800 flex items-center gap-2">
                          <Heart className="w-4 h-4" />
                          Interests
                        </h5>
                      </div>
                      
                      {/* Search Input */}
                      <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search interests..."
                            value={interestSearch}
                            onChange={(e) => setInterestSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* All Interests Option */}
                      <button
                        onClick={() => {
                          setSelectedInterest(null);
                          setShowInterestDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                          <Globe className="w-3 h-3 text-gray-500" />
                        </div>
                        All Interests
                      </button>

                      {/* Interest List */}
                      <div className="max-h-60 overflow-y-auto">
                        {loadingInterests ? (
                          <div className="flex items-center justify-center py-8">
                            <RefreshCw className="w-5 h-5 animate-spin text-pink-600" />
                          </div>
                        ) : filteredInterests.length === 0 ? (
                          <p className="text-center py-4 text-gray-500 text-sm">No interests found</p>
                        ) : (
                          filteredInterests.slice(0, 50).map((i) => (
                            <button
                              key={i._id || i.id}
                              onClick={() => {
                                setSelectedInterest(i);
                                setShowInterestDropdown(false);
                                setInterestSearch('');
                              }}
                              className={`w-full px-4 py-2.5 text-left text-sm hover:bg-pink-50 flex items-center gap-3 ${
                                selectedInterest?._id === i._id ? 'bg-pink-50 text-pink-700' : 'text-gray-700'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-medium text-xs">
                                {(i.name || i.interestName || '').charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium">{i.name || i.interestName}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => generateGlobalCircle('interest')}
                  disabled={!selectedInterest || generatingGlobal}
                  className="w-full px-4 py-2.5 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generatingGlobal ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                  Create Global Interest Circle
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Generate Global Circles */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Bulk Generate All Global Circles</h3>
            <p className="text-sm text-gray-500 mb-4">
              Create global circles for all professions or interests at once. 
              Only creates circles that don't already exist.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => generateAllGlobalCircles('professions')}
                disabled={generatingGlobal}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingGlobal ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Briefcase className="w-5 h-5" />
                )}
                Generate All Profession Circles
              </button>
              <button
                onClick={() => generateAllGlobalCircles('interests')}
                disabled={generatingGlobal}
                className="flex-1 px-4 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generatingGlobal ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Heart className="w-5 h-5" />
                )}
                Generate All Interest Circles
              </button>
            </div>
          </div>

          {globalResult && (
            <div className={`p-4 rounded-lg ${globalResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {globalResult.error ? (
                <p>{globalResult.error}</p>
              ) : (
                <div>
                  <p className="font-medium">{globalResult.message}</p>
                  {globalResult.created_count !== undefined && (
                    <p className="text-sm mt-1">Created {globalResult.created_count} circles</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Country Circles Section */}
      {activeSection === 'country' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Generate National & Local Circles for Country</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Choose a country...</option>
                {countries.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name} ({country.provinces_count} provinces)
                  </option>
                ))}
              </select>

              {selectedCountry && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                  <p>Existing circles:</p>
                  <p>• National: {countries.find(c => c.name === selectedCountry)?.existing_national_circles || 0}</p>
                  <p>• Local: {countries.find(c => c.name === selectedCountry)?.existing_local_circles || 0}</p>
                </div>
              )}
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createOptions.create_national}
                    onChange={(e) => setCreateOptions({...createOptions, create_national: e.target.checked})}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Create National circles</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createOptions.create_local}
                    onChange={(e) => setCreateOptions({...createOptions, create_local: e.target.checked})}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Create Local circles (for all provinces)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createOptions.create_for_professions}
                    onChange={(e) => setCreateOptions({...createOptions, create_for_professions: e.target.checked})}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Create for Professions</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={createOptions.create_for_interests}
                    onChange={(e) => setCreateOptions({...createOptions, create_for_interests: e.target.checked})}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Create for Interests</span>
                </label>
              </div>
            </div>
          </div>

          <button
            onClick={generateCircles}
            disabled={!selectedCountry || generating}
            className="mt-6 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Circles'
            )}
          </button>

          {generationResult && (
            <div className={`mt-4 p-4 rounded-lg ${generationResult.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {generationResult.error ? (
                <p>{generationResult.error}</p>
              ) : (
                <div>
                  <p className="font-medium">{generationResult.message}</p>
                  <p className="text-sm mt-1">Created {generationResult.created_count} circles</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeSection === 'permissions' && (
        <div className="space-y-6">
          {['Aspiring', 'Inspired', 'Leader'].map((role) => (
            <div key={role} className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4">{role} Level Permissions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Posting Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Posting</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rolePermissions[role]?.can_post_local ?? false}
                        onChange={(e) => setRolePermissions({
                          ...rolePermissions,
                          [role]: {...rolePermissions[role], can_post_local: e.target.checked}
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span>Can post in Local circles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rolePermissions[role]?.can_post_national ?? false}
                        onChange={(e) => setRolePermissions({
                          ...rolePermissions,
                          [role]: {...rolePermissions[role], can_post_national: e.target.checked}
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span>Can post in National circles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rolePermissions[role]?.can_post_global ?? false}
                        onChange={(e) => setRolePermissions({
                          ...rolePermissions,
                          [role]: {...rolePermissions[role], can_post_global: e.target.checked}
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span>Can post in Global circles</span>
                    </label>
                  </div>
                </div>

                {/* Resource Permissions */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Resources</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rolePermissions[role]?.can_upload_resources_local ?? false}
                        onChange={(e) => setRolePermissions({
                          ...rolePermissions,
                          [role]: {...rolePermissions[role], can_upload_resources_local: e.target.checked}
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span>Can upload in Local circles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rolePermissions[role]?.can_upload_resources_national ?? false}
                        onChange={(e) => setRolePermissions({
                          ...rolePermissions,
                          [role]: {...rolePermissions[role], can_upload_resources_national: e.target.checked}
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span>Can upload in National circles</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rolePermissions[role]?.can_upload_resources_global ?? false}
                        onChange={(e) => setRolePermissions({
                          ...rolePermissions,
                          [role]: {...rolePermissions[role], can_upload_resources_global: e.target.checked}
                        })}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span>Can upload in Global circles</span>
                    </label>
                  </div>
                </div>
              </div>

              <button
                onClick={() => saveRolePermission(role)}
                disabled={savingPermissions}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                Save {role} Permissions
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CircleAdminDashboard;

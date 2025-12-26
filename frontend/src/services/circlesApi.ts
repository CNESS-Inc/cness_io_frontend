import axios from 'axios';
import type { Circle, CirclePost } from '../types/circles';

// Re-export types for convenience
export type { Circle, CirclePost };

// Use local backend for circles API (proxied through Vite)
const CIRCLES_API_BASE = '/api';

const circlesAxios = axios.create({
  baseURL: CIRCLES_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get user ID from localStorage - this links to the existing PostgreSQL user
const getUserId = (): string => {
  // Try different possible storage keys
  const userId = localStorage.getItem('Id') || 
                 localStorage.getItem('userId') || 
                 localStorage.getItem('user_id') ||
                 localStorage.getItem('uid');
  
  if (!userId) {
    console.warn('No user ID found in localStorage. Using guest.');
    return 'guest';
  }
  return userId;
};

// Get user's location from localStorage or profile
const getUserLocation = (): { country?: string; province?: string } => {
  try {
    const profile = localStorage.getItem('profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      return {
        country: parsed.country || parsed.location?.country,
        province: parsed.province || parsed.state || parsed.location?.province
      };
    }
  } catch (e) {
    console.warn('Error parsing user profile:', e);
  }
  return {};
};

// ============== CIRCLE APIs ==============

export const getCircles = async (params?: {
  scope?: string;
  category?: string;
  country?: string;
  province?: string;
  profession_id?: string;
  interest_id?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await circlesAxios.get('/circles', { params });
  return response.data;
};

export const getCirclesByLocation = async (
  country: string,
  province?: string,
  options?: {
    include_national?: boolean;
    include_global?: boolean;
    category?: string;
  }
) => {
  const params = {
    country,
    province,
    include_national: options?.include_national ?? true,
    include_global: options?.include_global ?? true,
    category: options?.category
  };
  const response = await circlesAxios.get('/circles/by-location', { params });
  return response.data;
};

export const getFeaturedCircles = async (limit = 5) => {
  const response = await circlesAxios.get('/circles/featured', { params: { limit } });
  return response.data;
};

export const getCircle = async (circleId: string) => {
  const response = await circlesAxios.get(`/circles/${circleId}`);
  return response.data;
};

export const createCircle = async (circleData: {
  name: string;
  description: string;
  intention: string;
  scope: string;
  category: string;
  image_url?: string;
  country?: string;
  province?: string;
  profession_id?: string;
  interest_id?: string;
}) => {
  const response = await circlesAxios.post('/circles', circleData, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const updateCircle = async (circleId: string, updates: {
  name?: string;
  description?: string;
  intention?: string;
  image_url?: string;
}) => {
  const response = await circlesAxios.patch(`/circles/${circleId}`, updates, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const deleteCircle = async (circleId: string) => {
  const response = await circlesAxios.delete(`/circles/${circleId}`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

// ============== MEMBERSHIP APIs ==============

export const joinCircle = async (circleId: string) => {
  const response = await circlesAxios.post(`/circles/${circleId}/join`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const leaveCircle = async (circleId: string) => {
  const response = await circlesAxios.post(`/circles/${circleId}/leave`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const getCircleMembers = async (circleId: string, page = 1, limit = 100) => {
  const response = await circlesAxios.get(`/circles/${circleId}/members`, {
    params: { page, limit }
  });
  return response.data;
};

export const getUserCircles = async (userId?: string) => {
  const id = userId || getUserId();
  const response = await circlesAxios.get(`/circles/user/${id}/joined`);
  return response.data;
};

export const checkMembership = async (circleId: string) => {
  const response = await circlesAxios.get(`/circles/${circleId}/membership`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const checkJoinEligibility = async (circleId: string) => {
  // Get auth token from localStorage - check all possible keys used by existing CNESS app
  const authToken = localStorage.getItem('jwt') || localStorage.getItem('authToken') || localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await circlesAxios.get(`/circles/${circleId}/check-join-eligibility`, {
    params: { user_id: getUserId() },
    headers
  });
  return response.data;
};

export const getUserProfile = async () => {
  // Get auth token from localStorage - check all possible keys used by existing CNESS app
  const authToken = localStorage.getItem('jwt') || localStorage.getItem('authToken') || localStorage.getItem('token');
  if (!authToken) {
    throw new Error('Not authenticated');
  }
  
  const response = await circlesAxios.get('/user/profile', {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  return response.data;
};

// ============== CIRCLE POSTS APIs ==============

export const createCirclePost = async (circleId: string, postData: {
  content: string;
  media_urls?: string[];
  post_type?: string;
}) => {
  const response = await circlesAxios.post(`/circles/${circleId}/posts`, postData, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const getCirclePosts = async (circleId: string, params?: {
  post_type?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await circlesAxios.get(`/circles/${circleId}/posts`, { params });
  return response.data;
};

export const getCirclesFeed = async (page = 1, limit = 20) => {
  const response = await circlesAxios.get('/circles/posts/feed', {
    params: { user_id: getUserId(), page, limit }
  });
  return response.data;
};

export const likeCirclePost = async (postId: string) => {
  const response = await circlesAxios.post(`/circles/posts/${postId}/like`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const deleteCirclePost = async (postId: string) => {
  const response = await circlesAxios.delete(`/circles/posts/${postId}`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

// ============== BULK GENERATION APIs ==============

export const generateCirclesForCountry = async (
  country: string,
  options?: {
    create_national?: boolean;
    create_local?: boolean;
    create_for_professions?: boolean;
    create_for_interests?: boolean;
  }
) => {
  const response = await circlesAxios.post('/circles/generate/for-country', {
    country,
    create_national: options?.create_national ?? true,
    create_local: options?.create_local ?? true,
    create_for_professions: options?.create_for_professions ?? true,
    create_for_interests: options?.create_for_interests ?? true
  }, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const generateCirclesForAllCountries = async (createLocal = false) => {
  const response = await circlesAxios.post('/circles/generate/all-countries', null, {
    params: { user_id: getUserId(), create_local: createLocal }
  });
  return response.data;
};

export const getCirclesStats = async () => {
  const response = await circlesAxios.get('/circles/stats');
  return response.data;
};

export const getCountries = async () => {
  const response = await circlesAxios.get('/circles/countries');
  return response.data;
};

// ============== COMMENTS APIs ==============

export const getPostComments = async (postId: string, page = 1, limit = 20) => {
  const response = await circlesAxios.get(`/circles/posts/${postId}/comments`, {
    params: { page, limit }
  });
  return response.data;
};

export const createComment = async (postId: string, content: string, parentCommentId?: string) => {
  const response = await circlesAxios.post(`/circles/posts/${postId}/comments`, {
    content,
    parent_comment_id: parentCommentId
  }, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const likeComment = async (commentId: string) => {
  const response = await circlesAxios.post(`/circles/comments/${commentId}/like`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await circlesAxios.delete(`/circles/comments/${commentId}`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

// ============== POST INTERACTIONS ==============

export const toggleLikePost = async (postId: string) => {
  const response = await circlesAxios.post(`/circles/posts/${postId}/like`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const getLikeStatus = async (postId: string) => {
  const response = await circlesAxios.get(`/circles/posts/${postId}/like-status`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const sharePost = async (postId: string, platform = 'copy') => {
  const response = await circlesAxios.post(`/circles/posts/${postId}/share`, null, {
    params: { user_id: getUserId(), platform }
  });
  return response.data;
};

// ============== CHATROOM APIs ==============

export const getCircleChatrooms = async (circleId: string, page = 1, limit = 20) => {
  const response = await circlesAxios.get(`/circles/${circleId}/chatrooms`, {
    params: { page, limit }
  });
  return response.data;
};

export const createChatroom = async (circleId: string, name: string, description?: string) => {
  const response = await circlesAxios.post(`/circles/${circleId}/chatrooms`, {
    name,
    description
  }, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const joinChatroom = async (chatroomId: string) => {
  const response = await circlesAxios.post(`/circles/chatrooms/${chatroomId}/join`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const getChatMessages = async (chatroomId: string, page = 1, limit = 50) => {
  const response = await circlesAxios.get(`/circles/chatrooms/${chatroomId}/messages`, {
    params: { page, limit }
  });
  return response.data;
};

export const sendChatMessage = async (chatroomId: string, content: string) => {
  const response = await circlesAxios.post(`/circles/chatrooms/${chatroomId}/messages`, {
    content
  }, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const checkChatPermission = async (chatroomId: string) => {
  const response = await circlesAxios.get(`/circles/chatrooms/${chatroomId}/check-permission`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const addMemberToChatroom = async (chatroomId: string, memberUserId: string) => {
  const response = await circlesAxios.post(`/circles/chatrooms/${chatroomId}/add-member`, null, {
    params: { member_user_id: memberUserId }
  });
  return response.data;
};

// ============== NOTIFICATIONS APIs ==============

export const getNotifications = async (page = 1, limit = 20) => {
  const response = await circlesAxios.get('/notifications', {
    params: { user_id: getUserId(), page, limit }
  });
  return response.data;
};

export const markNotificationRead = async (notificationId: string) => {
  const response = await circlesAxios.post(`/notifications/${notificationId}/read`, null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await circlesAxios.post('/notifications/mark-all-read', null, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

// ============== PERMISSION CHECK APIs ==============

export const checkCircleCreatePermission = async (category: string) => {
  const response = await circlesAxios.get('/circles/check-create-permission', {
    params: { user_id: getUserId(), category }
  });
  return response.data;
};

// ============== UTILITY ==============

export const seedCircles = async () => {
  const response = await circlesAxios.post('/circles/seed');
  return response.data;
};

// Export helper functions
export { getUserId, getUserLocation };

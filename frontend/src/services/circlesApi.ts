import axios from 'axios';

// Use local backend for circles API
const CIRCLES_API_BASE = '/api';

const circlesAxios = axios.create({
  baseURL: CIRCLES_API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get user ID from localStorage
const getUserId = () => localStorage.getItem('Id') || 'guest';

// Circle Types
export interface Circle {
  id: string;
  name: string;
  description: string;
  intention: string;
  scope: 'local' | 'national' | 'global';
  category: 'profession' | 'interest' | 'living' | 'news';
  image_url: string;
  country?: string;
  city?: string;
  profession_id?: string;
  interest_id?: string;
  creator_id: string;
  member_count: number;
  active_today: number;
  online_now: number;
  post_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface CirclePost {
  id: string;
  circle_id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  post_type: 'regular' | 'prompt' | 'resource';
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  // Enriched fields
  circle_name?: string;
  circle_image?: string;
  circle_scope?: string;
  circle_category?: string;
  circle_member_count?: number;
  circle_active_today?: number;
}

// ============== CIRCLE APIs ==============

export const getCircles = async (params?: {
  scope?: string;
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) => {
  const response = await circlesAxios.get('/circles', { params });
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
  city?: string;
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

export const getCircleMembers = async (circleId: string, page = 1, limit = 20) => {
  const response = await circlesAxios.get(`/circles/${circleId}/members`, {
    params: { page, limit }
  });
  return response.data;
};

export const getUserCircles = async (userId?: string) => {
  const response = await circlesAxios.get(`/circles/user/${userId || getUserId()}`);
  return response.data;
};

export const checkMembership = async (circleId: string) => {
  const response = await circlesAxios.get(`/circles/${circleId}/membership`, {
    params: { user_id: getUserId() }
  });
  return response.data;
};

// ============== CIRCLE POSTS APIs ==============

export const createCirclePost = async (circleId: string, postData: {
  content: string;
  media_urls?: string[];
  post_type?: string;
}) => {
  const response = await circlesAxios.post(`/circles/${circleId}/posts`, {
    circle_id: circleId,
    ...postData
  }, {
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

// ============== UTILITY ==============

export const seedCircles = async () => {
  const response = await circlesAxios.post('/circles/seed');
  return response.data;
};

export default {
  getCircles,
  getFeaturedCircles,
  getCircle,
  createCircle,
  updateCircle,
  deleteCircle,
  joinCircle,
  leaveCircle,
  getCircleMembers,
  getUserCircles,
  checkMembership,
  createCirclePost,
  getCirclePosts,
  getCirclesFeed,
  likeCirclePost,
  deleteCirclePost,
  seedCircles,
};

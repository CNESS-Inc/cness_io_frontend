import axios from 'axios';
import type { Circle, CirclePost } from '../types/circles';

// Re-export types for convenience
export type { Circle, CirclePost };

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

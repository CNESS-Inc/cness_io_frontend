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

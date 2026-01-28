// 인증 및 사용자 관련 타입

export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  email: string;
  name: string | null;
  phone: string | null;
  default_address: string | null;
  avatar_url: string | null;
};

export type Review = {
  id: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string;
  content: string;
  images: string[] | null;
  helpful_count: number;
  is_approved: boolean;
  is_visible: boolean;
};

export type ReviewWithProfile = Review & {
  profiles: Profile;
};

import { Tent, Award, Shirt, Sparkles, Smartphone, Zap, Tag, TrendingUp, type LucideIcon } from 'lucide-react';

type MenuItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

export const CATEGORIES = [
  { id: 'camping', name: '캠핑', icon: Tent, href: '/home?category=camping' },
  { id: 'golf', name: '골프', icon: Award, href: '/home?category=golf' },
  { id: 'fashion', name: '패션', icon: Shirt, href: '/home?category=fashion' },
  { id: 'beauty', name: '뷰티', icon: Sparkles, href: '/home?category=beauty' },
  { id: 'electronics', name: '전자기기', icon: Smartphone, href: '/home?category=electronics' },
] as const;

export const MENU_ITEMS: readonly MenuItem[] = [
  { label: '전체상품', href: '/home?category=all', icon: TrendingUp },
  { label: '핫딜', href: '/hot-deals', icon: Zap, badge: 'HOT' },
  { label: '브랜드', href: '/brands', icon: Tag },
];

export const POPULAR_SEARCHES = [
  '스노우피크',
  '테일러메이드',
  '캠핑 텐트',
  '골프채',
  '아웃도어',
] as const;

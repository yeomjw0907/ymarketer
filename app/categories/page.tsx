import Link from 'next/link';
import { Tent, Award, Shirt, Sparkles, Smartphone, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: '전체', icon: TrendingUp, href: '/?category=all', description: '모든 상품 보기' },
  { id: 'camping', name: '캠핑', icon: Tent, href: '/?category=camping', description: '텐트, 타프, 침낭 등' },
  { id: 'golf', name: '골프', icon: Award, href: '/?category=golf', description: '골프채, 골프웨어, 용품' },
  { id: 'fashion', name: '패션', icon: Shirt, href: '/?category=fashion', description: '의류, 신발, 가방' },
  { id: 'beauty', name: '뷰티', icon: Sparkles, href: '/?category=beauty', description: '화장품, 스킨케어' },
  { id: 'electronics', name: '전자기기', icon: Smartphone, href: '/?category=electronics', description: '가전, IT 기기' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">카테고리</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-blue-400 hover:shadow-lg transition-all group"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <Icon className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-gray-900 mb-1">{category.name}</div>
                    <div className="text-xs text-gray-500">{category.description}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

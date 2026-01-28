import Link from 'next/link';
import { Tent, Award, Shirt, Sparkles, Smartphone, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: '전체', icon: TrendingUp, href: '/?category=all' },
  { id: 'camping', name: '캠핑', icon: Tent, href: '/?category=camping' },
  { id: 'golf', name: '골프', icon: Award, href: '/?category=golf' },
  { id: 'fashion', name: '패션', icon: Shirt, href: '/?category=fashion' },
  { id: 'beauty', name: '뷰티', icon: Sparkles, href: '/?category=beauty' },
  { id: 'electronics', name: '전자기기', icon: Smartphone, href: '/?category=electronics' },
];

export default function CategorySection() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.href}
                className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                  <Icon className="w-8 h-8 text-gray-700 group-hover:text-blue-600 transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Heart, ShoppingCart, Settings, HelpCircle } from 'lucide-react';

const ACTIONS = [
  { href: '/mypage/orders', label: '주문 내역', icon: ShoppingCart },
  { href: '/favorites', label: '찜한 상품', icon: Heart },
  { href: '/mypage/settings', label: '설정', icon: Settings },
  { href: '/customer-service', label: '고객센터', icon: HelpCircle },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.href}
            href={action.href}
            className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
          >
            <Icon className="w-8 h-8 text-black mx-auto mb-3 group-hover:scale-110 transition-transform" />
            <div className="font-bold text-black text-sm">{action.label}</div>
          </Link>
        );
      })}
    </div>
  );
}

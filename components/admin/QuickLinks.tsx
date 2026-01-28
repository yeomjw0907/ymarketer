import Link from 'next/link';
import { Plus, Package, ShoppingCart, Image as ImageIcon, Settings } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    href: '/admin/products?action=new',
    label: '상품 등록',
    icon: Plus,
    color: 'bg-black hover:bg-gray-800',
  },
  {
    href: '/admin/products',
    label: '상품 관리',
    icon: Package,
    color: 'bg-gray-700 hover:bg-gray-800',
  },
  {
    href: '/admin/orders',
    label: '주문 관리',
    icon: ShoppingCart,
    color: 'bg-gray-700 hover:bg-gray-800',
  },
  {
    href: '/admin/banners',
    label: '배너 관리',
    icon: ImageIcon,
    color: 'bg-gray-700 hover:bg-gray-800',
  },
  {
    href: '/admin/settings',
    label: '설정',
    icon: Settings,
    color: 'bg-gray-700 hover:bg-gray-800',
  },
];

export default function QuickLinks() {
  return (
    <div>
      <h2 className="text-lg font-black text-black mb-4">빠른 링크</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`${action.color} text-white p-4 flex flex-col items-center gap-2 transition-colors group`}
            >
              <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

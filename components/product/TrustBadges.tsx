import { Shield, Truck, RotateCcw, CheckCircle } from 'lucide-react';

const BADGES = [
  {
    icon: Shield,
    title: '정품 보장',
    description: '100% 정품 직구',
  },
  {
    icon: Truck,
    title: '빠른 배송',
    description: '7-14일 배송',
  },
  {
    icon: RotateCcw,
    title: '교환/환불',
    description: '7일 이내 가능',
  },
  {
    icon: CheckCircle,
    title: '안전 결제',
    description: 'SSL 보안 인증',
  },
];

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-y border-gray-200">
      {BADGES.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.title}
            className="flex items-center gap-3 bg-gray-50 p-4"
          >
            <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-black text-xs mb-0.5">
                {badge.title}
              </div>
              <div className="text-[10px] text-gray-600">
                {badge.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

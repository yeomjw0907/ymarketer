import { Shield, Truck, Star, CheckCircle } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: '정품 보장',
    description: '100% 정품 직구',
  },
  {
    icon: Truck,
    title: '빠른 배송',
    description: '평균 7-14일',
  },
  {
    icon: Star,
    title: '만족도 4.8/5',
    description: '1,234건 리뷰',
  },
  {
    icon: CheckCircle,
    title: '안전 결제',
    description: 'SSL 보안 인증',
  },
];

export default function TrustBadges() {
  return (
    <section className="py-8 bg-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 bg-black flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-black text-sm mb-0.5">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

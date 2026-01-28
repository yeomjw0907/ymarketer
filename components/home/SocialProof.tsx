import { Check, Star, Truck, ShieldCheck } from 'lucide-react';

const STATS = [
  {
    icon: Check,
    value: '1,234명',
    label: '이번 달 구매',
    color: 'text-black',
  },
  {
    icon: Star,
    value: '4.8/5.0',
    label: '평균 만족도',
    color: 'text-black',
  },
  {
    icon: Truck,
    value: '98.5%',
    label: '정시 배송율',
    color: 'text-black',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    label: '정품 보장',
    color: 'text-black',
  },
];

export default function SocialProof() {
  return (
    <section className="py-6 sm:py-8 bg-black text-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-2 sm:gap-3"
              >
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                <div>
                  <div className="text-xl sm:text-2xl lg:text-3xl font-black mb-0.5 sm:mb-1">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wide">
                    {stat.label}
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

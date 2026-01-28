import { Package, CreditCard, Truck } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Package,
    title: '상품 선택',
    description: '원하는 상품을 찾아 주문하세요',
  },
  {
    number: '02',
    icon: CreditCard,
    title: '안전한 결제',
    description: '입금 확인 후 일본에서 구매',
  },
  {
    number: '03',
    icon: Truck,
    title: '빠른 배송',
    description: '7-14일 내 안전하게 배송',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-black mb-3 tracking-tight">
            HOW IT WORKS
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            간단한 3단계로 일본 직구를 경험하세요
          </p>
        </div>

        {/* 스텝 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* 연결선 (데스크톱) */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-200 z-0" />
                )}

                <div className="relative z-10 text-center">
                  {/* 번호 */}
                  <div className="inline-block mb-4">
                    <div className="w-32 h-32 bg-black flex items-center justify-center mx-auto mb-4 relative">
                      <Icon className="w-16 h-16 text-white" />
                      <div className="absolute -top-3 -right-3 w-12 h-12 bg-red text-white font-black text-lg flex items-center justify-center">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* 내용 */}
                  <h3 className="text-xl font-black text-black mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/hot-deals"
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold px-10 py-4 text-lg transition-colors"
          >
            지금 시작하기
          </a>
        </div>
      </div>
    </section>
  );
}

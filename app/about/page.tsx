import { Target, Users, TrendingUp, Award } from 'lucide-react';

const VALUES = [
  {
    icon: Target,
    title: '투명한 가격',
    description: '모든 비용을 공개하여 신뢰를 드립니다',
  },
  {
    icon: Users,
    title: '고객 중심',
    description: '고객 만족을 최우선으로 생각합니다',
  },
  {
    icon: TrendingUp,
    title: '지속 성장',
    description: '끊임없는 개선과 혁신을 추구합니다',
  },
  {
    icon: Award,
    title: '품질 보장',
    description: '100% 정품만을 취급합니다',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-black mb-4 tracking-tight">ABOUT US</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            일본 직구의 새로운 기준을 제시합니다
          </p>
        </div>

        {/* 소개 */}
        <div className="bg-gray-50 border border-gray-200 p-10 mb-16">
          <h2 className="text-2xl font-black text-black mb-6 tracking-tight">
            YMARKETER는 무엇을 하는 회사인가요?
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              YMARKETER는 일본 직구의 복잡함을 없애고, 
              누구나 쉽고 저렴하게 일본 제품을 구매할 수 있도록 돕는 플랫폼입니다.
            </p>
            <p>
              한국과 일본의 가격을 실시간으로 비교하여 
              고객님이 가장 합리적인 선택을 할 수 있도록 투명한 정보를 제공합니다.
            </p>
            <p className="font-bold text-black">
              평균 35%의 비용 절감 효과를 경험하세요.
            </p>
          </div>
        </div>

        {/* 핵심 가치 */}
        <div className="mb-16">
          <h2 className="text-2xl font-black text-black mb-8 tracking-tight text-center">
            OUR VALUES
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white border border-gray-200 p-8 hover:border-black hover:shadow-lg transition-all"
                >
                  <div className="w-16 h-16 bg-black flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-black mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 통계 */}
        <div className="bg-black text-white p-10 mb-16">
          <h2 className="text-2xl font-black mb-8 text-center tracking-tight">
            BY THE NUMBERS
          </h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-black mb-2">35<span className="text-red">%</span></div>
              <div className="text-sm text-gray-400">평균 절감율</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">7-14<span className="text-red">일</span></div>
              <div className="text-sm text-gray-400">평균 배송</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-2">4.8<span className="text-red">/5</span></div>
              <div className="text-sm text-gray-400">만족도</div>
            </div>
          </div>
        </div>

        {/* 연락처 */}
        <div className="text-center">
          <h2 className="text-2xl font-black text-black mb-6 tracking-tight">
            CONTACT US
          </h2>
          <div className="bg-gray-50 border border-gray-200 p-8 inline-block">
            <div className="space-y-3 text-sm text-gray-700">
              <p><span className="font-bold text-black">전화:</span> 1234-5678</p>
              <p><span className="font-bold text-black">이메일:</span> support@ymarketer.com</p>
              <p><span className="font-bold text-black">운영시간:</span> 평일 09:00-18:00</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

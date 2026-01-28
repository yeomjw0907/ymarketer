import Image from 'next/image';

const TREND_ITEMS = [
  {
    id: 1,
    category: 'TREND',
    title: '2026 일본 캠핑 트렌드',
    subtitle: '올해 반드시 알아야 할 아이템',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400&h=600&fit=crop',
    bgColor: 'from-orange-500/90 to-red-600/90',
  },
  {
    id: 2,
    category: 'HOT DEAL',
    title: '스노우피크 신상품',
    subtitle: '한정 수량 특가 진행중',
    image: 'https://images.unsplash.com/photo-1536431311719-398b6704d4cc?w=400&h=600&fit=crop',
    bgColor: 'from-blue-500/90 to-purple-600/90',
  },
  {
    id: 3,
    category: 'MAGAZINE',
    title: '골프 시즌 준비 가이드',
    subtitle: '프로가 추천하는 필수템',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=400&h=600&fit=crop',
    bgColor: 'from-green-500/90 to-teal-600/90',
  },
];

export default function TrendSection() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">지금 주목할 트렌드</h2>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            전체보기 →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TREND_ITEMS.map((item) => (
            <a
              key={item.id}
              href="#"
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              {/* 배경 이미지 */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* 그라데이션 오버레이 */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.bgColor}`} />

              {/* 텍스트 컨텐츠 */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <div className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                  {item.category}
                </div>
                <h3 className="text-2xl font-bold mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-sm opacity-90">
                  {item.subtitle}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

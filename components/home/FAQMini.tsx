import Link from 'next/link';
import { HelpCircle } from 'lucide-react';

const FAQS = [
  {
    question: '배송은 얼마나 걸리나요?',
    answer: '평균 7-14일 소요됩니다. 일본 현지에서 구매 후 한국으로 배송됩니다.',
  },
  {
    question: '관세는 어떻게 되나요?',
    answer: '상품 가격에 모든 비용이 포함되어 있습니다. 추가 비용 없습니다.',
  },
  {
    question: '정품이 맞나요?',
    answer: '100% 정품 보장합니다. 일본 공식 매장에서 직접 구매합니다.',
  },
  {
    question: '교환/환불이 가능한가요?',
    answer: '상품 수령 후 7일 이내 교환/환불 가능합니다.',
  },
];

export default function FAQMini() {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white border-t border-gray-200">
      <div className="container mx-auto px-3 sm:px-4 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-black" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight">FAQ</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 font-medium">자주 묻는 질문</p>
        </div>

        {/* FAQ 리스트 */}
        <div className="space-y-3 sm:space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white border-2 border-gray-200 hover:border-black transition-colors"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-black text-white flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                    Q
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-black text-sm sm:text-base mb-2 sm:mb-3">
                      {faq.question}
                    </h3>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 text-black flex items-center justify-center font-black text-xs sm:text-sm shrink-0">
                        A
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 전체보기 링크 */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href="/mypage/faq"
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold text-sm sm:text-base px-5 py-2.5 sm:px-8 sm:py-3 transition-colors"
          >
            FAQ 전체보기
          </Link>
        </div>
      </div>
    </section>
  );
}

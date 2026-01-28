import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import FAQAccordion from '@/components/mypage/FAQAccordion';

export default async function FAQPage() {
  const supabase = await createSupabaseServerClient();

  // DB에서 FAQ 데이터 가져오기
  const { data: faqs } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });

  const FAQ_DATA = faqs?.map((faq, index) => ({
    id: index + 1,
    category: faq.category,
    question: faq.question,
    answer: faq.answer,
  })) || [];

  const categories = ['전체', ...Array.from(new Set(FAQ_DATA.map((faq) => faq.category)))];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">FAQ</h1>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600">자주 묻는 질문을 확인해보세요.</p>
        </div>

        {FAQ_DATA.length > 0 ? (
          <FAQAccordion faqData={FAQ_DATA} categories={categories} />
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <p className="text-gray-500">등록된 FAQ가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}

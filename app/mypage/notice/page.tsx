import Link from 'next/link';
import { ArrowLeft, Bell } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function NoticePage() {
  const supabase = await createSupabaseServerClient();

  // DB에서 공지사항 데이터 가져오기
  const { data: notices } = await supabase
    .from('notices')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">공지사항</h1>
        </div>

        {notices && notices.length > 0 ? (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.id} className="bg-white rounded-xl border-2 border-gray-200 p-4 hover:border-blue-400 hover:shadow-md transition-all">
                <div className="flex items-start gap-3 mb-2">
                  {notice.is_new && (
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      NEW
                    </span>
                  )}
                  <h3 className="flex-1 font-semibold text-gray-900">{notice.title}</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{notice.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">공지사항이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

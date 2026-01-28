import Link from 'next/link';
import { ArrowLeft, Gift, Calendar } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function EventsPage() {
  const supabase = await createSupabaseServerClient();

  // DB에서 이벤트 데이터 가져오기
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_visible', true)
    .order('sort_order', { ascending: false })
    .order('created_at', { ascending: false });

  const statusConfig = {
    ongoing: { label: '진행중', color: 'bg-green-600' },
    upcoming: { label: '예정', color: 'bg-blue-600' },
    ended: { label: '종료', color: 'bg-gray-400' },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/mypage" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">이벤트</h1>
        </div>

        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => {
              const status = statusConfig[event.status as keyof typeof statusConfig];
              const periodStart = new Date(event.period_start).toLocaleDateString('ko-KR');
              const periodEnd = new Date(event.period_end).toLocaleDateString('ko-KR');
              
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all"
                >
                  {event.image_url && (
                    <div className="w-full h-48 bg-gradient-to-r from-blue-500 to-purple-500">
                      <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`text-xs font-bold text-white px-2 py-1 rounded ${status.color}`}>
                        {status.label}
                      </span>
                      <h3 className="flex-1 font-bold text-gray-900 text-lg">{event.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>{periodStart} ~ {periodEnd}</span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">진행 중인 이벤트가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

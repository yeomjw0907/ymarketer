import Link from 'next/link';
import { Phone, Mail, Clock, MessageCircle, HelpCircle } from 'lucide-react';

export default function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-black mb-3 tracking-tight">고객센터</h1>
          <p className="text-sm text-gray-500">무엇을 도와드릴까요?</p>
        </div>

        {/* 빠른 링크 */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <Link
            href="/mypage/faq"
            className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
          >
            <HelpCircle className="w-12 h-12 text-black mx-auto mb-3" />
            <h3 className="font-bold text-black mb-1">FAQ</h3>
            <p className="text-xs text-gray-500">자주 묻는 질문</p>
          </Link>

          <Link
            href="/mypage/notice"
            className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
          >
            <MessageCircle className="w-12 h-12 text-black mx-auto mb-3" />
            <h3 className="font-bold text-black mb-1">공지사항</h3>
            <p className="text-xs text-gray-500">새로운 소식</p>
          </Link>

          <Link
            href="/track-order"
            className="bg-white border border-gray-200 p-6 hover:border-black hover:shadow-lg transition-all group text-center"
          >
            <Clock className="w-12 h-12 text-black mx-auto mb-3" />
            <h3 className="font-bold text-black mb-1">배송 조회</h3>
            <p className="text-xs text-gray-500">주문 상태 확인</p>
          </Link>
        </div>

        {/* 연락처 정보 */}
        <div className="bg-gray-50 border border-gray-200 p-8 mb-8">
          <h2 className="text-xl font-black text-black mb-6 tracking-tight">연락처</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-black mb-1">전화 문의</div>
                <div className="text-lg font-bold text-black mb-1">1234-5678</div>
                <div className="text-xs text-gray-600">평일 09:00 - 18:00 (주말/공휴일 휴무)</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-black mb-1">이메일 문의</div>
                <div className="text-lg font-bold text-black mb-1">support@ymarketer.com</div>
                <div className="text-xs text-gray-600">24시간 접수 가능 (답변은 영업시간 내)</div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-black mb-1">운영 시간</div>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>평일: 09:00 - 18:00</div>
                  <div>점심: 12:00 - 13:00</div>
                  <div className="text-xs text-gray-500">주말 및 공휴일 휴무</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 1:1 문의 */}
        <div className="bg-white border border-gray-200 p-8">
          <h2 className="text-xl font-black text-black mb-4 tracking-tight">1:1 문의</h2>
          <p className="text-sm text-gray-600 mb-6">
            빠른 답변을 원하시면 FAQ를 먼저 확인해주세요. 
            추가 문의사항은 이메일로 보내주시면 영업시간 내 답변 드리겠습니다.
          </p>
          <a
            href="mailto:support@ymarketer.com"
            className="inline-block bg-black hover:bg-gray-800 text-white font-bold px-8 py-4 transition-colors"
          >
            이메일 보내기
          </a>
        </div>
      </div>
    </div>
  );
}

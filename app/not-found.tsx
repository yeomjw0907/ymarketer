import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 */}
        <div className="mb-8">
          <h1 className="text-9xl font-black text-black mb-4">404</h1>
          <h2 className="text-2xl font-black text-black mb-2 tracking-tight">
            PAGE NOT FOUND
          </h2>
          <p className="text-gray-600">
            요청하신 페이지를 찾을 수 없습니다
          </p>
        </div>

        {/* CTA 버튼들 */}
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-black hover:bg-gray-800 text-white font-bold py-4 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>메인으로 돌아가기</span>
          </Link>
          
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 hover:border-black text-black font-semibold py-4 transition-colors"
          >
            <Search className="w-5 h-5" />
            <span>상품 검색하기</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 w-full text-gray-600 hover:text-black font-medium py-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>이전 페이지로</span>
          </button>
        </div>

        {/* 추가 링크 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">도움이 필요하신가요?</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/customer-service" className="text-black hover:text-gray-600 font-medium underline">
              고객센터
            </Link>
            <Link href="/mypage/faq" className="text-black hover:text-gray-600 font-medium underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { getYenRate } from '@/lib/utils/settings';
import { formatKRW } from '@/lib/utils/calculator';

export default async function Header() {
  const yenRate = await getYenRate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center space-x-2">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Price Check
          </h1>
        </Link>

        {/* 중앙 - 엔화 환율 */}
        <div className="hidden sm:flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2">
          <span className="text-sm font-medium text-blue-700">🇯🇵 현재 엔화 환율:</span>
          <span className="text-base font-bold text-blue-900">
            {formatKRW(yenRate * 100)} / 100엔
          </span>
        </div>

        {/* 우측 - 관리자 링크 */}
        <Link 
          href="/admin" 
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          관리자
        </Link>
      </div>

      {/* 모바일 환율 표시 */}
      <div className="sm:hidden border-t border-gray-100 bg-blue-50 px-4 py-2">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-xs font-medium text-blue-700">🇯🇵 현재 엔화 환율:</span>
          <span className="text-sm font-bold text-blue-900">
            {formatKRW(yenRate * 100)} / 100엔
          </span>
        </div>
      </div>
    </header>
  );
}

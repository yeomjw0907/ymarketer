export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* 로고 */}
          <div className="text-lg font-bold text-gray-900">Price Check</div>
          
          {/* 설명 */}
          <p className="text-sm text-gray-600 max-w-md">
            일본 현지 가격과 한국 최저가를 비교하여<br />
            합리적인 직구를 도와드립니다.
          </p>

          {/* 링크 */}
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900 transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-gray-900 transition-colors">
              고객센터
            </a>
          </div>

          {/* 사업자 정보 */}
          <div className="text-xs text-gray-400 space-y-1">
            <p>상호: Price Check | 대표: 유한솔</p>
            <p>사업자등록번호: 000-00-00000</p>
            <p>통신판매업신고: 제2024-서울강남-00000호</p>
            <p>주소: 서울특별시 강남구 테헤란로 123</p>
            <p>이메일: contact@pricecheck.kr | 고객센터: 1234-5678</p>
          </div>

          {/* 저작권 */}
          <div className="text-xs text-gray-400 pt-4 border-t border-gray-200 w-full">
            © 2026 Price Check. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

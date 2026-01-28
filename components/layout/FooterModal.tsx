'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type ModalType = 'terms' | 'privacy' | 'contact' | null;

const MODAL_CONTENT: Record<NonNullable<ModalType>, { title: string; content: string }> = {
  terms: {
    title: '이용약관',
    content: `제1조 (목적)
이 약관은 와이마케터(이하 "회사")가 제공하는 일본 직구 대행 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"란 회사가 제공하는 일본 현지 상품 구매 대행 및 배송 서비스를 말합니다.
2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 공지함으로써 효력이 발생합니다.
2. 회사는 필요한 경우 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수 있습니다.
3. 변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.

제4조 (서비스의 제공)
1. 회사는 다음과 같은 서비스를 제공합니다.
   - 일본 현지 상품 검색 및 구매 대행
   - 관부가세·배송비 포함 가격 계산
   - 국내 배송

2. 서비스 이용 시 발생하는 관세, 부가세, 배송비 등은 이용자가 부담합니다.

(이하 생략 - 실제 서비스에 맞게 법률 자문 후 보완하시기 바랍니다.)`,
  },
  privacy: {
    title: '개인정보처리방침',
    content: `와이마케터(이하 "회사")는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 등 관련 법령을 준수합니다.

1. 수집하는 개인정보 항목
- 필수: 이메일, 비밀번호, 이름, 연락처, 배송 주소
- 선택: 마케팅 수신 동의 시 이메일·SMS 수신 여부

2. 개인정보의 수집 및 이용 목적
- 서비스 제공, 주문 처리, 배송, 고객 상담
- 마케팅 및 광고 활용 (동의 시에 한함)

3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 (단, 관계 법령에 따라 보존할 필요가 있는 경우 해당 기간 동안 보관)

4. 개인정보의 제3자 제공
- 회사는 원칙적으로 이용자 개인정보를 제3자에게 제공하지 않습니다. 다만, 배송 등 서비스 제공을 위해 배송업체 등에 필요한 범위 내에서 제공할 수 있습니다.

5. 이용자의 권리
- 개인정보 열람·정정·삭제·처리정지 요청 가능 (고객센터 또는 이메일)

6. 개인정보 보호책임자
- 담당: 와이마케터 | 문의: 고객센터

(실제 서비스 운영 시 법률 자문을 받아 보완하시기 바랍니다.)`,
  },
  contact: {
    title: '고객센터',
    content: `와이마케터 고객센터 안내

■ 운영 시간
평일 09:00 ~ 18:00 (주말·공휴일 휴무)

■ 문의 방법
- 이메일: (서비스 운영 시 이메일 주소를 입력해주세요)
- 전화: (서비스 운영 시 전화번호를 입력해주세요)

■ 사업자 정보
상호: 와이마케터
대표자: 유한솔
사업자번호: 378-71-00048
주소: 인천광역시 연수구 하모니로178번길 22, 707동 7층 나22호(송도동)

자주 묻는 질문(FAQ)은 메인 페이지 또는 마이페이지에서 확인하실 수 있습니다.`,
  },
};

export default function FooterModal() {
  const [modal, setModal] = useState<ModalType>(null);

  const open = (type: ModalType) => setModal(type);
  const close = () => setModal(null);

  const current = modal ? MODAL_CONTENT[modal] : null;

  return (
    <>
      <div className="flex space-x-6 text-sm text-gray-500">
        <button
          type="button"
          onClick={() => open('terms')}
          className="hover:text-gray-900 transition-colors"
        >
          이용약관
        </button>
        <button
          type="button"
          onClick={() => open('privacy')}
          className="hover:text-gray-900 transition-colors"
        >
          개인정보처리방침
        </button>
        <button
          type="button"
          onClick={() => open('contact')}
          className="hover:text-gray-900 transition-colors"
        >
          고객센터
        </button>
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
              <h3 className="text-lg font-semibold text-gray-900">{current.title}</h3>
              <button
                type="button"
                onClick={close}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700">
                {current.content}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

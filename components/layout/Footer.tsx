'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/brand/Logo';
import { Phone, Mail, Clock, Instagram, Youtube, Facebook } from 'lucide-react';
import FooterModal from './FooterModal';

const CUSTOMER_LINKS = [
  { href: '/mypage/faq', label: 'FAQ' },
  { href: '/mypage/notice', label: '공지사항' },
  { href: '/customer-service', label: '1:1 문의' },
  { href: '/track-order', label: '배송 조회' },
];

const INFO_LINKS = [
  { href: '/about', label: '회사 소개', modal: 'about' },
  { href: '#', label: '이용약관', modal: 'terms' },
  { href: '#', label: '개인정보처리방침', modal: 'privacy' },
  { href: '#', label: '제휴 문의', modal: 'partnership' },
];

const SOCIAL_LINKS = [
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Youtube, label: 'Youtube' },
  { href: '#', icon: Facebook, label: 'Facebook' },
];

export default function Footer() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  }>({ title: '', content: '' });

  const handleModalOpen = (type: string) => {
    const contents = {
      about: {
        title: '회사 소개',
        content: `YMARKETER는 일본 직구의 새로운 기준을 제시합니다.\n\n정품 보장, 투명한 가격, 빠른 배송으로\n고객님의 쇼핑 경험을 혁신합니다.\n\n한국보다 평균 35% 저렴한 가격으로\n일본의 프리미엄 제품을 만나보세요.`,
      },
      terms: {
        title: '이용약관',
        content: `제1조 (목적)\n본 약관은 YMARKETER가 제공하는 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.\n\n제2조 (정의)\n1. "서비스"란 YMARKETER가 제공하는 일본 직구 구매대행 서비스를 의미합니다.\n2. "회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.\n\n제3조 (약관의 효력 및 변경)\n1. 본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.\n2. 회사는 필요한 경우 본 약관을 변경할 수 있으며, 변경된 약관은 공지와 동시에 효력이 발생합니다.`,
      },
      privacy: {
        title: '개인정보처리방침',
        content: `YMARKETER는 이용자의 개인정보를 중요시하며, 개인정보보호법을 준수합니다.\n\n1. 수집하는 개인정보 항목\n- 필수: 이름, 이메일, 전화번호, 배송지 주소\n- 선택: 마케팅 수신 동의\n\n2. 개인정보의 수집 및 이용 목적\n- 서비스 제공 및 계약 이행\n- 주문 및 배송 관리\n- 고객 상담 및 불만 처리\n\n3. 개인정보의 보유 및 이용 기간\n- 회원 탈퇴 시까지\n- 관계 법령에 따라 일정 기간 보관\n\n4. 개인정보 파기 절차 및 방법\n- 목적 달성 후 지체없이 파기\n- 전자적 파일: 복구 불가능한 방법으로 삭제\n\n5. 이용자의 권리\n- 개인정보 열람, 정정, 삭제 요구 가능\n- 처리 정지 요구 가능`,
      },
      partnership: {
        title: '제휴 문의',
        content: `YMARKETER와 함께 성장할 파트너를 찾습니다.\n\n제휴 분야:\n- 브랜드 입점\n- 마케팅 제휴\n- 물류 협력\n- 기술 파트너십\n\n문의 방법:\n이메일: partnership@ymarketer.com\n전화: 1234-5678 (평일 09:00-18:00)\n\n담당자가 검토 후 3영업일 이내 회신드립니다.`,
      },
    };

    const content = contents[type as keyof typeof contents];
    if (content) {
      setModalContent(content);
      setModalOpen(true);
    }
  };

  return (
    <>
      <footer className="bg-black text-white mt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Column 1: 브랜드 */}
            <div>
              <div className="mb-4">
                <div className="font-black text-2xl tracking-tighter text-white">
                  YMARKETER
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                일본 직구의 새로운 기준
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Column 2: 고객지원 */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
                고객지원
              </h3>
              <ul className="space-y-2">
                {CUSTOMER_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: 정보 */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
                정보
              </h3>
              <ul className="space-y-2">
                {INFO_LINKS.map((link) => (
                  <li key={link.label}>
                    {link.modal ? (
                      <button
                        onClick={() => handleModalOpen(link.modal!)}
                        className="text-sm text-gray-400 hover:text-white transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: 고객센터 */}
            <div>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wide">
                고객센터
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-white font-bold mb-1">1234-5678</div>
                    <div className="text-gray-400 text-xs">평일 09:00-18:00</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-white font-medium">support@ymarketer.com</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-400 text-xs">
                    <div>평일: 09:00 - 18:00</div>
                    <div>점심: 12:00 - 13:00</div>
                    <div>주말/공휴일 휴무</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-white/10 pt-8">
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center md:text-left mb-6">
              © 2026 와이마케터. All rights reserved.
            </div>

            {/* 사업자 정보 */}
            <div className="text-xs text-gray-500 space-y-1 text-center md:text-left">
              <p>상호: 와이마케터 | 대표자: 유한솔 | 사업자번호: 378-71-00048</p>
              <p>주소: 인천광역시 연수구 하모니로178번길 22, 707동 7층 나22호(송도동)</p>
              <p>우편번호: 22011</p>
            </div>
          </div>
        </div>
      </footer>

      {/* 푸터 모달 */}
      <FooterModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalContent.title}
        content={modalContent.content}
      />
    </>
  );
}

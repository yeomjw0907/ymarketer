'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setStatus('error');
      setMessage('결제 정보가 없습니다.');
      return;
    }

    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus('success');
        } else {
          return res.json().then((data) => {
            setStatus('error');
            setMessage(data.error || '결제 승인에 실패했습니다.');
          });
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('서버 오류가 발생했습니다.');
      });
  }, [searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center text-gray-600">결제 확인 중...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border-2 border-red-200 p-8 max-w-md w-full text-center">
          <p className="text-red-600 font-medium mb-4">{message}</p>
          <Link
            href="/mypage"
            className="inline-block bg-gray-700 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-xl"
          >
            마이페이지로
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">결제가 완료되었습니다</h1>
        <p className="text-gray-600 mb-6">
          주문이 정상적으로 접수되었습니다.<br />
          입금 확인 후 배송이 진행됩니다.
        </p>
        <Link
          href="/mypage"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl"
        >
          주문 내역 보기
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center text-gray-600">결제 확인 중...</div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

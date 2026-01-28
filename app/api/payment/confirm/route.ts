import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';

const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY;
const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || amount == null) {
      return NextResponse.json(
        { error: 'paymentKey, orderId, amount 가 필요합니다.' },
        { status: 400 }
      );
    }

    if (!TOSS_SECRET_KEY) {
      console.error('TOSS_SECRET_KEY not set');
      return NextResponse.json(
        { error: '결제 설정이 되어 있지 않습니다.' },
        { status: 500 }
      );
    }

    const res = await fetch(TOSS_CONFIRM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${Buffer.from(TOSS_SECRET_KEY + ':').toString('base64')}`,
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: Number(amount),
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Toss confirm error:', errData);
      return NextResponse.json(
        { error: errData.message || '결제 승인에 실패했습니다.' },
        { status: res.status }
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ status: 'paid' })
      .eq('id', orderId);

    if (updateError) {
      console.error('Order status update error:', updateError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment confirm error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

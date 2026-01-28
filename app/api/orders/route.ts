import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      product_id,
      customer_name,
      customer_phone,
      address,
      customer_memo,
      final_price,
    } = body;

    // 유효성 검사
    if (!product_id || !customer_name || !customer_phone || !address || !final_price) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 주문 생성
    const { data, error } = await supabaseServer
      .from('orders')
      .insert({
        product_id,
        customer_name,
        customer_phone,
        address,
        customer_memo: customer_memo || null,
        final_price,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Order creation error:', error);
      return NextResponse.json(
        { error: '주문 생성 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, order: data }, { status: 201 });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

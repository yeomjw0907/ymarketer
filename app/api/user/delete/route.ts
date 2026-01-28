import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    
    // 사용자 인증 확인
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다' }, { status: 401 });
    }

    const userId = user.id;

    // 1. 관련 데이터 삭제 (CASCADE로 자동 삭제되지만 명시적으로 확인)
    // profiles, favorites, reviews 등은 ON DELETE CASCADE로 자동 삭제됨

    // 2. Supabase Admin API로 사용자 삭제
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Delete user error:', deleteError);
      return NextResponse.json({ error: '회원 탈퇴 처리 중 오류가 발생했습니다' }, { status: 500 });
    }

    // 3. 세션 종료
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user API error:', error);
    return NextResponse.json({ error: '회원 탈퇴 처리 중 오류가 발생했습니다' }, { status: 500 });
  }
}

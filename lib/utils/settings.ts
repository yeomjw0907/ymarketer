import { supabaseServer } from '@/lib/supabase/server';
import { GlobalSettings } from '@/lib/types/database.types';

/**
 * 전역 설정 가져오기
 * Server Component나 Server Action에서 사용
 */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  const { data, error } = await supabaseServer
    .from('global_settings')
    .select('key, value');

  if (error) {
    console.error('Failed to fetch settings:', error);
    // 기본값 반환
    return {
      yen_rate: 9.1,
      shipping_base: 15000,
      shipping_per_half_kg: 5000,
      tax_threshold: 200000,
      tax_rate: 0.18,
      fee_rate: 0.10,
    };
  }

  // 배열을 객체로 변환
  const settings: any = {};
  data?.forEach((item) => {
    settings[item.key] = item.value;
  });

  return settings as GlobalSettings;
}

/**
 * 엔화 환율만 가져오기 (클라이언트에서도 사용 가능)
 */
export async function getYenRate(): Promise<number> {
  const { data, error } = await supabaseServer
    .from('global_settings')
    .select('value')
    .eq('key', 'yen_rate')
    .single();

  if (error || !data) {
    return 9.1; // 기본값
  }

  return data.value;
}

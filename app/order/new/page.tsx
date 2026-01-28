import { redirect, notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getGlobalSettings } from '@/lib/utils/settings';
import { calculatePrice } from '@/lib/utils/calculator';
import OrderCheckout from '@/components/order/OrderCheckout';
import type { Product } from '@/lib/types/database.types';

export default async function OrderNewPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string }>;
}) {
  const params = await searchParams;
  const productId = params.productId;
  if (!productId) notFound();

  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent('/order/new?productId=' + productId)}`);
  }

  const [productRes, profileRes, settings] = await Promise.all([
    supabase.from('products').select('*').eq('id', productId).eq('is_active', true).single(),
    supabase.from('profiles').select('name, phone, default_address').eq('id', user.id).single(),
    getGlobalSettings(),
  ]);

  const product = productRes.data as Product | null;
  if (productRes.error || !product) notFound();

  const profile = profileRes.data;
  const calculation = calculatePrice(
    product.jp_price,
    product.kr_price,
    product.weight,
    settings
  );

  return (
    <OrderCheckout
      product={product}
      calculation={calculation}
      profile={{
        name: profile?.name ?? '',
        phone: profile?.phone ?? '',
        address: profile?.default_address ?? '',
      }}
      userId={user.id}
      userEmail={user.email ?? ''}
    />
  );
}

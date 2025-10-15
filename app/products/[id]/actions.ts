'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }
  
  // 소유권 확인
  const { data: product } = await supabase
    .from('products')
    .select('user_id')
    .eq('id', productId)
    .single();
  
  if (product?.user_id !== user.id) {
    return { error: '본인의 상품만 수정할 수 있습니다.' };
  }
  
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseInt(formData.get('price') as string);
  
  const { error } = await supabase
    .from('products')
    .update({ title, description, price })
    .eq('id', productId);
  
  if (error) {
    return { error: '상품 수정에 실패했습니다.' };
  }
  
  revalidatePath(`/products/${productId}`);
  revalidatePath('/products');
  
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }
  
  // 소유권 확인
  const { data: product } = await supabase
    .from('products')
    .select('user_id')
    .eq('id', productId)
    .single();
  
  if (product?.user_id !== user.id) {
    return { error: '본인의 상품만 삭제할 수 있습니다.' };
  }
  
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  
  if (error) {
    return { error: '상품 삭제에 실패했습니다.' };
  }
  
  revalidatePath('/products');
  redirect('/products');
}

/**
 * 채팅 시작 또는 기존 채팅방으로 이동
 * @param productId - 상품 ID
 * @param sellerId - 판매자 ID
 * @returns 채팅방 ID
 */
export async function startChat(productId: string, sellerId: string): Promise<string> {
  const supabase = await createClient();
  
  // 현재 사용자 인증 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('로그인이 필요합니다');
  }

  // 본인 상품에는 채팅 불가
  if (user.id === sellerId) {
    throw new Error('본인 상품에는 채팅을 시작할 수 없습니다');
  }

  // 기존 채팅방 확인
  const { data: existingRoom, error: searchError } = await supabase
    .from('chat_rooms')
    .select('id')
    .eq('product_id', productId)
    .eq('buyer_id', user.id)
    .eq('seller_id', sellerId)
    .maybeSingle();

  if (searchError) {
    throw new Error('채팅방 조회 실패');
  }

  // 기존 채팅방이 있으면 해당 ID 반환
  if (existingRoom) {
    return existingRoom.id;
  }

  // 새 채팅방 생성
  const { data: newRoom, error: createError } = await supabase
    .from('chat_rooms')
    .insert({
      product_id: productId,
      buyer_id: user.id,
      seller_id: sellerId
    })
    .select('id')
    .single();

  if (createError || !newRoom) {
    throw new Error('채팅방 생성 실패');
  }

  revalidatePath('/chat');
  return newRoom.id;
}


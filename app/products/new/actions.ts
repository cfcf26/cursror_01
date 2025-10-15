'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  
  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '로그인이 필요합니다.' };
  }
  
  // 사용자 지역 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('area')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
    return { error: '프로필 정보를 찾을 수 없습니다.' };
  }
  
  // 폼 데이터 추출
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const price = parseInt(formData.get('price') as string);
  
  // 유효성 검사
  if (!title || !description || !price || price < 0) {
    return { error: '모든 필드를 올바르게 입력해주세요.' };
  }
  
  // 상품 생성
  const { data, error } = await supabase
    .from('products')
    .insert({
      user_id: user.id,
      title,
      description,
      price,
      area: profile.area,
    })
    .select()
    .single();
  
  if (error) {
    return { error: '상품 등록에 실패했습니다.' };
  }
  
  // 목록 페이지 캐시 갱신
  revalidatePath('/products');
  
  // 상세 페이지로 이동
  redirect(`/products/${data.id}`);
}


'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  // 현재 사용자 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  const area = formData.get('area') as string

  // 입력 검증
  if (!area || area.trim().length === 0) {
    return { error: '지역을 입력해주세요.' }
  }

  // 프로필 업데이트
  const { error } = await supabase
    .from('profiles')
    .update({ area: area.trim() })
    .eq('id', user.id)

  if (error) {
    return { error: '프로필 업데이트에 실패했습니다.' }
  }

  revalidatePath('/profile')
  return { success: true }
}

export async function deleteProduct(productId: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // 본인 상품인지 확인 후 삭제
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('user_id', user.id)

  if (error) {
    console.error('상품 삭제 실패:', error)
  }

  revalidatePath('/profile')
}


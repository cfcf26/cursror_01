'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: '인증이 필요합니다.' }
  }

  const area = formData.get('area') as string

  if (!area || area.trim().length === 0) {
    return { error: '지역을 입력해주세요.' }
  }

  const { error } = await supabase.from('profiles').insert({
    id: user.id,
    email: user.email!,
    area: area.trim(),
  })

  if (error) {
    return { error: '프로필 생성에 실패했습니다.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}


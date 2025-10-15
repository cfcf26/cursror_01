'use server'
import { createClient } from '@/utils/supabase/server'

export async function sendMessage(roomId: string, message: string) {
  if (!message.trim()) {
    return { error: '메시지를 입력해주세요.' }
  }
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: '로그인이 필요합니다.' }
  }
  
  // 메시지 저장
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      user_id: user.id,
      message: message.trim()
    })
    .select()
    .single()
  
  if (error) {
    console.error('메시지 전송 실패:', error)
    return { error: '메시지 전송에 실패했습니다.' }
  }
  
  return { success: true, data }
}


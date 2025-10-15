import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import ChatRoom from './ChatRoom'

interface ChatPageProps {
  params: {
    roomId: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // 채팅방 정보 조회
  const { data: chatRoom, error: roomError } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      product_id,
      buyer_id,
      seller_id,
      products (
        id,
        title,
        price
      )
    `)
    .eq('id', params.roomId)
    .single()
  
  if (roomError || !chatRoom) {
    notFound()
  }
  
  // 현재 사용자가 참여자인지 확인
  if (chatRoom.buyer_id !== user.id && chatRoom.seller_id !== user.id) {
    redirect('/chat')
  }
  
  // buyer와 seller 프로필 정보 조회
  const { data: buyerProfile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('id', chatRoom.buyer_id)
    .single()
  
  const { data: sellerProfile } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('id', chatRoom.seller_id)
    .single()
  
  // 채팅 메시지 조회
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select(`
      id,
      room_id,
      user_id,
      message,
      created_at
    `)
    .eq('room_id', params.roomId)
    .order('created_at', { ascending: true })
  
  if (messagesError) {
    console.error('메시지 조회 실패:', messagesError)
  }
  
  // 상대방 정보 계산
  const otherUser = chatRoom.buyer_id === user.id ? sellerProfile : buyerProfile
  
  return (
    <ChatRoom
      roomId={params.roomId}
      currentUserId={user.id}
      otherUser={otherUser}
      product={chatRoom.products}
      initialMessages={messages || []}
    />
  )
}


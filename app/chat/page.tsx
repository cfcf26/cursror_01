import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatRoomList from './ChatRoomList'

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login')
  }
  
  // 사용자가 참여 중인 채팅방 조회 (상품 정보 포함)
  const { data: chatRooms, error } = await supabase
    .from('chat_rooms')
    .select(`
      id,
      created_at,
      product_id,
      buyer_id,
      seller_id,
      products (
        id,
        title,
        price
      )
    `)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('채팅방 목록 조회 실패:', error)
    return <div>채팅방 목록을 불러올 수 없습니다.</div>
  }
  
  // buyer와 seller 프로필 정보 조회
  if (chatRooms && chatRooms.length > 0) {
    const userIds = [
      ...new Set(chatRooms.flatMap(room => [room.buyer_id, room.seller_id]))
    ]
    
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds)
    
    // profiles를 맵으로 변환
    const profilesMap = new Map(profiles?.map(p => [p.id, p]) || [])
    
    // chatRooms에 프로필 정보 추가
    const chatRoomsWithProfiles = chatRooms.map(room => ({
      ...room,
      buyer: profilesMap.get(room.buyer_id),
      seller: profilesMap.get(room.seller_id)
    }))
    
    return <ChatRoomList chatRooms={chatRoomsWithProfiles} currentUserId={user.id} />
  }
  
  return <ChatRoomList chatRooms={[]} currentUserId={user.id} />
}


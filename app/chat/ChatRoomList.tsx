'use client'
import Link from 'next/link'
import Card from '@/components/common/Card'
import { ChatRoomWithDetails } from '@/types'

interface ChatRoomListProps {
  chatRooms: ChatRoomWithDetails[]
  currentUserId: string
}

export default function ChatRoomList({ chatRooms, currentUserId }: ChatRoomListProps) {
  if (chatRooms.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">채팅 목록</h1>
        <p className="text-gray-600">아직 채팅방이 없습니다.</p>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">채팅 목록</h1>
      <div className="space-y-4">
        {chatRooms.map((room) => {
          // 상대방 정보 계산
          const otherUser = room.buyer_id === currentUserId ? room.seller : room.buyer
          
          // buyer나 seller 정보가 없는 경우 스킵
          if (!otherUser) {
            return null
          }
          
          return (
            <Link key={room.id} href={`/chat/${room.id}`}>
              <Card className="hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{room.products.title}</h3>
                    <p className="text-gray-600 mt-1">
                      상대방: {otherUser.email}
                    </p>
                    <p className="text-kiwi-500 font-semibold mt-2">
                      {room.products.price.toLocaleString()}원
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(room.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


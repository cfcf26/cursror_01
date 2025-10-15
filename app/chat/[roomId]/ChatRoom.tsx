'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { ChatMessage } from '@/types'
import MessageList from './MessageList'
import MessageInput from './MessageInput'

interface ChatRoomProps {
  roomId: string
  currentUserId: string
  otherUser: {
    id: string
    email: string
  } | null
  product: {
    id: string
    title: string
    price: number
  }
  initialMessages: ChatMessage[]
}

export default function ChatRoom({
  roomId,
  currentUserId,
  otherUser,
  product,
  initialMessages
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const supabase = createClient()
  
  useEffect(() => {
    // Realtime 채널 구독
    const channel = supabase
      .channel(`chat-room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage
          setMessages((prev) => [...prev, newMessage])
        }
      )
      .subscribe()
    
    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, supabase])
  
  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">채팅방 정보를 불러올 수 없습니다.</p>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="border-b-2 border-black bg-white p-4">
        <div className="container mx-auto">
          <h2 className="font-bold text-lg">{product.title}</h2>
          <p className="text-sm text-gray-600">
            {otherUser.email} 님과의 채팅
          </p>
          <p className="text-kiwi-500 font-semibold mt-1">
            {product.price.toLocaleString()}원
          </p>
        </div>
      </div>
      
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>
      
      {/* 입력 영역 */}
      <MessageInput roomId={roomId} />
    </div>
  )
}


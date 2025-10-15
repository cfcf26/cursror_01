'use client'
import { useEffect, useRef } from 'react'
import { ChatMessage } from '@/types'

interface MessageListProps {
  messages: ChatMessage[]
  currentUserId: string
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // 새 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        메시지를 시작해보세요!
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      {messages.map((message) => {
        const isMyMessage = message.user_id === currentUserId
        
        return (
          <div
            key={message.id}
            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md px-4 py-3 border-2 ${
                isMyMessage
                  ? 'bg-kiwi-500 text-white border-kiwi-500'
                  : 'bg-white text-black border-black'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">{message.message}</p>
              <span className={`text-xs mt-1 block ${
                isMyMessage ? 'text-white opacity-80' : 'text-gray-500'
              }`}>
                {new Date(message.created_at).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        )
      })}
      <div ref={messagesEndRef} />
    </div>
  )
}


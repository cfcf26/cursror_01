'use client'
import { useState } from 'react'
import { sendMessage } from './actions'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'

interface MessageInputProps {
  roomId: string
}

export default function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!message.trim() || isSending) return
    
    setIsSending(true)
    const result = await sendMessage(roomId, message)
    setIsSending(false)
    
    if (result.error) {
      alert(result.error)
      return
    }
    
    // 전송 성공 시 입력 초기화
    setMessage('')
  }
  
  return (
    <form
      onSubmit={handleSubmit}
      className="border-t-2 border-black bg-white p-4"
    >
      <div className="container mx-auto flex gap-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
          disabled={isSending}
          className="flex-1"
        />
        <Button
          type="submit"
          variant="primary"
          disabled={!message.trim() || isSending}
        >
          {isSending ? '전송 중...' : '전송'}
        </Button>
      </div>
    </form>
  )
}


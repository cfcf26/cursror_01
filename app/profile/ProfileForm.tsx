'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'

interface ProfileFormProps {
  currentArea: string
}

export default function ProfileForm({ currentArea }: ProfileFormProps) {
  const [area, setArea] = useState(currentArea)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: '지역 정보가 업데이트되었습니다.' })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="area" className="block text-sm font-medium mb-2">
          활동 지역
        </label>
        <Input
          id="area"
          name="area"
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="예: 강남구, 서초구"
          required
        />
      </div>

      {message && (
        <div className={`p-4 border-2 ${
          message.type === 'success' 
            ? 'border-kiwi-500 bg-kiwi-50 text-kiwi-700' 
            : 'border-red-500 bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? '저장 중...' : '저장하기'}
      </Button>
    </form>
  )
}


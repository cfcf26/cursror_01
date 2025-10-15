'use client'

import { useState } from 'react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { createProfile } from './actions'

interface OnboardingFormProps {
  email: string
}

export default function OnboardingForm({ email }: OnboardingFormProps) {
  const [area, setArea] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!area.trim()) {
      setError('지역을 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('area', area)

      const result = await createProfile(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // 성공 시 redirect가 자동으로 처리됨
    } catch (err) {
      setError('프로필 생성에 실패했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="border-2 border-black p-8 bg-white">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 font-semibold">
            이메일
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div>
          <label htmlFor="area" className="block mb-2 font-semibold">
            지역
          </label>
          <Input
            id="area"
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="예: 강남구, 서초구"
            disabled={loading}
          />
          <p className="mt-2 text-sm text-gray-600">
            같은 지역의 상품만 보고 거래할 수 있습니다.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? '처리 중...' : '시작하기'}
        </Button>
      </form>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { login, signup } from './actions'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    // 클라이언트 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.')
      return
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)

      if (mode === 'login') {
        const result = await login(formData)
        if (result?.error) {
          setError(result.error)
          setLoading(false)
        }
        // 성공 시 redirect가 자동으로 처리됨
      } else {
        const result = await signup(formData)
        if (result?.error) {
          setError(result.error)
          setLoading(false)
        } else if (result?.success) {
          setSuccessMessage(result.message || '회원가입이 완료되었습니다.')
          setLoading(false)
          // 로그인 모드로 전환
          setTimeout(() => {
            setMode('login')
            setSuccessMessage('')
          }, 3000)
        }
      }
    } catch (err) {
      setError('예상치 못한 오류가 발생했습니다.')
      setLoading(false)
    }
  }

  return (
    <div className="border-2 border-black p-8 bg-white">
      {/* 모드 전환 */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setError('')
            setSuccessMessage('')
          }}
          className={`flex-1 py-2 font-semibold transition-colors ${
            mode === 'login'
              ? 'bg-kiwi-500 text-white'
              : 'bg-white text-black border-2 border-black'
          }`}
        >
          로그인
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup')
            setError('')
            setSuccessMessage('')
          }}
          className={`flex-1 py-2 font-semibold transition-colors ${
            mode === 'signup'
              ? 'bg-kiwi-500 text-white'
              : 'bg-white text-black border-2 border-black'
          }`}
        >
          회원가입
        </button>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {/* 성공 메시지 */}
      {successMessage && (
        <div className="mb-4 p-4 bg-kiwi-50 border-2 border-kiwi-500 text-kiwi-700">
          {successMessage}
        </div>
      )}

      {/* URL 파라미터 에러 */}
      {searchParams.get('error') === 'invalid_token' && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-500 text-red-700">
          인증 링크가 유효하지 않습니다. 다시 시도해주세요.
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 font-semibold">
            비밀번호
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="최소 6자 이상"
            disabled={loading}
          />
        </div>

        {mode === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-semibold">
              비밀번호 확인
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              disabled={loading}
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading}
        >
          {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
        </Button>
      </form>
    </div>
  )
}


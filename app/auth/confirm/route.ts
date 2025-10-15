import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type: type as any,
      token_hash,
    })

    if (!error) {
      // 인증 성공 → 온보딩으로 리디렉션
      return NextResponse.redirect(new URL('/auth/onboarding', request.url))
    }
  }

  // 인증 실패 → 로그인 페이지로
  return NextResponse.redirect(new URL('/auth/login?error=invalid_token', request.url))
}


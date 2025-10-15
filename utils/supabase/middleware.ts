import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: 세션을 새로고침하지 마세요.
  // getUser()를 호출하면 자동으로 세션이 갱신됩니다.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage = request.nextUrl.pathname.startsWith('/auth/')
  const isPublicPage = request.nextUrl.pathname === '/'

  // 로그인한 사용자가 로그인 페이지 접근 시 홈으로
  if (user && request.nextUrl.pathname === '/auth/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // 인증이 필요한 경로 보호 (비로그인 사용자)
  if (!user && !isAuthPage && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // 로그인한 사용자가 프로필이 없으면 온보딩으로
  if (
    user &&
    request.nextUrl.pathname !== '/auth/onboarding' &&
    request.nextUrl.pathname !== '/auth/signout'
  ) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('area')
      .eq('id', user.id)
      .single()

    if (!profile) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}


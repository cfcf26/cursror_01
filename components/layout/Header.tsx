import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🥝</span>
          <span className="text-xl font-bold text-kiwi-500">KiwiMarket</span>
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/products" className="hover:text-kiwi-500 transition-colors font-medium">
                상품 목록
              </Link>
              <Link href="/products/new" className="hover:text-kiwi-500 transition-colors font-medium">
                상품 등록
              </Link>
              <Link href="/chat" className="hover:text-kiwi-500 transition-colors font-medium">
                채팅
              </Link>
              <Link href="/profile" className="hover:text-kiwi-500 transition-colors font-medium">
                내 정보
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-gray-600 hover:text-black transition-colors font-medium"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="px-6 py-2 bg-kiwi-500 text-white hover:bg-kiwi-600 transition-colors font-medium border-2 border-kiwi-500"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

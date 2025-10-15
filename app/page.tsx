import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import Button from '@/components/common/Button'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 최신 상품 6개 조회
  let recentProducts: Product[] = []
  let userArea: string | null = null

  if (user) {
    // 로그인 사용자: 본인 지역 상품만
    const { data: profile } = await supabase
      .from('profiles')
      .select('area')
      .eq('id', user.id)
      .single()

    userArea = profile?.area || null

    if (userArea) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('area', userArea)
        .order('created_at', { ascending: false })
        .limit(6)

      recentProducts = data || []
    }
  } else {
    // 비로그인: 전체 상품 중 최신 6개
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)

    recentProducts = data || []
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-6xl">🥝</span>
          <h1 className="text-5xl font-bold">
            내 근처 미개봉 상품 거래
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-8">
          KiwiMarket에서 간편하게 거래하세요
        </p>

        <div className="flex gap-4 justify-center">
          {user ? (
            <>
              <Link href="/products">
                <Button variant="primary">상품 둘러보기</Button>
              </Link>
              <Link href="/products/new">
                <Button variant="secondary">상품 등록하기</Button>
              </Link>
            </>
          ) : (
            <Link href="/auth/login">
              <Button variant="primary">시작하기</Button>
            </Link>
          )}
        </div>
      </section>

      {/* 최신 상품 섹션 */}
      {recentProducts.length > 0 && (
        <section className="container mx-auto px-4 py-12 bg-gray-50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">
              {user && userArea ? `${userArea} 최신 상품` : '최신 상품'}
            </h2>
            <Link href="/products">
              <Button variant="outline">전체 보기</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {recentProducts.length === 6 && (
            <div className="text-center mt-8">
              <Link href="/products">
                <Button variant="secondary">더 많은 상품 보기</Button>
              </Link>
            </div>
          )}
        </section>
      )}

      {/* 비로그인 사용자용 안내 섹션 */}
      {!user && recentProducts.length === 0 && (
        <section className="container mx-auto px-4 py-12 text-center">
          <div className="border-2 border-kiwi-500 p-12 bg-kiwi-50">
            <h2 className="text-2xl font-bold mb-4">
              내 지역의 상품을 확인하세요
            </h2>
            <p className="text-gray-700 mb-6">
              로그인하고 지역을 설정하면<br />
              내 근처의 미개봉 상품을 볼 수 있습니다
            </p>
            <Link href="/auth/login">
              <Button variant="primary">지금 시작하기</Button>
            </Link>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="border-2 border-black p-6">
            <h3 className="text-xl font-bold mb-4">🏘️ 지역 기반</h3>
            <p className="text-gray-600">
              내 지역의 상품만 보고 안전하게 거래하세요.
            </p>
          </div>
          <div className="border-2 border-black p-6">
            <h3 className="text-xl font-bold mb-4">💬 실시간 채팅</h3>
            <p className="text-gray-600">
              판매자와 바로 소통하며 거래를 진행하세요.
            </p>
          </div>
          <div className="border-2 border-black p-6">
            <h3 className="text-xl font-bold mb-4">📦 미개봉 상품</h3>
            <p className="text-gray-600">
              새 상품처럼 깨끗한 미개봉 제품을 찾아보세요.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

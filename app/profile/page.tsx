import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import Card from '@/components/common/Card'
import ProductCard from '@/components/product/ProductCard'
import Button from '@/components/common/Button'
import { deleteProduct } from './actions'

export const metadata = {
  title: '내 정보 - KiwiMarket',
  description: '프로필 정보 및 내 상품 관리',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  
  // 인증 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/auth/login')
  }

  // 프로필 정보 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 내 상품 목록 조회
  const { data: myProducts } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">내 정보</h1>

        {/* 프로필 정보 섹션 */}
        <Card className="mb-12">
          <h2 className="text-2xl font-bold mb-6">계정 정보</h2>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">이메일</p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            <div>
              <ProfileForm currentArea={profile?.area || ''} />
            </div>
          </div>
        </Card>

        {/* 내 상품 목록 섹션 */}
        <div>
          <h2 className="text-2xl font-bold mb-6">내가 등록한 상품</h2>
          {myProducts && myProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProducts.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                  <form action={deleteProduct.bind(null, product.id)} className="mt-2">
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    >
                      삭제
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-gray-600 text-center py-8">
                등록한 상품이 없습니다.
              </p>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}


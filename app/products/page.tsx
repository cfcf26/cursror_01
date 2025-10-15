import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import Button from '@/components/common/Button';

export default async function ProductsPage() {
  const supabase = await createClient();
  
  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }
  
  // 현재 사용자 지역 조회
  const { data: profile } = await supabase
    .from('profiles')
    .select('area')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
    redirect('/auth/onboarding');
  }
  
  // 같은 지역 상품만 조회
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('area', profile.area)
    .order('created_at', { ascending: false });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">우리 동네 상품</h1>
          <p className="text-gray-600 mt-2">{profile.area}</p>
        </div>
        <Link href="/products/new">
          <Button variant="primary">상품 등록</Button>
        </Link>
      </div>
      
      {error && (
        <div className="border-2 border-red-500 bg-red-50 p-4 mb-6">
          상품을 불러오는데 실패했습니다.
        </div>
      )}
      
      {products && products.length === 0 ? (
        <div className="text-center py-12 border-2 border-gray-200">
          <p className="text-gray-500">아직 등록된 상품이 없습니다.</p>
          <Link href="/products/new">
            <Button variant="primary" className="mt-4">첫 상품 등록하기</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}


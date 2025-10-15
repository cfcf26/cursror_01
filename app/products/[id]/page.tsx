import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ProductDetail from './ProductDetail';
import Link from 'next/link';
import Button from '@/components/common/Button';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient();
  
  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }
  
  // 상품 정보 조회
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error || !product) {
    notFound();
  }
  
  // 소유자 확인
  const isOwner = product.user_id === user.id;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/products">
          <Button variant="outline">← 목록으로</Button>
        </Link>
      </div>
      
      <ProductDetail product={product} isOwner={isOwner} />
    </div>
  );
}


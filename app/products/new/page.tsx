import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import ProductForm from './ProductForm';

export default async function NewProductPage() {
  const supabase = await createClient();
  
  // 사용자 인증 확인
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth/login');
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">상품 등록</h1>
      <ProductForm />
    </div>
  );
}


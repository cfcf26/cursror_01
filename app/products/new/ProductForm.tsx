'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { createProduct } from './actions';

export default function ProductForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);
    
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // 성공 시 redirect가 Server Action에서 처리됨
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="border-2 border-red-500 bg-red-50 p-4">
          {error}
        </div>
      )}
      
      <Input
        label="상품명"
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="예: 새 아이폰 15 Pro"
        required
      />
      
      <Textarea
        label="상품 설명"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="상품의 상태, 특징 등을 자세히 설명해주세요."
        rows={6}
        required
      />
      
      <Input
        label="가격"
        type="number"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="0"
        required
      />
      
      <div className="flex gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? '등록 중...' : '상품 등록'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          취소
        </Button>
      </div>
    </form>
  );
}


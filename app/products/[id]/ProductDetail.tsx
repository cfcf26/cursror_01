'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import { updateProduct, deleteProduct, startChat } from './actions';
import { Product } from '@/types';

interface ProductDetailProps {
  product: Product;
  isOwner: boolean;
}

export default function ProductDetail({ product, isOwner }: ProductDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProduct(product.id, formData);
    
    if (result?.error) {
      setError(result.error);
    } else {
      setIsEditing(false);
    }
    
    setIsSubmitting(false);
  };
  
  const handleDelete = async () => {
    if (!confirm('정말 이 상품을 삭제하시겠습니까?')) {
      return;
    }
    
    setIsSubmitting(true);
    const result = await deleteProduct(product.id);
    
    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    }
    // 성공 시 redirect가 Server Action에서 처리됨
  };
  
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  
  const handleStartChat = async () => {
    setIsChatLoading(true);
    setChatError(null);

    try {
      const roomId = await startChat(product.id, product.user_id);
      router.push(`/chat/${roomId}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '채팅 시작 실패';
      setChatError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  if (isEditing) {
    return (
      <div className="border-2 border-black p-6">
        <h2 className="text-2xl font-bold mb-6">상품 수정</h2>
        
        {error && (
          <div className="border-2 border-red-500 bg-red-50 p-4 mb-6">
            {error}
          </div>
        )}
        
        <form onSubmit={handleUpdate} className="space-y-6">
          <Input
            label="상품명"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          
          <Textarea
            label="상품 설명"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
          
          <Input
            label="가격"
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          
          <div className="flex gap-4">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '저장'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    );
  }
  
  return (
    <div className="border-2 border-black p-6">
      {error && (
        <div className="border-2 border-red-500 bg-red-50 p-4 mb-6">
          {error}
        </div>
      )}
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl text-kiwi-500 font-bold">
            {product.price.toLocaleString()}원
          </p>
        </div>
        
        <div className="border-t-2 border-gray-200 pt-6">
          <h2 className="font-semibold mb-2">상품 설명</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
        </div>
        
        <div className="border-t-2 border-gray-200 pt-6">
          <p className="text-sm text-gray-500">지역: {product.area}</p>
          <p className="text-sm text-gray-500">
            등록일: {new Date(product.created_at).toLocaleDateString()}
          </p>
        </div>
        
        <div className="border-t-2 border-gray-200 pt-6">
          {chatError && (
            <div className="border-2 border-red-500 bg-red-50 p-4 mb-4">
              {chatError}
            </div>
          )}
          
          <div className="flex gap-4">
            {isOwner ? (
              <>
                <Button
                  variant="primary"
                  onClick={() => setIsEditing(true)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  수정
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                >
                  삭제
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  onClick={handleStartChat}
                  disabled={isChatLoading}
                  className="flex-1"
                >
                  {isChatLoading ? '채팅방 생성 중...' : '판매자와 채팅하기'}
                </Button>
                <Button
                  variant="outline"
                  disabled
                  className="flex-1 opacity-50 cursor-not-allowed"
                >
                  배송 요청 (준비 중)
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


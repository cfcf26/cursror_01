import Link from 'next/link';
import Card from '@/components/common/Card';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="h-full">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-bold line-clamp-1">{product.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between mt-auto pt-3 border-t-2 border-gray-100">
            <span className="text-xl font-bold text-kiwi-500">
              {product.price.toLocaleString()}원
            </span>
            <span className="text-sm text-gray-500">{product.area}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}


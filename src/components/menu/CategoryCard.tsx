// src/components/menu/CategoryCard.tsx
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    image: string;
    dish_count: number;
  };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/category/${category.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48">
        {category.image ? (
          <Image
            src={category.image.startsWith('http') 
              ? category.image 
              : `${process.env.NEXT_PUBLIC_API_URL}${category.image}`}
            alt={category.name}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Sin imagen</p>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
        
        {category.description && (
          <p className="text-gray-600 mb-2 line-clamp-2">{category.description}</p>
        )}
        
        <p className="text-sm text-gray-500">
          {category.dish_count} {category.dish_count === 1 ? 'plato' : 'platos'}
        </p>
      </div>
    </div>
  );
}
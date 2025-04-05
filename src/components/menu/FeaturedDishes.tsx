// src/components/menu/FeaturedDishes.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '@/lib/api/client';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  final_price: number;
  has_promotion: boolean;
  image: string;
  category_name: string;
  average_rating: number;
}

export default function FeaturedDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedDishes = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/menu/dishes/featured/');
        setDishes(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured dishes:', err);
        setLoading(false);
      }
    };

    fetchFeaturedDishes();
  }, []);

  const handleDishClick = (id: string) => {
    router.push(`/dish/${id}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-5 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (dishes.length === 0) {
    return <p className="text-center text-gray-500">No hay platos destacados disponibles</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <div 
          key={dish.id} 
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => handleDishClick(dish.id)}
        >
          <div className="relative h-48">
            {dish.image ? (
              <Image
                src={dish.image.startsWith('http') 
                  ? dish.image 
                  : `${process.env.NEXT_PUBLIC_API_URL}${dish.image}`}
                alt={dish.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Sin imagen</p>
              </div>
            )}
            
            {dish.has_promotion && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Promoción
              </div>
            )}
          </div>
          
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{dish.name}</h3>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm">{dish.average_rating ? dish.average_rating.toFixed(1) : '0.0'}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">{dish.category_name}</p>
              
              {dish.has_promotion ? (
                <div className="flex items-center">
                  <span className="text-lg font-bold">${dish.final_price.toFixed(2)}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">${dish.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="text-lg font-bold">${dish.price.toFixed(2)}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
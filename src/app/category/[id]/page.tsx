// src/app/category/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  final_price: number;
  has_promotion: boolean;
  image: string;
  average_rating: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
}

export default function CategoryPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de la categoría
        const categoryResponse = await apiClient.get(`/menu/categories/${id}/`);
        setCategory(categoryResponse.data);
        
        // Obtener platos de la categoría
        const dishesResponse = await apiClient.get(`/menu/dishes/?category=${id}`);
        setDishes(dishesResponse.data);
        
        setLoading(false);
      } catch (err) {
        toast.error('Error al cargar la categoría');
        router.push('/menu');
      }
    };
    
    fetchCategory();
  }, [id, router]);
  
  const handleDishClick = (dishId: string) => {
    router.push(`/dish/${dishId}`);
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!category) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl mb-4">Categoría no encontrada</h2>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={() => router.push('/menu')}
        >
          Volver al menú
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.push('/menu')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver al menú
          </button>
          <h1 className="text-3xl font-bold">{category.name}</h1>
        </div>
        
        {category.description && (
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        )}
      </div>
      
      {dishes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay platos disponibles en esta categoría</p>
        </div>
      ) : (
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
                
                <div className="flex justify-end">
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
      )}
    </div>
  );
}
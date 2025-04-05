// src/app/(main)/menu/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';
import CategoryCard from '@/components/menu/CategoryCard';
import FeaturedDishes from '@/components/menu/FeaturedDishes';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  dish_count: number;
}

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/menu/categories/');
        setCategories(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Error al cargar las categorías');
        setLoading(false);
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl text-red-600 mb-4">{error}</h2>
        <button 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          onClick={() => router.refresh()}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Nuestro Menú</h1>
      
      <FeaturedDishes />
      
      <h2 className="text-2xl font-semibold mb-6 mt-12">Categorías</h2>
      
      {categories.length === 0 ? (
        <p className="text-center text-gray-500">No hay categorías disponibles</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}
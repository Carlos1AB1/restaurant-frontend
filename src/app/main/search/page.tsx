// src/app/search/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import SearchBar from '@/components/menu/SearchBar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get('q') || '';
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await apiClient.get(`/search/dishes/?q=${encodeURIComponent(query)}`);
        setSearchResults(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error searching dishes:', err);
        setError('Error al buscar platos');
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [query]);
  
  const handleDishClick = (id: string) => {
    router.push(`/dish/${id}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Resultados de búsqueda</h1>
      
      <div className="mb-8 max-w-xl mx-auto">
        <SearchBar />
      </div>
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.refresh()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="mt-4 text-xl font-medium text-gray-900">No hay resultados</h3>
          <p className="mt-2 text-gray-500">
            No encontramos platos que coincidan con "{query}"
          </p>
          <div className="mt-6">
            <Link
              href="/menu"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ver todo el menú
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">
            {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'} para "{query}"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((dish) => (
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
        </>
      )}
    </div>
  );
}
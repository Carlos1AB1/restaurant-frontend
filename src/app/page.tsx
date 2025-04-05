// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import apiClient from '@/lib/api/client';
import SearchBar from '@/components/menu/SearchBar';
import FeaturedDishes from '@/components/menu/FeaturedDishes';
import CategorySlider from '@/components/menu/CategorySlider';
import ChatBot from '@/components/chat/ChatBot';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Category {
  id: string;
  name: string;
  image: string;
  dish_count: number;
}

interface Promotion {
  id: string;
  name: string;
  description: string;
  dishes: any[];
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener categorías
        const categoriesResponse = await apiClient.get('/menu/categories/');
        setCategories(categoriesResponse.data);
        
        // Obtener promociones activas
        const promotionsResponse = await apiClient.get('/menu/promotions/?active=true');
        setPromotions(promotionsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-96 bg-gray-800 flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/hero-image.jpg" // Asegúrate de tener esta imagen en tu carpeta public
            alt="Delicious food"
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sabores que enamoran
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Descubre nuestra selección de platos preparados con los mejores ingredientes y con todo nuestro cariño.
          </p>
          
          <div className="max-w-md mx-auto">
            <SearchBar />
          </div>
          
          <div className="mt-8 flex justify-center space-x-4">
            <Link href="/menu">
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Ver menú
              </span>
            </Link>
            <Link href="/cart">
              <span className="px-6 py-3 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition">
                Ordenar ahora
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        {/* Platos destacados */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Nuestros platos destacados
          </h2>
          <FeaturedDishes />
        </div>

        {/* Categorías */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Explora nuestras categorías
          </h2>
          <CategorySlider categories={categories} />
          
          <div className="text-center mt-8">
            <Link href="/menu">
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Ver todas las categorías
              </span>
            </Link>
          </div>
        </div>

        {/* Promociones */}
        {promotions.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Promociones especiales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {promotions.map(promotion => (
                <div key={promotion.id} className="bg-gradient-to-r from-pink-500 to-indigo-600 rounded-lg overflow-hidden shadow-lg">
                  <div className="p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{promotion.name}</h3>
                    <p className="mb-4">{promotion.description}</p>
                    {promotion.dishes.length > 0 && (
                      <div>
                        <p className="font-medium mb-2">Platos en promoción:</p>
                        <ul className="list-disc list-inside">
                          {promotion.dishes.slice(0, 3).map(dish => (
                            <li key={dish.id}>{dish.name}</li>
                          ))}
                          {promotion.dishes.length > 3 && (
                            <li>Y {promotion.dishes.length - 3} más...</li>
                          )}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={() => router.push('/menu')}
                      className="mt-4 px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-100 transition"
                    >
                      Ver promoción
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Acerca de nosotros */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Sobre nuestro restaurante
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden">
                <Image
                  src="/restaurant.jpg" // Asegúrate de tener esta imagen en tu carpeta public
                  alt="Nuestro restaurante"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">Comida con pasión</h3>
              <p className="text-gray-700 mb-4">
                En nuestro restaurante, creemos que la buena comida viene del corazón. 
                Cada plato es preparado con ingredientes frescos y de la mejor calidad,
                siguiendo recetas que han pasado de generación en generación.
              </p>
              <p className="text-gray-700 mb-4">
                Nuestro equipo de chefs apasionados trabaja incansablemente para ofrecerte
                una experiencia culinaria única, combinando sabores tradicionales con 
                toques modernos que sorprenderán tu paladar.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22L12 18.56L5.82 22L7 14.14L2 9.27L8.91 8.26L12 2z"/>
                  </svg>
                  <span className="ml-1">4.8/5</span>
                </div>
                <span className="text-gray-500">|</span>
                <span>Más de 500 reseñas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chatbot */}
      <ChatBot />
    </div>
  );
}
// src/components/menu/CategorySlider.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  image: string;
  dish_count: number;
}

interface CategorySliderProps {
  categories: Category[];
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(
          sliderRef.current.scrollWidth - sliderRef.current.clientWidth,
          scrollPosition + scrollAmount
        );
    
    sliderRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  const handleCategoryClick = (id: string) => {
    router.push(`/category/${id}`);
  };
  
  useEffect(() => {
    const handleScrollEvent = () => {
      if (sliderRef.current) {
        setScrollPosition(sliderRef.current.scrollLeft);
      }
    };
    
    const sliderElement = sliderRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('scroll', handleScrollEvent);
    }
    
    return () => {
      if (sliderElement) {
        sliderElement.removeEventListener('scroll', handleScrollEvent);
      }
    };
  }, []);
  
  // Determinar si los botones de navegación deben mostrarse
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = sliderRef.current
    ? scrollPosition < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10
    : false;
  
  if (categories.length === 0) {
    return <p className="text-center text-gray-500">No hay categorías disponibles</p>;
  }
  
  return (
    <div className="relative">
      {/* Botón izquierdo */}
      {canScrollLeft && (
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
          aria-label="Desplazar a la izquierda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* Slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide scroll-smooth py-4 px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex-none w-60 mr-4 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="relative h-32">
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
            
            <div className="p-3">
              <h3 className="font-semibold mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">
                {category.dish_count} {category.dish_count === 1 ? 'plato' : 'platos'}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón derecho */}
      {canScrollRight && (
        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100"
          aria-label="Desplazar a la derecha"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
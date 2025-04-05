// src/app/(main)/dish/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import apiClient from '@/lib/api/client';
import { RootState } from '@/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ReviewList from '@/components/menu/ReviewList';
import AddReviewForm from '@/components/menu/AddReviewForm';
import toast from 'react-hot-toast';

interface Ingredient {
  id: string;
  ingredient_details: {
    id: string;
    name: string;
    is_allergen: boolean;
  };
  quantity: string;
  is_optional: boolean;
}

interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  final_price: number;
  has_promotion: boolean;
  image: string;
  category_name: string;
  preparation_time: number;
  calories: number;
  ingredients: Ingredient[];
  average_rating: number;
  reviews: any[];
}

export default function DishDetailPage() {
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  useEffect(() => {
    const fetchDish = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/menu/dishes/${id}/`);
        setDish(response.data);
        setLoading(false);
      } catch (err) {
        toast.error('Error al cargar el plato');
        router.push('/menu');
      }
    };
    
    fetchDish();
  }, [id, router]);
  
  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      router.push(`/login?redirect=/dish/${id}`);
      return;
    }
    
    try {
      setAddingToCart(true);
      
      await apiClient.post('/orders/cart-items/', {
        dish: id,
        quantity,
        notes
      });
      
      toast.success('Producto agregado al carrito');
      setAddingToCart(false);
    } catch (err) {
      toast.error('Error al agregar al carrito');
      setAddingToCart(false);
    }
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (!dish) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl mb-4">Plato no encontrado</h2>
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
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg">
            {dish.image ? (
              <Image 
                src={`${process.env.NEXT_PUBLIC_API_URL}${dish.image}`}
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
        </div>
        
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{dish.name}</h1>
          <p className="text-gray-600 mb-4">{dish.category_name}</p>
          
          <div className="mb-6">
            {dish.has_promotion ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold">${dish.final_price.toFixed(2)}</span>
                <span className="ml-2 text-lg text-gray-500 line-through">${dish.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-2xl font-bold">${dish.price.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-gray-700 mb-6">{dish.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Ingredientes</h3>
            <ul className="list-disc pl-5">
              {dish.ingredients.map((ing) => (
                <li key={ing.id} className="mb-1">
                  {ing.ingredient_details.name}
                  {ing.ingredient_details.is_allergen && (
                    <span className="ml-2 text-red-600 text-sm font-medium">(Alérgeno)</span>
                  )}
                  {ing.is_optional && (
                    <span className="ml-2 text-gray-500 text-sm">(Opcional)</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-6 mb-6">
            <div>
              <span className="text-gray-700 mr-2">Tiempo de preparación:</span>
              <span>{dish.preparation_time} min</span>
            </div>
            
            {dish.calories && (
              <div>
                <span className="text-gray-700 mr-2">Calorías:</span>
                <span>{dish.calories} kcal</span>
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              id="notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Instrucciones especiales para este plato"
            />
          </div>
          
          <div className="flex items-center mb-6">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-10 h-10 bg-gray-200 rounded-l-md flex items-center justify-center"
              aria-label="Disminuir cantidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            
            <span className="w-12 h-10 bg-gray-100 flex items-center justify-center text-lg font-medium">
              {quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(1)}
              className="w-10 h-10 bg-gray-200 rounded-r-md flex items-center justify-center"
              aria-label="Aumentar cantidad"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center"
          >
            {addingToCart ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Agregando...
              </span>
            ) : (
              'Agregar al carrito'
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Reseñas</h2>
        
        {isAuthenticated ? (
          <AddReviewForm dishId={dish.id} onReviewAdded={(newReview) => {
            setDish({
              ...dish,
              reviews: [...dish.reviews, newReview]
            });
          }} />
        ) : (
          <p className="mb-6 text-gray-600">
            <a href={`/login?redirect=/dish/${id}`} className="text-indigo-600 hover:underline">
              Inicia sesión
            </a> para dejar una reseña
          </p>
        )}
        
        <ReviewList reviews={dish.reviews} />
      </div>
    </div>
  );
}
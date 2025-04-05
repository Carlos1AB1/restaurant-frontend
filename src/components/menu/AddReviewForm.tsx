// src/components/menu/AddReviewForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '@/lib/api/client';
import toast from 'react-hot-toast';

interface AddReviewFormProps {
  dishId: string;
  onReviewAdded: (review: any) => void;
}

interface ReviewFormValues {
  rating: number;
  comment: string;
}

export default function AddReviewForm({ dishId, onReviewAdded }: AddReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<ReviewFormValues>({
    defaultValues: {
      rating: 0,
      comment: ''
    }
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.post(`/menu/dishes/${dishId}/reviews/`, {
        rating,
        comment: data.comment
      });
      
      onReviewAdded(response.data);
      toast.success('Reseña agregada correctamente');
      reset();
      setRating(0);
      setSubmitting(false);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Error al agregar reseña');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm mb-8">
      <h3 className="text-lg font-semibold mb-4">Deja tu opinión</h3>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <svg 
                  className={`w-8 h-8 ${
                    (hoverRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'
                  } mr-1`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-600">
              {rating > 0 ? `${rating} de 5 estrellas` : 'Selecciona una calificación'}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comentario
          </label>
          <textarea
            id="comment"
            rows={4}
            {...register('comment', { 
              required: 'El comentario es requerido',
              minLength: {
                value: 10,
                message: 'El comentario debe tener al menos 10 caracteres'
              }
            })}
            className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Comparte tu experiencia con este plato..."
          />
          {errors.comment && (
            <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {submitting ? 'Enviando...' : 'Enviar reseña'}
        </button>
      </form>
    </div>
  );
}
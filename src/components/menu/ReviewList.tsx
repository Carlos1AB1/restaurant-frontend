// src/components/menu/ReviewList.tsx
'use client';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    username: string;
    first_name?: string;
    last_name?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No hay reseñas todavía. ¡Sé el primero en opinar!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                {(review.user.first_name?.[0] || review.user.username[0]).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {review.user.first_name 
                    ? `${review.user.first_name} ${review.user.last_name || ''}`
                    : review.user.username}
                </p>
                <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
              </div>
            </div>
            <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm font-medium">{review.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-gray-700">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
// src/components/ui/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="w-12 h-12 rounded-full absolute border-4 border-gray-200"></div>
          <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-indigo-600 border-t-transparent"></div>
        </div>
        <span className="ml-4 text-lg text-gray-700">Cargando...</span>
      </div>
    );
  }
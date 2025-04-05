// src/components/user/AddAddressForm.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface AddAddressFormProps {
  onSubmit: (data: AddressFormValues) => void;
  onCancel: () => void;
}

interface AddressFormValues {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_default?: boolean;
}

export default function AddAddressForm({ onSubmit, onCancel }: AddAddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<AddressFormValues>({
    defaultValues: {
      country: 'México',
      is_default: false
    }
  });
  
  const onFormSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-6">
      <h3 className="text-lg font-medium mb-4">Agregar dirección</h3>
      
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección *
            </label>
            <input
              id="address_line1"
              type="text"
              {...register('address_line1', { required: 'La dirección es requerida' })}
              className="w-full p-2 border rounded-md"
              placeholder="Calle y número"
            />
            {errors.address_line1 && (
              <p className="mt-1 text-sm text-red-600">{errors.address_line1.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección adicional
            </label>
            <input
              id="address_line2"
              type="text"
              {...register('address_line2')}
              className="w-full p-2 border rounded-md"
              placeholder="Apartamento, suite, unidad, etc. (opcional)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                Ciudad *
              </label>
              <input
                id="city"
                type="text"
                {...register('city', { required: 'La ciudad es requerida' })}
                className="w-full p-2 border rounded-md"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Estado/Provincia *
              </label>
              <input
                id="state"
                type="text"
                {...register('state', { required: 'El estado es requerido' })}
                className="w-full p-2 border rounded-md"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                Código postal *
              </label>
              <input
                id="postal_code"
                type="text"
                {...register('postal_code', { 
                  required: 'El código postal es requerido',
                  pattern: {
                    value: /^\d{5}$/,
                    message: 'El código postal debe tener 5 dígitos'
                  }
                })}
                className="w-full p-2 border rounded-md"
              />
              {errors.postal_code && (
                <p className="mt-1 text-sm text-red-600">{errors.postal_code.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                País *
              </label>
              <input
                id="country"
                type="text"
                {...register('country', { required: 'El país es requerido' })}
                className="w-full p-2 border rounded-md"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              id="phone_number"
              type="tel"
              {...register('phone_number', { 
                required: 'El teléfono es requerido',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'El número debe tener 10 dígitos'
                }
              })}
              className="w-full p-2 border rounded-md"
              placeholder="10 dígitos"
            />
            {errors.phone_number && (
              <p className="mt-1 text-sm text-red-600">{errors.phone_number.message}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="is_default"
              type="checkbox"
              {...register('is_default')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="is_default" className="ml-2 block text-sm text-gray-700">
              Establecer como dirección predeterminada
            </label>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar dirección'}
          </button>
        </div>
      </form>
    </div>
  );
}
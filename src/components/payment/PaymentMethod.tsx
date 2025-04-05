// src/components/payment/PaymentMethod.tsx
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface PaymentMethodProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function PaymentMethod({ register, errors }: PaymentMethodProps) {
  return (
    <div>
      <fieldset>
        <legend className="text-base font-medium text-gray-700 mb-3">
          ¿Cómo quieres recibir tu pedido?
        </legend>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="pickup"
              type="radio"
              value="PICKUP"
              {...register('delivery_method', { required: 'Selecciona un método de entrega' })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="pickup" className="ml-3 block text-sm font-medium text-gray-700">
              Recoger en restaurante (sin costo adicional)
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="delivery"
              type="radio"
              value="DELIVERY"
              {...register('delivery_method', { required: 'Selecciona un método de entrega' })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="delivery" className="ml-3 block text-sm font-medium text-gray-700">
              Entrega a domicilio (+$50.00)
            </label>
          </div>
        </div>
        
        {errors.delivery_method && (
          <p className="mt-2 text-sm text-red-600">
            {errors.delivery_method.message as string}
          </p>
        )}
      </fieldset>
    </div>
  );
}
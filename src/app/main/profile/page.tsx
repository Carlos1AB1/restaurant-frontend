// src/app/(main)/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { RootState, AppDispatch } from '@/store';
import { loadUser } from '@/store/slices/authSlice';
import apiClient from '@/lib/api/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import AddressItem from '@/components/user/AddressItem';
import AddAddressForm from '@/components/user/AddAddressForm';
import toast from 'react-hot-toast';

interface ProfileFormValues {
  username: string;
  first_name: string;
  last_name: string;
}

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone_number: string;
  is_default: boolean;
}

export default function ProfilePage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile');
      return;
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Obtener direcciones
        const addressesResponse = await apiClient.get('/users/addresses/');
        setAddresses(addressesResponse.data);
        
        // Establecer valores del formulario
        // src/app/(main)/profile/page.tsx (continuación)
        // Establecer valores del formulario
        if (user) {
            setValue('username', user.username);
            setValue('first_name', user.first_name || '');
            setValue('last_name', user.last_name || '');
          }
          
          setLoading(false);
        } catch (err) {
          toast.error('Error al cargar datos del perfil');
          setLoading(false);
        }
      };
      
      fetchData();
    }, [isAuthenticated, router, setValue, user]);
    
    const onSubmit = async (data: ProfileFormValues) => {
      try {
        setUpdatingProfile(true);
        
        await apiClient.patch('/users/profile/', data);
        dispatch(loadUser());
        
        toast.success('Perfil actualizado correctamente');
        setUpdatingProfile(false);
      } catch (err) {
        toast.error('Error al actualizar perfil');
        setUpdatingProfile(false);
      }
    };
    
    const handleAddAddress = async (addressData: any) => {
      try {
        const response = await apiClient.post('/users/addresses/', addressData);
        setAddresses([...addresses, response.data]);
        setShowAddressForm(false);
        toast.success('Dirección agregada correctamente');
      } catch (err) {
        toast.error('Error al agregar dirección');
      }
    };
    
    const handleDeleteAddress = async (addressId: string) => {
      try {
        await apiClient.delete(`/users/addresses/${addressId}/`);
        setAddresses(addresses.filter(addr => addr.id !== addressId));
        toast.success('Dirección eliminada correctamente');
      } catch (err) {
        toast.error('Error al eliminar dirección');
      }
    };
    
    const handleSetDefaultAddress = async (addressId: string) => {
      try {
        const address = addresses.find(addr => addr.id === addressId);
        if (address) {
          await apiClient.patch(`/users/addresses/${addressId}/`, {
            ...address,
            is_default: true
          });
          
          // Actualizar addresses localmente
          setAddresses(
            addresses.map(addr => ({
              ...addr,
              is_default: addr.id === addressId
            }))
          );
          
          toast.success('Dirección predeterminada actualizada');
        }
      } catch (err) {
        toast.error('Error al actualizar dirección predeterminada');
      }
    };
    
    if (loading) return <LoadingSpinner />;
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Tu Perfil</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Información personal</h2>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  type="text"
                  {...register('username', { required: 'Este campo es obligatorio' })}
                  className="w-full p-2 border rounded-md"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  id="first_name"
                  type="text"
                  {...register('first_name')}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  id="last_name"
                  type="text"
                  {...register('last_name')}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-100"
                />
                <p className="mt-1 text-sm text-gray-500">
                  El correo no se puede modificar
                </p>
              </div>
              
              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                {updatingProfile ? 'Actualizando...' : 'Actualizar perfil'}
              </button>
            </form>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Direcciones de entrega</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {showAddressForm ? 'Cancelar' : '+ Agregar dirección'}
                </button>
              </div>
              
              {showAddressForm && (
                <AddAddressForm onSubmit={handleAddAddress} onCancel={() => setShowAddressForm(false)} />
              )}
              
              <div className="space-y-4 mt-4">
                {addresses.length === 0 ? (
                  <p className="text-gray-500">No tienes direcciones guardadas</p>
                ) : (
                  addresses.map((address) => (
                    <AddressItem
                      key={address.id}
                      address={address}
                      onDelete={() => handleDeleteAddress(address.id)}
                      onSetDefault={() => handleSetDefaultAddress(address.id)}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Acciones de cuenta</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/orders')}
                  className="w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition text-left px-4"
                >
                  Ver historial de pedidos
                </button>
                <button
                  onClick={() => router.push('/reset-password')}
                  className="w-full py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition text-left px-4"
                >
                  Cambiar contraseña
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
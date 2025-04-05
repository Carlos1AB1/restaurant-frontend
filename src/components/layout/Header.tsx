// src/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';
import SearchBar from '@/components/menu/SearchBar';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    // Cerrar menús al cambiar de ruta
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);
  
  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };
  
  return (
    <header className={`sticky top-0 z-30 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'} transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">RestaurantApp</span>
          </Link>
          
          {/* Menú de navegación (escritorio) */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className={`text-gray-700 hover:text-indigo-600 ${pathname === '/' ? 'text-indigo-600 font-medium' : ''}`}>
              Inicio
            </Link>
            <Link href="/menu" className={`text-gray-700 hover:text-indigo-600 ${pathname?.startsWith('/menu') ? 'text-indigo-600 font-medium' : ''}`}>
              Menú
            </Link>
            <Link href="/orders" className={`text-gray-700 hover:text-indigo-600 ${pathname?.startsWith('/orders') ? 'text-indigo-600 font-medium' : ''}`}>
              Mis Pedidos
            </Link>
          </nav>
          
          {/* Búsqueda y acciones de usuario */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="w-60">
              <SearchBar />
            </div>
            
            <Link href="/cart" className="relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 hover:text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Aquí podrías agregar un badge con la cantidad de productos en el carrito */}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-indigo-600 focus:outline-none"
                >
                  <span className="mr-1">{user?.first_name || user?.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Mi Perfil
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Mis Pedidos
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                Iniciar Sesión
              </Link>
            )}
          </div>
          
          {/* Menú móvil */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="mr-4 relative p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {/* Badge */}
            </Link>
            
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg p-4">
          <div className="mb-4">
            <SearchBar />
          </div>
          
          <nav className="flex flex-col space-y-4">
            <Link href="/" className={`text-gray-700 hover:text-indigo-600 ${pathname === '/' ? 'text-indigo-600 font-medium' : ''}`}>
              Inicio
            </Link>
            <Link href="/menu" className={`text-gray-700 hover:text-indigo-600 ${pathname?.startsWith('/menu') ? 'text-indigo-600 font-medium' : ''}`}>
              Menú
            </Link>
            <Link href="/orders" className={`text-gray-700 hover:text-indigo-600 ${pathname?.startsWith('/orders') ? 'text-indigo-600 font-medium' : ''}`}>
              Mis Pedidos
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/profile" className="text-gray-700 hover:text-indigo-600">
                  Mi Perfil
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-left text-gray-700 hover:text-indigo-600"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link href="/login" className="text-gray-700 hover:text-indigo-600">
                Iniciar Sesión
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
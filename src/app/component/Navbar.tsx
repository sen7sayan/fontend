'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// @ts-ignore
import { useCart } from 'use-cart';

export default function Navbar() {
  const [userName, setUserName] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { itemCount } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('userName');

    if (token) {
      setIsAuthenticated(true);
      setUserName(name || 'User');
    } else {
      setIsAuthenticated(false);
      setUserName(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserName(null);
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow p-4 flex items-center justify-between">
     <Link href={'/'}>
      <h1 className="text-xl font-bold text-blue-600">🛒 OrdersApp</h1>
     </Link>

      <div className="flex items-center gap-6">
        {/* Cart link */}
        <Link href="/cart" className="relative">
          <span className="text-gray-800 font-medium">Cart</span>
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>

        {/* My Orders (only if logged in) */}
        {isAuthenticated && (
          <Link
            href="/orders"
            className="text-gray-800 font-medium hover:text-blue-600 transition"
          >
            My Orders
          </Link>
        )}

        {isAuthenticated ? (
          <>
            <span className="text-gray-800">Hello, {userName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

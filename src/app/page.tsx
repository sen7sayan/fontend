'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart } from 'use-cart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addItem, items,updateItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_PRODUCT_SERVICE}/product?page=${page}&limit=${limit}`);
        const data = await res.json();
        console.log(data)
        setProducts(data.data);
        setTotalPages(data.meta.totalPages);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit]);

  const handleAddToCart = (product: Product) => {
  const existingItem = items.find((item) => item.id === product.id);

  if (existingItem) {
    updateItem(product.id, { quantity: existingItem.quantity + 1 });
  } else {
    addItem({
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.image,
    });
  }

  alert('Product added to cart');
};

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const inCart = items.find((item) => item.id === product.id);
          return (
            <div key={product.id} className="bg-white rounded-2xl shadow-md p-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-xl mb-4"
              />
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-bold text-lg">₹{product.price}</span>
                <Link href={`/product/${product.id}`} className="text-blue-600 hover:underline">
                  View
                </Link>
                <button
                  disabled={!!inCart}
                  onClick={() => handleAddToCart(product)}
                  className={`px-3 py-1 rounded ${
                    inCart ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {inCart ? 'Added' : 'Add to Cart'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-4">
        <button
          disabled={page === 1}
          onClick={handlePrevPage}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={handleNextPage}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

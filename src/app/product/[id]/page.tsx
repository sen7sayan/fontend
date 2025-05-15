'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from 'use-cart';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  image: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_ORDER_PRODUCT_SERVICE}/api/product/${id}`);
        const result = await res.json();
        setProduct(result.data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
     id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity: 1,
      image: product.image,
    });

    alert('Product added to cart!');
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!product) return <p className="p-4 text-red-500">Product not found</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p className="text-lg text-gray-700 mb-2">{product.description}</p>
      <p className="text-xl font-semibold mb-2">Price: ${product.price}</p>
      <p className="text-md text-gray-600 mb-4">Stock: {product.stock}</p>

      <button
        onClick={handleAddToCart}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add to Cart
      </button>
    </div>
  );
}

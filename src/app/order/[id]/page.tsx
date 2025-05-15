'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Product {
  name: string;
  image: string;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  product: Product;
}

interface Order {
  id: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in');
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_SERVICE}/api/customer/order/${id}`, {
          headers: {
            Authorization: token,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setOrder(data.data);
        } else {
          console.error('Failed to fetch order:', data.message);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!order) return <p className="p-4 text-red-500">Order not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🧾 Order Details</h1>
      <p className="mb-1">Order ID: {order.id}</p>
      <p className="mb-1">Status: {order.status}</p>
      <p className="mb-4">Total Price: ${order.totalPrice}</p>

      <h2 className="text-xl font-semibold mb-2">Items</h2>
      <ul className="space-y-4">
        {order.orderItems.map((item) => (
          <li key={item.id} className="border p-4 rounded flex items-center gap-4">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{item.product.name}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Unit Price: ${item.unitPrice}</p>
              <p>Total: ${item.totalPrice}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

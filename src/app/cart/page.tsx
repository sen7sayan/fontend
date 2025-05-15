'use client';

import { useCart } from 'use-cart';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, cartTotal } = useCart(); // ✅ Correct: hook at top level
  const router = useRouter();

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in');
      return;
    }

    const orderItems = items.map((item) => ({
      productId: item.sku.id,
      quantity: item.quantity,
    }));

    const res = await fetch('http://localhost:3001/customer/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ orderItems }),
    });

    const data = await res.json();

    if (res.ok) {
    //   clearCart();
      router.push(`/order/${data.data.id}`);
    } else {
      alert('Order failed: ' + data.message);
    }
  };
const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
const totalPrice = items.reduce((sum, item) => sum + item.sku.price * item.quantity, 0);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="space-y-2">
          {items.map((item) => (
  <li key={item.id} className="border p-4 rounded flex gap-4 items-center">
    <img
      src={item.sku.image}
      alt={item.sku.name}
      className="w-20 h-20 object-cover rounded"
    />
    <div>
      <h3 className="text-lg font-semibold">{item.sku.name}</h3>
       <h3 className="text-lg font-semibold">Price: {item.sku.price}</h3>
      <p>Quantity: {item.quantity}</p>
    </div>
  </li>
))}
          </ul>
          <div className="mt-4">
            <p className="text-lg font-semibold">Total Cart: {totalItems}</p>
            <p className="text-lg font-semibold">Total: ${totalPrice}</p>
            
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-700 transition"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

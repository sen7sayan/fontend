"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
 const token = localStorage.getItem('token');
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_SERVICE}/api/customer/orders?page=${page}&limit=${limit}`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await res.json();
        console.log(data )
        setOrders(data.data);
        setTotalPages(data.totalPages || 5); // Set from backend response if available
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    }

    fetchOrders();
  }, [page]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {orders?.map((order) => (
        <div key={order.id} className="border rounded p-4 mb-4">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <Link href={`/order/${order.id}`} className="text-blue-500 underline mt-2 inline-block">View Details</Link>
        </div>
      ))}

      {/* Pagination */}
      <div className="flex gap-2 justify-center mt-6">
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="px-3 py-1">{page}</span>
        <button
          className="px-3 py-1 border rounded disabled:opacity-50"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

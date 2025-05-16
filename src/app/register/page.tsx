'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  });

  const [errorMsg, setErrorMsg] = useState('');

  // Check if token exists on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CUSTOMER_SERVICE}/api/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (res.ok && result.data?.access_token) {
        localStorage.setItem('token', result.data.access_token);
        localStorage.setItem('userName', form.name);
        // Reload the page instead of using router.push
        window.location.reload();
      } else {
        setErrorMsg(result.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMsg('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        {errorMsg && (
          <p className="text-red-500 text-sm mb-3 text-center">{errorMsg}</p>
        )}

        <div className="mb-3">
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1">Address</label>
          <input
            type="text"
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
        <div className="mt-4 flex justify-center">
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
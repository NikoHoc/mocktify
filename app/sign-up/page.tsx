'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link'

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSuccessMsg('Signup successful! Redirecting to sign in page!');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/sign-in'); // Redirect to login after successful signup
      }, 4000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 focus:outline-none"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <h2 className="text-center mt-3">
          Already have account? <Link href="/sign-in" className='text-blue-600 underline decoration-blue-600 md:decoration-blue-400'>Sign In</Link>
        </h2>

        {successMsg && <p className="mt-4 text-green-500 text-center">{successMsg}</p>}
        {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await signup({ name, email, password });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message || 'Signup failed');
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-netflix-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/60 backdrop-blur rounded-xl border border-white/10 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Sign Up</h1>
        <p className="text-gray-300 mb-6">Create your account to start browsing.</p>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-200 px-4 py-3">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-netflix-red"
              placeholder="John Doe"
              autoComplete="name"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-netflix-red"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-netflix-red"
              placeholder="Create a strong password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-netflix-red hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-3 transition-colors"
          >
            {submitting ? 'Creating…' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-300">
          Already have an account?{' '}
          <Link className="text-white hover:text-netflix-red transition-colors" to="/login">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

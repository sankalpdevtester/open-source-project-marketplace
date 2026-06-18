import { useState } from 'react';
import { Form, Link, useNavigate } from 'remix';
import { createUser } from '~/utils/auth.server';

export default function RegisterForm() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await createUser(email, password);
      navigate('/login');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirm Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
      </Form>
    </div>
  );
}
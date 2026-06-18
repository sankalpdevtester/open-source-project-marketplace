import { json } from 'body-parser';
import { Form, Link, useLoaderData, useNavigate } from 'remix';
import { db } from '~/utils/db.server';
import { bcrypt } from 'bcryptjs';
import { useState } from 'react';

export const loader = async () => {
  return null;
};

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const user = await db.user.findFirst({
    where: { email: email as string },
  });

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isValidPassword = await bcrypt.compare(password as string, user.password);

  if (!isValidPassword) {
    return { error: 'Invalid email or password' };
  }

  return { userId: user.id };
};

export default function AuthRoute() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const response = await fetch('/auth', {
      method: 'POST',
      body: new FormData(event.target),
    });

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      navigate('/projects');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
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
            placeholder="Password"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-xs italic">{error}</p>}
        </div>
      </Form>
    </div>
  );
}
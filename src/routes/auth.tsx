import { json } from '@remix-run/node';
import { Form, useLoaderData, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { prisma } from '~/prisma';
import { authenticator } from '~/services/authenticator';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export const loader = async () => {
  return json({});
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const action = formData.get('action');

  if (action === 'login') {
    const { email, password } = Object.fromEntries(formData);
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      return json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await authenticator.verifyPassword(password, user.password))) {
      return json({ error: 'Invalid email or password' }, { status: 401 });
    }

    return authenticator.authenticateUser(request, user);
  } else if (action === 'register') {
    const { name, email, password } = Object.fromEntries(formData);
    const result = registerSchema.safeParse({ name, email, password });

    if (!result.success) {
      return json({ error: 'Invalid registration data' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await authenticator.hashPassword(password);
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword } });

    return authenticator.authenticateUser(request, user);
  }

  return json({ error: 'Invalid action' }, { status: 400 });
};

export default function AuthPage() {
  const data = useLoaderData();
  const actionData = useActionData();

  return (
    <div className="flex justify-center items-center h-screen">
      <Form method="post" className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">Login or Register</h2>
        {actionData?.error && <p className="text-red-500 mb-4">{actionData.error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            name="password"
            required
          />
        </div>
        <div className="mb-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            name="action"
            value="login"
          >
            Login
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            name="action"
            value="register"
          >
            Register
          </button>
        </div>
      </Form>
    </div>
  );
};
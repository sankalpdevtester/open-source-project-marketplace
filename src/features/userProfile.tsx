import { useLoaderData, useActionData } from '@remix-run/react';
import { authenticator } from '~/services/authenticator';
import { prisma } from '~/prisma';

export const loader = async ({ request }: { request: Request }) => {
  const user = await authenticator.getUserFromSession(request);

  if (!user) {
    return null;
  }

  const projects = await prisma.project.findMany({ where: { userId: user.id } });

  return { user, projects };
};

export const action = async ({ request }: { request: Request }) => {
  const user = await authenticator.getUserFromSession(request);

  if (!user) {
    return null;
  }

  const formData = await request.formData();
  const name = formData.get('name');
  const email = formData.get('email');

  if (name && email) {
    await prisma.user.update({ where: { id: user.id }, data: { name, email } });
  }

  return { user, projects: await prisma.project.findMany({ where: { userId: user.id } }) };
};

export default function UserProfile() {
  const data = useLoaderData();
  const actionData = useActionData();

  if (!data) {
    return <p>You must be logged in to view this page.</p>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-4 rounded shadow-md">
        <h2 className="text-lg font-bold mb-4">User Profile</h2>
        <p>Name: {data.user.name}</p>
        <p>Email: {data.user.email}</p>
        <h3 className="text-lg font-bold mb-4">Projects</h3>
        <ul>
          {data.projects.map((project) => (
            <li key={project.id}>{project.name}</li>
          ))}
        </ul>
        <Form method="post" className="mt-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              defaultValue={data.user.name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              defaultValue={data.user.email}
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save Changes
          </button>
        </Form>
      </div>
    </div>
  );
}
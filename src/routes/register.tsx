import { Link, useLoaderData } from 'remix';
import RegisterForm from '~/components/RegisterForm';

export const loader = async () => {
  return null;
};

export default function RegisterRoute() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <RegisterForm />
      <p className="text-gray-700 text-sm">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
import { authenticator } from '~/services/authenticator';
import { RequestHandler } from '@remix-run/node';

export const authenticate: RequestHandler = async ({ request }) => {
  const user = await authenticator.getUserFromSession(request);

  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  return user;
};

export const requireAuth = (handler: RequestHandler) => {
  return async (args: any) => {
    const user = await authenticate(args);

    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }

    return handler({ ...args, user });
  };
};
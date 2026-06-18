import { z } from 'zod';
import { prisma } from '~/prisma';
import * as bcrypt from 'bcryptjs';

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export const authenticator = {
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  },

  async verifyPassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  },

  async authenticateUser(request: Request, user: any) {
    const userData = userSchema.parse(user);
    const session = await request.session();

    session.set('userId', userData.id);
    session.set('userName', userData.name);
    session.set('userEmail', userData.email);

    return session.commit();
  },

  async getUserFromSession(request: Request) {
    const session = await request.session();
    const userId = session.get('userId');

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return null;
    }

    return userSchema.parse(user);
  },
};
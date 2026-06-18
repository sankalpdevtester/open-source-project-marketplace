import { db } from './db.server';
import { bcrypt } from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const getUserById = async (id: number) => {
  return await db.user.findFirst({
    where: { id },
  });
};

export const getUserByEmail = async (email: string) => {
  return await db.user.findFirst({
    where: { email },
  });
};

export const createUser = async (email: string, password: string) => {
  const hashedPassword = await hashPassword(password);
  return await db.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};
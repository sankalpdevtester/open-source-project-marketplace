// Import Prisma Client
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define Project model
export interface Project {
  id: number;
  title: string;
  description: string;
  url: string;
  categoryId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define User model
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define Category model
export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define ProjectCategory model
export interface ProjectCategory {
  id: number;
  projectId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define ProjectUser model
export interface ProjectUser {
  id: number;
  projectId: number;
  userId: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define database models
export const models = {
  Project: {
    findMany: async () => {
      return await prisma.project.findMany();
    },
    create: async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await prisma.project.create({
        data: {
          title: data.title,
          description: data.description,
          url: data.url,
          categoryId: data.categoryId,
          userId: data.userId,
        },
      });
    },
    update: async (id: number, data: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
      return await prisma.project.update({
        where: { id },
        data,
      });
    },
    delete: async (id: number) => {
      return await prisma.project.delete({ where: { id } });
    },
  },
  User: {
    findMany: async () => {
      return await prisma.user.findMany();
    },
    create: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await prisma.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      });
    },
    update: async (id: number, data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) => {
      return await prisma.user.update({
        where: { id },
        data,
      });
    },
    delete: async (id: number) => {
      return await prisma.user.delete({ where: { id } });
    },
  },
  Category: {
    findMany: async () => {
      return await prisma.category.findMany();
    },
    create: async (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
      return await prisma.category.create({
        data: {
          name: data.name,
          description: data.description,
        },
      });
    },
    update: async (id: number, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
      return await prisma.category.update({
        where: { id },
        data,
      });
    },
    delete: async (id: number) => {
      return await prisma.category.delete({ where: { id } });
    },
  },
};

// Export models
export default models;
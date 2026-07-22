// src/utils/projectUtils.ts
import { PrismaClient } from '@prisma/client';
import { Project } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define a schema for project data validation
const projectSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  ratings: z.array(z.number()),
});

// Function to validate project data
export function validateProjectData(data: any): Project | null {
  try {
    return projectSchema.parse(data);
  } catch (error) {
    console.error('Error validating project data:', error);
    return null;
  }
}

// Function to calculate the average rating of a project
export function calculateAverageRating(project: Project): number {
  if (!project.ratings || project.ratings.length === 0) {
    return 0;
  }
  const sum = project.ratings.reduce((acc, rating) => acc + rating, 0);
  return sum / project.ratings.length;
}

// Function to get the top-rated projects
export async function getTopRatedProjects(limit: number): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    include: {
      ratings: true,
    },
    orderBy: {
      averageRating: 'desc',
    },
    take: limit,
  });
  return projects;
}

// Function to get the project categories
export async function getProjectCategories(): Promise<string[]> {
  const categories = await prisma.project.findMany({
    select: {
      categories: true,
    },
  });
  const uniqueCategories = Array.from(new Set(categories.flatMap((project) => project.categories)));
  return uniqueCategories;
}

// Function to search for projects by name or description
export async function searchProjects(query: string): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
    },
  });
  return projects;
}
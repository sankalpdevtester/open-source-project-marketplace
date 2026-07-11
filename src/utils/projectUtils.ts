// src/utils/projectUtils.ts
import { PrismaClient } from '@prisma/client';
import { Project } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define a schema for project data validation
const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(1000),
  categories: z.array(z.string().min(1).max(255)),
});

// Validate project data using the schema
export function validateProjectData(data: any): Project | null {
  try {
    const result = projectSchema.parse(data);
    return result;
  } catch (error) {
    console.error('Error validating project data:', error);
    return null;
  }
}

// Get a list of all project categories from the database
export async function getProjectCategories(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    select: {
      categories: true,
    },
  });

  const categories: string[] = [];
  projects.forEach((project) => {
    project.categories.forEach((category) => {
      if (!categories.includes(category)) {
        categories.push(category);
      }
    });
  });

  return categories;
}

// Get a list of recommended projects based on a user's interests
export async function getRecommendedProjects(userId: string): Promise<Project[]> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      interests: true,
    },
  });

  if (!user || !user.interests) {
    return [];
  }

  const recommendedProjects: Project[] = [];
  const projects = await prisma.project.findMany({
    where: {
      categories: {
        hasSome: user.interests,
      },
    },
  });

  projects.forEach((project) => {
    if (!recommendedProjects.includes(project)) {
      recommendedProjects.push(project);
    }
  });

  return recommendedProjects;
}

// Update a project's rating based on new user feedback
export async function updateProjectRating(projectId: string, rating: number): Promise<void> {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error(`Project not found: ${projectId}`);
  }

  const newRating = (project.rating * project.ratingCount + rating) / (project.ratingCount + 1);
  await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      rating: newRating,
      ratingCount: project.ratingCount + 1,
    },
  });
}
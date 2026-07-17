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
  rating: z.number(),
});

// Function to validate project data
export function validateProjectData(data: any): Project | null {
  try {
    const result = projectSchema.parse(data);
    return result;
  } catch (error) {
    console.error('Invalid project data:', error);
    return null;
  }
}

// Function to get project categories from the database
export async function getProjectCategories(): Promise<string[]> {
  const categories = await prisma.project.findMany({
    select: {
      categories: true,
    },
    distinct: ['categories'],
  });

  const categoryList: string[] = [];
  categories.forEach((project) => {
    project.categories.forEach((category) => {
      if (!categoryList.includes(category)) {
        categoryList.push(category);
      }
    });
  });

  return categoryList;
}

// Function to calculate the average rating of a project
export async function calculateProjectRating(projectId: number): Promise<number | null> {
  const ratings = await prisma.projectRating.findMany({
    where: {
      projectId: projectId,
    },
  });

  if (ratings.length === 0) {
    return null;
  }

  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const average = sum / ratings.length;

  return average;
}

// Function to get project recommendations based on user interests
export async function getProjectRecommendations(userId: number): Promise<Project[] | null> {
  const userInterests = await prisma.userProfile.findUnique({
    where: {
      id: userId,
    },
    select: {
      interests: true,
    },
  });

  if (!userInterests || !userInterests.interests) {
    return null;
  }

  const recommendedProjects = await prisma.project.findMany({
    where: {
      categories: {
        hasSome: userInterests.interests,
      },
    },
  });

  return recommendedProjects;
}

// Function to update project discussion comments
export async function updateProjectDiscussion(projectId: number, commentId: number, commentText: string): Promise<boolean> {
  try {
    await prisma.projectDiscussion.update({
      where: {
        id: commentId,
      },
      data: {
        text: commentText,
      },
    });

    return true;
  } catch (error) {
    console.error('Error updating project discussion:', error);
    return false;
  }
}
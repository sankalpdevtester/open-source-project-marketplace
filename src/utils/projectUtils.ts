// src/utils/projectUtils.ts
import { PrismaClient } from '@prisma/client';
import { Project } from '@prisma/client';
import { authenticator } from '../services/authenticator';

const prisma = new PrismaClient();

/**
 * Validate project data before creating or updating a project
 * @param projectData - Project data to be validated
 * @returns - Validated project data or throws an error if invalid
 */
export function validateProjectData(projectData: any): Project {
  if (!projectData.name || !projectData.description || !projectData.category) {
    throw new Error('Project name, description, and category are required');
  }

  if (projectData.name.length < 3 || projectData.name.length > 50) {
    throw new Error('Project name must be between 3 and 50 characters');
  }

  if (projectData.description.length < 10 || projectData.description.length > 500) {
    throw new Error('Project description must be between 10 and 500 characters');
  }

  return projectData as Project;
}

/**
 * Get project categories from the database
 * @returns - List of project categories
 */
export async function getProjectCategories(): Promise<string[]> {
  const categories = await prisma.project.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  return categories.map((category) => category.category);
}

/**
 * Get project recommendations based on user's interests
 * @param userId - ID of the user
 * @returns - List of recommended projects
 */
export async function getProjectRecommendations(userId: number): Promise<Project[]> {
  const user = await authenticator.getUser(userId);
  const userInterests = user.interests;

  const recommendedProjects = await prisma.project.findMany({
    where: {
      category: {
        in: userInterests,
      },
    },
  });

  return recommendedProjects;
}

/**
 * Get project rating statistics
 * @param projectId - ID of the project
 * @returns - Project rating statistics
 */
export async function getProjectRatingStats(projectId: number): Promise<any> {
  const projectRatings = await prisma.projectRating.findMany({
    where: {
      projectId: projectId,
    },
  });

  const ratingStats = {
    averageRating: 0,
    totalRatings: 0,
  };

  if (projectRatings.length > 0) {
    const totalRating = projectRatings.reduce((acc, rating) => acc + rating.rating, 0);
    ratingStats.averageRating = totalRating / projectRatings.length;
    ratingStats.totalRatings = projectRatings.length;
  }

  return ratingStats;
}

/**
 * Update project rating
 * @param projectId - ID of the project
 * @param userId - ID of the user
 * @param rating - New rating
 * @returns - Updated project rating
 */
export async function updateProjectRating(projectId: number, userId: number, rating: number): Promise<any> {
  const existingRating = await prisma.projectRating.findFirst({
    where: {
      projectId: projectId,
      userId: userId,
    },
  });

  if (existingRating) {
    await prisma.projectRating.update({
      where: {
        id: existingRating.id,
      },
      data: {
        rating: rating,
      },
    });
  } else {
    await prisma.projectRating.create({
      data: {
        projectId: projectId,
        userId: userId,
        rating: rating,
      },
    });
  }

  return await getProjectRatingStats(projectId);
}
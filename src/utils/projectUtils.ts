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
export const validateProjectData = (data: any) => {
  return projectSchema.safeParse(data);
};

// Function to get project categories
export const getProjectCategories = async () => {
  const categories = await prisma.project.findMany({
    select: {
      categories: true,
    },
  });

  const uniqueCategories = Array.from(new Set(categories.flatMap((project) => project.categories)));

  return uniqueCategories;
};

// Function to get project recommendations based on user interests
export const getProjectRecommendations = async (userId: number) => {
  const userProjects = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      projects: true,
    },
  });

  const userProjectIds = userProjects?.projects.map((project) => project.id) || [];

  const recommendedProjects = await prisma.project.findMany({
    where: {
      NOT: {
        id: {
          in: userProjectIds,
        },
      },
    },
    take: 10,
  });

  return recommendedProjects;
};

// Function to update project rating
export const updateProjectRating = async (projectId: number, rating: number) => {
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
    },
    data: {
      rating: (project.rating * project.ratingCount + rating) / (project.ratingCount + 1),
      ratingCount: project.ratingCount + 1,
    },
  });

  return updatedProject;
};

// Function to get project discussion threads
export const getProjectDiscussionThreads = async (projectId: number) => {
  const discussionThreads = await prisma.discussionThread.findMany({
    where: {
      projectId: projectId,
    },
  });

  return discussionThreads;
};

// Function to create a new project discussion thread
export const createProjectDiscussionThread = async (projectId: number, title: string, content: string) => {
  const discussionThread = await prisma.discussionThread.create({
    data: {
      projectId: projectId,
      title: title,
      content: content,
    },
  });

  return discussionThread;
};
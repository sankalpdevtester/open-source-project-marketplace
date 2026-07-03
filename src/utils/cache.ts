// src/utils/cache.ts
import { Cache } from 'memory-cache';
import { prisma } from '../prisma/middleware';

interface CacheOptions {
  ttl: number; // time to live in seconds
}

const cache = new Cache();

const cacheKey = (key: string) => `cache:${key}`;

const getCache = (key: string) => {
  return cache.get(cacheKey(key));
};

const setCache = (key: string, value: any, options: CacheOptions) => {
  cache.put(cacheKey(key), value, options.ttl * 1000);
};

const deleteCache = (key: string) => {
  cache.del(cacheKey(key));
};

const clearCache = () => {
  cache.clear();
};

const getProjectRatingCacheKey = (projectId: number) => {
  return `projectRating:${projectId}`;
};

const getProjectRecommendationCacheKey = (projectId: number) => {
  return `projectRecommendation:${projectId}`;
};

const getProjectDiscussionCacheKey = (projectId: number) => {
  return `projectDiscussion:${projectId}`;
};

const getUserProfileCacheKey = (userId: number) => {
  return `userProfile:${userId}`;
};

const getProjectRating = async (projectId: number) => {
  const cacheKey = getProjectRatingCacheKey(projectId);
  const cachedValue = getCache(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }
  const projectRating = await prisma.projectRating.findFirst({
    where: { projectId },
  });
  setCache(cacheKey, projectRating, { ttl: 60 });
  return projectRating;
};

const getProjectRecommendation = async (projectId: number) => {
  const cacheKey = getProjectRecommendationCacheKey(projectId);
  const cachedValue = getCache(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }
  const projectRecommendation = await prisma.projectRecommendation.findFirst({
    where: { projectId },
  });
  setCache(cacheKey, projectRecommendation, { ttl: 60 });
  return projectRecommendation;
};

const getProjectDiscussion = async (projectId: number) => {
  const cacheKey = getProjectDiscussionCacheKey(projectId);
  const cachedValue = getCache(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }
  const projectDiscussion = await prisma.projectDiscussion.findFirst({
    where: { projectId },
  });
  setCache(cacheKey, projectDiscussion, { ttl: 60 });
  return projectDiscussion;
};

const getUserProfile = async (userId: number) => {
  const cacheKey = getUserProfileCacheKey(userId);
  const cachedValue = getCache(cacheKey);
  if (cachedValue) {
    return cachedValue;
  }
  const userProfile = await prisma.userProfile.findFirst({
    where: { userId },
  });
  setCache(cacheKey, userProfile, { ttl: 60 });
  return userProfile;
};

export {
  getProjectRating,
  getProjectRecommendation,
  getProjectDiscussion,
  getUserProfile,
};
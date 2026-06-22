// src/utils/cache.ts
import { Cache } from 'memory-cache';
import { setTimeout } from 'timers';

// Initialize cache with a TTL of 1 hour
const cache = new Cache(3600000);

// Function to get cached value
export function getCachedValue(key: string): any {
  return cache.get(key);
}

// Function to set cached value
export function setCachedValue(key: string, value: any): void {
  cache.put(key, value);
}

// Function to delete cached value
export function deleteCachedValue(key: string): void {
  cache.del(key);
}

// Function to check if a key exists in the cache
export function hasCachedValue(key: string): boolean {
  return cache.has(key);
}

// Function to clear the entire cache
export function clearCache(): void {
  cache.clear();
}

// Example usage:
// const cachedValue = getCachedValue('projectRating');
// if (!cachedValue) {
//   const projectRating = await fetchProjectRating();
//   setCachedValue('projectRating', projectRating);
// }

// Integrate with existing projectRating.tsx file
import { getProjectRating } from '../features/projectRating';

// Create a cache key for project ratings
const projectRatingCacheKey = 'projectRating';

// Function to fetch project rating with caching
export async function fetchProjectRatingWithCache(projectId: number): Promise<any> {
  const cachedProjectRating = getCachedValue(projectRatingCacheKey);
  if (cachedProjectRating) {
    return cachedProjectRating;
  }

  const projectRating = await getProjectRating(projectId);
  setCachedValue(projectRatingCacheKey, projectRating);
  return projectRating;
}

// Integrate with existing projectRecommendation.tsx file
import { getProjectRecommendations } from '../features/projectRecommendation';

// Create a cache key for project recommendations
const projectRecommendationCacheKey = 'projectRecommendations';

// Function to fetch project recommendations with caching
export async function fetchProjectRecommendationsWithCache(userId: number): Promise<any> {
  const cachedProjectRecommendations = getCachedValue(projectRecommendationCacheKey);
  if (cachedProjectRecommendations) {
    return cachedProjectRecommendations;
  }

  const projectRecommendations = await getProjectRecommendations(userId);
  setCachedValue(projectRecommendationCacheKey, projectRecommendations);
  return projectRecommendations;
}

// Integrate with existing projectDiscussion.tsx file
import { getProjectDiscussions } from '../features/projectDiscussion';

// Create a cache key for project discussions
const projectDiscussionCacheKey = 'projectDiscussions';

// Function to fetch project discussions with caching
export async function fetchProjectDiscussionsWithCache(projectId: number): Promise<any> {
  const cachedProjectDiscussions = getCachedValue(projectDiscussionCacheKey);
  if (cachedProjectDiscussions) {
    return cachedProjectDiscussions;
  }

  const projectDiscussions = await getProjectDiscussions(projectId);
  setCachedValue(projectDiscussionCacheKey, projectDiscussions);
  return projectDiscussions;
}

// Integrate with existing userProfile.tsx file
import { getUserProfile } from '../features/userProfile';

// Create a cache key for user profiles
const userProfileCacheKey = 'userProfile';

// Function to fetch user profile with caching
export async function fetchUserProfileWithCache(userId: number): Promise<any> {
  const cachedUserProfile = getCachedValue(userProfileCacheKey);
  if (cachedUserProfile) {
    return cachedUserProfile;
  }

  const userProfile = await getUserProfile(userId);
  setCachedValue(userProfileCacheKey, userProfile);
  return userProfile;
}
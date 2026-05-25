import { useState, useEffect } from 'react';
import { useLoaderData, Link } from 'remix';
import { db } from '~/prisma/db';
import { Project } from '~/prisma/models';

export const loader = async () => {
  const projects = await db.project.findMany();
  return projects;
};

export default function ProjectRecommendation() {
  const projects = useLoaderData();
  const [recommendedProjects, setRecommendedProjects] = useState<Project[]>([]);
  const [userInterests, setUserInterests] = useState<string[]>([]);

  useEffect(() => {
    const storedInterests = localStorage.getItem('userInterests');
    if (storedInterests) {
      setUserInterests(JSON.parse(storedInterests));
    }
  }, []);

  useEffect(() => {
    if (userInterests.length > 0) {
      const recommended = projects.filter((project) => {
        return userInterests.some((interest) => project.categories.includes(interest));
      });
      setRecommendedProjects(recommended);
    }
  }, [projects, userInterests]);

  const handleInterestChange = (interest: string) => {
    const newInterests = [...userInterests, interest];
    setUserInterests(newInterests);
    localStorage.setItem('userInterests', JSON.stringify(newInterests));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Recommended Projects</h1>
      <p className="text-lg mb-4">Based on your interests:</p>
      <ul>
        {recommendedProjects.map((project) => (
          <li key={project.id}>
            <Link to={`/projects/${project.id}`} className="text-blue-600 hover:text-blue-800">
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-bold mt-4">Select your interests:</h2>
      <ul>
        {['Machine Learning', 'Web Development', 'Mobile App Development', 'Data Science'].map((interest) => (
          <li key={interest}>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleInterestChange(interest)}
            >
              {interest}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
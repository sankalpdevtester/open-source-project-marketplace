// src/features/projectRating.tsx
import { useState, useEffect } from 'react';
import { useLoaderData, useActionData, Form } from 'remix';
import { db } from '~/utils/db.server';
import { Prisma } from '@prisma/client';
import { Rating } from 'react-rating';
import { AiFillStar } from 'react-icons/ai';

// Define the ProjectRating component
export default function ProjectRating() {
  const projectId = useLoaderData();
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  // Fetch project reviews and average rating on mount
  useEffect(() => {
    const fetchReviews = async () => {
      const reviews = await db.review.findMany({
        where: { projectId },
      });
      setReviews(reviews);
      const averageRating = await db.review.aggregate({
        where: { projectId },
        _avg: { rating: true },
      });
      setAverageRating(averageRating._avg.rating || 0);
    };
    fetchReviews();
  }, [projectId]);

  // Handle new review submission
  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const review = await db.review.create({
      data: {
        projectId,
        rating,
        review: newReview,
      },
    });
    setReviews((prevReviews) => [...prevReviews, review]);
    setNewReview('');
    setRating(0);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Project Rating</h2>
      <div className="flex items-center mb-4">
        <Rating
          initialRating={averageRating}
          onChange={(rate) => setRating(rate)}
          emptySymbol={<AiFillStar className="text-gray-300" />}
          fullSymbol={<AiFillStar className="text-yellow-400" />}
        />
        <span className="ml-2 text-gray-600">{averageRating.toFixed(2)} / 5</span>
      </div>
      <Form onSubmit={handleReviewSubmit}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={newReview}
          onChange={(event) => setNewReview(event.target.value)}
          placeholder="Write a review"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mt-2"
          type="submit"
        >
          Submit Review
        </button>
      </Form>
      <h2 className="text-lg font-bold mt-4 mb-2">Reviews</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id} className="p-2 border-b border-gray-300">
            <div className="flex items-center mb-1">
              <Rating
                initialRating={review.rating}
                readonly
                emptySymbol={<AiFillStar className="text-gray-300" />}
                fullSymbol={<AiFillStar className="text-yellow-400" />}
              />
              <span className="ml-2 text-gray-600">{review.rating.toFixed(2)} / 5</span>
            </div>
            <p className="text-gray-600">{review.review}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Define the loader for the ProjectRating component
export const loader = async ({ params }: any) => {
  const projectId = params.projectId;
  return projectId;
};

// Define the action for the ProjectRating component
export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const rating = parseInt(formData.get('rating') as string, 10);
  const review = formData.get('review') as string;
  const projectId = formData.get('projectId') as string;
  const newReview = await db.review.create({
    data: {
      projectId,
      rating,
      review,
    },
  });
  return newReview;
};
import { json } from '@remix-run/node';
import { useLoaderData, useActionData, Form, redirect } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import { useState } from 'react';
import { DiscussionComment } from '~/models';
import { DiscussionThread } from '~/components/DiscussionThread';
import { UserMention } from '~/components/UserMention';

const prisma = new PrismaClient();

export const loader = async ({ params }: any) => {
  const projectId = params.projectId;
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      discussionComments: true,
    },
  });
  return json({ project });
};

export const action = async ({ request }: any) => {
  const formData = await request.formData();
  const projectId = formData.get('projectId');
  const commentText = formData.get('commentText');
  const parentId = formData.get('parentId');
  const userId = formData.get('userId');

  const newComment = await prisma.discussionComment.create({
    data: {
      text: commentText as string,
      projectId: projectId as string,
      parentId: parentId as string,
      userId: userId as string,
    },
  });

  return redirect(`/projects/${projectId}/discussion`);
};

export default function ProjectDiscussion() {
  const { project } = useLoaderData();
  const [newCommentText, setNewCommentText] = useState('');
  const [selectedParentComment, setSelectedParentComment] = useState(null);

  const handleCommentSubmit = (event: any) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('projectId', project.id);
    formData.append('commentText', newCommentText);
    formData.append('parentId', selectedParentComment?.id || null);
    formData.append('userId', 'currentUserId'); // Replace with actual user ID

    fetch('/projects/' + project.id + '/discussion', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  };

  const handleMentionClick = (userId: string) => {
    setNewCommentText(`@${userId} `);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Project Discussion</h1>
      <Form method="post">
        <textarea
          className="w-full p-4 border border-gray-300 rounded"
          value={newCommentText}
          onChange={(event) => setNewCommentText(event.target.value)}
          placeholder="Write a comment..."
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          type="submit"
          onClick={handleCommentSubmit}
        >
          Post Comment
        </button>
      </Form>
      <div className="mt-4">
        {project.discussionComments.map((comment) => (
          <DiscussionThread
            key={comment.id}
            comment={comment}
            onReplyClick={() => setSelectedParentComment(comment)}
          />
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">Mention Users</h2>
        <ul>
          {project.contributors.map((contributor) => (
            <li key={contributor.id}>
              <UserMention
                userId={contributor.id}
                username={contributor.username}
                onClick={() => handleMentionClick(contributor.id)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
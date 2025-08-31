import React, { useEffect, useState } from 'react';
import { Loader } from './Loader';
import { NewCommentForm } from './NewCommentForm';
import { Post } from '../types/Post';
import { client } from '../utils/fetchClient';
import { Comment } from '../types/Comment';

type Props = {
  postId: number;
  post?: Post | null;
};

export const PostDetails: React.FC<Props> = ({ postId, post: initialPost }) => {
  const [post, setPost] = useState<Post | null>(initialPost || null);
  const [postError, setPostError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const handleAddComment = (newComment: Comment) => {
    setComments(current => [...current, newComment]);
  };

  // const handleDeleteComment = (commentId: number) => {
  //   setComments(current => current.filter(c => c.id !== commentId));
  // };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await client.delete(`/comments/${commentId}`);
      setComments(current => current.filter(c => c.id !== commentId));
    } catch {
      alert('Failed to delete comment');
    }
  };

  useEffect(() => {
    setIsFormVisible(false);
    setComments([]);
    setIsLoadingComments(false);
    setCommentsError(null);

    if (!initialPost) {
      setIsLoadingPost(true);
      setPostError(null);

      client
        .get<Post>(`/posts/${postId}`)
        .then(setPost)
        .catch(() => setPostError('Failed to load post'))
        .finally(() => setIsLoadingPost(false));
    } else {
      setPost(initialPost);
      setIsLoadingPost(false);
    }
  }, [postId, initialPost]);

  useEffect(() => {
    setIsLoadingComments(true);
    setCommentsError(null);
    setIsFormVisible(false);

    client
      .get<Comment[]>(`/comments?postId=${postId}`)
      .then(setComments)
      .catch(() => setCommentsError('Failed to load comments'))
      .finally(() => setIsLoadingComments(false));
  }, [postId]);

  return (
    <div className="content" data-cy="PostDetails">
      {postError && <div className="notification is-danger">{postError}</div>}
      {isLoadingPost}

      <>
        <div className={`block ${!post ? 'is-hidden' : ''}`}>
          <h2 data-cy="PostTitle">
            #{post?.id ?? ''}: {post?.title ?? ''}
          </h2>
          <p data-cy="PostBody">{post?.body ?? ''}</p>
        </div>

        <div className="block">
          {isLoadingComments && <Loader />}

          {commentsError && (
            <div className="notification is-danger" data-cy="CommentsError">
              {commentsError}
            </div>
          )}

          {!isLoadingComments && !commentsError && comments.length === 0 && (
            <p className="title is-4" data-cy="NoCommentsMessage">
              No comments yet
            </p>
          )}

          {!isLoadingComments && comments.length > 0 && (
            <>
              <p className="title is-4">Comments:</p>

              {comments.map(comment => (
                <article
                  key={comment.id}
                  className="message is-small"
                  data-cy="Comment"
                >
                  <div className="message-header">
                    <a href={`mailto:${comment.email}`} data-cy="CommentAuthor">
                      {comment.name}
                    </a>
                    <button
                      data-cy="CommentDelete"
                      type="button"
                      className="delete is-small"
                      aria-label="delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      delete button
                    </button>
                  </div>

                  <div className="message-body" data-cy="CommentBody">
                    {comment.body}
                  </div>
                </article>
              ))}
            </>
          )}

          {!isFormVisible && !isLoadingComments && !commentsError && (
            <button
              data-cy="WriteCommentButton"
              type="button"
              className="button is-link"
              onClick={() => setIsFormVisible(true)}
            >
              Write a comment
            </button>
          )}
        </div>

        {isFormVisible && post && (
          <NewCommentForm postId={post.id} onAdd={handleAddComment} />
        )}
      </>
    </div>
  );
};

// <div className="content" data-cy="PostDetails">
//   <div className="content" data-cy="PostDetails">
//     <div className="block">
//       <h2 data-cy="PostTitle">
//         #18: voluptate et itaque vero tempora molestiae
//       </h2>

//       <p data-cy="PostBody">
//         eveniet quo quis laborum totam consequatur non dolor ut et est
//         repudiandae est voluptatem vel debitis et magnam
//       </p>
//     </div>

//     <div className="block">
//       <Loader />

//       <div className="notification is-danger" data-cy="CommentsError">
//         Something went wrong
//       </div>

//       <p className="title is-4" data-cy="NoCommentsMessage">
//         No comments yet
//       </p>

//       <p className="title is-4">Comments:</p>

//       <article className="message is-small" data-cy="Comment">
//         <div className="message-header">
//           <a href="mailto:misha@mate.academy" data-cy="CommentAuthor">
//             Misha Hrynko
//           </a>
//           <button
//             data-cy="CommentDelete"
//             type="button"
//             className="delete is-small"
//             aria-label="delete"
//           >
//             delete button
//           </button>
//         </div>

//         <div className="message-body" data-cy="CommentBody">
//           Some comment
//         </div>
//       </article>

//       <article className="message is-small" data-cy="Comment">
//         <div className="message-header">
//           <a href="mailto:misha@mate.academy" data-cy="CommentAuthor">
//             Misha Hrynko
//           </a>

//           <button
//             data-cy="CommentDelete"
//             type="button"
//             className="delete is-small"
//             aria-label="delete"
//           >
//             delete button
//           </button>
//         </div>
//         <div className="message-body" data-cy="CommentBody">
//           One more comment
//         </div>
//       </article>

//       <article className="message is-small" data-cy="Comment">
//         <div className="message-header">
//           <a href="mailto:misha@mate.academy" data-cy="CommentAuthor">
//             Misha Hrynko
//           </a>

//           <button
//             data-cy="CommentDelete"
//             type="button"
//             className="delete is-small"
//             aria-label="delete"
//           >
//             delete button
//           </button>
//         </div>

//         <div className="message-body" data-cy="CommentBody">
//           {'Multi\nline\ncomment'}
//         </div>
//       </article>

//       <button
//         data-cy="WriteCommentButton"
//         type="button"
//         className="button is-link"
//       >
//         Write a comment
//       </button>
//     </div>

//     <NewCommentForm />
//   </div>
// </div>

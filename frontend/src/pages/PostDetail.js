import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import postService from '../services/postService';
import commentService from '../services/commentService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { ConfirmDialog } from '../shared/components/ui';
import { showToast } from '../shared/components/feedback';

const PostDetail = () => {
  const { id } = useParams();

  const [postId, setPostId] = useState(null);
  const { user, isAuthenticated } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, commentId: null, loading: false });

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id, postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await postService.getPost(id);
      setPost(response.post);
      if(postId !== response.post._id) {
        setPostId(response.post._id);
      }
    } catch (err) {
      console.error('Failed to fetch post:', err);
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      if(!postId) return;
      const response = await commentService.getComments(postId);
      setComments(response.comments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitLoading(true);
      await commentService.createComment(postId, { content: newComment });
      setNewComment('');
      fetchComments();
      showToast.success('Comment posted successfully');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitLoading(false);
    }
  };

  const openDeleteConfirm = (commentId) => {
    setDeleteConfirm({ isOpen: true, commentId, loading: false });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, commentId: null, loading: false });
  };

  const handleDeleteComment = async () => {
    try {
      setDeleteConfirm(prev => ({ ...prev, loading: true }));
      await commentService.deleteComment(deleteConfirm.commentId);
      showToast.success('Comment deleted successfully');
      fetchComments();
      closeDeleteConfirm();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete comment');
      setDeleteConfirm(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ErrorMessage message={error} onRetry={fetchPost} />
    </div>
  );
  if (!post) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <article className="max-w-4xl mx-auto px-4">
        {/* Post Header */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="badge-primary">
              {post.category}
            </span>
            <span className={post.status === 'published' ? 'badge-success' : 'badge-warning'}>
              {post.status}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">{post.title}</h1>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center text-lg font-medium shadow-md">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-foreground">{post.author?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center text-muted-foreground">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {post.views || 0} views
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="card mb-8">
          <div className="prose max-w-none">
            <p className="text-foreground text-lg leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge-neutral"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="card">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {isAuthenticated() ? (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows="4"
                className="input-field resize-none"
              />
              <button
                type="submit"
                disabled={submitLoading || !newComment.trim()}
                className="mt-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="mb-8 p-4 bg-muted rounded-lg text-center">
              <p className="text-muted-foreground">
                <Link to="/login" className="link">
                  Login
                </Link>
                {' '}to post a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md">
                        {comment.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{comment.author?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {(user?._id === comment.author?._id || user?.role === 'admin') && (
                      <button
                        onClick={() => openDeleteConfirm(comment._id)}
                        className="text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 text-sm transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-foreground ml-10">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteComment}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteConfirm.loading}
      />
    </div>
  );
};

export default PostDetail;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import postService from '../services/postService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import { Card, Badge, Button, Modal } from '../shared/components/ui';
import { showToast } from '../shared/components/feedback';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null, postTitle: '' });

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = { page, limit: 10 };
      if (filter !== 'all') params.status = filter;

      const response = await postService.getMyPosts(params);
      setPosts(response.posts);
      setPagination({ pages: response.pages, total: response.total });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (isAdmin()) {
      try {
        const response = await postService.getPostStats();
        setStats(response.stats);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    }
  };

  useEffect(() => {
    fetchMyPosts();
    fetchStats();
  }, [filter, page]);

  const handleDelete = async (postId) => {
    try {
      await postService.deletePost(postId);
      showToast.success('Post deleted successfully');
      setDeleteModal({ isOpen: false, postId: null, postTitle: '' });
      fetchMyPosts();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const openDeleteModal = (post) => {
    setDeleteModal({ isOpen: true, postId: post._id, postTitle: post.title });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                Welcome back, <span className="font-semibold text-foreground">{user?.name}</span>!
                <Badge variant="primary" className="capitalize">{user?.role}</Badge>
              </p>
            </div>
            <Button
              onClick={() => navigate('/posts/new')}
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Create New Post
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards (Admin Only) */}
        {isAdmin() && stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <StatCard
              title="Total Posts"
              value={stats.totalPosts}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              }
              gradient="from-primary-500 to-primary-700"
            />
            <StatCard
              title="Published"
              value={stats.publishedPosts}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              gradient="from-success-500 to-success-700"
            />
            <StatCard
              title="Drafts"
              value={stats.draftPosts}
              icon={
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
              gradient="from-warning-500 to-warning-700"
            />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Filter Posts
          </h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-card text-foreground border border-border hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              All Posts
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'published'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-card text-foreground border border-border hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              Published
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter('draft')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'draft'
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-card text-foreground border border-border hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              Drafts
            </motion.button>
          </div>
        </motion.div>

        {/* Posts List */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchMyPosts} />
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {filter === 'all' ? "No posts yet" : `No ${filter} posts found`}
              </h3>
              <p className="text-muted-foreground mb-6">
                {filter === 'all' ? "Start creating amazing content today!" : `Try changing your filter.`}
              </p>
              {filter === 'all' && (
                <Button onClick={() => navigate('/posts/new')}>
                  Create Your First Post
                </Button>
              )}
            </Card>
          </motion.div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                          <Link to={`/posts/${post.slug || post._id}`}>
                            <h3 className="text-xl font-bold hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              {post.title}
                            </h3>
                          </Link>
                          <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                            {post.status}
                          </Badge>
                          <Badge variant="neutral">{post.category}</Badge>
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt || post.content.substring(0, 150) + '...'}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.views || 0} views
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/posts/edit/${post._id}`)}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          }
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => openDeleteModal(post)}
                          icon={
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, postId: null, postTitle: '' })}
        title="Delete Post"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ isOpen: false, postId: null, postTitle: '' })}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(deleteModal.postId)}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-muted-foreground">
          Are you sure you want to delete <span className="font-semibold text-foreground">"{deleteModal.postTitle}"</span>?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, gradient }) => (
  <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ duration: 0.2 }}>
    <Card className={`bg-gradient-to-br ${gradient} text-white border-0 shadow-lg relative overflow-hidden`}>
      <div className="absolute top-0 right-0 opacity-10 transform translate-x-4 -translate-y-4">
        <div className="w-32 h-32">
          {icon}
        </div>
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-medium opacity-90 mb-2">{title}</h3>
        <p className="text-5xl font-extrabold">{value}</p>
      </div>
    </Card>
  </motion.div>
);

export default Dashboard;

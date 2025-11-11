import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePosts } from '../hooks/usePost';
import { usePagination } from '../hooks/usePagination';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import { Card, Badge, Button } from '../shared/components/ui';
import { SkeletonCard } from '../shared/components/feedback/Skeleton';

const Home = () => {
  const { page, limit, setPage } = usePagination(1, 9);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { posts, pagination, loading, error, refetch } = usePosts({
    page,
    limit,
    search: searchQuery,
    category,
    status: 'published'
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(search);
    setPage(1);
  };

  const categories = ['Technology', 'Business', 'Lifestyle', 'Health', 'Education', 'Other'];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Modern Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 bg-grid opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="relative container-custom py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-balance"
            >
              Discover Amazing{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                Stories
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-10 text-white/90 text-balance"
            >
              Explore insights, ideas, and inspiration from our community of writers
            </motion.p>

            {/* Search Bar with Modern Design */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto"
            >
              <div className="glass-card p-2 flex gap-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for posts..."
                  className="flex-1 px-6 py-3 bg-transparent text-white placeholder:text-white/60 focus:outline-none"
                />
                <Button
                  type="submit"
                  className="bg-white text-primary-600 hover:bg-white/90 font-semibold shadow-lg"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                >
                  Search
                </Button>
              </div>
            </motion.form>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(var(--background))"
            />
          </svg>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Filter Section with Modern Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            Filter by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCategory(''); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === ''
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-card text-foreground border border-border hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              All
            </motion.button>
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-card text-foreground border border-border hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Posts Grid with Modern Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={error} onRetry={refetch} />
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card hover className="h-full flex flex-col group">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="primary">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>

                    {/* Post Title */}
                    <Link to={`/posts/${post.slug || post._id}`}>
                      <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Post Excerpt */}
                    <p className="text-muted-foreground mb-4 line-clamp-3 flex-grow">
                      {post.excerpt || post.content.substring(0, 150) + '...'}
                    </p>

                    {/* Post Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div className="flex items-center space-x-2">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-secondary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {post.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{post.author?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.views || 0}
                      </div>
                    </div>
                  </Card>
                </motion.article>
              ))}
            </div>

            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;

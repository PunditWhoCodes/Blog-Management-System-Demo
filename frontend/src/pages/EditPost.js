import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import postService from '../services/postService';
import { useForm } from '../hooks/useForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(true);

  const validate = (values) => {
    const errors = {};
    if (!values.title || values.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    }
    if (!values.content || values.content.trim().length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }
    return errors;
  };

  const handleSubmit = async (values) => {
    try {
      setServerError('');
      // Convert tags string to array if needed
      const postData = {
        ...values,
        tags: typeof values.tags === 'string'
          ? values.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : values.tags
      };
      const response = await postService.updatePost(id, postData);
      navigate(`/posts/${response.post.slug || response.post._id}`);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to update post');
      throw error;
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit: onSubmit, setFormValues } = useForm(
    {
      title: '',
      content: '',
      excerpt: '',
      category: 'Other',
      status: 'draft',
      tags: ''
    },
    handleSubmit,
    validate
  );

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postService.getPost(id);
        const post = response.post;
        setFormValues({
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || '',
          category: post.category,
          status: post.status,
          tags: Array.isArray(post.tags) ? post.tags.join(', ') : ''
        });
      } catch (error) {
        setServerError(error.response?.data?.message || 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const categories = ['Technology', 'Business', 'Lifestyle', 'Health', 'Education', 'Other'];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-2">Make changes to your post</p>
        </div>

        <form onSubmit={onSubmit} className="card">
          {serverError && <ErrorMessage message={serverError} />}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                className={`input-field ${errors.title ? 'border-danger-500' : ''}`}
                placeholder="Enter your post title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
                Excerpt (optional)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={values.excerpt}
                onChange={handleChange}
                rows="2"
                className="input-field resize-none"
                placeholder="Brief summary of your post"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={values.content}
                onChange={handleChange}
                rows="12"
                className={`input-field resize-none ${errors.content ? 'border-danger-500' : ''}`}
                placeholder="Write your post content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.content}</p>
              )}
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={values.tags}
                onChange={handleChange}
                className="input-field"
                placeholder="react, javascript, web development"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;

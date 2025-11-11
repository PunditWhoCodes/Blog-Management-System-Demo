import { useState, useEffect } from 'react';
import postService from '../services/postService';

export const usePost = (postId) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPost(postId);
      setPost(response.post);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  return { post, loading, error, refetch: fetchPost };
};

export const usePosts = (params = {}) => {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postService.getPosts(queryParams);
      setPosts(response.posts);
      setPagination({
        page: response.page,
        pages: response.pages,
        total: response.total
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(params);
  }, [JSON.stringify(params)]);

  return { posts, pagination, loading, error, refetch: fetchPosts };
};

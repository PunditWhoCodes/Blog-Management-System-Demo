const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  getMyPosts,
  getPostStats
} = require('../controllers/postController');
const { protect, authorize, isAdmin } = require('../middleware/auth');
const {
  postValidation,
  idValidation,
  paginationValidation,
  validate
} = require('../middleware/validator');

const commentRoutes = require('./commentRoutes');
router.use('/:postId/comments', commentRoutes);

router.get('/', paginationValidation, validate, getPosts);
router.get('/:id', getPost);

router.use(protect);

router.get('/my/posts', paginationValidation, validate, getMyPosts);
router.post('/', postValidation, validate, createPost);
router.put('/:id', idValidation, postValidation, validate, updatePost);
router.delete('/:id', idValidation, validate, deletePost);

router.get('/admin/stats', isAdmin, getPostStats);

module.exports = router;

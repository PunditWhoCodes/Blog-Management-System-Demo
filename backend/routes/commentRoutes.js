const express = require('express');
const router = express.Router({ mergeParams: true }); 
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  approveComment
} = require('../controllers/commentController');
const { protect, isAdmin } = require('../middleware/auth');
const {
  commentValidation,
  idValidation,
  paginationValidation,
  validate
} = require('../middleware/validator');

router.get('/', paginationValidation, validate, getComments);

router.use(protect);

router.post('/', commentValidation, validate, createComment);
router.put('/:id', idValidation, commentValidation, validate, updateComment);
router.delete('/:id', idValidation, validate, deleteComment);

router.put('/:id/approve', idValidation, isAdmin, approveComment);

module.exports = router;

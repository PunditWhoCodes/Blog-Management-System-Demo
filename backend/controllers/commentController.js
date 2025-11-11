const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose = require('mongoose');

exports.getComments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { postId } = req.params;

    const query = {
      post: postId,
      isDeleted: false,
      isApproved: true
    };

    const comments = await Comment.find(query)
      .populate('author', 'name avatar')
      .populate({
        path: 'parentComment',
        select: 'content author',
        populate: { path: 'author', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      comments
    });
  } catch (error) {
    next(error);
  }
};

exports.createComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Cannot comment on draft posts'
      });
    }

    const comment = await Comment.create({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId,
      parentComment: req.body.parentComment || null
    });

    await comment.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    let comment = await Comment.findById(req.params.id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    if (!comment.canModify(req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    comment.content = req.body.content || comment.content;
    await comment.save();

    await comment.populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Comment updated successfully',
      comment
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (!comment.canModify(req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    comment.isDeleted = true;
    await comment.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.approveComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    comment.isApproved = req.body.isApproved;
    await comment.save();

    res.status(200).json({
      success: true,
      message: `Comment ${req.body.isApproved ? 'approved' : 'rejected'} successfully`,
      comment
    });
  } catch (error) {
    next(error);
  }
};

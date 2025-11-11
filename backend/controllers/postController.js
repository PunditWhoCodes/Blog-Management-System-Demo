const Post = require('../models/Post');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isDeleted: false };

    if (!req.user || req.user.role !== 'admin') {
      query.status = 'published';
    }

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.author) {
      query.author = req.query.author;
    }

    if (req.query.status && req.user) {
      query.status = req.query.status;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    next(error);
  }
};

exports.getPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

    const post = await Post.findOne({
      isDeleted: false,
      ...(isValidObjectId ? { _id: id } : { slug: id })
    }).populate('author', 'name email avatar bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (post.status === 'draft') {
      const token = req.headers.authorization?.split(' ')[1] || null;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user || (req.user.role !== 'admin' && post.author._id.toString() !== req.user._id.toString())) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to view this draft post'
          });
        }
      } else {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view this draft post'
        });
      }
    }

    if (post.status === 'published') {
      await post.incrementViews();
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  try {
    req.body.author = req.user._id;

    const post = await Post.create(req.body);

    await post.populate('author', 'name email avatar bio');

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.canEdit(req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }

    delete req.body.author;

    post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('author', 'name email avatar bio');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    if (!post.canEdit(req.user._id, req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }

    post.isDeleted = true;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const isAdmin = req.user.role === 'admin';

    const query = {
      isDeleted: false,
      ...(isAdmin ? {} : { author: req.user._id })
    };

    if (req.query.status) {
      query.status = req.query.status;
    }

    const posts = await Post.find(query)
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      posts
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostStats = async (req, res, next) => {
  try {
    const totalPosts = await Post.countDocuments({ isDeleted: false });
    const publishedPosts = await Post.countDocuments({ status: 'published', isDeleted: false });
    const draftPosts = await Post.countDocuments({ status: 'draft', isDeleted: false });

    const topPosts = await Post.find({ status: 'published', isDeleted: false })
      .sort({ views: -1 })
      .limit(5)
      .populate('author', 'name email');

    res.status(200).json({
      success: true,
      stats: {
        totalPosts,
        publishedPosts,
        draftPosts,
        topPosts
      }
    });
  } catch (error) {
    next(error);
  }
};

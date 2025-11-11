const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    minlength: [1, 'Comment must be at least 1 character'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isApproved: {
    type: Boolean,
    default: true 
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

commentSchema.methods.canModify = function(userId, userRole) {
  if (userRole === 'admin') return true;
  return this.author.toString() === userId.toString();
};

module.exports = mongoose.model('Comment', commentSchema);

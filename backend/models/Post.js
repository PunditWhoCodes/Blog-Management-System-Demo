const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters']
  },
  excerpt: {
    type: String,
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  featuredImage: {
    type: String,
    default: null
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  category: {
    type: String,
    enum: ['Technology', 'Business', 'Lifestyle', 'Health', 'Education', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

postSchema.index({ author: 1, status: 1 });
postSchema.index({ title: 'text', content: 'text' }); 

postSchema.pre('save', async function(next) {
  if (this.isModified('title') && !this.slug) {
    let slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    let slugExists = await this.constructor.findOne({ slug });
    let counter = 1;

    while (slugExists) {
      slug = `${slug}-${counter}`;
      slugExists = await this.constructor.findOne({ slug });
      counter++;
    }

    this.slug = slug;
  }

  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

postSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

postSchema.methods.canEdit = function(userId, userRole) {
  if (userRole === 'admin') return true;
  return this.author.toString() === userId.toString();
};

module.exports = mongoose.model('Post', postSchema);

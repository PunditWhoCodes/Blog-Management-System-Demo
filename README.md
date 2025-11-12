# Blog Management System

A modern, full-stack blog management application built with React and Express. This platform enables users to create, manage, and interact with blog posts through an intuitive interface with real-time commenting functionality.

## Live Demo

**[View Live Demo](https://blog-management-system-demo-1h9b.vercel.app/)**

Try out the application with full functionality including user authentication, post creation, and commenting features.

## Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control (Admin/User)
  - Protected routes and API endpoints

- **Blog Post Management**
  - Create, read, update, and delete posts
  - Rich post editor with category and tag support
  - Draft and publish functionality
  - Post view tracking

- **Interactive Comments**
  - Real-time commenting system
  - Comment moderation (delete own comments or admin privileges)
  - Nested discussion threads

- **User Dashboard**
  - Personal post management
  - Analytics and statistics
  - User profile management

- **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Smooth animations with Framer Motion
  - Toast notifications for user feedback
  - Loading states and error handling

## Tech Stack

### Frontend
- **React** 19.2.0 - UI library
- **React Router DOM** 7.9.5 - Client-side routing
- **Tailwind CSS** 3.4.18 - Utility-first CSS framework
- **Axios** 1.13.2 - HTTP client
- **Framer Motion** 12.23.24 - Animation library
- **React Hot Toast** 2.6.0 - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express** 4.18.2 - Web framework
- **MongoDB** - Database
- **Mongoose** 8.0.0 - ODM for MongoDB
- **JWT** 9.0.2 - Authentication
- **bcryptjs** 2.4.3 - Password hashing
- **Express Validator** 7.0.1 - Input validation
- **Morgan** 1.10.0 - HTTP request logger
- **CORS** 2.8.5 - Cross-origin resource sharing

## Project Structure

```
web_cube/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── contexts/        # React context providers
│       ├── hooks/           # Custom React hooks
│       ├── pages/           # Page components
│       │   ├── Home.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── Dashboard.js
│       │   ├── CreatePost.js
│       │   ├── EditPost.js
│       │   └── PostDetail.js
│       ├── providers/       # State management
│       ├── services/        # API service layer
│       ├── shared/          # Shared utilities and components
│       └── utils/           # Utility functions
│
└── backend/                 # Express backend application
    ├── config/              # Configuration files
    ├── controllers/         # Route controllers
    ├── middleware/          # Custom middleware
    ├── models/              # Mongoose models
    ├── routes/              # API routes
    │   ├── authRoutes.js
    │   ├── postRoutes.js
    │   └── commentRoutes.js
    ├── utils/               # Utility functions
    └── server.js            # Entry point
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (v4.4 or higher)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/PunditWhoCodes/Blog-Management-System-Demo
cd web_cube
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# Edit the .env file with your database credentials and JWT secret
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API URL if different from default
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://localhost:27017/blog-management

JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:3000
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend application will start on `http://localhost:3000`

### Production Mode

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend in Production

```bash
cd backend
NODE_ENV=production npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (authenticated)
- `PUT /api/posts/:id` - Update post (authenticated)
- `DELETE /api/posts/:id` - Delete post (authenticated)

### Comments
- `GET /api/comments/:postId` - Get post comments
- `POST /api/comments/:postId` - Create comment (authenticated)
- `DELETE /api/comments/:id` - Delete comment (authenticated)

### Health Check
- `GET /health` - Server health status

## Testing

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

## Code Standards

- Follow ESLint configuration for code style
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused
- Use proper error handling

## Security Considerations

- Environment variables are not committed to version control
- Passwords are hashed using bcryptjs
- JWT tokens for stateless authentication
- Input validation on all endpoints
- CORS configuration for controlled access
- Rate limiting recommended for production

## License

MIT

## Author

Nawal Rai

## Support

For support, please open an issue in the repository or contact the maintainers.

## Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB team
- All open-source contributors

---

**Note:** This project is under active development. Features and documentation are subject to change.

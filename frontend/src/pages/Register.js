import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from '../hooks/useForm';
import ErrorMessage from '../components/ErrorMessage';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const validate = (values) => {
    const errors = {};

    if (!values.name || values.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  const handleRegister = async (values) => {
    try {
      setServerError('');
      const { confirmPassword, ...userData } = values;
      await register(userData);
      navigate('/dashboard');
    } catch (error) {
      setServerError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'author'
    },
    handleRegister,
    validate
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {serverError && <ErrorMessage message={serverError} />}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                className={`input-field ${errors.name ? 'border-danger-500' : ''}`}
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={handleChange}
                className={`input-field ${errors.email ? 'border-danger-500' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.email}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground mb-1">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="author">Author</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={values.password}
                onChange={handleChange}
                className={`input-field ${errors.password ? 'border-danger-500' : ''}`}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={handleChange}
                className={`input-field ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

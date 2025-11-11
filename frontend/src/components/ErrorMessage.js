import React from 'react';

const ErrorMessage = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="bg-danger-50 dark:bg-danger-950 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium hover:text-danger-800 dark:hover:text-danger-200 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;

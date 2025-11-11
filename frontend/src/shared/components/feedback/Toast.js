import toast from 'react-hot-toast';

const toastConfig = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: 'var(--background)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  success: {
    iconTheme: {
      primary: '#22c55e',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

export const showToast = {
  success: (message, options = {}) => {
    toast.success(message, { ...toastConfig, ...options });
  },
  error: (message, options = {}) => {
    toast.error(message, { ...toastConfig, ...options });
  },
  loading: (message, options = {}) => {
    return toast.loading(message, { ...toastConfig, ...options });
  },
  dismiss: (toastId) => {
    toast.dismiss(toastId);
  },
  promise: (promise, messages, options = {}) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      { ...toastConfig, ...options }
    );
  },
};

export default showToast;

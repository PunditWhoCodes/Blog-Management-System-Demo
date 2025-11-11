import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  variant = 'default',
  hover = false,
  className = '',
  onClick,
  ...props
}) => {
  const variantClasses = {
    default: 'card',
    flat: 'card-flat',
    glass: 'glass-card',
  };

  const baseClass = hover ? 'card-hover' : variantClasses[variant];
  const classes = `${baseClass} ${className}`.trim();

  const CardComponent = onClick || hover ? motion.div : 'div';
  const motionProps = onClick || hover ? {
    whileHover: { y: -4 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardComponent
      className={classes}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

export default Card;

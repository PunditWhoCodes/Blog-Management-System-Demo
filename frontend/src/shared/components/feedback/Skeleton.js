import React from 'react';

export const Skeleton = ({ className = '', width, height, circle = false }) => {
  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`skeleton ${circle ? 'rounded-full' : ''} ${className}`}
      style={style}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start gap-4">
        <Skeleton circle width={48} height={48} />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5" width="60%" />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;

import React from 'react';

export const SkeletonListingCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-sand/50">
      {/* Image Container Skeleton */}
      <div className="relative aspect-[4/3] bg-gray-200 animate-pulse">
         <div className="absolute top-3 left-3 w-20 h-6 bg-gray-300 rounded-full opacity-50" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="h-5 bg-gray-200 rounded-md w-3/5 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded-md w-1/5 animate-pulse" />
        </div>
        
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse" />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          <div className="h-3 bg-gray-200 rounded w-10 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
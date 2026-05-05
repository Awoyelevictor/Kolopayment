import { motion } from 'motion/react';
import React from 'react';

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={`bg-slate-200 rounded-xl ${className}`}
    />
  );
}

export function HomeDashboardSkeleton() {
  return (
    <div className="px-6 pt-10 pb-12 w-full max-w-lg mx-auto xl:max-w-none">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <SkeletonLoader className="h-6 w-32" />
          <SkeletonLoader className="h-8 w-40" />
        </div>
        <SkeletonLoader className="h-12 w-12 rounded-full" />
      </div>

      {/* Balance Card Skeleton */}
      <SkeletonLoader className="h-44 w-full rounded-3xl mb-10" />

      {/* Next Payment Skeleton */}
      <div className="mb-8">
        <SkeletonLoader className="h-5 w-32 mb-4" />
        <SkeletonLoader className="h-28 w-full rounded-3xl" />
      </div>

      {/* Active Groups Skeleton */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <SkeletonLoader className="h-5 w-24" />
          <SkeletonLoader className="h-4 w-12 text-xs" />
        </div>
        
        <div className="space-y-4">
          <SkeletonLoader className="h-24 w-full rounded-2xl" />
          <SkeletonLoader className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

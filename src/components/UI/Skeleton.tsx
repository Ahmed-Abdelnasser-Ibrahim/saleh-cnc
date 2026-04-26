import React from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-white/5 rounded-2xl ${className}`} 
      aria-hidden="true"
    />
  );
};

export const ProductSkeleton = () => {
  return (
    <div className="bg-[#111111] rounded-3xl p-4 border border-white/5 h-full flex flex-col gap-4">
      <Skeleton className="aspect-square w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-3/4" />
      <div className="mt-auto flex justify-between items-center">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
    </div>
  );
};

export const CategorySkeleton = () => {
  return (
    <div className="h-64 rounded-3xl overflow-hidden relative">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

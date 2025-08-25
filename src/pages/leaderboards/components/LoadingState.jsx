import React from 'react';
import Icon from '../../../components/AppIcon';

const LoadingState = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-muted rounded-lg w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-muted rounded-lg w-96 animate-pulse"></div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-2 mb-6">
          {[1, 2, 3, 4]?.map((i) => (
            <div key={i} className="h-10 bg-muted rounded-lg w-24 animate-pulse"></div>
          ))}
        </div>

        {/* Filter Skeleton */}
        <div className="mb-6">
          <div className="h-10 bg-muted rounded-lg w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-8">
            {/* Podium Skeleton */}
            <div className="bg-card rounded-lg p-6 border border-border mb-8">
              <div className="h-6 bg-muted rounded-lg w-48 mx-auto mb-6 animate-pulse"></div>
              <div className="flex items-end justify-center space-x-4 mb-6">
                {[1, 2, 3]?.map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-muted rounded-full mb-3 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-16 mb-2 animate-pulse"></div>
                    <div className={`w-20 bg-muted rounded-t-lg animate-pulse ${
                      i === 2 ? 'h-20' : i === 1 ? 'h-28' : 'h-16'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="p-4 bg-muted">
                <div className="h-4 bg-background rounded w-full animate-pulse"></div>
              </div>
              <div className="divide-y divide-border">
                {[1, 2, 3, 4, 5]?.map((i) => (
                  <div key={i} className="p-4 flex items-center space-x-4">
                    <div className="h-4 bg-muted rounded w-8 animate-pulse"></div>
                    <div className="w-10 h-10 bg-muted rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-32 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-12 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            {/* Personal Stats Skeleton */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-muted rounded-full animate-pulse"></div>
                <div>
                  <div className="h-6 bg-muted rounded w-32 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4]?.map((i) => (
                  <div key={i} className="bg-background rounded-lg p-4 border border-border">
                    <div className="h-4 bg-muted rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-6 bg-muted rounded w-16 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Skeleton */}
            <div className="bg-card rounded-lg border border-border p-6">
              <div className="h-6 bg-muted rounded w-40 mb-4 animate-pulse"></div>
              <div className="h-64 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="fixed bottom-8 right-8 bg-primary text-primary-foreground p-4 rounded-full shadow-modal">
          <Icon name="Loader2" size={24} className="animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
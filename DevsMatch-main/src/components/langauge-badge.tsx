'use client';

import { cn } from '@/lib/utils';

interface LanguageBadgeProps {
  name: string;
  color?: string;
  percentage?: number;
  className?: string;
}

export function LanguageBadge({ 
  name, 
  color = '#6b7280', 
  percentage, 
  className 
}: LanguageBadgeProps) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium mr-2 mb-2",
      className
    )}
    style={{ 
      backgroundColor: `${color}20`,  // Use color with 20% opacity for background
      borderColor: color,
      color: color
    }}>
      <span className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: color }} />
      <span className="font-medium">{name}</span>
      {percentage !== undefined && (
        <span className="ml-1 opacity-70">{percentage}%</span>
      )}
    </div>
  );
}
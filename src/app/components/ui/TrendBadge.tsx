"use client";

import { TrendingUp, TrendingDown, Equal } from "lucide-react";
import { Trend } from "types/entities"

interface TrendBadgeProps {
  trend: Trend;
  percentage?: number;
  integer?: number;
}

export const trendConfig = {
  up: {
    icon: TrendingUp,
    className: "text-green-600 bg-green-50",
    sign: "+",
  },
  down: {
    icon: TrendingDown,
    className: "text-red-600 bg-red-50",
    sign: "",
  },
  same: {
    icon: Equal,
    className: "text-gray-500 bg-gray-100",
    sign: "=",
  },
} as const;

export function TrendBadge({ trend, percentage, integer }: TrendBadgeProps) {
  const { icon: Icon, className, sign } = trendConfig[trend];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium mt-2 ${className}`}
    >
      <Icon className="h-3 w-3" />
      {sign}
      {percentage && `${percentage}% vs. mes anterior`}
      {integer && `${integer} nuevos`}
    </span>
  );
}

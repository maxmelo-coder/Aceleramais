import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; label: string };
  icon?: React.ReactNode;
  color?: 'blue' | 'orange' | 'green' | 'red' | 'purple' | 'gray';
  accent?: boolean;
}

const colorMap = {
  blue: { bg: 'bg-[#EBF6F7]', icon: 'bg-[#2E8C99]', text: 'text-[#2E8C99]' },
  orange: { bg: 'bg-[#FEF3E2]', icon: 'bg-[#F48B1B]', text: 'text-[#F48B1B]' },
  green: { bg: 'bg-green-50', icon: 'bg-green-500', text: 'text-green-600' },
  red: { bg: 'bg-red-50', icon: 'bg-red-500', text: 'text-red-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
  gray: { bg: 'bg-gray-50', icon: 'bg-gray-400', text: 'text-gray-500' },
};

export default function StatCard({ title, value, subtitle, trend, icon, color = 'blue', accent }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 ${accent ? 'ring-2 ring-[#F48B1B]/30' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
          <p className="mt-1.5 text-2xl font-bold text-gray-900 leading-none">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${c.icon} p-2.5 rounded-xl text-white flex-shrink-0 ml-3`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  trend: string;
  subtitle: string;
  description?: string;
  icon: LucideIcon;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  trend, 
  subtitle, 
  description, 
  icon: Icon 
}) => {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';
  
  return (
    <Card className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-50">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600">{title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isPositive && <TrendingUp className="w-4 h-4 text-green-600" />}
            {isNegative && <TrendingDown className="w-4 h-4 text-red-600" />}
            <span className={`text-sm font-medium ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">{trend}</span>
            <TrendingUp className="w-3 h-3 text-gray-400" />
          </div>
          <div className="text-sm text-gray-500">{subtitle}</div>
          {description && <div className="text-sm text-gray-500">{description}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
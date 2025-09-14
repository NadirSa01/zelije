import React from 'react';
import {  BarChart3, DollarSign,  } from 'lucide-react';
import { useGetMetricsQuery } from '@/services/charts/chartsApi';
import MetricCard from './cardsChart';
import { AlertCircle } from 'lucide-react';

interface DashboardMetricsProps {
  startDate: Date;
  endDate: Date;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ 
  startDate, 
  endDate 
}) => {
  const { data, isLoading, isError, refetch } = useGetMetricsQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  console.log(data);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg p-6 h-40">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gray-300 rounded-lg"></div>
                  <div className="w-24 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="w-12 h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="w-32 h-3 bg-gray-300 rounded"></div>
                <div className="w-28 h-3 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg mb-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">Failed to load metrics</p>
            <p className="text-sm text-gray-500">Please try refreshing the data</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const total = data.productIncome+data.serviceIncome
  const metricsConfig = [
    {
      key: 'totalRevenue',
      title: 'Total Revenue',
      icon: DollarSign,
      data: total.toString()

    },
    {
      key: 'totalOrders',
      title: 'Total Orders',
      icon: BarChart3,
      data: data.productIncome.toString()
    },
    {
      key: 'totalService',
      title: 'Total Service',
      icon: BarChart3,
      data: data.productIncome.toString()
    },

  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {metricsConfig.map((metric) => (
        <MetricCard
          key={metric.key}
          title={metric.title}
          value={metric.data.value}
        //   change={metric.data.change}
        //   changeType={metric.data.changeType}
        //   trend={metric.data.trend}
        //   subtitle={metric.data.subtitle}
          icon={metric.icon}
        />
      ))}
    </div>
  );
};

export default DashboardMetrics;
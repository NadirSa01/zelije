import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useGetChartQuery } from "@/services/charts/chartsApi";
import DashboardMetrics from "./dashbordMatrice"; // Import the DashboardMetrics component

// TypeScript interfaces
interface ChartDataItem {
  _id: string;
  count: number;
}

interface ApiResponse {
  orders: ChartDataItem[];
  services: ChartDataItem[];
}

interface TransformedDataItem {
  period: string;
  orders: number;
  services: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const OrdersServicesChart: React.FC = () => {
  const today = new Date();

  const [startDate, setStartDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0)
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    )
  );
  const [period, setPeriod] = useState<string>("Today");

  const { data, isLoading, isError, refetch } = useGetChartQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  
 const handlePeriodChange = (value: string) => {
    setPeriod(value);

    const now = new Date();
    let start: Date;
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    switch (value) {
      case "Today":
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        break;

      case "This Week": {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        start = firstDayOfWeek;
        break;
      }

      case "This Month":
        start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
        break;

      default:
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }

    setStartDate(start);
    setEndDate(end);
  };

  // Function to transform your API data into chart format
  const transformApiData = (
    apiResponse: ApiResponse
  ): TransformedDataItem[] => {
    const { orders, services } = apiResponse;

    const periodMap = new Map<string, TransformedDataItem>();

    orders.forEach((order) => {
      periodMap.set(order._id, {
        period: order._id,
        orders: order.count,
        services: 0,
      });
    });

    services.forEach((service) => {
      if (periodMap.has(service._id)) {
        periodMap.get(service._id)!.services = service.count;
      } else {
        periodMap.set(service._id, {
          period: service._id,
          orders: 0,
          services: service.count,
        });
      }
    });

    return Array.from(periodMap.values()).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  };

  const chartData = useMemo(() => {
    if (!data) return [];
    return transformApiData(data);
  }, [data]);

  const totalOrders = chartData.reduce((sum, item) => sum + item.orders, 0);
  const totalServices = chartData.reduce((sum, item) => sum + item.services, 0);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-gray-500">Loading chart data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Failed to load data</p>
              <p className="text-sm text-gray-500">
                Please try refreshing the page
              </p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600">Orders and Services Overview</p>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Live Data</span>
          </div>
        </div>

        {/* METRICS CARDS INTEGRATION - Replace the empty div */}
        <DashboardMetrics 
          startDate={startDate} 
          endDate={endDate} 
        />

        {/* Date Range Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">From:</label>
            <input
              type="date"
              value={startDate.toISOString().split("T")[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">To:</label>
            <input
              type="date"
              value={endDate.toISOString().split("T")[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Quick Range:
            </label>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalOrders}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Total Services
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {totalServices}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Orders & Services Chart
            </h3>
            <p className="text-sm text-gray-600">
              {period.charAt(0).toUpperCase() + period.slice(1)} comparison
              showing growth trends
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Showing {chartData.length} data points
          </div>
        </div>

        <div className="h-80">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">No data available</p>
                <p className="text-gray-400 text-sm">
                  Try adjusting your date range or period selection
                </p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="period"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="services"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                  name="Services"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Data refreshed automatically</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersServicesChart;
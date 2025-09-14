import { DataTable } from "./dataTable";
import { getColumns } from "./columns";
import { Package, Calendar, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useDeleteOrderMutation } from "@/services/orders/orderApi";
import { useEffect, useState } from "react";
import { useGetOrderServicesQuery } from "@/services/serviceOrders/serviceOrder";

function OrderServiceTable() {
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [filteredOrders, setFilteredOrders] = useState([]);
  const { data, isLoading, isError, refetch } = useGetOrderServicesQuery();
  
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Filter orders based on date range
  useEffect(() => {
    if (data?.orders) {
      let filtered = data.orders;

      if (dateFilter.startDate || dateFilter.endDate) {
        filtered = data.orders.filter((order) => {
          // Fixed: Access createdAt directly from order object
          const orderDate = new Date(order.createdAt);
          const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
          const endDate = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

          // Set start date to beginning of day for proper comparison
          if (startDate) {
            startDate.setHours(0, 0, 0, 0);
          }

          // Set end date to end of day for proper comparison
          if (endDate) {
            endDate.setHours(23, 59, 59, 999);
          }

          if (startDate && endDate) {
            return orderDate >= startDate && orderDate <= endDate;
          } else if (startDate) {
            return orderDate >= startDate;
          } else if (endDate) {
            return orderDate <= endDate;
          }
          return true;
        });
      }

      setFilteredOrders(filtered);
    } else {
      setFilteredOrders([]);
    }
  }, [data, dateFilter]);

  const [deleteOrder] = useDeleteOrderMutation();

  const onDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await deleteOrder(id)
        .unwrap()
        .then(() => {
          toast.success("Order deleted successfully");
          refetch();
        })
        .catch((err) => {
          console.error("Error deleting order:", err);
          toast.error("Failed to delete order");
        });
    }
  };

  const columns = getColumns(onDelete);

  const handleDateFilterChange = (field: "startDate" | "endDate", value: string) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearDateFilter = () => {
    setDateFilter({
      startDate: "",
      endDate: "",
    });
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getThisWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
    
    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0]
    };
  };

  const getThisMonthDates = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return {
      start: startOfMonth.toISOString().split('T')[0],
      end: endOfMonth.toISOString().split('T')[0]
    };
  };

  const setQuickDateFilter = (type: "today" | "week" | "month") => {
    const today = getTodayDate();
    const week = getThisWeekDates();
    const month = getThisMonthDates();

    switch (type) {
      case "today":
        setDateFilter({ startDate: today, endDate: today });
        break;
      case "week":
        setDateFilter({ startDate: week.start, endDate: week.end });
        break;
      case "month":
        setDateFilter({ startDate: month.start, endDate: month.end });
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>

          {/* Filter Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4 mb-4"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </div>
            <div className="p-6">
              <div className="h-10 bg-gray-200 rounded animate-pulse mb-4"></div>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-100 rounded animate-pulse mb-2"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Orders
          </h3>
          <p className="text-gray-500 mb-4">
            Unable to fetch order data. Please try again.
          </p>
          <Button
            onClick={() => refetch()}
            className="bg-gray-950 hover:bg-gray-800"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats from filtered orders
  const orders = filteredOrders;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.state === "pending"
  ).length;
  const completedOrders = orders.filter(
    (order) => order.state === "completed"
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.state === "cancelled"
  ).length;

  const isFiltered = dateFilter.startDate || dateFilter.endDate;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-right" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Service Orders Management
              </h1>
              <p className="text-gray-600">
                Manage your service orders and track their status
                {isFiltered && (
                  <span className="ml-2 text-blue-600 font-medium">
                    (Filtered by date)
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Date Filter Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter Orders</h3>
          </div>
          
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => handleDateFilterChange("startDate", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => handleDateFilterChange("endDate", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearDateFilter}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!isFiltered}
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Quick filters:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => setQuickDateFilter("today")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Today
              </Button>
              <Button
                onClick={() => setQuickDateFilter("week")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                This Week
              </Button>
              <Button
                onClick={() => setQuickDateFilter("month")}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                This Month
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Orders
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Cancelled Orders
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {cancelledOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Orders
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {completedOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Service Orders
                {isFiltered && (
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {totalOrders} filtered
                  </span>
                )}
              </h2>
            </div>
          </div>
          <div className="p-6">
            <DataTable
              columns={columns}
              data={orders}
              title="Service Orders"
              description={
                isFiltered 
                  ? `Showing ${totalOrders} orders for the selected date range`
                  : "View and manage all service orders"
              }
              onRefresh={refetch}
              loading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderServiceTable;
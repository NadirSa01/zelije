import { DataTable } from "./dataTable";
import { getColumns } from "./columns";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useDeleteServiceMutation, useGetServicesQuery } from "@/services/service/serviceApi";
import { Link } from "react-router-dom";

function ServiceTable() {
  const { data, isLoading, isError } = useGetServicesQuery();
  const [deleteService] = useDeleteServiceMutation();
  console.log(data?.services);
  
  const handleDelete = async (id: string) => {
    console.log(id);
    
    if (window.confirm("Are you sure you want to delete this service?")) {
      await deleteService(id)
        .unwrap()
        .then((res) => {
          console.log("res : ", res.message);
          toast.success(res.message);
        })
        .catch((err) => console.error("Error deleting service:", err));
    }
  };
  const columns = getColumns(handleDelete);
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
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
            Error Loading Service
          </h3>
          <p className="text-gray-500 mb-4">
            Unable to fetch Service data. Please try again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gray-950 hover:bg-gray-800"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors position="top-right" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Service Management
              </h1>
              <p className="text-gray-600">
                Manage your Service ...
              </p>
            </div>
            <div className="flex items-center gap-3">
             <Link to="add">
              <Button className="bg-gray-950 hover:bg-gray-800 flex items-center gap-2" >
                <Plus className="w-4 h-4" />
                Add Service
              </Button>
             </Link> 
              
            </div>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"></div>

        {/* Main Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Services
            </h2>
          </div>
          <div className="p-6">
            <DataTable columns={columns} data={data?.services ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceTable;

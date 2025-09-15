import { useDeleteProductMutation, useGetProductsQuery } from "@/services/products/productApi";
import DataTable from "./dataTable";
import { getColumns  } from "./columns";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import type { IProduct } from "@/types/product";

function ProductsTable() {
  const { data, isLoading, error } = useGetProductsQuery();
   const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async(id: string) => {
    
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id)
        .unwrap()
        .then((res) =>{
          
            toast.success(res.message);
        })
        .catch((err) => console.error("Error deleting product:", err));
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
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse mb-2"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h3>
          <p className="text-gray-500 mb-4">Unable to fetch product data. Please try again.</p>
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

  
  const totalProducts = data?.total || 0;
  const totalStock = data?.products?.reduce((sum: number, product: IProduct) => 
    sum + (product.details?.reduce((detailSum: number, detail: any) => detailSum + detail.quantity, 0) || 0), 0
  ) || 0;
  const totalColors = data?.products?.reduce((sum: number, product: IProduct) => 
    sum + (product.details?.length || 0), 0
  ) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
                          <Toaster richColors  position="top-right"/>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Products Management
              </h1>
              <p className="text-gray-600">
                Manage your product catalog, inventory, and variations
              </p>
            </div>
            <div className="flex items-center gap-3">
             <Link to="add">
              <Button className="bg-gray-950 hover:bg-gray-800 flex items-center gap-2" >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
             </Link> 
              
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Stock</p>
                <p className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Color Variants</p>
                <p className="text-2xl font-bold text-gray-900">{totalColors}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Catalog
            </h2>
          </div>
          <div className="p-6">
            <DataTable columns={columns} data={data?.products ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsTable;
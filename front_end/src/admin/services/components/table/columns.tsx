"use client";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash2, Copy, ArrowUpDown,Settings2, CircleDollarSign, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
import type { IService } from "@/types/service";

export const getColumns = (
  onDelete: (id: string) => void,
): ColumnDef<IService>[] => [

{
  id: "name",
  accessorKey: `name.en`,
  header: () => (
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <Gavel className="h-4 w-4" />
      Service Name 
    </div>
  ),
  cell: ({ row }) => {
    const value = row.getValue<string>("name"); // use the column ID
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">
            {value?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="font-medium text-gray-900">
          {value}
        </div>
      </div>
    );
  },
},
  {
    accessorKey: "highPrice",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <CircleDollarSign className="h-4 w-4" />
          <Button

          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
           High Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
         
        </div>
      );
    },
    cell: ({ row }) => {
        const amount = parseFloat(row.getValue("highPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MAD",
      }).format(amount);
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-green-600 dark:text-green-400" >
             {formatted}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "lowPrice",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <CircleDollarSign className="h-4 w-4" />
          <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Low price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
        </div>
      );
    },
   cell: ({ row }) => {
        const amount = parseFloat(row.getValue("lowPrice"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MAD",
      }).format(amount);
      return (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-orange-400 dark:text-green-400" >
             {formatted}
          </span>
        </div>
      );
    },
  },
    {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center font-semibold text-gray-700">Actions</div>,
    cell: ({ row }) => {

      const service = row.original;
      
      const handleCopyId = () => {
        navigator.clipboard.writeText(service._id);
        // You can add a toast notification here
      };

      const handleDelete = () => {
          onDelete(service._id);

      };

      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg p-1"
            >
              <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-gray-700">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 border-gray-100" />
              
              <Link to={`update/${service._id}`}>
                <DropdownMenuItem className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 cursor-pointer rounded-md flex items-center gap-2 transition-colors">
                  <Eye className="h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuItem 
                onClick={handleCopyId}
                className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer rounded-md flex items-center gap-2 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-1 border-gray-100" />
              
          
              <DropdownMenuItem
                onClick={handleDelete}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-md flex items-center gap-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
]
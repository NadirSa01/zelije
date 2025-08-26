import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "./getApiRes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

// Get language preference with fallback

export const getColumns = (
  onDelete: (id: string) => void
): ColumnDef<Product>[] => [
  {
    id: "name",
    accessorKey: `name.en`,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (
      <div className="font-medium text-gray-900 dark:text-gray-100">
        {getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MAD",
      }).format(amount);
      
      return (
        <div className="font-semibold text-green-600 dark:text-green-400">
          {formatted}
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ getValue }) => (
      <Badge variant="secondary" className="font-normal">
        {getValue() as string}
      </Badge>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => {
      const details = row.original.details;
      
      if (!details || details.length === 0) {
        return (
          <Badge variant="outline" className="text-gray-500">
            N/A
          </Badge>
        );
      }
      
      const totalQuantity = details.reduce(
        (sum, detail) => sum + detail.quantity,
        0
      );
      
      const variant = totalQuantity === 0 ? "destructive" : 
                    totalQuantity < 10 ? "secondary" : "default";
      
      return (
        <Badge variant={variant} className="font-medium">
          {totalQuantity}
        </Badge>
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
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-semibold">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <Link to={`detail/${product._id}`} className="block">
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                onClick={() => navigator.clipboard.writeText(product._id)}
              >
                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                <span className="text-blue-600 dark:text-blue-400">
                  View Details
                </span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator />
           
            <DropdownMenuItem
              className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
              onClick={() => onDelete(product._id)}
            >
              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-600 dark:text-red-400">
                Delete
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { payloadOrderGET } from "@/services/orders/orderPayload";
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Trash2,
  Copy,
  Phone,
  MapPin,
  User,
  ArrowUpDown,
  MessageCircleMore,

  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

export const getColumns = (
  onDelete: (id: string) => void
): ColumnDef<payloadOrderGET>[] => [
  {
    accessorKey: "clientId.fullName",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <User className="h-4 w-4" />
        Full Name
      </div>
    ),
    cell: ({ row }) => {
      const order = row.original;
      const fullName = order?.clientId?.fullName;
      
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {fullName?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div className="font-medium text-gray-900">{fullName || "N/A"}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "clientId.telephone",
    header: () => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Phone className="h-4 w-4" />
          Telephone
        </div>
      );
    },
    cell: ({ row }) => {
      const telephone = row.original.clientId?.telephone;

      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-mono">
            {telephone || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: () => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <MessageCircleMore className="h-4 w-4" />
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue<string>("state");
      const getStatusColor = (state: string) => {
        switch (state?.toLowerCase()) {
          case "completed":
            return "bg-green-100 text-green-800";
          case "pending":
            return "bg-yellow-100 text-yellow-800";
          case "cancelled":
            return "bg-red-100 text-red-800";
          case "processing":
            return "bg-blue-100 text-blue-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(status)}`}>
            {status || "Unknown"}
          </span>
        </div>
      );
    },
  },
   {
    accessorKey: "orderLines",
    header: ({column}) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
         <Button 
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-8 px-2 lg:px-3"
      >
        Order Summary
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
      </div>
    ),
    cell: ({ row }) => {
      const orderLines = row.getValue<any[]>("orderLines") || [];
      const totalQuantity = orderLines.reduce((sum, line) => sum + (line.quantity || 0), 0);
      
      // Calculate total price from all order lines
      const totalPrice = orderLines.reduce((sum, line) => {
        const price = parseFloat(line.price?.$numberDecimal || '0');
        const quantity = line.quantity || 0;
        return sum + (price * quantity);
      }, 0);

      return (
        <div className="space-y-1">
          <div className="text-gray-600 text-sm">
            {orderLines.length} item{orderLines.length !== 1 ? 's' : ''} 
            {totalQuantity > 0 && (
              <span className="text-xs text-gray-500 ml-1">({totalQuantity} qty)</span>
            )}
          </div>
          {totalPrice > 0 && (
            <div className="text-sm font-medium text-green-600">
              {totalPrice.toFixed(2)} MAD
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "clientId.address",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <MapPin className="h-4 w-4" />
        Address
      </div>
    ),
    cell: ({ row }) => {
      const address = row.original.clientId?.address;
      const city = row.original.clientId?.city;
      
      return (
        <div className="max-w-[200px]">
          <span
            className="text-gray-600 text-sm truncate block"
            title={address || city}
          >
            {address || city || "N/A"}
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
    header: () => (
      <div className="text-center font-semibold text-gray-700">Actions</div>
    ),
    cell: ({ row }) => {
      const order = row.original;
      const handleCopyId = () => {
        navigator.clipboard.writeText(order?._id);
        // You can add a toast notification here
      };

      const handleDelete = () => {
        onDelete(order?._id);
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

              <Link to={`detail/${order?._id}`}>
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
                Delete Order
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
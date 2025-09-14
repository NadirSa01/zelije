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
import type { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  Eye,
  Copy,
  Phone,
  MapPin,
  User,
  ArrowUpDown,
  MessageCircleMore,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

// Updated interface to match new API structure
interface ServiceOrder {
  _id: string;
  description: string;
  state: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  client: {
    _id: string;
    fullName: string;
    telephone: string;
    address: string;
    city: string;
    createdAt: string;
    updatedAt: string;
  };
  service: {
    _id: string;
    name: {
      en: string;
      fr: string;
      ar: string;
    };
    description: {
      en: string;
      fr: string;
      ar: string;
    };
    lowPrice: number;
    highPrice: number;
    image: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export const getColumns = (
  onDelete: (id: string) => void
): ColumnDef<ServiceOrder>[] => [
  {
    accessorKey: "client.fullName",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <User className="h-4 w-4" />
        Client Name
      </div>
    ),
    cell: ({ row }) => {
      const order = row.original;
      const fullName = order?.client?.fullName;

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
    accessorKey: "client.telephone",
    header: () => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Phone className="h-4 w-4" />
          Phone
        </div>
      );
    },
    cell: ({ row }) => {
      const telephone = row.original.client?.telephone;

      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-mono">{telephone || "N/A"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "service",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Package className="h-4 w-4" />
        Service
      </div>
    ),
    cell: ({ row }) => {
      const service = row.original.service;
      const serviceName = service?.name?.en || service?.name?.fr || "Unknown Service";
      const priceRange = service ? `${service.lowPrice}-${service.highPrice} MAD` : "N/A";
      
      // Truncate service name to max 20 characters
      const truncatedName = serviceName.length > 20 
        ? serviceName.substring(0, 20) + "..." 
        : serviceName;

      return (
        <div className="space-y-1 max-w-[120px]">
          <div 
            className="font-medium text-gray-900 text-sm truncate"
            title={serviceName} // Show full name on hover
          >
            {truncatedName}
          </div>
          <div className="text-xs text-gray-500">
            Range: {priceRange}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "state",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 lg:px-3"
          >
            <MessageCircleMore className="h-4 w-4 mr-2" />
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue<string>("state");
      const getStatusConfig = (state: string) => {
        switch (state?.toLowerCase()) {
          case "completed":
            return { color: "bg-green-100 text-green-800 border-green-200" };
          case "pending":
            return { color: "bg-amber-100 text-amber-800 border-amber-200"};
          case "cancelled":
            return { color: "bg-red-100 text-red-800 border-red-200"};
          case "processing":
          case "in_progress":
            return { color: "bg-blue-100 text-blue-800 border-blue-200" };
          default:
            return { color: "bg-gray-100 text-gray-800 border-gray-200"};
        }
      };

      const config = getStatusConfig(status);
      
      return (
        <div className="flex items-center justify-center">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${config.color} flex items-center gap-1 min-w-[80px] justify-center`}
          >
            <span className="text-xs">{config.icon}</span>
            {status?.replace('_', ' ') || "Unknown"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2 lg:px-3"
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
    cell: ({ row }) => {
      const price = row.original.price;

      return (
        <div className="font-medium text-green-600 ">
          {price > 0 ? `${price} MAD` : "Not yet"}
        </div>
      );
    },
  },
  {
    accessorKey: "client.address",
    header: () => (
      <div className="flex items-center gap-2 font-semibold text-gray-700">
        <MapPin className="h-4 w-4" />
        Location
      </div>
    ),
    cell: ({ row }) => {
      const address = row.original.client?.address;
      const city = row.original.client?.city;
      const location = address || city;

      return (
        <div className="max-w-[200px]">
          <span
            className="text-gray-600 text-sm truncate block"
            title={location}
          >
            {location || "N/A"}
          </span>
          {address && city && address !== city && (
            <span className="text-xs text-gray-400 block">
              {city}
            </span>
          )}
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
        Order Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[140px]">
          <div>
            {date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
          <div className="text-xs text-gray-400">
            {date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
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
                Copy Order ID
              </DropdownMenuItem>

              {/* Uncomment if delete functionality is needed
              <DropdownMenuSeparator className="my-1 border-gray-100" />

              <DropdownMenuItem
                onClick={handleDelete}
                className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer rounded-md flex items-center gap-2 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Delete Order
              </DropdownMenuItem>
              */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
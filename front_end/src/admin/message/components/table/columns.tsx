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
  Trash2,
  Copy,
  Phone,
  MapPin,
  User,
  ArrowUpDown,
  MessageCircleMore,
  Captions,
  Mails,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { IMessage } from "@/types/message";

export const getColumns = (
  onDelete: (id: string) => void
): ColumnDef<IMessage>[] => [
{
  accessorKey: "client",  // store whole client object in this column
  header: () => (
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <User className="h-4 w-4" />
      Full Name
    </div>
  ),
  cell: ({ row }) => {
    const client = row.original.client; // access full client object
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">
            {client.fullName?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <div className="font-medium text-gray-900">{client.fullName}</div>
      </div>
    );
  },
},
{
    accessorKey: "client",
    header: () => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Phone className="h-4 w-4" />
          Telephone
        </div>
      );
    },
    cell: ({ row }) => {
      const client = row.original.client; // access full client object

      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-600 font-mono">
            {client.telephone}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "subject",
    header: () => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Captions className="h-4 w-4" />
          Subject
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium text-sm">
              {row.getValue<string>("subject")?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="font-medium text-gray-900">
            {row.getValue("subject")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <MessageCircleMore className="h-4 w-4" />
          Status
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue<boolean>("status");
      return (
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
            {status ? "Seen" : "Unseen"}
          </span>
        </div>
      );
    },
  },
 {
  accessorKey: "message",
  header: () => (
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <Mails className="h-4 w-4" />
      Message
    </div>
  ),
  cell: ({ row }) => {
    const message = row.getValue<string>("message");
    const preview = message.length > 50 ? message.slice(0, 30) + "..." : message;

    return <div className="text-gray-600">{preview}</div>;
  },
},
  {
    accessorKey: "address",
    header: () => (
    <div className="flex items-center gap-2 font-semibold text-gray-700">
      <MapPin className="h-4 w-4" />
      Address
    </div>
  ),
    cell: ({ row }) => {
      const client = row.original.client;
      return (
        <div className="max-w-[200px]">
          <span
            className="text-gray-600 text-sm truncate block"
            title={client.city}
          >
            
            {client.city}
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
      const message = row.original;
      const handleCopyId = () => {
        navigator.clipboard.writeText(message?._id);
        // You can add a toast notification here
      };

      const handleDelete = () => {
        onDelete(message?._id);
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

              <Link to={`detail/${message?._id}`}>
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
                Delete Client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

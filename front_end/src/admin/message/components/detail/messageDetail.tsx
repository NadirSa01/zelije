// src/components/MessageDetail.tsx
import React from "react";
import { useMessageFromCache } from "@/hooks/useMessageFromCash";
import { useGetMessageByIdQuery } from "@/services/messages/messageApi";
import { useParams, useNavigate } from "react-router-dom";
import type { IMessage } from "@/types/message";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
  MessageSquare,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

// Type guard to check if value is an IMessage object
const isIMessage = (value: any): value is IMessage => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value._id === "string" &&
    typeof value.subject === "string" &&
    typeof value.message === "string" &&
    typeof value.status === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.client === "object" &&
    value.client !== null
  );
};

const MessageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const messageFromCache = useMessageFromCache(id || "");
  const { data, isLoading } = useGetMessageByIdQuery(id || "");

  // Use type guard to safely determine the message
  const message: IMessage | undefined = React.useMemo(() => {
    if (isIMessage(messageFromCache)) {
      return messageFromCache;
    }

    if (data?.message && isIMessage(data.message)) {
      return data.message;
    }

    return undefined;
  }, [messageFromCache, data]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Message not found state
  if (!message) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <Card className="max-w-md mx-auto mt-20">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <XCircle className="h-12 w-12 text-red-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Message not found
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    The message you are looking for does not exist or has been
                    deleted.
                  </p>
                </div>
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="mt-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { date, time } = formatDate(message.createdAt);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Message Details
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage the message information
              </p>
            </div>
            <Badge
              variant={message.status ? "default" : "secondary"}
              className={`${
                message.status
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              }`}
            >
              {message.status ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Processed
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3 mr-1" />
                  Pending
                </>
              )}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Message Content */}
          <div className="space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Message Content
                </CardTitle>
                <CardDescription>
                  Detailed information about the received message{" "}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border">
                    <p className="text-gray-900 font-medium">
                      {message.subject}
                    </p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="p-4 bg-gray-50 rounded-md border min-h-[120px]">
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Date and Time */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{time}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Client Information */}
          <div className="space-y-6">
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Client Information
                </CardTitle>
                <CardDescription>
                  Details of the client who sent the message
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Client Name */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 bg-gray-950 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {message.client.fullName}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  {/* Phone */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md border">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Telephone
                      </p>
                      <p className="text-gray-900 font-medium">
                        {message.client.telephone}
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-md border">
                    <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-900 font-medium leading-relaxed">
                        {message.client.address}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {message.client.city}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Client ID */}
                <div className="text-xs text-gray-500">
                  ID Client:{" "}
                  <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700">
                    {message.client._id}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetail;

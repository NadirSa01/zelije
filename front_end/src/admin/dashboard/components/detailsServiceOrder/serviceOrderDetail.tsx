import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUpdateOrderStateMutation } from "@/services/orders/orderApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Edit3,
  Save,
  X,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  ShoppingBag,
  Building2,
  Hash,
  Plus,
  Minus,
} from "lucide-react";
import {
  useGetOrderServiceByIdQuery,
  useUpdateServicePriceMutation,
  useUpdateServiceStateMutation,
} from "@/services/serviceOrders/serviceOrder";
import { toast, Toaster } from "sonner";

const ServiceOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // RTK Query hooks
  const {
    data: order,
    isLoading,
    isError,
    refetch,
  } = useGetOrderServiceByIdQuery(id!);

  const [updateServicePrice] = useUpdateServicePriceMutation();
  const [updateServiceState] = useUpdateServiceStateMutation();

  // Local state
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [showStateDialog, setShowStateDialog] = useState(false);
  const [isEditing, setisEditing] = useState(false);
  const [pendingState, setPendingState] = useState<string>("");

 const handlePriceUpdate = (id: string, newPrice: number) => {
  if (newPrice < 0) {
    toast.error("Price cannot be negative"); 
    return;
  }
  
  updateServicePrice({
    id,
    newPrice: newPrice,
  })
    .unwrap()
    .then(() => {
      setisEditing(false);
      toast.success("Price updated successfully"); 
    })
    .catch((err) => {
      // Better error handling
      const errorMessage = err?.data?.message || err?.message || "Failed to update price";
      toast.error(errorMessage);
      console.error("Price update error:", err);
    });
};

  // Handle order state update
  const handleStateUpdate = async () => {

    setIsUpdatingState(true);

      await updateServiceState({
        id,
        newState: pendingState,
      }).unwrap().then(()=>{
        toast.success(`Order status updated to ${pendingState}`);
        setShowStateDialog(false);
        refetch();
      }).catch ((error)=>{
        console.error("Error updating order state:", error);
      toast.error("Failed to update order status");
      }) 
  };

  const openStateDialog = (newState: string) => {
    setPendingState(newState);
    setShowStateDialog(true);
  };

  // Get status config
  const getStatusConfig = (state: string) => {
    const configs = {
      pending: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
        bgClass: "bg-yellow-50",
        iconColor: "text-yellow-600",
      },
      processing: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        icon: Truck,
        bgClass: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      completed: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle,
        bgClass: "bg-green-50",
        iconColor: "text-green-600",
      },
      cancelled: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        bgClass: "bg-red-50",
        iconColor: "text-red-600",
      },
      default: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        icon: AlertCircle,
        bgClass: "bg-gray-50",
        iconColor: "text-gray-600",
      },
    };
    return configs[state as keyof typeof configs] || configs.default;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Toaster richColors position="top-right" />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-8 w-48" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Order Not Found
            </h3>
            <p className="text-gray-500 mb-6">
              The requested order could not be found.
            </p>
            <Button onClick={() => navigate("orders/order")} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.state);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Toaster richColors position="top-right" />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/orders")}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Order Details
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-mono text-sm">
                {order._id}
              </span>
            </div>
          </div>

          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <Card className="overflow-hidden">
              <CardHeader className={`${statusConfig.bgClass} border-b`}>
                <CardTitle className="flex items-center gap-3 p-2">
                  <div className={`p-2 rounded-full bg-white/80`}>
                    <StatusIcon
                      className={`w-5 h-5 ${statusConfig.iconColor}`}
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Order Status</div>
                    <div className="text-sm opacity-80">
                      Last updated{" "}
                      {new Date(order.updatedAt || "").toLocaleDateString()}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Badge
                    variant="outline"
                    className={`${statusConfig.color} border font-medium px-3 py-1`}
                  >
                    <StatusIcon className="w-3 h-3 mr-2" />
                    {order.state?.charAt(0).toUpperCase() +
                      order.state?.slice(1)}
                  </Badge>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Change Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["pending", "processing", "completed", "cancelled"].map(
                        (state) => {
                          const config = getStatusConfig(state);
                          const StateIcon = config.icon;
                          return (
                            <Button
                              key={state}
                              variant={
                                order.state === state ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => openStateDialog(state)}
                              disabled={
                                order.state === state || isUpdatingState
                              }
                              className="justify-start h-auto p-3"
                            >
                              <StateIcon className="w-4 h-4 mr-2" />
                              <span className="capitalize">{state}</span>
                            </Button>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                      {order.client?.fullName?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">
                      {order?.client?.fullName}
                    </div>
                    <div className="text-sm text-gray-500">Customer</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Phone className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {order?.client?.telephone}
                      </div>
                      <div className="text-xs text-gray-500">Phone Number</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg mt-1">
                      <MapPin className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order?.client?.address}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Delivery Address
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order?.client?.city}
                      </div>
                      <div className="text-xs text-gray-500">City</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  Order 
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  <div className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-16 rounded-xl flex items-center justify-center">
                            <img
                              src={order?.service?.image[0]}
                              className="w-28 h-24 text-blue-600 rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {order?.service?.name?.en}
                              </h3>
                              <div className="space-y-1">
                                <div className="flex  gap-2 text-sm text-gray-600">
                                  <p
                                    className="text-gray-600 text-base leading-relaxed mb-2 flex-1 overflow-hidden"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: "vertical",
                                    }}
                                  >
                                    {order?.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">
                                Range Price from m2
                              </Label>
                              <div className="text-lg font-semibold text-gray-900">
                                {order?.service?.highPrice} -{" "}
                                {order?.service?.lowPrice}
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">
                                Price
                              </Label>
                              {isEditing ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center border rounded-lg">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 rounded-r-none"
                                      onClick={() =>
                                        setEditPrice(Math.max(1, editPrice - 1))
                                      }
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={editPrice}
                                      onChange={(e) =>
                                        setEditPrice(
                                          parseInt(e.target.value) || 1
                                        )
                                      }
                                      className="w-16 h-8 text-center border-0 border-x focus-visible:ring-0 rounded-none"
                                    />
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-8 w-8 p-0 rounded-l-none"
                                      onClick={() =>
                                        setEditPrice(editPrice + 1)
                                      }
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        handlePriceUpdate(order._id, editPrice)
                                      }
                                      className="h-8 w-8 p-0"
                                    >
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setisEditing(false);
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-semibold">
                                    {order?.price} MAD
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setEditPrice(order?.price);
                                      setisEditing(true);
                                    }}
                                    className="h-6 w-6 p-0 hover:bg-blue-100"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t bg-gray-50/50 -mx-6 px-6 py-3">
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>
                                Added:{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                              <span>
                                Last updated:{" "}
                                {new Date(order.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={showStateDialog} onOpenChange={setShowStateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the order status to{" "}
              <strong className="capitalize">{pendingState}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStateDialog(false)}
              disabled={isUpdatingState}
            >
              Cancel
            </Button>
            <Button onClick={handleStateUpdate} disabled={isUpdatingState}>
              {isUpdatingState && (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              )}
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceOrderDetail;

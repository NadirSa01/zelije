import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetOrderByIdQuery, 
  useUpdateOrderQuantityMutation, 
  useUpdateOrderStateMutation,
} from '@/services/orders/orderApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast, Toaster } from 'sonner';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Truck,
  CreditCard,
  ShoppingBag,
  Building2,
  Hash,
  Plus,
  Minus
} from 'lucide-react';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // RTK Query hooks
  const { data: order, isLoading, isError, refetch } = useGetOrderByIdQuery(id!);
  
  const [updateOrderQuantity] = useUpdateOrderQuantityMutation();
  const [updateOrderState] = useUpdateOrderStateMutation();
  
  // Local state
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [isUpdatingState, setIsUpdatingState] = useState(false);
  const [showStateDialog, setShowStateDialog] = useState(false);
  const [pendingState, setPendingState] = useState<string>('');

  // Handle quantity update
  const handleQuantityUpdate = async (orderLineId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    try {
      await updateOrderQuantity({
        orderLineId,
        newqty: newQuantity
      }).unwrap();
      
      toast.success('Quantity updated successfully');
      setEditingLineId(null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Handle order state update
  const handleStateUpdate = async () => {
    if (!id || !pendingState) return;
    
    setIsUpdatingState(true);
    try {
      await updateOrderState({
        orderId: id,
        state: pendingState
      }).unwrap();
      
      toast.success(`Order status updated to ${pendingState}`);
      setShowStateDialog(false);
      refetch()
    } catch (error) {
      console.error('Error updating order state:', error);
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingState(false);
    }
  };

  const openStateDialog = (newState: string) => {
    setPendingState(newState);
    setShowStateDialog(true);
  };

  // Get status config
  const getStatusConfig = (state: string) => {
    const configs = {
      pending: { 
        color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
        icon: Clock,
        bgClass: 'bg-yellow-50',
        iconColor: 'text-yellow-600'
      },
      processing: { 
        color: 'bg-blue-50 text-blue-700 border-blue-200', 
        icon: Truck,
        bgClass: 'bg-blue-50',
        iconColor: 'text-blue-600'
      },
      completed: { 
        color: 'bg-green-50 text-green-700 border-green-200', 
        icon: CheckCircle,
        bgClass: 'bg-green-50',
        iconColor: 'text-green-600'
      },
      cancelled: { 
        color: 'bg-red-50 text-red-700 border-red-200', 
        icon: XCircle,
        bgClass: 'bg-red-50',
        iconColor: 'text-red-600'
      },
      default: { 
        color: 'bg-gray-50 text-gray-700 border-gray-200', 
        icon: AlertCircle,
        bgClass: 'bg-gray-50',
        iconColor: 'text-gray-600'
      }
    };
    return configs[state as keyof typeof configs] || configs.default;
  };

  // Calculate totals
  const orderTotal = order?.orderLines?.reduce((sum, line) => {
    const price = parseFloat(line.price || '0');
    return sum + (price * line.quantity);
  }, 0) || 0;

  const totalItems = order?.orderLines?.reduce((sum, line) => sum + line.quantity, 0) || 0;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Not Found</h3>
            <p className="text-gray-500 mb-6">The requested order could not be found.</p>
            <Button onClick={() => navigate('dashboard/order')} className="w-full">
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
            onClick={() => navigate('/admin/dashboard')}
            className="w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Details</h1>
            <div className="flex items-center gap-2 mt-2">
              <Hash className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 font-mono text-sm">{order._id}</span>
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
                    <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">Order Status</div>
                    <div className="text-sm opacity-80">
                      Last updated {new Date(order.updatedAt || '').toLocaleDateString()}
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
                    {order.state.charAt(0).toUpperCase() + order.state.slice(1)}
                  </Badge>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Change Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['pending', 'processing', 'completed', 'cancelled'].map((state) => {
                        const config = getStatusConfig(state);
                        const StateIcon = config.icon;
                        return (
                          <Button
                            key={state}
                            variant={order.state === state ? "default" : "outline"}
                            size="sm"
                            onClick={() => openStateDialog(state)}
                            disabled={order.state === state || isUpdatingState}
                            className="justify-start h-auto p-3"
                          >
                            <StateIcon className="w-4 h-4 mr-2" />
                            <span className="capitalize">{state}</span>
                          </Button>
                        );
                      })}
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
                      {order.client.fullName?.charAt(0)?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{order.client.fullName}</div>
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
                        {order.client.telephone}
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
                        {order.clientId.address}
                      </div>
                      <div className="text-sm text-gray-600">{order.client.address}</div>
                      <div className="text-xs text-gray-500 mt-1">Delivery Address</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Building2 className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.client.city}</div>
                      <div className="text-xs text-gray-500">City</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{totalItems}</div>
                    <div className="text-xs text-blue-600 font-medium mt-1">Total Items</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{order.orderLines.length}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">Product Lines</div>
                  </div>
                </div>
                
                <Separator />
                <div className="space-y-3">                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">{orderTotal} MAD</span>
                  </div>
                </div>
                
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Created on {new Date(order.createdAt || '').toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader className="border-b bg-gray-50/50">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-gray-600" />
                  Order Items ({order.orderLines.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {order.orderLines.map((line, index) => {                    
                    const lineTotal = parseFloat(line.price) * line.quantity;
                    const isEditing = editingLineId === line._id;                                        
                    return (
                      <div key={line._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex gap-4 flex-1">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 rounded-xl flex items-center justify-center">
                                <img src={line?.productDetail?.picture} className="w-18 h-18 text-blue-600" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900 mb-1">
                                    Product #{index + 1}
                                  </h3>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="font-medium">Product ID:</span>
                                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                                        {line?.product?._id}
                                      </code>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                      <span className="font-medium">Detail ID:</span>
                                      <code className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                                        {line?.productDetail?._id}
                                      </code>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1 block">Unit Price</Label>
                                  <div className="text-lg font-semibold text-gray-900">
                                    {parseFloat(line.price)} MAD
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1 block">Quantity</Label>
                                  {isEditing ? (
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-center border rounded-lg">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 rounded-r-none"
                                          onClick={() => setEditQuantity(Math.max(1, editQuantity - 1))}
                                        >
                                          <Minus className="w-3 h-3" />
                                        </Button>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={editQuantity}
                                          onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                                          className="w-16 h-8 text-center border-0 border-x focus-visible:ring-0 rounded-none"
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 w-8 p-0 rounded-l-none"
                                          onClick={() => setEditQuantity(editQuantity + 1)}
                                        >
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                      </div>
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          onClick={() => handleQuantityUpdate(line._id, editQuantity)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Save className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => setEditingLineId(null)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <X className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg font-semibold">{line.quantity}</span>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          setEditingLineId(line._id);
                                          setEditQuantity(line.quantity);
                                        }}
                                        className="h-6 w-6 p-0 hover:bg-blue-100"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                
                                <div>
                                  <Label className="text-xs text-gray-500 mb-1 block">Line Total</Label>
                                  <div className="text-lg font-bold text-green-600">
                                    {lineTotal } MAD
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t bg-gray-50/50 -mx-6 px-6 py-3">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>Added: {new Date(line.createdAt).toLocaleDateString()}</span>
                                  <span>Last updated: {new Date(line.updatedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
              Are you sure you want to change the order status to <strong className="capitalize">{pendingState}</strong>?
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
            <Button
              onClick={handleStateUpdate}
              disabled={isUpdatingState}
            >
              {isUpdatingState && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
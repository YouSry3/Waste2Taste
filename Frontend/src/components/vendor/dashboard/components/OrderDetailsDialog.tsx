import { CalendarDays, CreditCard, Mail, MapPin, Phone, ShoppingBag } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../ui/dialog";
import { VendorOrder } from "../../types";

interface OrderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOrder: VendorOrder | null;
  getStatusColor: (status: VendorOrder["status"]) => string;
  onSendReceipt: () => void;
  onContactCustomer: () => void;
  onClose: () => void;
}

export function OrderDetailsDialog({
  open,
  onOpenChange,
  selectedOrder,
  getStatusColor,
  onSendReceipt,
  onContactCustomer,
  onClose,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {selectedOrder && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
                Order Details: {selectedOrder.id}
              </DialogTitle>
              <DialogDescription>
                Completed on {selectedOrder.time}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedOrder.customer}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedOrder.customerEmail} •{" "}
                      {selectedOrder.customerPhone}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(selectedOrder.status)}
                  >
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium">Pickup Time</p>
                      <p className="text-xs text-gray-600">
                        {selectedOrder.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium">Pickup Location</p>
                      <p className="text-xs text-gray-600">
                        {selectedOrder.pickupAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium">Payment Method</p>
                      <p className="text-xs text-gray-600">
                        {selectedOrder.paymentMethod}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.orderNotes && (
                <div>
                  <h4 className="font-semibold mb-2">Customer Notes</h4>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      {selectedOrder.orderNotes}
                    </p>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-green-600">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onSendReceipt} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Receipt
                </Button>
                <Button
                  variant="outline"
                  onClick={onContactCustomer}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
                <Button onClick={onClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// import { Badge } from "../../../ui/badge";
// import { Button } from "../../../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
// import { VendorOrder } from "../../types";

// interface RecentOrdersTableProps {
//   orders: VendorOrder[];
//   onViewAllOrders: () => void;
//   onViewOrderDetails: (order: VendorOrder) => void;
//   getInitials: (name: string) => string;
//   getStatusColor: (status: VendorOrder["status"]) => string;
// }

// export function RecentOrdersTable({
//   orders,
//   onViewAllOrders,
//   onViewOrderDetails,
//   getInitials,
//   getStatusColor,
// }: RecentOrdersTableProps) {
//   return (
//     <Card className="w-full">
//       <CardHeader className="flex flex-row items-center justify-between">
//         <div>
//           <CardTitle>Recent Orders</CardTitle>
//           <p className="text-sm text-gray-500 mt-1">Latest order activity</p>
//         </div>
//         <Button
//           onClick={onViewAllOrders}
//           variant="ghost"
//           size="sm"
//           className="text-green-600 hover:text-green-700 hover:bg-green-50"
//         >
//           View all orders
//         </Button>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto rounded-lg border bg-white">
//           <table className="w-full table-auto">
//             <thead>
//               <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
//                   Order ID
//                 </th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
//                   Customer
//                 </th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
//                   Item
//                 </th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
//                   Amount
//                 </th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
//                   Pickup Time
//                 </th>
//                 <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
//                   Status
//                 </th>
                
//               </tr>
//             </thead>

//             <tbody>
//                 {orders.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="py-12 text-center text-gray-500">
//                     No recent orders
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => (
//                   <tr
//                     key={order.id}
//                     className="border-b hover:bg-gray-50 transition-colors"
//                   >
//                     <td className="py-3 px-4 font-medium text-sm whitespace-nowrap">
//                       <span className="text-sm font-semibold text-gray-800">
//                         {order.id}
//                       </span>
//                     </td>

//                     <td className="py-3 px-4">
//                       <div className="flex items-center gap-2">
//                         <div
//                           className={`w-8 h-8 flex items-center justify-center rounded-full ${
//                             order.avatarColor ??
//                             "bg-gradient-to-br from-purple-400 to-blue-500"
//                           } text-white font-bold text-xs`}
//                         >
//                           {getInitials(order.customer)}
//                         </div>
//                         <span className="text-sm whitespace-nowrap">
//                           {order.customer}
//                         </span>
//                       </div>
//                     </td>

//                     <td className="py-3 px-4 text-sm whitespace-nowrap text-gray-700">
//                       {order.item}
//                     </td>

//                     <td className="py-3 px-4 font-semibold text-sm text-green-600 whitespace-nowrap">
//                       {order.amount}
//                     </td>

//                     <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
//                       {order.timeSlot}
//                     </td>

//                     <td className="py-3 px-4 whitespace-nowrap">
//                       <Badge variant="outline" className={getStatusColor(order.status)}>
//                         {order.status}
//                       </Badge>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }


import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Eye, Package } from "lucide-react";

interface RecentOrder {
  id: string;
  customer: string;
  item: string;
  amount: string;
  timeSlot: string;
  status: string;
  customerPhone?: string;
  pickupAddress?: string;
}

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  onViewAllOrders: () => void;
  onViewOrderDetails: (order: RecentOrder) => void;
  onMarkAsReady?: (orderId: string) => void;
  getInitials: (name: string) => string;
  getStatusColor: (status: string) => string;
}

export function RecentOrdersTable({
  orders,
  onViewAllOrders,
  onViewOrderDetails,
  onMarkAsReady,
  getInitials,
  getStatusColor,
}: RecentOrdersTableProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Latest order activity</p>
        </div>
        <Button
          onClick={onViewAllOrders}
          variant="ghost"
          size="sm"
          className="text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          View all orders
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Order ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Item</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Pickup Time</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No recent orders
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-sm whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-800">{order.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-blue-500 text-white font-bold text-xs">
                          {getInitials(order.customer)}
                        </div>
                        <span className="text-sm whitespace-nowrap">{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm whitespace-nowrap text-gray-700">
                      {order.item}
                    </td>
                    <td className="py-3 px-4 font-semibold text-sm text-green-600 whitespace-nowrap">
                      {order.amount}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">
                      {order.timeSlot}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-600 hover:bg-green-50"
                          onClick={() => onViewOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                         
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
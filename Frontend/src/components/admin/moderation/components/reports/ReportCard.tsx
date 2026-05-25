// import React from "react";
// import { CustomerReport } from "../../types";
// import { Card, CardContent } from "../../../../ui/card";
// import { Badge } from "../../../../ui/badge";
// import { Avatar, AvatarFallback } from "../../../../ui/avatar";
// import { Checkbox } from "../../../../ui/checkbox";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../../../../ui/alert-dialog";
// import {
//   User,
//   Store,
//   CheckCircle,
//   AlertTriangle,
//   Archive,
//   Loader2,
// } from "lucide-react";

// interface ReportCardProps {
//   report: CustomerReport;
//   isSelected: boolean;
//   loadingStates: { [key: string]: boolean };
//   onSelect: (id: number, checked: boolean) => void;
//   onResolve: (id: number) => void;
//   onDismiss: (id: number) => void; // This should handle dismissal
//   onContactCustomer: (report: CustomerReport) => void;
//   onContactVendor: (report: CustomerReport) => void;
//   onIssueWarning: (report: CustomerReport) => void;
// }

// export function ReportCard({
//   report,
//   isSelected,
//   loadingStates,
//   onSelect,
//   onResolve,
//   onDismiss,
//   onContactCustomer,
//   onContactVendor,
//   onIssueWarning,
// }: ReportCardProps) {
//   return (
//     <Card className="shadow-sm hover:shadow-md transition-shadow">
//       <CardContent className="p-6">
//         <div className="flex items-start justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <Checkbox
//               checked={isSelected}
//               onCheckedChange={(checked) => onSelect(report.id, !!checked)}
//             />
//             <Avatar className="h-12 w-12 bg-gradient-to-br from-orange-400 to-orange-600">
//               <AvatarFallback className="text-white font-semibold">
//                 {report.reporter
//                   .split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="font-medium text-gray-900">{report.reporter}</p>
//               <p className="text-sm text-gray-500">
//                 Order: <span className="font-mono">{report.orderId}</span>
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             <Badge
//               variant={
//                 report.priority === "High"
//                   ? "destructive"
//                   : report.priority === "Medium"
//                     ? "default"
//                     : "secondary"
//               }
//             >
//               {report.priority} Priority
//             </Badge>
//             <Badge
//               variant="outline"
//               className={
//                 report.status === "resolved"
//                   ? "bg-green-50 text-green-700 border-green-200"
//                   : report.status === "dismissed"
//                     ? "bg-gray-50 text-gray-700 border-gray-200"
//                     : ""
//               }
//             >
//               {report.status === "under_review"
//                 ? "Under Review"
//                 : report.status === "resolved"
//                   ? "Resolved"
//                   : "Dismissed"}
//             </Badge>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b">
//           <div>
//             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//               Vendor
//             </p>
//             <p className="text-sm font-medium text-gray-900">{report.vendor}</p>
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//               Listing
//             </p>
//             <p className="text-sm font-medium text-gray-900">
//               {report.listing}
//             </p>
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//               Issue Type
//             </p>
//             <p className="text-sm font-medium text-gray-900">{report.issue}</p>
//           </div>
//           <div>
//             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
//               Submitted
//             </p>
//             <p className="text-sm font-medium text-gray-900">
//               {report.submitted}
//             </p>
//           </div>
//         </div>

//         <div className="mb-6 bg-gray-50 p-4 rounded-lg">
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
//             Customer Description
//           </p>
//           <p className="text-sm text-gray-700 leading-relaxed">
//             {report.description}
//           </p>
//         </div>

//         <div className="flex flex-wrap gap-2">
//           <button
//             onClick={() => onContactCustomer(report)}
//             className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             <User className="h-4 w-4" />
//             Contact Customer
//           </button>

//           <button
//             onClick={() => onContactVendor(report)}
//             className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
//           >
//             <Store className="h-4 w-4" />
//             Contact Vendor
//           </button>

//           {report.status === "under_review" && (
//             <>
//               <button
//                 onClick={() => onResolve(report.id)}
//                 disabled={loadingStates[`report-${report.id}`]}
//                 className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
//               >
//                 {loadingStates[`report-${report.id}`] ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Resolving...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="h-4 w-4" />
//                     Mark Resolved
//                   </>
//                 )}
//               </button>

//               {/* Warning Button - Orange for warnings */}
//               <button
//                 onClick={() => onIssueWarning(report)}
//                 disabled={loadingStates[`issue-warning-${report.id}`]}
//                 className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors duration-200"
//               >
//                 {loadingStates[`issue-warning-${report.id}`] ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <AlertTriangle className="h-4 w-4" />
//                     Issue Warning
//                   </>
//                 )}
//               </button>

//               {/* Dismiss Button - Gray for neutral destructive action */}
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200">
//                     <Archive className="h-4 w-4" />
//                     Dismiss
//                   </button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Dismiss Report #{report.orderId}?
//                     </AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This will mark the report as dismissed and remove it from
//                       the review queue. This action cannot be undone.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       className="bg-gray-600 hover:bg-gray-700 text-white"
//                       onClick={() => onDismiss(report.id)} // This calls the dismissal function
//                     >
//                       {loadingStates[`report-${report.id}`] ? (
//                         <>
//                           <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                           Dismissing...
//                         </>
//                       ) : (
//                         "Dismiss Report"
//                       )}
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// }



import React, { useState } from "react";
import { CustomerReport } from "../../types";
import { Card, CardContent } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Avatar, AvatarFallback } from "../../../../ui/avatar";
import { Checkbox } from "../../../../ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../../ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../ui/dialog";
import { CheckCircle, Archive, Loader2, MessageSquare } from "lucide-react";
import { useAddResponse } from "../../services/adminReportsService";
import toast from "react-hot-toast";

interface ReportCardProps {
  report: CustomerReport & { rawId?: string };
  isSelected: boolean;
  loadingStates: { [key: string]: boolean };
  onSelect: (id: number, checked: boolean) => void;
  onResolve: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function ReportCard({
  report,
  isSelected,
  loadingStates,
  onSelect,
  onResolve,
  onDismiss,
}: ReportCardProps) {
  const [respondOpen, setRespondOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { mutateAsync: addResponse, isPending: respondLoading } = useAddResponse();

  const rawId: string = (report as any).rawId ?? String(report.id);

  const handleRespond = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    try {
      await addResponse({ id: rawId, message: message.trim() });
      toast.success("Response sent");
      setMessage("");
      setRespondOpen(false);
    } catch {
      toast.error("Failed to send response");
    }
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelect(report.id, !!checked)}
              />
              <Avatar className="h-12 w-12 bg-gradient-to-br from-orange-400 to-orange-600">
                <AvatarFallback className="text-white font-semibold">
                  {report.reporter
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-900">{report.reporter}</p>
                <p className="text-sm text-gray-500">
                  Order: <span className="font-mono">{report.orderId}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  report.priority === "High"
                    ? "destructive"
                    : report.priority === "Medium"
                      ? "default"
                      : "secondary"
                }
              >
                {report.priority} Priority
              </Badge>
              <Badge
                variant="outline"
                className={
                  report.status === "resolved"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : report.status === "dismissed"
                      ? "bg-gray-50 text-gray-700 border-gray-200"
                      : ""
                }
              >
                {report.status === "under_review"
                  ? "Under Review"
                  : report.status === "resolved"
                    ? "Resolved"
                    : "Dismissed"}
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Vendor
              </p>
              <p className="text-sm font-medium text-gray-900">{report.vendor}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Listing
              </p>
              <p className="text-sm font-medium text-gray-900">{report.listing}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Issue Type
              </p>
              <p className="text-sm font-medium text-gray-900">{report.issue}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Submitted
              </p>
              <p className="text-sm font-medium text-gray-900">{report.submitted}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Customer Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{report.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
           

            {report.status === "under_review" && (
              <>
                {/* Resolve */}
                <button
                  onClick={() => onResolve(report.id)}
                  disabled={loadingStates[`report-${report.id}`]}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  {loadingStates[`report-${report.id}`] ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resolving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Mark Resolved
                    </>
                  )}
                </button>

            
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Respond Dialog */}
      <Dialog open={respondOpen} onOpenChange={setRespondOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Report #{report.orderId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Customer
              </p>
              <p className="text-sm text-gray-800">{report.reporter}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Issue
              </p>
              <p className="text-sm text-gray-800">{report.issue}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                Your Response <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your response to this report..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <button
              onClick={() => { setRespondOpen(false); setMessage(""); }}
              className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleRespond}
              disabled={respondLoading || !message.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {respondLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4" />
                  Send Response
                </>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
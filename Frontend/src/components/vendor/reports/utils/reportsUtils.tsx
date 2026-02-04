import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import { ReportPriority, ReportStatus } from "../types";

export const getStatusColor = (status: ReportStatus) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "Under Review":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Pending Response":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getPriorityColor = (priority: ReportPriority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: ReportStatus) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle2 className="w-8 h-8 text-green-600" />;
    case "Under Review":
      return <Clock className="w-8 h-8 text-yellow-600" />;
    case "Pending Response":
      return <AlertCircle className="w-8 h-8 text-orange-600" />;
    default:
      return <FileText className="w-8 h-8 text-gray-600" />;
  }
};

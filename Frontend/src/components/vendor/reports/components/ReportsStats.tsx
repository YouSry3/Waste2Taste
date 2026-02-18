import { AlertCircle, CheckCircle2, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "../../../ui/card";

interface ReportsStatsProps {
  pendingCount: number;
  reviewCount: number;
  resolvedCount: number;
  totalReports: number;
}

export function ReportsStats({
  pendingCount,
  reviewCount,
  resolvedCount,
  totalReports,
}: ReportsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Pending Response</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {pendingCount}
              </h3>
              <p className="text-xs text-orange-600 font-medium">
                Requires attention
              </p>
            </div>
            <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Under Review</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {reviewCount}
              </h3>
              <p className="text-xs text-yellow-600 font-medium">
                In progress
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Resolved</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {resolvedCount}
              </h3>
              <p className="text-xs text-green-600 font-medium">Completed</p>
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-200 hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-2">Total Reports</p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {totalReports}
              </h3>
              <p className="text-xs text-blue-600 font-medium">All time</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

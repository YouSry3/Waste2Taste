import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Search,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Upload,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

// Sample data - Backend will replace these
const reports = [
  {
    id: "REP-001",
    customer: "Ahmed Hassan",
    orderId: "ORD-045",
    listing: "Fresh Croissants Pack",
    reason: "Item Quality Issue",
    description: "Croissants were stale and not fresh as advertised",
    status: "Under Review",
    date: "2025-11-22 10:30",
    refund: 45,
    priority: "high",
  },
  {
    id: "REP-002",
    customer: "Sara Mohamed",
    orderId: "ORD-032",
    listing: "Mixed Pastries Box",
    reason: "Missing Items",
    description: "Box was supposed to have 12 items but only had 8",
    status: "Resolved",
    date: "2025-11-21 15:45",
    refund: 20,
    priority: "medium",
    resolution: "Partial refund issued. Customer satisfied with resolution.",
  },
  {
    id: "REP-003",
    customer: "Khaled Ali",
    orderId: "ORD-028",
    listing: "Bread Assortment",
    reason: "Wrong Item",
    description: "Received white bread instead of whole wheat bread",
    status: "Pending Response",
    date: "2025-11-21 09:15",
    refund: 30,
    priority: "high",
  },
  {
    id: "REP-004",
    customer: "Fatima Ibrahim",
    orderId: "ORD-019",
    listing: "Bakery Surprise Bag",
    reason: "Late Pickup Issue",
    description: "Store was closed when I arrived during pickup window",
    status: "Pending Response",
    date: "2025-11-20 18:20",
    refund: 50,
    priority: "high",
  },
];

const getStatusColor = (status: string) => {
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

const getPriorityColor = (priority: string) => {
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

const getStatusIcon = (status: string) => {
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

export function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<
    (typeof reports)[0] | null
  >(null);
  const [response, setResponse] = useState("");

  // Calculate statistics
  const pendingCount = reports.filter(
    (r) => r.status === "Pending Response",
  ).length;
  const reviewCount = reports.filter((r) => r.status === "Under Review").length;
  const resolvedCount = reports.filter((r) => r.status === "Resolved").length;
  const totalReports = reports.length;

  // Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.listing.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || report.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Customer Reports
        </h1>
        <p className="text-gray-500">
          Review and respond to customer reports and issues
        </p>
      </div>

      {/* Statistics Cards */}
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

      {/* Filters and Search */}
      <Card className="shadow-sm border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by report ID, customer, order, or listing..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("all")}
                className={
                  filterStatus === "all"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
              >
                All
              </Button>
              <Button
                variant={
                  filterStatus === "Pending Response" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setFilterStatus("Pending Response")}
                className={
                  filterStatus === "Pending Response"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
              >
                Pending
              </Button>
              <Button
                variant={
                  filterStatus === "Under Review" ? "default" : "outline"
                }
                size="sm"
                onClick={() => setFilterStatus("Under Review")}
                className={
                  filterStatus === "Under Review"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
              >
                In Review
              </Button>
              <Button
                variant={filterStatus === "Resolved" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus("Resolved")}
                className={
                  filterStatus === "Resolved"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : ""
                }
              >
                Resolved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card className="shadow-sm border-gray-200">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No reports found matching your criteria
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              className="shadow-sm border-gray-200 hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.id}
                      </h3>
                      <Badge
                        className={`${getStatusColor(report.status)} border`}
                      >
                        {report.status}
                      </Badge>
                      <Badge
                        className={`${getPriorityColor(report.priority)} border`}
                      >
                        {report.priority.charAt(0).toUpperCase() +
                          report.priority.slice(1)}{" "}
                        Priority
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {report.date}
                    </p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View & Respond
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">
                          Report Details - {report.id}
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getStatusColor(report.status)} border text-sm py-1`}
                          >
                            {report.status}
                          </Badge>
                          <Badge
                            className={`${getPriorityColor(report.priority)} border text-sm py-1`}
                          >
                            {report.priority.charAt(0).toUpperCase() +
                              report.priority.slice(1)}{" "}
                            Priority
                          </Badge>
                        </div>

                        {/* Report Information */}
                        <div className="grid grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label className="text-gray-500 text-xs font-medium">
                              Customer
                            </Label>
                            <p className="text-gray-900 font-medium mt-1">
                              {report.customer}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-xs font-medium">
                              Order ID
                            </Label>
                            <p className="text-gray-900 font-medium mt-1">
                              {report.orderId}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-xs font-medium">
                              Listing
                            </Label>
                            <p className="text-gray-900 font-medium mt-1">
                              {report.listing}
                            </p>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-xs font-medium">
                              Refund Amount
                            </Label>
                            <p className="text-gray-900 font-medium mt-1">
                              EGP {report.refund}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-gray-500 text-xs font-medium">
                              Report Date
                            </Label>
                            <p className="text-gray-900 font-medium mt-1">
                              {report.date}
                            </p>
                          </div>
                        </div>

                        {/* Issue Details */}
                        <div className="space-y-4">
                          <div>
                            <Label className="text-gray-700 font-semibold">
                              Reason
                            </Label>
                            <p className="text-gray-900 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                              {report.reason}
                            </p>
                          </div>

                          <div>
                            <Label className="text-gray-700 font-semibold">
                              Customer Description
                            </Label>
                            <p className="text-gray-700 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              {report.description}
                            </p>
                          </div>
                        </div>

                        {/* Resolution (if resolved) */}
                        {report.resolution && (
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <Label className="text-green-800 font-semibold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Resolution
                            </Label>
                            <p className="text-green-900 mt-2">
                              {report.resolution}
                            </p>
                          </div>
                        )}

                        {/* Response Form (if not resolved) */}
                        {report.status !== "Resolved" && (
                          <>
                            <div className="space-y-4 pt-4 border-t">
                              <div>
                                <Label
                                  htmlFor="response"
                                  className="text-gray-700 font-semibold"
                                >
                                  Your Response
                                </Label>
                                <Textarea
                                  id="response"
                                  placeholder="Provide your response and any explanation to the customer..."
                                  rows={5}
                                  className="mt-2"
                                  value={response}
                                  onChange={(e) => setResponse(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                  Be professional and clear in your response.
                                  This will be sent to the customer.
                                </p>
                              </div>

                              <div>
                                <Label
                                  htmlFor="proof"
                                  className="text-gray-700 font-semibold"
                                >
                                  Upload Evidence (Optional)
                                </Label>
                                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-sm text-gray-600 mb-1">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Upload photos or documents to support your
                                    response (PNG, JPG, PDF)
                                  </p>
                                  <Input
                                    id="proof"
                                    type="file"
                                    accept="image/*,.pdf"
                                    className="hidden"
                                    multiple
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 justify-end pt-4 border-t">
                              <Button
                                variant="outline"
                                className="border-gray-300"
                              >
                                Save Draft
                              </Button>
                              <Button className="bg-green-600 hover:bg-green-700 text-white">
                                Submit Response
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Report Preview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.orderId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Listing</p>
                    <p className="text-sm font-medium text-gray-900">
                      {report.listing}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Refund</p>
                    <p className="text-sm font-medium text-gray-900">
                      EGP {report.refund}
                    </p>
                  </div>
                </div>

                {/* Issue Summary */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {report.reason}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {report.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Resolution Note */}
                {report.resolution && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-green-800">
                        {report.resolution}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

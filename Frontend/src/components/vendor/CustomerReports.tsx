import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, FileText, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

const reports = [
  {
    id: 'REP-001',
    customer: 'Ahmed Hassan',
    orderId: 'ORD-045',
    listing: 'Fresh Croissants Pack',
    reason: 'Item Quality Issue',
    description: 'Croissants were stale and not fresh as advertised',
    status: 'Under Review',
    date: '2025-11-22 10:30',
    refund: 'EGP 45',
  },
  {
    id: 'REP-002',
    customer: 'Sara Mohamed',
    orderId: 'ORD-032',
    listing: 'Mixed Pastries Box',
    reason: 'Missing Items',
    description: 'Box was supposed to have 12 items but only had 8',
    status: 'Resolved',
    date: '2025-11-21 15:45',
    refund: 'EGP 20 (Partial)',
  },
  {
    id: 'REP-003',
    customer: 'Khaled Ali',
    orderId: 'ORD-028',
    listing: 'Bread Assortment',
    reason: 'Wrong Item',
    description: 'Received white bread instead of whole wheat bread',
    status: 'Pending Response',
    date: '2025-11-21 09:15',
    refund: 'EGP 30',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    case 'Under Review':
      return 'bg-yellow-100 text-yellow-800';
    case 'Pending Response':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function CustomerReports() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1>Customer Reports</h1>
        <p className="text-gray-600">Review and respond to customer reports</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Response</p>
              <p className="text-2xl">1</p>
            </div>
            <AlertCircle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Under Review</p>
              <p className="text-2xl">1</p>
            </div>
            <FileText className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl">1</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by report ID, customer, or order..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{report.id}</p>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{report.date}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View & Respond
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Report Details - {report.id}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Customer</Label>
                          <p>{report.customer}</p>
                        </div>
                        <div>
                          <Label>Order ID</Label>
                          <p>{report.orderId}</p>
                        </div>
                        <div>
                          <Label>Listing</Label>
                          <p>{report.listing}</p>
                        </div>
                        <div>
                          <Label>Refund Amount</Label>
                          <p>{report.refund}</p>
                        </div>
                      </div>
                      <div>
                        <Label>Reason</Label>
                        <p>{report.reason}</p>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                      <div>
                        <Label htmlFor="response">Your Response</Label>
                        <Textarea
                          id="response"
                          placeholder="Provide your response and any proof or explanation..."
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="proof">Upload Proof (Optional)</Label>
                        <Input id="proof" type="file" accept="image/*" />
                        <p className="text-sm text-gray-500 mt-1">
                          Upload photos or documents to support your response
                        </p>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline">Save Draft</Button>
                        <Button>Submit Response</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Customer</p>
                  <p>{report.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Order</p>
                  <p>{report.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Listing</p>
                  <p>{report.listing}</p>
                </div>
                <div>
                  <p className="text-gray-600">Refund</p>
                  <p>{report.refund}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t">
                <p className="text-sm">
                  <span className="text-gray-600">Reason:</span> {report.reason}
                </p>
                <p className="text-sm text-gray-600 mt-1">{report.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
}

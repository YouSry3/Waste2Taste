import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Flag,
  Clock,
  User,
  Package
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

const vendorRequests = [
  { 
    id: 1, 
    businessName: 'Nile Valley Restaurant', 
    ownerName: 'Ahmed Hassan', 
    email: 'ahmed@nilevalley.com', 
    phone: '(+20) 2-111-2222', 
    address: 'Mohandessin, Giza',
    category: 'Restaurant',
    submitted: '2025-10-28',
    documents: ['Business License', 'Health Certificate'],
    status: 'Pending'
  },
  { 
    id: 2, 
    businessName: 'Cairo Fresh Bakery', 
    ownerName: 'Fatima Ali', 
    email: 'fatima@cairofresh.com', 
    phone: '(+20) 2-222-3333', 
    address: 'New Cairo',
    category: 'Bakery',
    submitted: '2025-10-29',
    documents: ['Business License', 'Food Safety Certificate'],
    status: 'Pending'
  },
  { 
    id: 3, 
    businessName: 'Mediterranean Cafe', 
    ownerName: 'Omar Saeed', 
    email: 'omar@medcafe.com', 
    phone: '(+20) 2-333-4444', 
    address: 'Zamalek, Cairo',
    category: 'Cafe',
    submitted: '2025-10-27',
    documents: ['Business License'],
    status: 'Pending'
  },
];

const customerReports = [
  {
    id: 1,
    reporter: 'Sarah Johnson',
    vendor: 'Green Valley Bakery',
    listing: 'Bakery Surprise Bag',
    orderId: '#ORD-1234',
    issue: 'Food Quality',
    description: 'Items were past expiration date',
    submitted: '2025-10-29',
    priority: 'High',
    status: 'Under Review'
  },
  {
    id: 2,
    reporter: 'Mike Chen',
    vendor: 'City Cafe',
    listing: 'Coffee & Pastries',
    orderId: '#ORD-1235',
    issue: 'Vendor No-Show',
    description: 'Vendor was closed during pickup window',
    submitted: '2025-10-29',
    priority: 'Medium',
    status: 'Under Review'
  },
  {
    id: 3,
    reporter: 'Emma Wilson',
    vendor: 'Downtown Deli',
    listing: 'Sandwich Pack',
    orderId: '#ORD-1236',
    issue: 'Misleading Description',
    description: 'Received different items than described',
    submitted: '2025-10-28',
    priority: 'Low',
    status: 'Resolved'
  },
];

const pendingListings = [
  {
    id: 1,
    vendor: 'Green Valley Bakery',
    title: 'Bakery Surprise Bag',
    category: 'Bakery',
    price: '$4.99',
    originalPrice: '$15.00',
    quantity: 5,
    pickupTime: '6:00 PM - 7:00 PM',
    submitted: '2025-10-30 10:30 AM',
    image: 'https://images.unsplash.com/photo-1696721497670-d57754966c1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBmb29kJTIwcGFzdHJpZXN8ZW58MXx8fHwxNzYxODI3NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    flagged: false,
    aiFlag: null
  },
  {
    id: 2,
    vendor: 'Fresh Market',
    title: 'Produce Box',
    category: 'Grocery',
    price: '$7.99',
    originalPrice: '$25.00',
    quantity: 8,
    pickupTime: '7:00 PM - 8:00 PM',
    submitted: '2025-10-30 09:15 AM',
    image: 'https://images.unsplash.com/photo-1677653805080-59c57727c84e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjE3MzgwODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    flagged: true,
    aiFlag: { type: 'Spoiled Food', confidence: 0.87, reason: 'AI detected visual signs of spoilage' }
  },
  {
    id: 3,
    vendor: 'Downtown Deli',
    title: 'Sandwich Pack',
    category: 'Restaurant',
    price: '$6.50',
    originalPrice: '$20.00',
    quantity: 4,
    pickupTime: '5:00 PM - 6:00 PM',
    submitted: '2025-10-30 08:45 AM',
    image: 'https://images.unsplash.com/photo-1705647405231-c481e117e609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW5kd2ljaCUyMGRlbGklMjBtZWF0fGVufDF8fHx8MTc2MTgyNzU5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    flagged: false,
    aiFlag: null
  },
  {
    id: 4,
    vendor: 'Organic Bistro',
    title: 'Meal Box',
    category: 'Restaurant',
    price: '$9.99',
    originalPrice: '$30.00',
    quantity: 4,
    pickupTime: '9:00 PM - 10:00 PM',
    submitted: '2025-10-30 11:00 AM',
    image: 'https://images.unsplash.com/photo-1625944527261-06c90f1901e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVwYXJlZCUyMG1lYWxzJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjE4Mjc1OTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    flagged: false,
    aiFlag: null
  },
  {
    id: 5,
    vendor: 'Sweet Treats',
    title: 'Dessert Box',
    category: 'Bakery',
    price: '$6.99',
    originalPrice: '$22.00',
    quantity: 6,
    pickupTime: '7:30 PM - 8:30 PM',
    submitted: '2025-10-30 10:00 AM',
    image: 'https://images.unsplash.com/photo-1706463996554-6c6318946b3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZSUyMGJha2VyeXxlbnwxfHx8fDE3NjE4Mjc2MDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    flagged: true,
    aiFlag: { type: 'Spoiled Food', confidence: 0.92, reason: 'AI detected mold or discoloration' }
  },
  {
    id: 6,
    vendor: 'City Cafe',
    title: 'Coffee & Pastries',
    category: 'Cafe',
    price: '$5.99',
    originalPrice: '$18.00',
    quantity: 3,
    pickupTime: '8:00 PM - 9:00 PM',
    submitted: '2025-10-30 09:30 AM',
    image: 'https://images.unsplash.com/photo-1730660501229-145c09eb9b7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBwYXN0cnklMjBjYWZlfGVufDF8fHx8MTc2MTgyNzYwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    flagged: false,
    aiFlag: null
  },
];

export function ModerationView() {
  const [selectedListing, setSelectedListing] = useState<typeof pendingListings[0] | null>(null);

  // Sort listings to show flagged ones first
  const sortedListings = [...pendingListings].sort((a, b) => {
    if (a.flagged && !b.flagged) return -1;
    if (!a.flagged && b.flagged) return 1;
    return 0;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Moderation</h1>
        <p className="text-gray-500">Review and approve platform content</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Pending Vendor Requests</p>
            <h3>{vendorRequests.filter(r => r.status === 'Pending').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Open Customer Reports</p>
            <h3>{customerReports.filter(r => r.status === 'Under Review').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Listings to Review</p>
            <div className="flex items-center gap-2">
              <h3>{pendingListings.length}</h3>
              {pendingListings.filter(l => l.flagged).length > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {pendingListings.filter(l => l.flagged).length} flagged
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="listings">Listing Moderation</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Requests</TabsTrigger>
          <TabsTrigger value="reports">Customer Reports</TabsTrigger>
        </TabsList>

        {/* Listing Moderation */}
        <TabsContent value="listings" className="space-y-4">
          {sortedListings.map((listing) => (
            <Card key={listing.id} className={listing.flagged ? 'border-2 border-red-500' : ''}>
              <CardContent className="p-6">
                {listing.flagged && listing.aiFlag && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-900">
                        <span>AI Flag: {listing.aiFlag.type}</span>
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {listing.aiFlag.reason} (Confidence: {(listing.aiFlag.confidence * 100).toFixed(0)}%)
                      </p>
                    </div>
                    <Badge variant="destructive">Priority Review</Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Image */}
                  <div className="md:col-span-1">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <ImageWithFallback
                        src={listing.image}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <h4 className="mb-1">{listing.title}</h4>
                      <p className="text-sm text-gray-600">{listing.vendor}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge>{listing.category}</Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{listing.quantity} available</span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        Pickup: {listing.pickupTime}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Package className="h-4 w-4" />
                        Submitted: {listing.submitted}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 line-through">{listing.originalPrice}</span>
                      <span className="text-green-600">{listing.price}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex flex-col gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="destructive" className="w-full">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Flag className="h-4 w-4 mr-2" />
                          Request Changes
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Request Changes</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Textarea
                            placeholder="Describe what needs to be changed..."
                            rows={4}
                          />
                          <Button className="w-full">Send to Vendor</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Vendor Requests */}
        <TabsContent value="vendors" className="space-y-4">
          {vendorRequests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Store className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4>{request.businessName}</h4>
                      <p className="text-sm text-gray-500">Owner: {request.ownerName}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{request.category}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      {request.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      {request.phone}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {request.address}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Submitted Documents:</p>
                    <div className="space-y-1">
                      {request.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          {doc}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Submitted: {request.submitted}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Vendor
                  </Button>
                  <Button variant="destructive">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button variant="outline">View Documents</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Customer Reports */}
        <TabsContent value="reports" className="space-y-4">
          {customerReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {report.reporter.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{report.reporter}</p>
                      <p className="text-xs text-gray-500">Order: {report.orderId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        report.priority === 'High' ? 'destructive' :
                        report.priority === 'Medium' ? 'default' :
                        'secondary'
                      }
                    >
                      {report.priority} Priority
                    </Badge>
                    <Badge variant="outline">{report.status}</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Vendor</p>
                    <p className="text-sm">{report.vendor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Listing</p>
                    <p className="text-sm">{report.listing}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Issue Type</p>
                    <p className="text-sm">{report.issue}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="text-sm">{report.submitted}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm">{report.description}</p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">Contact User</Button>
                  <Button variant="outline">Contact Vendor</Button>
                  {report.status === 'Under Review' && (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700">Mark Resolved</Button>
                      <Button variant="destructive">Issue Warning</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { CheckCircle, XCircle, FileText, User, Mail, Phone, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

const requests = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    email: 'ahmed.h@email.com',
    phone: '(+20) 10-1234-5678',
    address: 'Nasr City, Cairo',
    reason: 'Financial Hardship',
    description: 'Lost job due to company downsizing. Supporting family of 4.',
    submitted: '2025-10-29',
    documents: ['National ID', 'Proof of Income'],
    status: 'Pending'
  },
  {
    id: 2,
    name: 'Fatima Ali',
    email: 'fatima.a@email.com',
    phone: '(+20) 11-2345-6789',
    address: 'Maadi, Cairo',
    reason: 'Unemployed',
    description: 'Recently unemployed, actively seeking work. Single mother of 2.',
    submitted: '2025-10-29',
    documents: ['National ID', 'Unemployment Certificate'],
    status: 'Pending'
  },
  {
    id: 3,
    name: 'Layla Ibrahim',
    email: 'layla.i@email.com',
    phone: '(+20) 12-3456-7890',
    address: 'Heliopolis, Cairo',
    reason: 'Student',
    description: 'Full-time university student with limited income.',
    submitted: '2025-10-28',
    documents: ['Student ID', 'Enrollment Letter'],
    status: 'Pending'
  },
  {
    id: 4,
    name: 'Mahmoud Khalil',
    email: 'mahmoud.k@email.com',
    phone: '(+20) 15-4567-8901',
    address: 'Giza',
    reason: 'Low Income',
    description: 'Daily wage worker with inconsistent income. Family of 5.',
    submitted: '2025-10-27',
    documents: ['National ID', 'Income Statement'],
    status: 'Pending'
  },
];

export function VerificationRequests() {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Verification Requests</h1>
        <p className="text-gray-500">Review and approve users applying for assisted status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Pending Requests</p>
            <h3>{requests.filter(r => r.status === 'Pending').length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Reviewed Today</p>
            <h3>12</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500 mb-1">Average Review Time</p>
            <h3>2.5 hours</h3>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">{getInitials(request.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="mb-1">{request.name}</h4>
                      <Badge>{request.reason}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Submitted</p>
                      <p className="text-sm">{request.submitted}</p>
                    </div>
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
                      <p className="text-sm text-gray-500 mb-2">Documents Submitted:</p>
                      <div className="space-y-1">
                        {request.documents.map((doc, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <FileText className="h-3 w-3 text-gray-400" />
                            {doc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Reason for Application:</p>
                    <p className="text-sm">{request.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Reject Application</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <p className="text-sm text-gray-600">
                            Please provide a reason for rejecting this application:
                          </p>
                          <Textarea
                            placeholder="Explain the reason for rejection..."
                            rows={4}
                          />
                          <Button variant="destructive" className="w-full">
                            Confirm Rejection
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline">View Documents</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

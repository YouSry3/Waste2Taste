import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

const subAccounts = [
  {
    id: 'SUB-001',
    name: 'Ahmed Khalil',
    email: 'ahmed.khalil@greenvalley.com',
    role: 'Branch Manager',
    locations: ['Green Valley Bakery - Downtown', 'Green Valley Bakery - Heliopolis'],
    status: 'Active',
    createdDate: '2025-10-15',
  },
  {
    id: 'SUB-002',
    name: 'Sara Hassan',
    email: 'sara.hassan@greenvalley.com',
    role: 'Branch Manager',
    locations: ['Green Valley Bakery - Maadi'],
    status: 'Active',
    createdDate: '2025-09-20',
  },
  {
    id: 'SUB-003',
    name: 'Mohamed Ali',
    email: 'mohamed.ali@greenvalley.com',
    role: 'Operations Manager',
    locations: ['Green Valley Bakery - Downtown', 'Green Valley Bakery - Heliopolis', 'Green Valley Bakery - Maadi'],
    status: 'Active',
    createdDate: '2025-08-10',
  },
];

const allLocations = [
  'Green Valley Bakery - Downtown',
  'Green Valley Bakery - Heliopolis',
  'Green Valley Bakery - Maadi',
  'Green Valley Bakery - Nasr City',
  'Green Valley Bakery - 6th October',
];

export function CorporateControl() {
  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1>Corporate Control</h1>
          <p className="text-gray-600">Manage sub-accounts and location access</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Sub-Account
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sub-Account</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" placeholder="e.g., Branch Manager, Operations Manager" />
              </div>
              <div>
                <Label>Location Access</Label>
                <p className="text-sm text-gray-500 mb-3">
                  Select which vendor locations this sub-account can access
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {allLocations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox id={location} />
                      <label
                        htmlFor={location}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {location}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Create Sub-Account</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Sub-Accounts</p>
          <p className="text-2xl">{subAccounts.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Active Sub-Accounts</p>
          <p className="text-2xl">
            {subAccounts.filter((a) => a.status === 'Active').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Locations</p>
          <p className="text-2xl">{allLocations.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          {subAccounts.map((account) => (
            <Card key={account.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium">{account.name}</p>
                    <Badge className="bg-green-100 text-green-800">{account.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{account.email}</p>
                  <p className="text-sm text-gray-600 mb-3">{account.role}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      {account.locations.map((location) => (
                        <Badge key={location} variant="outline" className="text-xs">
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Created on {account.createdDate}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Sub-Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="editName">Full Name</Label>
                            <Input id="editName" defaultValue={account.name} />
                          </div>
                          <div>
                            <Label htmlFor="editEmail">Email Address</Label>
                            <Input id="editEmail" type="email" defaultValue={account.email} />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="editRole">Role</Label>
                          <Input id="editRole" defaultValue={account.role} />
                        </div>
                        <div>
                          <Label>Location Access</Label>
                          <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3 mt-2">
                            {allLocations.map((location) => (
                              <div key={location} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`edit-${location}`}
                                  defaultChecked={account.locations.includes(location)}
                                />
                                <label
                                  htmlFor={`edit-${location}`}
                                  className="text-sm leading-none"
                                >
                                  {location}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end pt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button>Save Changes</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Note:</span> Corporate Control is only available for accounts with 3 or more vendor locations. Sub-accounts can only access the locations you assign to them.
        </p>
      </Card>
    </div>
  );
}

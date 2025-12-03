import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Upload } from 'lucide-react';

export function CreateListing() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Create Listing</h1>
        <p className="text-gray-500">Add a new surplus food listing</p>
      </div>

      <div className="max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Listing Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Listing Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Listing Title</Label>
                <Input placeholder="e.g., Bakery Surprise Bag" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bakery">Bakery</SelectItem>
                    <SelectItem value="prepared">Prepared Food</SelectItem>
                    <SelectItem value="produce">Produce</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                placeholder="Describe what customers can expect in this surprise bag..."
                rows={4}
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Original Price</Label>
                <Input type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input type="number" placeholder="0.00" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label>Quantity Available</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>

            {/* Pickup Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pickup Start Time</Label>
                <Input type="time" />
              </div>
              <div className="space-y-2">
                <Label>Pickup End Time</Label>
                <Input type="time" />
              </div>
            </div>

            {/* Donation Option */}
            <div className="border rounded-lg p-4 bg-blue-50">
              <div className="flex items-start gap-3">
                <input type="checkbox" id="donation" className="mt-1" />
                <div className="flex-1">
                  <label htmlFor="donation" className="cursor-pointer">
                    <p>Make available for charity donation</p>
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Allow NGO partners to claim this listing for assisted customers at no cost
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                Publish Listing
              </Button>
              <Button variant="outline" className="flex-1">
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

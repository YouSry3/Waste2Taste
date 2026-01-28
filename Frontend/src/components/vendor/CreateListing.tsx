import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Upload, Info } from "lucide-react";

export function CreateListing() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Create Listing</h1>
          <p className="text-gray-600 mt-1">
            Add a new surplus food listing for customers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Upload */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Listing Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="group border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 hover:bg-green-50/50 transition cursor-pointer">
                  <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2 group-hover:text-green-600" />
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG or JPG · Max 10MB
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Listing Title *</Label>
                  <Input
                    placeholder="e.g., Fresh Bakery Surprise Bag"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category *</Label>
                  <Select>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
                      <SelectItem value="bakery">🥖 Bakery</SelectItem>
                      <SelectItem value="prepared">🍱 Prepared Food</SelectItem>
                      <SelectItem value="produce">🥗 Produce</SelectItem>
                      <SelectItem value="dairy">🥛 Dairy</SelectItem>
                      <SelectItem value="other">📦 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Description *</Label>
                  <Textarea
                    rows={4}
                    placeholder="Describe what customers can expect in this surprise bag. Include types of items, freshness, and any special details..."
                    className="resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Pricing & Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Original Price *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Sale Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Available Quantity *
                  </Label>
                  <Input
                    type="number"
                    placeholder="How many bags available?"
                    className="h-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pickup Time */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Pickup Window</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Start Time *</Label>
                    <Input type="time" className="h-10" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">End Time *</Label>
                    <Input type="time" className="h-10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Charity Option */}
            <Card className="shadow-sm border-blue-200 bg-blue-50/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="donation"
                      className="mt-1 h-4 w-4 rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="donation"
                        className="cursor-pointer font-medium text-sm"
                      >
                        Enable charity donation
                      </Label>
                      <p className="text-xs text-gray-600 mt-1">
                        Allow NGO partners to claim this listing for assisted
                        customers at no cost.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="shadow-sm bg-green-50/50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Use clear, appetizing photos</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Be specific about contents</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Set realistic pickup windows</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">•</span>
                    <span>Price 50-70% off retail value</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 h-11">
                Publish Listing
              </Button>
              <Button variant="outline" className="w-full h-11">
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";
import { Card, CardContent } from "../../../../ui/card";
import { FileText, Eye } from "lucide-react";

interface DocumentViewerProps {
  open: boolean;
  documents: string[];
  onOpenChange: (open: boolean) => void;
}

export function DocumentViewer({
  open,
  documents,
  onOpenChange,
}: DocumentViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Submitted Documents</DialogTitle>
          <DialogDescription>
            Review the documents submitted by the vendor
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {documents.map((doc, index) => (
            <Card key={index} className="border border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doc}</p>
                      <p className="text-sm text-gray-500">PDF Document</p>
                    </div>
                  </div>
                  <button className="px-3 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

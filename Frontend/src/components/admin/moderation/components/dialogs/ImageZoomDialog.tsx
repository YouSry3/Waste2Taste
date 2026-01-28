import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../ui/dialog";

interface ImageZoomDialogProps {
  open: boolean;
  imageUrl: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ImageZoomDialog({
  open,
  imageUrl,
  onOpenChange,
}: ImageZoomDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Image Preview</DialogTitle>
        </DialogHeader>
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Full size preview"
              className="w-full rounded-lg"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

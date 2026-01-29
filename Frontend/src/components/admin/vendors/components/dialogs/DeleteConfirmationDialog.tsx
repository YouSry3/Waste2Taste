import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../../ui/dialog";
import { Button } from "../../../../ui/button";
import { Vendor } from "../../api/vendors.types";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onConfirm: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  vendor,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Vendor</DialogTitle>
        </DialogHeader>
        {vendor && (
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete <strong>{vendor.name}</strong>?
              This action cannot be undone.
            </p>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

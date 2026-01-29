import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../../../components/ui/dialog";
import { Button } from "../../../../../components/ui/button";
import { UserPlus } from "lucide-react";
import { UserForm } from "./UserForm";
import { UserFormData } from "../../types";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  formErrors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onAddUser: () => void;
  onResetForm: () => void;
}

export function AddUserDialog({
  open,
  onOpenChange,
  formData,
  formErrors,
  onInputChange,
  onAddUser,
  onResetForm,
}: AddUserDialogProps) {
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      onResetForm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>
        <UserForm
          formData={formData}
          formErrors={formErrors}
          onInputChange={onInputChange}
          onSubmit={onAddUser}
          submitLabel="Add User"
        />
      </DialogContent>
    </Dialog>
  );
}

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../../../components/ui/dialog';
import { UserForm } from './UserForm';
import { UserFormData } from '../../types';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formData: UserFormData;
  formErrors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  formData,
  formErrors,
  onInputChange,
  onSave,
  onCancel,
}: EditUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <UserForm
          formData={formData}
          formErrors={formErrors}
          onInputChange={onInputChange}
          onSubmit={onSave}
          onCancel={onCancel}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
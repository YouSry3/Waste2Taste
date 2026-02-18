// src/components/admin/listings/components/ListingForm.tsx
import { Label } from "../../../ui/label";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Button } from "../../../ui/button";
import { ListingFormProps } from "../types/listing.types";

export function ListingForm({
  formState,
  setFormState,
  formFields,
  onSubmit,
  submitLabel,
  isLoading = false,
}: ListingFormProps & { isLoading?: boolean }) {
  return (
    <div className="flex flex-col gap-4 mt-2">
      {formFields.map((field) => (
        <div key={field.key} className="mb-2">
          <Label htmlFor={field.key} className="mb-1">
            {field.label}
          </Label>
          {field.isTextarea ? (
            <Textarea
              id={field.key}
              placeholder={field.placeholder}
              className="py-2"
              value={formState[field.key as keyof typeof formState] || ""}
              onChange={(e) =>
                setFormState({ ...formState, [field.key]: e.target.value })
              }
              disabled={isLoading}
            />
          ) : (
            <Input
              id={field.key}
              type={field.type || "text"}
              placeholder={field.placeholder}
              className="py-2"
              value={formState[field.key as keyof typeof formState] || ""}
              onChange={(e) =>
                setFormState({
                  ...formState,
                  [field.key]:
                    field.type === "number"
                      ? Number(e.target.value)
                      : e.target.value,
                })
              }
              disabled={isLoading}
            />
          )}
        </div>
      ))}
      <Button
        className="bg-green-600 mt-2 text-white hover:bg-green-700"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
}

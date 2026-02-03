import { Upload, X } from "lucide-react";

interface ImageUploadSectionProps {
  images: File[];
  imagePreviews: string[];
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export function ImageUploadSection({
  images,
  imagePreviews,
  onUpload,
  onRemove,
}: ImageUploadSectionProps) {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
            Listing Photos
            <span className="text-xs font-normal text-gray-500">
              (Optional but recommended)
            </span>
          </h3>
        </div>

        {images.length < 3 && (
          <label className="group border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-green-500 hover:bg-green-50/50 transition-all cursor-pointer block">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3 group-hover:text-green-600 transition-colors" />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 10MB â€¢ {3 - images.length} remaining
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
          </label>
        )}

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={preview}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="h-3 w-3" />
                </button>
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

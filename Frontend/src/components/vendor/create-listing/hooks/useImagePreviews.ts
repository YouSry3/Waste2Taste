import { useEffect, useState } from "react";

export const useImagePreviews = (images: File[]) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    const previews = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);

    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [images]);

  return imagePreviews;
};

import React from "react";
import { cn } from "../../../../lib/utils";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: () => void;
  id: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onChange,
  id,
}) => {
  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          "flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200",
          checked
            ? "border-green-500 bg-green-500"
            : "border-gray-300 hover:border-gray-400",
        )}
      >
        {checked && (
          <svg
            className="h-3 w-3 text-white transition-all duration-200 scale-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </label>
    </div>
  );
};

export default CustomCheckbox;

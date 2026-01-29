import { Download } from "lucide-react";
import { Button } from "../../../../ui/button";

interface ExportButtonProps {
  onClick: () => void;
  className?: string;
}

export function ExportButton({ onClick, className = "" }: ExportButtonProps) {
  return (
    <Button
      className={`flex items-center gap-2 hover:bg-green-50 border-green-600 border text-green-600 ${className}`}
      onClick={onClick}
    >
      <Download className="h-4 w-4" /> Export CSV
    </Button>
  );
}

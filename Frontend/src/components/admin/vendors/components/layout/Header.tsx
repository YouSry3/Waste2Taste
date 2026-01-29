import { Plus, Download } from "lucide-react";
import { Button } from "../../../../ui/button";

interface HeaderProps {
  onAddVendor: () => void;
  onExport: () => void;
}

export function Header({ onAddVendor, onExport }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-semibold">Vendors & Partners</h1>
        <p className="text-gray-500">
          Manage vendor accounts and NGO partnerships
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          className="flex items-center gap-2 hover:bg-green-50 border-green-600 border text-green-600"
          onClick={onExport}
        >
          <Download className="h-4 w-4" /> Export CSV
        </Button>

        <Button
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2 text-white"
          onClick={onAddVendor}
        >
          <Plus className="h-4 w-4" /> Add Vendor
        </Button>
      </div>
    </div>
  );
}

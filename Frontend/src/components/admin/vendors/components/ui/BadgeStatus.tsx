import { Badge } from "../../../../ui/badge";

interface BadgeStatusProps {
  status: "Active" | "Inactive";
  onClick: () => void;
}

export function BadgeStatus({ status, onClick }: BadgeStatusProps) {
  return (
    <Badge
      className={`h-fit cursor-pointer ${
        status === "Active"
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
      onClick={onClick}
    >
      {status}
    </Badge>
  );
}

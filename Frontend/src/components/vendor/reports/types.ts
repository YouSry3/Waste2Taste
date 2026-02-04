export type ReportStatus =
  | "Resolved"
  | "Under Review"
  | "Pending Response";

export type ReportPriority = "high" | "medium" | "low";

export interface ReportItem {
  id: string;
  customer: string;
  orderId: string;
  listing: string;
  reason: string;
  description: string;
  status: ReportStatus;
  date: string;
  refund: number;
  priority: ReportPriority;
  resolution?: string;
}

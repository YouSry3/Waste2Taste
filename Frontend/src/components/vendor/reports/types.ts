// export type ReportStatus =
//   | "Resolved"
//   | "Under Review"
//   | "Pending Response";

// export type ReportPriority = "high" | "medium" | "low";

// export interface ReportItem {
//   id: string;
//   customer: string;
//   orderId: string;
//   listing: string;
//   reason: string;
//   description: string;
//   status: ReportStatus;
//   date: string;
//   refund: number;
//   priority: ReportPriority;
//   resolution?: string;
// }



// src/components/vendor/reports/types.ts
export type ReportStatus =
  | "Resolved"
  | "Under Review"
  | "Pending Response";

export type ReportPriority = "high" | "medium" | "low";

export interface ReportItem {
  id: string;         // reportCode e.g. "REP-001"
  rawId: string;      // actual UUID for API calls
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
  responseCount?: number;
}
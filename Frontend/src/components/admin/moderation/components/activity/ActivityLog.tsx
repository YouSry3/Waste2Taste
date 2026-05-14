// import React from "react";
// import { ModerationAction } from "../../types";
// import { ActivityItem } from "./ActivityItem";
// import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "../../../../ui/alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../ui/select";
// import { Filter, Clock, Trash2 } from "lucide-react";

// interface ActivityLogProps {
//   activityLog: ModerationAction[];
//   sortBy: string;
//   statusFilter: string; // NEW: Added status filter
//   onSortByChange: (value: string) => void;
//   onStatusFilterChange: (value: string) => void; // NEW: Added status filter handler
//   onClearActivityLog: () => void;
//   onViewActivityDetails: (action: ModerationAction) => void;
// }

// export function ActivityLog({
//   activityLog,
//   sortBy,
//   statusFilter, // NEW
//   onSortByChange,
//   onStatusFilterChange, // NEW
//   onClearActivityLog,
//   onViewActivityDetails,
// }: ActivityLogProps) {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <Filter className="h-4 w-4 text-gray-500" />

//           {/* Status Filter - Moved from ListingModeration */}
//           <Select value={statusFilter} onValueChange={onStatusFilterChange}>
//             <SelectTrigger className="w-40">
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent className="bg-background border border-border rounded-md shadow-lg z-50">
//               <SelectItem value="all">All Actions</SelectItem>
//               <SelectItem value="approved">Approved</SelectItem>
//               <SelectItem value="rejected">Rejected</SelectItem>
//               <SelectItem value="changes_requested">
//                 Changes Requested
//               </SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Sort By */}

//         </div>

//         {/* Destructive Action - Clear Log */}
//         <AlertDialog>
//           <AlertDialogTrigger asChild>
//             <button className="px-4 py-2 border border-red-300 bg-white text-red-600 hover:bg-red-50 font-medium rounded-lg flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200">
//               <Trash2 className="h-4 w-4" />
//               Clear Log
//             </button>
//           </AlertDialogTrigger>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Clear Activity Log?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This will permanently delete all activity logs. This action
//                 cannot be undone.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 className="bg-red-600 hover:bg-red-700 text-white"
//                 onClick={onClearActivityLog}
//               >
//                 Clear Log
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Moderation Activity</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {activityLog.length === 0 ? (
//             <div className="text-center py-12">
//               <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//               <p className="text-gray-500">
//                 No activity yet. Start moderating to see logs here.
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {activityLog.map((action) => (
//                 <ActivityItem
//                   key={action.id}
//                   action={action}
//                   onViewDetails={() => onViewActivityDetails(action)}
//                 />
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import { useState, useEffect, useMemo } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:5000";

interface ActivityLogEntry {
  id: string;
  actorName: string;
  actionLabel: string;
  entityTypeLabel: string;
  title: string;
  description: string;
  oldValue: string | null;
  newValue: string | null;
  notes: string | null;
  createdAt: string;
  createdAtFormatted: string;
  viewType: string;
  viewId: string | null;
}

const actionStyles: Record<string, { bg: string; text: string; dot: string }> = {
  Approved:      { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500" },
  Rejected:      { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  StatusUpdated: { bg: "bg-blue-50",   text: "text-blue-700",   dot: "bg-blue-500" },
  Blocked:       { bg: "bg-orange-50", text: "text-orange-700", dot: "bg-orange-500" },
  Deleted:       { bg: "bg-red-50",    text: "text-red-700",    dot: "bg-red-500" },
  Created:       { bg: "bg-emerald-50",text: "text-emerald-700",dot: "bg-emerald-500" },
  Updated:       { bg: "bg-sky-50",    text: "text-sky-700",    dot: "bg-sky-500" },
};

const entityIcon: Record<string, string> = {
  product: "📦",
  vendor:  "🏪",
  report:  "🚩",
  order:   "🧾",
  user:    "👤",
};

function avatarColor(name: string): string {
  const colors = [
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
    "bg-blue-100 text-blue-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return colors[h % colors.length];
}

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function getActionStyle(action: string) {
  return actionStyles[action] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [filterActor, setFilterActor] = useState("");
  const [search, setSearch] = useState("");

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    "";

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/Logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : data.value ?? data.data ?? []);
      } catch (e: any) {
        setError(e.message ?? "Failed to load logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const uniqueActors = useMemo(
    () => [...new Set(logs.map((l) => l.actorName))].sort(),
    [logs]
  );

  const uniqueActions = useMemo(
    () => [...new Set(logs.map((l) => l.actionLabel))].sort(),
    [logs]
  );

  const uniqueEntities = useMemo(
    () => [...new Set(logs.map((l) => l.entityTypeLabel))].sort(),
    [logs]
  );

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      if (filterAction && l.actionLabel !== filterAction) return false;
      if (filterEntity && l.entityTypeLabel !== filterEntity) return false;
      if (filterActor && l.actorName !== filterActor) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.title.toLowerCase().includes(q) &&
          !l.description.toLowerCase().includes(q) &&
          !l.actorName.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [logs, filterAction, filterEntity, filterActor, search]);

  const clearFilters = () => {
    setFilterAction("");
    setFilterEntity("");
    setFilterActor("");
    setSearch("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
        <span className="ml-3 text-sm text-gray-500">Loading activity logs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 text-sm mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm underline text-gray-500 hover:text-gray-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Activity Log</h1>
        <p className="text-sm text-gray-500 mt-1">
          {logs.length} total events · {filtered.length} shown
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-3 outline-none focus:ring-1 focus:ring-gray-300 bg-white"
          style={{ minWidth: 160 }}
        />
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2 bg-white outline-none"
        >
          <option value="">All actions</option>
          {uniqueActions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <select
          value={filterEntity}
          onChange={(e) => setFilterEntity(e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2 bg-white outline-none"
        >
          <option value="">All entities</option>
          {uniqueEntities.map((e) => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
        <select
          value={filterActor}
          onChange={(e) => setFilterActor(e.target.value)}
          className="h-8 text-sm border border-gray-200 rounded-md px-2 bg-white outline-none"
        >
          <option value="">All actors</option>
          {uniqueActors.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        {(filterAction || filterEntity || filterActor || search) && (
          <button
            onClick={clearFilters}
            className="h-8 px-3 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50 text-gray-500"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Log list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No activity logs match your filters.
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
          {filtered.map((log) => {
            const style = getActionStyle(log.actionLabel);
            const av = avatarColor(log.actorName);
            return (
              <div key={log.id} className="flex gap-3 px-4 py-4 hover:bg-gray-50 transition-colors">
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${av}`}
                >
                  {initials(log.actorName)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-gray-900">{log.actorName}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${style.bg} ${style.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {log.actionLabel}
                    </span>
                    <span className="text-xs text-gray-400">
                      {entityIcon[log.viewType] ?? "📋"} {log.entityTypeLabel}
                    </span>
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {log.title}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {log.description}
                  </p>

                  {/* Old → New value */}
                  {(log.oldValue || log.newValue) && (
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {log.oldValue && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600 line-through">
                          {log.oldValue}
                        </span>
                      )}
                      {log.oldValue && log.newValue && (
                        <span className="text-gray-300 text-xs">→</span>
                      )}
                      {log.newValue && (
                        <span className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 font-medium">
                          {log.newValue}
                        </span>
                      )}
                    </div>
                  )}

                  {log.notes && (
                    <p className="text-xs text-gray-400 mt-1 italic">{log.notes}</p>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">{timeAgo(log.createdAt)}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{log.createdAtFormatted}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
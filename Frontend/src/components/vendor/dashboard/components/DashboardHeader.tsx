export function DashboardHeader() {
  return (
    <div className="mb-2 flex items-start justify-between gap-4 flex-wrap">
      <div className="flex-1 min-w-0">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! Here's your business overview for today
        </p>
        <div className="flex gap-3 mt-3 text-xs text-gray-400 flex-wrap">
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+N</kbd>
            <span>New Listing</span>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="px-2 py-1 bg-gray-100 rounded border">Ctrl+O</kbd>
            <span>Orders</span>
          </div>
        </div>
      </div>
    </div>
  );
}

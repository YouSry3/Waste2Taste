import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Store, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";

const quickActions = [
  {
    title: "Manage Users",
    description: "Review, edit, and manage platform users.",
    icon: Users,
    to: "/panel/admin/users",
  },
  {
    title: "Moderation Queue",
    description: "Handle reports, listings, and approvals.",
    icon: ShieldCheck,
    to: "/panel/admin/moderation",
  },
  {
    title: "Vendor Directory",
    description: "Browse vendors and manage profiles.",
    icon: Store,
    to: "/panel/admin/vendors",
  },
];

export function QuickActions() {
  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <p className="text-sm text-gray-500">
          Jump to the most-used admin views.
        </p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} to={action.to} className="group">
                <div className="h-full rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-green-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-green-50 p-2 text-green-700 transition-colors group-hover:bg-green-100">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {action.title}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 transition-colors group-hover:text-green-600" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

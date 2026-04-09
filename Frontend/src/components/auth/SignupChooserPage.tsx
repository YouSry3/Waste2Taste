import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Shield, Store, ArrowRight } from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";

const signupOptions = [
  {
    title: "Vendor Signup",
    description:
      "Create a business account, upload your documents, and wait for admin approval.",
    to: "/signup/vendor",
    icon: Store,
    accent: "text-green-700",
    bg: "from-green-50 to-emerald-100",
    border: "border-green-200",
  },
  {
    title: "Admin Signup",
    description:
      "Create a moderation account for team members who manage the platform.",
    to: "/signup/admin",
    icon: Shield,
    accent: "text-blue-700",
    bg: "from-blue-50 to-cyan-100",
    border: "border-blue-200",
  },
  {
    title: "Charity Signup",
    description:
      "Register a charity account to review listings and manage approval requests.",
    to: "/signup/charity",
    icon: Heart,
    accent: "text-rose-700",
    bg: "from-rose-50 to-orange-100",
    border: "border-rose-200",
  },
];

export default function SignupChooserPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
            Waste2Taste
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900">
            Choose the account you want to create
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Vendor accounts go through admin approval. Admin and charity
            accounts continue with the standard signup flow.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {signupOptions.map((option, index) => {
            const Icon = option.icon;

            return (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.35 }}
              >
                <Card
                  className={`h-full border ${option.border} bg-gradient-to-br ${option.bg} p-6 shadow-lg`}
                >
                  <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80">
                    <Icon className={`h-7 w-7 ${option.accent}`} />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    {option.title}
                  </h2>
                  <p className="mt-3 min-h-24 text-sm leading-6 text-slate-600">
                    {option.description}
                  </p>
                  <Link to={option.to}>
                    <Button className="mt-6 w-full bg-slate-900 text-white hover:bg-slate-800">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline">Back to Login</Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Shield, Store, ArrowRight } from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";

const signupOptions = [
  {
    title: "Vendor Signup",
    description:
      "Create your account first, then complete a vendor request with business documents.",
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-0">
      <motion.div
        className="w-full max-w-5xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="text-center mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.24em] text-green-700">
            Waste2Taste
          </p>
          <h1 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-900">
            Choose the account you want to create
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 px-2">
            Vendor accounts go through admin approval. Admin and charity
            accounts continue with the standard signup flow.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  className={`h-full border ${option.border} bg-gradient-to-br ${option.bg} p-5 sm:p-6 shadow-lg flex flex-col`}
                >
                  <div className="mb-6 sm:mb-8 flex h-12 sm:h-14 w-12 sm:w-14 items-center justify-center rounded-2xl bg-white/80">
                    <Icon className={`h-6 sm:h-7 w-6 sm:w-7 ${option.accent}`} />
                  </div>
                  <h2 className="text-lg sm:text-2xl font-semibold text-slate-900">
                    {option.title}
                  </h2>
                  <p className="mt-2 sm:mt-3 min-h-20 sm:min-h-24 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                    {option.description}
                  </p>
                  <Link to={option.to} className="mt-auto pt-4 sm:pt-6">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 text-sm sm:text-base py-2 sm:py-3">
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link to="/">
            <Button variant="outline" className="text-sm sm:text-base py-2 sm:py-3">
              Back to Login
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

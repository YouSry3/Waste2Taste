// import { AccountSignupForm } from "./AccountSignupForm";

// export default function AdminSignupPage() {
//   return <AccountSignupForm role="admin" />;
// }



import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { AccountSignupForm } from "./AccountSignupForm";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { apiClient } from "../../services/api/apiClient";

export default function AdminSignupPage() {
  const [status, setStatus] = useState<"loading" | "exists" | "available">("loading");

  useEffect(() => {
    apiClient
      .get("/Auth/admin-exists")
      .then((res) => {
        setStatus(res.data?.exists ? "exists" : "available");
      })
      .catch(() => {
        // If the check fails, block registration to be safe
        setStatus("exists");
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm animate-pulse">Checking admin status...</p>
      </div>
    );
  }

  if (status === "exists") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <Card className="w-full p-8 shadow-xl text-center">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-blue-600 items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Admin Already Exists</h1>
            <p className="text-gray-500 text-sm mb-6">
              An admin account has already been registered for this platform.
              Only one admin is allowed.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Go to Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="w-full">
                  Choose Another Role
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <AccountSignupForm role="admin" />;
}
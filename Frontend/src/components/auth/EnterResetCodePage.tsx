// src/pages/EnterResetCodePage.tsx
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Key, Lock } from "lucide-react";

import { apiClient } from "../../services/api/apiClient";

type ResetPasswordConfirmPayload = {
  email: string;
  code: string;
  newPassword: string;
};

export default function EnterResetCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  const validationSchema = Yup.object({
    code: Yup.string()
      .required("Reset code is required")
      .min(4, "Code must be at least 4 characters"),
    newPassword: Yup.string()
      .required("New password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const resetPasswordConfirmMutation = useMutation({
    mutationFn: (payload: ResetPasswordConfirmPayload) =>
      apiClient.post("/Auth/reset-password", {
        email: payload.email,
        code: payload.code,
        newpassword: payload.newPassword, // ✅ match API
      }),

    onSuccess: () => {
      toast.success("Password has been reset successfully.");
      navigate("/login");
    },

    onError: (error: any) => {
      console.error("Reset password confirm error:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reset password.",
      );
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-6">
      <Toaster position="top-center" />

      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-full p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-green-600 items-center justify-center mb-4">
              <Key className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 font-semibold text-2xl">Enter Reset Code</h1>
            <p className="text-gray-600">
              Enter the code sent to your email and choose a new password
            </p>
          </div>

          <Formik
            initialValues={{ code: "", newPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              resetPasswordConfirmMutation.mutate({
                email,
                code: values.code,
                newPassword: values.newPassword,
              });
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Code input */}
                <div>
                  <Label htmlFor="code">Reset Code</Label>
                  <div className="relative mt-2">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="code"
                      name="code"
                      type="text"
                      placeholder="Enter the code"
                      className={`pl-10 border ${
                        touched.code && errors.code
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {touched.code && errors.code && (
                    <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                  )}
                </div>

                {/* New password input */}
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className={`pl-10 border ${
                        touched.newPassword && errors.newPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {touched.newPassword && errors.newPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={resetPasswordConfirmMutation.isPending}
                  >
                    {resetPasswordConfirmMutation.isPending
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>
                </motion.div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>
    </div>
  );
}

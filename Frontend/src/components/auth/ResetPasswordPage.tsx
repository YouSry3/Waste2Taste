// src/pages/ResetPasswordPage.tsx
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Mail, Store } from "lucide-react";

import { apiClient } from "../../services/api/apiClient";

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = async (values: { email: string }) => {
    console.log("Payload to send:", values); // ✅ Check payload
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(
        "/Auth/password-reset-code",
        values
      );
      console.log("Reset password response:", response.data);
      toast.success("If this email is registered, a reset link has been sent.");
      navigate("/login");
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast.error(err?.message || "Failed to send reset link.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 font-semibold text-2xl">Reset Your Password</h1>
            <p className="text-gray-600">
              Enter your email and we’ll send a reset link
            </p>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 border ${
                        touched.email && errors?.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {touched.email && errors?.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
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

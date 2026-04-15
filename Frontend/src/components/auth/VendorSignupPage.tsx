import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Lock, Mail, Phone, Store, User } from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { authService } from "../../services/auth/authService";
import { saveVendorSignupDraft } from "../../services/vendorApproval/vendorOnboardingStore";

const vendorSignupSchema = Yup.object({
  ownerName: Yup.string().required("Full name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function VendorSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (values: {
      ownerName: string;
      email: string;
      phoneNumber: string;
      password: string;
    }) => {
      await vendorSignupSchema.validate(values, { abortEarly: false });

      await authService.register({
        email: values.email,
        password: values.password,
        name: values.ownerName,
        phoneNumber: values.phoneNumber,
        role: "vendor",
      });

      saveVendorSignupDraft({
        ownerName: values.ownerName,
        email: values.email,
        phoneNumber: values.phoneNumber,
      });

    },
    onSuccess: () => {
      authService.clearLocalAuth();
      toast.success("Account created. Please sign in to continue.");
      navigate("/?panel=vendor");
    },
    onError: (error: any) => {
      if (error?.name === "ValidationError" && Array.isArray(error.inner)) {
        toast.error(error.inner[0]?.message || "Please complete the form.");
        return;
      }

      toast.error(error?.message || "Vendor signup failed");
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <Toaster position="top-center" />
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Card className="w-full p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-green-600 items-center justify-center mb-4">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 font-semibold text-2xl">
              Vendor Signup - Step 1
            </h1>
            <p className="text-gray-600">
              Create your account first, then complete the vendor request form.
            </p>
          </div>

          <Formik
            initialValues={{
              ownerName: "",
              email: "",
              phoneNumber: "",
              password: "",
            }}
            validationSchema={vendorSignupSchema}
            onSubmit={(values) => registerMutation.mutate(values)}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                <div>
                  <Label htmlFor="ownerName">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="ownerName"
                      name="ownerName"
                      placeholder="Owner full name"
                      className={`pl-10 ${touched.ownerName && errors.ownerName ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {touched.ownerName && errors.ownerName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.ownerName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="vendor@example.com"
                      className={`pl-10 ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="e.g. +201234567890"
                      className={`pl-10 ${touched.phoneNumber && errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a password"
                      className={`pl-10 pr-10 ${touched.password && errors.password ? "border-red-500" : "border-gray-300"}`}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword((current) => !current)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence mode="wait">
                        {showPassword ? (
                          <EyeOff key="hidden" className="h-4 w-4" />
                        ) : (
                          <Eye key="visible" className="h-4 w-4" />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  {touched.password && errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Continue to Step 2"}
                </Button>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Link to="/" className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button type="button" variant="outline" className="w-full">
                      Choose Another Signup
                    </Button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>
    </div>
  );
}

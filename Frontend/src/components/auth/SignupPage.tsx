// src/pages/SignUpPage.tsx
import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Shield,
  Store,
  Heart,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { authService, RegisterPayload } from "../../services/auth/authService";

export default function SignUpPage() {
  const [role, setRole] = useState<"admin" | "vendor" | "charity">("vendor");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const ROLES = [
    {
      value: "admin",
      label: "Moderation Panel",
      description: "Platform management",
      icon: Shield,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      value: "vendor",
      label: "Corporate Panel",
      description: "Vendor/Company",
      icon: Store,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      value: "charity",
      label: "Charity Panel",
      description: "NGO / Charity",
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  // Form validation
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password required"),
  });

  // Mutation using TanStack Query
  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate("/login");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Registration failed");
    },
  });

  const handleSubmit = (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    const payload: RegisterPayload = {
      name: values.name,
      email: values.email,
      password: values.password,
      type: role,
    };
    registerMutation.mutate(payload);
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
        <Card className="w-full max-w-2xl p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-green-600 items-center justify-center mb-4">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 font-semibold text-2xl">Create Your Account</h1>
            <p className="text-gray-600">Join Food Rescue Platform</p>
          </div>

          {/* Formik Form */}
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Name */}
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Your Name"
                      className={`pl-10 border ${
                        touched.name && errors?.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {touched.name && errors?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      className={`pl-10 pr-10 border ${
                        touched.password && errors?.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />

                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <AnimatePresence exitBeforeEnter>
                        {showPassword ? (
                          <EyeOff key="off" className="h-4 w-4" />
                        ) : (
                          <Eye key="on" className="h-4 w-4" />
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  {touched.password && errors?.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Role Selection */}
                <div className="w-full">
                  <Label className="mb-3 block">Choose Your Role</Label>
                  <RadioGroup
                    value={role}
                    onValueChange={(v) => setRole(v as any)}
                  >
                    <div className="flex flex-col w-full space-y-3">
                      {ROLES.map((opt) => {
                        const Icon = opt.icon;
                        const active = role === opt.value;
                        return (
                          <Label
                            key={opt.value}
                            htmlFor={opt.value}
                            className="w-full"
                          >
                            <div
                              className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all w-full ${
                                active
                                  ? "border-green-600 bg-green-50 shadow-sm scale-[1.01]"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <RadioGroupItem
                                id={opt.value}
                                value={opt.value}
                              />
                              <div
                                className={`h-12 w-12 rounded-lg ${opt.bg} flex items-center justify-center`}
                              >
                                <Icon className={`h-6 w-6 ${opt.color}`} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{opt.label}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                  {opt.description}
                                </p>
                              </div>
                            </div>
                          </Label>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={registerMutation.isLoading}
                  >
                    {registerMutation.isLoading
                      ? "Creating..."
                      : "Create Account"}
                  </Button>
                </motion.div>

                {/* Login Link */}
                <Link to="/login" className="w-full">
                  <Button className="w-full bg-white/90 border text-black hover:bg-green-600 hover:text-white transition-colors duration-300">
                    Already Have an Account? Login
                  </Button>
                </Link>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>
    </div>
  );
}

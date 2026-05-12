import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Shield,
  Heart,
  User,
} from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  authService,
  RegisterPayload,
} from "../../services/auth/authService";

type SignupRole = "admin" | "charity";

interface AccountSignupFormProps {
  role: SignupRole;
}

const config = {
  admin: {
    title: "Create Admin Account",
    subtitle: "Set up a moderation account for the platform team.",
    icon: Shield,
    buttonClass: "bg-blue-600 hover:bg-blue-700",
    iconClass: "bg-blue-600",
    pageClass: "from-blue-50 via-white to-cyan-50",
  },
  charity: {
    title: "Create Charity Account",
    subtitle: "Register a charity team account for verification and pickups.",
    icon: Heart,
    buttonClass: "bg-rose-600 hover:bg-rose-700",
    iconClass: "bg-rose-600",
    pageClass: "from-rose-50 via-white to-orange-50",
  },
} as const;

export function AccountSignupForm({ role }: AccountSignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const pageConfig = config[role];
  const HeaderIcon = pageConfig.icon;

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password required"),
    phoneNumber: Yup.string().required("Phone number is required"),
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      toast.success("Account created successfully!");
      navigate(`/?panel=${role}`);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Registration failed");
    },
  });

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${pageConfig.pageClass} flex items-center justify-center px-4 sm:px-6 py-6 sm:py-0`}
    >
      <Toaster position="top-center" />
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <Card className="w-full p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="text-center mb-6 sm:mb-8">
            <div
              className={`inline-flex h-12 sm:h-16 w-12 sm:w-16 rounded-2xl ${pageConfig.iconClass} items-center justify-center mb-3 sm:mb-4`}
            >
              <HeaderIcon className="h-7 sm:h-10 w-7 sm:w-10 text-white" />
            </div>
            <h1 className="mb-2 font-semibold text-xl sm:text-2xl lg:text-3xl">{pageConfig.title}</h1>
            <p className="text-sm sm:text-base text-gray-600">{pageConfig.subtitle}</p>
          </div>

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              phoneNumber: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              registerMutation.mutate({
                email: values.email,
                password: values.password,
                name: values.name,
                phoneNumber: values.phoneNumber,
                role,
              });
            }}
          >
            {({ errors, touched }) => (
              <Form className="space-y-4 sm:space-y-6">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Full Name</Label>
                  <div className="relative mt-2">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      className={`pl-10 text-sm sm:text-base ${touched.name && errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {touched.name && errors.name && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <div className="relative mt-2">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      className={`pl-10 text-sm sm:text-base ${touched.email && errors.email ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-sm sm:text-base">Phone Number</Label>
                  <div className="relative mt-2">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="e.g. +201234567890"
                      className={`pl-10 text-sm sm:text-base ${touched.phoneNumber && errors.phoneNumber ? "border-red-500" : "border-gray-300"}`}
                    />
                  </div>
                  {touched.phoneNumber && errors.phoneNumber && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Choose a password"
                      className={`pl-10 pr-10 text-sm sm:text-base ${touched.password && errors.password ? "border-red-500" : "border-gray-300"}`}
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
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full text-white text-sm sm:text-base py-2 sm:py-3 ${pageConfig.buttonClass}`}
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Creating account..."
                    : "Create Account"}
                </Button>

                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                  <Link to="/" className="w-full">
                    <Button type="button" variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3">
                      Back to Login
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button type="button" variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3">
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

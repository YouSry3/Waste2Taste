// src/pages/LoginPage.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Shield, Store, Heart, Lock, Mail, Eye, EyeOff } from "lucide-react";

import {
  authService,
  LoginCredentials,
  LoginResponse,
} from "../../services/auth/authService";

type PanelType = "admin" | "vendor" | "charity";

interface LoginPageProps {
  onLogin: (panelType: PanelType) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedPanel, setSelectedPanel] = useState<PanelType>("admin");
  const [useDemo, setUseDemo] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const PANEL_OPTIONS = [
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
      description: "Vendor management",
      icon: Store,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      value: "charity",
      label: "Charity Panel",
      description: "NGO verification",
      icon: Heart,
      color: "text-red-600",
      bg: "bg-red-50",
    },
  ];

  // ✅ TanStack + Axios: use your working authService.login
  const loginMutation = useMutation({
    mutationFn: (values: LoginCredentials) => authService.login(values),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Wrong Email or Password");
    },
    onSuccess: (res: LoginResponse) => {
      if (res.user.panelType !== selectedPanel) {
        toast.error(
          `Your account is registered as "${res.user.panelType}". Please select the correct panel.`,
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("authToken", res.token);
      localStorage.setItem("panelType", selectedPanel);
      toast.success("Login successful!");
      onLogin(selectedPanel);
    },
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email")
      .when([], {
        is: () => !useDemo,
        then: (schema) => schema.required("Email required"),
      }),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .when([], {
        is: () => !useDemo,
        then: (schema) => schema.required("Password required"),
      }),
  });

  const handleSubmit = (values: { email: string; password: string }) => {
    if (useDemo) {
      const mockUser = {
        id: `demo-${Date.now()}`,
        email: values.email || "demo@example.com",
        name: "Demo User",
        panelType: selectedPanel,
        roles: [selectedPanel],
      };
      localStorage.setItem("user", JSON.stringify(mockUser));
      localStorage.setItem("authToken", "demo-token-" + Date.now());
      localStorage.setItem("panelType", selectedPanel);
      toast.success("Demo login successful!");
      onLogin(selectedPanel);
      return;
    }

    loginMutation.mutate(values); // ✅ uses working authService.login
  };

  const isLoading = loginMutation.isLoading;

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
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-green-600 items-center justify-center mb-4">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-2 font-semibold text-2xl">
              Food Rescue Platform
            </h1>
            <p className="text-gray-600">Sign in to access your panel</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={useDemo ? undefined : validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Demo toggle */}
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Demo Mode
                    </p>
                    <p className="text-xs text-gray-500">
                      {useDemo
                        ? "Enabled (no backend)"
                        : "Disabled (API required)"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={useDemo ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseDemo(!useDemo)}
                  >
                    {useDemo ? "Switch to API" : "Switch to Demo"}
                  </Button>
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
                      placeholder={useDemo ? "Any password" : "Enter password"}
                      className={`pl-10 pr-10 border ${
                        touched.password && errors?.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <motion.button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
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

                  {/* Forgot Password */}
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/reset-password")}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                    >
                      Forgot your password?
                    </button>
                  </div>
                </div>

                {/* Panel selection */}
                <div className="w-full">
                  <Label className="mb-3 block">Select Panel Type</Label>
                  <RadioGroup
                    value={selectedPanel}
                    onValueChange={(v) => setSelectedPanel(v as PanelType)}
                  >
                    <div className="flex flex-col w-full space-y-3">
                      {PANEL_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = selectedPanel === opt.value;
                        return (
                          <Label
                            key={opt.value}
                            htmlFor={opt.value}
                            className="w-full"
                          >
                            <motion.div
                              className={`flex items-center space-x-3 rounded-lg border-2 p-4 cursor-pointer transition-all w-full ${
                                active
                                  ? "border-green-600 bg-green-50 shadow-sm scale-[1.01]"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
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
                            </motion.div>
                          </Label>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Button
                    type="button"
                    className="w-full  border hover:bg-green-700 hover:text-white"
                    onClick={() => navigate("/signup")}
                  >
                    Create a new account
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>
    </div>
  );
}

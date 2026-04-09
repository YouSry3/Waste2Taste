import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import {
  Eye,
  EyeOff,
  FileBadge,
  FileHeart,
  Lock,
  Mail,
  MapPin,
  Phone,
  Store,
  User,
} from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  authService,
  RegisterPayload,
} from "../../services/auth/authService";
import {
  createVendorDocument,
  fileToDataUrl,
  submitVendorApprovalRequest,
} from "../../services/vendorApproval/vendorApprovalStore";

const vendorSignupSchema = Yup.object({
  ownerName: Yup.string().required("Owner name is required"),
  businessName: Yup.string().required("Business name is required"),
  email: Yup.string().email("Invalid email").required("Email required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  category: Yup.string().required("Business category is required"),
  address: Yup.string().required("Business address is required"),
});

export default function VendorSignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [healthCertificate, setHealthCertificate] = useState<File | null>(null);
  const [formValues, setFormValues] = useState({
    ownerName: "",
    businessName: "",
    email: "",
    password: "",
    phoneNumber: "",
    category: "",
    address: "",
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      await vendorSignupSchema.validate(formValues, { abortEarly: false });

      if (!businessLicense) {
        throw new Error("Business license upload is required.");
      }

      if (!healthCertificate) {
        throw new Error("Health certificate upload is required.");
      }

      const payload: RegisterPayload = {
        email: formValues.email,
        password: formValues.password,
        name: formValues.ownerName,
        phoneNumber: formValues.phoneNumber,
        role: "vendor",
        businessName: formValues.businessName,
        address: formValues.address,
        category: formValues.category,
      };

      await authService.register(payload);

      const [businessLicenseUrl, healthCertificateUrl] = await Promise.all([
        fileToDataUrl(businessLicense),
        fileToDataUrl(healthCertificate),
      ]);

      submitVendorApprovalRequest({
        businessName: formValues.businessName,
        ownerName: formValues.ownerName,
        email: formValues.email,
        phone: formValues.phoneNumber,
        address: formValues.address,
        category: formValues.category,
        documents: [
          createVendorDocument(businessLicense, businessLicenseUrl, {
            kind: "business_license",
            label: "Business License",
          }),
          createVendorDocument(healthCertificate, healthCertificateUrl, {
            kind: "health_certificate",
            label: "Health Certificate",
          }),
        ],
      });
    },
    onSuccess: () => {
      toast.success("Vendor account created and sent for approval.");
      navigate(`/pending-approval?email=${encodeURIComponent(formValues.email)}`);
    },
    onError: (error: any) => {
      if (error?.name === "ValidationError" && Array.isArray(error.inner)) {
        toast.error(error.inner[0]?.message || "Please complete the form.");
        return;
      }

      toast.error(error?.message || "Vendor registration failed");
    },
  });

  const updateField =
    (field: keyof typeof formValues) =>
    (
      event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setFormValues((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
      <Toaster position="top-center" />
      <motion.div
        className="w-full max-w-3xl"
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
              Create Vendor Account
            </h1>
            <p className="text-gray-600">
              Submit your business details and documents for admin approval.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              registerMutation.mutate();
            }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <Label htmlFor="ownerName">Owner Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="ownerName"
                    value={formValues.ownerName}
                    onChange={updateField("ownerName")}
                    placeholder="Owner full name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <div className="relative mt-2">
                  <Store className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="businessName"
                    value={formValues.businessName}
                    onChange={updateField("businessName")}
                    placeholder="Business name"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formValues.email}
                    onChange={updateField("email")}
                    placeholder="vendor@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <div className="relative mt-2">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    value={formValues.phoneNumber}
                    onChange={updateField("phoneNumber")}
                    placeholder="e.g. +201234567890"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Business Category</Label>
                <Input
                  id="category"
                  value={formValues.category}
                  onChange={updateField("category")}
                  placeholder="Restaurant, Bakery, Cafe..."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formValues.password}
                    onChange={updateField("password")}
                    placeholder="Choose a password"
                    className="pl-10 pr-10"
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
              </div>
            </div>

            <div>
              <Label htmlFor="address">Business Address</Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="address"
                  value={formValues.address}
                  onChange={updateField("address")}
                  placeholder="Full business address"
                  className="min-h-24 pl-10"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/80 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FileBadge className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="font-medium text-gray-900">Business License</p>
                    <p className="text-sm text-gray-500">
                      Required for vendor approval.
                    </p>
                  </div>
                </div>
                <Input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(event) =>
                    setBusinessLicense(event.target.files?.[0] ?? null)
                  }
                />
                {businessLicense && (
                  <p className="mt-2 text-sm text-green-700">
                    Uploaded: {businessLicense.name}
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/80 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FileHeart className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Health Certificate
                    </p>
                    <p className="text-sm text-gray-500">
                      This will be reviewed by the admin.
                    </p>
                  </div>
                </div>
                <Input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(event) =>
                    setHealthCertificate(event.target.files?.[0] ?? null)
                  }
                />
                {healthCertificate && (
                  <p className="mt-2 text-sm text-green-700">
                    Uploaded: {healthCertificate.name}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending
                ? "Submitting for approval..."
                : "Create Vendor Account"}
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
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { FileBadge, FileHeart, Mail, MapPin, Phone, Store, User } from "lucide-react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { authService } from "../../services/auth/authService";
import {
  clearVendorSignupDraft,
  getVendorSignupDraft,
  saveVendorSignupDraft,
} from "../../services/vendorApproval/vendorOnboardingStore";
import {
  createVendorDocument,
  setPendingVendorApprovalEmail,
  submitVendorApprovalRequest,
} from "../../services/vendorApproval/vendorApprovalStore";
import { createVendorRequest } from "../../services/vendorApproval/vendorRequestService";
import MapPicker from "./MapPicker";

const requestSchema = Yup.object({
  businessName: Yup.string().required("Business name is required"),
  category: Yup.string().required("Category is required"),
  address: Yup.string().required("Business address is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  latitude: Yup.number()
    .nullable()
    .typeError("Please choose a location on the map.")
    .required("Please choose a location on the map."),
  longitude: Yup.number()
    .nullable()
    .typeError("Please choose a location on the map.")
    .required("Please choose a location on the map."),
});

const CATEGORY_OPTIONS = [
  { value: "1", label: "Bakery" },
  { value: "2", label: "Restaurant" },
  { value: "3", label: "Cafe" },
  { value: "4", label: "Grocery" },
  { value: "5", label: "Other" },
];

type VendorRequestFormValues = {
  businessName: string;
  category: string;
  address: string;
  phoneNumber: string;
  latitude: number | null;
  longitude: number | null;
};

export default function VendorRequestPage() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const draft = getVendorSignupDraft();
  const [isLeaving, setIsLeaving] = useState(false);
  const submitLockRef = useRef(false);

  const [businessLicense, setBusinessLicense] = useState<File | null>(null);
  const [healthCertificate, setHealthCertificate] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<VendorRequestFormValues>(() => ({
    businessName: draft?.businessName || "",
    category: draft?.category || "",
    address: draft?.address || "",
    phoneNumber: draft?.phoneNumber || "",
    latitude:
      typeof draft?.latitude === "number" ? draft.latitude : null,
    longitude:
      typeof draft?.longitude === "number" ? draft.longitude : null,
  }));

  const ownerName = useMemo(
    () => currentUser?.name || draft?.ownerName || "",
    [currentUser?.name, draft?.ownerName],
  );
  const email = useMemo(
    () => currentUser?.email || draft?.email || "",
    [currentUser?.email, draft?.email],
  );
  const phoneNumber = useMemo(
    () => currentUser?.phoneNumber || draft?.phoneNumber || "",
    [currentUser?.phoneNumber, draft?.phoneNumber],
  );
  const resolvedPhoneNumber = useMemo(
    () => formValues.phoneNumber.trim() || phoneNumber.trim(),
    [formValues.phoneNumber, phoneNumber],
  );
  const selectedCategoryLabel = useMemo(() => {
    return (
      CATEGORY_OPTIONS.find((option) => option.value === formValues.category)
        ?.label || formValues.category
    );
  }, [formValues.category]);
  const hasSelectedLocation = useMemo(
    () =>
      typeof formValues.latitude === "number" &&
      typeof formValues.longitude === "number",
    [formValues.latitude, formValues.longitude],
  );

  useEffect(() => {
    if (phoneNumber && !formValues.phoneNumber) {
      setFormValues((current) => ({
        ...current,
        phoneNumber,
      }));
    }
  }, [phoneNumber, formValues.phoneNumber]);

  useEffect(() => {
    if (!currentUser || currentUser.panelType !== "vendor") {
      return;
    }

    const vendorAccessState = authService.getVendorAccessState(currentUser);
    if (vendorAccessState === "pending" || vendorAccessState === "rejected") {
      navigate("/pending-approval", { replace: true });
      return;
    }

    if (vendorAccessState === "approved") {
      navigate("/panel/vendor/dashboard", { replace: true });
    }
  }, [
    currentUser,
    navigate,
  ]);

  useEffect(() => {
    saveVendorSignupDraft({
      ownerName,
      email,
      phoneNumber: resolvedPhoneNumber,
      businessName: formValues.businessName,
      category: formValues.category,
      address: formValues.address,
      latitude: formValues.latitude,
      longitude: formValues.longitude,
    });
  }, [
    email,
    formValues.address,
    formValues.businessName,
    formValues.category,
    formValues.latitude,
    formValues.longitude,
    ownerName,
    resolvedPhoneNumber,
  ]);

  const requestMutation = useMutation({
    mutationFn: async () => {
      if (submitLockRef.current) {
        throw new Error("__REQUEST_IN_PROGRESS__");
      }

      if (!currentUser || currentUser.panelType !== "vendor") {
        throw new Error("Please log in as a vendor to continue.");
      }

      const payload = {
        ...formValues,
        phoneNumber: resolvedPhoneNumber,
      };

      if (!businessLicense) {
        throw new Error("Business license upload is required.");
      }
      if (!healthCertificate) {
        throw new Error("Health certificate upload is required.");
      }
      if (!resolvedPhoneNumber) {
        throw new Error("Phone number is required.");
      }
      if (!hasSelectedLocation) {
        throw new Error("Please choose a location on the map.");
      }

      submitLockRef.current = true;
      try {
        await requestSchema.validate(payload, { abortEarly: false });

        const requestResult = await createVendorRequest({
          ownerName,
          businessName: formValues.businessName,
          email,
          phoneNumber: resolvedPhoneNumber,
          category: formValues.category,
          address: formValues.address,
          latitude: formValues.latitude ?? 0,
          longitude: formValues.longitude ?? 0,
          businessLicenseFile: businessLicense,
          healthCertificateFile: healthCertificate,
        });

        submitVendorApprovalRequest(
          {
            businessName: formValues.businessName,
            ownerName,
            email,
            phone: resolvedPhoneNumber,
            address: formValues.address,
            category: selectedCategoryLabel,
            latitude: formValues.latitude,
            longitude: formValues.longitude,
            documents: [
              createVendorDocument(businessLicense, {
                kind: "business_license",
                label: "Business License",
              }),
              createVendorDocument(healthCertificate, {
                kind: "health_certificate",
                label: "Health Certificate",
              }),
            ],
          },
          { requestId: requestResult.requestId },
        );

        authService.updateCurrentUser({
          phoneNumber: resolvedPhoneNumber,
        });
        saveVendorSignupDraft({
          ownerName,
          email,
          phoneNumber: resolvedPhoneNumber,
        });
        authService.setVendorRequestState({
          vendorRequestCompleted: true,
          vendorApprovalStatus: "pending",
        });
        setPendingVendorApprovalEmail(email);
        clearVendorSignupDraft();
      } finally {
        submitLockRef.current = false;
      }
    },
    onSuccess: () => {
      toast.success("Vendor request submitted. Waiting for admin approval.");
      navigate(`/pending-approval?email=${encodeURIComponent(email)}`, {
        replace: true,
      });
    },
    onError: (error: any) => {
      if (error?.message === "__REQUEST_IN_PROGRESS__") {
        return;
      }

      if (error?.name === "ValidationError" && Array.isArray(error.inner)) {
        toast.error(error.inner[0]?.message || "Please complete the form.");
        return;
      }
      toast.error(error?.message || "Failed to submit vendor request.");
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

  const handleLocationChange = ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    setFormValues((current) => ({
      ...current,
      latitude,
      longitude,
    }));
  };

  const handleBackToLogin = async () => {
    setIsLeaving(true);
    authService.clearLocalAuth();
    await new Promise((resolve) => setTimeout(resolve, 250));
    navigate("/?panel=vendor", { replace: true });
  };

  if (!currentUser || currentUser.panelType !== "vendor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Vendor Login Required
          </h1>
          <p className="text-slate-600 mb-6">
            Please sign in as a vendor to complete your request form.
          </p>
          <Link to="/?panel=vendor">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              Go to Vendor Login
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

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
              Vendor Request - Step 2
            </h1>
            <p className="text-gray-600">
              Complete your business details and upload required documents.
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              requestMutation.mutate();
            }}
          >
            <input type="hidden" value={ownerName} name="ownerName" readOnly />

            <div className="grid gap-4 rounded-2xl border border-green-100 bg-green-50/70 p-4 md:grid-cols-2">
              <p className="text-sm text-slate-700">
                <User className="mr-2 inline h-4 w-4" />
                Owner: <strong>{ownerName || "Not available"}</strong>
              </p>
              <p className="text-sm text-slate-700">
                <Mail className="mr-2 inline h-4 w-4" />
                Email: <strong>{email || "Not available"}</strong>
              </p>
              <p className="text-sm text-slate-700 md:col-span-2">
                <Phone className="mr-2 inline h-4 w-4" />
                Phone: <strong>{resolvedPhoneNumber || "Not available"}</strong>
              </p>
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
              <p className="mt-1 text-xs text-gray-500">
                If your phone is missing, enter it here to continue.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formValues.category}
                  onValueChange={(value) =>
                    setFormValues((current) => ({
                      ...current,
                      category: value,
                    }))
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Full Business Address</Label>
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

            <MapPicker
              latitude={formValues.latitude}
              longitude={formValues.longitude}
              onChange={handleLocationChange}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-dashed border-green-300 bg-green-50/80 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FileBadge className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="font-medium text-gray-900">Business License</p>
                    <p className="text-sm text-gray-500">Required document.</p>
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
                    <p className="text-sm text-gray-500">Required document.</p>
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
              disabled={requestMutation.isPending || !hasSelectedLocation}
            >
              {requestMutation.isPending
                ? "Submitting..."
                : hasSelectedLocation
                  ? "Submit Vendor Request"
                  : "Select Location to Continue"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleBackToLogin}
              disabled={isLeaving || requestMutation.isPending}
            >
              {isLeaving ? "Returning to login..." : "Back to Login"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

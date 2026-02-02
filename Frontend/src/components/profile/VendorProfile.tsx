import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  Target,
  Lock,
  Save,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Star,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { profileService } from "../../services/profile/profileService";
import { UserProfile, MonthlyGoals } from "../../types/profile";

export function VendorProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const currentProfile = profileService.getCurrentProfile();
    setProfile(currentProfile);
  };

  const profileValidationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    address: Yup.string(),
    businessName: Yup.string().required("Business name is required"),
    description: Yup.string(),
  });

  const goalsValidationSchema = Yup.object({
    foodSaved: Yup.number()
      .min(0, "Must be positive")
      .required("Food saved goal is required"),
    revenue: Yup.number()
      .min(0, "Must be positive")
      .required("Revenue goal is required"),
    customerRating: Yup.number()
      .min(0, "Must be at least 0")
      .max(5, "Cannot exceed 5")
      .required("Rating goal is required"),
  });

  const passwordValidationSchema = Yup.object({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Please confirm password"),
  });

  const handleProfileSubmit = async (values: any) => {
    try {
      const updatedProfile = await profileService.updateProfile(values);
      setProfile(updatedProfile);
      setIsEditingProfile(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  const handleGoalsSubmit = async (values: MonthlyGoals) => {
    try {
      await profileService.updateMonthlyGoals(values);
      loadProfile();
      setIsEditingGoals(false);
      toast.success("Monthly goals updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update goals");
    }
  };

  const handlePasswordSubmit = async (values: any, { resetForm }: any) => {
    try {
      await profileService.changePassword(values);
      resetForm();
      setIsChangingPassword(false);
      toast.success("Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/panel/vendor/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Vendor Profile</h1>
            <p className="text-gray-500">
              Manage your account and business settings
            </p>
          </div>
        </div>

        {/* Profile Overview Card */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {profile.businessName || profile.name}
                </h2>
                <p className="text-gray-600 mt-1">{profile.email}</p>
                <div className="flex gap-2 mt-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Store className="h-3 w-3 mr-1" />
                    Vendor
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Goals Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Monthly Goals
                </CardTitle>
                <CardDescription>
                  Set and track your business objectives
                </CardDescription>
              </div>
              {!isEditingGoals && (
                <Button
                  onClick={() => setIsEditingGoals(true)}
                  variant="outline"
                  size="sm"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Set Monthly Goals
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingGoals ? (
              <Formik
                initialValues={{
                  foodSaved: profile.monthlyGoals?.foodSaved || 1500,
                  revenue: profile.monthlyGoals?.revenue || 750,
                  customerRating: profile.monthlyGoals?.customerRating || 4.5,
                }}
                validationSchema={goalsValidationSchema}
                onSubmit={handleGoalsSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="foodSaved">Food Saved (lbs)</Label>
                        <div className="relative mt-2">
                          <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field
                            as={Input}
                            id="foodSaved"
                            name="foodSaved"
                            type="number"
                            className="pl-10"
                          />
                        </div>
                        {touched.foodSaved && errors.foodSaved && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.foodSaved}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="revenue">Revenue ($)</Label>
                        <div className="relative mt-2">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field
                            as={Input}
                            id="revenue"
                            name="revenue"
                            type="number"
                            step="0.01"
                            className="pl-10"
                          />
                        </div>
                        {touched.revenue && errors.revenue && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.revenue}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="customerRating">
                          Customer Rating (0-5)
                        </Label>
                        <div className="relative mt-2">
                          <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Field
                            as={Input}
                            id="customerRating"
                            name="customerRating"
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            className="pl-10"
                          />
                        </div>
                        {touched.customerRating && errors.customerRating && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.customerRating}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingGoals(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Goals
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : profile.monthlyGoals ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    <p className="text-sm font-medium text-orange-900">
                      Food Saved
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-orange-800">
                    {profile.monthlyGoals.foodSaved.toLocaleString()} lbs
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <p className="text-sm font-medium text-green-900">
                      Revenue
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-800">
                    ${profile.monthlyGoals.revenue.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-900">
                      Rating Goal
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-800">
                    {profile.monthlyGoals.customerRating.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="mb-2">No monthly goals set yet</p>
                <p className="text-sm">
                  Click "Set Monthly Goals" to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your business and contact details
                </CardDescription>
              </div>
              {!isEditingProfile && (
                <Button
                  onClick={() => setIsEditingProfile(true)}
                  variant="outline"
                  size="sm"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditingProfile ? (
              <Formik
                initialValues={{
                  name: profile.name,
                  email: profile.email,
                  phone: profile.phone || "",
                  address: profile.address || "",
                  businessName: profile.businessName || "",
                  description: profile.description || "",
                }}
                validationSchema={profileValidationSchema}
                onSubmit={handleProfileSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Field
                          as={Input}
                          id="name"
                          name="name"
                          className="mt-2"
                        />
                        {touched.name && errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Field
                          as={Input}
                          id="businessName"
                          name="businessName"
                          className="mt-2"
                        />
                        {touched.businessName && errors.businessName && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.businessName}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Field
                          as={Input}
                          id="email"
                          name="email"
                          type="email"
                          className="mt-2"
                        />
                        {touched.email && errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Field
                          as={Input}
                          id="phone"
                          name="phone"
                          className="mt-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Business Address</Label>
                        <Field
                          as={Input}
                          id="address"
                          name="address"
                          className="mt-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description">
                          Business Description
                        </Label>
                        <Field
                          as={Textarea}
                          id="description"
                          name="description"
                          rows={3}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditingProfile(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Full Name</Label>
                    <p className="mt-1 font-medium">{profile.name}</p>
                  </div>

                  <div>
                    <Label className="text-gray-500">Business Name</Label>
                    <p className="mt-1 font-medium">
                      {profile.businessName || "Not set"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="mt-1 font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {profile.email}
                    </p>
                  </div>

                  <div>
                    <Label className="text-gray-500">Phone</Label>
                    <p className="mt-1 font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {profile.phone || "Not set"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-gray-500">Business Address</Label>
                    <p className="mt-1 font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {profile.address || "Not set"}
                    </p>
                  </div>

                  {profile.description && (
                    <div className="md:col-span-2">
                      <Label className="text-gray-500">Description</Label>
                      <p className="mt-1 text-gray-700">
                        {profile.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your password</CardDescription>
              </div>
              {!isChangingPassword && (
                <Button
                  onClick={() => setIsChangingPassword(true)}
                  variant="outline"
                  size="sm"
                >
                  Change Password
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isChangingPassword ? (
              <Formik
                initialValues={{
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                }}
                validationSchema={passwordValidationSchema}
                onSubmit={handlePasswordSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Field
                        as={Input}
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        className="mt-2"
                      />
                      {touched.currentPassword && errors.currentPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Field
                        as={Input}
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className="mt-2"
                      />
                      {touched.newPassword && errors.newPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.newPassword}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="mt-2"
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsChangingPassword(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Update Password
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>Click "Change Password" to update your password</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

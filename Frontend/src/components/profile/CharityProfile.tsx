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
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Lock,
  Save,
  ArrowLeft,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { profileService } from "../../services/profile/profileService";
import { UserProfile } from "../../types/profile";

export function CharityProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
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
    businessName: Yup.string().required("Organization name is required"),
    registrationNumber: Yup.string(),
    description: Yup.string(),
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/panel/charity/dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Charity Profile</h1>
            <p className="text-gray-500">
              Manage your organization's information
            </p>
          </div>
        </div>

        {/* Profile Overview */}
        <Card className="border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
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
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <Heart className="h-3 w-3 mr-1" />
                    Charity
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Organization Information</CardTitle>
                <CardDescription>Update your charity details</CardDescription>
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
                  registrationNumber: profile.registrationNumber || "",
                  description: profile.description || "",
                }}
                validationSchema={profileValidationSchema}
                onSubmit={handleProfileSubmit}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Contact Name</Label>
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
                        <Label htmlFor="businessName">Organization Name</Label>
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

                      <div>
                        <Label htmlFor="registrationNumber">
                          Registration Number
                        </Label>
                        <Field
                          as={Input}
                          id="registrationNumber"
                          name="registrationNumber"
                          className="mt-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Organization Address</Label>
                        <Field
                          as={Input}
                          id="address"
                          name="address"
                          className="mt-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description">Mission Statement</Label>
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
                        className="bg-red-600 hover:bg-red-700"
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
                    <Label className="text-gray-500">Contact Name</Label>
                    <p className="mt-1 font-medium">{profile.name}</p>
                  </div>

                  <div>
                    <Label className="text-gray-500">Organization Name</Label>
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

                  <div>
                    <Label className="text-gray-500">Registration Number</Label>
                    <p className="mt-1 font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {profile.registrationNumber || "Not set"}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="text-gray-500">Address</Label>
                    <p className="mt-1 font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {profile.address || "Not set"}
                    </p>
                  </div>

                  {profile.description && (
                    <div className="md:col-span-2">
                      <Label className="text-gray-500">Mission Statement</Label>
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
                        className="bg-red-600 hover:bg-red-700"
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

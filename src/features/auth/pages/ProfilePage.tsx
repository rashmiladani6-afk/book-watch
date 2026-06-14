import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/shared/components/layout/Header";
import Footer from "@/shared/components/layout/Footer";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { useAuth } from "@/features/auth/context/AuthContext";
import {
  useChangePassword,
  useDeleteAccount,
  useEditProfile,
  useProfile,
} from "@/features/auth/hooks/useProfile";
import {
  fileToBase64,
  MAX_PROFILE_IMAGE_BYTES,
} from "@/features/auth/utils/profileImage";
import { ROUTES } from "@/shared/constants/routes";
import { getAuthUrl } from "@/lib/auth/authRedirect";
import { isValidPhone, isValidPassword } from "@/shared/utils/validators";
import { extractGarbaApiMessage } from "@/lib/garba/apiAuth";
import { normalizeProfileMobile } from "@/features/auth/services/profileService";
import { toast } from "sonner";
import { Camera, Loader2, Lock, Mail, Pencil, Phone, Trash2, User } from "lucide-react";

const getProfileImageUrl = (image: string | null | undefined) => {
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  if (image.startsWith("data:image")) return image;
  if (/^[A-Za-z0-9+/=]+$/.test(image) && image.length > 100) {
    return `data:image/jpeg;base64,${image}`;
  }
  return `/garba-auth${image.startsWith("/") ? image : `/${image}`}`;
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, session, loading: authLoading, signIn, signOut } = useAuth();
  const { data, isLoading, error, refetch } = useProfile(
    session?.access_token,
    !!user && !!session?.access_token && !authLoading,
  );
  const editProfile = useEditProfile(session?.access_token);
  const changePassword = useChangePassword(session?.access_token);
  const deleteAccount = useDeleteAccount(session?.access_token);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const profile = data?.status === "success" ? data.data : null;

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? "");
    setMobile(profile.mobile ?? "");
    setImageBase64(null);
    setImagePreview(null);
  }, [profile]);

  const resetForm = () => {
    if (!profile) return;
    setName(profile.name ?? "");
    setMobile(profile.mobile ?? "");
    setImageBase64(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > MAX_PROFILE_IMAGE_BYTES) {
      toast.error("Image must be smaller than 2 MB");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setImageBase64(base64);
      setImagePreview(URL.createObjectURL(file));
    } catch {
      toast.error("Could not read image file");
    } finally {
      e.target.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    const normalizedMobile = normalizeProfileMobile(mobile);
    if (!isValidPhone(normalizedMobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      const result = await editProfile.mutateAsync({
        name: name.trim(),
        mobile: normalizedMobile,
        image: imageBase64 ?? "",
      });

      if (result.status !== "success") {
        toast.error(result.message || "Could not update profile");
        return;
      }

      if (session?.access_token) {
        signIn({
          identifier: profile?.email || user?.email || "user",
          token: session.access_token,
          userId: profile?.id != null ? String(profile.id) : user?.id,
          name: name.trim(),
        });
      }

      toast.success(result.message || "Profile updated successfully");
      setIsEditing(false);
      setImageBase64(null);
      setImagePreview(null);
      await refetch();
    } catch (error) {
      toast.error(
        extractGarbaApiMessage(error) || "Could not update profile. Please try again.",
      );
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword.trim()) {
      toast.error("Please enter your current password");
      return;
    }
    if (!isValidPassword(newPassword)) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (oldPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    try {
      const result = await changePassword.mutateAsync({
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (result.status !== "success") {
        toast.error(result.message || "Could not change password");
        return;
      }

      toast.success(result.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        extractGarbaApiMessage(error) || "Could not change password. Please try again.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteAccount.mutateAsync();
      if (result.status !== "success") {
        toast.error(result.message || "Could not delete account");
        return;
      }

      setDeleteOpen(false);
      toast.success(result.message || "Account deleted successfully");
      await signOut();
      navigate(ROUTES.HOME, { replace: true });
    } catch {
      toast.error("Could not delete account. Please try again.");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center text-muted-foreground">
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-lg mb-4">Please sign in to view your profile.</p>
          <Link to={getAuthUrl(ROUTES.PROFILE)}>
            <Button>Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-destructive mb-4">Unable to load profile.</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarSrc =
    imagePreview || getProfileImageUrl(profile.image);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container max-w-2xl py-10">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatarSrc} alt={profile.name} />
                  <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                    {initials || "U"}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted"
                    aria-label="Upload profile photo"
                  >
                    <Camera className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">User ID: {profile.id}</p>
              </div>
            </div>

            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />

          {isEditing ? (
            <form onSubmit={handleSave} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label>Profile photo</Label>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload photo
                  </Button>
                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImageBase64(null);
                        setImagePreview(null);
                      }}
                    >
                      Remove new photo
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">JPG or PNG, max 2 MB</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed here.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-mobile">Mobile</Label>
                <Input
                  id="profile-mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={editProfile.isPending}>
                  {editProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save changes"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-4">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{profile.mobile}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Lock className="h-4 w-4 text-primary" />
              Change password
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your account password.
            </p>

            <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old-password">Current password</Label>
                <Input
                  id="old-password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
              <Button type="submit" variant="outline" disabled={changePassword.isPending}>
                {changePassword.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Change password"
                )}
              </Button>
            </form>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-sm font-semibold text-destructive">Danger zone</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Permanently delete your account and sign out from all devices.
            </p>
            <Button
              variant="destructive"
              className="mt-4"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete account
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your Garba Town account will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteAccount.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void handleDelete();
              }}
              disabled={deleteAccount.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAccount.isPending ? "Deleting..." : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProfilePage;

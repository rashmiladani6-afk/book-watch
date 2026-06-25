import { useState, useEffect, useMemo } from "react";
import { Search, User, LogOut, MapPin, X, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/shared/components/ui/label";
import { ROUTES } from "@/shared/constants/routes";
import {
  Dialog,
  DialogContent,
} from "@/shared/components/ui/dialog";
import { useAuth as useAuthContext } from "@/features/auth/context/AuthContext";
import { useAuthActions } from "@/features/auth/hooks/useAuthActions";
import { extractAuthUser } from "@/features/auth/services/authService";
import { AUTH_MODAL_EVENT } from "@/features/auth/components/AuthModalOpener";
import { useCart } from "@/features/events/hooks/useCart";
import { useLocalCart } from "@/features/events/hooks/useLocalCart";
import { getCityCoordinates } from "@/features/location/constants/cityCoordinates";
import { useUpdateLocation } from "@/features/location/hooks/useUpdateLocation";
import {
  getSavedCityName,
  getSavedLocation,
  saveCityName,
  saveLocation,
} from "@/features/location/utils/locationStorage";
import AppLogo from "@/shared/components/common/AppLogo";

const popularCities = [
  { name: "Mumbai", icon: "🏢" },
  { name: "Delhi-NCR", icon: "🏛️" },
  { name: "Bengaluru", icon: "🏙️" },
  { name: "Hyderabad", icon: "🏰" },
  { name: "Chandigarh", icon: "🏛️" },
  { name: "Ahmedabad", icon: "🏰" },
  { name: "Pune", icon: "🏙️" },
  { name: "Kolkata", icon: "🏛️" },
  { name: "Kochi", icon: "🏝️" },
];

const allCities = [
  "Aalo", "Abohar", "Abu Road", "Achampet", "Acharapakkam", "Adampur", "Adilabad",
  "Adimali", "Adipur", "Adoni", "Agra", "Ahmedabad", "Ajmer", "Amritsar", "Bengaluru",
  "Bhopal", "Chandigarh", "Chennai", "Delhi", "Goa", "Hyderabad", "Indore", "Jaipur",
  "Kochi", "Kolkata", "Lucknow", "Mumbai", "Pune", "Surat", "Vadodara", "Visakhapatnam",
];

const sortedCities = [...allCities].sort((a, b) => a.localeCompare(b));

// ── Modal screen state ────────────────────────────────────────────────────
type ModalScreen = 'options' | 'signup' | 'signin' | 'otp';
type SigninMode = 'login' | 'forgot';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [show, setShow] = useState(false);
  const [screen, setScreen] = useState<ModalScreen>('options');
  const [signinMode, setSigninMode] = useState<SigninMode>('login');

  // shared identifier used for both sign-in and OTP screens
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // signup-specific fields
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [postLoginPath, setPostLoginPath] = useState<string | null>(null);

  const { user, session, loading: authLoading, signIn: contextSignIn, signOut: contextSignOut } = useAuthContext();
  const { signup, loginWithPassword, verifyOTP, forgotPassword, loading, error, clearError } = useAuthActions();
  const updateLocation = useUpdateLocation(session?.access_token);
  const { data: cartData } = useCart(
    session?.access_token,
    !authLoading && !!session?.access_token,
  );
  const { entries: localCartEntries } = useLocalCart();
  const cartItemCount = useMemo(() => {
    const apiEventId = cartData?.fullDetail?.event?.id;
    const apiCount = apiEventId ? 1 : 0;
    const extraLocal = localCartEntries.filter((entry) => entry.event.id !== apiEventId).length;
    return apiCount + extraLocal;
  }, [cartData?.fullDetail?.event?.id, localCartEntries]);

  // OTP timer
  useEffect(() => {
    if (!isTimerActive) return;
    if (otpTimer <= 0) { setIsTimerActive(false); return; }
    const interval = setInterval(() => setOtpTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setOtpTimer(180);
    setIsTimerActive(false);
  };

  const handleClose = () => {
    setShow(false);
    setScreen('options');
    setSigninMode('login');
    setIdentifier("");
    setSignupName(""); setSignupEmail(""); setSignupMobile("");
    setSignupPassword(""); setSigninPassword("");
    setPostLoginPath(null);
    resetOtp();
    clearError();
  };

  const completeSignIn = (identifier: string, userData: ReturnType<typeof extractAuthUser>) => {
    if (!userData) {
      throw new Error("No auth token in response");
    }

    const token =
      userData.user_token ??
      userData.token ??
      userData.access_token;

    if (!token) {
      throw new Error("No auth token in response");
    }

    const userId = userData.id != null ? String(userData.id) : undefined;
    contextSignIn({ identifier, token, userId, name: userData.name });
    toast.success("Signed in successfully!");
    handleClose();
    if (postLoginPath) {
      navigate(postLoginPath);
      setPostLoginPath(null);
    }
  };

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState(getSavedCityName);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [locationUpdating, setLocationUpdating] = useState(false);

  const applyLocation = async (
    cityLabel: string,
    latitude: number,
    longitude: number,
    options?: { requireAuth?: boolean },
  ) => {
    saveLocation({ city: cityLabel, latitude, longitude });
    setSelectedCity(cityLabel);

    if (!session?.access_token) {
      toast.success(`Showing events near ${cityLabel}`);
      return;
    }

    setLocationUpdating(true);
    try {
      const response = await updateLocation.mutateAsync({ latitude, longitude });
      if (response.status !== "success") {
        toast.error(response.message || "Could not update location");
        return;
      }
      toast.success(`Location updated: ${cityLabel}`);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Could not update location";
      toast.error(message);
    } finally {
      setLocationUpdating(false);
    }
  };

  useEffect(() => {
    const handleOpenAuthModal = (event: Event) => {
      const returnTo = (event as CustomEvent<{ returnTo?: string }>).detail?.returnTo;
      if (returnTo) {
        setPostLoginPath(returnTo);
      }
      setScreen("options");
      setShow(true);
    };

    window.addEventListener(AUTH_MODAL_EVENT, handleOpenAuthModal);
    return () => window.removeEventListener(AUTH_MODAL_EVENT, handleOpenAuthModal);
  }, []);

  useEffect(() => {
    if (!session?.access_token || authLoading) return;

    const saved = getSavedLocation();
    if (!saved) return;

    void updateLocation.mutateAsync({
      latitude: saved.latitude,
      longitude: saved.longitude,
    });
  }, [session?.access_token, authLoading]);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported in this browser");
      return;
    }

    setLocationUpdating(true);
    toast.info("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setShowModal(false);
        await applyLocation("Your location", latitude, longitude);
        setLocationUpdating(false);
      },
      (geoError) => {
        setLocationUpdating(false);
        toast.error(geoError.message || "Could not detect your location");
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      setShowMobileSearch(false);
      if (onSearch) onSearch(searchQuery);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSignOut = async () => {
    await contextSignOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleGoogleSignIn = () => toast.info("Google sign-in coming soon!");
  const handleAppleSignIn = () => toast.info("Apple sign-in coming soon!");

  // ── Signup flow ───────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signupRes = await signup(signupName, signupEmail, signupMobile, signupPassword);
      console.log('Signup response:', signupRes);
      setIdentifier(signupEmail);
      // Auto-fill OTP if returned in signup response
      const signupOtp = signupRes?.OTP ? String(signupRes.OTP) : null;
      if (signupOtp) {
        setOtp(signupOtp.padEnd(6, '').slice(0, 6).split(''));
        toast.success(`Account created! Your OTP is: ${signupOtp}`, { duration: 30000 });
      } else {
        toast.success("Account created! OTP sent to your email.");
      }
      setScreen('otp');
      setOtpTimer(180);
      setIsTimerActive(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Signup failed");
    }
  };

  // ── Sign-in (password) flow ───────────────────────────────────────────────
  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginWithPassword(identifier, signinPassword);
      completeSignIn(identifier, extractAuthUser(response.data));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Sign in failed");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(identifier);
      if (response.status !== 'success') {
        toast.error(response.message || 'Could not send reset instructions');
        return;
      }

      const resetOtp = response?.OTP ? String(response.OTP) : response?.otp ? String(response.otp) : null;
      if (resetOtp) {
        toast.success(`${response.message || 'OTP sent'} — OTP: ${resetOtp}`, { duration: 30000 });
      } else {
        toast.success(response.message || 'Reset instructions sent to your email');
      }

      clearError();
      setSigninMode('login');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Could not send reset instructions');
    }
  };

  // ── OTP input helpers ─────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      document.getElementById(`otp-${index - 1}`)?.focus();
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) { toast.error("Please enter the complete 6-digit OTP"); return; }

    try {
      const response = await verifyOTP(otpCode, identifier);
      completeSignIn(identifier, extractAuthUser(response.data));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Invalid OTP");
    }
  };

  const handleCitySelect = async (cityName: string) => {
    setShowModal(false);

    const coords = getCityCoordinates(cityName);
    if (!coords) {
      saveCityName(cityName);
      setSelectedCity(cityName);
      toast.success(`City selected: ${cityName}`);
      toast.info("Use a popular city or detect location for nearby events");
      return;
    }

    await applyLocation(cityName, coords.latitude, coords.longitude);
  };

  const toggleShowAllCities = () => setShowAllCities((p) => !p);

  // ── Render modal screens ──────────────────────────────────────────────────

  const renderOptions = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Get Started</h2>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-gray-700 font-medium">Continue with Google</span>
        </button>

        <button
          onClick={() => { clearError(); setSigninMode('login'); setScreen('signin'); }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <User className="h-5 w-5 text-gray-600" />
          <span className="text-gray-700 font-medium">Sign In</span>
        </button>

        <button
          onClick={() => { clearError(); setScreen('signup'); }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#955F3B] rounded-lg hover:bg-[#f5ebe3] transition-colors"
        >
          <User className="h-5 w-5 text-[#955F3B]" />
          <span className="text-[#955F3B] font-medium">Create Account</span>
        </button>

        <button
          onClick={handleAppleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="text-gray-700 font-medium">Continue with Apple</span>
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        By continuing you agree to our{" "}
        <a href="#" className="text-blue-600 hover:underline">Terms &amp; Conditions</a>{" "}
        and{" "}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="p-6">
      <button onClick={() => { clearError(); setScreen('options'); }} className="mb-4 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create Account</h2>
      <p className="text-sm text-gray-500 mb-6">Fill in your details to register</p>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="signup-name" className="text-sm font-medium text-gray-700">Full Name</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Your full name"
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            autoFocus
            required
            className="h-12 border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700">Email Address</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="name@example.com"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
            className="h-12 border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="signup-mobile" className="text-sm font-medium text-gray-700">Mobile Number</Label>
          <Input
            id="signup-mobile"
            type="tel"
            placeholder="10-digit mobile number"
            value={signupMobile}
            onChange={(e) => setSignupMobile(e.target.value)}
            required
            className="h-12 border-gray-300 rounded-lg"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700">Password</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
            className="h-12 border-gray-300 rounded-lg"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#955F3B] hover:bg-[#7a4d30] text-white font-medium mt-2 rounded-lg"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button type="button" onClick={() => { clearError(); setSigninMode('login'); setScreen('signin'); }} className="text-[#955F3B] hover:underline font-medium">
            Sign In
          </button>
        </p>
      </form>
    </div>
  );

  const renderSignin = () => (
    <div className="p-6">
      <button
        onClick={() => {
          clearError();
          setSigninMode('login');
          setScreen('options');
        }}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">
        {signinMode === 'forgot' ? 'Forgot Password' : 'Sign In'}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {signinMode === 'forgot'
          ? 'Enter your registered email or mobile to receive a reset OTP.'
          : 'Enter your email or mobile and password'}
      </p>

      {signinMode === 'forgot' ? (
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="signin-identifier" className="text-sm font-medium text-gray-700">
              Email or Mobile
            </Label>
            <Input
              id="signin-identifier"
              type="text"
              placeholder="name@example.com or 9876543210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoFocus
              required
              className="h-12 border-gray-300 rounded-lg"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#955F3B] hover:bg-[#7a4d30] text-white font-medium rounded-lg"
          >
            {loading ? 'Sending...' : 'Send reset OTP'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => { clearError(); setSigninMode('login'); }}
              className="text-[#955F3B] hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handlePasswordSignIn} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="signin-identifier" className="text-sm font-medium text-gray-700">
              Email or Mobile
            </Label>
            <Input
              id="signin-identifier"
              type="text"
              placeholder="name@example.com or 9876543210"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoFocus
              required
              className="h-12 border-gray-300 rounded-lg"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <Input
              id="signin-password"
              type="password"
              placeholder="Enter your password"
              value={signinPassword}
              onChange={(e) => setSigninPassword(e.target.value)}
              required
              className="h-12 border-gray-300 rounded-lg"
            />
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => { clearError(); setSigninMode('forgot'); }}
                className="text-sm text-[#955F3B] hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-[#955F3B] hover:bg-[#7a4d30] text-white font-medium rounded-lg"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-gray-500">
            New here?{' '}
            <button
              type="button"
              onClick={() => { clearError(); setSigninMode('login'); setScreen('signup'); }}
              className="text-[#955F3B] hover:underline font-medium"
            >
              Create Account
            </button>
          </p>
        </form>
      )}
    </div>
  );

  const renderOtp = () => (
    <div className="p-6">
      <button
        onClick={() => {
          clearError();
          resetOtp();
          setScreen(signupEmail ? 'signup' : 'signin');
        }}
        className="mb-4 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-8">Enter the 6-digit OTP sent to <span className="font-medium">{identifier}</span></p>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 rounded-lg focus:border-[#955F3B]"
            />
          ))}
        </div>

        <div className="text-center text-sm text-gray-500">
          {isTimerActive
            ? <>Resend OTP in <span className="font-semibold">{formatTime(otpTimer)}</span></>
            : (
              <button
                type="button"
                className="text-[#955F3B] hover:underline font-medium"
                    onClick={async () => {
                  if (!signupEmail || !signupPassword) {
                    toast.info("You can sign in with your password from the Sign In screen.");
                    return;
                  }

                  try {
                    const res = await signup(signupName, signupEmail, signupMobile, signupPassword);
                    const resendOtp = res?.OTP ? String(res.OTP) : res?.otp ? String(res.otp) : null;
                    if (resendOtp) {
                      setOtp(resendOtp.padEnd(6, '').slice(0, 6).split(''));
                      toast.success(`Your OTP is: ${resendOtp}`, { duration: 30000 });
                    } else {
                      toast.success("OTP resent! Check your email.");
                    }
                    setOtpTimer(180);
                    setIsTimerActive(true);
                  } catch {
                    toast.info("Account already created. Sign in with your password instead.");
                  }
                }}
              >
                Resend OTP
              </button>
            )
          }
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Button
          type="submit"
          disabled={loading || otp.join("").length !== 6}
          className="w-full h-12 bg-[#955F3B] hover:bg-[#7a4d30] text-white font-medium rounded-lg disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify & Sign In"}
        </Button>
      </form>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 max-w-full">
        {/* Left Section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-5 flex-1 min-w-0">
          <div className="flex shrink-0 items-center md:hidden">
            <AppLogo compact imageClassName="h-10 w-[4.5rem]" />
          </div>

          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-auto"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 lg:left-3 top-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 -translate-y-1/2 text-[#955F3B]" />
              <Input
                placeholder="Search Garba events, venues, passes"
                className="pl-8 lg:pl-10 pr-8 lg:pr-10 border border-gray-300 focus:border-[#955F3B] focus:ring-0 focus:outline-none text-[#111827] text-sm lg:text-base h-9 lg:h-10"
                style={{ boxShadow: "none", outline: "none" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(""); if (onSearch) onSearch(""); }}
                  className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-[#955F3B] hover:bg-[#7a4d30] text-white shrink-0 h-9 lg:h-10 px-3 lg:px-4 text-sm lg:text-base"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#955F3B] h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {user ? (
            <>
              <Link to={ROUTES.CART} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#955F3B] hover:text-[#7a4d30] h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                {cartItemCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toast.info("Please sign in to view your cart.");
                  setPostLoginPath(ROUTES.CART);
                  setShow(true);
                  setScreen("signin");
                }}
                className="text-[#955F3B] hover:text-[#7a4d30] h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10"
                aria-label="Cart"
              >
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </>
          )}

          <Button
            variant="default"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 bg-[#955F3B] hover:bg-[#7a4d30] text-xs sm:text-sm h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4"
          >
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 shrink-0" />
            <span className="truncate max-w-[60px] sm:max-w-[100px] md:max-w-none">
              {selectedCity || "City"}
            </span>
          </Button>

          {authLoading ? null : user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center gap-1 sm:gap-2 h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm border-[#955F3B] text-[#955F3B] hover:bg-[#955F3B]/10 hover:text-[#7a4d30]"
            >
              <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          ) : (
            <>
              <Button
                className="bg-[#955F3B] hover:bg-[#7a4d30] flex items-center gap-1 sm:gap-2 h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm"
                onClick={() => {
                  setScreen("options");
                  setShow(true);
                }}
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>

              <Dialog open={show} onOpenChange={(open) => { if (!open) handleClose(); }}>
                <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-md p-0 gap-0">
                  {screen === 'options' && renderOptions()}
                  {screen === 'signup' && renderSignup()}
                  {screen === 'signin' && renderSignin()}
                  {screen === 'otp' && renderOtp()}
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
          <div className="border-b bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(false)}
                className="shrink-0 h-9 w-9"
              >
                <X className="h-5 w-5" />
              </Button>
              <form onSubmit={handleSearch} className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#955F3B]" />
                  <Input
                    autoFocus
                    placeholder="Search Garba events, venues, passes"
                    className="pl-10 pr-10 border border-gray-300 focus:border-[#955F3B] focus:ring-0 focus:outline-none rounded-lg h-10 sm:h-11 text-sm sm:text-base"
                    style={{ boxShadow: "none", outline: "none" }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => { setSearchQuery(""); if (onSearch) onSearch(""); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-[#955F3B] hover:bg-[#7a4d30] text-white shrink-0 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
                >
                  Go
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* City Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-lg lg:max-w-xl max-h-[85vh] sm:max-h-[80vh] text-[#7a4d30] rounded-lg p-4 sm:p-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3">Select Your City</h2>
          </div>

          <div className={showAllCities ? "overflow-y-auto max-h-[calc(85vh-200px)] sm:max-h-[calc(80vh-200px)]" : ""}>
            <Button
              variant="ghost"
              onClick={detectLocation}
              disabled={locationUpdating}
              className="text-[#955F3B] bg-[#F7F7F7] hover:text-[#7a4d30] mb-3 flex items-center gap-2 hover:bg-[#f5ebe3] h-10 sm:h-11 text-sm sm:text-base w-full"
            >
              📍 {locationUpdating ? "Updating location..." : "Detect my location"}
            </Button>

            {!showAllCities ? (
              <>
                <h3 className="text-center font-semibold mb-3 text-base sm:text-lg">Popular Cities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {popularCities.map((city, i) => (
                    <button
                      key={i}
                      onClick={() => handleCitySelect(city.name)}
                      className="border rounded-md p-2 sm:p-3 hover:bg-gray-100 text-center transition"
                    >
                      <div className="text-xl sm:text-2xl">{city.icon}</div>
                      <p className="text-xs sm:text-sm mt-1">{city.name}</p>
                    </button>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <Button variant="link" onClick={toggleShowAllCities} className="text-[#955F3B] underline text-sm sm:text-base">
                    Show all cities
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-center font-semibold mb-3 text-base sm:text-lg">All Cities</h3>
                <div className="flex flex-col gap-1 px-2">
                  {sortedCities.map((city, i) => (
                    <p
                      key={i}
                      onClick={() => handleCitySelect(city)}
                      className="cursor-pointer text-[#955F3B] hover:text-[#7a4d30] py-1.5 sm:py-2 text-sm sm:text-base border-b border-gray-100 last:border-0"
                    >
                      {city}
                    </p>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <Button variant="link" onClick={toggleShowAllCities} className="text-[#955F3B] underline text-sm sm:text-base">
                    Hide all cities
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;

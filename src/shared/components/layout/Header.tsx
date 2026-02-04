import { useState, useEffect } from "react";
import { Search, User, LogOut, MapPin, X, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
// Remove Supabase imports
// import { useAuth as useSupabaseAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Label } from "@/shared/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
// Import custom auth hook
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { useAuth } from "../../../hooks/useAuth";

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

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [show, setShow] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const { user, signIn: contextSignIn, signOut: contextSignOut } = useAuthContext();
  const { sendOTP, verifyOTP, loading, error } = useAuth(); // From features/auth


  // Check if user is logged in (from localStorage)
  // useEffect(() => {
  //   const token = localStorage.getItem('authToken');
  //   const userEmail = localStorage.getItem('userEmail');
  //   if (token && userEmail) {
  //     setUser({ email: userEmail });
  //   }
  // }, []);

  // OTP Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, otpTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    setShow(false);
    setShowEmailForm(false);
    setShowOtpForm(false);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setOtpTimer(180);
    setIsTimerActive(false);
  };

  const handleShow = () => setShow(true);

  const handleEmailOption = () => {
    setShowEmailForm(true);
  };

  const handleBackToOptions = () => {
    setShowEmailForm(false);
    setShowOtpForm(false);
    setEmail("");
    setOtp(["", "", "", "", "", ""]);
    setOtpTimer(180);
    setIsTimerActive(false);
  };

  const handleBackToEmail = () => {
    setShowOtpForm(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpTimer(180);
    setIsTimerActive(false);
  };

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const detectLocation = () => {
    toast.info("Detecting your location...");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.info(`Searching for: ${searchQuery}`);
      setShowMobileSearch(false);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  // Updated Sign Out
  const handleSignOut = () => {
    contextSignOut();
    toast.success("Signed out successfully");
    navigate("/");
  };


  // Remove Supabase Google Sign In
  const handleGoogleSignIn = () => {
    toast.info("Google sign-in coming soon!");
  };

  const handleAppleSignIn = () => {
    toast.info("Apple sign-in coming soon!");
  };

  // Updated: Use custom API auth
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const response = await sendOTP(email, 'email');
      console.log(response.data.message);

      toast.success("OTP sent to your email!");
      setShowOtpForm(true);
      setOtpTimer(180);
      setIsTimerActive(true);
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Updated: Use custom API auth
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    try {
      const response = await verifyOTP(otpCode, email);
      console.log('Login successful:', response);

      // Use the context signIn method
      const token = response?.data?.token || response?.data?.access_token || 'temp-token';
      const userId = response?.data?.user_id || response?.data?.id || undefined;

      contextSignIn(email, token, userId);

      toast.success("Signed in successfully!");
      handleClose();
    } catch (error: any) {
      console.error('OTP verification failed:', error);
      toast.error(error?.response?.data?.message || "Invalid OTP");
    }
  };
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setShowModal(false);
    toast.success(`City selected: ${cityName}`);
  };

  const toggleShowAllCities = () => setShowAllCities((prev) => !prev);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 max-w-full">
        {/* Left Section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-5 flex-1 min-w-0">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif italic tracking-wide whitespace-nowrap"
              style={{ color: "#C9B194" }}
            >
              book
              <span style={{ color: "#F1F0E4" }}>&</span>
              watch
            </h1>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 flex-1 max-w-sm lg:max-w-md xl:max-w-lg mx-auto"
          >
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-2 lg:left-3 top-1/2 h-3.5 w-3.5 lg:h-4 lg:w-4 -translate-y-1/2 text-[#8B5E3C]" />
              <Input
                placeholder="Search for Movies, Events, Plays, Sports"
                className="pl-8 lg:pl-10 pr-8 lg:pr-10 border border-gray-300 focus:border-[#8B5E3C] focus:ring-0 focus:outline-none text-[#3E2723] text-sm lg:text-base h-9 lg:h-10"
                style={{ boxShadow: "none", outline: "none" }}
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    if (onSearch) onSearch("");
                  }}
                  className="absolute right-2 lg:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="bg-[#8B5E3C] hover:bg-[#5C4033] text-white shrink-0 h-9 lg:h-10 px-3 lg:px-4 text-sm lg:text-base"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 shrink-0">
          {/* Mobile Search Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#8B5E3C] h-8 w-8 sm:h-9 sm:w-9"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* City Select Button */}
          <Button
            variant="default"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 bg-[#8B5E3C] hover:bg-[#5B3A38] text-xs sm:text-sm h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4"
          >
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 shrink-0" />
            <span className="truncate max-w-[60px] sm:max-w-[100px] md:max-w-none">
              {selectedCity || "City"}
            </span>
          </Button>

          {/* Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm">
                  <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:mr-2" />
                  <span className="hidden md:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                className="bg-[#8B5E3C] hover:bg-[#5C4033] flex items-center gap-1 sm:gap-2 h-8 sm:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm"
                onClick={handleShow}
              >
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>

              {/* Sign In Dialog */}
              <Dialog open={show} onOpenChange={setShow}>
                <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-md p-0 gap-0">
                  {!showEmailForm && !showOtpForm ? (
                    // Get Started Screen
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">Get Started</h2>
                        <button
                          onClick={handleClose}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Google Sign In */}
                        <button
                          onClick={handleGoogleSignIn}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span className="text-gray-700 font-medium">Continue with Google</span>
                        </button>

                        {/* Email Sign In */}
                        <button
                          onClick={handleEmailOption}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Mail className="h-5 w-5 text-gray-600" />
                          <span className="text-gray-700 font-medium">Continue with Email</span>
                        </button>

                        {/* Apple Sign In */}
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
                        I agree to{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Terms & Conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                      </div>
                    </div>
                  ) : showEmailForm && !showOtpForm ? (
                    // Email Form Screen
                    <div className="p-6">
                      <button
                        onClick={handleBackToOptions}
                        className="mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>

                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Sign In with Email</h2>
                      <p className="text-sm text-gray-500 mb-6">Enter your email and password</p>

                      <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoFocus
                            required
                            className="h-12 border-gray-300 rounded-lg"
                          />
                        </div>

                        {error && (
                          <p className="text-sm text-red-600">{error}</p>
                        )}

                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full h-12 bg-[#8B5E3C] hover:bg-[#5C4033] text-white font-medium mt-6 rounded-lg"
                        >
                          {loading ? "Sending OTP..." : "Continue"}
                        </Button>
                      </form>
                    </div>
                  ) : (
                    // OTP Verification Screen
                    <div className="p-6">
                      <button
                        onClick={handleBackToEmail}
                        className="mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </button>

                      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify your Email</h2>
                      <p className="text-sm text-gray-500 mb-8">Enter OTP sent to {email}</p>

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
                              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg font-semibold border-2 rounded-lg focus:border-[#8B5E3C]"
                            />
                          ))}
                        </div>

                        <div className="text-center text-sm text-gray-500">
                          Expect OTP in <span className="font-semibold">{formatTime(otpTimer)}</span>
                        </div>

                        {error && (
                          <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        <Button
                          type="submit"
                          disabled={loading || otp.join("").length !== 6}
                          className="w-full h-12 bg-[#8B5E3C] hover:bg-[#5C4033] text-white font-medium rounded-lg disabled:opacity-50"
                        >
                          {loading ? "Verifying..." : "Continue"}
                        </Button>
                      </form>
                    </div>
                  )}
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
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8B5E3C]" />
                  <Input
                    autoFocus
                    placeholder="Search for Movies, Events, Plays, Sports"
                    className="pl-10 pr-10 border border-gray-300 focus:border-[#8B5E3C] focus:ring-0 focus:outline-none rounded-lg h-10 sm:h-11 text-sm sm:text-base"
                    style={{ boxShadow: "none", outline: "none" }}
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        if (onSearch) onSearch("");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="bg-[#8B5E3C] hover:bg-[#5C4033] text-white shrink-0 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base"
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
        <DialogContent className="w-[95vw] sm:w-[90vw] md:max-w-lg lg:max-w-xl max-h-[85vh] sm:max-h-[80vh] text-[#5B3A38] rounded-lg p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Select Your City</DialogTitle>
          </DialogHeader>

          <div className={showAllCities ? "overflow-y-auto max-h-[calc(85vh-200px)] sm:max-h-[calc(80vh-200px)]" : ""}>
            <Button
              variant="ghost"
              onClick={detectLocation}
              className="text-[#8B5E3C] bg-[#F7F7F7] hover:text-[#C2A68C] mb-3 flex items-center gap-2 hover:bg-[#EFE9E3] h-10 sm:h-11 text-sm sm:text-base w-full"
            >
              📍 Detect my location
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
                  <Button
                    variant="link"
                    onClick={toggleShowAllCities}
                    className="text-[#B17457] underline text-sm sm:text-base"
                  >
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
                      className="cursor-pointer text-[#B17457] hover:text-[#C2A68C] py-1.5 sm:py-2 text-sm sm:text-base border-b border-gray-100 last:border-0"
                    >
                      {city}
                    </p>
                  ))}
                </div>
                <div className="text-center mt-3">
                  <Button
                    variant="link"
                    onClick={toggleShowAllCities}
                    className="text-[#B17457] underline text-sm sm:text-base"
                  >
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
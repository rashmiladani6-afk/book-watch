// src/features/auth/pages/Auth.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/shared/constants/routes';

type Screen = 'options' | 'signup' | 'signin' | 'otp';

const Auth = () => {
  const navigate = useNavigate();
  const { user, signIn: contextSignIn } = useAuthContext();
  const { signup, sendOTP, verifyOTP, loading, error, clearError } = useAuth();

  const [screen, setScreen] = useState<Screen>('options');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupMobile, setSignupMobile] = useState('');

  // Redirect already-logged-in users
  useEffect(() => {
    if (user) navigate(ROUTES.HOME, { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!isTimerActive) return;
    if (otpTimer <= 0) { setIsTimerActive(false); return; }
    const t = setInterval(() => setOtpTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [isTimerActive, otpTimer]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setOtpTimer(180);
    setIsTimerActive(false);
  };

  // ── Signup ──────────────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const signupRes = await signup(signupName, signupEmail, signupMobile);
      console.log('Signup response:', signupRes);
      setIdentifier(signupEmail);
      const signupOtp = signupRes?.OTP ? String(signupRes.OTP) : null;
      if (signupOtp) {
        setOtp(signupOtp.padEnd(6, '').slice(0, 6).split(''));
        toast.success(`Account created! Your OTP is: ${signupOtp}`, { duration: 30000 });
      } else {
        toast.success('Account created! OTP sent to your email.');
      }
      setScreen('otp');
      setOtpTimer(180);
      setIsTimerActive(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Signup failed');
    }
  };

  // ── Sign-in ─────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendOTP(identifier);
      const otpValue = response?.otp ? String(response.otp) : null;
      if (otpValue) {
        setOtp(otpValue.padEnd(6, '').slice(0, 6).split(''));
        toast.success(`Your OTP is: ${otpValue}`, { duration: 30000 });
      } else {
        toast.success('OTP sent! Check your email.');
      }
      setScreen('otp');
      setOtpTimer(180);
      setIsTimerActive(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Failed to send OTP');
    }
  };

  // ── OTP helpers ─────────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) document.getElementById(`page-otp-${index + 1}`)?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      document.getElementById(`page-otp-${index - 1}`)?.focus();
  };

  // ── Verify OTP ──────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) { toast.error('Please enter the complete 6-digit OTP'); return; }

    try {
      const response = await verifyOTP(otpCode, identifier);
      const token =
        response?.data?.user_token ??
        response?.data?.token ??
        response?.data?.access_token;
      if (!token) throw new Error('No auth token in response');
      const userId = response?.data?.id != null
        ? String(response.data.id)
        : undefined;

      contextSignIn({ identifier, token, userId, name: response?.data?.name });
      toast.success('Signed in successfully!');
      navigate(ROUTES.HOME, { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Invalid OTP');
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">

        {/* Logo strip */}
        <div className="bg-[#8B5E3C] py-6 text-center">
          <h1 className="text-3xl font-serif italic tracking-wide text-[#C9B194]">
            book<span className="text-[#F1F0E4]">&</span>watch
          </h1>
        </div>

        {/* Screens */}
        {screen === 'options' && (
          <div className="p-8 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 text-center">Welcome</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Sign in or create a new account</p>

            <button
              onClick={() => { clearError(); setScreen('signin'); }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <User className="h-5 w-5 text-gray-600" />
              <span className="text-gray-700 font-medium">Sign In</span>
            </button>

            <button
              onClick={() => { clearError(); setScreen('signup'); }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#8B5E3C] rounded-lg hover:bg-[#fdf8f4] transition-colors"
            >
              <User className="h-5 w-5 text-[#8B5E3C]" />
              <span className="text-[#8B5E3C] font-medium">Create Account</span>
            </button>
          </div>
        )}

        {screen === 'signup' && (
          <div className="p-8">
            <button onClick={() => { clearError(); setScreen('options'); }} className="mb-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create Account</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in your details to register</p>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="page-signup-name">Full Name</Label>
                <Input id="page-signup-name" type="text" placeholder="Your full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} autoFocus required className="h-12" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="page-signup-email">Email Address</Label>
                <Input id="page-signup-email" type="email" placeholder="name@example.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} required className="h-12" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="page-signup-mobile">Mobile Number</Label>
                <Input id="page-signup-mobile" type="tel" placeholder="10-digit mobile number" value={signupMobile} onChange={(e) => setSignupMobile(e.target.value)} required className="h-12" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full h-12 bg-[#8B5E3C] hover:bg-[#5C4033] text-white font-medium rounded-lg">
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <button type="button" onClick={() => { clearError(); setScreen('signin'); }} className="text-[#8B5E3C] hover:underline font-medium">
                  Sign In
                </button>
              </p>
            </form>
          </div>
        )}

        {screen === 'signin' && (
          <div className="p-8">
            <button onClick={() => { clearError(); setScreen('options'); }} className="mb-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Sign In</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your email or mobile number</p>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="page-signin-id">Email or Mobile</Label>
                <Input id="page-signin-id" type="text" placeholder="name@example.com or 9876543210" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoFocus required className="h-12" />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full h-12 bg-[#8B5E3C] hover:bg-[#5C4033] text-white font-medium rounded-lg">
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </Button>

              <p className="text-center text-sm text-gray-500">
                New here?{' '}
                <button type="button" onClick={() => { clearError(); setScreen('signup'); }} className="text-[#8B5E3C] hover:underline font-medium">
                  Create Account
                </button>
              </p>
            </form>
          </div>
        )}

        {screen === 'otp' && (
          <div className="p-8">
            <button onClick={() => { clearError(); resetOtp(); setScreen(signupEmail ? 'signup' : 'signin'); }} className="mb-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Verify OTP</h2>
            <p className="text-sm text-gray-500 mb-8">
              Enter the 6-digit OTP sent to <span className="font-medium">{identifier}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`page-otp-${index}`}
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
                {isTimerActive ? (
                  <>Resend OTP in <span className="font-semibold">{formatTime(otpTimer)}</span></>
                ) : (
                  <button
                    type="button"
                    className="text-[#8B5E3C] hover:underline font-medium"
                    onClick={async () => {
                      try {
                        const res = await sendOTP(identifier);
                        const resendOtp = res?.otp ? String(res.otp) : null;
                        if (resendOtp) {
                          setOtp(resendOtp.padEnd(6, '').slice(0, 6).split(''));
                          toast.success(`Your OTP is: ${resendOtp}`, { duration: 30000 });
                        } else {
                          toast.success('OTP resent! Check your email.');
                        }
                        setOtpTimer(180);
                        setIsTimerActive(true);
                      } catch {
                        // error shown via hook
                      }
                    }}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <Button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full h-12 bg-[#8B5E3C] hover:bg-[#5C4033] text-white font-medium rounded-lg disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;

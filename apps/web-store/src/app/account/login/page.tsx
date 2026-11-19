'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '../../../context/StoreContext';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';

function getCsrfTokenFromCookie(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(/(?:^|;\s*)manga_csrf=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : undefined;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  textColor: string;
  percent: number;
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumberOrSpecial: boolean;
  isValid: boolean;
}

function evaluatePasswordStrength(password: string): PasswordStrength {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumberOrSpecial = /[0-9\W_]/.test(password);

  let score = 0;
  if (hasLength) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumberOrSpecial) score++;

  if (password.length === 0) {
    return {
      score: 0,
      label: 'Enter password',
      color: 'bg-gray-200',
      textColor: 'text-gray-400',
      percent: 0,
      hasLength: false,
      hasUpper: false,
      hasLower: false,
      hasNumberOrSpecial: false,
      isValid: false,
    };
  }

  if (score <= 1) {
    return {
      score: 1,
      label: 'Weak',
      color: 'bg-red-500',
      textColor: 'text-red-600',
      percent: 25,
      hasLength,
      hasUpper,
      hasLower,
      hasNumberOrSpecial,
      isValid: false,
    };
  }

  if (score === 2) {
    return {
      score: 2,
      label: 'Fair',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
      percent: 50,
      hasLength,
      hasUpper,
      hasLower,
      hasNumberOrSpecial,
      isValid: false,
    };
  }

  if (score === 3) {
    return {
      score: 3,
      label: 'Good',
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      percent: 75,
      hasLength,
      hasUpper,
      hasLower,
      hasNumberOrSpecial,
      isValid: hasLength,
    };
  }

  return {
    score: 4,
    label: 'Strong',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-600',
    percent: 100,
    hasLength,
    hasUpper,
    hasLower,
    hasNumberOrSpecial,
    isValid: true,
  };
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginCustomer, cartCount, wishlistCount } = useStore();

  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const redirectTarget = searchParams.get('redirect') || '/account';
  const urlToken = searchParams.get('token');
  const urlEmail = searchParams.get('email');

  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot' | 'reset'>(
    urlToken && urlEmail ? 'reset' : initialTab
  );

  // Sign In State
  const [loginEmail, setLoginEmail] = useState(urlEmail || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register State: Step 1 = email, Step 2 = otp, Step 3 = details
  const [regStep, setRegStep] = useState<'email' | 'otp' | 'details'>('email');
  const [regEmail, setRegEmail] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [regVerificationToken, setRegVerificationToken] = useState('');
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regAgreed, setRegAgreed] = useState(false);

  // Password Reset State
  const [resetEmail, setResetEmail] = useState(urlEmail || '');
  const [resetToken, setResetToken] = useState(urlToken || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Password strength for registration
  const regPasswordStrength = evaluatePasswordStrength(regPassword);
  // Password strength for reset
  const resetPasswordStrength = evaluatePasswordStrength(newPassword);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push(redirectTarget);
      }
    }
  }, [user, router, redirectTarget]);

  // Primary Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError('Please provide your email address and password.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        data.user.role || 'BUYER',
        data.token
      );

      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push(redirectTarget);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send Verification OTP to Email
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regEmail.trim()) {
      setError('Please enter your email address to receive a verification code.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'send-email-otp',
          email: regEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to dispatch verification code.');
      }

      setSuccessMessage(data.message || `A verification code has been dispatched to ${regEmail}.`);
      if (data.devOtp) {
        setDevOtpHint(data.devOtp);
      }
      setRegStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1b: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regOtp.trim() || regOtp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code sent to your email.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'verify-email-otp',
          email: regEmail.trim(),
          otp: regOtp.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid verification code. Please check and try again.');
      }

      setRegVerificationToken(data.verificationToken || '');
      setSuccessMessage('Email verified successfully! Complete your details below.');
      setRegStep('details');
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Finalize Buyer Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError('Please provide your full name and set a secure password.');
      return;
    }
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!regPasswordStrength.isValid) {
      setError('Please choose a stronger password meeting the criteria below.');
      return;
    }
    if (!regAgreed) {
      setError('Please accept Manga’s Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'register',
          email: regEmail.trim(),
          password: regPassword,
          name: regName.trim(),
          phone: regPhone.trim(),
          verificationToken: regVerificationToken,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed.');
      }

      loginCustomer(
        data.user.email,
        data.user.name,
        data.user.phone || '+234 800 000 0000',
        'BUYER',
        data.token
      );
      router.push('/account');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password (Request Expiring Link)
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      setError('Please enter your account email address.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'forgot-password',
          email: resetEmail.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to request password reset link.');
      }

      setSuccessMessage(
        data.message || 'If an account exists with this email, a 15-minute password reset link has been dispatched.'
      );
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setActiveTab('reset');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Reset Password (Consume Token)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken.trim() || !newPassword.trim()) {
      setError('Please enter the reset token and your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const csrfToken = getCsrfTokenFromCookie();
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
        body: JSON.stringify({
          action: 'reset-password',
          email: resetEmail.trim(),
          token: resetToken.trim(),
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password. Link may have expired.');
      }

      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setActiveTab('login');
      setLoginPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#2A2320]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <main className="flex-1 py-10 sm:py-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md w-full">
          <div className="bg-white rounded-3xl border border-[#E7D5BC] shadow-xl p-6 sm:p-8">
            
            {/* Header / Brand Welcome */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#F6EDE0] text-[#B5532E] flex items-center justify-center text-xl mx-auto mb-3 shadow-2xs">
                <i className="fas fa-user-circle"></i>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display text-[#2A2320]">
                {activeTab === 'login' && 'Sign In to Your Account'}
                {activeTab === 'register' && 'Create Your Buyer Account'}
                {activeTab === 'forgot' && 'Reset Your Password'}
                {activeTab === 'reset' && 'Set a New Password'}
              </h1>
              <p className="text-xs text-[#8C8279] mt-1.5 leading-relaxed">
                {activeTab === 'login' && 'Access your orders, track shipments, and manage your wishlist.'}
                {activeTab === 'register' && 'Join Manga for genuine products, escrow buyer protection, and fast delivery.'}
                {activeTab === 'forgot' && 'Enter your email address and we will dispatch a secure password reset link.'}
                {activeTab === 'reset' && 'Enter your verification token and choose a strong new password.'}
              </p>
            </div>

            {/* Error Message Alert */}
            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <i className="fas fa-circle-exclamation text-red-500 mt-0.5 flex-shrink-0"></i>
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <i className="fas fa-circle-check text-emerald-600 mt-0.5 flex-shrink-0"></i>
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* Two Clean Tabs: Sign In | Create Account */}
            {(activeTab === 'login' || activeTab === 'register') && (
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-[#FAF6F0] rounded-2xl border border-[#E7D5BC] mb-6 text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); setSuccessMessage(null); }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer border-0 ${
                    activeTab === 'login'
                      ? 'bg-[#B5532E] text-white shadow-xs'
                      : 'bg-transparent text-[#8C8279] hover:text-[#2A2320]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(null); setSuccessMessage(null); }}
                  className={`py-2.5 rounded-xl transition-all cursor-pointer border-0 ${
                    activeTab === 'register'
                      ? 'bg-[#B5532E] text-white shadow-xs'
                      : 'bg-transparent text-[#8C8279] hover:text-[#2A2320]'
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB 1: SIGN IN (BUYER)                                   */}
            {/* ======================================================== */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. buyer@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#2A2320]">Password</label>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('forgot'); setError(null); setSuccessMessage(null); }}
                      className="text-[11px] text-[#B5532E] hover:underline bg-transparent border-0 cursor-pointer font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8279] hover:text-[#2A2320] bg-transparent border-0 cursor-pointer text-xs p-1"
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      <i className={`fas ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  <i className="fas fa-lock text-[#D9A441]"></i>
                  <span>{loading ? 'Signing In...' : 'Sign In to Account →'}</span>
                </button>

                <div className="text-center pt-2">
                  <p className="text-xs text-[#8C8279]">
                    New shopper on Manga?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setError(null); }}
                      className="text-[#B5532E] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* TAB 2: REGISTER (EMAIL VERIFIED FIRST, PASSWORD METER)  */}
            {/* ======================================================== */}
            {activeTab === 'register' && (
              <div>
                {/* Registration Step Indicator */}
                <div className="mb-5 flex items-center justify-between text-xs border-b border-[#E7D5BC]/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        regStep === 'details'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#B5532E] text-white'
                      }`}
                    >
                      {regStep === 'details' ? '✓' : '1'}
                    </span>
                    <span className={regStep === 'details' ? 'text-emerald-700 font-semibold' : 'font-bold text-[#2A2320]'}>
                      Email Verification
                    </span>
                  </div>
                  <span className="text-[#8C8279]">→</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        regStep === 'details'
                          ? 'bg-[#B5532E] text-white'
                          : 'bg-[#FAF6F0] text-[#8C8279] border border-[#E7D5BC]'
                      }`}
                    >
                      2
                    </span>
                    <span className={regStep === 'details' ? 'font-bold text-[#2A2320]' : 'text-[#8C8279]'}>
                      Profile & Password
                    </span>
                  </div>
                </div>

                {/* STEP 1A: Enter Email to Receive OTP */}
                {regStep === 'email' && (
                  <form onSubmit={handleSendEmailOtp} className="space-y-4">
                    <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-xs text-[#6B5E57] space-y-1">
                      <p className="font-bold text-[#2A2320] flex items-center gap-1.5">
                        <i className="fas fa-shield-halved text-[#4F6B3A]"></i>
                        <span>Email Verification Required</span>
                      </p>
                      <p>
                        We protect your buyer account by verifying your email address before setting up your password.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. amina@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-6 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <i className="fas fa-paper-plane text-[#D9A441]"></i>
                      <span>{loading ? 'Sending Code...' : 'Send Verification Code →'}</span>
                    </button>

                    <div className="text-center pt-2">
                      <p className="text-xs text-[#8C8279]">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => { setActiveTab('login'); setError(null); }}
                          className="text-[#B5532E] font-bold hover:underline bg-transparent border-0 cursor-pointer"
                        >
                          Sign In
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {/* STEP 1B: Enter 6-digit OTP */}
                {regStep === 'otp' && (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="p-3.5 bg-[#F0F6EE] rounded-xl border border-[#D2E4CC] text-xs text-[#3E552D] space-y-1">
                      <p className="font-bold text-[#2A2320] flex items-center gap-1.5">
                        <i className="fas fa-envelope-circle-check text-[#4F6B3A]"></i>
                        <span>Verification Code Sent</span>
                      </p>
                      <p>
                        Enter the 6-digit code sent to <strong className="text-[#2A2320]">{regEmail}</strong>. Code expires in 15 minutes.
                      </p>
                    </div>

                    {devOtpHint && (
                      <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center justify-between">
                        <span>Demo Verification Code: <strong>{devOtpHint}</strong></span>
                        <button
                          type="button"
                          onClick={() => setRegOtp(devOtpHint)}
                          className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 rounded font-bold text-[#2A2320] cursor-pointer border-0"
                        >
                          Auto-fill
                        </button>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-center text-lg font-mono tracking-widest text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => { setRegStep('email'); setError(null); }}
                        className="px-4 py-3 bg-[#FAF6F0] hover:bg-[#F0E6D8] text-[#8C8279] hover:text-[#2A2320] font-bold text-xs rounded-xl border border-[#E7D5BC] transition cursor-pointer"
                      >
                        Change Email
                      </button>
                      <button
                        type="submit"
                        disabled={loading || regOtp.length !== 6}
                        className="flex-1 py-3 px-6 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <i className="fas fa-check-circle text-[#D9A441]"></i>
                        <span>{loading ? 'Verifying...' : 'Verify Code & Proceed →'}</span>
                      </button>
                    </div>

                    <div className="text-center pt-2">
                      <button
                        type="button"
                        onClick={handleSendEmailOtp}
                        disabled={loading}
                        className="text-xs text-[#B5532E] hover:underline font-semibold bg-transparent border-0 cursor-pointer"
                      >
                        Didn't receive code? Resend
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2: Name, Phone, Password with Strength Meter & Legal Agreement */}
                {regStep === 'details' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {/* Verified Email Banner */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-circle-check text-emerald-600"></i>
                        <span>
                          Verified: <strong>{regEmail}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setRegStep('email');
                          setRegVerificationToken('');
                          setRegOtp('');
                        }}
                        className="text-[11px] text-emerald-700 hover:underline font-bold bg-transparent border-0 cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amina Bello"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +234 803 000 0000"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                      />
                    </div>

                    {/* Password Creation with Password Strength Meter */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-[#2A2320]">Create Password</label>
                        {regPassword && (
                          <span className={`text-[11px] font-bold ${regPasswordStrength.textColor}`}>
                            {regPasswordStrength.label}
                          </span>
                        )}
                      </div>

                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          placeholder="Create a strong password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8279] hover:text-[#2A2320] bg-transparent border-0 cursor-pointer text-xs p-1"
                        >
                          <i className={`fas ${showRegPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>

                      {/* Real-time Password Strength Meter Bar */}
                      <div className="mt-2 w-full bg-[#E7D5BC]/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${regPasswordStrength.color}`}
                          style={{ width: `${regPasswordStrength.percent}%` }}
                        ></div>
                      </div>

                      {/* Interactive Password Criteria Checklist */}
                      <div className="grid grid-cols-2 gap-1.5 mt-2.5 text-[11px]">
                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            regPasswordStrength.hasLength ? 'text-emerald-700 font-semibold' : 'text-[#8C8279]'
                          }`}
                        >
                          <i
                            className={`fas ${
                              regPasswordStrength.hasLength
                                ? 'fa-circle-check text-emerald-600'
                                : 'fa-circle-dot text-[#C4B7A6]'
                            }`}
                          ></i>
                          <span>8+ characters</span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            regPasswordStrength.hasUpper ? 'text-emerald-700 font-semibold' : 'text-[#8C8279]'
                          }`}
                        >
                          <i
                            className={`fas ${
                              regPasswordStrength.hasUpper
                                ? 'fa-circle-check text-emerald-600'
                                : 'fa-circle-dot text-[#C4B7A6]'
                            }`}
                          ></i>
                          <span>Uppercase letter</span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            regPasswordStrength.hasLower ? 'text-emerald-700 font-semibold' : 'text-[#8C8279]'
                          }`}
                        >
                          <i
                            className={`fas ${
                              regPasswordStrength.hasLower
                                ? 'fa-circle-check text-emerald-600'
                                : 'fa-circle-dot text-[#C4B7A6]'
                            }`}
                          ></i>
                          <span>Lowercase letter</span>
                        </div>
                        <div
                          className={`flex items-center gap-1.5 transition-colors ${
                            regPasswordStrength.hasNumberOrSpecial
                              ? 'text-emerald-700 font-semibold'
                              : 'text-[#8C8279]'
                          }`}
                        >
                          <i
                            className={`fas ${
                              regPasswordStrength.hasNumberOrSpecial
                                ? 'fa-circle-check text-emerald-600'
                                : 'fa-circle-dot text-[#C4B7A6]'
                            }`}
                          ></i>
                          <span>Number or symbol</span>
                        </div>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat your password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                      />
                      {regConfirmPassword && regConfirmPassword !== regPassword && (
                        <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1">
                          <i className="fas fa-circle-xmark"></i> Passwords do not match
                        </p>
                      )}
                    </div>

                    {/* Mandatory Legal Agreement Checkbox */}
                    <div className="pt-2 pb-1">
                      <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[#6B5E57] select-none">
                        <input
                          type="checkbox"
                          required
                          checked={regAgreed}
                          onChange={(e) => setRegAgreed(e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-[#E7D5BC] text-[#B5532E] focus:ring-[#B5532E] cursor-pointer"
                        />
                        <span className="leading-relaxed">
                          I agree to Manga’s{' '}
                          <Link
                            href="/terms-of-service"
                            target="_blank"
                            className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]"
                          >
                            Terms of Service
                          </Link>
                          ,{' '}
                          <Link
                            href="/privacy-policy"
                            target="_blank"
                            className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]"
                          >
                            Privacy Policy
                          </Link>
                          , and{' '}
                          <Link
                            href="/escrow-agreement"
                            target="_blank"
                            className="text-[#B5532E] font-bold underline hover:text-[#8F3B1F]"
                          >
                            Buyer Protection Policy
                          </Link>
                          .
                        </span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !regAgreed || !regPasswordStrength.isValid}
                      className="w-full py-3.5 px-6 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <i className="fas fa-user-plus text-[#D9A441]"></i>
                      <span>{loading ? 'Creating Account...' : 'Complete Buyer Registration'}</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* ======================================================== */}
            {/* TAB: FORGOT PASSWORD (FIXED BUTTON PADDING & VISUAL FLOW) */}
            {/* ======================================================== */}
            {activeTab === 'forgot' && (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-xs text-[#6B5E57] leading-relaxed">
                  Enter your registered account email address. We will dispatch a secure single-use password reset link valid for <strong>15 minutes</strong>.
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1.5">
                    Account Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] transition-all"
                  />
                </div>

                {/* Fixed Action Button Row: Generous padding, no text clipping */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(null); }}
                    className="px-5 py-3 bg-[#FAF6F0] hover:bg-[#F0E6D8] text-[#8C8279] hover:text-[#2A2320] font-bold text-xs rounded-xl border border-[#E7D5BC] transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <i className="fas fa-arrow-left text-[10px]"></i>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap min-w-[150px]"
                  >
                    <i className="fas fa-paper-plane text-[11px] text-[#D9A441]"></i>
                    <span>{loading ? 'Sending Link...' : 'Send Reset Link'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ======================================================== */}
            {/* TAB: RESET PASSWORD                                      */}
            {/* ======================================================== */}
            {activeTab === 'reset' && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="p-3.5 bg-[#FAF6F0] rounded-xl border border-[#E7D5BC] text-xs text-[#6B5E57] leading-relaxed">
                  Enter your verification reset token and set a new password. Single-use, valid for 15 minutes.
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1.5">Reset Token</label>
                  <input
                    type="text"
                    required
                    placeholder="Paste 64-character token"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs font-mono text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#2A2320]">New Password</label>
                    {newPassword && (
                      <span className={`text-[11px] font-bold ${resetPasswordStrength.textColor}`}>
                        {resetPasswordStrength.label}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8279] hover:text-[#2A2320] bg-transparent border-0 cursor-pointer text-xs p-1"
                    >
                      <i className={`fas ${showResetPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>

                  {/* Password Strength Bar */}
                  <div className="mt-2 w-full bg-[#E7D5BC]/50 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${resetPasswordStrength.color}`}
                      style={{ width: `${resetPasswordStrength.percent}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A2320] mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E7D5BC] rounded-xl text-xs text-[#2A2320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#B5532E]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); setError(null); }}
                    className="px-5 py-3 bg-[#FAF6F0] hover:bg-[#F0E6D8] text-[#8C8279] hover:text-[#2A2320] font-bold text-xs rounded-xl border border-[#E7D5BC] transition cursor-pointer whitespace-nowrap"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !resetPasswordStrength.isValid}
                    className="flex-1 py-3 px-6 bg-[#B5532E] hover:bg-[#8F3B1F] text-white font-bold text-xs rounded-xl shadow-md transition-all border-0 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap min-w-[150px] disabled:opacity-50"
                  >
                    <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>

      <Footer cartCount={cartCount} wishlistCount={wishlistCount} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#8C8279]">Loading sign in portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}

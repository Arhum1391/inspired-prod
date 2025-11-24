'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import CustomInput from '@/components/CustomInput';
import { useSearchParams } from "next/navigation";



export default function SignIn() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setInfoMessage(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const fullname = isSignUp ? formData.get('fullname') : null;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (!email || !password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }
    try {
      if (isSignUp) {
        // Handle signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include cookies
          body: JSON.stringify({ email, password, name: fullname }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Check if email already exists
          if (data.emailExists || response.status === 409) {
            setInfoMessage('Account already linked with this email. Would you like to login?');
            setError(null);
          } else {
            setError(data.error || 'Failed to create account');
          }
          setIsLoading(false);
          return;
        }

        // Check if email verification is required
        if (data.requiresVerification) {
          setInfoMessage('Account created! Please check your email to verify your account before signing in.');
          setIsLoading(false);
          // Optionally redirect to a verification message page or show a success message
          return;
        }

        // Store email in sessionStorage for checkout (do NOT login yet)
        // User will be authenticated after completing checkout/payment
        if (data.user && data.user.email) {
          sessionStorage.setItem('signupEmail', data.user.email);
        }

        if (data.user) {
          await login({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || undefined,
            isPaid: data.user.isPaid ?? false,
            subscriptionStatus: data.user.subscriptionStatus,
          });
        }

        setIsLoading(false);
        router.push('/account?welcome=1');
      } else {
        // Handle sign in
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // Include cookies
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          // Check if email verification is required
          if (data.requiresVerification) {
            setInfoMessage(data.error || 'Please verify your email address before signing in. Check your inbox for the verification link.');
          } else {
            setError(data.error || 'Invalid credentials');
          }
          setIsLoading(false);
          return;
        }

        // Update AuthContext with user data
        await login({
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || undefined,
          isPaid: data.user.isPaid ?? false,
          subscriptionStatus: data.user.subscriptionStatus,
        });

        // Redirect to account page or home
        if (redirect) {
          router.push(redirect);
        } else {
          router.push('/account');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
    setIsLoading(false);
  };

  const handleToggle = (value: boolean) => {
    setIsSignUp(value);
    setError(null);
    setInfoMessage(null);
    setFormKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/account');
    }
  }, [authLoading, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />

      {/* Desktop Gradients */}
      <div
        className="hidden md:block fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-100"
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '-315px',
          top: '568px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(15deg)',
          zIndex: 0
        }}
      ></div>
      <div
        className="hidden md:block fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '1237px',
          top: '438px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          zIndex: 0
        }}
      ></div>

      {/* Mobile Gradients */}
      <div
        className="md:hidden absolute top-0 left-0 w-[588px] h-[588px] pointer-events-none opacity-100"
        style={{
          transform: 'rotate(0deg) translate(-280px, -330px)',
          transformOrigin: 'top left',
          background: 'linear-gradient(107.68deg, rgba(110, 77, 136, 1) 9.35%, rgba(110, 77, 136, 0.9) 34.7%, rgba(110, 77, 136, 0.8) 60.06%, rgba(110, 77, 136, 0.7) 72.73%, rgba(110, 77, 136, 0.6) 88.58%)',
          filter: 'blur(120px)',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
          zIndex: 0
        }}
      ></div>
      <div
        className="md:hidden absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
        style={{
          background: 'linear-gradient(107.68deg, rgba(23, 64, 136, 1) 9.35%, rgba(23, 64, 136, 1) 34.7%, rgba(23, 64, 136, 1) 60.06%, rgba(23, 64, 136, 0.9) 72.73%, rgba(23, 64, 136, 0.8) 88.58%)',
          transform: 'rotate(-45deg) translate(250px, 250px)',
          transformOrigin: 'bottom right',
          borderRadius: '50%',
          maskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
          filter: 'blur(150px)',
          WebkitFilter: 'blur(150px)',
          zIndex: 0
        }}
      ></div>

      {/* Form - Centered */}
      <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: isSignUp ? '140px' : '80px' }}>
        <div className="w-full max-w-[414px] mx-auto">
          <div className="flex flex-col items-start gap-10">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-3 w-full">
              <div className="flex flex-row justify-center items-center w-full">
                <h1
                  className="text-white text-center"
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '32px',
                    lineHeight: '100%'
                  }}
                >
                  {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                </h1>
              </div>

              <div className="flex flex-row justify-center items-center w-full">
                <p
                  className="text-center"
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#909090'
                  }}
                >
                  {isSignUp ? 'Join thousands of informed investors' : 'Sign in to access your premium features'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Info Message */}
            {infoMessage && (
              <div className="w-full p-3 bg-white/10 border border-white/30 rounded-lg">
                <p
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '130%',
                    color: '#FFFFFF'
                  }}
                >
                  {infoMessage.includes('Would you like to login?') ? (
                    <>
                      Account already linked with this email. Would you like to{' '}
                      <button
                        onClick={() => handleToggle(false)}
                        type="button"
                        className="hover:opacity-80 underline"
                        style={{
                          color: '#DE50EC',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                          padding: 0,
                          textDecoration: 'underline'
                        }}
                      >
                        login
                      </button>
                      ?
                    </>
                  ) : (
                    infoMessage
                  )}
                </p>
              </div>
            )}

            {/* Form Fields Section */}
            <form key={formKey} onSubmit={handleSubmit} className="flex flex-col items-start gap-10 w-full">
              <div className="flex flex-col items-start gap-4 w-full">
                {/* Full Name Field - Only for Sign Up */}
                {isSignUp && (
                  <div className="flex flex-col items-start gap-1 w-full">
                    <label
                      htmlFor="fullname"
                      className="w-full"
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
                      }}
                    >
                      Full Name (optional)
                    </label>
                    <input
                      type="text"
                      id="fullname"
                      name="fullname"
                      placeholder="Enter name"
                      className="w-full h-10 bg-transparent focus:outline-none"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px 16px',
                        gap: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                    />
                  </div>
                )}

                {/* Email Field */}
                <div className="flex flex-col items-start gap-1 w-full">
                  <label
                    htmlFor="email"
                    className="w-full"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Email
                  </label>
                  {/* <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="abc@example.com"
                    required
                    className="w-full h-10 bg-transparent focus:outline-none"
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                  /> */}
                  <CustomInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="abc@example.com"
                    required
                    className="w-full h-10 bg-transparent focus:outline-none"
                    onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col items-start gap-1 w-full">
                  <label
                    htmlFor="password"
                    className="w-full"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Password
                  </label>
                  <div className="relative w-full">
                    {/* <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      className="w-full h-10 bg-transparent focus:outline-none pr-10"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '12px 16px',
                        gap: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                    /> */}
                    <CustomInput
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      className="w-full h-10 bg-transparent focus:outline-none pr-10"
                      onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center focus:outline-none"
                      style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {!showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Forget Password */}
              {!isSignUp && (
                <div className="w-full flex justify-end -mt-9">
                  <Link
                    href="/forgot-password"
                    className="hover:opacity-80"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      textAlign: 'right'
                    }}
                  >
                    Forget Password ?
                  </Link>
                </div>
              )}

              {/* Button Section */}
              <div className="flex flex-col items-center gap-6 w-full">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    background: isLoading ? '#666' : '#FFFFFF',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#404040',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                </button>

                <p
                  className="w-full text-center"
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '130%',
                    color: '#FFFFFF'
                  }}
                >
                  {isSignUp ? (
                    <>
                      Already have an account? <button onClick={() => handleToggle(false)} type="button" className=" hover:opacity-80" style={{ color: '#DE50EC', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', padding: 0 }}>Sign In</button>
                    </>
                  ) : (
                    <>
                      Don't have an account? <button onClick={() => handleToggle(true)} type="button" className=" hover:opacity-80" style={{ color: '#DE50EC', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', padding: 0 }}>Sign Up</button>
                    </>
                  )}
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}


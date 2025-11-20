'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid reset link. Please check your email and try again.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!token) {
      setError('Invalid reset token');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      setStatusMessage(null);

      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        setIsSubmitting(false);
        return;
      }

      setStatusMessage('Password reset successfully! Redirecting to sign in...');
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

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
      <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '140px' }}>
        <div className="w-full max-w-[414px] mx-auto">
          <div className="flex flex-col items-start gap-10 w-full">
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
                  Reset Password
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
                  Enter your new password
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="w-full p-3 bg-red-500/20 border border-red-500 rounded-lg">
                <p
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '130%',
                    color: '#FF6B6B'
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Status Message */}
            {statusMessage && (
              <div className="w-full p-3 bg-green-500/20 border border-green-500 rounded-lg">
                <p
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '130%',
                    color: '#4ADE80'
                  }}
                >
                  {statusMessage}
                </p>
              </div>
            )}

            {/* Form Section */}
            {token && !statusMessage && (
              <form onSubmit={handleSubmit} className="flex flex-col items-start gap-10 w-full">
                <div className="flex flex-col items-start gap-4 w-full">
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
                      New Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="Enter new password"
                        required
                        minLength={6}
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
                        onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center focus:outline-none"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                      >
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L14 14M6.5 6.5C6.18 6.82 6 7.26 6 7.75C6 8.99 7.01 10 8.25 10C8.74 10 9.18 9.82 9.5 9.5M10.5 10.5C9.5 11.17 8.25 11.5 7 11.5C4 11.5 1.5 9 1.5 7C1.5 5.75 2.17 4.5 3.5 3.5M13 5.5C13.83 6.17 14.5 7 14.5 7C14.5 9 12 11.5 9 11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8C1 8 3.5 3.5 8 3.5C12.5 3.5 15 8 15 8C15 8 12.5 12.5 8 12.5C3.5 12.5 1 8 1 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="flex flex-col items-start gap-1 w-full">
                    <label
                      htmlFor="confirmPassword"
                      className="w-full"
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
                      }}
                    >
                      Confirm Password
                    </label>
                    <div className="relative w-full">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        required
                        minLength={6}
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
                        onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center focus:outline-none"
                        style={{ color: 'rgba(255, 255, 255, 0.3)' }}
                      >
                        {showConfirmPassword ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2L14 14M6.5 6.5C6.18 6.82 6 7.26 6 7.75C6 8.99 7.01 10 8.25 10C8.74 10 9.18 9.82 9.5 9.5M10.5 10.5C9.5 11.17 8.25 11.5 7 11.5C4 11.5 1.5 9 1.5 7C1.5 5.75 2.17 4.5 3.5 3.5M13 5.5C13.83 6.17 14.5 7 14.5 7C14.5 9 12 11.5 9 11.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 8C1 8 3.5 3.5 8 3.5C12.5 3.5 15 8 15 8C15 8 12.5 12.5 8 12.5C3.5 12.5 1 8 1 8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-6 w-full">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 flex items-center justify-center"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '10px',
                      background: isSubmitting ? '#666666' : '#FFFFFF',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#404040',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>

                  <Link
                    href="/signin"
                    className="hover:opacity-80"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '130%',
                      color: '#FFFFFF',
                      textDecoration: 'none'
                    }}
                  >
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {!token && (
              <div className="w-full">
                <Link
                  href="/signin"
                  className="w-full h-12 flex items-center justify-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    background: '#FFFFFF',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#404040',
                    textDecoration: 'none'
                  }}
                >
                  Go to Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


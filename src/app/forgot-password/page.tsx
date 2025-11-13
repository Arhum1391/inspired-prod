'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Navbar from '@/components/Navbar';

export default function ForgotPassword() {
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    if (!email) {
      setStatusMessage('Please enter a valid email address.');
      return;
    }

    try {
      setIsSending(true);
      setStatusMessage(null);

      // TODO: Replace with actual password reset request.
      await new Promise(resolve => setTimeout(resolve, 1200));

      setStatusMessage('If that email matches an account, we’ve sent password reset instructions.');
    } catch (error) {
      setStatusMessage('Something went wrong. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = () => {
    setStatusMessage('We’ve resent the password reset link (if the email exists in our records).');
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
                  Forget Password
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
                  Enter your email to reset your password
                </p>
              </div>
            </div>

            {/* Status Message */}
            {statusMessage && (
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
                  {statusMessage}
                </p>
              </div>
            )}

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="flex flex-col items-start gap-10 w-full">
              <div className="flex flex-col items-start gap-4 w-full">
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
                  <input
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
                    onFocus={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-6 w-full">
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-12 flex items-center justify-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    background: isSending ? '#666666' : '#FFFFFF',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '18px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#404040',
                    border: 'none',
                    cursor: isSending ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSending ? 'Sending...' : 'Send Link'}
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
                  Didn’t receive a link?{' '}
                  <button
                    type="button"
                    onClick={handleResend}
                    className="hover:opacity-80"
                    style={{
                      color: '#DE50EC',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontSize: 'inherit',
                      fontWeight: 'inherit',
                      padding: 0
                    }}
                  >
                    Resend Link
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}


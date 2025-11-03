'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formKey, setFormKey] = useState(0); // Key to force form reset
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(e.target as HTMLFormElement);
    const fullname = isSignUp ? formData.get('fullname') : null;
    const email = formData.get('email');
    const password = formData.get('password');
    
    // Basic validation
    if (!email || !password) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (isSignUp) {
      // After successful signup, redirect to pricing page
      console.log('Sign up with:', { fullname, email });
      router.push('/pricing');
    } else {
      // Handle sign in logic here
      console.log('Sign in with:', { email });
    }
  };

  const handleToggle = (value: boolean) => {
    setIsSignUp(value);
    // Reset form by changing key
    setFormKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Navigation */}
      <Navbar />

      {/* Gradient Ellipse - Bottom Left */}
      <div
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '-315px',
          top: '568px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(15deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>

      {/* Gradient Ellipse - Bottom Right */}
      <div
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '1237px',
          top: '438px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>

      {/* Form - Centered */}
      <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: isSignUp ? '140px' : '80px' }}>
        <div className="w-full max-w-[414px] mx-auto">
          {/* Form Container */}
          <div className="flex flex-col items-start gap-10">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-3 w-full">
              {/* Title */}
              <div className="flex flex-row justify-center items-center w-full">
                <h1 
                  className="text-white text-center"
                  style={{
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    fontWeight: 400,
                    fontSize: '32px',
                    lineHeight: '100%'
                  }}
                >
                  {isSignUp ? 'Create Your Account' : 'Welcome Back'}
                </h1>
              </div>

              {/* Subtitle */}
              <div className="flex flex-row justify-center items-center w-full">
                <p 
                  className="text-center"
                  style={{
                    fontFamily: 'Gilroy-Medium, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#909090'
                  }}
                >
                  {isSignUp ? 'Join thousands of informed investors' : 'Sign in to access your premium features'}
                </p>
              </div>
            </div>

            {/* Form Fields Section */}
            <form key={formKey} onSubmit={handleSubmit} className="flex flex-col items-start gap-10 w-full">
              {/* Input Fields */}
              <div className="flex flex-col items-start gap-4 w-full">
                {/* Full Name Field - Only for Sign Up */}
                {isSignUp && (
                  <div className="flex flex-col items-start gap-1 w-full">
                    <label 
                      htmlFor="fullname"
                      className="w-full"
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
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
                        fontFamily: 'Gilroy-Medium, sans-serif',
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
                      fontFamily: 'Gilroy-Medium, sans-serif',
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
                      fontFamily: 'Gilroy-Medium, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col items-start gap-1 w-full">
                  <label 
                    htmlFor="password"
                    className="w-full"
                    style={{
                      fontFamily: 'Gilroy-Medium, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Enter password"
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
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.border = '1px solid rgba(255, 255, 255, 0.3)'}
                    />
                    {/* Eye Icon */}
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
              </div>

              {/* Button Section */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Submit Button */}
                <button
                  type="submit"
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
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    fontWeight: 500,
                    fontSize: '18px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#404040',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </button>

                {/* Toggle Link */}
                <p 
                  className="w-full text-center"
                  style={{
                    fontFamily: 'Gilroy-Medium, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '130%',
                    color: '#FFFFFF'
                  }}
                >
                  {isSignUp ? (
                    <>
                      Already have an account? <button onClick={() => handleToggle(false)} type="button" className="underline hover:opacity-80" style={{ color: '#DE50EC', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', padding: 0 }}>Sign In</button>
                    </>
                  ) : (
                    <>
                      Don't have an account? <button onClick={() => handleToggle(true)} type="button" className="underline hover:opacity-80" style={{ color: '#DE50EC', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 'inherit', padding: 0 }}>Sign Up</button>
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

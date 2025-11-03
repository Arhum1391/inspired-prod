'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function SuccessPage() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // Animate the success checkmark
    const timer = setTimeout(() => setShowSuccess(true), 300);
    
    // Auto-login user after successful payment
    // In a real app, you would get user data from the payment response or session
    const mockUser = {
      id: '1',
      email: 'user@example.com',
      name: 'Premium User'
    };
    
    // Only login if not already logged in
    const existingUser = localStorage.getItem('user');
    if (!existingUser) {
      login(mockUser);
    }
    
    return () => clearTimeout(timer);
  }, [login]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24">
        {/* Main Success Container */}
        <div className="w-full max-w-[952px] flex flex-col items-center gap-8">
          
          {/* Success Header */}
          <div className="w-full flex flex-col items-center gap-6">
            {/* Success Icon */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Check-Circle Icon with green border */}
                <div className="w-10 h-10 relative">
                  {/* Green circle border */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#78F17A]" />
                  {/* Checkmark using the Tick.svg */}
                  <div 
                    className={`absolute inset-2 transition-all duration-500 ${showSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                    style={{
                      backgroundImage: 'url("/logo/Tick.svg")',
                      backgroundSize: 'contain',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="w-full flex flex-col items-center gap-4">
              <h1 className="text-[40px] font-semibold leading-[100%] text-center text-white">
                Welcome to Inspired Analyst Premium
              </h1>
              <p className="text-[14px] font-medium leading-[120%] text-center text-white">
                Your subscription is active.
              </p>
              <p className="text-[14px] font-medium leading-[120%] text-center text-white">
                You now have full access to our research library, position sizing calculator, portfolio analytics, and Shariah-compliant investment details.
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="w-full flex flex-row items-start gap-5 mt-7">
            
            {/* Browse Research Card */}
            <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
              {/* Curved Gradient Border */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                  padding: '1px'
                }}
              >
                <div
                  className="w-full h-full rounded-[15px]"
                  style={{
                    background: '#1F1F1F'
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/Sparks--Streamline-Iconoir.svg"
                    alt="Sparks Icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">
                    Browse Research
                  </h3>
                  <p className="text-base font-normal leading-[130%] text-center text-white">
                    Access in-depth reports and analysis.
                  </p>
                </div>
                
                {/* Button */}
                <button className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center">
                  <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">
                    Explore
                  </span>
                </button>
              </div>
            </div>

            {/* Calculator Card */}
            <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
              {/* Curved Gradient Border */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                  padding: '1px'
                }}
              >
                <div
                  className="w-full h-full rounded-[15px]"
                  style={{
                    background: '#1F1F1F'
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/Calculator--Streamline-Iconoir.svg"
                    alt="Calculator Icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">
                    Open Calculator
                  </h3>
                  <p className="text-base font-normal leading-[130%] text-center text-white">
                    Size positions based on your risk tolerance.
                  </p>
                </div>
                
                {/* Button */}
                <button className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center">
                  <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">
                    Get Started
                  </span>
                </button>
              </div>
            </div>

            {/* Portfolio Card */}
            <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
              {/* Curved Gradient Border */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                  padding: '1px'
                }}
              >
                <div
                  className="w-full h-full rounded-[15px]"
                  style={{
                    background: '#1F1F1F'
                  }}
                ></div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/User-Star--Streamline-Iconoir.svg"
                    alt="User Star Icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                
                {/* Content */}
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">
                    Set up Portfolio
                  </h3>
                  <p className="text-base font-normal leading-[130%] text-center text-white">
                    Track your investments and performance.
                  </p>
                </div>
                
                {/* Button */}
                <button className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center">
                  <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">
                    Start Tracking
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Message */}
          <div className="w-full flex flex-row justify-center items-center gap-2.5 mt-2">
            <p className="text-[14px] font-medium leading-[120%] text-center text-white">
              Manage your plan anytime in <span style={{ color: '#DE50EC' }}>Account → Billing</span>. Educational content only; not financial advice.
            </p>
          </div>
        </div>

        {/* What's Included Section */}
        <div className="w-full max-w-[1064px] mt-34 mb-30">
          <div 
            className="newsletter-container relative bg-[#1F1F1F] rounded-2xl overflow-hidden"
            style={{
              padding: '40px',
              minHeight: '252px',
              width: '100%',
              maxWidth: '1064px',
              margin: '0 auto',
              isolation: 'isolate'
            }}
          >
            {/* Curved Gradient Border */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                padding: '1px'
              }}
            >
              <div
                className="w-full h-full rounded-[15px]"
                style={{
                  background: '#1F1F1F'
                }}
              ></div>
            </div>

            {/* CSS Ellipse Background */}
            <div
              style={{
                position: 'absolute',
                width: '500px',
                height: '500px',
                left: '-203px',
                top: '-456px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                WebkitFilter: 'blur(200px)',
                filter: 'blur(200px)',
                WebkitTransform: 'rotate(90deg)',
                transform: 'rotate(90deg)',
                zIndex: 0,
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                WebkitPerspective: '1000px',
                perspective: '1000px',
                WebkitTransformStyle: 'preserve-3d',
                transformStyle: 'preserve-3d',
              }}
            />

            {/* Decorative Background Logo - Desktop */}
            <div
              className="absolute hidden md:block"
              style={{
                width: '600px',
                height: '450px',
                right: '-120px',
                top: '40%',
                transform: 'translateY(-50%) rotate(20deg)',
                opacity: 0.15,
                zIndex: 1,
              }}
            >
              <img
                src="/insp logo.svg"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0.3)'
                }}
              />
            </div>

            {/* Decorative Background Logo - Mobile */}
            <div
              className="absolute md:hidden"
              style={{
                width: '200px',
                height: '220px',
                right: '-50px',
                bottom: '-70px',
                transform: 'rotate(10deg)',
                opacity: 0.1,
                zIndex: 1,
              }}
            >
              <img
                src="/insp logo.svg"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'brightness(0.7)'
                }}
              />
            </div>

            {/* Content */}
            <div className="relative z-30 max-w-lg">
              <div className="space-y-10">
                {/* Header */}
                <div className="space-y-6">
                  <h2 className="text-[28px] font-semibold leading-[100%] text-white">
                    What's Included in Your Subscription
                  </h2>
                  
                  {/* Features list */}
                  <div className="flex flex-col items-start gap-4 w-full">
                    {/* Feature 1 */}
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Deep-dive reports with downloadable PDFs
                      </span>
                    </div>
                    
                    {/* Feature 2 */}
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Position sizing tailored to your risk
                      </span>
                    </div>
                    
                    {/* Feature 3 */}
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Portfolio allocation & P/L tracking
                      </span>
                    </div>
                    
                    {/* Feature 4 */}
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Shariah methodology & detailed screens
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

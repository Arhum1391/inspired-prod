'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const CancelPlanPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleBackToProfile = () => {
    router.push('/account');
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleReasonSelect = (reason: string) => {
    setSelectedReason(reason);
  };

  const handleContinue = () => {
    if (!selectedReason) return;
    setCurrentStep(2);
  };

  const handleContinueToCancel = () => {
    setCurrentStep(3);
  };

  const handleConfirmCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    // Handle cancellation logic here
    console.log('Cancelling plan with reason:', selectedReason);
    // In a real app, you would call an API to cancel the subscription
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to success page or account page
      router.push('/account');
    }, 2000);
  };

  const cancellationReasons = [
    {
      id: 'too-expensive',
      title: 'Too expensive',
      description: 'The pricing doesn\'t fit my budget'
    },
    {
      id: 'not-using-enough',
      title: 'Not using enough',
      description: 'I don\'t use the features frequently'
    },
    {
      id: 'technical-issues',
      title: 'Technical issues',
      description: 'I have experienced problems with the platform'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Something else not listed here'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />

      {/* Gradient Ellipse - Bottom Left */}
      <div
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '-315px',
          top: '758px',
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
          top: '528px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-20 relative z-10">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          {/* Header Section */}
          <div className="w-full flex flex-col items-start gap-6 mb-10">
            {/* Back Button */}
            <button 
              onClick={handleBackToProfile}
              className="flex flex-row items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-4 h-4 relative">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-white text-base font-normal gilroy-medium">
                Back to Profile
              </span>
            </button>

            {/* Title and Progress Steps */}
            <div className="w-full flex flex-col items-start gap-6">
              <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                Cancel Subscription
              </h1>
              
              {/* Progress Steps */}
              <div className="flex flex-row items-center relative">
                {/* Step 1 - Reason */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    currentStep >= 1 ? 'bg-[#667EEA]' : 'border border-[#909090]'
                  }`}>
                    <span className={`text-sm font-normal gilroy-medium ${
                      currentStep >= 1 ? 'text-white' : 'text-[#909090]'
                    }`}>1</span>
                  </div>
                  <span className={`text-xs font-normal gilroy-medium text-center ${
                    currentStep >= 1 ? 'text-white' : 'text-[#909090]'
                  }`}>Reason</span>
                </div>

                {/* Connecting Line 1 */}
                <div className="w-18 h-0.5 bg-[#404040] mx-4 self-center -mt-4"></div>

                {/* Step 2 - Options */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    currentStep >= 2 ? 'bg-[#667EEA]' : 'border border-[#909090]'
                  }`}>
                    <span className={`text-sm font-normal gilroy-medium ${
                      currentStep >= 2 ? 'text-white' : 'text-[#909090]'
                    }`}>2</span>
                  </div>
                  <span className={`text-xs font-normal gilroy-medium text-center ${
                    currentStep >= 2 ? 'text-white' : 'text-[#909090]'
                  }`}>Options</span>
                </div>

                {/* Connecting Line 2 */}
                <div className="w-18 h-0.5 bg-[#404040] mx-4 self-center -mt-4"></div>

                {/* Step 3 - Confirm */}
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    currentStep >= 3 ? 'bg-[#667EEA]' : 'border border-[#909090]'
                  }`}>
                    <span className={`text-sm font-normal gilroy-medium ${
                      currentStep >= 3 ? 'text-white' : 'text-[#909090]'
                    }`}>3</span>
                  </div>
                  <span className={`text-xs font-normal gilroy-medium text-center ${
                    currentStep >= 3 ? 'text-white' : 'text-[#909090]'
                  }`}>Confirm</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Container */}
          {currentStep === 1 && (
          <div className="w-full flex flex-col items-start gap-10">
            {/* Question Section */}
            <div className="w-full flex flex-col items-start gap-4">
              <h2 className="text-white text-xl font-normal gilroy-semibold">
                Before you go—why are you canceling?
              </h2>
              <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[120%]">
                Your feedback helps us improve the platform for everyone.
              </p>
            </div>

            {/* Reason Selection Grid */}
            <div className="w-full flex flex-col items-start gap-5">
              {/* First Row */}
              <div className="w-full flex flex-row items-start gap-5">
                {/* Too Expensive */}
                <div 
                  className={`flex-1 p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                    selectedReason === 'too-expensive' 
                      ? 'bg-[#1F1F1F]' 
                      : 'bg-[#1F1F1F]'
                  }`}
                  onClick={() => handleReasonSelect('too-expensive')}
                >
                  {/* Active State Gradient Ellipse */}
                  {selectedReason === 'too-expensive' && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        width: '200px',
                        height: '200px',
                        right: '-50px',
                        top: '-50px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        opacity: 0.5,
                        zIndex: 0
                      }}
                    ></div>
                  )}

                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background: selectedReason === 'too-expensive' 
                        ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                        : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                      zIndex: 2
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: selectedReason === 'too-expensive' ? 'transparent' : '#1F1F1F'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 relative z-10">
                    <h3 className="text-white text-xl font-normal gilroy-semibold">
                      Too expensive
                    </h3>
                    <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[130%]">
                      The pricing doesn't fit my budget
                    </p>
                  </div>
                </div>

                {/* Not using enough */}
                <div 
                  className={`flex-1 p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                    selectedReason === 'not-using-enough' 
                      ? 'bg-[#1F1F1F]' 
                      : 'bg-[#1F1F1F]'
                  }`}
                  onClick={() => handleReasonSelect('not-using-enough')}
                >
                  {/* Active State Gradient Ellipse */}
                  {selectedReason === 'not-using-enough' && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        width: '200px',
                        height: '200px',
                        right: '-50px',
                        top: '-50px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        opacity: 0.5,
                        zIndex: 0
                      }}
                    ></div>
                  )}

                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background: selectedReason === 'not-using-enough' 
                        ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                        : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                      zIndex: 2
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: selectedReason === 'not-using-enough' ? 'transparent' : '#1F1F1F'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 relative z-10">
                    <h3 className="text-white text-xl font-normal gilroy-semibold">
                      Not using enough
                    </h3>
                    <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[130%]">
                      I don't use the features frequently
                    </p>
                  </div>
                </div>
              </div>

              {/* Second Row */}
              <div className="w-full flex flex-row items-start gap-5">
                {/* Technical issues */}
                <div 
                  className={`flex-1 p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                    selectedReason === 'technical-issues' 
                      ? 'bg-[#1F1F1F]' 
                      : 'bg-[#1F1F1F]'
                  }`}
                  onClick={() => handleReasonSelect('technical-issues')}
                >
                  {/* Active State Gradient Ellipse */}
                  {selectedReason === 'technical-issues' && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        width: '200px',
                        height: '200px',
                        right: '-50px',
                        top: '-50px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        opacity: 0.5,
                        zIndex: 0
                      }}
                    ></div>
                  )}

                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background: selectedReason === 'technical-issues' 
                        ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                        : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                      zIndex: 2
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: selectedReason === 'technical-issues' ? 'transparent' : '#1F1F1F'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 relative z-10">
                    <h3 className="text-white text-xl font-normal gilroy-semibold">
                      Technical issues
                    </h3>
                    <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[130%]">
                      I have experienced problems with the platform
                    </p>
                  </div>
                </div>

                {/* Other */}
                <div 
                  className={`flex-1 p-4 rounded-2xl cursor-pointer transition-all relative overflow-hidden ${
                    selectedReason === 'other' 
                      ? 'bg-[#1F1F1F]' 
                      : 'bg-[#1F1F1F]'
                  }`}
                  onClick={() => handleReasonSelect('other')}
                >
                  {/* Active State Gradient Ellipse */}
                  {selectedReason === 'other' && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        width: '200px',
                        height: '200px',
                        right: '-50px',
                        top: '-50px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        opacity: 0.5,
                        zIndex: 0
                      }}
                    ></div>
                  )}

                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background: selectedReason === 'other' 
                        ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                        : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                      zIndex: 2
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: selectedReason === 'other' ? 'transparent' : '#1F1F1F'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 relative z-10">
                    <h3 className="text-white text-xl font-normal gilroy-semibold">
                      Other
                    </h3>
                    <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[130%]">
                      Something else not listed here
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="w-full flex flex-row justify-end pr-0">
              <button
                onClick={handleContinue}
                disabled={!selectedReason || isSubmitting}
                className={`px-4 py-3 rounded-full text-base font-normal gilroy-semibold text-center transition-opacity ${
                  selectedReason && !isSubmitting
                    ? 'bg-white text-[#1F1F1F] hover:opacity-80'
                    : 'bg-[#909090] text-[#1F1F1F] cursor-not-allowed'
                }`}
                style={{
                  width: '198px',
                  height: '48px',
                  marginRight: '-210px'
                }}
              >
                {isSubmitting ? 'Processing...' : 'Continue'}
              </button>
            </div>
          </div>
          )}

          {/* Step 2 Content */}
          {currentStep === 2 && (
            <div className="w-full flex flex-col items-start gap-10">
              {/* Question Section */}
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Prefer one of these instead?
                </h2>
                <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[120%]">
                  We have some options that might work better for you.
                </p>
              </div>

              {/* Options Cards */}
              <div className="w-full flex flex-row items-start gap-5">
                {/* Pause for 30 days */}
                <div className="flex-1 p-4 rounded-2xl bg-[#1F1F1F] relative overflow-hidden">
                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                      zIndex: 2
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: '#1F1F1F'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 relative z-10">
                    <h3 className="text-white text-xl font-normal gilroy-semibold">
                      Pause for 30 days
                    </h3>
                    <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[130%]">
                      Take a break and return when you're ready. We'll pause billing and keep your account active.
                    </p>
                    <button className="w-full py-2.5 px-4 bg-white rounded-full text-[#1F1F1F] text-sm font-normal gilroy-semibold hover:opacity-80 transition-opacity">
                      Pause Subscription
                    </button>
                  </div>
                </div>

                {/* Switch to Annual */}
                <div className="flex-1 p-4 rounded-2xl bg-[#1F1F1F] relative overflow-hidden">
                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                      zIndex: 2
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: '#1F1F1F'
                      }}
                    ></div>
                  </div>
                  
                  <div className="flex flex-col items-start gap-3 relative z-10">
                    <h3 className="text-white text-xl font-normal gilroy-semibold">
                      Switch to Annual (save 20%)
                    </h3>
                    <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[130%]">
                      Save money with our annual plan. Pay once and enjoy all premium features for a full year.
                    </p>
                    <button className="w-full py-2.5 px-4 bg-white rounded-full text-[#1F1F1F] text-sm font-normal gilroy-semibold hover:opacity-80 transition-opacity">
                      Switch to Annual
                    </button>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="w-full flex flex-row justify-end pr-0 gap-5">
                <button
                  onClick={handleBack}
                  className="px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center transition-opacity border border-white text-white hover:opacity-80"
                  style={{
                    width: '187px',
                    height: '48px'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleContinueToCancel}
                  disabled={isSubmitting}
                  className={`px-4 py-3 rounded-full text-base font-normal gilroy-semibold text-center transition-opacity ${
                    !isSubmitting
                      ? 'bg-white text-[#1F1F1F] hover:opacity-80'
                      : 'bg-[#909090] text-[#1F1F1F] cursor-not-allowed'
                  }`}
                  style={{
                    width: '198px',
                    height: '48px',
                    marginRight: '-210px'
                  }}
                >
                  Continue to Cancel
                </button>
              </div>
            </div>
          )}

          {/* Step 3 Content */}
          {currentStep === 3 && (
            <div className="w-full flex flex-col items-start gap-10">
              {/* Question Section */}
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Confirm Cancellation
                </h2>
              </div>

              {/* What happens next card */}
              <div className="w-full p-4 rounded-2xl bg-[#1F1F1F] relative overflow-hidden">
                {/* Curved Gradient Border */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px',
                    zIndex: 2
                  }}
                >
                  <div
                    className="w-full h-full rounded-[15px]"
                    style={{
                      background: '#1F1F1F'
                    }}
                  ></div>
                </div>
                
                <div className="flex flex-col items-start gap-3 relative z-10">
                  <h3 className="text-white text-xl font-normal gilroy-medium">
                    What happens next:
                  </h3>
                  <div className="flex flex-col items-start gap-2">
                    {/* Bullet 1 */}
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        Your access continues until November 8, 2025
                      </p>
                    </div>
                    {/* Bullet 2 */}
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        You can reactivate anytime without losing your data
                      </p>
                    </div>
                    {/* Bullet 3 */}
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        No more charges will be made to your card
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-row justify-end pr-0 gap-5">
                <button
                  onClick={handleBack}
                  className="px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center transition-opacity border border-white text-white hover:opacity-80"
                  style={{
                    width: '187px',
                    height: '48px'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isSubmitting}
                  className={`px-4 py-3 rounded-full text-base font-normal gilroy-semibold text-center transition-opacity ${
                    !isSubmitting
                      ? 'bg-white text-[#1F1F1F] hover:opacity-80'
                      : 'bg-[#909090] text-[#1F1F1F] cursor-not-allowed'
                  }`}
                  style={{
                    width: '198px',
                    height: '48px',
                    marginRight: '-210px'
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Cancel Subscription'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CancelPlanPage;

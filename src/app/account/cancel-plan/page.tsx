'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const CancelPlanPage = () => {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Check for active subscription
    const checkSubscription = async () => {
      try {
        const response = await fetch('/api/subscription/current', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setSubscription(data.subscription);
          
          // If no active subscription, redirect to pricing
          if (!data.subscription || !data.subscription.status || 
              !['active', 'trialing', 'past_due'].includes(data.subscription.status)) {
            router.push('/pricing');
            return;
          }
        } else {
          router.push('/pricing');
          return;
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        router.push('/pricing');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, [isAuthenticated, router]);

  if (!isAuthenticated || loading) {
    return null;
  }

  // Redirect if no subscription
  if (!subscription || !subscription.status || !['active', 'trialing', 'past_due'].includes(subscription.status)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    );
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

  const handleConfirmCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: selectedReason }),
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        if (data.user) {
          await login({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || undefined,
            isPaid: data.user.isPaid ?? false,
            subscriptionStatus: data.user.subscriptionStatus,
          });
        }
        
        router.push('/account?canceled=1');
      } else {
        alert(data.error || 'Failed to cancel subscription');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const cancellationReasons = [
    { id: 'too-expensive', title: 'Too expensive', description: 'The pricing doesn\'t fit my budget' },
    { id: 'not-using-enough', title: 'Not using enough', description: 'I don\'t use the features frequently' },
    { id: 'technical-issues', title: 'Technical issues', description: 'I have experienced problems with the platform' },
    { id: 'other', title: 'Other', description: 'Something else not listed here' }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />

      {/* Desktop Gradients */}
      <div
        className="hidden md:block"
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

      <div
        className="hidden md:block"
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
      
      {/* Mobile Gradients */}
      <div
        className="md:hidden absolute top-0 left-0 w-[588px] h-[588px] pointer-events-none opacity-100"
        style={{
          transform: 'rotate(0deg) translate(-280px, -330px)',
          transformOrigin: 'top left',
          background:
            'linear-gradient(107.68deg, rgba(110, 77, 136, 1) 9.35%, rgba(110, 77, 136, 0.9) 34.7%, rgba(110, 77, 136, 0.8) 60.06%, rgba(110, 77, 136, 0.7) 72.73%, rgba(110, 77, 136, 0.6) 88.58%)',
          filter: 'blur(120px)',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
          zIndex: 0,
        }}
      ></div>
      <div
        className="md:hidden absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
        style={{
          background:
            'linear-gradient(107.68deg, rgba(23, 64, 136, 1) 9.35%, rgba(23, 64, 136, 1) 34.7%, rgba(23, 64, 136, 1) 60.06%, rgba(23, 64, 136, 0.9) 72.73%, rgba(23, 64, 136, 0.8) 88.58%)',
          transform: 'rotate(-45deg) translate(250px, 250px)',
          transformOrigin: 'bottom right',
          borderRadius: '50%',
          maskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
          filter: 'blur(150px)',
          WebkitFilter: 'blur(150px)',
          zIndex: 0,
        }}
      ></div>
      
      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10" style={{ padding: '0px 16px', paddingTop: '94px' }}>
        <div 
          className="flex flex-col justify-center items-start w-full max-w-[343px] mx-auto"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '32px'
          }}
        >
          {/* Header Section */}
          <div 
            className="flex flex-col items-start w-full"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '24px',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0
            }}
          >
            {/* Back Button */}
            <button 
              onClick={handleBackToProfile}
              className="flex flex-row items-start gap-1 hover:opacity-80 transition-opacity"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '4px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              <div 
                className="relative"
                style={{
                  width: '16px',
                  height: '16px',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                  <path d="M5 1L5 9M5 1L1 5M5 1L9 5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span 
                className="text-white gilroy-medium"
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
              >
                Back to Profile
              </span>
            </button>

            {/* Title and Step Indicator */}
            <div 
              className="flex flex-col items-start w-full"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              <h1 
                className="text-white gilroy-semibold w-full"
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '32px',
                  lineHeight: '100%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                Cancel Subscription
              </h1>

              {/* Step Indicator */}
              <div 
                className="flex flex-row items-center relative w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '72px',
                  isolation: 'isolate',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                {/* Step 1 */}
                <div 
                  className="flex flex-col items-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '69px',
                    height: '46px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                    zIndex: 0
                  }}
                >
                  <div
                    className="flex flex-col justify-center items-center rounded-full"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '4px 8px',
                      gap: '10px',
                      width: '28px',
                      height: '28px',
                      background: currentStep >= 1 ? '#667EEA' : 'transparent',
                      border: currentStep >= 1 ? 'none' : '1px solid #909090',
                      borderRadius: '18px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: currentStep >= 1 ? '#FFFFFF' : '#909090',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                      }}
                    >
                      1
                    </span>
                  </div>
                  <span
                    className="text-center"
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: currentStep >= 1 ? '#FFFFFF' : '#909090',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    Reason
                  </span>
                </div>

                {/* Step 2 */}
                <div 
                  className="flex flex-col items-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '78px',
                    height: '46px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    zIndex: 1
                  }}
                >
                  <div
                    className="flex flex-col justify-center items-center rounded-full"
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '4px 8px',
                      gap: '10px',
                      width: '28px',
                      height: '28px',
                      background: currentStep >= 2 ? '#667EEA' : 'transparent',
                      border: currentStep >= 2 ? 'none' : '1px solid #909090',
                      borderRadius: '18px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: currentStep >= 2 ? '#FFFFFF' : '#909090',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                      }}
                    >
                      2
                    </span>
                  </div>
                  <span
                    className="text-center"
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: currentStep >= 2 ? '#FFFFFF' : '#909090',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    Options
                  </span>
                </div>

                {/* Step 3 */}
                <div 
                  className="flex flex-col items-center"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '65px',
                    height: '46px',
                    flex: 'none',
                    order: 2,
                    flexGrow: 0,
                    zIndex: 2
                  }}
                >
                  <div
                    className="flex flex-col justify-center items-center rounded-full"
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '4px 8px',
                      gap: '10px',
                      width: '28px',
                      height: '28px',
                      background: currentStep >= 3 ? '#667EEA' : 'transparent',
                      border: currentStep >= 3 ? 'none' : '1px solid #909090',
                      borderRadius: '18px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: currentStep >= 3 ? '#FFFFFF' : '#909090',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0
                      }}
                    >
                      3
                    </span>
                  </div>
                  <span
                    className="text-center"
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '10px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: currentStep >= 3 ? '#FFFFFF' : '#909090',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    Confirm
                  </span>
                </div>

                {/* Connecting Lines */}
                <div
                  className="absolute"
                  style={{
                    position: 'absolute',
                    width: '72px',
                    height: '0px',
                    left: '69px',
                    top: '14px',
                    border: '2px solid #404040',
                    flex: 'none',
                    order: 3,
                    flexGrow: 0,
                    zIndex: 3
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    position: 'absolute',
                    width: '72px',
                    height: '0px',
                    left: '219px',
                    top: '14px',
                    border: '2px solid #404040',
                    flex: 'none',
                    order: 4,
                    flexGrow: 0,
                    zIndex: 4
                  }}
                />
              </div>
            </div>
          </div>

          {currentStep === 1 && (
            <>
              {/* Question Section */}
              <div 
                className="flex flex-col items-start w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '16px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <h2 
                  className="text-white gilroy-semibold w-full"
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  Before you go—why are you canceling?
                </h2>
                <p 
                  className="text-[#909090] gilroy-medium w-full"
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#909090',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  Your feedback helps us improve the platform for everyone.
                </p>
              </div>

              {/* Reason Cards */}
              <div 
                className="flex flex-col items-start w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '20px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                {/* First Column */}
                <div 
                  className="flex flex-col items-start w-full"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '20px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  {/* Too Expensive */}
                  <div 
                    className="bg-[#1F1F1F] rounded-[10px] w-full cursor-pointer relative overflow-hidden"
                    onClick={() => handleReasonSelect('too-expensive')}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px 12px',
                      gap: '12px',
                      isolation: 'isolate',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    {/* Active State Gradient Ellipse */}
                    {selectedReason === 'too-expensive' && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          position: 'absolute',
                          width: '282px',
                          height: '282px',
                          left: '233px',
                          top: '-215px',
                          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                          filter: 'blur(100px)',
                          transform: 'rotate(90deg)',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          zIndex: 0
                        }}
                      ></div>
                    )}

                    {/* Curved Gradient Border */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '10px',
                        background: selectedReason === 'too-expensive' 
                          ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                          : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                        zIndex: 2
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[9px]"
                        style={{
                          background: selectedReason === 'too-expensive' ? 'transparent' : '#1F1F1F'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col items-start gap-3 relative z-10 w-full">
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '16px',
                          minWidth: 0,
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <h3 
                          className="text-white gilroy-semibold flex-1"
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1
                          }}
                        >
                          Too expensive
                        </h3>
                      </div>
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '24px',
                          minWidth: 0,
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <p 
                          className="gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '130%',
                            color: '#909090',
                            display: 'block',
                            width: '100%',
                            minWidth: 0,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            flex: '0 0 auto',
                            order: 0
                          }}
                        >
                          The pricing doesn't fit my budget
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Not using enough */}
                  <div 
                    className="bg-[#1F1F1F] rounded-[10px] w-full cursor-pointer relative overflow-hidden"
                    onClick={() => handleReasonSelect('not-using-enough')}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px 12px',
                      gap: '12px',
                      isolation: 'isolate',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    {/* Active State Gradient Ellipse */}
                    {selectedReason === 'not-using-enough' && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          position: 'absolute',
                          width: '282px',
                          height: '282px',
                          left: '233px',
                          top: '-215px',
                          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                          filter: 'blur(100px)',
                          transform: 'rotate(90deg)',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          zIndex: 0
                        }}
                      ></div>
                    )}

                    {/* Curved Gradient Border */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '10px',
                        background: selectedReason === 'not-using-enough' 
                          ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                          : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                        zIndex: 2
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[9px]"
                        style={{
                          background: selectedReason === 'not-using-enough' ? 'transparent' : '#1F1F1F'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col items-start gap-3 relative z-10 w-full">
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '16px',
                          minWidth: 0,
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <h3 
                          className="text-white gilroy-semibold flex-1"
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1
                          }}
                        >
                          Not using enough
                        </h3>
                      </div>
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '24px',
                          minWidth: 0,
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <p 
                          className="gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '130%',
                            color: '#909090',
                            display: 'block',
                            width: '100%',
                            minWidth: 0,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            flex: '0 0 auto',
                            order: 0
                          }}
                        >
                          I don't use the features frequently
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Column */}
                <div 
                  className="flex flex-col items-start w-full"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '20px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  {/* Technical issues */}
                  <div 
                    className="bg-[#1F1F1F] rounded-[10px] w-full cursor-pointer relative overflow-hidden"
                    onClick={() => handleReasonSelect('technical-issues')}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px 12px',
                      gap: '12px',
                      isolation: 'isolate',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    {/* Active State Gradient Ellipse */}
                    {selectedReason === 'technical-issues' && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          position: 'absolute',
                          width: '282px',
                          height: '282px',
                          left: '233px',
                          top: '-215px',
                          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                          filter: 'blur(100px)',
                          transform: 'rotate(90deg)',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          zIndex: 0
                        }}
                      ></div>
                    )}

                    {/* Curved Gradient Border */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '10px',
                        background: selectedReason === 'technical-issues' 
                          ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                          : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                        zIndex: 2
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[9px]"
                        style={{
                          background: selectedReason === 'technical-issues' ? 'transparent' : '#1F1F1F'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col items-start gap-3 relative z-10 w-full">
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '16px',
                          minWidth: 0,
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <h3 
                          className="text-white gilroy-semibold flex-1"
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1
                          }}
                        >
                          Technical issues
                        </h3>
                      </div>
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '24px',
                          minWidth: 0,
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <p 
                          className="gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '130%',
                            color: '#909090',
                            display: 'block',
                            width: '100%',
                            minWidth: 0,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            flex: '0 0 auto',
                            order: 0
                          }}
                        >
                          I have experienced problems with the platform
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Other */}
                  <div 
                    className="bg-[#1F1F1F] rounded-[10px] w-full cursor-pointer relative overflow-hidden"
                    onClick={() => handleReasonSelect('other')}
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '16px 12px',
                      gap: '12px',
                      isolation: 'isolate',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    {/* Active State Gradient Ellipse */}
                    {selectedReason === 'other' && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          position: 'absolute',
                          width: '282px',
                          height: '282px',
                          left: '233px',
                          top: '-215px',
                          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                          filter: 'blur(100px)',
                          transform: 'rotate(90deg)',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          zIndex: 0
                        }}
                      ></div>
                    )}

                    {/* Curved Gradient Border */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '10px',
                        background: selectedReason === 'other' 
                          ? 'linear-gradient(226.35deg, rgba(102, 126, 234, 0.1) 0%, rgba(102, 126, 234, 0.05) 50.5%)'
                          : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                        zIndex: 2
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[9px]"
                        style={{
                          background: selectedReason === 'other' ? 'transparent' : '#1F1F1F'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex flex-col items-start gap-3 relative z-10 w-full">
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '16px',
                          minWidth: 0,
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <h3 
                          className="text-white gilroy-semibold flex-1"
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1
                          }}
                        >
                          Other
                        </h3>
                      </div>
                      <div 
                        className="flex flex-row items-center w-full"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '24px',
                          minWidth: 0,
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        <p 
                          className="gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '130%',
                            color: '#909090',
                            display: 'block',
                            width: '100%',
                            minWidth: 0,
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                            flex: '0 0 auto',
                            order: 0
                          }}
                        >
                          Something else not listed here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!selectedReason || isSubmitting}
                className="w-full bg-[#909090] text-[#1F1F1F] rounded-full gilroy-semibold text-center disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 16px',
                  gap: '10px',
                  width: '100%',
                  height: '48px',
                  background: selectedReason && !isSubmitting ? '#FFFFFF' : '#909090',
                  borderRadius: '100px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <span
                  className="text-[#1F1F1F] gilroy-semibold text-center"
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#1F1F1F',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0
                  }}
                >
                  Continue
                </span>
              </button>
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Question Section */}
              <div 
                className="flex flex-col items-start w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '16px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <h2 
                  className="text-white gilroy-semibold w-full"
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  Prefer one of these instead?
                </h2>
                <p 
                  className="text-[#909090] gilroy-medium w-full"
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '120%',
                    color: '#909090',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  We have some options that might work better for you.
                </p>
              </div>

              {/* Options Cards */}
              <div 
                className="flex flex-col items-start w-full"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '20px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                {/* Pause for 30 days */}
                <div 
                  className="bg-[#1F1F1F] rounded-[10px] w-full"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px 12px',
                    gap: '24px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <div 
                    className="flex flex-col items-start w-full"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '12px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <div 
                      className="flex flex-row items-center w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '16px',
                        minWidth: 0,
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <h3 
                        className="text-white gilroy-semibold flex-1"
                        style={{
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '20px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1
                        }}
                      >
                        Pause for 30 days
                      </h3>
                    </div>
                    <div 
                      className="flex flex-row items-center w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '24px',
                        minWidth: 0,
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <p 
                        className="gilroy-medium"
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '130%',
                          color: '#909090',
                          display: 'block',
                          width: '100%',
                          minWidth: 0,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          flex: '0 0 auto',
                          order: 0
                        }}
                      >
                        Take a break and return when you're ready. We'll pause billing and keep your account active.
                      </p>
                    </div>
                  </div>
                  <div 
                    className="flex flex-row justify-center items-center w-full"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '16px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <button 
                      onClick={() => {
                        // TODO: Implement pause subscription functionality
                        console.log('Pause subscription');
                      }}
                      className="bg-white border border-white rounded-full text-[#1F1F1F] gilroy-semibold text-center hover:opacity-80 transition-opacity"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px 16px',
                        gap: '8px',
                        width: '100%',
                        height: '38px',
                        background: '#FFFFFF',
                        border: '1px solid #FFFFFF',
                        borderRadius: '100px',
                        flex: 'none',
                        order: 0,
                        flexGrow: 1
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          textAlign: 'center',
                          color: '#1F1F1F',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0
                        }}
                      >
                        Pause Subscription
                      </span>
                    </button>
                  </div>
                </div>

                {/* Switch to Annual */}
                <div 
                  className="bg-[#1F1F1F] rounded-[10px] w-full"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px 12px',
                    gap: '24px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <div 
                    className="flex flex-col items-start w-full"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '12px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <div 
                      className="flex flex-row items-center w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '16px',
                        minWidth: 0,
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <h3 
                        className="text-white gilroy-semibold flex-1"
                        style={{
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '20px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1
                        }}
                      >
                        Switch to Annual (save 20%)
                      </h3>
                    </div>
                    <div 
                      className="flex flex-row items-center w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '24px',
                        minWidth: 0,
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <p 
                        className="gilroy-medium"
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '130%',
                          color: '#909090',
                          display: 'block',
                          width: '100%',
                          minWidth: 0,
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          overflowWrap: 'anywhere',
                          flex: '0 0 auto',
                          order: 0
                        }}
                      >
                        Save money with our annual plan. Pay once and enjoy all premium features for a full year.
                      </p>
                    </div>
                  </div>
                  <div 
                    className="flex flex-row justify-center items-center w-full"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '16px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    <button 
                      onClick={() => router.push('/pricing')}
                      className="bg-white border border-white rounded-full text-[#1F1F1F] gilroy-semibold text-center hover:opacity-80 transition-opacity"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px 16px',
                        gap: '8px',
                        width: '100%',
                        height: '38px',
                        background: '#FFFFFF',
                        border: '1px solid #FFFFFF',
                        borderRadius: '100px',
                        flex: 'none',
                        order: 0,
                        flexGrow: 1
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          textAlign: 'center',
                          color: '#1F1F1F',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0
                        }}
                      >
                        Switch to Annual
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="lg:hidden w-full flex flex-col items-start max-w-[343px] mx-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0px', gap: '20px', flex: 'none', order: 2, alignSelf: 'stretch', flexGrow: 0 }}>
                <button
                  onClick={handleBack}
                  className="w-full border border-white rounded-full text-white gilroy-semibold text-center hover:opacity-80 transition-opacity"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    border: '1px solid #FFFFFF',
                    borderRadius: '100px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <span style={{ fontFamily: 'Gilroy-SemiBold', fontStyle: 'normal', fontWeight: 400, fontSize: '14px', lineHeight: '100%', textAlign: 'center', color: '#FFFFFF', flex: 'none', order: 0, flexGrow: 0 }}>
                    Back
                  </span>
                </button>
                <button
                  onClick={handleContinueToCancel}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-full text-[#1F1F1F] gilroy-semibold text-center hover:opacity-80 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    background: isSubmitting ? '#909090' : '#FFFFFF',
                    borderRadius: '100px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <span style={{ fontFamily: 'Gilroy-SemiBold', fontStyle: 'normal', fontWeight: 400, fontSize: '16px', lineHeight: '100%', textAlign: 'center', color: '#1F1F1F', flex: 'none', order: 0, flexGrow: 0 }}>
                    Continue To Cancel
                  </span>
                </button>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <div className="w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Confirm Cancellation
                </h2>
              </div>

              <div className="w-full p-4 rounded-2xl bg-[#1F1F1F] relative overflow-hidden">
                <div className="flex flex-col items-start gap-3 relative z-10">
                  <h3 className="text-white text-xl font-normal gilroy-medium">
                    What happens next:
                  </h3>
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        Your access continues until the end of your billing period
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        You can reactivate anytime without losing your data
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        No more charges will be made to your card
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Action Buttons (stacked) */}
              <div className="lg:hidden w-full flex flex-col items-start max-w-[343px] mx-auto" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '0px', gap: '20px', flex: 'none', order: 2, alignSelf: 'stretch', flexGrow: 0 }}>
                <button
                  onClick={handleBack}
                  className="w-full border border-white rounded-full text-white gilroy-semibold text-center hover:opacity-80 transition-opacity"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    border: '1px solid #FFFFFF',
                    borderRadius: '100px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <span style={{ fontFamily: 'Gilroy-SemiBold', fontStyle: 'normal', fontWeight: 400, fontSize: '14px', lineHeight: '100%', textAlign: 'center', color: '#FFFFFF', flex: 'none', order: 0, flexGrow: 0 }}>
                    Back
                  </span>
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={isSubmitting}
                  className="w-full bg-white rounded-full text-[#1F1F1F] gilroy-semibold text-center hover:opacity-80 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '100%',
                    height: '48px',
                    background: isSubmitting ? '#909090' : '#FFFFFF',
                    borderRadius: '100px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  <span style={{ fontFamily: 'Gilroy-SemiBold', fontStyle: 'normal', fontWeight: 400, fontSize: '16px', lineHeight: '100%', textAlign: 'center', color: '#1F1F1F', flex: 'none', order: 0, flexGrow: 0 }}>
                    {isSubmitting ? 'Processing...' : 'Cancel Subscription'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-20 relative z-10">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          <div className="w-full flex flex-col items-start gap-6 mb-10">
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

            <div className="w-full flex flex-col items-start gap-6">
              <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                Cancel Subscription
              </h1>
              
              <div className="flex flex-row items-center relative">
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

                <div className="w-18 h-0.5 bg-[#404040] mx-4 self-center -mt-4"></div>

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

                <div className="w-18 h-0.5 bg-[#404040] mx-4 self-center -mt-4"></div>

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

          {currentStep === 1 && (
            <div className="w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Before you go—why are you canceling?
                </h2>
                <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[120%]">
                  Your feedback helps us improve the platform for everyone.
                </p>
              </div>

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
                  Continue
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Prefer one of these instead?
                </h2>
                <p className="text-[#909090] text-sm font-normal gilroy-medium leading-[120%]">
                  We have some options that might work better for you.
                </p>
              </div>

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
                    <button 
                      onClick={() => {
                        // TODO: Implement pause subscription functionality
                        console.log('Pause subscription');
                      }}
                      className="w-full py-2.5 px-4 bg-white rounded-full text-[#1F1F1F] text-sm font-normal gilroy-semibold hover:opacity-80 transition-opacity"
                    >
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
                    <button 
                      onClick={() => router.push('/pricing')}
                      className="w-full py-2.5 px-4 bg-white rounded-full text-[#1F1F1F] text-sm font-normal gilroy-semibold hover:opacity-80 transition-opacity"
                    >
                      Switch to Annual
                    </button>
                  </div>
                </div>
              </div>

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
                  Continue To Cancel
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Confirm Cancellation
                </h2>
              </div>

              <div className="w-full p-4 rounded-2xl bg-[#1F1F1F] relative overflow-hidden">
                <div className="flex flex-col items-start gap-3 relative z-10">
                  <h3 className="text-white text-xl font-normal gilroy-medium">
                    What happens next:
                  </h3>
                  <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        Your access continues until the end of your billing period
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        You can reactivate anytime without losing your data
                      </p>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#909090]"></div>
                      <p className="text-[#909090] text-sm font-normal gilroy-medium">
                        No more charges will be made to your card
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:flex w-full flex-row justify-end pr-0 gap-5">
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


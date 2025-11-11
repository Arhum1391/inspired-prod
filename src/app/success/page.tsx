'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const { login, user } = useAuth();
  const sessionId = searchParams.get('session_id');
  const subscriptionId = searchParams.get('subscription_id');

  useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(true), 300);

    const pollSubscription = () => {
      setTimeout(async () => {
        try {
          const subRes = await fetch('/api/subscription/current', { credentials: 'include' });
          if (subRes.ok) {
            const subData = await subRes.json();
            if (!subData.subscription) {
              setTimeout(async () => {
                try {
                  const retryRes = await fetch('/api/subscription/current', { credentials: 'include' });
                  if (retryRes.ok) {
                    await retryRes.json();
                  }
                } catch (err) {
                  console.error('Error checking subscription after auth:', err);
                }
              }, 3000);
            }
          }
        } catch (err) {
          console.error('Error checking subscription after auth:', err);
        }
      }, 2000);
    };

    const ensureAuthenticated = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            login({
              id: data.user.id,
              email: data.user.email,
              name: data.user.name || undefined,
            });
          }
        }
      } catch (err) {
        console.error('Error fetching user after payment:', err);
      }
    };

    const authenticateWithSession = async () => {
      try {
        const meRes = await fetch('/api/auth/me', { credentials: 'include' });
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData.user) {
            login({
              id: meData.user.id,
              email: meData.user.email,
              name: meData.user.name || undefined,
            });
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('signupEmail');
            }
            pollSubscription();
            return;
          }
        }

        const authRes = await fetch('/api/auth/authenticate-after-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ sessionId }),
        });

        const authData = await authRes.json();

        if (authRes.ok && authData.user) {
          login({
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.name || undefined,
          });
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('signupEmail');
          }
          pollSubscription();
        }
      } catch (err) {
        console.error('Error authenticating after payment:', err);
      }
    };

    if (sessionId && !user) {
      authenticateWithSession();
    } else {
      if (!user) {
        ensureAuthenticated().then(() => {
          if (subscriptionId) {
            pollSubscription();
          }
        });
      } else if (subscriptionId) {
        pollSubscription();
      } else if (sessionId) {
        pollSubscription();
      }
    }

    return () => clearTimeout(timer);
  }, [login, user, sessionId, subscriptionId]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24">
        <div className="w-full max-w-[952px] flex flex-col items-center gap-8">
          <div className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="w-10 h-10 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-[#78F17A]" />
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

            <div className="w-full flex flex-col items-center gap-4">
              <h1 className="text-[40px] font-semibold leading-[100%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600 }}>
                Welcome to Inspired Analyst Premium
              </h1>
              <p className="text-[14px] font-medium leading-[120%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500 }}>
                Your subscription is active.
              </p>
              <p className="text-[14px] font-medium leading-[120%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500 }}>
                You now have full access to our research library, position sizing calculator, portfolio analytics, and Shariah-compliant investment details.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-row items-start gap-5 mt-7">
            <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
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
                <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/Sparks--Streamline-Iconoir.svg"
                    alt="Sparks Icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-[100%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600 }}>
                    Browse Research
                  </h3>
                  <p className="text-base font-normal leading-[130%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 400 }}>
                    Access in-depth reports and analysis.
                  </p>
                </div>
                <button className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center">
                  <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">
                    Explore
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
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
                <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/Calculator--Streamline-Iconoir.svg"
                    alt="Calculator Icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">
                    Open Calculator
                  </h3>
                  <p className="text-base font-normal leading-[130%] text-center text-white">
                    Size positions based on your risk tolerance.
                  </p>
                </div>
                <button className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center">
                  <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">
                    Get Started
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
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
                <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                  <Image
                    src="/icons/User-Star--Streamline-Iconoir.svg"
                    alt="User Star Icon"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">
                    Set up Portfolio
                  </h3>
                  <p className="text-base font-normal leading-[130%] text-center text-white">
                    Track your investments and performance.
                  </p>
                </div>
                <button className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center">
                  <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">
                    Start Tracking
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-row justify-center items-center gap-2.5 mt-2">
            <p className="text-[14px] font-medium leading-[120%] text-center text-white">
              Manage your plan anytime in <span style={{ color: '#DE50EC' }}>Account → Billing</span>. Educational content only; not financial advice.
            </p>
          </div>
        </div>

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
                zIndex: 0
              }}
            />

            <div className="relative z-30 max-w-lg">
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-[28px] font-semibold leading-[100%] text-white">
                    What's Included in Your Subscription
                  </h2>
                  
                  <div className="flex flex-col items-start gap-4 w-full">
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Deep-dive reports with downloadable PDFs
                      </span>
                    </div>
                    
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Position sizing tailored to your risk
                      </span>
                    </div>
                    
                    <div className="flex flex-row items-center gap-2 w-full">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <span className="text-[16px] font-medium leading-[100%] text-white">
                        Portfolio allocation & P/L tracking
                      </span>
                    </div>
                    
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
      
      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white">Loading...</div>
        </div>
        <Footer />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}


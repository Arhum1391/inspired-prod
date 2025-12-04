'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

const actionCards = [
  {
    title: 'Browse Research',
    description: 'Access in-depth reports and analysis.',
    icon: '/icons/Sparks--Streamline-Iconoir.svg',
    href: '/research',
    cta: 'Explore',
  },
  {
    title: 'Open Calculator',
    description: 'Size positions based on your risk tolerance.',
    icon: '/icons/Calculator--Streamline-Iconoir.svg',
    href: '/calculator',
    cta: 'Get Started',
  },
  {
    title: 'Set up Portfolio',
    description: 'Track your investments and performance.',
    icon: '/icons/User-Star--Streamline-Iconoir.svg',
    href: '/portfolio',
    cta: 'Start Tracking',
  },
];

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [planName, setPlanName] = useState<string | null>(null);
  const { login, user } = useAuth();
  const sessionId = searchParams.get('session_id');
  const subscriptionId = searchParams.get('subscription_id');

  useEffect(() => {
    const timer = setTimeout(() => setShowSuccess(true), 300);

    const fetchPlanName = async () => {
      try {
        const subRes = await fetch('/api/subscription/current', { credentials: 'include', cache: 'no-store' });
        if (subRes.ok) {
          const subData = await subRes.json();
          if (subData.subscription?.planName) {
            setPlanName(subData.subscription.planName);
            return; // Exit early if we got the plan name
          }
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
      }
    };

    const pollSubscription = () => {
      // Try immediately first
      fetchPlanName();
      
      // Then retry after delay if needed
      setTimeout(async () => {
        try {
          const subRes = await fetch('/api/subscription/current', { credentials: 'include', cache: 'no-store' });
          if (subRes.ok) {
            const subData = await subRes.json();
            if (subData.subscription?.planName) {
              setPlanName(subData.subscription.planName);
            }
            if (!subData.subscription) {
              setTimeout(async () => {
                try {
                  const retryRes = await fetch('/api/subscription/current', { credentials: 'include', cache: 'no-store' });
                  if (retryRes.ok) {
                    const retryData = await retryRes.json();
                    if (retryData.subscription?.planName) {
                      setPlanName(retryData.subscription.planName);
                    }
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
              isPaid: data.user.isPaid ?? false,
              subscriptionStatus: data.user.subscriptionStatus ?? (data.user.isPaid ? 'active' : 'none'),
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
              isPaid: meData.user.isPaid ?? false,
              subscriptionStatus: meData.user.subscriptionStatus ?? (meData.user.isPaid ? 'active' : 'none'),
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
            isPaid: authData.user.isPaid ?? false,
            subscriptionStatus: authData.user.subscriptionStatus ?? (authData.user.isPaid ? 'active' : 'none'),
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

      {/* Mobile Gradients */}
      <div
        className="md:hidden opacity-100"
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          transform: 'rotate(0deg) translate(-280px, -330px)',
          transformOrigin: 'top left',
          background:
            'linear-gradient(107.68deg, rgba(110, 77, 136, 1) 9.35%, rgba(110, 77, 136, 0.9) 34.7%, rgba(110, 77, 136, 0.8) 60.06%, rgba(110, 77, 136, 0.7) 72.73%, rgba(110, 77, 136, 0.6) 88.58%)',
          filter: 'blur(120px)',
          maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      ></div>
      <div
        className="md:hidden opacity-100"
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          right: 0,
          bottom: 0,
          transform: 'rotate(-45deg) translate(250px, 250px)',
          transformOrigin: 'bottom right',
          background:
            'linear-gradient(107.68deg, rgba(23, 64, 136, 1) 9.35%, rgba(23, 64, 136, 1) 34.7%, rgba(23, 64, 136, 1) 60.06%, rgba(23, 64, 136, 0.9) 72.73%, rgba(23, 64, 136, 0.8) 88.58%)',
          filter: 'blur(150px)',
          maskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      ></div>

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 sm:pb-28">
        {/* Mobile Layout */}
        <div className="md:hidden max-w-[952px] mx-auto flex flex-col items-center gap-12">
          <header className="flex flex-col items-center text-center gap-6 sm:gap-8">
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

            <div className="flex flex-col items-center gap-4 sm:gap-5">
              <h1
                className="text-3xl sm:text-4xl font-semibold leading-[100%] text-white max-w-2xl"
                style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600 }}
              >
                {planName ? `Welcome to Inspired Analyst ${planName}` : 'Welcome to Inspired Analyst'}
              </h1>
              <p
                className="text-sm sm:text-base leading-[120%] text-white/90 max-w-xl"
                style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500 }}
              >
                Your subscription is active.
              </p>
              <p
                className="text-sm sm:text-base leading-[145%] text-white/80 max-w-2xl"
                style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 400 }}
              >
                You now have full access to our research library, position sizing calculator, portfolio analytics, and Shariah-compliant investment details.
              </p>
            </div>
          </header>

          <section className="w-full grid grid-cols-1 gap-6">
            {actionCards.map((card) => (
              <div key={card.title} className="relative bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-6">
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]" />
                </div>

                <div className="relative z-10 flex flex-col items-center gap-5">
                  <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                    <Image src={card.icon} alt={card.title} width={20} height={20} />
                  </div>
                  <div className="flex flex-col items-center gap-3 text-center">
                    <h3
                      className="text-2xl font-semibold leading-[100%] text-white"
                      style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600 }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-base leading-[130%] text-white/85"
                      style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 400 }}
                    >
                      {card.description}
                    </p>
                  </div>
                  <a
                    href={card.href}
                    className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center text-sm font-semibold text-[#1F1F1F] hover:opacity-80 transition-opacity"
                    style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600, lineHeight: '100%' }}
                  >
                    {card.cta}
                  </a>
                </div>
              </div>
            ))}
          </section>

          <section className="w-full text-center">
            <p
              className="text-sm sm:text-base leading-[145%] text-white/70 max-w-xl mx-auto"
              style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500 }}
            >
              Manage your plan anytime in <Link href={'/account'} className='cursor-pointer'>
                <span className="text-[#DE50EC]" > Account → Billing</span>
              </Link>. Educational content only; not financial advice.
            </p>
          </section>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block w-full">
          <div className="w-full max-w-[952px] mx-auto flex flex-col items-center gap-8">
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
                  {planName ? `Welcome to Inspired Analyst ${planName}` : 'Welcome to Inspired Analyst'}
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
              {/* Card 1 */}
              <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div className="w-full h-full rounded-[15px]" style={{ background: '#1F1F1F' }}></div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                    <Image src="/icons/Sparks--Streamline-Iconoir.svg" alt="Sparks Icon" width={20} height={20} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-2xl font-semibold leading-[100%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 600 }}>
                      Browse Research
                    </h3>
                    <p className="text-base font-normal leading-[130%] text-center text-white" style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 400 }}>
                      Access in-depth reports and analysis.
                    </p>
                  </div>
                  <a href="/research" className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">Explore</span>
                  </a>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div className="w-full h-full rounded-[15px]" style={{ background: '#1F1F1F' }}></div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                    <Image src="/icons/Calculator--Streamline-Iconoir.svg" alt="Calculator Icon" width={20} height={20} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">Open Calculator</h3>
                    <p className="text-base font-normal leading-[130%] text-center text-white">Size positions based on your risk tolerance.</p>
                  </div>
                  <a href="/calculator" className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">Get Started</span>
                  </a>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex-1 max-w-[304px] bg-[#1F1F1F] rounded-2xl p-6 relative">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div className="w-full h-full rounded-[15px]" style={{ background: '#1F1F1F' }}></div>
                </div>
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
                    <Image src="/icons/User-Star--Streamline-Iconoir.svg" alt="User Star Icon" width={20} height={20} className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <h3 className="text-2xl font-semibold leading-[100%] text-center text-white">Set up Portfolio</h3>
                    <p className="text-base font-normal leading-[130%] text-center text-white">Track your investments and performance.</p>
                  </div>
                  <a href="/portfolio" className="w-full bg-white border border-white rounded-full px-4 py-2.5 flex items-center justify-center hover:opacity-80 transition-opacity">
                    <span className="text-sm font-semibold leading-[100%] text-center text-[#1F1F1F]">Start Tracking</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-row justify-center items-center gap-2.5 mt-2">
              <p className="text-[14px] font-medium leading-[120%] text-center text-white">
                Manage your plan anytime in
                <Link href={'/account'} className='cursor-pointer'>
                  <span className="text-[#DE50EC]" > Account → Billing</span>
                </Link>. Educational content only; not financial advice.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1100px] mx-auto mt-12 px-4">
          <div
            className="newsletter-container relative bg-[#1F1F1F] rounded-2xl overflow-hidden w-full max-w-[1064px] mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-12"
            style={{ isolation: 'isolate' }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                padding: '1px'
              }}
            >
              <div className="w-full h-full rounded-[15px]" style={{ background: '#1F1F1F' }}></div>
            </div>

            <div
              className="hidden md:block"
              style={{
                position: 'absolute',
                width: '588px',
                height: '588px',
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
                transformStyle: 'preserve-3d'
              }}
            />

            <Image
              src="/insp logo.svg"
              alt="Inspired Analyst Decorative Logo"
              width={309}
              height={282}
              className="hidden md:block absolute right-[0px] bottom-[-60px] rotate-[20deg] opacity-15"
              style={{ filter: 'brightness(0.3)', zIndex: 1 }}
            />

            <Image
              src="/insp logo.svg"
              alt="Inspired Analyst Decorative Logo"
              width={200}
              height={220}
              className="md:hidden absolute right-[-50px] bottom-[-70px] rotate-[10deg] opacity-10"
              style={{ filter: 'brightness(0.7)', zIndex: 1 }}
            />

            <div className="relative z-30 flex flex-col gap-6 max-w-[640px]">
              <h2 className="text-[24px] sm:text-[28px] font-semibold leading-[110%] text-white">
                What's Included in Your Subscription
              </h2>
              <div className="flex flex-col items-start gap-4 w-full">
                {[
                  'Deep-dive reports with downloadable PDFs',
                  'Position sizing tailored to your risk',
                  'Portfolio allocation & P/L tracking',
                  'Shariah methodology & detailed screens'
                ].map((feature) => (
                  <div key={feature} className="flex flex-row items-center gap-2 w-full">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    <span className="text-[14px] sm:text-[16px] font-medium leading-[130%] text-white" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading..." />}>
      <SuccessPageContent />
    </Suspense>
  );
}


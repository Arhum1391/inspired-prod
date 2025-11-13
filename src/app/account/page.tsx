'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AccountPage = () => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [billingHistory, setBillingHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Fetch user subscription, payment method, and billing history
    const fetchAccountData = async () => {
      try {
        const [subRes, pmRes, billingRes] = await Promise.all([
          fetch('/api/subscription/current', { credentials: 'include' }),
          fetch('/api/payment-method/current', { credentials: 'include' }),
          fetch('/api/billing-history', { credentials: 'include' })
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData.subscription || null);
        } else {
          setSubscription(null);
        }

        if (pmRes.ok) {
          const pmData = await pmRes.json();
          setPaymentMethod(pmData.paymentMethod || null);
        } else {
          setPaymentMethod(null);
        }

        if (billingRes.ok) {
          const billingData = await billingRes.json();
          setBillingHistory(billingData.invoices || []);
        } else {
          setBillingHistory([]);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        setSubscription(null);
        setPaymentMethod(null);
        setBillingHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  const hasActiveSubscription = !!(
    subscription &&
    subscription.status &&
    ['active', 'trialing', 'past_due'].includes(subscription.status)
  );

  const planName = hasActiveSubscription ? subscription.planName : 'Free Plan';
  const planPrice = hasActiveSubscription
    ? subscription.displayPrice || subscription.price
    : 'Free';
  const planStatusClasses = hasActiveSubscription
    ? 'bg-[rgba(222,80,236,0.12)] border border-[#DE50EC]'
    : 'bg-[rgba(5,176,179,0.12)] border border-[#05B0B3]';
  const planStatusTextClasses = hasActiveSubscription
    ? 'text-[#DE50EC]'
    : 'text-[#05B0B3]';
  const planStatusLabel = hasActiveSubscription ? 'Active' : 'Free Access';

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Mobile Layout */}
      <div className="lg:hidden relative w-full pt-24 pb-24">
        <div className="max-w-[375px] mx-auto px-4 flex flex-col gap-10">
          {/* Profile Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-10 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                width: '588px',
                height: '588px',
                right: '-280px',
                top: '-360px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col gap-10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                  Profile Settings
                </h2>
                <button className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-3 py-2 rounded-full text-sm font-normal gilroy-semibold whitespace-nowrap">
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-normal gilroy-medium">
                    Full Name (optional)
                  </span>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4">
                    <span className="text-white/60 text-sm gilroy-medium truncate">
                      {user?.name || 'John Doe'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-normal gilroy-medium">
                    Email
                  </span>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4">
                    <span className="text-white/60 text-sm gilroy-medium truncate">
                      {user?.email || 'john.doe@example.com'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-normal gilroy-medium">
                    Password
                  </span>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4">
                    <span className="text-white/60 text-sm gilroy-medium">
                      ••••••••
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-8 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                width: '588px',
                height: '588px',
                right: '-280px',
                top: '-320px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-row items-center justify-between gap-4">
                <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                  Current Plan
                </h2>
                <div className={`flex flex-row justify-center items-center px-4 py-1.5 gap-2 rounded-full ${planStatusClasses}`}>
                  <span className={`${planStatusTextClasses} text-xs font-normal gilroy-medium text-center`}>
                    {planStatusLabel}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center justify-between gap-4">
                  <span className="text-white text-lg font-normal gilroy-semibold">
                    {planName}
                  </span>
                  <span className="text-[#D4D737] text-lg font-normal gilroy-semibold">
                    {planPrice}
                  </span>
                </div>
                {!hasActiveSubscription && (
                  <p className="text-white/60 text-sm font-normal gilroy-medium">
                    You have access to the free experience. Upgrade anytime to unlock premium research, tools, and community benefits.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:opacity-80 transition-opacity"
                >
                  Change Plan
                </button>

                {hasActiveSubscription ? (
                  <>
                    <button
                      onClick={() => router.push('/account/payment-method')}
                      className="w-full bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:opacity-80 transition-opacity"
                    >
                      Update Payment
                    </button>
                    <button
                      onClick={() => router.push('/account/cancel-plan')}
                      className="w-full bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:opacity-80 transition-opacity"
                    >
                      Cancel Plan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push('/pricing')}
                    className="w-full bg-white text-[#1F1F1F] px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center hover:bg-gray-100 transition-colors"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-6 overflow-hidden">
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-row items-center justify-between gap-4">
                <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                  Payment Method
                </h2>
                <button
                  onClick={() => hasActiveSubscription ? router.push('/account/payment-method') : router.push('/pricing')}
                  className="bg-white text-[#1F1F1F] px-3 py-2 rounded-full text-sm font-normal gilroy-semibold text-center hover:bg-gray-100 transition-colors"
                >
                  {hasActiveSubscription ? 'Update Payment' : 'Add Payment Method'}
                </button>
              </div>

              {paymentMethod ? (
                <div className="w-full border border-white/30 rounded-lg px-4 py-3 flex flex-col gap-2">
                  <div className="flex flex-row items-center gap-3">
                    <div className="w-10 h-6 bg-black/10 rounded-sm" />
                    <div className="flex flex-col gap-1">
                      <span className="text-white/60 text-sm gilroy-medium">
                        •••• •••• •••• {paymentMethod.last4 || '4242'}
                      </span>
                      <span className="text-white/60 text-xs gilroy-medium">
                        Expires {String(paymentMethod.expMonth || 12).padStart(2, '0')}/{String(paymentMethod.expYear || 2026).slice(-2)}
                      </span>
                    </div>
                    <div className="ml-auto px-2.5 py-1.5 border border-[#05B0B3] text-[#05B0B3] text-xs rounded-full">
                      Currently in Use
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full border border-white/30 rounded-lg px-4 py-6 text-center text-white/50 text-sm">
                  No payment method on file
                </div>
              )}
            </div>
          </div>

          {/* Billing History */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-6 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                width: '588px',
                height: '588px',
                right: '-260px',
                bottom: '-300px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(-30deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-white text-[20px] font-normal gilroy-semibold">
                  Billing History
                </h2>
                <button
                  onClick={() => router.push('/account/billing-history')}
                  className="text-white text-xs font-normal gilroy-semibold flex items-center gap-1 hover:opacity-80"
                >
                  View All
                  <span className="inline-block rotate-[-90deg]">➜</span>
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {billingHistory.length > 0 ? (
                  billingHistory.map((invoice: any) => {
                    const invoiceId = invoice.invoiceId || invoice.id || '';
                    const displayInvoiceId =
                      invoiceId && invoiceId.length > 12
                        ? `${invoiceId.slice(0, 10)}…`
                        : invoiceId || '—';

                    return (
                      <div
                        key={invoiceId || invoice.id}
                        className="border border-white/30 rounded-lg px-4 py-3 flex flex-col gap-3"
                      >
                        <div className="flex flex-row items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-white text-sm gilroy-medium">Invoice Id :</span>
                            <span className="text-white/60 text-sm gilroy-medium" title={invoiceId}>
                              {displayInvoiceId}
                            </span>
                          </div>
                          <div className="px-3 py-1 border border-[#05B353] bg-[rgba(5,179,83,0.12)] text-[#05B353] text-xs rounded-full">
                            {invoice.status === 'paid' ? 'Paid' : invoice.status}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 text-white/70 text-sm gilroy-medium">
                          <div className="flex justify-between">
                            <span>Date</span>
                            <span>{new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount</span>
                            <span>{invoice.amount} {invoice.currency?.toUpperCase() || 'USD'}</span>
                          </div>
                        </div>
                        {invoice.invoiceUrl && (
                          <a
                            href={invoice.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 w-full bg-white text-[#0A0A0A] px-4 py-2 rounded-full text-sm font-normal gilroy-semibold text-center hover:bg-gray-100 transition-colors"
                          >
                            Download PDF
                          </a>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="border border-white/30 rounded-lg px-4 py-6 text-center text-white/50 text-sm">
                    No billing history available yet
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="relative bg-[#141414] rounded-[10px] p-6 flex flex-col gap-6 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                width: '620px',
                height: '360px',
                left: '-160px',
                top: '120px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(-30deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 flex flex-col gap-6">
              <Image src="/logo/navlogo-mob.svg" alt="Inspired Analyst" width={160} height={30} className="w-[160px] h-auto" />
              <p className="text-white text-sm gilroy-medium leading-[130%]">
                I simplify stocks, crypto, and data science with humor and clarity. My content turns complex ideas into practical tips—helping you stand out, level up, and crush your goals without the boring jargon.
              </p>
              <div className="flex flex-col gap-3 text-white/80 text-sm gilroy-medium">
                <span className="text-white text-base gilroy-semibold">General</span>
                <div className="flex flex-col gap-2">
                  <span>Research</span>
                  <span>Calculator</span>
                  <span>Portfolio</span>
                  <span>Shariah</span>
                  <span>Our Team</span>
                  <span>Bootcamp</span>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4 flex flex-col gap-3 text-white/80 text-xs gilroy-medium">
                <span>© {new Date().getFullYear()} Inspired Analyst. All Rights Reserved</span>
                <div className="flex flex-col gap-2">
                  <span>Privacy Policy</span>
                  <span>Terms &amp; Conditions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          {/* Profile Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 mt-24 flex flex-col items-center gap-4 overflow-hidden">
            <div
              className="absolute pointer-events-none"
              style={{
                position: 'absolute',
                width: '508px',
                height: '508px',
                left: '779.5px',
                top: '-396px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-row items-start justify-between gap-6">
                <div className="flex flex-col items-start gap-3 flex-1">
                  <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                    Profile Settings
                  </h1>
                </div>
                <button className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-2.5 rounded-full text-sm font-normal gilroy-semibold whitespace-nowrap">
                  Edit Profile
                </button>
              </div>

              <div className="w-full flex flex-col items-start gap-6">
                <div className="w-full flex flex-col sm:flex-row items-start gap-6">
                  <div className="w-full sm:w-1/2 flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Full Name (optional)
                    </label>
                    <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                      <input
                        type="text"
                        placeholder="John Doe"
                        defaultValue={user?.name || ''}
                        className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Email
                    </label>
                    <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                      <input
                        type="email"
                        placeholder="John.doe24@gmail.com"
                        defaultValue={user?.email || ''}
                        readOnly
                        className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col items-start gap-1">
                  <label className="text-white text-sm font-normal gilroy-medium">
                    Password
                  </label>
                  <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Plan Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 overflow-hidden mt-16">
            <div
              className="absolute pointer-events-none"
              style={{
                position: 'absolute',
                width: '508px',
                height: '508px',
                left: '779.5px',
                top: '-396px',
                background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                filter: 'blur(100px)',
                transform: 'rotate(90deg)',
                zIndex: 0
              }}
            />

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <div className="w-full flex flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                      Current Plan
                    </h2>
                  </div>

                  <div className={`flex flex-row justify-center items-center px-6 py-1.5 gap-2.5 rounded-full ${planStatusClasses}`}>
                    <span className={`${planStatusTextClasses} text-xs font-normal gilroy-medium text-center`}>
                      {planStatusLabel}
                    </span>
                  </div>
                </div>

                <div className="w-full flex flex-row items-start justify-between gap-3">
                  <span className="text-white text-xl font-normal gilroy-semibold flex-1">
                    {planName}
                  </span>
                  <span className="text-[#D4D737] text-2xl font-normal gilroy-semibold">
                    {planPrice}
                  </span>
                </div>
              </div>

              {!hasActiveSubscription && (
                <p className="text-white/60 text-sm font-normal gilroy-medium">
                  You have access to the free experience. Upgrade anytime to unlock premium research, tools, and community benefits.
                </p>
              )}

              <div className="w-full flex flex-row items-start gap-6">
                <button 
                  onClick={() => router.push('/pricing')}
                  className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                >
                  Change Plan
                </button>

                {hasActiveSubscription ? (
                  <>
                    <button 
                      onClick={() => router.push('/account/payment-method')}
                      className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                    >
                      Update Payment
                    </button>

                    <button 
                      onClick={() => router.push('/account/cancel-plan')}
                      className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                    >
                      Cancel Plan
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => router.push('/pricing')}
                    className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                  >
                    Upgrade to Premium
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 mt-16 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                padding: '1px',
                zIndex: 1
              }}
            >
              <div
                className="w-full h-full rounded-[15px]"
                style={{
                  background: '#1F1F1F'
                }}
              ></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <div className="w-full flex flex-row items-center justify-between gap-6">
                  <div className="flex flex-col items-start gap-3 flex-1">
                    <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                      Payment Method
                    </h2>
                  </div>

                  <button 
                    onClick={() => hasActiveSubscription ? router.push('/account/payment-method') : router.push('/pricing')}
                    className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-2.5 rounded-full text-sm font-normal gilroy-semibold text-center"
                  >
                    {hasActiveSubscription ? 'Update Payment' : 'Add Payment Method'}
                  </button>
                </div>

                {paymentMethod ? (
                  <div className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-4">
                    <div className="w-10 h-6 bg-black/5 relative flex-shrink-0">
                      <div className="absolute inset-0 bg-[#0028FF] rounded-sm" />
                      <div className="absolute left-1 top-1 right-1 h-1 bg-white rounded-sm" />
                    </div>

                    <div className="flex flex-col justify-center items-start gap-2 flex-1">
                      <span className="text-white/30 text-sm font-normal gilroy-medium">
                        •••• •••• •••• {paymentMethod.last4 || '4242'}
                      </span>
                      <span className="text-white/30 text-xs font-normal gilroy-medium">
                        Expires {String(paymentMethod.expMonth || 12).padStart(2, '0')}/{String(paymentMethod.expYear || 2026).slice(-2)}
                      </span>
                    </div>

                    <div className="flex flex-row justify-center items-center px-2.5 py-1.5 gap-2.5 bg-[rgba(5,176,179,0.12)] border border-[#05B0B3] rounded-full">
                      <span className="text-[#05B0B3] text-xs font-normal gilroy-medium text-center">
                        Currently in Use
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full border border-white/30 rounded-lg p-4">
                    <p className="text-white/50 text-sm">No payment method on file</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Billing History Card */}
          <div className="relative w-full max-w-[846px] bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8 mt-16 mb-32 overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: '16px',
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                padding: '1px',
                zIndex: 1
              }}
            >
              <div
                className="w-full h-full rounded-[15px]"
                style={{
                  background: '#1F1F1F'
                }}
              ></div>
            </div>

            <div className="relative z-10 w-full flex flex-col items-start gap-10">
              <div className="w-full flex flex-col items-start gap-4">
                <h2 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                  Billing History
                </h2>
              </div>

              <div className="w-full flex flex-col items-start gap-3">
                <div className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-6">
                  <div className="w-[134px] flex flex-col justify-center items-center">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Invoice ID
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-start">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Date
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-start">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Amount
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-center">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Status
                    </span>
                  </div>
                  <div className="w-[134px] flex flex-col justify-center items-center">
                    <span className="text-white text-sm font-normal gilroy-medium text-center">
                      Download
                    </span>
                  </div>
                </div>

                {billingHistory.length > 0 ? (
                  billingHistory.map((invoice: any) => {
                    const invoiceId = invoice.invoiceId || invoice.id || '';
                    const displayInvoiceId =
                      invoiceId && invoiceId.length > 12
                        ? `${invoiceId.slice(0, 10)}…`
                        : invoiceId || '—';

                    return (
                      <div key={invoiceId || invoice.id} className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-6">
                        <div className="w-[134px] flex flex-col justify-center items-center">
                          <span className="text-white text-sm font-normal gilroy-medium text-center">
                            <span title={invoiceId}>{displayInvoiceId}</span>
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-start">
                          <span className="text-white text-sm font-normal gilroy-medium">
                            {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-start">
                          <span className="text-white text-sm font-normal gilroy-medium">
                            {invoice.amount} {invoice.currency?.toUpperCase() || 'USD'}
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-center">
                          <span className="text-[#05B0B3] text-xs font-normal gilroy-medium text-center px-2.5 py-1.5 bg-[rgba(5,176,179,0.12)] border border-[#05B0B3] rounded-full">
                            {invoice.status === 'paid' ? 'Paid' : invoice.status}
                          </span>
                        </div>
                        <div className="w-[134px] flex flex-col justify-center items-center">
                          {invoice.invoiceUrl && (
                            <a
                              href={invoice.invoiceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-sm font-normal gilroy-medium hover:opacity-80 underline"
                            >
                              PDF
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full">
                    <p className="text-white/50 text-sm text-center py-8">
                      No billing history available yet
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AccountPage;


'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
          setSubscription(subData.subscription);
          
          // If no active subscription, redirect to pricing page
          if (!subData.subscription || !subData.subscription.status || 
              !['active', 'trialing', 'past_due'].includes(subData.subscription.status)) {
            router.push('/pricing');
            return;
          }
        } else {
          // If subscription fetch fails, redirect to pricing
          router.push('/pricing');
          return;
        }

        if (pmRes.ok) {
          const pmData = await pmRes.json();
          setPaymentMethod(pmData.paymentMethod);
        }

        if (billingRes.ok) {
          const billingData = await billingRes.json();
          setBillingHistory(billingData.invoices || []);
        }
      } catch (error) {
        console.error('Error fetching account data:', error);
        // On error, redirect to pricing
        router.push('/pricing');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Redirect if no subscription (will be handled in useEffect, but add safety check here too)
  if (!subscription || !subscription.status || !['active', 'trialing', 'past_due'].includes(subscription.status)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20">
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

                  {subscription?.status === 'active' && (
                    <div className="flex flex-row justify-center items-center px-6 py-1.5 gap-2.5 bg-[rgba(222,80,236,0.12)] border border-[#DE50EC] rounded-full">
                      <span className="text-[#DE50EC] text-xs font-normal gilroy-medium text-center">
                        Active
                      </span>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-row items-start justify-between gap-3">
                  <span className="text-white text-xl font-normal gilroy-semibold flex-1">
                    {subscription?.planName || 'No Active Plan'}
                  </span>
                  {subscription && (
                    <span className="text-[#D4D737] text-2xl font-normal gilroy-semibold">
                      {subscription.displayPrice || subscription.price}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full flex flex-row items-start gap-6">
                <button 
                  onClick={() => router.push('/pricing')}
                  className="hover:opacity-80 transition-opacity bg-[#1F1F1F] border border-white text-white px-4 py-3 rounded-full text-sm font-normal gilroy-semibold text-center flex-1"
                >
                  Change Plan
                </button>

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
                    onClick={() => router.push('/account/payment-method')}
                    className="hover:opacity-80 transition-opacity bg-white text-[#1F1F1F] px-4 py-2.5 rounded-full text-sm font-normal gilroy-semibold text-center"
                  >
                    Update Payment
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
                  billingHistory.map((invoice: any) => (
                    <div key={invoice.id} className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-6">
                      <div className="w-[134px] flex flex-col justify-center items-center">
                        <span className="text-white text-sm font-normal gilroy-medium text-center">
                          {invoice.invoiceId || invoice.id}
                        </span>
                      </div>
                      <div className="w-[134px] flex flex-col justify-center items-start">
                        <span className="text-white text-sm font-normal gilroy-medium">
                          {new Date(invoice.paidAt || invoice.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="w-[134px] flex flex-col justify-center items-start">
                        <span className="text-white text-sm font-normal gilroy-medium">
                          {invoice.amount} {invoice.currency?.toUpperCase() || 'BNB'}
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
                  ))
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


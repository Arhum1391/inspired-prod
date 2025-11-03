'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'monthly' || planParam === 'annual') {
      setPlan(planParam);
    }
  }, [searchParams]);

  const planDetails = {
    monthly: {
      name: 'Premium Monthly',
      price: '30 BNB',
      priceAmount: 30,
      billingFrequency: 'Monthly',
      interval: 'month'
    },
    annual: {
      name: 'Premium Annual',
      price: '120 BNB',
      priceAmount: 120,
      billingFrequency: 'Yearly',
      interval: 'year'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get email from auth context or sessionStorage (from signup)
    const customerEmail = user?.email || sessionStorage.getItem('signupEmail');
    
    if (!customerEmail) {
      router.push('/signin');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-subscription-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan,
          customerEmail: customerEmail,
          customerName: user?.name || customerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />

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

      <div
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '1237px',
          top: '488px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(80px)',
          transform: 'rotate(-55deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>

      <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="w-full max-w-[846px] mx-auto">
          <div className="flex flex-col items-start gap-6 mb-10">
            <h1 
              className="text-white"
              style={{
                fontFamily: 'Gilroy, sans-serif',
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: '100%',
                color: '#FFFFFF'
              }}
            >
              Complete Your Subscription
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-10 w-full">
            <div className="flex-1 flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <h3 
                  className="text-white"
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF'
                  }}
                >
                  Payment Details
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Card Information Label */}
                  <p
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Card information
                  </p>

                  {/* Card Number */}
                  <div className="flex flex-col gap-1">
                    <label
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
                      }}
                    >
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 1234 1234 1234"
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
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Expiry Date and CVC Row */}
                  <div className="flex flex-row gap-6">
                    {/* Expiry Date */}
                    <div className="flex-1 flex flex-col gap-1">
                      <label
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF'
                        }}
                      >
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
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
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          outline: 'none'
                        }}
                      />
                    </div>

                    {/* CVC */}
                    <div className="flex-1 flex flex-col gap-1">
                      <label
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF'
                        }}
                      >
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
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
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex flex-row justify-center items-center px-4 py-3 gap-2"
                      style={{
                        width: '195px',
                        height: '48px',
                        background: isProcessing ? '#666' : '#FFFFFF',
                        borderRadius: '100px',
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 600,
                        fontSize: '16px',
                        lineHeight: '100%',
                        textAlign: 'center',
                        color: '#404040',
                        border: 'none',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        opacity: isProcessing ? 0.6 : 1
                      }}
                    >
                      {isProcessing ? 'Processing...' : 'Pay & Start Premium'}
                    </button>

                    <p
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 500,
                        fontSize: '12px',
                        lineHeight: '130%',
                        color: '#FFFFFF',
                        maxWidth: '501px'
                      }}
                    >
                      By clicking "Pay & Start Premium", you agree to our Terms of Service and Privacy Policy. Your subscription will automatically renew unless cancelled. You can cancel anytime from your account settings.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-full md:w-[305px] flex-shrink-0">
              <div
                className="flex flex-col items-start p-4 gap-4"
                style={{
                  background: '#1F1F1F',
                  borderRadius: '12px'
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                fontWeight: 600,
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF'
                  }}
                >
                  Order Summary
                </h3>

                <div style={{ width: '100%', height: '1px', border: '1px solid #404040' }}></div>

                <div className="flex flex-col gap-6 w-full">
                  <div className="flex flex-row items-center gap-2">
                    <h4
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                fontWeight: 600,
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
                      }}
                    >
                      {planDetails[plan].name}
                    </h4>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Billed
                      </span>
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {planDetails[plan].billingFrequency}
                      </span>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Price
                      </span>
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {planDetails[plan].price}
                      </span>
                    </div>

                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Tax
                      </span>
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        10%
                      </span>
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '1px', border: '1px solid #404040' }}></div>

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '100%', color: '#FFFFFF' }}>
                        Total
                      </span>
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {planDetails[plan].price}
                      </span>
                    </div>
                  </div>

                  {/* Next Charge */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center">
                      <span style={{ fontFamily: 'Gilroy, sans-serif', fontWeight: 500, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Next charge on November 8, 2025
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
        <Navbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          <div className="text-white">Loading...</div>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}


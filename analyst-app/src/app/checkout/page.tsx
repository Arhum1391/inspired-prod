'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      billingFrequency: 'Monthly'
    },
    annual: {
      name: 'Premium Annual',
      price: '120 BNB',
      billingFrequency: 'Yearly'
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle payment processing here
    console.log('Processing payment for:', plan, 'Plan:', planDetails[plan]);
    // In a real app, you would integrate with a payment processor like Stripe
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to success page after payment completion
      router.push('/success');
    }, 2000);
  };

  const handleBack = () => {
    router.push('/pricing');
  };

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
          top: '488px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(80px)',
          transform: 'rotate(-55deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>

      {/* Main Content */}
      <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="w-full max-w-[846px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-start gap-6 mb-10">
            <h1 
              className="text-white"
              style={{
                fontFamily: 'Gilroy-SemiBold, sans-serif',
                fontWeight: 400,
                fontSize: '32px',
                lineHeight: '100%',
                color: '#FFFFFF'
              }}
            >
              Complete Your Subscription
            </h1>
          </div>

          {/* Content Grid */}
          <div className="flex flex-col md:flex-row gap-10 w-full">
            {/* Left Side - Payment Details */}
            <div className="flex-1 flex flex-col gap-10">
              {/* Payment Details Section */}
              <div className="flex flex-col gap-6">
                <h3 
                  className="text-white"
                  style={{
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    fontWeight: 400,
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
                      fontFamily: 'Gilroy-SemiBold, sans-serif',
                      fontWeight: 400,
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
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontWeight: 400,
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
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  {/* Expiry Date and CVC Row */}
                  <div className="flex flex-row gap-6">
                    {/* Expiry Date */}
                    <div className="flex-1 flex flex-col gap-1">
                      <label
                        style={{
                          fontFamily: 'Gilroy-Medium, sans-serif',
                          fontWeight: 400,
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
                          fontFamily: 'Gilroy-Medium, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          outline: 'none'
                        }}
                        required
                      />
                    </div>

                    {/* CVC */}
                    <div className="flex-1 flex flex-col gap-1">
                      <label
                        style={{
                          fontFamily: 'Gilroy-Medium, sans-serif',
                          fontWeight: 400,
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
                          fontFamily: 'Gilroy-Medium, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          outline: 'none'
                        }}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex flex-row justify-center items-center px-4 py-3 gap-2"
                      style={{
                        width: '195px',
                        height: '48px',
                        background: '#FFFFFF',
                        borderRadius: '100px',
                        fontFamily: 'Gilroy-SemiBold, sans-serif',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        textAlign: 'center',
                        color: '#404040',
                        border: 'none',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        opacity: isSubmitting ? 0.6 : 1
                      }}
                    >
                      {isSubmitting ? 'Processing...' : 'Pay & Start Premium'}
                    </button>

                    <p
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontWeight: 400,
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

            {/* Right Side - Order Summary */}
            <div className="w-full md:w-[305px] flex-shrink-0">
              <div
                className="flex flex-col items-start p-4 gap-4"
                style={{
                  background: '#1F1F1F',
                  borderRadius: '12px'
                }}
              >
                {/* Order Summary Title */}
                <h3
                  style={{
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF'
                  }}
                >
                  Order Summary
                </h3>

                {/* Divider */}
                <div style={{ width: '100%', height: '1px', border: '1px solid #404040' }}></div>

                {/* Summary Content */}
                <div className="flex flex-col gap-6 w-full">
                  {/* Plan Name */}
                  <div className="flex flex-row items-center gap-2">
                    <h4
                      style={{
                        fontFamily: 'Gilroy-SemiBold, sans-serif',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
                      }}
                    >
                      {planDetails[plan].name}
                    </h4>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-4">
                    {/* Billed */}
                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Billed
                      </span>
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {planDetails[plan].billingFrequency}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Price
                      </span>
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {planDetails[plan].price}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
                        Tax
                      </span>
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        10%
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ width: '100%', height: '1px', border: '1px solid #404040' }}></div>

                  {/* Total */}
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-row justify-between items-center">
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '100%', color: '#FFFFFF' }}>
                        Total
                      </span>
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#FFFFFF' }}>
                        {planDetails[plan].price}
                      </span>
                    </div>
                  </div>

                  {/* Next Charge */}
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row items-center">
                      <span style={{ fontFamily: 'Gilroy-Medium, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '100%', color: '#909090' }}>
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

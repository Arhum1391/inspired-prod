'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

const PaymentMethodPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Handle payment method update here
    console.log('Updating payment method:', { cardNumber, expiryDate, cvc });
    // In a real app, you would integrate with a payment processor like Stripe
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect back to account page after successful update
      router.push('/account');
    }, 2000);
  };

  const handleBack = () => {
    router.push('/account');
  };

  const handleRemoveCard = () => {
    // Handle card removal logic here
    console.log('Removing current payment method');
    // In a real app, you would call an API to remove the payment method
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
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 relative z-10">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          {/* Header Section */}
          <div className="w-full flex flex-col items-start gap-6 mb-10">
            {/* Back Button */}
            <button 
              onClick={handleBack}
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

            {/* Title and Description */}
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                Update Payment Method
              </h1>
              <p className="text-white text-base font-normal gilroy-medium">
                Your next charge will use this card.
              </p>
            </div>
          </div>

          {/* Content Container */}
          <div className="w-full flex flex-col items-start gap-10">
            {/* Current Payment Method Section */}
            <div className="w-full bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8">
              <div className="w-full flex flex-col items-start gap-6">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Current Payment Method
                </h2>
                
                {/* Current Card Display */}
                <div className="w-full border border-white/30 rounded-lg p-4 flex flex-row items-center gap-6">
                  {/* Card Icon */}
                  <div className="w-10 h-6 bg-black/5 relative flex-shrink-0">
                    {/* Card background */}
                    <div className="absolute inset-0 bg-[#0028FF] rounded-sm" />
                    {/* Card stripes */}
                    <div className="absolute left-1 top-1 right-1 h-1 bg-white rounded-sm" />
                  </div>

                  {/* Card Details */}
                  <div className="flex flex-col justify-center items-start gap-2 flex-1">
                    <span className="text-white/30 text-sm font-normal gilroy-medium">
                      •••• •••• •••• 4242
                    </span>
                    <span className="text-white/30 text-xs font-normal gilroy-medium">
                      Expires 12/26
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row items-center gap-2">
                    {/* Currently in Use Badge */}
                    <div className="flex flex-row justify-center items-center px-2.5 py-1.5 gap-2.5 bg-[rgba(5,176,179,0.12)] border border-[#05B0B3] rounded-full">
                      <span className="text-[#05B0B3] text-xs font-normal gilroy-medium text-center">
                        Currently in Use
                      </span>
                    </div>

                    {/* Remove Button */}
                    <button 
                      onClick={handleRemoveCard}
                      className="flex flex-row justify-center items-center px-2.5 py-1.5 gap-2.5 bg-[rgba(187,4,4,0.12)] border border-[#BB0404] rounded-full hover:opacity-80 transition-opacity"
                    >
                      <span className="text-[#BB0404] text-xs font-normal gilroy-medium text-center">
                        Remove
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Card Section */}
            <div className="w-full bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-6">
              <div className="w-full flex flex-col items-start gap-6">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Add New Card
                </h2>
                
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
                  {/* Card Number */}
                  <div className="w-full flex flex-col items-start gap-1">
                    <label className="text-white text-sm font-normal gilroy-medium">
                      Card Number
                    </label>
                    <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="1234 1234 1234 1234"
                        className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus:ring-transparent focus:ring-offset-0"
                        style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                        required
                      />
                    </div>
                  </div>

                  {/* Expiry Date and CVC Row */}
                  <div className="w-full flex flex-row items-start gap-6">
                    {/* Expiry Date */}
                    <div className="flex-1 flex flex-col items-start gap-1">
                      <label className="text-white text-sm font-normal gilroy-medium">
                        Expiry Date
                      </label>
                      <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                        <input
                          type="text"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus:ring-transparent focus:ring-offset-0"
                          style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                          required
                        />
                      </div>
                    </div>

                    {/* CVC */}
                    <div className="flex-1 flex flex-col items-start gap-1">
                      <label className="text-white text-sm font-normal gilroy-medium">
                        CVC
                      </label>
                      <div className="w-full h-10 border border-white/30 rounded-lg flex items-center px-4 focus-within:border-white/30">
                        <input
                          type="text"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          placeholder="123"
                          className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium focus:outline-none focus:ring-0 focus:border-none focus:shadow-none focus:ring-transparent focus:ring-offset-0"
                          style={{ boxShadow: 'none', border: 'none', outline: 'none' }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="w-full flex flex-row justify-start">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex flex-row justify-center items-center px-4 py-3 gap-2 bg-white text-[#404040] rounded-full text-base font-normal gilroy-semibold hover:opacity-80 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        width: '195px',
                        height: '48px'
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save New Card'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Footer Note */}
            <div className="w-full flex flex-col items-start -mt-4 mb-4">
              <p className="text-white text-xs font-normal gilroy-medium leading-[130%]">
                Updating your payment method won't change your plan. Your next renewal will use the new card.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;

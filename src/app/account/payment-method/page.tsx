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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/payment-method/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber, expiryDate, cvc }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/account');
      } else {
        alert(data.error || 'Failed to update payment method');
      }
    } catch (error) {
      console.error('Error updating payment method:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push('/account');
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
          top: '758px',
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
          top: '528px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>
      
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-20 relative z-10">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          <div className="w-full flex flex-col items-start gap-6 mb-10">
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

            <div className="flex flex-col items-start gap-4">
              <h1 className="text-white text-4xl font-normal leading-none gilroy-semibold">
                Update Payment Method
              </h1>
              <p className="text-white text-base font-normal gilroy-medium">
                Your next charge will use this card.
              </p>
            </div>
          </div>

          <div className="w-full flex flex-col items-start gap-10">
            <div className="w-full bg-[#1F1F1F] rounded-2xl p-6 flex flex-col items-center gap-8">
              <div className="w-full flex flex-col items-start gap-6">
                <h2 className="text-white text-xl font-normal gilroy-semibold">
                  Add New Card
                </h2>
                
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
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
                        className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full flex flex-row items-start gap-6">
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
                          className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                          required
                        />
                      </div>
                    </div>

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
                          className="w-full bg-transparent border-none outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                          required
                        />
                      </div>
                    </div>
                  </div>

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


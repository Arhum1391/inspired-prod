'use client';

import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<'monthly' | 'annual'>('monthly');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [hasCheckedCustomer, setHasCheckedCustomer] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam === 'monthly' || planParam === 'annual') {
      setPlan(planParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedEmail =
      typeof window !== 'undefined' ? sessionStorage.getItem('signupEmail') : null;
    const email = user?.email || storedEmail;
    const name = user?.name || email;
    setCustomerEmail(email);
    setCustomerName(name);
    setHasCheckedCustomer(true);
  }, [user]);

  useEffect(() => {
    if (!hasCheckedCustomer) return;
    if (!customerEmail) {
      router.push('/signin');
    }
  }, [hasCheckedCustomer, customerEmail, router]);

  useEffect(() => {
    if (!customerEmail) {
      return;
    }

    if (!stripePromise) {
      setError('Stripe is not configured. Please contact support.');
      return;
    }

    let isMounted = true;

    const createSubscriptionIntent = async () => {
      try {
        setIsInitializingPayment(true);
        setError(null);
        setFormError(null);
        setClientSecret(null);
        setSubscriptionId(null);

        const response = await fetch('/api/stripe/create-subscription-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            plan,
            customerEmail,
            customerName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Unable to initialize payment');
        }

        if (!isMounted) return;

        setClientSecret(data.clientSecret);
        setSubscriptionId(data.subscriptionId);
      } catch (err: any) {
        if (!isMounted) return;
        console.error('Error initializing subscription:', err);
        setError(err.message || 'Failed to initialize payment. Please try again.');
      } finally {
        if (isMounted) {
          setIsInitializingPayment(false);
        }
      }
    };

    createSubscriptionIntent();

    return () => {
      isMounted = false;
    };
  }, [plan, customerEmail, customerName]);

  const planDetails = {
    monthly: {
      name: 'Premium Monthly',
      price: '$30 USD',
      priceAmount: 30,
      billingFrequency: 'Monthly',
      interval: 'month'
    },
    annual: {
      name: 'Premium Annual',
      price: '$120 USD',
      priceAmount: 120,
      billingFrequency: 'Yearly',
      interval: 'year'
    }
  };

  const handlePaymentSuccess = useCallback(
    (subscription: string, paymentIntentId?: string | null) => {
      const params = new URLSearchParams();
      if (subscription) {
        params.set('subscription_id', subscription);
      }
      if (paymentIntentId) {
        params.set('payment_intent', paymentIntentId);
      }
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('signupEmail');
      }
      const search = params.toString();
      router.push(`/success${search ? `?${search}` : ''}`);
    },
    [router],
  );

  const handlePaymentError = useCallback((message: string | null) => {
    setFormError(message);
  }, []);

  const appearance = useMemo(
    () => ({
      theme: 'night' as const,
      variables: {
        colorPrimary: '#FFFFFF',
        colorBackground: '#0A0A0A',
        colorText: '#FFFFFF',
        colorDanger: '#FF7070',
        fontFamily: 'Gilroy, sans-serif',
        fontSizeBase: '14px',
      },
      rules: {
        '.Input': {
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backgroundColor: 'transparent',
          color: '#FFFFFF',
        },
        '.Input:focus': {
          borderColor: '#FFFFFF',
        },
        '.Label': {
          color: '#FFFFFF',
          fontFamily: 'Gilroy, sans-serif',
        },
      },
    }),
    [],
  );

  const elementsOptions = useMemo(
    () =>
      clientSecret
        ? {
            clientSecret,
            appearance,
          }
        : undefined,
    [clientSecret, appearance],
  );

  if (!hasCheckedCustomer || !customerEmail) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

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

          {(error || formError) && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-red-400 text-sm">{error || formError}</p>
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

                {isInitializingPayment || !elementsOptions || !subscriptionId ? (
                  <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-white/20 bg-white/5 px-4 py-10 text-sm text-white/70">
                    Preparing secure payment form...
                  </div>
                ) : !stripePromise ? (
                  <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-10 text-sm text-red-300">
                    Stripe is not configured. Please contact support.
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={elementsOptions} key={clientSecret}>
                    <CheckoutPaymentForm
                      customerEmail={customerEmail as string}
                      customerName={customerName}
                      subscriptionId={subscriptionId}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
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

interface CheckoutPaymentFormProps {
  customerEmail: string;
  customerName?: string | null;
  subscriptionId: string;
  onSuccess: (subscriptionId: string, paymentIntentId?: string | null) => void;
  onError: (message: string | null) => void;
}

function CheckoutPaymentForm({
  customerEmail,
  customerName,
  subscriptionId,
  onSuccess,
  onError,
}: CheckoutPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [billingName, setBillingName] = useState(customerName ?? '');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setBillingName(customerName ?? '');
  }, [customerName]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!stripe || !elements) {
        return;
      }

      setIsProcessing(true);
      setLocalError(null);
      onError(null);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: billingName || undefined,
              email: customerEmail,
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        const message = error.message || 'Payment failed. Please try again.';
        setLocalError(message);
        onError(message);
        setIsProcessing(false);
        return;
      }

      const status = paymentIntent?.status;

      if (
        status === 'succeeded' ||
        status === 'processing' ||
        status === 'requires_action'
      ) {
        onSuccess(subscriptionId, paymentIntent?.id ?? null);
      } else {
        const message = 'Unable to confirm payment. Please try again.';
        setLocalError(message);
        onError(message);
        setIsProcessing(false);
      }
    },
    [stripe, elements, billingName, customerEmail, onError, onSuccess, subscriptionId],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <label
          style={{
            fontFamily: 'Gilroy, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '100%',
            color: '#FFFFFF',
          }}
        >
          Name on card
        </label>
        <input
          type="text"
          value={billingName}
          onChange={(event) => setBillingName(event.target.value)}
          placeholder="John Doe"
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
            outline: 'none',
          }}
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-[#151515] p-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <div className="flex flex-col gap-4">
        <button
          type="submit"
          disabled={isProcessing || !stripe || !elements}
          className="flex flex-row justify-center items-center px-4 py-3 gap-2 disabled:cursor-not-allowed"
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
            opacity: isProcessing ? 0.6 : 1,
          }}
        >
          {isProcessing ? 'Processing...' : `Pay & Start Premium`}
        </button>

        <p
          style={{
            fontFamily: 'Gilroy, sans-serif',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '130%',
            color: '#FFFFFF',
            maxWidth: '501px',
          }}
        >
          By clicking "Pay & Start Premium", you agree to our Terms of Service and Privacy Policy.
          Your subscription will automatically renew unless cancelled. You can cancel anytime from
          your account settings.
        </p>

        {localError && (
          <p className="text-sm text-red-400" style={{ fontFamily: 'Gilroy, sans-serif' }}>
            {localError}
          </p>
        )}
      </div>
    </form>
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


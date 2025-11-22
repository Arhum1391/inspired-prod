'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CustomInput from '@/components/CustomInput';

const PaymentMethodPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    // Check for active subscription and fetch payment method
    const checkSubscription = async () => {
      try {
        const [subRes, pmRes] = await Promise.all([
          fetch('/api/subscription/current', { credentials: 'include' }),
          fetch('/api/payment-method/current', { credentials: 'include' })
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubscription(subData.subscription);

          // If no active subscription, redirect to pricing
          if (!subData.subscription || !subData.subscription.status ||
            !['active', 'trialing', 'past_due'].includes(subData.subscription.status)) {
            router.push('/pricing');
            return;
          }
        } else {
          router.push('/pricing');
          return;
        }

        if (pmRes.ok) {
          const pmData = await pmRes.json();
          setPaymentMethod(pmData.paymentMethod || null);
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
              gap: '20px',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0
            }}
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
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
                  transform: 'rotate(-90deg)',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
                  <path d="M5 1L5 9M5 1L1 5M5 1L9 5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

            {/* Title and Description */}
            <div
              className="flex flex-col justify-center items-start w-full"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '12px',
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
                  lineHeight: '125%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                Update Payment Method
              </h1>
              <p
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
                Your next charge will use this card.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div
            className="flex flex-col items-start w-full"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '40px',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
              marginBottom: '24px'
            }}
          >
            <div
              className="flex flex-col items-start w-full"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '32px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0
              }}
            >
              {/* Current Payment Method Card */}
              {paymentMethod && (
                <div
                  className="bg-[#1F1F1F] rounded-[10px] w-full"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '20px 12px',
                    gap: '32px',
                    flex: 'none',
                    order: 0,
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
                      gap: '32px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0
                    }}
                  >
                    {/* Header */}
                    <div
                      className="flex flex-row items-center w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '24px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <div
                        className="flex-1"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '12px',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1
                        }}
                      >
                        <h2
                          className="text-white gilroy-semibold"
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0
                          }}
                        >
                          Payment Method
                        </h2>
                      </div>
                      <button
                        className="bg-white text-[#1F1F1F] rounded-full gilroy-semibold"
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '10px 12px',
                          gap: '8px',
                          width: '134px',
                          height: '34px',
                          background: '#FFFFFF',
                          border: '1px solid #FFFFFF',
                          borderRadius: '100px',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            color: '#1F1F1F',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0
                          }}
                        >
                          Update Payment
                        </span>
                      </button>
                    </div>

                    {/* Payment Method Details */}
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
                      <div
                        className="border border-white/30 rounded-lg w-full"
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '16px 12px',
                          gap: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '8px',
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
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          {/* Card Icon */}
                          <div
                            className="relative flex-shrink-0"
                            style={{
                              width: '38px',
                              height: '24px',
                              flex: 'none',
                              order: 0,
                              flexGrow: 0
                            }}
                          >
                            <div
                              style={{
                                position: 'absolute',
                                left: '0%',
                                right: '0%',
                                top: '0%',
                                bottom: '0%',
                                background: '#000000',
                                opacity: 0.07
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                left: '2.63%',
                                right: '2.63%',
                                top: '4.17%',
                                bottom: '4.17%',
                                background: '#0028FF'
                              }}
                            />
                            <div
                              style={{
                                position: 'absolute',
                                left: '13.16%',
                                right: '17.89%',
                                top: '33.33%',
                                bottom: '33.33%',
                                background: '#FFFFFF'
                              }}
                            />
                          </div>
                          {/* Card Details */}
                          <div
                            className="flex-1"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              padding: '0px',
                              gap: '8px',
                              flex: 'none',
                              order: 1,
                              flexGrow: 1
                            }}
                          >
                            <span
                              className="text-white/30 gilroy-medium whitespace-nowrap"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: 'rgba(255, 255, 255, 0.3)',
                                flex: 'none',
                                order: 0,
                                alignSelf: 'stretch',
                                flexGrow: 0
                              }}
                            >
                              •••• •••• •••• {paymentMethod.last4 || '4242'}
                            </span>
                            <span
                              className="text-white/30 gilroy-medium whitespace-nowrap"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '100%',
                                color: 'rgba(255, 255, 255, 0.3)',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0
                              }}
                            >
                              Expires {String(paymentMethod.expMonth || 12).padStart(2, '0')}/{String(paymentMethod.expYear || 2026).slice(-2)}
                            </span>
                          </div>
                          {/* Currently in Use Badge */}
                          <div
                            className="border border-[#05B0B3] rounded-full flex-shrink-0"
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '10px',
                              gap: '10px',
                              width: '106px',
                              height: '24px',
                              background: 'rgba(5, 176, 179, 0.12)',
                              border: '1px solid #05B0B3',
                              borderRadius: '40px',
                              flex: 'none',
                              order: 2,
                              flexGrow: 0
                            }}
                          >
                            <span
                              className="text-[#05B0B3] gilroy-medium text-center"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#05B0B3',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0
                              }}
                            >
                              Currently in Use
                            </span>
                          </div>
                        </div>
                        {/* Divider */}
                        <div
                          className="w-full border-t border-[#404040]"
                          style={{
                            width: '100%',
                            height: '0px',
                            border: '1px solid #404040',
                            flex: 'none',
                            order: 1,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        />
                        {/* Remove Button */}
                        <button
                          className="w-full border border-[#BB0404] rounded-full"
                          style={{
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '12px 10px',
                            gap: '10px',
                            width: '100%',
                            height: '38px',
                            background: 'rgba(187, 4, 4, 0.12)',
                            border: '1px solid #BB0404',
                            borderRadius: '40px',
                            flex: 'none',
                            order: 1,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          <span
                            className="text-[#BB0404] gilroy-medium text-center"
                            style={{
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              textAlign: 'center',
                              color: '#BB0404',
                              flex: 'none',
                              order: 0,
                              flexGrow: 0
                            }}
                          >
                            Remove
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add New Card Form */}
              <div
                className="bg-[#1F1F1F] rounded-2xl w-full"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '24px',
                  gap: '32px',
                  flex: 'none',
                  order: paymentMethod ? 1 : 0,
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
                    gap: '24px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  {/* Form Header */}
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
                    <div
                      className="flex flex-row items-center w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '24px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <h2
                        className="text-white gilroy-semibold"
                        style={{
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '20px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0
                        }}
                      >
                        Add New Card
                      </h2>
                    </div>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSubmit}
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
                    {/* Card Number */}
                    <div
                      className="flex flex-col items-start w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '4px',
                        flex: 'none',
                        order: 0,
                        flexGrow: 1
                      }}
                    >
                      <label
                        className="text-white gilroy-medium"
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0
                        }}
                      >
                        Card Number
                      </label>
                      
                        <CustomInput
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="1234 1234 1234 1234"
                          className="w-full bg-transparent outline-none text-white/30 gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: 'rgba(255, 255, 255, 0.3)',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1
                          }}
                          required
                        />
                    </div>

                    {/* Expiry Date and CVC */}
                    <div
                      className="flex flex-row items-start w-full"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '24px',
                        width: '100%',
                        minWidth: 0
                      }}
                    >
                      {/* Expiry Date */}
                      <div
                        className="flex flex-col items-start"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '4px',
                          flex: '1 1 0%',
                          minWidth: 0,
                          order: 0
                        }}
                      >
                        <label
                          className="text-white gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          Expiry Date
                        </label>
                        
                          <CustomInput
                            type="text"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-transparent outline-none text-white/30 gilroy-medium min-w-0"
                            style={{
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: 'rgba(255, 255, 255, 0.3)',
                              minWidth: 0,
                              width: '100%'
                            }}
                            required
                          />
                      </div>

                      {/* CVC */}
                      <div
                        className="flex flex-col items-start"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '4px',
                          flex: '1 1 0%',
                          minWidth: 0,
                          order: 1
                        }}
                      >
                        <label
                          className="text-white gilroy-medium"
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0
                          }}
                        >
                          CVC
                        </label>
                          <CustomInput
                            type="text"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            placeholder="123"
                            className="w-full bg-transparent outline-none text-white/30 gilroy-medium min-w-0"
                            style={{
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: 'rgba(255, 255, 255, 0.3)',
                              minWidth: 0,
                              width: '100%'
                            }}
                            required
                          />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-[#404040] rounded-full gilroy-semibold"
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
                        background: '#FFFFFF',
                        borderRadius: '100px',
                        flex: 'none',
                        order: 2,
                        alignSelf: 'stretch',
                        flexGrow: 0
                      }}
                    >
                      <span
                        className="text-[#404040] gilroy-semibold text-center"
                        style={{
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          textAlign: 'center',
                          color: '#404040',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0
                        }}
                      >
                        {isSubmitting ? 'Saving...' : 'Save New Card'}
                      </span>
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Footer Text */}
            <div
              className="flex flex-col items-start w-full pb-8"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '40px',
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
                  gap: '16px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                <p
                  className="text-white gilroy-medium w-full"
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '130%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0
                  }}
                >
                  Updating your payment method won't change your plan. Your next renewal will use the new card.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col items-center justify-center min-h-screen px-4 pt-20 relative z-10">
        <div className="w-full max-w-[846px] flex flex-col items-center">
          <div className="w-full flex flex-col items-start gap-6 mb-10">
            <button
              onClick={handleBack}
              className="flex flex-row items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-4 h-4 relative">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

          {/* Payment Method Card */}
          <div className="relative bg-[#1F1F1F] rounded-[10px] p-5 flex flex-col gap-6 overflow-hidden w-full">
            <div className="relative z-10 flex flex-col gap-6 w-full">
              <div className="flex flex-row items-center justify-between gap-4 w-full">
                <h2 className="text-white text-[20px] font-normal leading-none gilroy-semibold">
                  Current Payment Method
                </h2>
                {/* <button
                  onClick={() => hasActiveSubscription ? router.push('/account/payment-method') : router.push('/pricing')}
                  className="bg-white text-[#1F1F1F] px-3 py-2 rounded-full text-sm font-normal gilroy-semibold text-center hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {hasActiveSubscription ? 'Update Payment' : 'Add Payment Method'}
                </button> */}
              </div>

              {paymentMethod ? (
                <div className="w-full border border-white/30 rounded-lg px-4 py-3 flex flex-row items-center gap-3">
                  <div className="w-10 h-6 bg-black/10 rounded-sm relative flex-shrink-0">
                    <div className="absolute inset-0 bg-[#0028FF] rounded-sm" style={{ margin: '1px' }} />
                    <div className="absolute left-1 top-1 right-1 h-1 bg-white rounded-sm" style={{ marginTop: '4px' }} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-white/60 text-sm gilroy-medium whitespace-nowrap">
                      •••• •••• •••• {paymentMethod.last4 || '4242'}
                    </span>
                    <span className="text-white/60 text-xs gilroy-medium whitespace-nowrap">
                      Expires {String(paymentMethod.expMonth || 12).padStart(2, '0')}/{String(paymentMethod.expYear || 2026).slice(-2)}
                    </span>
                  </div>
                  <div className="px-2 py-1 border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] text-[#05B0B3] text-xs rounded-full flex-shrink-0 whitespace-nowrap">
                    Currently in Use
                  </div>
                  <div className="px-2 py-1 border border-[#BB0404] bg-[#BB04041F] text-[#BB0404] text-xs rounded-full flex-shrink-0 whitespace-nowrap">
                    Remove
                  </div>
                </div>
              ) : (
                <div className="w-full border border-white/30 rounded-lg px-4 py-6 text-center text-white/50 text-sm">
                  No payment method on file
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 w-full flex flex-col items-start gap-10">
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
                    <CustomInput
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="1234 1234 1234 1234"
                      className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                      required
                    />
                  </div>

                  <div className="w-full flex flex-row items-start gap-6">
                    <div className="flex-1 flex flex-col items-start gap-1">
                      <label className="text-white text-sm font-normal gilroy-medium">
                        Expiry Date
                      </label>
                      <CustomInput
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                        required
                      />
                    </div>

                    <div className="flex-1 flex flex-col items-start gap-1">
                      <label className="text-white text-sm font-normal gilroy-medium">
                        CVC
                      </label>
                      <CustomInput
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        placeholder="123"
                        className="w-full bg-transparent outline-none text-white placeholder-white/30 text-sm font-normal gilroy-medium"
                        required
                      />
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


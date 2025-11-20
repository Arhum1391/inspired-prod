'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type PlanId = 'monthly' | 'annual';

interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: string;
  priceAccent: string;
  billingNote?: string;
  isPopular?: boolean;
  features: string[];
}

interface FAQ {
  question: string;
  answer: string;
}

const plans: Plan[] = [
  {
    id: 'monthly',
    name: 'Premium Monthly',
    description: 'Flexible access',
    price: '$30 USD per month',
    priceAccent: '#D4D737',
    features: [
      'Full research library',
      'Position Sizing Calculator (save scenarios)',
      'Portfolio analytics & history',
      'Shariah project details & screens',
    ],
  },
  {
    id: 'annual',
    name: 'Premium Annual',
    description: 'Save 20%',
    price: '$120 USD per year',
    billingNote: '($10 USD /month)',
    priceAccent: '#05B0B3',
    isPopular: true,
    features: [
      'Full research library',
      'Position Sizing Calculator (save scenarios)',
      'Portfolio analytics & history',
      'Shariah project details & screens',
    ],
  },
];

const faqs: FAQ[] = [
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes - your access continues until your period ends.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'We offer a 7-day money-back guarantee for all new subscribers.',
  },
  {
    question: "What's included?",
    answer: 'Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.',
  },
  {
    question: 'Will you add more features?',
    answer: 'Yes! We continuously improve our platform and add new features based on user feedback.',
  },
];

export default function Pricing() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = (index: number) => {
    setOpenFAQ((current) => (current === index ? null : index));
  };

  const handleCheckout = (plan: PlanId) => {
    router.push(`/checkout?plan=${plan}`);
  };

  const headingStyle = useMemo(
    () => ({
      fontFamily: 'Gilroy, sans-serif',
      fontWeight: 600,
    }),
    []
  );

  const bodyStyle = useMemo(
    () => ({
      fontFamily: 'Gilroy, sans-serif',
      fontWeight: 400,
    }),
    []
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />

      {/* Desktop Gradients */}
      <div
        className="hidden md:block opacity-100"
        style={{
          position: 'absolute',
          width: '500px',
          height: '450px',
          left: '-415px',
          top: '400px',
          background:
            'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(15deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      ></div>
      <div
        className="hidden md:block opacity-100"
        style={{
          position: 'absolute',
          width: '588px',
          height: '588px',
          left: '1126px',
          top: '-283px',
          background:
            'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          pointerEvents: 'none',
          zIndex: 0,
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

      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20 sm:pb-28 lg:px-0 lg:pt-0 lg:pb-0">
        <div className="lg:hidden">
          <header className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl leading-tight text-white"
              style={headingStyle}
            >
              All the Tools & Research You Need - One Subscription
            </h1>
            <p
              className="text-base sm:text-lg leading-relaxed text-white/80"
              style={bodyStyle}
            >
              Full reports, position sizing calculator, portfolio analytics, and Shariah filters. Cancel anytime.
            </p>
          </header>

          <section className="mt-12 sm:mt-16 max-w-5xl mx-auto flex flex-col gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col gap-8 bg-[#1F1F1F] rounded-2xl p-8 sm:p-10 w-full overflow-visible"
              >
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    background:
                      'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px',
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>

                {plan.isPopular && (
                  <div
                    className="absolute -top-3 left-6 flex items-center justify-center px-3 py-1 text-xs rounded-full"
                    style={{
                      background: '#DE50EC',
                      border: '1px solid #DE50EC',
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    Best Value
                  </div>
                )}

                <div className="relative z-10 flex flex-col gap-6">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h3
                        className="text-2xl text-white"
                        style={headingStyle}
                      >
                        {plan.name}
                      </h3>
                      <p className="text-sm text-white/80" style={bodyStyle}>
                        {plan.description}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className="text-2xl"
                        style={{ ...headingStyle, color: plan.priceAccent }}
                      >
                        {plan.price}
                      </p>
                      {plan.billingNote && (
                        <p className="text-sm text-white/70" style={bodyStyle}>
                          {plan.billingNote}
                        </p>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-1 inline-block w-2 h-2 rounded-full bg-white"></span>
                        <span className="text-base text-white" style={bodyStyle}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleCheckout(plan.id)}
                  className="relative z-10 w-full h-12 rounded-full bg-white text-[#1F1F1F] text-sm font-semibold hover:opacity-90 transition-opacity"
                  style={headingStyle}
                >
                  Continue to Checkout
                </button>
              </div>
            ))}
          </section>

          <section className="mt-16 sm:mt-20 max-w-4xl mx-auto text-center space-y-4">
            <h2
              className="text-2xl sm:text-3xl text-white"
              style={headingStyle}
            >
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-white/80" style={bodyStyle}>
              Everything you need to know about your subscription.
            </p>
          </section>

          <section className="mt-8 sm:mt-10 max-w-4xl mx-auto space-y-4 sm:space-y-5">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              return (
                <div
                  key={faq.question}
                  className="relative cursor-pointer rounded-2xl bg-[#1F1F1F] p-5 sm:p-6"
                  onClick={() => toggleFAQ(index)}
                >
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                    }}
                  >
                    <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                  </div>

                  <div className="relative z-10 flex items-center gap-4">
                    <h3
                      className="flex-1 text-left text-lg text-white sm:text-xl"
                      style={headingStyle}
                    >
                      {faq.question}
                    </h3>
                    <div
                      className={`flex h-5 w-5 items-center justify-center transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    >
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {isOpen && (
                    <p className="relative z-10 mt-4 text-left text-sm text-white/80" style={bodyStyle}>
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </section>
        </div>

        <div className="hidden lg:block">
          <section
            className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10"
            style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '140px' }}
          >
            <div className="w-full max-w-[848px] mx-auto">
              <div className="flex flex-col items-center gap-6 mb-30">
                <h1
                  className="text-white text-center"
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '120%',
                    color: '#FFFFFF',
                    width: '848px',
                    height: '116px',
                  }}
                >
                  All the Tools & Research You Need - One Subscription
                </h1>

                <p
                  className="text-center"
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    width: '848px',
                    height: '16px',
                  }}
                >
                  Full reports, position sizing calculator, portfolio analytics, and Shariah filters. Cancel anytime.
                </p>
              </div>

              <div className="flex flex-row items-center gap-5 w-full">
                <div
                  className="flex flex-col justify-between items-start p-10 gap-10 relative"
                  style={{
                    width: '414px',
                    height: '418px',
                    background: '#1F1F1F',
                    borderRadius: '16px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background:
                        'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: '#1F1F1F',
                      }}
                    ></div>
                  </div>
                  <div className="flex flex-col items-start gap-6 w-full relative z-10">
                    <div className="flex flex-col items-start gap-3 w-full">
                      <div className="flex flex-row items-start gap-6 w-full">
                        <h3
                          className="text-white"
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 600,
                            fontSize: '24px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Premium Monthly
                        </h3>
                      </div>

                      <p
                        className="text-white"
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '130%',
                          color: '#FFFFFF',
                        }}
                      >
                        Flexible access
                      </p>
                    </div>

                    <div className="flex flex-row items-start gap-6 w-full">
                      <p
                        className="text-[#D4D737]"
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 600,
                          fontSize: '24px',
                          lineHeight: '100%',
                          color: '#D4D737',
                        }}
                      >
                        $30 USD per month
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-4 w-full">
                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Full research library
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Position Sizing Calculator (save scenarios)
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Portfolio analytics & history
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Shariah project details & screens
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center items-center w-full relative z-10">
                    <button
                      onClick={() => handleCheckout('monthly')}
                      className="flex flex-row justify-center items-center px-4 py-2.5 gap-2 w-full"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #FFFFFF',
                        borderRadius: '100px',
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '100%',
                        textAlign: 'center',
                        color: '#1F1F1F',
                        cursor: 'pointer',
                        height: '38px',
                      }}
                    >
                      Continue to Checkout
                    </button>
                  </div>
                </div>

                <div
                  className="flex flex-col justify-between items-start p-10 gap-10 relative"
                  style={{
                    width: '414px',
                    height: '418px',
                    background: '#1F1F1F',
                    borderRadius: '16px',
                    boxSizing: 'border-box',
                    isolation: 'isolate',
                  }}
                >
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      borderRadius: '16px',
                      background:
                        'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                    }}
                  >
                    <div
                      className="w-full h-full rounded-[15px]"
                      style={{
                        background: '#1F1F1F',
                      }}
                    ></div>
                  </div>
                  <div
                    className="absolute flex flex-row justify-center items-center px-2.5 py-2 gap-2.5"
                    style={{
                      width: '95px',
                      height: '26px',
                      left: '24px',
                      top: '-13px',
                      background: '#DE50EC',
                      border: '1px solid #DE50EC',
                      borderRadius: '80px',
                      zIndex: 2,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 500,
                        fontSize: '12px',
                        lineHeight: '100%',
                        textAlign: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      Best Value
                    </span>
                  </div>

                  <div className="flex flex-col items-start gap-6 w-full relative z-10">
                    <div className="flex flex-col items-start gap-3 w-full">
                      <div className="flex flex-row items-start gap-6 w-full">
                        <h3
                          className="text-white"
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 600,
                            fontSize: '24px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Premium Annual
                        </h3>
                      </div>

                      <p
                        className="text-white"
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '130%',
                          color: '#FFFFFF',
                        }}
                      >
                        Save 20%
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-2 w-full">
                      <p
                        className="text-[#05B0B3]"
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 600,
                          fontSize: '24px',
                          lineHeight: '100%',
                          color: '#05B0B3',
                        }}
                      >
                        $120 USD per year
                      </p>
                      <p
                        className="text-white"
                        style={{
                          fontFamily: 'Gilroy, sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                        }}
                      >
                        ($10 USD /month)
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-4 w-full">
                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Full research library
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Position Sizing Calculator (save scenarios)
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Portfolio analytics & history
                        </span>
                      </div>

                      <div className="flex flex-row items-center gap-2 w-full">
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                          }}
                        ></div>
                        <span
                          style={{
                            fontFamily: 'Gilroy, sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                          }}
                        >
                          Shariah project details & screens
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-center items-center w-full relative z-10">
                    <button
                      onClick={() => handleCheckout('annual')}
                      className="flex flex-row justify-center items-center px-4 py-2.5 gap-2 w-full"
                      style={{
                        background: '#FFFFFF',
                        border: '1px solid #FFFFFF',
                        borderRadius: '100px',
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '100%',
                        textAlign: 'center',
                        color: '#1F1F1F',
                        cursor: 'pointer',
                        height: '38px',
                      }}
                    >
                      Continue to Checkout
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16 w-full mt-60">
                <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[847px] px-4 sm:px-6">
                  <h2
                    className="text-white text-center"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 600,
                      fontSize: 'clamp(24px, 5vw, 36px)',
                      lineHeight: '130%',
                      color: '#FFFFFF',
                    }}
                  >
                    Frequently Asked Questions
                  </h2>

                  <p
                    className="text-center"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                    }}
                  >
                    Everything you need to know about your subscription.
                  </p>
                </div>

                <div className="flex flex-col items-start gap-4 sm:gap-5 w-full max-w-[1064px] px-4 sm:px-6">
                  {faqs.map((faq, index) => {
                    const isOpen = openFAQ === index;
                    return (
                      <div
                        key={faq.question}
                        className="flex flex-col items-start p-4 sm:p-6 gap-3 sm:gap-4 w-full relative cursor-pointer"
                        style={{
                          background: '#1F1F1F',
                          borderRadius: '16px',
                          boxSizing: 'border-box',
                        }}
                        onClick={() => toggleFAQ(index)}
                      >
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            borderRadius: '16px',
                            background:
                              'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                            padding: '1px',
                          }}
                        >
                          <div
                            className="w-full h-full rounded-[15px]"
                            style={{
                              background: '#1F1F1F',
                            }}
                          ></div>
                        </div>

                        <div className="flex flex-row items-center gap-4 sm:gap-6 w-full relative z-10">
                          <h3
                            className="text-white flex-1"
                            style={{
                              fontFamily: 'Gilroy, sans-serif',
                              fontWeight: 600,
                              fontSize: 'clamp(16px, 4vw, 20px)',
                              lineHeight: '100%',
                              color: '#FFFFFF',
                            }}
                          >
                            {faq.question}
                          </h3>

                          <div
                            className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                            style={{
                              transform: isOpen ? 'matrix(1, 0, 0, -1, 0, 0)' : 'matrix(1, 0, 0, 1, 0, 0)',
                              transition: 'transform 0.3s ease',
                            }}
                          >
                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>

                        {isOpen && (
                          <p
                            className="text-white relative z-10"
                            style={{
                              fontFamily: 'Gilroy, sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: '#FFFFFF',
                            }}
                          >
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

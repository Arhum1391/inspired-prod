'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Pricing() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const router = useRouter();

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const handleCheckout = (plan: 'monthly' | 'annual') => {
    router.push(`/checkout?plan=${plan}`);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />

      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '450px',
          left: '-415px',
          top: '400px',
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
          left: '1126px',
          top: '-283px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>

      <section className="flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10" style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '140px' }}>
        <div className="w-full max-w-[848px] mx-auto">
          <div className="flex flex-col items-center gap-6 mb-30">
            <h1 
              className="text-white text-center"
              style={{
                fontFamily: 'Gilroy, sans-serif',
                fontWeight: 600,
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '120%',
                color: '#FFFFFF',
                width: '848px',
                height: '116px'
              }}
            >
              All the Tools & Research You Need - One Subscription
            </h1>
            
            <p 
              className="text-center"
              style={{
                fontFamily: 'Gilroy, sans-serif',
                fontWeight: 500,
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '100%',
                color: '#FFFFFF',
                width: '848px',
                height: '16px'
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
                boxSizing: 'border-box'
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                  padding: '1px'
                }}
              >
                <div
                  className="w-full h-full rounded-[15px]"
                  style={{
                    background: '#1F1F1F'
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
                        fontWeight: 400,
                        fontSize: '24px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '130%',
                      color: '#FFFFFF'
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
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '100%',
                      color: '#D4D737'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#1F1F1F',
                    cursor: 'pointer',
                    height: '38px'
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
                isolation: 'isolate'
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                  padding: '1px'
                }}
              >
                <div
                  className="w-full h-full rounded-[15px]"
                  style={{
                    background: '#1F1F1F'
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
                  zIndex: 2
                }}
              >
                <span 
                  style={{
                    fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                    fontWeight: 400,
                    fontSize: '12px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#FFFFFF'
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
                        fontWeight: 400,
                        fontSize: '24px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '130%',
                      color: '#FFFFFF'
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
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '100%',
                      color: '#05B0B3'
                    }}
                  >
                    $120 USD per year
                  </p>
                  <p 
                    className="text-white"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                        borderRadius: '50%'
                      }}
                    ></div>
                    <span 
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF'
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
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#1F1F1F',
                    cursor: 'pointer',
                    height: '38px'
                  }}
                >
                  Continue to Checkout
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16 w-full mt-12 sm:mt-16">
            <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-[847px] px-4 sm:px-6">
              <h2 
                className="text-white text-center"
                style={{
                  fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 600,
                  fontWeight: 400,
                  fontSize: 'clamp(24px, 5vw, 36px)',
                  lineHeight: '130%',
                  color: '#FFFFFF'
                }}
              >
                Frequently Asked Questions
              </h2>
              
              <p 
                className="text-center"
                style={{
                  fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '100%',
                  color: '#FFFFFF'
                }}
              >
                Everything you need to know about your subscription.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 sm:gap-5 w-full max-w-[1064px] px-4 sm:px-6">
              <div 
                className="flex flex-col items-start p-4 sm:p-6 gap-3 sm:gap-4 w-full relative cursor-pointer"
                style={{
                  background: '#1F1F1F',
                  borderRadius: '16px',
                  boxSizing: 'border-box'
                }}
                onClick={() => toggleFAQ(0)}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div
                    className="w-full h-full rounded-[15px]"
                    style={{
                      background: '#1F1F1F'
                    }}
                  ></div>
                </div>

                <div className="flex flex-row items-center gap-4 sm:gap-6 w-full relative z-10">
                  <h3 
                    className="text-white flex-1"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 600,
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 4vw, 20px)',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Can I cancel anytime?
                  </h3>
                  
                  <div 
                    className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{
                      transform: openFAQ === 0 ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(1, 0, 0, -1, 0, 0)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {openFAQ === 0 && (
                  <p 
                    className="text-white relative z-10"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Yes - your access continues until your period ends.
                  </p>
                )}
              </div>

              <div 
                className="flex flex-col items-start p-4 sm:p-6 gap-3 sm:gap-4 w-full relative cursor-pointer"
                style={{
                  background: '#1F1F1F',
                  borderRadius: '16px',
                  boxSizing: 'border-box'
                }}
                onClick={() => toggleFAQ(1)}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div
                    className="w-full h-full rounded-[15px]"
                    style={{
                      background: '#1F1F1F'
                    }}
                  ></div>
                </div>

                <div className="flex flex-row items-center gap-4 sm:gap-6 w-full relative z-10">
                  <h3 
                    className="text-white flex-1"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 600,
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 4vw, 20px)',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Do you offer refunds?
                  </h3>
                  
                  <div 
                    className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{
                      transform: openFAQ === 1 ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(1, 0, 0, -1, 0, 0)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {openFAQ === 1 && (
                  <p 
                    className="text-white relative z-10"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    We offer a 7-day money-back guarantee for all new subscribers.
                  </p>
                )}
              </div>

              <div 
                className="flex flex-col items-start p-4 sm:p-6 gap-3 sm:gap-4 w-full relative cursor-pointer"
                style={{
                  background: '#1F1F1F',
                  borderRadius: '16px',
                  boxSizing: 'border-box'
                }}
                onClick={() => toggleFAQ(2)}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div
                    className="w-full h-full rounded-[15px]"
                    style={{
                      background: '#1F1F1F'
                    }}
                  ></div>
                </div>

                <div className="flex flex-row items-center gap-4 sm:gap-6 w-full relative z-10">
                  <h3 
                    className="text-white flex-1"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 600,
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 4vw, 20px)',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    What's included?
                  </h3>
                  
                  <div 
                    className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{
                      transform: openFAQ === 2 ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(1, 0, 0, -1, 0, 0)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {openFAQ === 2 && (
                  <p 
                    className="text-white relative z-10"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.
                  </p>
                )}
              </div>

              <div 
                className="flex flex-col items-start p-4 sm:p-6 gap-3 sm:gap-4 w-full relative cursor-pointer"
                style={{
                  background: '#1F1F1F',
                  borderRadius: '16px',
                  boxSizing: 'border-box'
                }}
                onClick={() => toggleFAQ(3)}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                    padding: '1px'
                  }}
                >
                  <div
                    className="w-full h-full rounded-[15px]"
                    style={{
                      background: '#1F1F1F'
                    }}
                  ></div>
                </div>

                <div className="flex flex-row items-center gap-4 sm:gap-6 w-full relative z-10">
                  <h3 
                    className="text-white flex-1"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 600,
                      fontWeight: 400,
                      fontSize: 'clamp(16px, 4vw, 20px)',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Will you add more features?
                  </h3>
                  
                  <div 
                    className="w-5 h-5 flex items-center justify-center flex-shrink-0"
                    style={{
                      transform: openFAQ === 3 ? 'matrix(1, 0, 0, 1, 0, 0)' : 'matrix(1, 0, 0, -1, 0, 0)',
                      transition: 'transform 0.3s ease'
                    }}
                  >
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                
                {openFAQ === 3 && (
                  <p 
                    className="text-white relative z-10"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 500,
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF'
                    }}
                  >
                    Yes! We continuously improve our platform and add new features based on user feedback.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}


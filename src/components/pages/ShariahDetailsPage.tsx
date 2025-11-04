'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ShariahDetailsPageProps {
  fundId: string;
}

export default function ShariahDetailsPage({ fundId }: ShariahDetailsPageProps) {
  const router = useRouter();
  
  const handleBack = () => {
    router.push('/shariah');
  };
  
  // Fund data based on fundId
  const fundData = {
    '1': {
      title: 'Ethical Tech Fund',
      description: 'A collection of technology companies that meet strict ethical and Shariah compliance standards.',
      footerLeft: 'Updated on May 15, 2023',
      footerRight: 'Shariah Compliant',
      analystNotes: 'Ethical Tech Fund demonstrates strong adherence to Shariah principles, maintaining a clear focus on technology-driven solutions that align with ethical investment standards. The fund avoids exposure to interest-based financing, speculative instruments, and non-permissible income streams.'
    },
    '2': {
      title: 'Sustainable Investment Fund',
      description: 'Investment portfolio focused on companies with environmental & social governance practices.',
      footerLeft: 'Ethically sound',
      footerRight: 'June 10, 2023',
      analystNotes: 'Sustainable Investment Fund demonstrates strong adherence to Shariah principles, maintaining a clear focus on companies with environmental and social governance practices that align with ethical investment standards. The fund avoids exposure to interest-based financing, speculative instruments, and non-permissible income streams.'
    },
    '3': {
      title: 'Wellness and Prevention Fund',
      description: 'A fund dedicated to healthcare companies that prioritize preventative care & wellness programs.',
      footerLeft: 'Health-Focused Investing',
      footerRight: 'July 5, 2023',
      analystNotes: 'Wellness and Prevention Fund demonstrates strong adherence to Shariah principles, maintaining a clear focus on healthcare companies that prioritize preventative care and wellness programs, aligning with ethical investment standards. The fund avoids exposure to interest-based financing, speculative instruments, and non-permissible income streams.'
    }
  };
  
  const fund = fundData[fundId as keyof typeof fundData] || fundData['1'];
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <Navbar />
      
      {/* Background Gradient SVG - Top Right */}
      <svg
        width="507"
        height="713"
        viewBox="0 0 507 713"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <g filter="url(#filter0_f_1639_1215)">
          <circle cx="594.064" cy="118.608" r="294" transform="rotate(-153.197 594.064 118.608)" fill="url(#paint0_linear_1639_1215)"/>
        </g>
        <defs>
          <filter id="filter0_f_1639_1215" x="0" y="-475.457" width="1188.13" height="1188.13" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_1639_1215"/>
          </filter>
          <linearGradient id="paint0_linear_1639_1215" x1="362.934" y1="-145.173" x2="920.636" y2="32.5919" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3813F3"/>
            <stop offset="0.32" stopColor="#05B0B3"/>
            <stop offset="0.64" stopColor="#4B25FD"/>
            <stop offset="0.8" stopColor="#B9B9E9"/>
            <stop offset="1" stopColor="#DE50EC"/>
          </linearGradient>
        </defs>
      </svg>
      
      <div className="relative z-10 flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8" style={{ minHeight: '1400px', paddingBottom: '150px' }}>
        {/* Content Container */}
        <div
          style={{
            position: 'absolute',
            width: '630px',
            left: '188px',
            top: '262px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '24px',
          }}
        >
          {/* Back Button Row */}
          <button
            onClick={handleBack}
            className="flex items-center text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-0 focus:border-none active:outline-none relative z-20"
            style={{
              outline: 'none',
              boxShadow: 'none',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'Gilroy-Medium',
              fontSize: '16px',
              lineHeight: '100%',
              color: '#FFFFFF',
            }}
            onFocus={(e) => e.target.blur()}
          >
            <ChevronLeft size={20} className="mr-1" />
            Back
          </button>
          
          {/* Heading */}
          <h1
            style={{
              width: '630px',
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: '120%',
              color: '#FFFFFF',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0,
            }}
          >
            {fund.title}
          </h1>
          
          {/* Description */}
          <p
            style={{
              width: '630px',
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '130%',
              color: '#FFFFFF',
              flex: 'none',
              order: 2,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0,
            }}
          >
            {fund.description}
          </p>
          
          {/* Footer Row */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '16px',
              width: '630px',
              height: '14px',
              flex: 'none',
              order: 3,
              alignSelf: 'stretch',
              flexGrow: 0,
            }}
          >
            {/* Footer Left */}
            <span
              style={{
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '100%',
                color: '#FFFFFF',
                flex: 'none',
                order: 0,
                flexGrow: 0,
              }}
            >
              {fund.footerLeft}
            </span>
            
            {/* Dot Separator */}
            <div
              style={{
                width: '6px',
                height: '6px',
                background: '#D9D9D9',
                borderRadius: '50%',
                flex: 'none',
                order: 1,
                flexGrow: 0,
              }}
            />
            
            {/* Footer Right */}
            <span
              style={{
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '100%',
                color: '#FFFFFF',
                flex: 'none',
                order: 2,
                flexGrow: 0,
              }}
            >
              {fund.footerRight}
            </span>
          </div>
        </div>
        
        {/* Compliance Breakdown Tile */}
        <div
          style={{
            position: 'absolute',
            width: '1064px',
            height: '384px',
            top: '604px',
            left: '188px',
            gap: '24px',
            borderRadius: '16px',
            background: '#1F1F1F',
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* Curved Gradient Border */}
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: '16px',
              padding: '1px',
              background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
            }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: '15px', background: '#1F1F1F' }}></div>
          </div>
          
          {/* Heading */}
          <h2
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontSize: '24px',
              fontWeight: 400,
              color: '#FFFFFF',
              margin: 0,
              marginBottom: '15px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            Compliance breakdown
          </h2>
          
          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '12px',
              width: '1024px',
              height: '266px',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Header Row */}
            <div
              style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '16px',
                gap: '24px',
                width: '1024px',
                height: '46px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              {/* Criteria Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '230px',
                  height: '14px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 1,
                }}
              >
                <span
                  style={{
                    width: '230px',
                    height: '14px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  Criteria
                </span>
              </div>
              
              {/* Threshold Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '8px',
                  width: '230px',
                  height: '14px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 1,
                }}
              >
                <span
                  style={{
                    width: '230px',
                    height: '14px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'right',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  Threshold
                </span>
              </div>
              
              {/* Actual Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '8px',
                  width: '230px',
                  height: '14px',
                  flex: 'none',
                  order: 2,
                  flexGrow: 1,
                }}
              >
                <span
                  style={{
                    width: '230px',
                    height: '14px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'right',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  Actual
                </span>
              </div>
              
              {/* Status Column */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '8px',
                  width: '230px',
                  height: '14px',
                  flex: 'none',
                  order: 3,
                  flexGrow: 1,
                }}
              >
                <span
                  style={{
                    width: '230px',
                    height: '14px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'right',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  Status
                </span>
              </div>
            </div>
            
            {/* Data Rows Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '8px',
                width: '1024px',
                height: '208px',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              {/* Row 1: Debt to Market Cap */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '24px',
                  width: '1024px',
                  height: '46px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Criteria */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Debt to Market Cap
                  </span>
                </div>
                
                {/* Threshold */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    &lt; 33%
                  </span>
                </div>
                
                {/* Actual */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 2,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    0%
                  </span>
                </div>
                
                {/* Status */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 3,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#05B353',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Pass
                  </span>
                </div>
              </div>
              
              {/* Row 2: Interest Income */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '24px',
                  width: '1024px',
                  height: '46px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Criteria */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Interest Income
                  </span>
                </div>
                
                {/* Threshold */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    &lt; 5%
                  </span>
                </div>
                
                {/* Actual */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 2,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    0%
                  </span>
                </div>
                
                {/* Status */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 3,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#05B353',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Pass
                  </span>
                </div>
              </div>
              
              {/* Row 3: Business Activity */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '24px',
                  width: '1024px',
                  height: '46px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Criteria */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Business Activity
                  </span>
                </div>
                
                {/* Threshold */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Halal
                  </span>
                </div>
                
                {/* Actual */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 2,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Permissible
                  </span>
                </div>
                
                {/* Status */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 3,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#05B353',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Pass
                  </span>
                </div>
              </div>
              
              {/* Row 4: Cash Holdings */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px',
                  gap: '24px',
                  width: '1024px',
                  height: '46px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Criteria */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Cash Holdings
                  </span>
                </div>
                
                {/* Threshold */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 1,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    &lt; 33%
                  </span>
                </div>
                
                {/* Actual */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 2,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    N/A
                  </span>
                </div>
                
                {/* Status */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '230px',
                    height: '14px',
                    flex: 'none',
                    order: 3,
                    flexGrow: 1,
                  }}
                >
                  <span
                    style={{
                      width: '230px',
                      height: '14px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'right',
                      color: '#05B353',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Pass
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Analyst Notes Section */}
        <div
          style={{
            position: 'absolute',
            width: '1064px',
            height: '145px',
            left: '188px',
            top: '1128px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '24px',
          }}
        >
          {/* Heading */}
          <h2
            style={{
              width: '1064px',
              height: '58px',
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '48px',
              lineHeight: '120%',
              color: '#FFFFFF',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0,
            }}
          >
            Analyst Notes
          </h2>
          
          {/* Description */}
          <p
            style={{
              width: '1064px',
              height: '63px',
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '130%',
              color: '#FFFFFF',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0,
            }}
          >
            {fund.analystNotes}
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}


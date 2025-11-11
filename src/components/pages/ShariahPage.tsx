'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';

export default function ShariahPage() {
  const { isAuthenticated: isSignedIn, user, isLoading } = useAuth();
  const router = useRouter();
  const isPaidUser = !!user?.isPaid;
  const isAuthenticated = isSignedIn && isPaidUser;

  useEffect(() => {
    if (!isLoading && !isSignedIn) {
      router.replace('/signin?next=/shariah');
    }
  }, [isLoading, isSignedIn, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});
  const [showMethodologyPopup, setShowMethodologyPopup] = useState(false);
  const popupContentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMethodologyPopup && popupContentRef.current && backdropRef.current) {
      const updateHeight = () => {
        if (popupContentRef.current && backdropRef.current) {
          const contentHeight = popupContentRef.current.offsetHeight;
          const neededHeight = contentHeight + 200; // 200px for padding (100px top + 100px bottom)
          backdropRef.current.style.height = `${neededHeight}px`;
          backdropRef.current.style.overflow = 'visible';
        }
      };
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        setTimeout(updateHeight, 50);
      });
      window.addEventListener('resize', updateHeight);
      // Use MutationObserver to detect content changes
      const observer = new MutationObserver(updateHeight);
      if (popupContentRef.current) {
        observer.observe(popupContentRef.current, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class'],
        });
      }
      return () => {
        window.removeEventListener('resize', updateHeight);
        observer.disconnect();
      };
    }
  }, [showMethodologyPopup]);

  const toggleTile = (index: number) => {
    setExpandedTiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        button:focus,
        button:active,
        button:focus-visible {
          outline: none !important;
        }
        button:focus {
          border: inherit !important;
        }
        button:active {
          border: inherit !important;
        }
        .popup-content-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .popup-content-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .popup-content-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .popup-content-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}} />
      <Navbar />
      
      {/* Background SVG Gradient */}
      <svg 
        className="absolute pointer-events-none"
        style={{
          left: '-500px',
          top: '-80px',
          width: '1686.4px',
          height: '934.41px',
          rotate: '-12deg',
          zIndex: 0,
        }}
        viewBox="0 0 635 728" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g filter="url(#filter0_f_shariah)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_shariah)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_shariah" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_shariah"/>
          </filter>
          <linearGradient id="paint0_linear_shariah" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3813F3"/>
            <stop offset="0.307692" stopColor="#DE50EC"/>
            <stop offset="0.543269" stopColor="#B9B9E9"/>
            <stop offset="0.740385" stopColor="#4B25FD"/>
            <stop offset="0.9999" stopColor="#05B0B3"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8 flex items-start">
          <div className="max-w-7xl mx-auto w-full relative">
            {/* Vector Logo */}
            <svg
              width="538"
              height="633"
              viewBox="0 0 538 633"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: '847px',
                top: '-50px',
                transform: 'rotate(5deg)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <g opacity="0.5">
                <path d="M485.003 448.627C449.573 580.853 314.193 659.464 182.624 624.21C51.0543 588.956 -26.8824 453.187 8.54736 320.961C43.9772 188.735 179.378 110.129 310.947 145.383L478.648 190.318C517.106 200.623 558.36 174.855 558.36 174.855L485.003 448.627ZM266.707 306.134C223.047 294.435 178.123 320.521 166.366 364.399C154.609 408.277 180.471 453.33 224.131 465.029C267.791 476.727 312.715 450.641 324.472 406.763L345.76 327.316L266.707 306.134Z" fill="url(#paint0_linear_vector_logo)"/>
                <path d="M417.104 61.0593C428.861 17.1816 473.785 -8.90461 517.445 2.79402C561.105 14.4926 586.967 59.5461 575.21 103.424C563.453 147.301 518.529 173.388 474.869 161.689L395.816 140.507L417.104 61.0593Z" fill="url(#paint1_linear_vector_logo)"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_vector_logo" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
                <linearGradient id="paint1_linear_vector_logo" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
              </defs>
            </svg>
            
            {/* Title - Left Middle */}
            <h1
              style={{
                width: '630px',
                height: '174px',
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
                marginTop: '120px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {isAuthenticated 
                ? 'Shariah-Compliant Projects - Invest with Principles, Backed by Transparency'
                : 'Unlock the full experience with Inspired Analyst Premium'
              }
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
                marginTop: '24px',
              }}
            >
              {isAuthenticated
                ? 'Explore screened projects, compliance rationales, and methodology details. Designed to help you invest confidently with your values.'
                : 'Full research library, Position Sizing Calculator (save scenarios), portfolio analytics, and Shariah project details. Cancel anytime.'
              }
            </p>
            {/* Bullet Points */}
            {!isAuthenticated && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                width: '630px',
                height: '112px',
                flex: 'none',
                order: 2,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '24px',
              }}
            >
              {/* Bullet 1 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '323px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Deep-dive reports with downloadable PDFs
                </span>
              </div>
              
              {/* Bullet 2 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '246px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Position sizing tailored to your risk
                </span>
              </div>
              
              {/* Bullet 3 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '247px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Portfolio allocation & P/L tracking
                </span>
              </div>
              
              {/* Bullet 4 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '299px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Shariah methodology & detailed screens
                </span>
              </div>
            </div>
            )}
            {/* Buttons Container */}
            {!isAuthenticated && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '414px',
                height: '50px',
                flex: 'none',
                order: 3,
                flexGrow: 0,
                marginTop: '32px',
              }}
            >
              {/* Button 1 */}
              <button
                style={{
                  padding: '12px 32px',
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  flex: 'none',
                  minWidth: '180px',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseDown={(e) => e.preventDefault()}
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                Start Subscription
              </button>
              {/* Button 2 */}
              <button
                style={{
                  padding: '12px 32px',
                  background: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: '1px solid #FFFFFF',
                  cursor: 'pointer',
                  flex: 'none',
                  minWidth: '180px',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
              >
                Watch Free Videos
              </button>
            </div>
            )}
            
            {/* Shariah-Compliant Projects Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '1290px',
                height: '87px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '200px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Heading */}
              <h2
                style={{
                  width: '1282px',
                  height: '47px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '130%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Shariah-Compliant Projects
              </h2>
              
              {/* Description */}
              <p
                style={{
                  width: '1282px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Detailed screening is available with Premium. Subscribe to unlock full compliance analysis.
              </p>
            </div>
            
            {/* Methodology Tile */}
            <div
              className="relative overflow-hidden group transition-all duration-300 flex flex-col items-start p-4 gap-4 h-auto bg-[#1F1F1F] rounded-2xl"
              style={{
                marginTop: '48px',
                width: '1290px',
                maxWidth: '1290px',
                marginLeft: 'auto',
                marginRight: 'auto',
                
              }}
            >
              {/* Curved Gradient Border */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                style={{
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                }}
              >
                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
              </div>

              {/* Gradient Ellipse */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '588px',
                  height: '588px',
                  right: '-308px',
                  top: '-495px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(100px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 0,
                  borderRadius: '50%'
                }}
              ></div>
              
              {/* Content with relative positioning to appear above gradient */}
              <div className="relative z-10 w-full h-full flex flex-col">
                <h3 className="text-white text-lg font-semibold mb-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Methodology</h3>
                <p className="text-white-400 text-sm leading-relaxed mb-4" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  Our Shariah screening process follows a comprehensive approach that evaluates businesses based on their core activities, financial ratios, and ethical standards. We exclude companies with significant involvement in prohibited activities and those with excessive debt or interest income.
                </p>
                <button
                  className="flex items-center justify-center gap-2 bg-[#1F1F1F] text-white border border-white px-4 py-2 rounded-full font-semibold hover:bg-[#2A2A2A] transition-colors focus:outline-none focus:ring-0 w-fit"
                  style={{ 
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onClick={() => setShowMethodologyPopup(true)}
                >
                  View Full Criteria
                  <Image 
                    src="/logo/backhome.png" 
                    alt="View Full Criteria" 
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            
            {/* Three Tiles Container */}
            <div
              style={{
                position: 'relative',
                marginTop: '72px',
                width: '1290px',
                maxWidth: '1290px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              <div
                className="flex flex-row gap-6"
              >
              {/* Tile 1 */}
              <div
                className="relative overflow-hidden"
                style={{
                  boxSizing: 'border-box',
                  width: '414px',
                  height: '392px',
                  borderRadius: '16px',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                }}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                {/* Gradient Ellipse */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    width: '588px',
                    height: '588px',
                    left: '399px',
                    top: '-326px',
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    filter: 'blur(100px)',
                    transform: 'rotate(90deg)',
                    flex: 'none',
                    flexGrow: 0,
                    zIndex: 0,
                    borderRadius: '50%'
                  }}
                ></div>
                
                {/* Content */}
                <div
                  className="relative z-10"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px',
                    gap: '8px',
                    isolation: 'isolate',
                    width: '100%',
                    height: '100%',
                    filter: isAuthenticated ? 'none' : 'blur(8px)',
                    pointerEvents: isAuthenticated ? 'auto' : 'none',
                  }}
                >
                  {/* Container */}
                  <div
                    style={{
                      background: 'rgba(5, 176, 179, 0.12)',
                      border: '2px solid rgba(5, 176, 179, 0.72)',
                      borderRadius: '25px',
                      padding: '3px 12px',
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                  >
                    <span style={{ fontFamily: 'Gilroy-SemiBold, sans-serif', color: 'rgba(5, 176, 179, 1)', fontSize: '12px' }}>Technology</span>
                  </div>
                  
                  {/* Heading */}
                  <h3
                    style={{
                      width: '366px',
                      height: '24px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      margin: 0,
                      marginTop: '4px',
                    }}
                  >
                    Ethical Tech Fund
                  </h3>
                  
                  {/* Description */}
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Gilroy-Medium, sans-serif',
                      fontSize: '16px',
                      lineHeight: '130%',
                      margin: 0,
                      marginTop: '5px',
                    }}
                  >
                    A collection of technology companies that meet strict ethical and Shariah compliance standards.
                  </p>
                  
                  {/* Compliance Rationale Section */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '366px',
                      height: '108px',
                      flex: 'none',
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      marginTop: '8px',
                    }}
                  >
                    {/* Subheading */}
                    <h4
                      style={{
                        width: '366px',
                        height: '18px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        margin: 0,
                      }}
                    >
                      Compliance Rationale:
                    </h4>
                    
                    {/* Bullet List */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '8px',
                        width: '366px',
                        height: '80px',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        marginTop: '5px',
                      }}
                    >
                      {/* Bullet 1 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '249px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Core business activities are permissible
                        </span>
                      </div>
                      
                      {/* Bullet 2 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '199px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Debt ratio below 33% threshold
                        </span>
                      </div>
                      
                      {/* Bullet 3 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '282px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Interest income less than 5% of total revenue
                        </span>
                      </div>
                      
                      {/* Bullet 4 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '276px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Passes ethical business practices screening
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Text */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '366px',
                      marginTop: '15px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Shariah Compliant
                    </span>
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      May 15, 2023
                    </span>
                  </div>
                  
                  {/* Button */}
                  <button
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '6px 16px',
                      gap: '8px',
                      width: '366px',
                      height: '36px',
                      border: '1px solid #FFFFFF',
                      borderRadius: '100px',
                      background: 'transparent',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      marginTop: '15px',
                      fontFamily: 'Gilroy-SemiBold, sans-serif',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push('/shariah/1');
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                  >
                    View Details
                    <Image 
                      src="/logo/backhome.png" 
                      alt="View Details" 
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                
                {/* Preview Overlay */}
                {!isAuthenticated && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    zIndex: 20,
                    pointerEvents: 'none',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '32px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Preview Only
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Detailed Screening Available with Premium
                  </p>
                </div>
                )}
              </div>
              
              {/* Tile 2 */}
              <div
                className="relative overflow-hidden"
                style={{
                  boxSizing: 'border-box',
                  width: '414px',
                  height: '392px',
                  borderRadius: '16px',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0,
                }}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                {/* Gradient Ellipse */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    width: '588px',
                    height: '588px',
                    left: '399px',
                    top: '-326px',
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    filter: 'blur(100px)',
                    transform: 'rotate(90deg)',
                    flex: 'none',
                    flexGrow: 0,
                    zIndex: 0,
                    borderRadius: '50%'
                  }}
                ></div>
                
                {/* Content */}
                <div
                  className="relative z-10"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px',
                    gap: '8px',
                    isolation: 'isolate',
                    width: '100%',
                    height: '100%',
                    filter: isAuthenticated ? 'none' : 'blur(8px)',
                    pointerEvents: isAuthenticated ? 'auto' : 'none',
                  }}
                >
                  {/* Container */}
                  <div
                    style={{
                      background: 'rgba(5, 176, 179, 0.12)',
                      border: '2px solid rgba(5, 176, 179, 0.72)',
                      borderRadius: '25px',
                      padding: '3px 12px',
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                  >
                    <span style={{ fontFamily: 'Gilroy-SemiBold, sans-serif', color: 'rgba(5, 176, 179, 1)', fontSize: '12px' }}>Finance</span>
                  </div>
                  
                  {/* Heading */}
                  <h3
                    style={{
                      width: '366px',
                      height: '24px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      margin: 0,
                      marginTop: '4px',
                    }}
                  >
                    Sustainable Investment Fund
                  </h3>
                  
                  {/* Description */}
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Gilroy-Medium, sans-serif',
                      fontSize: '16px',
                      lineHeight: '130%',
                      margin: 0,
                      marginTop: '5px',
                    }}
                  >
                    Investment portfolio focused on companies with environmental & social governance practices.
                  </p>
                  
                  {/* Compliance Rationale Section */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '366px',
                      height: '108px',
                      flex: 'none',
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      marginTop: '8px',
                    }}
                  >
                    {/* Subheading */}
                    <h4
                      style={{
                        width: '366px',
                        height: '18px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        margin: 0,
                      }}
                    >
                      Compliance Rationale:
                    </h4>
                    
                    {/* Bullet List */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '8px',
                        width: '366px',
                        height: '80px',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        marginTop: '5px',
                      }}
                    >
                      {/* Bullet 1 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '222px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Investments promote sustainability
                        </span>
                      </div>
                      
                      {/* Bullet 2 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '192px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Positive impact on community
                        </span>
                      </div>
                      
                      {/* Bullet 3 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '308px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Increased collaboration among local businesses
                        </span>
                      </div>
                      
                      {/* Bullet 4 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '297px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Enhanced public spaces for community events
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Text */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '366px',
                      marginTop: '15px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Ethically sound
                    </span>
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      June 10, 2023
                    </span>
                  </div>
                  
                  {/* Button */}
                  <button
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '6px 16px',
                      gap: '8px',
                      width: '366px',
                      height: '36px',
                      border: '1px solid #FFFFFF',
                      borderRadius: '100px',
                      background: 'transparent',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      marginTop: '15px',
                      fontFamily: 'Gilroy-SemiBold, sans-serif',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push('/shariah/2');
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                  >
                    View Details
                    <Image 
                      src="/logo/backhome.png" 
                      alt="View Details" 
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                
                {/* Preview Overlay */}
                {!isAuthenticated && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    zIndex: 20,
                    pointerEvents: 'none',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '32px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Preview Only
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Detailed Screening Available with Premium
                  </p>
                </div>
                )}
              </div>
              
              {/* Tile 3 */}
              <div
                className="relative overflow-hidden"
                style={{
                  boxSizing: 'border-box',
                  width: '414px',
                  height: '392px',
                  borderRadius: '16px',
                  flex: 'none',
                  order: 2,
                  flexGrow: 0,
                }}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                {/* Gradient Ellipse */}
                <div 
                  className="absolute pointer-events-none"
                  style={{
                    width: '588px',
                    height: '588px',
                    left: '399px',
                    top: '-326px',
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    filter: 'blur(100px)',
                    transform: 'rotate(90deg)',
                    flex: 'none',
                    flexGrow: 0,
                    zIndex: 0,
                    borderRadius: '50%'
                  }}
                ></div>
                
                {/* Content */}
                <div
                  className="relative z-10"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px',
                    gap: '8px',
                    isolation: 'isolate',
                    width: '100%',
                    height: '100%',
                    filter: isAuthenticated ? 'none' : 'blur(8px)',
                    pointerEvents: isAuthenticated ? 'auto' : 'none',
                  }}
                >
                  {/* Container */}
                  <div
                    style={{
                      background: 'rgba(5, 176, 179, 0.12)',
                      border: '2px solid rgba(5, 176, 179, 0.72)',
                      borderRadius: '25px',
                      padding: '3px 12px',
                      textAlign: 'center',
                      display: 'inline-block',
                    }}
                  >
                    <span style={{ fontFamily: 'Gilroy-SemiBold, sans-serif', color: 'rgba(5, 176, 179, 1)', fontSize: '12px' }}>Healthcare</span>
                  </div>
                  
                  {/* Heading */}
                  <h3
                    style={{
                      width: '366px',
                      height: '24px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '24px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      margin: 0,
                      marginTop: '4px',
                    }}
                  >
                    Wellness and Prevention Fund
                  </h3>
                  
                  {/* Description */}
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Gilroy-Medium, sans-serif',
                      fontSize: '16px',
                      lineHeight: '130%',
                      margin: 0,
                      marginTop: '5px',
                    }}
                  >
                    A fund dedicated to healthcare companies that prioritize preventative care & wellness programs.
                  </p>
                  
                  {/* Compliance Rationale Section */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '366px',
                      height: '108px',
                      flex: 'none',
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      marginTop: '8px',
                    }}
                  >
                    {/* Subheading */}
                    <h4
                      style={{
                        width: '366px',
                        height: '18px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '18px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        margin: 0,
                      }}
                    >
                      Compliance Rationale:
                    </h4>
                    
                    {/* Bullet List */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '8px',
                        width: '366px',
                        height: '80px',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        marginTop: '5px',
                      }}
                    >
                      {/* Bullet 1 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '224px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Supports healthy lifestyle initiatives
                        </span>
                      </div>
                      
                      {/* Bullet 2 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '243px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Focuses on prevention over treatment
                        </span>
                      </div>
                      
                      {/* Bullet 3 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '359px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Emphasizes community engagement in health initiatives
                        </span>
                      </div>
                      
                      {/* Bullet 4 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '366px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            background: '#FFFFFF',
                            borderRadius: '50%',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        />
                        <span
                          style={{
                            width: '303px',
                            height: '14px',
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          Promotes holistic wellness and lifestyle changes
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Text */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '366px',
                      marginTop: '15px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      Health-Focused Investing
                    </span>
                    <span
                      style={{
                        fontFamily: 'Gilroy-Medium, sans-serif',
                        fontSize: '14px',
                        color: '#FFFFFF',
                      }}
                    >
                      July 5, 2023
                    </span>
                  </div>
                  
                  {/* Button */}
                  <button
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '6px 16px',
                      gap: '8px',
                      width: '366px',
                      height: '36px',
                      border: '1px solid #FFFFFF',
                      borderRadius: '100px',
                      background: 'transparent',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                      marginTop: '15px',
                      fontFamily: 'Gilroy-SemiBold, sans-serif',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push('/shariah/3');
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                  >
                    View Details
                    <Image 
                      src="/logo/backhome.png" 
                      alt="View Details" 
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
                
                {/* Preview Overlay */}
                {!isAuthenticated && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    zIndex: 20,
                    pointerEvents: 'none',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '32px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Preview Only
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontSize: '16px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      textAlign: 'center',
                    }}
                  >
                    Detailed Screening Available with Premium
                  </p>
                </div>
                )}
              </div>
              </div>
            </div>
            
            {/* New Single Tile */}
            {!isAuthenticated && (
            <div
              className="relative overflow-hidden"
              style={{
                width: '1064px',
                height: '247px',
                borderRadius: '16px',
                background: '#1F1F1F',
                padding: '40px',
                gap: '10px',
                boxSizing: 'border-box',
                marginTop: '220px',
                marginBottom: '220px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Curved Gradient Border */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                }}
              >
                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
              </div>

              {/* Gradient Ellipse - Top Left */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '588px',
                  height: '588px',
                  left: '-403px',
                  top: '-510px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 0,
                  borderRadius: '50%'
                }}
              ></div>

              {/* Gradient Ellipse - Bottom Right */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '588px',
                  height: '588px',
                  left: '739px',
                  bottom: '-510px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 1,
                  borderRadius: '50%'
                }}
              ></div>
              
              {/* Content */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ gap: '10px' }}>
                {/* Frame 81 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '24px',
                    width: '461px',
                    height: '77px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                >
                  {/* Title */}
                  <h2
                    style={{
                      width: '461px',
                      height: '32px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '32px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      margin: 0,
                    }}
                  >
                    Ready to unlock full access?
                  </h2>
                  
                  {/* Description */}
                  <p
                    style={{
                      width: '461px',
                      height: '21px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '130%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      margin: 0,
                    }}
                  >
                    Join thousands of informed investors making better decisions.
                  </p>
                </div>
                
                {/* Buttons Container */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '20px',
                    width: '414px',
                    height: '50px',
                    flex: 'none',
                    flexGrow: 0,
                    marginTop: '24px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  {/* Button 1 */}
                  <button
                    style={{
                      padding: '12px 32px',
                      background: '#FFFFFF',
                      color: '#0A0A0A',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '14px',
                      fontWeight: 400,
                      border: 'none',
                      cursor: 'pointer',
                      flex: 'none',
                      minWidth: '180px',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.currentTarget.style.outline = 'none'}
                  >
                    Start Subscription
                  </button>
                  {/* Button 2 */}
                  <button
                    style={{
                      padding: '12px 32px',
                      background: 'transparent',
                      color: '#FFFFFF',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '14px',
                      fontWeight: 400,
                      border: '1px solid #FFFFFF',
                      cursor: 'pointer',
                      flex: 'none',
                      minWidth: '180px',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                  >
                    Watch Free Videos
                  </button>
                </div>
              </div>
            </div>
            )}
            
            {/* Frequently Asked Questions Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '847px',
                height: '87px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: isAuthenticated ? '220px' : '0px',
              }}
            >
              {/* Heading */}
              <h2
                style={{
                  width: '847px',
                  height: '47px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '130%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Frequently Asked Questions
              </h2>
              
              {/* Description */}
              <p
                style={{
                  width: '847px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Everything you need to know about your subscription.
              </p>
            </div>
            
            {/* FAQ Tiles Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '1064px',
                marginTop: isAuthenticated ? '24px' : '48px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* FAQ Tile 1 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '1064px',
                  height: expandedTiles[0] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(0)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Can I cancel anytime?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[0] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[0] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Yes - your access continues until your period ends.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 2 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '1064px',
                  height: expandedTiles[1] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(1)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Do you offer refunds?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[1] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[1] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Answer placeholder text - will be updated later.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 3 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '1064px',
                  height: expandedTiles[2] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(2)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    What's Included?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[2] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[2] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Answer placeholder text - will be updated later.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 4 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '1064px',
                  height: expandedTiles[3] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(3)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Will you add more features?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[3] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[3] && (
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Answer placeholder text - will be updated later.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            {isAuthenticated && (
              <div className="mt-16 mb-16 w-full" style={{ marginTop: '220px' }}>
                <NewsletterSubscription />
              </div>
            )}
            {/* Page content will go here */}
          </div>
        </div>
      </div>
      
      {/* Methodology Popup */}
      {showMethodologyPopup && (
        <div
          ref={backdropRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '100px 20px 100px 20px',
            overflow: 'visible',
          }}
          onClick={() => setShowMethodologyPopup(false)}
        >
          <div
            ref={popupContentRef}
            data-popup-content
            style={{
              position: 'relative',
              width: '630px',
              background: '#1F1F1F',
              borderRadius: '16px',
              padding: '24px',
              gap: '24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10003,
              marginBottom: '100px',
              flexShrink: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '5px',
                position: 'relative',
              }}
            >
              {/* Heading and Description */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '24px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Screening Methodology
                  </h2>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => setShowMethodologyPopup(false)}
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '1px solid #AFB9BF',
                      borderRadius: '20px',
                      background: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      flex: 'none',
                      flexGrow: 0,
                      position: 'relative',
                      marginLeft: 'auto',
                    }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.border = '1px solid #AFB9BF';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.border = '1px solid #AFB9BF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid #AFB9BF';
                }}
              >
                {/* X Icon */}
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <path
                    d="M1 1L7 7M7 1L1 7"
                    stroke="#AFB9BF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
                </div>
                <p
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: 0,
                    lineHeight: '130%',
                  }}
                >
                  Comprehensive framework aligned with AAOIFI standards
                </p>
              </div>
            </div>
            
            {/* Content Area */}
            <div 
              style={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Financial Ratios Box */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '16px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '252px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Financial Ratios
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '520px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Debt to Market Cap */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '36px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '8px',
                        width: '520px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      />
                      <span
                        style={{
                          width: '129px',
                          height: '14px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                        }}
                      >
                        Debt to Market Cap
                      </span>
                    </div>
                    <div
                      style={{
                        width: '510px',
                        height: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          width: '448px',
                          height: '14px',
                          left: '0px',
                          top: '0px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        Total debt should not exceed one-third of market capitalization
                      </span>
                    </div>
                  </div>
                  
                  {/* Bullet 2: Cash & Interest Securities */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '36px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '8px',
                        width: '520px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      />
                      <span
                        style={{
                          width: '164px',
                          height: '14px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                        }}
                      >
                        Cash & Interest Securities
                      </span>
                    </div>
                    <div
                      style={{
                        width: '510px',
                        height: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          width: '448px',
                          height: '14px',
                          left: '0px',
                          top: '0px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        Interest-bearing assets limited to one-third of total assets
                      </span>
                    </div>
                  </div>
                  
                  {/* Bullet 3: Accounts Receivable */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '36px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '8px',
                        width: '520px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      />
                      <span
                        style={{
                          width: '135px',
                          height: '14px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                        }}
                      >
                        Accounts Receivable
                      </span>
                    </div>
                    <div
                      style={{
                        width: '510px',
                        height: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          width: '448px',
                          height: '14px',
                          left: '0px',
                          top: '0px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        Receivables should be less than 49% of total assets
                      </span>
                    </div>
                  </div>
                  
                  {/* Bullet 4: Interest Income */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '36px',
                      flex: 'none',
                      order: 4,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '8px',
                        width: '520px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      />
                      <span
                        style={{
                          width: '99px',
                          height: '14px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                        }}
                      >
                        Interest Income
                      </span>
                    </div>
                    <div
                      style={{
                        width: '510px',
                        height: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          width: '448px',
                          height: '14px',
                          left: '0px',
                          top: '0px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        Income from interest sources must be below 5% of total revenue
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Governance & Ethics Box */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '12px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '164px',
                  background: '#1F1F1F',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    marginBottom: '5px',
                  }}
                >
                  Governance & Ethics
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '12px',
                    width: '520px',
                    height: '92px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Transparent financial reporting */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '199px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Transparent financial reporting
                    </span>
                  </div>
                  
                  {/* Bullet 2: Ethical business practices */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '165px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Ethical business practices
                    </span>
                  </div>
                  
                  {/* Bullet 3: No involvement in harmful activities */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '228px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      No involvement in harmful activities
                    </span>
                  </div>
                  
                  {/* Bullet 4: Compliance with international standards */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '263px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Compliance with international standards
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Prohibited Business Activities Box */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '12px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '242px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    marginBottom: '5px',
                  }}
                >
                  Prohibited Business Activities
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '12px',
                    width: '520px',
                    height: '170px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Alcohol production or distribution */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '214px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Alcohol production or distribution
                    </span>
                  </div>
                  
                  {/* Bullet 2: Conventional banking and insurance */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '237px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Conventional banking and insurance
                    </span>
                  </div>
                  
                  {/* Bullet 3: Adult entertainment and media */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '203px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Adult entertainment and media
                    </span>
                  </div>
                  
                  {/* Bullet 4: Weapons and defense (controversial) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '240px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Weapons and defense (controversial)
                    </span>
                  </div>
                  
                  {/* Bullet 5: Gambling and gaming operations */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 4,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '219px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Gambling and gaming operations
                    </span>
                  </div>
                  
                  {/* Bullet 6: Pork and pork-related products */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 5,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '204px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Pork and pork-related products
                    </span>
                  </div>
                  
                  {/* Bullet 7: Tobacco (threshold < 5% revenue) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 6,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '214px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Tobacco (threshold &lt; 5% revenue)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Data Sources Box */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '12px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '190px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    marginBottom: '5px',
                  }}
                >
                  Data Sources
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '12px',
                    width: '520px',
                    height: '118px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Company financial statements (10-K, 10-Q) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '278px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Company financial statements (10-K, 10-Q)
                    </span>
                  </div>
                  
                  {/* Bullet 2: AAOIFI Shariah standards */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '165px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      AAOIFI Shariah standards
                    </span>
                  </div>
                  
                  {/* Bullet 3: Leading Islamic finance scholars */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '208px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Leading Islamic finance scholars
                    </span>
                  </div>
                  
                  {/* Bullet 4: Third-party financial databases */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '206px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Third-party financial databases
                    </span>
                  </div>
                  
                  {/* Bullet 5: Industry research and analysis */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 4,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '194px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Industry research and analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
              <button
                onClick={() => setShowMethodologyPopup(false)}
                style={{
                  width: '560px',
                  maxWidth: '560px',
                  padding: '12px 32px',
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.currentTarget.style.border = 'none';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.border = 'none';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = 'none';
              }}
            >
              Close
            </button>
          </div>
        </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function ResearchPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});

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
        <g filter="url(#filter0_f_research)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_research)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_research" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_research"/>
          </filter>
          <linearGradient id="paint0_linear_research" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
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
                <path d="M485.003 448.627C449.573 580.853 314.193 659.464 182.624 624.21C51.0543 588.956 -26.8824 453.187 8.54736 320.961C43.9772 188.735 179.378 110.129 310.947 145.383L478.648 190.318C517.106 200.623 558.36 174.855 558.36 174.855L485.003 448.627ZM266.707 306.134C223.047 294.435 178.123 320.521 166.366 364.399C154.609 408.277 180.471 453.33 224.131 465.029C267.791 476.727 312.715 450.641 324.472 406.763L345.76 327.316L266.707 306.134Z" fill="url(#paint0_linear_vector_logo_research)"/>
                <path d="M417.104 61.0593C428.861 17.1816 473.785 -8.90461 517.445 2.79402C561.105 14.4926 586.967 59.5461 575.21 103.424C563.453 147.301 518.529 173.388 474.869 161.689L395.816 140.507L417.104 61.0593Z" fill="url(#paint1_linear_vector_logo_research)"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_vector_logo_research" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
                <linearGradient id="paint1_linear_vector_logo_research" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
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
                ? 'Position Sizing Calculator - Optimize Your Risk, Maximize Your Returns'
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
                ? 'Calculate optimal position sizes based on your risk tolerance, account size, and trading strategy. Save scenarios and track your portfolio performance.'
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
                onClick={() => router.push('/pricing')}
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
            
            {/* Big Gap */}
            <div style={{ marginTop: '220px' }}></div>
            
            {/* Ready to unlock full access Tile */}
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
                marginTop: '0px',
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
                    onClick={() => router.push('/pricing')}
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
                      We offer a 7-day money-back guarantee for all new subscribers.
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
                      Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.
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
                      Yes! We continuously improve our platform and add new features based on user feedback.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

// Helper function to render text with bold formatting (**text**)
function renderBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2);
      return <strong key={index} className='text-white'>{boldText}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

interface Step {
  number: number;
  title: string;
  description?: string;
  link?: string;
  points?: string[];
}

interface Benefits {
  heading: string;
  points: string[];
  footer?: string;
}

interface PartnerPageProps {
  partnerName: string;
  heading?: string;
  description?: string;
  link?: string;
  steps?: Step[];
  benefits?: Benefits;
  videoId: string; // YouTube video ID
}

// Simple YouTube embed component
function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full relative aspect-video">
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center rounded-lg">
          <div className="text-white">Loading video...</div>
        </div>
      )}
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={`Join Our Discord for Free via ${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

export default function PartnerPage({
  partnerName,
  heading,
  description,
  link,
  steps,
  benefits,
  videoId,
}: PartnerPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      <style jsx>{`
        @media (max-width: 768px) {
          .partner-background-svg {
            width: 1043px !important;
            height: 470px !important;
            left: -300px !important;
            top: -120px !important;
            rotate: -8deg !important;
          }
        }
      `}</style>
    
      {/* Background SVG Gradient - Same as PortfolioPage */}
      <svg 
        className="absolute pointer-events-none partner-background-svg md:hidden"
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
        <g filter="url(#filter0_f_partner)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_partner)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_partner" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_partner"/>
          </filter>
          <linearGradient id="paint0_linear_partner" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3813F3"/>
            <stop offset="0.307692" stopColor="#DE50EC"/>
            <stop offset="0.543269" stopColor="#B9B9E9"/>
            <stop offset="0.740385" stopColor="#4B25FD"/>
            <stop offset="0.9999" stopColor="#05B0B3"/>
          </linearGradient>
        </defs>
      </svg>
    
      <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              width: '300px',
              height: '400px',
              left: '-47px',
              // top: '-404px',
              background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
              filter: 'blur(100px)',
              transform: 'rotate(220deg)',
              zIndex: 0,
            }}
          />
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              width: '308px',
              height: '400px',
              right: '-100px',
              // top: '324px',
              background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
              filter: 'blur(100px)',
              transform: 'rotate(-92.63deg)',
              zIndex: 1,
            }}
          />

      {/* Navigation Header */}
      <Navbar variant="default" />
      <div className='relative md:hidden'>

        <Image src="/icons/partner1.svg" alt="Partner Background" width={300} height={30}  className='absolute top-[220px]  right-[-140px]'/>
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 mt-8 sm:mt-12 md:mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Left Column: Text Content */}
              <div className="flex flex-col gap-6 h-full">
                {heading && (
                  <h1
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-white leading-tight"
                  >
                    {heading}
                  </h1>
                )}
                
                {description && (
                  <p
                    className="text-xl  text-white leading-relaxed"
                  >
                    {renderBoldText(description)}
                  </p>
                )}

                {/* Link Section */}
                {link && (
                  <div className="flex flex-col gap-2">
                    <p className="text-xl g font-medium text-white">
                      🔗 Register here:
                    </p>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base  text-blue-400 hover:text-blue-300 underline break-all"
                    >
                      {link}
                    </a>
                  </div>
                )}

                {/* Steps Layout */}
                {steps && steps.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {steps.map((step) => (
                      <div
                        key={step.number}
                        className="flex flex-col gap-[2px] items-start"
                      >
                        <div className="flex flex-nowrap">
                          <span className="font-bold text-lg sm:text-xl mr-1 flex-shrink-0">
                            Step {step.number}:{" "}
                          </span>
                          <span className="text-lg sm:text-xl font-bold text-white">
                            {step.title}
                          </span>
                        </div>

                        {step.description && (
                          <p
                            className="text-base  text-white/80 leading-relaxed"
                          >
                            {renderBoldText(step.description)}
                          </p>
                        )}
                        {step.link && (
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-blue-400 hover:text-blue-300 underline break-all"
                          >
                            {step.link}
                          </a>
                        )}
                        {step.points && (
                          <ul className="flex flex-col gap-2 list-none">
                            {step.points.map((point, index) => (
                              <li key={index} className="text-base text-white leading-relaxed list-disc list-inside">
                                {renderBoldText(point)}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Benefits Layout (Binance-style) */}
                {benefits && (
                  <div className="flex flex-col gap-4">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white">
                      {benefits.heading}
                    </h2>
                    <ul className="flex flex-col gap-2 list-none">
                      {benefits.points.map((point, index) => (
                        <li
                          key={index}
                          className="text-base  text-white leading-relaxed list-disc list-inside"
                        >
                          {renderBoldText(point)}
                        </li>
                      ))}
                    </ul>
                    {benefits.footer && (
                      <p
                        className="text-base sm:text-lg text-white leading-relaxed mt-2"
                        style={{ fontFamily: 'Gilroy' }}
                      >
                        {renderBoldText(benefits.footer)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Video */}
              <div className="flex h-full">
                <div className="bg-[#1F1F1F] rounded-xl p-3 sm:p-6 relative w-full flex flex-col h-fit">
                  {/* Curved Gradient Border */}
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
                  
                  <div className="relative z-10 flex flex-col ">
                    
                    
                    {/* Video Embed */}
                    <YouTubeEmbed videoId={videoId} />
                    
                    {/* Video Title Below */}
                    <a  href="https://discord.com/invite/inspiredanalyst"
                  target="_blank"
                  rel="noopener noreferrer">

                    <p
                      className="text-white text-right mt-4 text-base  font-normal"
                      >
                      Join Our Discord for Free via {partnerName}
                    </p>
                      </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}


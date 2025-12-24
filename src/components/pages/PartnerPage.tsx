'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface PartnerPageProps {
  partnerName: string;
  heading: string;
  description: string;
  steps: Step[];
  videoId: string; // YouTube video ID
}

// Simple YouTube embed component
function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full relative" style={{ aspectRatio: '16/9' }}>
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
  steps,
  videoId,
}: PartnerPageProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
    
      <div
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

      {/* Main Content */}
      <main className="relative z-10">
        <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-20 mt-8 sm:mt-12 md:mt-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Left Column: Text Content */}
              <div className="flex flex-col gap-6">
                <h1
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold text-white leading-tight"
                >
                  {heading}
                </h1>
                
                <p
                  className="text-base sm:text-lg md:text-xl text-white leading-relaxed"
                  style={{ fontFamily: 'Gilroy' }}
                >
                  {description}
                </p>

                {/* Steps */}
                <div className="flex flex-col gap-6 mt-4">
                  {steps.map((step) => (
                    <div
                      key={step.number}
                      className="flex flex-col gap-1 items-start"
                    >
                      <div className="flex">
                      <span
                        className="  font-bold text-base mr-1"
                      >
                        Step {step.number}: {" "}
                      </span>
                        <span
                          className="text-base  font-medium text-white "
                          >
                          {step.title}
                        </span>
                      </div>

                        <p
                          className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed"
                          style={{ fontFamily: 'Gilroy' }}
                        >
                          {step.description}
                        </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Video */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-[#1F1F1F] rounded-2xl p-4 sm:p-6 relative">
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
                  
                  <div className="relative z-10">
                    
                    
                    {/* Video Embed */}
                    <YouTubeEmbed videoId={videoId} />
                    
                    {/* Video Title Below */}
                    <p
                      className="text-white text-right mt-4 text-base  font-normal"
                    >
                      Join Our Discord for Free via {partnerName}
                    </p>
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


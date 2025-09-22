import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import HeroSection from '@/components/sections/HeroSection';
import TailoredGuidanceSection from '@/components/sections/TailoredGuidanceSection';
import LatestVideos from '@/components/sections/LatestVideos';
import React from 'react';

export default function Home() {

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* HeroSection Component with background */}
      <main>
        <HeroSection />
      </main>

      {/* Main Content Section - Minimal horizontal padding for more text space */}
      <section className="relative z-10 bg-[#0A0A0A] px-2 sm:px-3 md:px-4 lg:px-6 py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Section Header with Inline Images - Minimal padding for 2-line display */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2 className="gilroy-heading text-white flex flex-wrap items-center justify-center px-1 sm:px-2">
              <span>Breaking Down Markets,</span>
              <img
                src="\charts\Rectangle 51.png"
                alt="Chart"
                className="inline-block w-10 sm:w-16 md:w-16 lg:w-20 h-6 sm:h-8 md:h-10 lg:h-12 rounded-xl transform rotate-4"
              />
              <span>Crypto & Data Into Clear, Actionable</span>
              <img
                src="\charts\Rectangle 50.png"
                alt="Chart"
                className="inline-block w-10 sm:w-16 md:w-16 lg:w-20 h-6 sm:h-8 md:h-10 lg:h-12 rounded-xl transform rotate-6"
              />
              <span>Insights - So You Can Learn, Grow & Succeed Without The</span>
              <img
                src="\charts\Rectangle 52.png"
                alt="Chart"
                className="inline-block w-10 sm:w-16 md:w-16 lg:w-20 h-6 sm:h-8 md:h-10 lg:h-12 rounded-xl transform -rotate-3"
              />
              <span>Jargon.</span>
            </h2>
          </div>

          {/* Two Column Layout - Increased gap */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start">
            {/* Feature Cards Grid - Increased spacing */}
            <div className="space-y-4 sm:space-y-8">
              {/* Top Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Data-Driven Approach Card - Smaller padding */}
                <div className="bg-[#1F1F1F] p-3 sm:p-4 lg:p-5 rounded-2xl space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Data-Driven Approach</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" style={{fontFamily: 'Gilroy'}}>Every analysis is backed by comprehensive research</p>
                </div>

                {/* Educational Focus Card */}
                <div className="bg-[#1F1F1F] p-3 sm:p-4 lg:p-5 rounded-2xl space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Educational Focus</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" style={{fontFamily: 'Gilroy'}}>Complex concepts broken down into actionable insights</p>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Real-Time Coverage Card */}
                <div className="bg-[#1F1F1F] p-3 sm:p-4 lg:p-5 rounded-2xl space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Real-Time Coverage</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" style={{fontFamily: 'Gilroy'}}>Live trading sessions and immediate market commentary</p>
                </div>

                {/* Community-First Card */}
                <div className="bg-[#1F1F1F] p-3 sm:p-4 lg:p-5 rounded-2xl space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Community-First</h3>
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" style={{fontFamily: 'Gilroy'}}>Building a supportive learning environment</p>
                </div>
              </div>
            </div>

            {/* About Text & CTA - Smaller text and increased spacing */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8">
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg" style={{fontFamily: 'Gilroy'}}>
                I transform complex financial concepts into actionable insights that drive real results. As a content creator specializing in market analysis, cryptocurrency trends, and data science applications in finance, my approach combines rigorous technical analysis with clear, engaging explanations. Whether you&apos;re a beginner taking your first steps into investing or an experienced trader looking for fresh perspectives, my content bridges the gap between complex market dynamics and practical decision-making.
              </p>

              <a
                href="/book"
                className="bg-white text-[#0A0A0A] px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 inline-block" style={{fontFamily: 'Gilroy', fontWeight: 600}}
              >
                Book 1:1 Meeting
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Logos Section with Vector Background */}
      <section className="relative z-10 bg-[#0A0A0A] px-2 sm:px-3 md:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Vector Background Container with responsive dimensions based on 1064x310 */}
          <div
            className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden"
            style={{
              aspectRatio: '1064/310',
              border: '1px solid transparent',
              background: `
                url("/Vector (1).png"),
                linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                radial-gradient(63% 50.19% at 50% 50.19%, rgba(255, 255, 255, 0.2) 0%, rgba(10, 10, 10, 0) 100%) border-box
              `,
              backgroundSize: 'contain, cover, cover',
              backgroundPosition: 'center, center, center',
              backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
            }}
          >
            {/* Brand Logos Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-center space-x-6 sm:space-x-8 md:space-x-12 lg:space-x-16 xl:space-x-20 opacity-90 flex-wrap gap-y-4 sm:gap-y-6 px-4 sm:px-6 md:px-8">
                {/* Actual Brand Images - Responsive sizes */}
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto flex-shrink-0">
                  <img
                    src="/brand_images/Group 10.png"
                    alt="Brand Logo"
                    className="opacity-80 w-full h-auto object-contain max-h-8 sm:max-h-10 lg:max-h-12"
                  />
                </div>
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto flex-shrink-0">
                  <img
                    src="/brand_images/image 2.png"
                    alt="Brand Logo"
                    className="opacity-80 w-full h-auto object-contain max-h-8 sm:max-h-10 lg:max-h-12"
                  />
                </div>
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto flex-shrink-0">
                  <img
                    src="/brand_images/image 4.png"
                    alt="Brand Logo"
                    className="opacity-80 w-full h-auto object-contain max-h-8 sm:max-h-10 lg:max-h-12"
                  />
                </div>
                <div className="w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 h-auto flex-shrink-0">
                  <img
                    src="/brand_images/Vector (1).png"
                    alt="Brand Logo"
                    className="opacity-80 w-full h-auto object-contain max-h-8 sm:max-h-10 lg:max-h-12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tailored Guidance Section with Calendar */}
      <TailoredGuidanceSection />

      {/* Latest Videos Section */}
      <LatestVideos />

      {/* Newsletter Subscription - More responsive */}
      <div className="px-3 sm:px-5 md:px-8 lg:px-12 py-12 sm:py-14 lg:py-16">
        <NewsletterSubscription />
      </div>
    </div>
  );
}

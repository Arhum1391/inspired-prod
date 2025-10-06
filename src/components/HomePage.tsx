'use client';

import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import HeroSection from '@/components/sections/HeroSection';
import TailoredGuidanceSection from '@/components/sections/TailoredGuidanceSection';
import LatestVideos from '@/components/sections/LatestVideos';
import FeaturesSection from '@/components/sections/FeaturesSection';
import SocialStats from '@/components/sections/SocialStats';
import BrandStories from '@/components/sections/BrandStories';
import CollaborationForm from '@/components/sections/CollaborationForm';
import Footer from '@/components/Footer';
import Image from 'next/image';
import React, { useEffect } from 'react';

export default function Home() {
  // Pre-fetch team data when landing page loads
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/api/team');
        if (response.ok) {
          const data = await response.json();
          // Store in sessionStorage for use in meetings page
          sessionStorage.setItem('teamData', JSON.stringify(data.team));
        }
      } catch (error) {
        console.error('Error pre-fetching team data:', error);
      }
    };

    fetchTeamData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Vector Background Image */}
      <div
        className="absolute z-0"
        style={{
          width: '100%',
          maxWidth: '1490.5px',
          height: '100vh',
          minHeight: '1000px',
          left: '0px',
          top: '2px',
          filter: 'blur(100px)',
        }}
      >
        <div className="animate-zoom-wave w-full h-full">
          <Image
            src="/Vector 1.png"
            alt="Abstract gradient background"
            quality={100}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* HeroSection Component with background */}
      <main className="relative z-10">
        <HeroSection />
        {/* Social Media Stats Section */}
        <div id="social-stats">
          <SocialStats />
        </div>
      </main>
      
      


      {/* Main Content Section - Minimal horizontal padding for more text space */}
      <section id="about" className="relative z-10 bg-[#0A0A0A] px-2 sm:px-3 md:px-4 lg:px-6 py-8 sm:py-12 md:py-16 mt-8 sm:mt-12 md:mt-16">
        <div className="max-w-5xl mx-auto">
          {/* Section Header with Inline Images - Minimal padding for 2-line display */}
          <div className="mb-12 sm:mb-16 lg:mb-20">
            <h2 className="gilroy-heading text-white flex flex-wrap items-center justify-center px-1 sm:px-2">
              <span>Breaking Down Markets,</span>
              <img
                src="\team images\group 1.svg"
                alt="Chart"
                className="inline-block w-12 sm:w-16 md:w-18 lg:w-20 h-8 sm:h-10 md:h-12 lg:h-14 rounded-xl transform rotate-4 object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span>Crypto & Data Into Clear, </span>
              <span className="w-full"></span>
              
              <span>Actionable </span>
              <img
                src="\charts\Rectangle 51.png"
                alt="Chart"
                className="inline-block w-12 sm:w-16 md:w-18 lg:w-20 h-8 sm:h-10 md:h-12 lg:h-14 rounded-xl transform rotate-6 object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span>Insights - So You Can Learn, Grow & Succeed</span>
              <span className="w-full"></span>
              <span>Without The</span>
              <img
                src="\team images\group 2.svg"
                alt="Chart"
                className="inline-block w-12 sm:w-16 md:w-18 lg:w-20 h-8 sm:h-10 md:h-12 lg:h-14 rounded-xl transform -rotate-3 object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
              <span>Jargon.</span>
            </h2>
          </div>

          {/* Frame 77 - Main Content Container */}
          <div className="flex flex-col lg:flex-row items-start gap-6 sm:gap-8 lg:gap-10">
            {/* Mobile: Text & CTA First, Desktop: Cards First */}
            <div className="flex flex-col gap-6 w-full lg:hidden">
              <p className="text-white text-sm sm:text-base leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                I transform complex financial concepts into actionable insights that drive real results. As a content creator specializing in market analysis, cryptocurrency trends, and data science applications in finance, my approach combines rigorous technical analysis with clear, engaging explanations.
                <br /><br />
                Whether you&apos;re a beginner taking your first steps into investing or an experienced trader looking for fresh perspectives, my content bridges the gap between complex market dynamics and practical decision-making.
              </p>

              <a
                href="/meetings"
                className="bg-white text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center justify-center w-fit"
                style={{fontFamily: 'Gilroy', fontWeight: 600}}
              >
                Book Mentorship
              </a>
            </div>

            {/* Frame 85 - Left Column with Cards */}
            <div className="flex flex-col gap-4 sm:gap-5 w-full lg:flex-1">
              {/* Frame 84 - Top Row Cards */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                {/* Data-Driven Approach Card */}
                <div className="bg-[#1F1F1F] flex flex-col justify-between p-4 gap-4 rounded-2xl flex-1 relative">
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
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight relative z-10" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Data-Driven Approach</h3>
                  <p className="text-white text-sm sm:text-base leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Every analysis is backed by comprehensive research</p>
                </div>

                {/* Educational Focus Card */}
                <div className="bg-[#1F1F1F] flex flex-col justify-between p-4 gap-4 rounded-2xl flex-1 relative">
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
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight relative z-10" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Educational Focus</h3>
                  <p className="text-white text-sm sm:text-base leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Complex concepts broken down into actionable insights</p>
                </div>
              </div>

              {/* Frame 83 - Bottom Row Cards */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                {/* Real-Time Coverage Card */}
                <div className="bg-[#1F1F1F] flex flex-col justify-between p-4 gap-4 rounded-2xl flex-1 relative">
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
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight relative z-10" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Real-Time Coverage</h3>
                  <p className="text-white text-sm sm:text-base leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Live trading sessions and immediate market commentary</p>
                </div>

                {/* Community-First Card */}
                <div className="bg-[#1F1F1F] flex flex-col justify-between p-4 gap-4 rounded-2xl flex-1 relative">
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
                  <h3 className="text-lg sm:text-xl font-semibold text-white leading-tight relative z-10" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Community-First</h3>
                  <p className="text-white text-sm sm:text-base leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Building a supportive learning environment</p>
                </div>
              </div>
            </div>

            {/* Frame 74 - Right Column with Text & CTA - Desktop Only */}
            <div className="hidden lg:flex flex-col gap-9.5 w-full lg:flex-1">
              <p className="text-white text-sm sm:text-base leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                I transform complex financial concepts into actionable insights that drive real results. As a content creator specializing in market analysis, cryptocurrency trends, and data science applications in finance, my approach combines rigorous technical analysis with clear, engaging explanations.
                <br /><br />
                Whether you&apos;re a beginner taking your first steps into investing or an experienced trader looking for fresh perspectives, my content bridges the gap between complex market dynamics and practical decision-making.
              </p>

              <a
                href="/meetings"
                className="bg-white text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 inline-flex items-center justify-center w-fit mx-auto lg:mx-0"
                style={{fontFamily: 'Gilroy', fontWeight: 600}}
              >
                Book Mentorship
              </a>
            </div>
          </div>
        </div>
      </section>

      


      {/* Latest Videos Section */}
      <div id="latest-videos">
        <LatestVideos />
      </div>

      {/* Tailored Guidance Section with Calendar */}
      <div id="tailored-guidance">
        <TailoredGuidanceSection />
      </div>


      {/* Brand Logos Section with 3 Connected Vector Grid Rows - Responsive */}
      <section id="partners" className="relative z-10 bg-[#0A0A0A] px-2 sm:px-3 md:px-4 lg:px-6 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Our Valued Partners Header - Centered and smaller */}
          <div className="text-center mb-4 sm:mb-6 md:mb-12">
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-semibold text-white"
              style={{fontFamily: 'Gilroy', fontWeight: 600}}
            >
              Our Valued Partners
            </h2>
          </div>

          {/* Mobile Carousel View */}
          <div className="block md:hidden relative w-full mx-auto h-[180px]">
            {/* Single Vector Background for Mobile */}
            <div
              className="absolute w-full top-1/2 transform -translate-y-1/2 max-w-md mx-auto left-0 right-0"
              style={{
                aspectRatio: '1064/310',
                background: `
                  url("/Vector (1).png"),
                  linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                  radial-gradient(63% 50.19% at 50% 50.19%, rgba(255, 255, 255, 0.2) 0%, rgba(10, 10, 10, 0) 100%) border-box
                `,
                backgroundSize: 'contain, cover, cover',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
              }}
            />

            {/* Carousel Container */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 w-full overflow-hidden">
              <div className="flex animate-carousel gap-16 items-center">
                {/* All brand logos in a row that will scroll */}
                <img src="/brand_images/Gridlock.svg" alt="Gridlock" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/memotech.svg" alt="Memotech" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/finvolution.svg" alt="Finvolution" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/creati.svg" alt="Creati" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/binance.svg" alt="Binance" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/exness.svg" alt="Exness" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/capcut.svg" alt="CapCut" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/algorand.svg" alt="Algorand" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/wegic.svg" alt="Wegic" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/lemfi.svg" alt="Lemfi" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/ledger.svg" alt="Ledger" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                {/* Duplicate for seamless loop */}
                <img src="/brand_images/Gridlock.svg" alt="Gridlock" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/memotech.svg" alt="Memotech" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/finvolution.svg" alt="Finvolution" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/creati.svg" alt="Creati" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/binance.svg" alt="Binance" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/exness.svg" alt="Exness" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/capcut.svg" alt="CapCut" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/algorand.svg" alt="Algorand" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/wegic.svg" alt="Wegic" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/lemfi.svg" alt="Lemfi" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
                <img src="/brand_images/ledger.svg" alt="Ledger" className="h-12 w-24 object-contain opacity-80 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Desktop/Tablet Grid View */}
          <div className="hidden md:block relative w-full max-w-4xl mx-auto h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[724px]">

            {/* Group 13 - First Vector Grid Background */}
            <div
              className="absolute w-full top-0"
              style={{
                aspectRatio: '1064/310',
                background: `
                  url("/Vector (1).png"),
                  linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                  radial-gradient(63% 50.19% at 50% 50.19%, rgba(255, 255, 255, 0.2) 0%, rgba(10, 10, 10, 0) 100%) border-box
                `,
                backgroundSize: 'contain, cover, cover',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
              }}
            />

            {/* Group 14 - Second Vector Grid Background */}
            <div
              className="absolute w-full top-[28%] sm:top-[35%] md:top-[40%] lg:top-[207px]"
              style={{
                aspectRatio: '1064/310',
                background: `
                  url("/Vector (1).png"),
                  linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                  radial-gradient(63% 50.19% at 50% 50.19%, rgba(255, 255, 255, 0.2) 0%, rgba(10, 10, 10, 0) 100%) border-box
                `,
                backgroundSize: 'contain, cover, cover',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
              }}
            />

            {/* Group 15 - Third Vector Grid Background */}
            <div
              className="absolute w-full top-[56%] sm:top-[70%] md:top-[80%] lg:top-[414px]"
              style={{
                aspectRatio: '1064/310',
                background: `
                  url("/Vector (1).png"),
                  linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                  radial-gradient(63% 50.19% at 50% 50.19%, rgba(255, 255, 255, 0.2) 0%, rgba(10, 10, 10, 0) 100%) border-box
                `,
                backgroundSize: 'contain, cover, cover',
                backgroundPosition: 'center, center, center',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
              }}
            />

            {/* Frame 26 - First Row Logos */}
            <div className="absolute z-30 flex justify-between items-center left-1/2 transform -translate-x-1/2 top-[13%] sm:top-[16%] md:top-[18%] lg:top-[16%] w-[85%] sm:w-[80%] md:w-[75%] lg:w-[859px] opacity-72 gap-2 sm:gap-4 md:gap-6 lg:gap-[104px] px-2 sm:px-4 lg:px-0">
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/Gridlock.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/memotech.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/finvolution.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/creati.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
            </div>

            {/* Frame 26 - Second Row Logos */}
            <div className="absolute z-30 flex justify-between items-center left-1/2 transform -translate-x-1/2 top-[41%] sm:top-[44%] md:top-[45%] lg:top-[45%] w-[85%] sm:w-[80%] md:w-[75%] lg:w-[859px] opacity-72 gap-2 sm:gap-4 md:gap-6 lg:gap-[104px] px-2 sm:px-4 lg:px-0">
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/binance.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/exness.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/capcut.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/algorand.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
            </div>

            {/* Frame 26 - Third Row Logos */}
            <div className="absolute z-30 flex justify-between items-center left-1/2 transform -translate-x-1/2 top-[67%] sm:top-[70%] md:top-[71%] lg:top-[73%] w-[85%] sm:w-[80%] md:w-[75%] lg:w-[859px] opacity-72 gap-2 sm:gap-4 md:gap-6 lg:gap-[104px] px-12 sm:px-16 lg:px-20">
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/wegic.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/lemfi.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
              <div className="w-10 sm:w-12 md:w-16 lg:w-20 xl:w-28 2xl:w-32 h-auto flex-shrink-0">
                <img
                  src="/brand_images/ledger.svg"
                  alt="Brand Logo"
                  className="opacity-80 w-full h-auto object-contain max-h-6 sm:max-h-7 md:max-h-8 lg:max-h-10 xl:max-h-12"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Brand Stories Section */}
      <div id="brand-stories">
        <BrandStories />
      </div>

      {/* Features Section */}
      <div id="features">
        <FeaturesSection />
      </div>

      {/* Newsletter Subscription - More responsive */}
      <div id="newsletter" className="px-3 sm:px-5 md:px-8 lg:px-12 py-12 sm:py-14 lg:py-16">
        <NewsletterSubscription />
      </div>

      {/* Collaboration Form */}
      <div id="collaboration">
        <CollaborationForm />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

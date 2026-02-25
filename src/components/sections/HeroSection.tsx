'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import OptimizedHeroImage from '@/components/OptimizedHeroImage';

const HeroSection = () => {
  // Only 1 image should have priority (LCP). Use viewport to avoid loading 6 priority images.
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const fn = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  const lcpPriorityMobile = !isDesktop;
  const lcpPriorityDesktop = isDesktop;
  return (
    // Hero section container with responsive height
    <section className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
      {/* Navigation Header */}
      <Navbar variant="hero" />

      {/* Main Content Container - Mobile optimized */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-6 pt-20 sm:pt-24 md:pt-20 lg:pt-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 sm:gap-12 md:gap-16 lg:gap-24">

          {/* Left Column: Text and Buttons - Mobile width fixed */}
          <div className="flex flex-col items-start gap-6 md:gap-4 lg:gap-5 mt-8 md:mt-0 lg:-mt-20 w-full lg:max-w-[700px]">
            <h1 className="text-[28px] leading-[120%] sm:text-[32px] md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white w-full" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
              Making AI, Finance & Tech Accessible Through Data-Driven Content
            </h1>
            <p className="text-[14px] leading-[120%] sm:text-[16px] md:text-base lg:text-lg text-white w-full" style={{fontFamily: 'Gilroy'}}>
              Expert analysis on stocks, crypto, and data science - delivered with clarity and humor
            </p>
            <div className="flex flex-col md:flex-row gap-5 md:gap-4 w-full">
              <a href="/meetings" className="w-full md:w-auto bg-white text-[#0A0A0A] text-[14px] font-semibold rounded-full py-[18px] px-8 hover:brightness-90 transition-all text-center flex items-center justify-center h-[50px]" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                Book Mentorship
              </a>

                <a
                  href="https://discord.com/invite/inspiredanalyst"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="  w-full sm:w-auto border border-white/60 bg-white/5 hover:bg-white/10 text-white text-[14px] font-semibold rounded-full py-3 px-6 transition-all flex items-center justify-center gap-2"
                >
                  <img
                    src="/icons/discord.svg"
                    alt="Discord"
                    className="w-5 h-5"
                  />
                  <span>Join Discord</span>
                </a>

                <a
                  href="https://whop.com/discover/inspiredanalyst/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto border border-white/60 bg-white/5 hover:bg-white/10 text-white text-[14px] font-semibold rounded-full py-3 px-6 transition-all flex items-center justify-center gap-2"
                >
                  <img
                    src="/icons/whop.svg"
                    alt="Whop"
                    className="h-5 w-5"
                  />
                  <span>Join Whop</span>
                </a>
            </div>
          </div>

          {/* Right Column: Responsive Images - Now visible on mobile */}
          <div className="w-full lg:w-auto block mt-8 lg:mt-0 pt-4 sm:pt-6 lg:pt-24">
            {/* Mobile: Horizontal scrolling layout */}
            <div className="lg:hidden relative w-full overflow-hidden">
              <div className="fade-mask">
                <div className="flex flex-col gap-2">
                  {/* Row 1 - Only first image gets priority on mobile (LCP) - unoptimized for faster TTFB */}
                  <div className="animate-scrollUp flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                    <OptimizedHeroImage src="/team-mob/6.jpg" variant="mobile" priority={lcpPriorityMobile} unoptimized={lcpPriorityMobile} />
                    <OptimizedHeroImage src="/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/5.png" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/6.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/5.png" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg" variant="mobile" />
                  </div>
                  {/* Row 2 - Offscreen: lazy load */}
                  <div className="animate-scrollDown flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                    <OptimizedHeroImage src="/team-mob/1.png" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/2 improved.png" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/1.png" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/2 improved.png" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg" variant="mobile" />
                  </div>
                  {/* Row 3 - Offscreen: lazy load */}
                  <div className="animate-scrollUp flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                    <OptimizedHeroImage src="/team-mob/3.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 3/6f56bacd424b99039a802a8a0f9f6cc53ed558a0.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/4 - colored.png" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/7.png" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/3.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/rectangle 3/6f56bacd424b99039a802a8a0f9f6cc53ed558a0.jpg" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/4 - colored.png" variant="mobile" />
                    <OptimizedHeroImage src="/team-mob/7.png" variant="mobile" />
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Vertical scrolling layout (original) */}
            <div className="hidden lg:block relative w-full max-w-[15.5rem] xl:max-w-[17.5rem] ml-auto mr-8 overflow-hidden" style={{aspectRatio: '305/702'}}>
              <div className="absolute inset-0 fade-mask overflow-hidden">
                <div className="flex h-[200%] w-full gap-4">
                  {/* Column 1 - Only first image gets priority on desktop (LCP) - unoptimized for faster TTFB */}
                  <div className="animate-scrollUp flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    <OptimizedHeroImage src="/team-mob/6.jpg" variant="desktop" sizes="165px" priority={lcpPriorityDesktop} unoptimized={lcpPriorityDesktop} />
                    <OptimizedHeroImage src="/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/5.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/6.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/5.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg" variant="desktop" sizes="165px" />
                  </div>
                  {/* Column 2 */}
                  <div className="animate-scrollDown flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    <OptimizedHeroImage src="/team-mob/1.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/2 improved.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/1.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/2 improved.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg" variant="desktop" sizes="165px" />
                  </div>
                  {/* Column 3 */}
                  <div className="animate-scrollUp flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    <OptimizedHeroImage src="/team-mob/3.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 3/6f56bacd424b99039a802a8a0f9f6cc53ed558a0.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/4 - colored.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/7.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/3.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/rectangle 3/6f56bacd424b99039a802a8a0f9f6cc53ed558a0.jpg" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/4 - colored.png" variant="desktop" sizes="165px" />
                    <OptimizedHeroImage src="/team-mob/7.png" variant="desktop" sizes="165px" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          </div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;
'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMobileMenuOpen && !target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);
  return (
    // Hero section container with responsive height
    <section className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-screen overflow-hidden">
      {/* Background Image: Positioned to cover hero section with natural fade */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/Vector 1.png"
          alt="Abstract gradient background"
          quality={100}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent"></div>
      </div>

      {/* Responsive Navigation Header - Reduced padding */}
      <div className="relative z-20 w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with Vector.png - Smaller */}
          <div className="flex items-center">
            <div className="w-24 sm:w-28 lg:w-36 h-5 sm:h-6 lg:h-7 rounded flex items-center justify-center px-2">
              <Image
                src="/Vector.png"
                alt="Inspired Analyst Logo"
                width={100}
                height={18}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation - Responsive with mobile menu */}
          <nav className="flex items-center relative">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              <a href="#" className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors">
                Research
              </a>
              <a href="#" className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors">
                Calculator
              </a>
              <a href="#" className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors">
                Portfolio
              </a>
              <a href="#" className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors">
                Shariah
              </a>
              <a href="#" className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors">
                Our Team
              </a>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Mobile Dropdown Menu */}
              {isMobileMenuOpen && (
                <div className="absolute top-8 right-0 mt-2 w-48 bg-[#1F1F1F] rounded-lg shadow-lg border border-gray-700 z-50">
                  <div className="py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Research
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Calculator
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Portfolio
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Shariah
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Our Team
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* CTA Button - Smaller and more responsive */}
          <div className="flex items-center">
            <a
              href="/book"
              className="bg-white text-[#0A0A0A] px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              <span className="hidden sm:inline">Book 1:1 Meeting</span>
              <span className="sm:hidden">Book Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Container - Mobile optimized */}
      <div className="relative z-10 px-5 sm:px-4 lg:px-6 -py-3 ">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 items-center gap-6 sm:gap-8 lg:gap-8">

          {/* Left Column: Text and Buttons - Reduced sizes */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
              Making Finance & Tech Accessible Through Data-Driven Content
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
              Expert analysis on stocks, crypto, and data science - delivered with clarity and humor
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
              <button className="bg-white text-[#0A0A0A] text-xs sm:text-sm font-semibold rounded-full py-2.5 sm:py-3 px-5 sm:px-6 hover:brightness-90 transition-all text-center">
                Book a 1v1 Call
              </button>
              <button className="border border-white text-white text-xs sm:text-sm font-semibold rounded-full py-2.5 sm:py-3 px-5 sm:px-6 hover:bg-white/10 transition-all text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Responsive Images - Now visible on mobile */}
          <div className="block mt-6 lg:mt-0">
            {/* Container with responsive dimensions approximating 305x702 ratio */}
            <div className="relative w-full max-w-[12rem] sm:max-w-[16rem] md:max-w-[19rem] lg:max-w-[22rem] xl:max-w-[24rem] mx-auto" style={{aspectRatio: '305/702'}}>
              <div className="absolute inset-0 fade-mask overflow-hidden">
                <div className="animate-scrollUp flex h-[100%] w-full gap-2 sm:gap-3 lg:gap-4">
                  {/* Column 1 */}
                  <div className="flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 1/0a1b3220b634dbcbf74285bbbef61b759ccc34ab.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 1/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    
                  </div>
                  {/* Column 2 */}
                  <div className="flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4 pt-4 sm:pt-6 lg:pt-8">
                  <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 2/4b9330666fbce22736fe4a8911e962c0d7b01e58.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 2/8c32b6a7d2dc3f1c6145f0d8ce2f4cbf7624bdb9.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    
                  </div>
                  {/* Column 3 */}
                  <div className="flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4 pt-8 sm:pt-12 lg:pt-16">
                  <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 3/2a66b175d40bf4c06b427ad1cc6a4084ca34030c.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 3/6f56bacd424b99039a802a8a0f9f6cc53ed558a0.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 3/132fa934817ce6538d83af9a779000a996e4971c.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("/rectangle 3/f4c909c24fdcf4f8d7c51c7f56229d42b0d2b490.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    
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
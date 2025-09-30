'use client';

import Navbar from '@/components/Navbar';

const HeroSection = () => {
  return (
    // Hero section container with responsive height
    <section className="relative min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] overflow-hidden">
      {/* Navigation Header */}
      <Navbar variant="hero" />

      {/* Main Content Container - Mobile optimized */}
      <div className="relative z-10 px-5 sm:px-4 lg:px-6 -mt-12 sm:-mt-14 lg:-mt-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 items-center gap-16 sm:gap-20 lg:gap-24">

          {/* Left Column: Text and Buttons - Reduced sizes */}
          <div className="flex flex-col gap-3 sm:gap-4 lg:gap-5 -mt-12 sm:-mt-16 lg:-mt-20">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
              Making Finance & Tech Accessible Through Data-Driven Content
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
              Expert analysis on stocks, crypto, and data science - delivered with clarity and humor
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
              <a href="/meetings" className="bg-white text-[#0A0A0A] text-xs sm:text-sm font-semibold rounded-full py-2.5 sm:py-3 px-5 sm:px-6 hover:brightness-90 transition-all text-center">
                Book a Meeting
              </a>
              <button className="border border-white text-white text-xs sm:text-sm font-semibold rounded-full py-2.5 sm:py-3 px-5 sm:px-6 hover:bg-white/10 transition-all text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Responsive Images - Now visible on mobile */}
          <div className="block mt-6 lg:mt-0 pt-16 sm:pt-20 lg:pt-24">
            {/* Container with responsive dimensions approximating 305x702 ratio */}
            <div className="relative w-full max-w-[8.5rem] sm:max-w-[11.5rem] md:max-w-[13.5rem] lg:max-w-[15.5rem] xl:max-w-[17.5rem] ml-auto mr-4 sm:mr-6 lg:mr-8 overflow-hidden" style={{aspectRatio: '305/702'}}>
              <div className="absolute inset-0 fade-mask overflow-hidden">
                <div className="flex h-[200%] w-full gap-2 sm:gap-3 lg:gap-4">
                  {/* Column 1 */}
                  <div className="animate-scrollUp flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    {/* First set of images */}
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/6.jpg")',
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
                        backgroundImage: 'url("inspired analysts team/5.png")',
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
                    {/* Duplicate set for seamless loop */}
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/6.jpg")',
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
                        backgroundImage: 'url("inspired analysts team/5.png")',
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
                  <div className="animate-scrollDown flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    {/* First set of images */}
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/1.png")',
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
                        backgroundImage: 'url("inspired analysts team/2 improved.png")',
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
                    {/* Duplicate set for seamless loop */}
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/1.png")',
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
                        backgroundImage: 'url("inspired analysts team/2 improved.png")',
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
                  <div className="animate-scrollUp flex w-1/3 flex-col gap-2 sm:gap-3 lg:gap-4">
                    {/* First set of images */}
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/3.jpg")',
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
                        backgroundImage: 'url("inspired analysts team/4 - colored.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/7.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    {/* Duplicate set for seamless loop */}
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/3.jpg")',
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
                        backgroundImage: 'url("inspired analysts team/4 - colored.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                    <div
                      className="aspect-[1/1.95] w-full rounded-full bg-zinc-800"
                      style={{
                        backgroundImage: 'url("inspired analysts team/7.png")',
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
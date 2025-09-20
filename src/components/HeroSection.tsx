import Image from 'next/image';

const HeroSection = () => {
  return (
    // Hero section container
    <section className="relative min-h-screen">
      {/* Background Image: Positioned behind hero content only */}
      <div className="absolute inset-0">
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

      {/* Responsive Navigation Header */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo with Vector.png */}
          <div className="flex items-center">
            <div className="w-32 sm:w-40 lg:w-52 h-6 sm:h-7 lg:h-8 rounded flex items-center justify-center px-2">
              <Image
                src="/Vector.png"
                alt="Inspired Analyst Logo"
                width={120}
                height={20}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="#" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Research
            </a>
            <a href="#" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Calculator
            </a>
            <a href="#" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Portfolio
            </a>
            <a href="#" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Shariah
            </a>
            <a href="#" className="text-sm font-medium text-white hover:text-gray-300 transition-colors">
              Our Team
            </a>
          </nav>

          {/* CTA Button - Responsive */}
          <div className="flex items-center">
            <a
              href="/book"
              className="bg-white text-[#0A0A0A] px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              <span className="hidden sm:inline">Book 1:1 Meeting</span>
              <span className="sm:hidden">Book Call</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Container: Sits on top of the background image */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 items-center gap-8 lg:gap-12">

          {/* Left Column: Text and Buttons */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white">
              Making Finance & Tech Accessible Through Data-Driven Content
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed">
              Expert analysis on stocks, crypto, and data science - delivered with clarity and humor
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 mt-4">
              <button className="bg-white text-[#0A0A0A] text-sm font-semibold rounded-full py-3 sm:py-4 px-6 sm:px-8 hover:brightness-90 transition-all text-center">
                Book a 1v1 Call
              </button>
              <button className="border border-white text-white text-sm font-semibold rounded-full py-3 sm:py-4 px-6 sm:px-8 hover:bg-white/10 transition-all text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Animated Images */}
           
            <div className="hidden lg:block h-[500px] fade-mask">
              <div className="animate-scrollUp flex h-[200%] w-full gap-6">
                {/* Column 1 */}
                <div className="flex w-1/3 flex-col gap-6">
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                </div>
                {/* Column 2 */}
                <div className="flex w-1/3 flex-col gap-6 pt-12">
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                </div>
                {/* Column 3 */}
                <div className="flex w-1/3 flex-col gap-6 pt-24">
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
                  <div className="h-[280px] w-[80px] rounded-full bg-zinc-800"></div>
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
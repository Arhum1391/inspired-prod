import NewsletterSubscription from '@/components/NewsletterSubscription';
import HeroSection from '@/components/HeroSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative">
      {/* Gradient Border Background Effect */}
      <div className="gradient-border-bg"></div>

      {/* Option 1: Original Hero Section (commented out) */}
      {/*
      <section className="relative z-10 px-5 md:px-20 py-16 md:py-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
              Making Finance & Tech Accessible Through Data-Driven Content
            </h1>
            <p className="text-lg text-gray-300 font-medium">
              Expert analysis on stocks, crypto, and data science - delivered with clarity and humor
            </p>
            <div className="flex flex-col sm:flex-row gap-5 pt-6">
              <a href="/book" className="bg-white text-[#0A0A0A] px-6 py-4 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 text-center">
                Book a 1v1 Call
              </a>
              <a href="#services" className="border border-white text-white px-6 py-4 rounded-full text-sm font-semibold hover:bg-white hover:text-[#0A0A0A] transition-all hover:scale-105 text-center">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Option 2: New HeroSection Component */}
      <main>
        <HeroSection />
      </main>

      {/* Main Content Section */}
      <section className="relative z-10 px-5 md:px-20 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Section Header with Decorative Images */}
          <div className="relative mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-center leading-relaxed px-4 text-white">
              Breaking Down Markets, Crypto & Data Into Clear, Actionable Insights - So You Can Learn, Grow & Succeed Without The Jargon.
            </h2>

            {/* Decorative Images */}
            <div className="absolute top-16 left-48 w-20 h-12 transform rotate-3 hidden lg:block">
              <img src="https://placehold.co/87x50/ffffff/000000?text=Chart1" alt="Chart" className="rounded-lg" />
            </div>
            <div className="absolute top-2 right-80 w-20 h-12 transform rotate-3 hidden lg:block">
              <img src="https://placehold.co/85x50/ffffff/000000?text=Chart2" alt="Chart" className="rounded-lg" />
            </div>
            <div className="absolute bottom-0 right-48 w-20 h-12 transform -rotate-5 hidden lg:block">
              <img src="https://placehold.co/87x50/ffffff/000000?text=Chart3" alt="Chart" className="rounded-lg" />
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Feature Cards Grid */}
            <div className="space-y-5">
              {/* Top Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Data-Driven Approach Card */}
                <div className="bg-[#1F1F1F] p-4 rounded-2xl space-y-4">
                  <h3 className="text-xl font-semibold text-white">Data-Driven Approach</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Every analysis is backed by comprehensive research</p>
                </div>

                {/* Educational Focus Card */}
                <div className="bg-[#1F1F1F] p-4 rounded-2xl space-y-4">
                  <h3 className="text-xl font-semibold text-white">Educational Focus</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Complex concepts broken down into actionable insights</p>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Real-Time Coverage Card */}
                <div className="bg-[#1F1F1F] p-4 rounded-2xl space-y-4">
                  <h3 className="text-xl font-semibold text-white">Real-Time Coverage</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Live trading sessions and immediate market commentary</p>
                </div>

                {/* Community-First Card */}
                <div className="bg-[#1F1F1F] p-4 rounded-2xl space-y-4">
                  <h3 className="text-xl font-semibold text-white">Community-First</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">Building a supportive learning environment</p>
                </div>
              </div>
            </div>

            {/* About Text & CTA */}
            <div className="space-y-6">
              <p className="text-gray-300 leading-relaxed text-lg">
                I transform complex financial concepts into actionable insights that drive real results. As a content creator specializing in market analysis, cryptocurrency trends, and data science applications in finance, my approach combines rigorous technical analysis with clear, engaging explanations. Whether you&apos;re a beginner taking your first steps into investing or an experienced trader looking for fresh perspectives, my content bridges the gap between complex market dynamics and practical decision-making.
              </p>

              <a
                href="/book"
                className="bg-white text-[#0A0A0A] px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-all hover:scale-105 inline-block"
              >
                Book 1:1 Meeting
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative z-10 px-5 md:px-20 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-8 md:space-x-16 lg:space-x-24 opacity-70 flex-wrap gap-y-8">
            {/* Logo placeholders */}
            <div className="w-20 h-6 flex-shrink-0">
              <img src="https://placehold.co/90x24/ffffff/000000?text=TradingView" alt="TradingView" className="opacity-70 w-full h-full object-contain" />
            </div>
            <div className="w-24 h-8 flex-shrink-0">
              <img src="https://placehold.co/111x30/ffffff/000000?text=Bloomberg" alt="Bloomberg" className="opacity-70 w-full h-full object-contain" />
            </div>
            <div className="w-20 h-4 flex-shrink-0">
              <img src="https://placehold.co/102x16/ffffff/000000?text=Reuters" alt="Reuters" className="opacity-70 w-full h-full object-contain" />
            </div>
            <div className="w-20 h-6 flex-shrink-0">
              <img src="https://placehold.co/97x24/ffffff/000000?text=Yahoo" alt="Yahoo Finance" className="opacity-70 w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Latest Videos Section */}
      <section className="relative z-10 px-5 md:px-20 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">Latest Videos</h2>

          {/* Horizontal Scrolling Container */}
          <div className="flex overflow-x-auto space-x-5 scrollbar-hide snap-x snap-mandatory pb-4">
            {/* Video Card 1 */}
            <div className="flex-none w-80 bg-[#1F1F1F] rounded-2xl overflow-hidden snap-start hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gray-600 relative">
                <img src="https://placehold.co/320x180/1F1F1F/ffffff?text=Market+Analysis" alt="Market Analysis Video" className="w-full h-full object-cover" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-white">Market Analysis: Q4 Predictions</h3>
                <p className="text-sm text-gray-300">Deep dive into market trends and predictions for the upcoming quarter</p>
                <div className="mt-3 text-xs text-gray-400">12:45 • 2 weeks ago</div>
              </div>
            </div>

            {/* Video Card 2 */}
            <div className="flex-none w-80 bg-[#1F1F1F] rounded-2xl overflow-hidden snap-start hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gray-600 relative">
                <img src="https://placehold.co/320x180/1F1F1F/ffffff?text=Crypto+Strategy" alt="Crypto Strategy Video" className="w-full h-full object-cover" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-white">Crypto Portfolio Strategy</h3>
                <p className="text-sm text-gray-300">Building a diversified cryptocurrency portfolio for long-term growth</p>
                <div className="mt-3 text-xs text-gray-400">18:32 • 1 week ago</div>
              </div>
            </div>

            {/* Video Card 3 */}
            <div className="flex-none w-80 bg-[#1F1F1F] rounded-2xl overflow-hidden snap-start hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gray-600 relative">
                <img src="https://placehold.co/320x180/1F1F1F/ffffff?text=Data+Science" alt="Data Science Video" className="w-full h-full object-cover" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-white">Data Science in Trading</h3>
                <p className="text-sm text-gray-300">How to leverage data science techniques for better trading decisions</p>
                <div className="mt-3 text-xs text-gray-400">25:18 • 3 days ago</div>
              </div>
            </div>

            {/* Video Card 4 */}
            <div className="flex-none w-80 bg-[#1F1F1F] rounded-2xl overflow-hidden snap-start hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gray-600 relative">
                <img src="https://placehold.co/320x180/1F1F1F/ffffff?text=Beginner+Guide" alt="Beginner Guide Video" className="w-full h-full object-cover" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-white">Beginner&apos;s Guide to Stocks</h3>
                <p className="text-sm text-gray-300">Everything you need to know to start your investing journey</p>
                <div className="mt-3 text-xs text-gray-400">15:45 • 1 month ago</div>
              </div>
            </div>

            {/* Video Card 5 */}
            <div className="flex-none w-80 bg-[#1F1F1F] rounded-2xl overflow-hidden snap-start hover:scale-105 transition-transform duration-300">
              <div className="aspect-video bg-gray-600 relative">
                <img src="https://placehold.co/320x180/1F1F1F/ffffff?text=Technical+Analysis" alt="Technical Analysis Video" className="w-full h-full object-cover" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all cursor-pointer">
                    <div className="w-0 h-0 border-l-[12px] border-l-black border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-white">Technical Analysis Masterclass</h3>
                <p className="text-sm text-gray-300">Advanced charting techniques and pattern recognition</p>
                <div className="mt-3 text-xs text-gray-400">32:12 • 2 weeks ago</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <div className="px-5 md:px-20 py-16">
        <NewsletterSubscription />
      </div>
    </div>
  );
}

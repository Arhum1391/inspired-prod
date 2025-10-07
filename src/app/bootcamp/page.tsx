'use client';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { NewsletterSubscription } from '@/components';

export default function BootcampPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Vector Background SVG - Top Right Corner Only */}
      <div
        className="absolute z-0"
        style={{
          right: '-10px',

          opacity: 1,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/bootcamp bg.svg"
          alt="Bootcamp gradient background"
          width={900}
          height={700}
          className="w-full h-full"
          priority
        />
      </div>



      {/* Navigation Header */}
      <div className="relative z-10">
        <Navbar variant="hero" />
      </div>

      {/* Hero Section */}
      <section className="relative z-0 min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
        <div className="relative z-0 w-full px-4 sm:px-6 lg:px-6 pt-44 sm:pt-44 md:pt-48 lg:pt-56">
          <div className="mx-auto max-w-7xl">
            {/* Text Content - Frame 25 - Aligned with logo using same spacing, mobile adjusted for sidebar */}
            <div className="flex flex-col items-start gap-6 w-full max-w-[280px] min-[400px]:max-w-[343px] min-[500px]:max-w-[460px] min-[600px]:max-w-[560px] min-[700px]:max-w-[630px] md:w-full md:max-w-[630px] lg:ml-0">
              {/* Main Heading */}
              <h1 className="text-[32px] leading-[120%] min-[400px]:text-[36px] md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white w-full" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                Master AI, Finance & Tech Through Expert-Led Bootcamps
              </h1>

              {/* Subheading */}
              <p className="text-base leading-[130%] min-[400px]:text-[17px] md:text-base lg:text-lg text-white w-full" style={{fontFamily: 'Gilroy'}}>
                Intensive, hands-on learning programs designed to transform you into an industry-ready professional in weeks, not years.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamp Cards Section */}
      <section className="relative z-0 pt-32 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-7xl">
            {/* Cards Grid - 3 columns on desktop, 1 on mobile */}
            <div className="flex flex-col gap-5">

              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Card 1: Crypto Trading Bootcamp */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] left-[399px] top-[-326px] z-0 rotate-90"
                    style={{
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Title and Price */}
                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <h3 className="text-2xl text-white flex-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Crypto Trading Bootcamp</h3>
                    <span className="bg-[#0A0A0A] rounded-full px-3 py-2 text-xs text-white" style={{fontFamily: 'Gilroy', fontWeight: 500}}>30 BNB</span>
                  </div>

                  {/* Description */}
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>
                    Gain the skills to analyze crypto markets with confidence, manage risks like a pro, and apply proven trading strategies.
                  </p>

                  {/* Mentors */}
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors:</h4>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Adnan - Senior Marketing Analyst</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Assassin - Co-Founder, Inspired Analyst</p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 relative z-10">
                    <span className="border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] rounded-full px-2.5 py-1 text-xs text-[#05B0B3]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>6 Weeks</span>
                    <span className="border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] rounded-full px-2.5 py-1 text-xs text-[#DE50EC]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>Online</span>
                  </div>

                  {/* Registration Dates */}
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Registration Dates: 1st Oct, 2025 - 30th Oct, 2025</p>

                  {/* Buttons */}
                  <div className="flex gap-4 relative z-10">
                    <Link href="/bootcamp/crypto-trading" className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Learn More</Link>
                    <button className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Register Now</button>
                  </div>
                </div>

                {/* Card 2: AI & Data for Finance */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '365.45px',
                      top: '-359.87px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-172.95deg)',
                      borderRadius: '50%'
                    }}
                  />

                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <h3 className="text-2xl text-white flex-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>AI & Data for Finance</h3>
                    <span className="bg-[#0A0A0A] rounded-full px-3 py-2 text-xs text-white" style={{fontFamily: 'Gilroy', fontWeight: 500}}>30 BNB</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>
                    Explore the power of AI-driven trading, master data analysis techniques, and learn how to build automated systems.
                  </p>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors:</h4>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Hassan Tariq - Senior Crypto Analyst</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Hamza Ali - Risk Management Specialist</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Meower - Breakout Trading Specialist</p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <span className="border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] rounded-full px-2.5 py-1 text-xs text-[#05B0B3]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>4 Weeks</span>
                    <span className="border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] rounded-full px-2.5 py-1 text-xs text-[#DE50EC]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>Online</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Registration Dates: 1st Oct, 2025 - 30th Oct, 2025</p>
                  <div className="flex gap-4 relative z-10">
                    <button className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Learn More</button>
                    <button className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Register Now</button>
                  </div>
                </div>

                {/* Card 3: Forex Mastery Mentorship */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '367px',
                      top: '-359px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-96.58deg)',
                      borderRadius: '50%'
                    }}
                  />

                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <h3 className="text-2xl text-white flex-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Forex Mastery Mentorship</h3>
                    <span className="bg-[#0A0A0A] rounded-full px-3 py-2 text-xs text-white" style={{fontFamily: 'Gilroy', fontWeight: 500}}>30 BNB</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>
                    Learn the fundamentals of forex trading, develop the skills to read live charts with accuracy, and apply advanced strategies.
                  </p>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors:</h4>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Adnan - Senior Marketing Analyst</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Hassan Khan - Gold Trading Expert & Co-Founder</p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <span className="border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] rounded-full px-2.5 py-1 text-xs text-[#05B0B3]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>8 Weeks</span>
                    <span className="border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] rounded-full px-2.5 py-1 text-xs text-[#DE50EC]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>Online</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Registration Dates: 1st Oct, 2025 - 30th Oct, 2025</p>
                  <div className="flex gap-4 relative z-10">
                    <button className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Learn More</button>
                    <button className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Register Now</button>
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Card 4: Stock Market Investing Bootcamp */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] left-[399px] top-[-326px] z-0 rotate-90"
                    style={{
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      borderRadius: '50%'
                    }}
                  />

                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <h3 className="text-2xl text-white flex-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Stock Market Investing Bootcamp</h3>
                    <span className="bg-[#0A0A0A] rounded-full px-3 py-2 text-xs text-white" style={{fontFamily: 'Gilroy', fontWeight: 500}}>30 BNB</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>
                    Learn how to build and manage a strong investment portfolio, accurately value companies, and apply long-term wealth-building strategies.
                  </p>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors:</h4>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Mohid - Advanced ICT Mentor</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Assassin - Co-Founder, Inspired Analyst</p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <span className="border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] rounded-full px-2.5 py-1 text-xs text-[#05B0B3]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>6 Weeks</span>
                    <span className="border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] rounded-full px-2.5 py-1 text-xs text-[#DE50EC]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>Online</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Registration Dates: 1st Oct, 2025 - 30th Oct, 2025</p>
                  <div className="flex gap-4 relative z-10">
                    <button className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Learn More</button>
                    <button className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Register Now</button>
                  </div>
                </div>

                {/* Card 5: Web3 & Blockchain Mentorship */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '365.45px',
                      top: '-326px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-172.95deg)',
                      borderRadius: '50%'
                    }}
                  />

                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <h3 className="text-2xl text-white flex-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Web3 & Blockchain Mentorship</h3>
                    <span className="bg-[#0A0A0A] rounded-full px-3 py-2 text-xs text-white" style={{fontFamily: 'Gilroy', fontWeight: 500}}>30 BNB</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>
                    Take a deep dive into blockchain technology, understand the mechanics of smart contracts, and explore the world of decentralized finance (DeFi).
                  </p>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors:</h4>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>M. Usama - Multi-Asset Trader</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Meower - Breakout Trading Specialist</p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <span className="border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] rounded-full px-2.5 py-1 text-xs text-[#05B0B3]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>5 Weeks</span>
                    <span className="border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] rounded-full px-2.5 py-1 text-xs text-[#DE50EC]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>Online</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Registration Dates: 1st Oct, 2025 - 30th Oct, 2025</p>
                  <div className="flex gap-4 relative z-10">
                    <button className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Learn More</button>
                    <button className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Register Now</button>
                  </div>
                </div>

                {/* Card 6: Career Growth in Finance & Tech */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '367.25px',
                      top: '-357.75px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-96.58deg)',
                      borderRadius: '50%'
                    }}
                  />

                  <div className="flex items-start justify-between gap-6 relative z-10">
                    <h3 className="text-2xl text-white flex-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Career Growth in Finance & Tech</h3>
                    <span className="bg-[#0A0A0A] rounded-full px-3 py-2 text-xs text-white" style={{fontFamily: 'Gilroy', fontWeight: 500}}>30 BNB</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>
                    Receive personalized career guidance, professional resume reviews, and interview preparation directly from industry mentors.
                  </p>
                  <div className="flex flex-col gap-2 relative z-10">
                    <h4 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors:</h4>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Hamza Ali - Risk Management Specialist</p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>Mohid - Advanced ICT Mentor</p>
                  </div>
                  <div className="flex gap-2 relative z-10">
                    <span className="border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] rounded-full px-2.5 py-1 text-xs text-[#05B0B3]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>4 Weeks</span>
                    <span className="border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] rounded-full px-2.5 py-1 text-xs text-[#DE50EC]" style={{fontFamily: 'Gilroy', fontWeight: 500}}>Online</span>
                  </div>
                  <p className="text-base text-white leading-[130%] relative z-10" style={{fontFamily: 'Gilroy'}}>Registration Dates: 1st Oct, 2025 - 30th Oct, 2025</p>
                  <div className="flex gap-4 relative z-10">
                    <button className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Learn More</button>
                    <button className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Register Now</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Mentorship Section */}
      <section className="relative z-0 py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-12 sm:gap-16">
              {/* Section Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center max-w-4xl" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '130%'}}>
                Why Choose Our Mentorship?
              </h2>

              {/* Features Grid */}
              <div className="flex flex-col gap-5 w-full">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Personalized Roadmap */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4">
                    <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em'}}>
                      Personalized Roadmap
                    </h3>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 400}}>
                      Every learner has unique goals. Whether you want to become a profitable trader, a confident investor, a Web3 innovator, or grow your career in tech, we create a step-by-step mentorship plan tailored to your journey, skills, and aspirations.
                    </p>
                  </div>

                  {/* Hands-on Learning */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4">
                    <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                      Hands-on Learning
                    </h3>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 400}}>
                      Forget outdated theory. Our mentorship is built around real market case studies, live examples, and practical exercises so you can immediately apply what you learn. You&apos;ll gain not just knowledge, but the confidence to use it in real-world scenarios.
                    </p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Accountability & Guidance */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4">
                    <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                      Accountability & Guidance
                    </h3>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 400}}>
                      Success comes with consistency. Through weekly 1-on-1 check-ins, continuous feedback, and structured assignments, your mentor ensures you stay on track, overcome challenges, and make steady progress toward your goals.
                    </p>
                  </div>

                  {/* Proven Expertise */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4">
                    <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                      Proven Expertise
                    </h3>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 400}}>
                      Learn directly from Inspired Analyst experts with years of trading, investing, and data-driven experience. Our mentors have guided hundreds of learners and bring insider knowledge, strategies, and industry insights you won&apos;t find in standard courses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 sm:py-16 lg:py-20">
        <NewsletterSubscription />
      </div>

      <Footer />
    </div>
  );
}

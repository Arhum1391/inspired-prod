'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, Globe, Calendar, Award, BookOpen, TrendingUp, Target } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CryptoTradingBootcampPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Background Ellipse */}
      <div
        className="absolute z-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[588px] lg:h-[588px]"
        style={{
          right: '-150px',
          top: '-150px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(150px)',
          transform: 'rotate(96.22deg)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Navigation Header */}
      <div className="relative z-10">
        <Navbar variant="hero" />
      </div>

      {/* Hero Section */}
      <section className="relative z-0 pt-32 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24 xl:gap-28">
              {/* Left Content */}
              <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 flex-1 max-w-full lg:max-w-[630px]">
                {/* Text Content */}
                <div className="flex flex-col gap-6">
                  {/* Main Heading */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '120%'}}>
                    Crypto Trading Bootcamp
                  </h1>

                  {/* Subheading */}
                  <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 350}}>
                    Master cryptocurrency trading with proven strategies, technical analysis, and risk management. Transform from beginner to confident trader in just 6 weeks.
                  </p>

                  {/* Description Paragraph 1 */}
                  <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 350}}>
                    The Crypto Trading Bootcamp is designed for anyone who wants to confidently trade cryptocurrencies by combining technical analysis, market psychology, and practical strategies. Over 6 weeks, you&apos;ll learn how to read charts, identify trends, manage risks, and build a sustainable trading approach that suits your goals.
                  </p>

                  {/* Description Paragraph 2 */}
                  <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy', fontWeight: 350}}>
                    Unlike generic trading courses, this mentorship bootcamp is interactive and guided by a Senior Crypto Analyst with years of hands-on experience. You&apos;ll work on real market scenarios, case studies, and live examples — ensuring that you not only learn but also apply the strategies in real time.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="flex">
                  <button
                    onClick={() => router.push('/bootcamp/crypto-trading/register')}
                    className="bg-white rounded-full px-6 py-4 text-sm text-[#0A0A0A] hover:bg-gray-100 transition-colors"
                    style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}
                  >
                    Register Now - 30 BNB
                  </button>
                </div>
              </div>

              {/* Right Info Cards */}
              <div className="flex flex-col gap-5 w-full lg:w-126 lg:flex-none lg:justify-between">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Duration Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-6 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '140px',
                        top: '-200px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Clock className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-3 relative z-10">
                      <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                        6 Weeks
                      </h3>
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Duration
                      </p>
                    </div>
                  </div>

                  {/* Mode Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-6 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '140px',
                        top: '-200px',
                        background: 'linear-gradient(110.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Globe className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-3 relative z-10">
                      <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                        Online
                      </h3>
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Mode
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Interactive Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-6 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '140px',
                        top: '-200px',
                        background: 'linear-gradient(110.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-2 relative z-10">
                      <h3 className="text-lg text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                        Live Sessions
                      </h3>
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Interactive
                      </p>
                    </div>
                  </div>

                  {/* Certificate Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '140px',
                        top: '-200px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Award className="w-4 h-4 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-2 relative z-10">
                      <h3 className="text-lg text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                        Certificate
                      </h3>
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Completion
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Card */}
                <div className="bg-[#1F1F1F] rounded-2xl p-7 flex items-center justify-between gap-4 relative overflow-hidden">
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

                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[300px] h-[300px] z-0"
                    style={{
                      left: '400px',
                      top: '-200px',
                      background: 'linear-gradient(110.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(80px)',
                      transform: 'rotate(137.16deg)',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Text */}
                  <div className="flex flex-col gap-2 flex-1 relative z-10">
                    <h3 className="text-lg text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                      Registration Open
                    </h3>
                    <p className="text-sm text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                      1st Oct, 2025 - 30th Oct, 2025
                    </p>
                  </div>

                  {/* Indicator Dot */}
                  <div className="w-4 h-4 bg-white rounded-full relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Mentors Section */}
      <section className="relative z-0 py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-[846px]">
            <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-16">
              {/* Section Header */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                  Meet Your Mentors
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                  Learn from industry experts with proven track records
                </p>
              </div>

              {/* Mentor Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {/* Mentor Card 1 - Adnan */}
                <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col items-center gap-4 relative">
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

                  {/* Profile Image */}
                  <div className="w-16 h-16 rounded-full overflow-hidden relative z-10">
                    <Image
                      src="/team dark/Adnan.png"
                      alt="Adnan"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>

                  {/* Mentor Info */}
                  <div className="flex flex-col items-start gap-2 w-full relative z-10">
                    {/* Name */}
                    <h3 className="text-lg sm:text-xl text-white text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                      Adnan
                    </h3>

                    {/* Details */}
                    <div className="flex flex-col items-center gap-4 w-full">
                      {/* Title */}
                      <p className="text-sm text-[#909090] text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%'}}>
                        Senior Marketing Analyst
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[#909090] text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%'}}>
                        Content creator specializing in stocks, crypto, data science, and side hustles. Known for making complex financial concepts accessible with humor and real-world examples.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mentor Card 2 - Assassin */}
                <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col items-center gap-4 relative">
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

                  {/* Profile Image */}
                  <div className="w-16 h-16 rounded-full overflow-hidden relative z-10">
                    <Image
                      src="/team dark/Assassin.png"
                      alt="Assassin"
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>

                  {/* Mentor Info */}
                  <div className="flex flex-col items-start gap-2 w-full relative z-10">
                    {/* Name */}
                    <h3 className="text-lg sm:text-xl text-white text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                      Assassin
                    </h3>

                    {/* Details */}
                    <div className="flex flex-col items-center gap-4 w-full">
                      {/* Title */}
                      <p className="text-sm text-[#909090] text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%'}}>
                        Co-Founder, Inspired Analyst
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[#909090] text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%'}}>
                        Co-founder with deep expertise in Fibonacci retracements, ICT concepts, volume profiling, and institutional orderflow. Trading crypto since 2019.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="relative z-0 py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-[1064px]">
            <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16">
              {/* Section Header */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center max-w-[888px]" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '130%'}}>
                  What You&apos;ll Learn
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white text-center w-full" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%'}}>
                  Our comprehensive curriculum is designed to take you from beginner to advanced trader
                </p>
              </div>

              {/* Curriculum Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {/* Week 1-2: Crypto Fundamentals */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
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

                  {/* Background Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '285.45px',
                      top: '-359.87px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-172.95deg)',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start gap-4 relative z-10">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-sm text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Week 1-2
                      </p>
                      <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em'}}>
                        Crypto Fundamentals
                      </h3>
                    </div>
                  </div>

                  {/* List Items */}
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Blockchain technology basics
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Understanding market cycles
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Major cryptocurrencies overview
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Wallet security & setup
                      </p>
                    </div>
                  </div>
                </div>

                {/* Week 3-4: Technical Analysis */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
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

                  {/* Background Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '285.11px',
                      top: '-359.87px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-172.95deg)',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start gap-4 relative z-10">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-sm text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Week 3-4
                      </p>
                      <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em'}}>
                        Technical Analysis
                      </h3>
                    </div>
                  </div>

                  {/* List Items */}
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Chart patterns & indicators
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Support & resistance levels
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Volume & momentum studies
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Candlestick analysis
                      </p>
                    </div>
                  </div>
                </div>

                {/* Week 5-6: Advanced Strategies */}
                <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
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

                  {/* Background Ellipse */}
                  <div
                    className="absolute w-[588px] h-[588px] z-0"
                    style={{
                      left: '285.78px',
                      top: '-359.87px',
                      background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                      filter: 'blur(100px)',
                      transform: 'rotate(-172.95deg)',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Header */}
                  <div className="flex items-start gap-4 relative z-10">
                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-white" />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="text-sm text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Week 5-6
                      </p>
                      <h3 className="text-xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em'}}>
                        Advanced Strategies
                      </h3>
                    </div>
                  </div>

                  {/* List Items */}
                  <div className="flex flex-col gap-4 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Risk management techniques
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Portfolio diversification
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        DeFi & yield farming
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                      <p className="text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                        Trading psychology
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Join Section */}
      <section className="relative z-0 py-22 sm:py-26 lg:py-30">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-[1064px]">
            <div className="bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
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

              {/* Background Ellipse */}
              <div
                className="absolute w-[588px] h-[588px] z-0"
                style={{
                  right: '-180px',
                  top: '-456px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  borderRadius: '50%'
                }}
              />

              {/* Content */}
              <div className="flex flex-col gap-6 relative z-10">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white" style={{fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%'}}>
                  Who Should Join?
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%'}}>
                  This bootcamp is perfect for:
                </p>

                {/* List Items */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    <p className="text-sm sm:text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                      Beginners who want to enter the crypto trading world with confidence.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    <p className="text-sm sm:text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                      Traders who want to refine their strategies and avoid common mistakes.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                    <p className="text-sm sm:text-base text-white" style={{fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%'}}>
                      Investors looking to manage risk and grow their crypto portfolios.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter and Footer */}
     

      <Footer />
    </div>
  );
}

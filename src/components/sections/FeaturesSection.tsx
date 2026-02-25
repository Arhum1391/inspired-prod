'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const featuresData = [
  {
    href: "/research",
    icon: <Image src="/landing cards icons/Sparks--Streamline-Iconoir.svg" alt="Sparks" width={20} height={20} className="text-gray-400" />,
    title: 'Premium Research',
    description: 'Access exclusive market analysis and data-driven insights that go beyond surface-level trends. Our research combines technical analysis with fundamental metrics to identify high-probability opportunities before they become mainstream.',
    link: '/research',
  },
  {
    href: "/calculator",
    icon: <Image src="/landing cards icons/Calculator--Streamline-Iconoir.svg" alt="Calculator" width={20} height={20} className="text-gray-400" />,
    title: 'Position Sizing Calculator',
    description: 'Take the guesswork out of risk management with our proprietary calculator that determines optimal trade sizes. Never risk too much on a single position again - protect your capital while maximizing growth potential.',
    link: '/calculator',
  },
  {
    href: "/portfolio",
    icon: <Image src="/landing cards icons/User-Star--Streamline-Iconoir.svg" alt="User Star" width={20} height={20} className="text-gray-400" />,
    title: 'Portfolio',
    description: 'Get transparent access to real portfolio performance and trade rationale behind every decision. Learn from actual positions, wins, losses, and the strategic thinking that drives long-term wealth building.',
    link: '/portfolio',
  },
  {
    href: "/shariah",
    icon: <Image src="/landing cards icons/Bright-Crown--Streamline-Iconoir.svg" alt="Crown" width={20} height={20} className="text-gray-400" />,
    title: 'Shariah Projects',
    description: 'Discover halal investment opportunities that align with Islamic principles without compromising on returns. Comprehensive analysis of Shariah-compliant stocks, crypto projects, and alternative investments for the conscious Muslim investor.',
    link: '/shariah',
  },
];

interface FeatureCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  link: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index, link }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(link);
  };

  return (
    <div 
      onClick={handleClick}
      className="cursor-pointer bg-[#1F1F1F]/80 p-6 rounded-2xl border-2 border-transparent hover:border-gray-400/30 transition-all duration-300 w-full relative overflow-hidden group backdrop-blur-sm"
    >
    {/* CSS Ellipse Gradient - positioned for first card (top left) */}
    {index === 0 && (
      <>
        <div
          className="absolute rounded-2xl opacity-60 hidden md:block"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '489px',
            top: '-376px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(90deg)',
            zIndex: 2,
          }}
        />
        <div
          className="absolute rounded-2xl opacity-60 md:hidden"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '309px',
            top: '-376px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(90deg)',
            zIndex: 2,
          }}
        />
      </>
    )}

    {/* CSS Ellipse Gradient - positioned for second card (top right) */}
    {index === 1 && (
      <>
        <div
          className="absolute rounded-2xl opacity-60 hidden md:block"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '367.22px',
            top: '-497.78px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(135deg)',
            zIndex: 2,
          }}
        />
        <div
          className="absolute rounded-2xl opacity-60 md:hidden"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '187.22px',
            top: '-497.78px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(135deg)',
            zIndex: 2,
          }}
        />
      </>
    )}

    {/* CSS Ellipse Gradient - positioned for third card (bottom left) */}
    {index === 2 && (
      <>
        <div
          className="absolute rounded-2xl opacity-60 hidden md:block"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '422.92px',
            top: '-442.07px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(15deg)',
            zIndex: 2,
          }}
        />
        <div
          className="absolute rounded-2xl opacity-60 md:hidden"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '242.92px',
            top: '-442.07px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(15deg)',
            zIndex: 2,
          }}
        />
      </>
    )}

    {/* CSS Ellipse Gradient - positioned for fourth card (bottom right) */}
    {index === 3 && (
      <>
        <div
          className="absolute rounded-2xl opacity-60 hidden md:block"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '381.39px',
            top: '-483.61px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(-30deg)',
            zIndex: 2,
          }}
        />
        <div
          className="absolute rounded-2xl opacity-60 md:hidden"
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '381.39px',
            top: '-483.61px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(-30deg)',
            zIndex: 2,
          }}
        />
      </>
    )}

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
          background: 'rgba(31, 31, 31, 0.8)'
        }}
      ></div>
    </div>

    {/* Glint Effect */}
    <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

    {/* Content with relative positioning to appear above gradient */}
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4 md:mb-0">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-800 p-2 rounded-full w-10 h-10 flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>{title}</h3>
        </div>
      </div>
      <p className="text-gray-300 mt-4 text-sm sm:text-base flex-grow" style={{fontFamily: 'Gilroy', fontWeight: 400, fontSize: '18px', lineHeight: '130%', letterSpacing: '0%'}}>
        {description}
      </p>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className="text-white font-medium mt-6 flex items-center group text-sm sm:text-base" 
        style={{fontFamily: 'Gilroy', fontWeight: 600}}
      >
        Learn More
        <ArrowUpRight
          size={16}
          className="ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </button>
    </div>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative z-[1] bg-[#0A0A0A] px-2 sm:px-3 md:px-4 lg:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              href={feature.href}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
              link={feature.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
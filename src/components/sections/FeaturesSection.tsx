'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const featuresData = [
  {
    icon: <img src="/landing cards icons/Sparks--Streamline-Iconoir.svg" alt="Sparks" width={22} height={22} className="text-gray-400" />,
    title: 'Premium Research',
    description: 'Access exclusive market analysis and data-driven insights that go beyond surface-level trends. Our research combines technical analysis with fundamental metrics to identify high-probability opportunities before they become mainstream.',
  },
  {
    icon: <img src="/landing cards icons/Calculator--Streamline-Iconoir.svg" alt="Calculator" width={22} height={22} className="text-gray-400" />,
    title: 'Position Sizing Calculator',
    description: 'Take the guesswork out of risk management with our proprietary calculator that determines optimal trade sizes. Never risk too much on a single position again - protect your capital while maximizing growth potential.',
  },
  {
    icon: <img src="/landing cards icons/User-Star--Streamline-Iconoir.svg" alt="User Star" width={22} height={22} className="text-gray-400" />,
    title: 'Portfolio',
    description: 'Get transparent access to real portfolio performance and trade rationale behind every decision. Learn from actual positions, wins, losses, and the strategic thinking that drives long-term wealth building.',
  },
  {
    icon: <img src="/landing cards icons/Bright-Crown--Streamline-Iconoir.svg" alt="Crown" width={22} height={22} className="text-gray-400" />,
    title: 'Shariah Projects',
    description: 'Discover halal investment opportunities that align with Islamic principles without compromising on returns. Comprehensive analysis of Shariah-compliant stocks, crypto projects, and alternative investments for the conscious Muslim investor.',
  },
];

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, index }) => {
  return (
    <div className="cursor-pointer bg-gray-800/50 p-6 rounded-2xl border-2 border-transparent hover:border-gray-400/30 transition-all duration-300 w-full relative overflow-hidden group">
    {/* CSS Ellipse Gradient - positioned for first card (top left) */}
    {index === 0 && (
      <div
        className="absolute rounded-2xl opacity-60"
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
    )}

    {/* CSS Ellipse Gradient - positioned for second card (top right) */}
    {index === 1 && (
      <div
        className="absolute rounded-2xl opacity-60"
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
    )}

    {/* CSS Ellipse Gradient - positioned for fourth card (bottom right) */}
    {index === 3 && (
      <div
        className="absolute rounded-2xl opacity-60"
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
    )}

    {/* CSS Ellipse Gradient - positioned for third card (bottom left) */}
    {index === 2 && (
      <div
        className="absolute rounded-2xl opacity-60"
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
    )}

    {/* Glint Effect */}
    <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>

    {/* Content with relative positioning to appear above gradient */}
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gray-800 p-2 rounded-lg">
            {icon}
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-white" style={{fontFamily: 'Gilroy', fontWeight: 600}}>{title}</h3>
        </div>
        <span className="bg-gray-800 text-gray-400 text-xs font-medium px-3 py-1 rounded-full" style={{fontFamily: 'Gilroy', fontWeight: 400}}>
          Coming Soon
        </span>
      </div>
      <p className="text-gray-300 mt-4 text-sm sm:text-base flex-grow" style={{fontFamily: 'Gilroy', fontWeight: 400, fontSize: '18px', lineHeight: '130%', letterSpacing: '0%'}}>
        {description}
      </p>
      <a href="#" className="text-white font-medium mt-6 flex items-center group text-sm sm:text-base" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
        Learn More
        <ArrowUpRight
          size={16}
          className="ml-1 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
        />
      </a>
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
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
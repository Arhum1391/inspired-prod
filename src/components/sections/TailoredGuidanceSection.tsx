'use client';

import React, { useState, useRef } from 'react';


const TailoredGuidanceSection = () => {
  // --- Calendar Data for September 2025 ---
  const year = 2025;
  const monthName = "September";
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];


  // Cursor effect state
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <section className="relative z-10 px-2 sm:px-3 md:px-4 lg:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        {/* Main Component Container - Clickable */}
        <a
          href="/meetings"
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="block relative p-6 sm:p-8 md:p-12 w-full text-white rounded-xl transition-transform duration-300 hover:scale-[1.005]"
          style={{ cursor: isHovering ? 'none' : 'pointer' }}
        >

          {/* Floating "Book a 1v1 Call" Button */}
          <span
            className="absolute bg-white text-[#0A0A0A] px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-50 pointer-events-none"
            style={{
              fontFamily: 'Gilroy',
              fontWeight: 600,
              left: isHovering ? `${cursorPosition.x}px` : 'auto',
              top: isHovering ? `${cursorPosition.y}px` : 'auto',
              right: isHovering ? 'auto' : '1rem',
              transform: isHovering ? 'translate(-50%, -50%)' : 'translateY(-1.25rem) rotate(-4deg)',
              transition: isHovering ? 'none' : 'all 0.3s ease',
              opacity: isHovering ? 1 : 1,
              whiteSpace: 'nowrap'
            }}
          >
            Book Mentorship
          </span>

          {/* Header Section */}
          <div className="mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold flex items-center justify-center flex-wrap gap-2 sm:gap-4 text-center" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
              <span>Prefer</span>
              {/* Tilted Image - Responsive based on 94x58 dimensions */}
              <div className="mx-2 sm:mx-4">
                <img
                  src="/Rectangle 50 (1).png" // You'll provide the source later
                  alt="Tilted decoration"
                  className="w-16 sm:w-20 md:w-24 h-10 sm:h-12 md:h-14 rounded-lg transform -rotate-6 transition-transform duration-300 hover:-rotate-3 object-cover"
                  style={{
                    aspectRatio: '94/58' // Maintains the exact ratio from your CSS
                  }}
                />
              </div>
              <span>Tailored Guidance?</span>
            </h2>
            <p className="text-gray-300 mt-4 sm:mt-6 max-w-4xl mx-auto leading-relaxed text-sm sm:text-base text-center" style={{fontFamily: 'Gilroy'}}>
              Get personalized support through a 1:1 session - whether you&apos;re exploring your first investment or refining advanced strategies. Book a meeting and get advice tailored to your goals.
            </p>
          </div>

          {/* New Calendar Section */}
          <div
            className="rounded-3xl sm:p-1 lg:p-2 mx-4 sm:mx-12 md:mx-16 lg:mx-24 relative"
            style={{
              border: '2px solid transparent',
              background: `
                linear-gradient(#0A0A0A, #0A0A0A) padding-box,
                linear-gradient(180deg, rgba(128, 128, 128, 0.3) 0%, rgba(128, 128, 128, 0.2) 30%, rgba(64, 64, 64, 0.1) 60%, rgba(10, 10, 10, 0) 80%) border-box
              `
            }}
          >
            

            {/* Calendar Card Container */}
            <div
              className="rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, #3A3A3A 0%, #2A2A2A 20%, #1A1A1A 40%, #151515 60%, #101010 80%, #0A0A0A 100%)'
              }}
            >

              {/* Calendar Header */}
              <div className="flex items-center space-x-4 mb-4 sm:mb-6 z-10 relative">
                <h2 className="font-semibold text-base sm:text-lg text-gray-100" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                  {monthName}, {year}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span className="text-gray-400 text-xs sm:text-sm font-medium" style={{fontFamily: 'Gilroy'}}>Schedule a call</span>
                </div>
              </div>

              {/* Calendar Grid Container */}
              <div className="relative">
                <div className="space-y-3 sm:space-y-4">
                  {/* Days of the week */}
                  <div className="grid grid-cols-7 text-center text-xs text-gray-500 font-semibold">
                    {daysOfWeek.map(day => (
                      <span key={day} style={{fontFamily: 'Gilroy', fontWeight: 600}}>{day}</span>
                    ))}
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-7 text-center text-sm gap-y-2 sm:gap-y-3">
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>1</span>
                    <span className="bg-[#1A1A1A] rounded-lg flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mx-auto cursor-pointer font-semibold hover:bg-[#2A2A2A] transition-colors" style={{fontFamily: 'Gilroy'}}>2</span>
                    <span className="bg-[#1A1A1A] rounded-lg flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mx-auto cursor-pointer font-semibold hover:bg-[#2A2A2A] transition-colors" style={{fontFamily: 'Gilroy'}}>3</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>4</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>5</span>
                    <span className="bg-[#1A1A1A] rounded-lg flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mx-auto cursor-pointer font-semibold hover:bg-[#2A2A2A] transition-colors" style={{fontFamily: 'Gilroy'}}>6</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>7</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>8</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>9</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>10</span>
                    <span className="bg-[#1A1A1A] rounded-lg flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mx-auto cursor-pointer font-semibold hover:bg-[#2A2A2A] transition-colors" style={{fontFamily: 'Gilroy'}}>11</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>12</span>
                    <span className="bg-[#1A1A1A] rounded-lg flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 mx-auto cursor-pointer font-semibold hover:bg-[#2A2A2A] transition-colors" style={{fontFamily: 'Gilroy'}}>13</span>
                    <span className="text-gray-600 font-medium" style={{fontFamily: 'Gilroy'}}>14</span>
                  </div>
                </div>

                {/* Enhanced Blur Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-t from-[#0A0A0A]/60 via-[#0A0A0A]/30 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default TailoredGuidanceSection;
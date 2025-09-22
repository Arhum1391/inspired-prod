'use client';

import React from 'react';

const TailoredGuidanceSection = () => {
  // --- Calendar Data for September 2025 ---
  const year = 2025;
  const month = 8; // In JavaScript's Date, months are 0-indexed (0=Jan, 8=Sep)
  const monthName = "September";
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  // These are the highlighted, available dates
  const availableDates = [2, 3, 6, 11, 13];

  // --- Calendar Logic ---
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  // Add empty cells for the days before the month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add the actual days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <section className="relative z-10 px-2 sm:px-3 md:px-4 lg:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Main Component Container */}
        <div className="relative p-6 sm:p-8 md:p-12 w-full text-white">

          {/* Floating "Book a 1v1 Call" Button */}
          <a
            href="/book"
            className="absolute -top-3 sm:-top-4 lg:-top-5 right-4 sm:right-6 lg:right-8 bg-white text-[#0A0A0A] px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 transform -rotate-4 hover:-rotate-2 hover:scale-105"
            style={{fontFamily: 'Gilroy', fontWeight: 600}}
          >
            Book a 1v1 Call
          </a>

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
            <p className="text-gray-300 mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base text-center" style={{fontFamily: 'Gilroy'}}>
              Get personalized support through a 1:1 session - whether you're exploring your first investment or refining advanced strategies. Book a meeting and get advice tailored to your goals.
            </p>
          </div>

          {/* Calendar Section */}
          <div
            className="p-4 sm:p-6 rounded-xl"
            style={{
              border: '1px solid transparent',
              background: `
                transparent padding-box,
                linear-gradient(180deg, #404040 0%, #0A0A0A 50.21%) border-box
              `,
              backgroundColor: '#2A2A2A'
            }}
          >
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
              <p className="font-semibold text-base sm:text-lg flex items-center" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                {monthName}, {year}
                <span className="ml-2 sm:ml-3 w-2 h-2 rounded-full bg-green-500"></span>
              </p>
              <a href="/book" className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1" style={{fontFamily: 'Gilroy'}}>
                Schedule a call
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-2 sm:gap-y-3 text-center">
              {/* Days of the week headers */}
              {daysOfWeek.map(day => (
                <div key={day} className="text-xs font-semibold text-gray-500 tracking-wider py-1" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                  {day}
                </div>
              ))}

              {/* Calendar day numbers */}
              {calendarDays.map((day, index) => {
                const isAvailable = day && availableDates.includes(day);
                const isPlaceholder = day === null;

                return (
                  <div
                    key={index}
                    className={`
                      w-8 sm:w-10 h-8 sm:h-10 mx-auto flex items-center justify-center rounded-full transition-colors duration-200 text-sm
                      ${isPlaceholder ? 'cursor-default' : ''}
                      ${isAvailable
                        ? 'bg-gray-600 hover:bg-gray-500 cursor-pointer'
                        : 'text-gray-500 cursor-not-allowed'}
                    `}
                    style={{fontFamily: 'Gilroy', fontWeight: 500}}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TailoredGuidanceSection;
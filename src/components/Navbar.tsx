'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const Navbar = () => {
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
    <div className="relative z-20 w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo with Vector.png */}
        <div className="flex items-center">
          <div className="w-32 sm:w-36 lg:w-44 h-6 sm:h-7 lg:h-9 rounded flex items-center justify-center px-2">
            <Image
              src="/Vector.svg"
              alt="Inspired Analyst Logo"
              width={120}
              height={22}
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

        {/* CTA Button */}
        <div className="flex items-center">
          <a
            href="/meetings"
            className="bg-white text-[#0A0A0A] px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            <span className="hidden sm:inline">Book 1:1 Meeting</span>
            <span className="sm:hidden">Book Call</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

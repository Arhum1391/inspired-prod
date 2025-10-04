'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  variant?: 'default' | 'hero';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Different padding based on variant
  const paddingClass = variant === 'hero'
    ? "py-1 sm:py-2"
    : "py-3 sm:py-4";

  return (
    <div className={`relative z-20 w-full px-3 sm:px-4 lg:px-6 mt-4 ${paddingClass}`}>
      {/* Mobile Layout - Toggle and Logo left, Button right */}
      <div className="lg:hidden max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Hamburger Menu & Logo - Left */}
        <div className="flex items-center gap-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Mobile Sidebar - Full height slide-in */}
          {isMobileMenuOpen && (
            <>
              {/* Overlay with Backdrop Blur */}
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>

              {/* Sidebar */}
              <div className="fixed top-0 left-0 h-screen w-[253px] bg-[#1F1F1F] z-50 flex flex-col shadow-2xl">
                {/* Logo Section */}
                <div className="px-6 pt-8 pb-6">
                  <div className="flex items-center">
                    <Link 
                        href="/" 
                        className="hover:opacity-80 transition-opacity outline-none focus:outline-none" 
                        style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Image
                        src="/sidebar logo.svg"
                        alt="Inspired Analyst Logo"
                        width={120}
                        height={40}
                        className="w-auto h-auto object-contain"
                        priority
                      />
                    </Link>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6">
                  <div className="flex flex-col gap-2">
                    <a
                      href="#"
                      className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Research
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Calculator
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Portfolio
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Shariah
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Our Team
                    </a>
                    <Link
                      href="/bootcamp"
                      className={`flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors ${
                        isActive('/bootcamp') ? 'bg-[#667EEA]' : 'hover:bg-gray-700'
                      }`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Bootcamp
                    </Link>
                  </div>
                </nav>
              </div>
            </>
          )}

          {/* Logo - Next to toggle button */}
          <Link 
              href="/" 
              className="w-28 sm:w-32 h-6 sm:h-6 rounded flex items-center justify-center hover:opacity-80 transition-opacity outline-none focus:outline-none" 
              style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            <Image
              src="/logo/navlogo-mob.svg"
              alt="Inspired Analyst Logo"
              width={120}
              height={24}
              className="w-full h-6 object-contain"
              priority
            />
          </Link>
        </div>

        {/* CTA Button - Right */}
        <div className="flex items-center">
          <a
            href="/meetings"
            className="bg-white text-[#0A0A0A] px-4 sm:px-3 py-2 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap h-6 flex items-center"
          >
            Book Mentorship
          </a>
        </div>
      </div>

      {/* Desktop Layout - Original */}
      <div className="hidden lg:flex max-w-7xl mx-auto items-center justify-between">
        {/* Logo with Vector.svg */}
        <div className="flex items-center">
          <Link 
              href="/" 
              className="w-44 h-9 rounded flex items-center justify-center px-2 hover:opacity-80 transition-opacity outline-none focus:outline-none" 
              style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            <Image
              src="/Vector.svg"
              alt="Inspired Analyst Logo"
              width={120}
              height={22}
              className="w-full h-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Navigation - Desktop */}
        <nav className="flex items-center relative">
          <div className="flex items-center space-x-4 xl:space-x-6">
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
            <Link
              href="/bootcamp"
              className={`text-xs sm:text-sm font-medium transition-colors ${
                isActive('/bootcamp') ? 'text-[#667EEA]' : 'text-white hover:text-gray-300'
              }`}
            >
              Bootcamp
            </Link>
          </div>
        </nav>

        {/* CTA Button */}
        <div className="flex items-center">
          <a
            href="/meetings"
            className="bg-white text-[#0A0A0A] px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Book Mentorship
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

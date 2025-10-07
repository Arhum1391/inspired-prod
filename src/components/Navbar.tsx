'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps {
  variant?: 'default' | 'hero';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  // Handle navigation to section - works from any page
  const handleSectionClick = (sectionId: string) => {
    if (pathname === '/') {
      // Already on homepage, just scroll
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // On another page, navigate to homepage with hash
      router.push(`/#${sectionId}`);
    }
  };

  // Handle scroll on page load if there's a hash
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash && pathname === '/') {
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [pathname]);

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
    ? "py-2 sm:py-2"
    : "py-3 sm:py-4";

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-[9999] w-full px-3 sm:px-4 lg:px-6 ${paddingClass}`}
        style={{
          background: 'linear-gradient(180deg, #0A0A0A 0%, rgba(10, 10, 10, 0.2) 80%, rgba(10, 10, 10, 0) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Mobile Layout - Toggle and Logo left, Button right */}
        <div className="lg:hidden max-w-7xl mx-auto flex items-center justify-between">
          {/* Mobile Hamburger Menu & Logo - Left */}
          <div className="flex items-center gap-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 transition-colors active:outline-none"
              aria-label="Toggle mobile menu"
              style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Logo - Next to toggle button */}
            <Link
                href="/"
                className="w-28 sm:w-32 h-7 sm:h-6 rounded flex items-center justify-center hover:opacity-80 transition-opacity outline-none focus:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
            >
              <Image
                src="/logo/navlogo-mob.svg"
                alt="Inspired Analyst Logo"
                width={120}
                height={28}
                className="w-full h-7 object-contain"
                priority
              />
            </Link>
          </div>

          {/* CTA Button - Right */}
          <div className="flex items-center">
            <a
              href="/meetings"
              className="bg-white text-[#0A0A0A] px-4 sm:px-3 py-2.5 sm:py-2 rounded-full text-xs sm:text-xs font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap h-9 sm:h-6 flex items-center"
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
              <button
                className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => handleSectionClick('about')}
              >
                About
              </button>
              <button
                className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => handleSectionClick('latest-videos')}
              >
                Latest Video
              </button>
              <button
                className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => handleSectionClick('social-stats')}
              >
                Community
              </button>
              <button
                className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => handleSectionClick('partners')}
              >
                Our Partner
              </button>
              <button
                className="text-xs sm:text-sm font-medium text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                onClick={() => handleSectionClick('collaboration')}
              >
                Contact Us
              </button>
              <Link
                href="/bootcamp"
                className={`text-xs sm:text-sm font-medium transition-colors focus:outline-none active:outline-none ${
                  isActive('/bootcamp') ? 'text-[#667EEA]' : 'text-white hover:text-gray-300'
                }`}
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
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

      {/* Mobile Sidebar - Rendered outside navbar container */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay with Backdrop Blur */}
          <div
            className="fixed inset-0 bg-black/60 lg:hidden"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 10000
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full min-h-screen w-[253px] bg-[#1F1F1F] lg:hidden flex flex-col shadow-2xl" style={{ zIndex: 10001 }}>
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
                <button
                  className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none"
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('about');
                  }}
                >
                  About
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none"
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('latest-videos');
                  }}
                >
                  Latest Video
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none"
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('social-stats');
                  }}
                >
                  Community
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none"
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('partners');
                  }}
                >
                  Our Partner
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none"
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('collaboration');
                  }}
                >
                  Contact Us
                </button>
                <Link
                  href="/bootcamp"
                  className={`flex items-center justify-start px-3 py-3 text-sm text-white rounded-lg transition-colors focus:outline-none active:outline-none ${
                    isActive('/bootcamp') ? 'bg-[#667EEA]' : 'hover:bg-gray-700'
                  }`}
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent' }}
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
    </>
  );
};

export default Navbar;

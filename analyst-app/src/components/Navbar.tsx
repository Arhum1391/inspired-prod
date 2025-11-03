'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';

interface NavbarProps {
  variant?: 'default' | 'hero';
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Handle mobile viewport height for Safari
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  // Different padding based on variant - consistent mobile padding
  const paddingClass = variant === 'hero'
    ? "py-4 sm:py-4"
    : "py-4 sm:py-5";

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-[9999] w-full px-3 sm:px-4 lg:px-6 ${paddingClass} transition-all duration-300`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(180deg, #0A0A0A 0%, rgba(10, 10, 10, 0.2) 80%, rgba(10, 10, 10, 0) 100%)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none'
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
                  style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
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
                className="w-28 sm:w-32 h-8 flex items-center justify-center hover:opacity-80 transition-opacity outline-none focus:outline-none ml-2"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '500' }}
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

          {/* CTA Buttons - Right */}
          <div className="flex items-center gap-3">
            <a
              href="/meetings"
              className="bg-white text-[#0A0A0A] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors whitespace-nowrap h-[38px] flex items-center justify-center w-[140px]"
            >
              Book Mentorship
            </a>
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <a
                href="/signin"
                className="border border-white text-white px-4 py-3 rounded-full text-sm hover:bg-white/10 transition-colors whitespace-nowrap h-[38px] flex items-center justify-center w-[88px]"
                style={{ fontWeight: '600' }}
              >
                Sign In
              </a>
            )}
          </div>
        </div>

        {/* Desktop Layout - Original */}
        <div className="hidden lg:flex max-w-7xl mx-auto items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
                href="/"
                className="w-44 h-9 rounded flex items-center justify-center px-2 hover:opacity-80 transition-opacity outline-none focus:outline-none"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
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
            <div className="flex items-center gap-6">
              <button
                className="text-base font-normal text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                onClick={() => handleSectionClick('research')}
              >
                Research
              </button>
              <button
                className="text-base font-normal text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                onClick={() => handleSectionClick('calculator')}
              >
                Calculator
              </button>
              <button
                className="text-base font-normal text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                onClick={() => handleSectionClick('portfolio')}
              >
                Portfolio
              </button>
              <button
                className="text-base font-normal text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                onClick={() => handleSectionClick('shariah')}
              >
                Shariah
              </button>
              <button
                className="text-base font-normal text-white hover:text-gray-300 transition-colors cursor-pointer focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                onClick={() => handleSectionClick('about')}
              >
                About Us
              </button>
              <Link
                href="/bootcamp"
                className={`text-base font-normal transition-colors focus:outline-none active:outline-none gilroy-medium ${
                  isActive('/bootcamp') ? 'text-[#667EEA]' : 'text-white hover:text-gray-300'
                }`}
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
              >
                Bootcamp
              </Link>
            </div>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/meetings"
              className="font-normal"
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px 16px',
                gap: '10px',
                width: '140px',
                height: '38px',
                background: '#FFFFFF',
                borderRadius: '100px',
                color: '#0A0A0A',
                fontSize: '14px',
                lineHeight: '100%',
                textAlign: 'center',
                fontFamily: 'inherit',
                textDecoration: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              Book Mentorship
            </a>
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <a
                href="/signin"
                className="border border-white text-white px-4 py-3 rounded-full text-sm font-normal hover:bg-white/10 transition-colors h-[38px] flex items-center justify-center w-[88px]"
                style={{ fontWeight: '600' }}
              >
                Sign In
              </a>
            )}
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
          <div className="fixed top-0 left-0 w-[253px] bg-[#1F1F1F] lg:hidden flex flex-col shadow-2xl" style={{ 
            zIndex: 10001,
            height: 'calc(var(--vh, 1vh) * 100)',
            minHeight: '100vh'
          }}>
            {/* Logo Section */}
            <div className="px-6 pt-8 pb-6">
              <div className="flex items-center">
                <Link
                    href="/"
                    className="hover:opacity-80 transition-opacity outline-none focus:outline-none"
                    style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
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
                  className="flex items-center justify-start px-3 py-3 text-base font-normal text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('research');
                  }}
                >
                  Research
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-base font-normal text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('calculator');
                  }}
                >
                  Calculator
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-base font-normal text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('portfolio');
                  }}
                >
                  Portfolio
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-base font-normal text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('shariah');
                  }}
                >
                  Shariah
                </button>
                <button
                  className="flex items-center justify-start px-3 py-3 text-base font-normal text-white rounded-lg transition-colors hover:bg-gray-700 focus:outline-none active:outline-none gilroy-medium"
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSectionClick('about');
                  }}
                >
                  About Us
                </button>
                <Link
                  href="/bootcamp"
                  className={`flex items-center justify-start px-3 py-3 text-base font-normal text-white rounded-lg transition-colors focus:outline-none active:outline-none gilroy-medium ${
                    isActive('/bootcamp') ? 'bg-[#667EEA]' : 'hover:bg-gray-700'
                  }`}
                style={{ outline: 'none', WebkitTapHighlightColor: 'transparent', fontWeight: '400', fontSize: '16px' }}
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

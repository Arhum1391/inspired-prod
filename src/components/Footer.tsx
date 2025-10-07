import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="px-2 sm:px-4 md:px-6 lg:px-10 py-12 sm:py-14 lg:py-16 pb-6 sm:pb-8 lg:pb-10">
      <div className="max-w-7xl mx-auto">
        <footer className="footer-container relative bg-[#141414] rounded-2xl p-10 overflow-hidden">
          {/* Curved Gradient Border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '16px',
              background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0) 100%)',
              padding: '2px'
            }}
          >
            <div
              className="w-full h-full rounded-[14px]"
              style={{
                background: '#141414'
              }}
            ></div>
          </div>
          {/* Footer SVG Background with Enhanced Colors */}
          <div
            className="absolute inset-0 w-full h-full opacity-100 z-0 p-12"
            style={{
              backgroundImage: 'url("/footer stroke.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'hue-rotate(5deg) saturate(1) brightness(1)'
            }}
          ></div>

          {/* Content */}
          <div className="relative z-30 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Section: Inspired Analyst */}
        <div className="flex flex-col">
          <div className="flex items-center mb-4">
            {/* Logo with colored overlay */}
            <div className="relative w-6 h-6" style={{ isolation: 'isolate' }}>
              <Image
                src="/footer logo.svg"
                alt="Inspired Analyst Logo"
                width={36}
                height={36}
                className="absolute inset-0 z-10 w-full h-full object-contain"
              />
              {/* Color overlay - only affects the logo */}
              
            </div>
            <span className="text-2xl font-bold">Inspired Analyst</span>
          </div>
          <p className="text-gray-300  max-w-sm mb-6 font-[400]">
            I simplify stocks, crypto, and data science with humor and clarity. My content turns complex ideas into practical tips-helping you stand out, level up, and crush your goals, without the boring jargon.
          </p>
          <div className="flex space-x-3 relative z-30 pr-5">
            <Link href="https://x.com/inspirdanalyst" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
            </Link>
            <Link href="https://www.tiktok.com/@inspiredanalyst" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </div>
            </Link>
            <Link href="https://www.facebook.com/inspiredanalyst/" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <Image
                  src="/social logos/fb.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
            </Link>
            <Link href="https://instagram.com/inspiredanalyst/" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
            </Link>
            <Link href="https://www.youtube.com/c/inspiredanalyst" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
            </Link>
            <Link href="https://www.linkedin.com/in/inspiredanalyst" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <Image
                  src="/social logos/Linkedin-Logo--Streamline-Logos.svg"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
            </Link>
            <Link href="https://discord.com/invite/inspiredanalyst" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
            </Link>
            <Link href="https://inspiredanalyst.substack.com/" target="_blank" rel="noopener noreferrer">
              <div className="social-icon-box">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                </svg>
              </div>
            </Link>
          </div>

          {/* Divider line for mobile - below social icons */}
          <div className="block md:hidden mt-4 border-t border-gray-600"></div>
        </div>

        {/* Right Section: General Links */}
        <div className="mt-2 md:mt-0">
          <h3 className="text-xl font-semibold ">General</h3>
          <ul className="space-y-1">
            <li><Link href="/research"><span className="text-gray-300 hover:text-white transition-colors duration-200">Research</span></Link></li>
            <li><Link href="/calculator"><span className="text-gray-300 hover:text-white transition-colors duration-200">Calculator</span></Link></li>
            <li><Link href="/portfolio"><span className="text-gray-300 hover:text-white transition-colors duration-200">Portfolio</span></Link></li>
            <li><Link href="/shariah"><span className="text-gray-300 hover:text-white transition-colors duration-200">Shariah</span></Link></li>
            <li><Link href="/our-team"><span className="text-gray-300 hover:text-white transition-colors duration-200">Our Team</span></Link></li>
            <li><Link href="/bootcamp"><span className="text-gray-300 hover:text-white transition-colors duration-200">Bootcamp</span></Link></li>
          </ul>
        </div>
          </div>

          {/* Bottom Section: Copyright */}
          <div className="relative z-30 mt-6 pt-4 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <p className="text-gray-400 text-sm">
                © 2025 Inspired Analyst. All rights reserved.
              </p>
              <div className="flex flex-row space-x-6 mt-2 sm:mt-0">
                <Link href="/privacy"><span className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Privacy Policy</span></Link>
                <Link href="/terms"><span className="text-gray-400 hover:text-white transition-colors duration-200 text-sm">Terms & Condition</span></Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
'use client';

import { useState } from 'react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Comprehensive email validation
  const validateEmail = (email: string): boolean => {
    // Remove whitespace and convert to lowercase
    const cleanEmail = email.trim().toLowerCase();

    // Check for exactly one @ symbol
    const atCount = (cleanEmail.match(/@/g) || []).length;
    if (atCount !== 1) return false;

    // Split email into local and domain parts
    const [localPart, domainPart] = cleanEmail.split('@');

    // Validate local part (before @) - only allow alphanumeric, dots, and hyphens
    if (!localPart || localPart.length === 0 || localPart.length > 64) return false;

    // Strict character validation for local part - only letters, numbers, dots, and hyphens
    const localPartRegex = /^[a-zA-Z0-9.-]+$/;
    if (!localPartRegex.test(localPart)) return false;

    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.startsWith('-') || localPart.endsWith('-')) return false;
    if (localPart.includes('..') || localPart.includes('--')) return false;

    // Validate domain part (after @)
    if (!domainPart || domainPart.length === 0 || domainPart.length > 253) return false;

    // Strict character validation for domain part - only letters, numbers, dots, and hyphens
    const domainPartRegex = /^[a-zA-Z0-9.-]+$/;
    if (!domainPartRegex.test(domainPart)) return false;

    if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
    if (domainPart.startsWith('-') || domainPart.endsWith('-')) return false;
    if (domainPart.includes('..') || domainPart.includes('--')) return false;

    // Check for valid top-level domains and common email providers
    const validDomains = [
      // Top email providers
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
      'protonmail.com', 'aol.com', 'live.com', 'msn.com', 'mail.com',

      // Business/Professional domains
      'company.com', 'business.com', 'work.com', 'office.com',

      // Country-specific popular domains
      'yahoo.co.uk', 'btinternet.com', 'googlemail.com', 'me.com',
      'mac.com', 'ymail.com', 'rocketmail.com', 'att.net', 'verizon.net',
      'comcast.net', 'charter.net', 'cox.net', 'earthlink.net',

      // International domains
      'mail.ru', 'yandex.com', 'qq.com', '163.com', 'sina.com',
      'naver.com', 'daum.net', 'gmx.com', 'web.de', 'orange.fr',
      'laposte.net', 'free.fr', 'libero.it', 'alice.it', 'tin.it'
    ];

    // Check if domain matches known providers or has valid TLD
    const domainLower = domainPart.toLowerCase();
    const isKnownProvider = validDomains.includes(domainLower);

    // If not a known provider, check if it has a valid TLD structure
    if (!isKnownProvider) {
      const domainParts = domainLower.split('.');
      if (domainParts.length < 2) return false;

      const tld = domainParts[domainParts.length - 1];
      const validTLDs = [
        'com', 'org', 'net', 'edu', 'gov', 'mil', 'int', 'co', 'io', 'ai',
        'uk', 'ca', 'au', 'de', 'fr', 'jp', 'cn', 'in', 'br', 'mx',
        'info', 'biz', 'name', 'pro', 'mobi', 'tel', 'travel', 'jobs',
        'museum', 'coop', 'aero', 'asia', 'cat', 'post', 'xxx'
      ];

      if (!validTLDs.includes(tld)) return false;

      // Check domain name part (before TLD)
      const domainName = domainParts[domainParts.length - 2];
      if (!domainName || domainName.length === 0) return false;
    }

    // Additional security checks for invalid patterns
    const invalidPatterns = [
      /[@]{2,}/, // Multiple @ symbols
      /[^a-zA-Z0-9@.-]/, // Invalid characters anywhere in email
      /^[@.-]/, // Starting with @, dot, or hyphen
      /[@.-]$/, // Ending with @, dot, or hyphen (except dot before TLD)
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(cleanEmail)) return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address from a recognized provider (e.g., Gmail, Yahoo, Outlook)');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Successfully subscribed to our newsletter!');
        setEmail(''); // Clear the form
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="newsletter-container relative bg-[#1F1F1F] rounded-2xl p-10 overflow-hidden">
        {/* CSS Ellipse Background */}
        <div
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '-203px',
            top: '-456px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(200px)',
            transform: 'rotate(90deg)',
            zIndex: 0,
          }}
        />

        {/* Decorative Background Logo */}
        <div className="absolute -top-4 right-0 w-108 h-full transform rotate-6 opacity-40">
          <img src="/big logo.svg" alt="" className="w-full h-full object-contain" />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-lg">
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">Stay Ahead of the Markets</h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Join 25,000+ subscribers who rely on our research-backed analysis to make smarter investment decisions.
              </p>
            </div>

            {/* Email Signup Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center border border-white/40 rounded-full p-1 gap-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white placeholder-gray-300 focus:outline-none focus:ring-0 focus:border-transparent outline-none"
                    disabled={status === 'loading'}
                    required
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-white text-[#0A0A0A] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>

              {/* Status Message */}
              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  status === 'success'
                    ? 'bg-green-900/20 text-green-400 border border-green-400/20'
                    : 'bg-red-900/20 text-red-400 border border-red-400/20'
                }`}>
                  {message}
                </div>
              )}

              {/* Disclaimer */}
              <p className=" text-lg text-white/80 font-large">
                <span className='font-semibold'>NO SPAM.</span> I never send spam. You can unsubscribe at any time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

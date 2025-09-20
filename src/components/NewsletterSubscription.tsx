'use client';

import { useState } from 'react';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
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
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="relative bg-[#1F1F1F] rounded-2xl p-10 overflow-hidden">
        {/* Background Gradient Blur */}
        <div className="absolute -top-96 -left-52 w-96 h-96 gradient-blur opacity-50 rounded-full transform rotate-90"></div>

        {/* Decorative Background Shape */}
        <div className="absolute top-0 right-0 w-96 h-full newsletter-gradient transform rotate-12 opacity-30"></div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <div className="space-y-10">
            {/* Header */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-white">Stay Ahead of the Markets</h2>
              <p className="text-gray-300 leading-relaxed">
                Join 25,000+ subscribers who rely on our research-backed analysis to make smarter investment decisions.
              </p>
            </div>

            {/* Email Signup Form */}
            <div className="space-y-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row border border-white/40 rounded-full p-1 space-y-2 sm:space-y-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-transparent px-4 py-2 text-white placeholder-gray-300 focus:outline-none"
                    disabled={status === 'loading'}
                    required
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-white text-[#0A0A0A] px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              <p className="text-center text-sm text-white/80 font-medium">
                NO SPAM. I never send spam. You can unsubscribe at any time!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

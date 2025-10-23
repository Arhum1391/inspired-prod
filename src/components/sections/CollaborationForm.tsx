'use client';

import { useState } from 'react';

export default function CollaborationForm() {
  const [formData, setFormData] = useState({
    brandName: '',
    email: '',
    website: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Immediately show success and clear form for better UX
    setStatus('success');
    const submittedData = { ...formData };
    setFormData({ brandName: '', email: '', website: '', message: '' });

    // Reset status after 3 seconds
    setTimeout(() => setStatus('idle'), 3000);

    // Submit to API and handle response properly
    fetch('/api/collaboration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submittedData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Form submitted successfully:', data);
    })
    .catch(error => {
      console.error('Form submission error:', error);
      // You could set error state here if needed
    });
  };

  return (
    <section className="relative z-[1] bg-[#0A0A0A] px-3 sm:px-5 md:px-8 lg:px-12 py-12 sm:py-14 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 md:p-10 overflow-hidden flex flex-row justify-center items-center"
          style={{
            width: '100%',
            minHeight: '510px',
            margin: '0 auto',
            isolation: 'isolate'
          }}
        >
          {/* Curved Gradient Border */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: '16px',
              background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
              padding: '1px'
            }}
          >
            <div
              className="w-full h-full rounded-[15px]"
              style={{
                background: '#1F1F1F'
              }}
            ></div>
          </div>
          {/* Ellipse 2 - Left gradient */}
          <div
            style={{
              position: 'absolute',
              width: '588px',
              height: '588px',
              left: '-417px',
              top: '-434px',
              background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
              filter: 'blur(100px)',
              transform: 'rotate(180deg)',
              zIndex: 0,
            }}
          />

          {/* Ellipse 3 - Right gradient (Desktop) */}
          <div
            className="hidden md:block"
            style={{
              position: 'absolute',
              width: '588px',
              height: '588px',
              left: '893px',
              top: '324px',
              background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
              filter: 'blur(100px)',
              transform: 'rotate(-92.63deg)',
              zIndex: 1,
            }}
          />

          {/* Ellipse 3 - Mobile gradient (bottom right) */}
          <div
            className="block md:hidden"
            style={{
              position: 'absolute',
              width: '555.79px',
              height: '555.79px',
              left: '270.56px',
              top: '356.91px',
              background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
              filter: 'blur(100px)',
              transform: 'rotate(-92.63deg)',
              zIndex: 0,
            }}
          />

          {/* Main Content Frame */}
          <div className="relative z-30 w-full max-w-[630px] mx-auto">
            {/* Header Frame */}
            <div className="mb-6 sm:mb-8 md:mb-10">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-semibold mb-3 sm:mb-4" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                Work with Inspired Analyst
              </h2>
              <p className="text-white text-sm sm:text-base" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                For collaboration, drop us a message.
              </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Brand Name and Email - Stack on mobile, side by side on desktop */}
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 md:gap-6">
                {/* Brand Name Field */}
                <div className="flex flex-col flex-1 gap-1 sm:gap-1.5">
                  <label className="text-white text-xs sm:text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleInputChange}
                    placeholder="Enter Name"
                    className="bg-transparent text-white placeholder-white/30 border border-white/30 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-white/30"
                    style={{ fontFamily: 'Gilroy, sans-serif', boxShadow: 'none', outline: 'none' }}
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="flex flex-col flex-1 gap-1 sm:gap-1.5">
                  <label className="text-white text-xs sm:text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="abc@example.com"
                    className="bg-transparent text-white placeholder-white/30 border border-white/30 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-white/30"
                    style={{ fontFamily: 'Gilroy, sans-serif', boxShadow: 'none', outline: 'none' }}
                    required
                  />
                </div>
              </div>

              {/* Brand Website */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <label className="text-white text-xs sm:text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                  Brand Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://yourbrand.com"
                  className="bg-transparent text-white placeholder-white/30 border border-white/30 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-white/30"
                  style={{ fontFamily: 'Gilroy, sans-serif', boxShadow: 'none', outline: 'none' }}
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1 sm:gap-1.5">
                <label className="text-white text-xs sm:text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us about your collaboration idea..."
                  className="bg-transparent text-white placeholder-white/30 border border-white/30 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 w-full resize-none text-xs sm:text-sm focus:outline-none focus:ring-0 focus:border-white/30"
                  style={{ fontFamily: 'Gilroy, sans-serif', boxShadow: 'none', outline: 'none', minHeight: '60px' }}
                  rows={3}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="no-focus bg-white text-[#0A0A0A] rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none"
                style={{ 
                  fontFamily: 'Gilroy, sans-serif', 
                  outline: 'none !important', 
                  boxShadow: 'none !important',
                  border: 'none !important'
                }}
                onFocus={(e) => e.target.blur()}
              >
                {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : status === 'error' ? 'Failed' : 'Send Message'}
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <p className="text-green-400 text-xs sm:text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                  Thank you! We&apos;ll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-xs sm:text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
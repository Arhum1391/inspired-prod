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

    // Submit to API in the background (fire and forget)
    fetch('/api/collaboration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submittedData),
    }).catch(error => {
      console.error('Background submission error:', error);
    });
  };

  return (
    <section className="relative z-10 bg-[#0A0A0A] px-3 sm:px-5 md:px-8 lg:px-12 py-12 sm:py-14 lg:py-16">
      <div className="max-w-6xl mx-auto">
        <div
          className="relative bg-[#1F1F1F] rounded-2xl p-10 overflow-hidden flex flex-row justify-center items-center"
          style={{
            width: '100%',
            minHeight: '510px',
            margin: '0 auto',
            isolation: 'isolate'
          }}
        >
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

          {/* Ellipse 3 - Right gradient */}
          <div
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

          {/* Main Content Frame */}
          <div
            className="relative z-20 flex flex-col items-start"
            style={{
              width: '100%',
              maxWidth: '630px',
              height: '430px',
              gap: '40px',
              margin: '0 auto'
            }}
          >
            {/* Header Frame */}
            <div
              className="flex flex-col items-start"
              style={{
                width: '100%',
                height: '64px',
                gap: '16px'
              }}
            >
              <h2
                className="text-white"
                style={{
                  width: '100%',
                  height: '32px',
                  fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 600,
                  fontSize: '32px',
                  lineHeight: '100%'
                }}
              >
                Work with Inspired Analyst
              </h2>
              <p
                className="text-white"
                style={{
                  width: '100%',
                  height: '16px',
                  fontFamily: 'Gilroy, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%'
                }}
              >
                For collaboration, drop us a message.
              </p>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="flex flex-col items-start" style={{ width: '100%', height: '326px', gap: '24px' }}>
              {/* First Row - Brand Name and Email */}
              <div className="flex flex-row items-start" style={{ width: '100%', height: '58px', gap: '24px' }}>
                {/* Brand Name Field */}
                <div className="flex flex-col items-start flex-1" style={{ gap: '4px', height: '58px' }}>
                  <label
                    className="text-white"
                    style={{
                      width: '100%',
                      height: '14px',
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%'
                    }}
                  >
                    Brand Name
                  </label>
                  <div
                    className="flex flex-row justify-center items-center"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '8px 12px',
                      gap: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <input
                      type="text"
                      name="brandName"
                      value={formData.brandName}
                      onChange={handleInputChange}
                      placeholder="Enter Name"
                      className="bg-transparent text-white placeholder-white/30 outline-none border-none flex-1 focus:outline-none focus:ring-0 focus:border-transparent"
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        height: '14px',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="flex flex-col items-start flex-1" style={{ gap: '4px', height: '58px' }}>
                  <label
                    className="text-white"
                    style={{
                      width: '100%',
                      height: '14px',
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%'
                    }}
                  >
                    Email Address
                  </label>
                  <div
                    className="flex flex-row justify-center items-center"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '8px 12px',
                      gap: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="abc@example.com"
                      className="bg-transparent text-white placeholder-white/30 outline-none border-none flex-1 focus:outline-none focus:ring-0 focus:border-transparent"
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        height: '14px',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Second Row - Brand Website */}
              <div className="flex flex-row items-start" style={{ width: '100%', height: '58px', gap: '24px' }}>
                <div className="flex flex-col items-start flex-1" style={{ gap: '4px', height: '58px' }}>
                  <label
                    className="text-white"
                    style={{
                      width: '100%',
                      height: '14px',
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%'
                    }}
                  >
                    Brand Website
                  </label>
                  <div
                    className="flex flex-row justify-center items-center"
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '8px 12px',
                      gap: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourbrand.com"
                      className="bg-transparent text-white placeholder-white/30 outline-none border-none flex-1 focus:outline-none focus:ring-0 focus:border-transparent"
                      style={{
                        fontFamily: 'Gilroy, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        height: '14px',
                        outline: 'none',
                        boxShadow: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Third Row - Message */}
              <div className="flex flex-col items-start" style={{ width: '100%', height: '90px', gap: '4px' }}>
                <label
                  className="text-white"
                  style={{
                    width: '100%',
                    height: '14px',
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%'
                  }}
                >
                  Message
                </label>
                <div
                  className="flex flex-row items-start"
                  style={{
                    width: '100%',
                    height: '72px',
                    padding: '8px 12px',
                    gap: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    boxSizing: 'border-box'
                  }}
                >
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your collaboration idea..."
                    className="bg-transparent text-white placeholder-white/30 outline-none border-none flex-1 resize-none focus:outline-none focus:ring-0 focus:border-transparent"
                    style={{
                      fontFamily: 'Gilroy, sans-serif',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      height: '48px',
                      outline: 'none',
                      boxShadow: 'none'
                    }}
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex flex-row justify-center items-center bg-white text-[#0A0A0A] rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
                style={{
                  width: '187px',
                  height: '48px',
                  padding: '12px 16px',
                  gap: '10px'
                }}
              >
                <span
                  style={{
                    width: '107px',
                    height: '12px',
                    fontFamily: 'Gilroy, sans-serif',
                    fontWeight: 600,
                    fontSize: '14px',
                    lineHeight: '100%',
                    textAlign: 'center'
                  }}
                >
                  {status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : status === 'error' ? 'Failed' : 'Send Message'}
                </span>
              </button>

              {/* Status Messages */}
              {status === 'success' && (
                <p className="text-green-400 text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
                  Thank you! We'll get back to you soon.
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm" style={{ fontFamily: 'Gilroy, sans-serif' }}>
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
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Bootcamp } from '@/types/admin';
import { getFallbackBootcamps } from '@/lib/fallbackBootcamps';

export default function BootcampRegisterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentInitiating, setPaymentInitiating] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchBootcamp(params.id as string);
    }
  }, [params.id]);

  // Check payment status and restore form data on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const paymentStatus = searchParams.get('payment');
    const sessionId = searchParams.get('session_id');
    const formDataKey = `bootcamp-form-${params.id}`;
    
    // Restore form data from sessionStorage
    const savedFormData = sessionStorage.getItem(formDataKey);
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData);
        setFullName(formData.fullName || '');
        setEmail(formData.email || '');
        setNotes(formData.notes || '');
      } catch (error) {
        console.error('Failed to restore form data:', error);
      }
    }

    // Handle payment status
    if (paymentStatus === 'success' && sessionId) {
      // Payment was successful
      setPaymentCompleted(true);
      setPaymentError('');
      // Clear the URL params to clean up the URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (paymentStatus === 'cancelled') {
      // Payment was cancelled
      setPaymentError('Payment was cancelled. Please try again.');
      setPaymentCompleted(false);
      // Clear the URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [params.id, searchParams]);

  const fetchBootcamp = async (id: string) => {
    try {
      const response = await fetch(`/api/bootcamp/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBootcamp(data);
      } else if (response.status === 404) {
        // Try to find in fallback data
        const fallbackBootcamp = getFallbackBootcamps().find(b => b.id === id);
        if (fallbackBootcamp) {
          setBootcamp(fallbackBootcamp);
        } else {
          router.push('/bootcamp');
        }
      } else {
        router.push('/bootcamp');
      }
    } catch (error) {
      console.error('Failed to fetch bootcamp:', error);
      // Try to find in fallback data
      const fallbackBootcamp = getFallbackBootcamps().find(b => b.id === id);
      if (fallbackBootcamp) {
        setBootcamp(fallbackBootcamp);
      } else {
        router.push('/bootcamp');
      }
    } finally {
      setLoading(false);
    }
  };

  // Comprehensive email validation (same as NewsletterSubscription)
  const validateEmail = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const atCount = (cleanEmail.match(/@/g) || []).length;
    if (atCount !== 1) return false;

    const [localPart, domainPart] = cleanEmail.split('@');
    if (!localPart || localPart.length === 0 || localPart.length > 64) return false;

    const localPartRegex = /^[a-zA-Z0-9.-]+$/;
    if (!localPartRegex.test(localPart)) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.startsWith('-') || localPart.endsWith('-')) return false;
    if (localPart.includes('..') || localPart.includes('--')) return false;

    if (!domainPart || domainPart.length === 0 || domainPart.length > 253) return false;
    const domainPartRegex = /^[a-zA-Z0-9.-]+$/;
    if (!domainPartRegex.test(domainPart)) return false;
    if (domainPart.startsWith('.') || domainPart.endsWith('.')) return false;
    if (domainPart.startsWith('-') || domainPart.endsWith('-')) return false;
    if (domainPart.includes('..') || domainPart.includes('--')) return false;

    const validDomains = [
      'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
      'protonmail.com', 'aol.com', 'live.com', 'msn.com', 'mail.com',
      'company.com', 'business.com', 'work.com', 'office.com',
      'yahoo.co.uk', 'btinternet.com', 'googlemail.com', 'me.com',
      'mac.com', 'ymail.com', 'rocketmail.com', 'att.net', 'verizon.net',
      'comcast.net', 'charter.net', 'cox.net', 'earthlink.net',
      'mail.ru', 'yandex.com', 'qq.com', '163.com', 'sina.com',
      'naver.com', 'daum.net', 'gmx.com', 'web.de', 'orange.fr',
      'laposte.net', 'free.fr', 'libero.it', 'alice.it', 'tin.it'
    ];

    const domainLower = domainPart.toLowerCase();
    const isKnownProvider = validDomains.includes(domainLower);

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
      const domainName = domainParts[domainParts.length - 2];
      if (!domainName || domainName.length === 0) return false;
    }

    const invalidPatterns = [
      /[@]{2,}/,
      /[^a-zA-Z0-9@.-]/,
      /^[@.-]/,
      /[@.-]$/,
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(cleanEmail)) return false;
    }

    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (emailError) setEmailError('');
  };

  const isFormValid = fullName.trim() !== '' && email.trim() !== '' && validateEmail(email);

  const handleBack = () => {
    router.push(`/bootcamp/${params.id}`);
  };

  const handleStripePayment = async () => {
    if (!fullName.trim()) {
      setEmailError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setEmailError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address from a recognized provider (e.g., Gmail, Yahoo, Outlook)');
      return;
    }

    setPaymentInitiating(true);
    setPaymentError('');

    try {
      // Save form data to sessionStorage before redirecting
      const formDataKey = `bootcamp-form-${params.id}`;
      const formData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        notes: notes.trim()
      };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(formDataKey, JSON.stringify(formData));
      }

      // Create Stripe checkout session for bootcamp payment
      const bootcampId = params.id as string;
      console.log('Sending bootcamp payment request:', {
        bootcampId: bootcampId,
        bootcampIdType: typeof bootcampId,
        bootcampIdLength: bootcampId?.length,
        customerEmail: email.trim().toLowerCase(),
        customerName: fullName.trim()
      });
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'bootcamp',
          bootcampId: bootcampId,
          customerEmail: email.trim().toLowerCase(),
          customerName: fullName.trim(),
          notes: notes.trim() || ''
        }),
      });

      const data = await response.json();
      console.log('Stripe checkout response:', { status: response.status, statusText: response.statusText, data });

      if (response.ok && data.success) {
        console.log('Redirecting to Stripe checkout:', data);
        // Redirect to Stripe Checkout
        if (typeof window !== 'undefined') {
          window.location.href = data.url;
        }
      } else {
        console.error('Failed to create Stripe checkout session:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details,
          availableIds: data.availableIds,
          fullData: data
        });
        const errorMessage = data.error 
          + (data.details ? ` - ${data.details}` : '')
          + (data.availableIds ? ` (Available IDs: ${data.availableIds.map((b: any) => `${b.id} [${b.isActive ? 'active' : 'inactive'}]`).join(', ')})` : '');
        setPaymentError(errorMessage || 'Failed to create payment session. Please try again.');
        setPaymentInitiating(false);
      }
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      setPaymentError('Network error. Please check your connection and try again.');
      setPaymentInitiating(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!paymentCompleted) {
      setEmailError('Please complete payment first');
      return;
    }

    if (!fullName.trim() || !email.trim() || !validateEmail(email)) {
      setEmailError('Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    try {
      // Store bootcamp details in sessionStorage for success page
      const bootcampDetails = {
        bootcamp: params.id,
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        notes: notes.trim() || '',
        paymentCompleted: true
      };
      
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('bootcampDetails', JSON.stringify(bootcampDetails));
        
        // Clear form data from sessionStorage
        const formDataKey = `bootcamp-form-${params.id}`;
        sessionStorage.removeItem(formDataKey);
      }
      
      // Redirect to success page
      router.push(`/bootcamp-success?bootcamp=${params.id}`);
    } catch (error) {
      console.error('Error completing booking:', error);
      setEmailError('Failed to complete booking. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
        <Navbar variant="hero" />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading bootcamp...</div>
        </div>
      </div>
    );
  }

  if (!bootcamp) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
        <Navbar variant="hero" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Bootcamp not found</h3>
            <button
              onClick={() => router.push('/bootcamp')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Bootcamps
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      {/* Background Ellipse - Desktop Bottom Left */}
      <div
        className="hidden lg:block absolute z-0"
        style={{
          width: 'min(450px, 35vw)',
          height: 'min(450px, 35vw)',
          left: '-315px',
          top: '668px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(15deg)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Background Ellipse - Desktop Bottom Right */}
      <div
        className="hidden lg:block absolute z-0"
        style={{
          width: '588px',
          height: '588px',
          left: '1337px',
          top: '438px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Background Ellipse - Mobile Top Left */}
      <div
        className="lg:hidden absolute z-0"
        style={{
          width: '450px',
          height: '450px',
          left: '-250px',
          top: '-450px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(15deg)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Background Ellipse - Mobile Bottom Right */}
      <div
        className="lg:hidden absolute z-0"
        style={{
          width: 'min(388px, 80vw)',
          height: 'min(388px, 80vw)',
          left: '325px',
          top: '1044px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(15deg)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Navigation Header */}
      <Navbar variant="hero" />

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 lg:px-6 pt-28 sm:pt-24 md:pt-28 lg:pt-32 pb-12 sm:pb-12 lg:pb-16 relative z-10">
        <div className="mx-auto max-w-7xl">
          {/* Back Button and Header */}
          <div className="flex flex-col gap-6 sm:gap-4 lg:gap-6 mb-8 sm:mb-6 lg:mb-8">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors w-fit cursor-pointer focus:outline-none"
            >
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '100%'}}>Back</span>
            </button>

            {/* Page Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-[32px] text-white"
              style={{fontFamily: 'Gilroy-SemiBold', fontWeight: 600, lineHeight: '100%'}}
            >
              Book Bootcamp
            </h1>
          </div>

          {/* Main Layout - Form and Summary */}
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-8">
            {/* Left Side - Registration Form */}
            <div className="w-full lg:flex-1 lg:max-w-[826px] flex flex-col gap-8 sm:gap-6">
              {/* Section Header */}
              <div className="flex flex-col gap-3">
                <h2
                  className="text-lg sm:text-xl text-white"
                  style={{fontFamily: 'Gilroy-SemiBold', fontWeight: 500, lineHeight: '100%'}}
                >
                  Register Now to Confirm Your Seat
                </h2>
                <p
                  className="text-sm text-[#909090]"
                  style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '120%'}}
                >
                  Complete your booking by providing your details and payment
                </p>
              </div>

              {/* Your Information Section */}
              <div className="flex flex-col gap-6">
                <h3
                  className="text-base text-white"
                  style={{fontFamily: 'Gilroy-SemiBold', fontWeight: 400, lineHeight: '100%'}}
                >
                  Your Information
                </h3>

                {/* Name and Email Row */}
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-1 flex-1">
                    <label
                      className="text-sm text-white"
                      style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter Name"
                      className="w-full bg-transparent text-white placeholder:text-white/30 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 outline-none transition-colors"
                      style={{fontFamily: 'Gilroy-Medium', fontSize: '14px', lineHeight: '100%', outline: 'none', boxShadow: 'none'}}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="flex flex-col gap-1 flex-1">
                    <label
                      className="text-sm text-white"
                      style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="abc@example.com"
                      className="w-full bg-transparent text-white placeholder:text-white/30 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 outline-none transition-colors"
                      style={{fontFamily: 'Gilroy-Medium', fontSize: '14px', lineHeight: '100%', outline: 'none', boxShadow: 'none'}}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Email Error Message */}
                {emailError && (
                  <div className="p-3 rounded-lg text-sm bg-red-900/20 text-red-400 border border-red-400/20">
                    {emailError}
                  </div>
                )}

                {/* Notes */}
                <div className="flex flex-col gap-1">
                  <label
                    className="text-sm text-white"
                    style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                  >
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Let us know if you want to discuss specific topics..."
                    rows={3}
                    className="w-full bg-transparent text-white placeholder:text-white/30 border border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-0 outline-none transition-colors resize-none"
                    style={{fontFamily: 'Gilroy-Medium', fontSize: '14px', lineHeight: '100%'}}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="flex flex-col gap-6">
                <h3
                  className="text-base text-white"
                  style={{fontFamily: 'Gilroy-SemiBold', fontWeight: 400, lineHeight: '100%'}}
                >
                  Payment Details
                </h3>

                {/* Stripe Payment Button */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleStripePayment}
                    disabled={!isFormValid || paymentInitiating || paymentCompleted}
                    className={`w-fit flex items-center justify-center px-4 py-3 border rounded-lg transition-all duration-300 ${
                      paymentCompleted
                        ? 'border-green-500/50 bg-green-500/10 cursor-not-allowed'
                        : !isFormValid || paymentInitiating
                        ? 'border-white/20 bg-white/5 cursor-not-allowed opacity-50'
                        : 'border-white/30 hover:border-white/60 hover:bg-white/5 cursor-pointer hover:scale-105'
                    }`}
                  >
                    <Image
                      src="/stripe.svg"
                      alt="Stripe"
                      width={80}
                      height={20}
                      className="h-5 w-auto"
                    />
                  </button>
                  
                  {paymentCompleted && (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm" style={{fontFamily: 'Gilroy-Medium'}}>
                        Payment Verified
                      </span>
                    </div>
                  )}
                  
                  {paymentInitiating && (
                    <div className="flex items-center gap-2 text-white/60">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm" style={{fontFamily: 'Gilroy-Medium'}}>
                        Redirecting to payment...
                      </span>
                    </div>
                  )}
                  
                  {!paymentCompleted && !paymentInitiating && (
                    <p className="text-xs text-white/60" style={{fontFamily: 'Gilroy-Medium'}}>
                      {isFormValid ? 'Click to complete payment via Stripe' : 'Fill in your details above to proceed with payment'}
                    </p>
                  )}
                  
                  {paymentError && (
                    <div className="p-3 rounded-lg text-sm bg-red-900/20 text-red-400 border border-red-400/20">
                      {paymentError}
                    </div>
                  )}
                </div>

                {/* Terms Text */}
                <p
                  className="text-xs text-white leading-[130%]"
                  style={{fontFamily: 'Gilroy-Medium', fontWeight: 400}}
                >
                  By completing this booking, you agree to our Terms of Service and Privacy Policy. <br></br>All services are provided for informational purposes only. Results may vary.
                </p>
              </div>
            </div>

            {/* Right Side - Bootcamp Summary */}
            <div className="w-full lg:w-auto lg:min-w-[380px] lg:max-w-[420px]">
              <div className="bg-[#1F1F1F] rounded-xl p-6 flex flex-col gap-4">
                {/* Summary Title */}
                <h3
                  className="text-base text-white"
                  style={{fontFamily: 'Gilroy-SemiBold', fontWeight: 400, lineHeight: '100%'}}
                >
                  Bootcamp Summary
                </h3>

                {/* Divider */}
                <div className="w-full h-px bg-[#404040]" />

                {/* Summary Content */}
                <div className="flex flex-col gap-6">
                  {/* Bootcamp Title and Tags */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start gap-4">
                    <h4
                      className="text-lg sm:text-xl text-white"
                      style={{fontFamily: 'Gilroy-SemiBold', fontWeight: 400, lineHeight: '100%'}}
                    >
                      {bootcamp.title}
                    </h4>
                    <div className="flex gap-2">
                      {bootcamp.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center justify-center px-2.5 py-2 rounded-full text-xs ${
                            index === 0 
                              ? 'bg-[#05B0B3]/12 border border-[#05B0B3] text-[#05B0B3]' 
                              : 'bg-[#DE50EC]/12 border border-[#DE50EC] text-[#DE50EC]'
                          }`}
                          style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex flex-col gap-4">
                    {/* Mentors */}
                    <div className="flex justify-between items-center">
                      <span
                        className="text-sm text-[#909090]"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        Mentors
                      </span>
                      <span
                        className="text-sm text-white"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        {bootcamp.mentors.map(mentor => mentor.split(' - ')[0]).join(', ')}
                      </span>
                    </div>

                    {/* Starting From */}
                    <div className="flex flex-col gap-3">
                      <span
                        className="text-base text-white"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        Starting From:
                      </span>
                      <div className="flex flex-col gap-3">
                        <span
                          className="text-xs text-white"
                          style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                        >
                          {(bootcamp.bootcampStartDate 
                            ? new Date(bootcamp.bootcampStartDate)
                            : new Date(bootcamp.registrationStartDate)
                          ).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <span
                        className="text-sm text-[#909090]"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        Price
                      </span>
                      <span
                        className="text-sm text-white"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        {bootcamp.price}
                      </span>
                    </div>

                    {/* Tax */}
                    <div className="flex justify-between items-center">
                      <span
                        className="text-sm text-[#909090]"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        Tax
                      </span>
                      <span
                        className="text-sm text-white"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        10%
                      </span>
                    </div>
                  </div>

                  {/* Total Section */}
                  <div className="flex flex-col gap-4">
                    {/* Divider */}
                    <div className="w-full h-px bg-[#404040]" />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span
                        className="text-base text-white"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        Total
                      </span>
                      <span
                        className="text-sm text-white"
                        style={{fontFamily: 'Gilroy-Medium', fontWeight: 400, lineHeight: '100%'}}
                      >
                        {bootcamp.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Desktop (Separate from card, more spacing) */}
          <div className="hidden lg:flex justify-end gap-2 mt-8 lg:min-w-[380px] lg:max-w-[420px] lg:ml-auto">
            <button
              onClick={handleBack}
              className="flex items-center justify-center px-4 py-3 border border-white rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
              style={{fontFamily: 'Gilroy-SemiBold', minWidth: '187px'}}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={handleCompleteBooking}
              disabled={!isFormValid || isSubmitting || !paymentCompleted}
              className={`flex items-center justify-center px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                isFormValid && !isSubmitting && paymentCompleted
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'cursor-not-allowed'
              }`}
              style={{
                fontFamily: 'Gilroy-SemiBold', 
                minWidth: '187px',
                backgroundColor: isFormValid && !isSubmitting && paymentCompleted ? undefined : '#909090',
                color: isFormValid && !isSubmitting && paymentCompleted ? undefined : '#404040'
              }}
              title={!paymentCompleted ? 'Please complete payment first' : ''}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
          </div>

          {/* Action Buttons - Mobile (Below Summary Card, responsive width) */}
          <div className="flex lg:hidden w-full gap-2 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 flex items-center justify-center py-3 border border-white rounded-full text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
              style={{fontFamily: 'Gilroy-SemiBold'}}
              disabled={isSubmitting}
            >
              Back
            </button>
            <button
              onClick={handleCompleteBooking}
              disabled={!isFormValid || isSubmitting || !paymentCompleted}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-full font-semibold transition-all duration-300 ${
                isFormValid && !isSubmitting && paymentCompleted
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'cursor-not-allowed'
              }`}
              style={{
                fontFamily: 'Gilroy-SemiBold',
                backgroundColor: isFormValid && !isSubmitting && paymentCompleted ? undefined : '#909090',
                color: isFormValid && !isSubmitting && paymentCompleted ? undefined : '#404040'
              }}
              title={!paymentCompleted ? 'Please complete payment first' : ''}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

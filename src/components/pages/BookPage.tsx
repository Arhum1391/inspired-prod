'use client';

import { useState, useEffect } from 'react';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';

// Meeting types configuration - matches your existing Calendly events
const meetingTypes = [
  {
    id: 'initial-consultation',
    name: 'Initial Consultation',
    duration: 30,
    price: 50,
    description: 'Quick overview and needs assessment',
    color: 'blue'
  },
  {
    id: 'initial-consultation-1',
    name: 'Extended Initial Consultation',
    duration: 45,
    price: 75,
    description: 'Extended consultation with detailed analysis',
    color: 'blue'
  },
  {
    id: 'strategy-workshop',
    name: 'Strategy Workshop',
    duration: 90,
    price: 150,
    description: 'Intensive planning and implementation workshop',
    color: 'purple'
  },
  {
    id: 'follow-up-session',
    name: 'Follow-up Session',
    duration: 45,
    price: 75,
    description: 'Progress review and next steps',
    color: 'orange'
  }
];

export default function BookingPage() {
  const [selectedMeetingType, setSelectedMeetingType] = useState(meetingTypes[0]);
  const [calendlyUrl, setCalendlyUrl] = useState('');
  const [showPaymentButton, setShowPaymentButton] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Generate Calendly URL based on selected meeting type
  useEffect(() => {
    const baseUrl = 'https://calendly.com/maxpace94';
    const eventType = selectedMeetingType.id;
    // Add Calendly customization parameters for dark theme
    const params = new URLSearchParams({
      background_color: '1F1F1F',
      text_color: 'ffffff',
      primary_color: 'DE50EC',
      hide_gdpr_banner: '1'
    });
    setCalendlyUrl(`${baseUrl}/${eventType}?${params.toString()}`);
  }, [selectedMeetingType]);

  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for Calendly events
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        console.log('Calendly booking completed:', e.data);
        setShowPaymentButton(true);
      }
    };

    window.addEventListener('message', handleCalendlyEvent);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleCalendlyEvent);
    };
  }, []);

  const handleMeetingTypeChange = (meetingType: typeof meetingTypes[0]) => {
    setSelectedMeetingType(meetingType);
    setShowPaymentButton(false); // Reset payment button when meeting type changes
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      console.log('Creating Stripe checkout session for:', {
        meetingTypeId: selectedMeetingType.id,
        meetingData: selectedMeetingType
      });
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking',
          meetingTypeId: selectedMeetingType.id,
          customerEmail: '', // Will be collected in Stripe checkout
          customerName: ''   // Will be collected in Stripe checkout
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log('Stripe checkout session created:', data);
        
        // Store booking details in sessionStorage for success page
        const bookingDetails = {
          meetingType: selectedMeetingType.id,
          meetingName: selectedMeetingType.name,
          sessionId: data.sessionId,
          productName: data.productName,
          amount: data.amount
        };
        
        sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('Failed to create Stripe checkout session:', data);
        alert('Failed to create payment session. Please try again.');
      }
    } catch (error) {
      console.error('Error creating Stripe checkout session:', error);
      alert('An error occurred while processing your payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white py-8" style={{ fontFamily: 'Gilroy-Medium, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            Book Your Meeting
          </h1>
          <p className="text-lg text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            Select your preferred meeting type and schedule a time that works for you
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Compact Meeting Type Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
              Choose Meeting Type
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {meetingTypes.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 bg-[#1F1F1F] ${
                    selectedMeetingType.id === meeting.id
                      ? 'group overflow-hidden'
                      : 'hover:border-gray-600'
                  }`}
                  onClick={() => handleMeetingTypeChange(meeting)}
                >
                  {selectedMeetingType.id === meeting.id && (
                    <>
                      <div
                        className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                        style={{
                          background: 'linear-gradient(226.35deg, #DE50EC 0%, rgba(222, 80, 236, 0) 50.5%)',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude'
                        }}
                      >
                        <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                      </div>
                      <div
                        className="absolute inset-0 opacity-80 rounded-2xl"
                        style={{
                          background: 'radial-gradient(circle at top left, rgba(222, 80, 236, 0.15), transparent 60%)'
                        }}
                      />
                    </>
                  )}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-semibold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                        {meeting.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        meeting.color === 'purple' ? 'bg-purple-400/12 border border-purple-400 text-purple-400' : 'bg-yellow-400/12 border border-yellow-400 text-yellow-400'
                      }`}>
                        {meeting.duration}m
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                      {meeting.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                        ${meeting.price}
                      </span>
                      {selectedMeetingType.id === meeting.id && (
                        <span className="text-xs text-purple-400 font-medium">
                          ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendly Widget - Takes up most of the space */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h2 className="text-xl font-semibold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                Select Your Time
              </h2>
              <div className="text-sm text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                {selectedMeetingType.name} • {selectedMeetingType.duration} minutes • ${selectedMeetingType.price}
              </div>
            </div>
            
            <div className="bg-[#1F1F1F] rounded-2xl border border-gray-700/50 overflow-hidden">
              {/* Calendly Inline Widget - Much larger */}
              <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '800px' }}>
                {calendlyUrl && (
                  <iframe
                    src={calendlyUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Calendly Scheduling Widget"
                  />
                )}
              </div>
            </div>

            {/* Payment Section */}
            {showPaymentButton ? (
              <div className="bg-[#1F1F1F] border border-gray-700/50 rounded-2xl p-6">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                        Time Slot Selected!
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-6" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                    Complete your booking by making a payment of ${selectedMeetingType.price}
                  </p>
                  
                  <button
                    onClick={handlePayment}
                    disabled={isProcessingPayment}
                    className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                      isProcessingPayment 
                        ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                    style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
                  >
                    {isProcessingPayment ? 'Processing...' : `Pay $${selectedMeetingType.price} - Complete Booking`}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[#1F1F1F] border border-gray-700/50 rounded-2xl p-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <p className="text-xs text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                      Payment will be required to confirm your booking after selecting a time slot.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12">
            <NewsletterSubscription />
          </div>
        </div>
      </div>
    </div>
  );
}

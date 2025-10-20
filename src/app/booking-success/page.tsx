'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

// Analyst data - should match the data from MeetingsPage
const analysts = [
    { id: 0, name: 'Adnan' },
    { id: 1, name: 'Assassin' },
    { id: 2, name: 'Hassan Tariq' },
    { id: 3, name: 'Hamza Ali' },
    { id: 4, name: 'Hassan Khan' },
    { id: 5, name: 'Meower' },
    { id: 6, name: 'Mohid' },
    { id: 7, name: 'M. Usama' }
];

const meetings = [
    { id: 2, title: '30-Min Strategy', duration: '30 minutes' },
    { id: 3, title: '60-Min Deep', duration: '60 minutes' }
];

const BookingSuccessContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [calendlyLoaded, setCalendlyLoaded] = useState(false);
    const [calendlyOpened, setCalendlyOpened] = useState(false);

    // Format the date
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Load Calendly script
    useEffect(() => {
        // Get booking details from sessionStorage (only on client-side)
        if (typeof window !== 'undefined') {
            const storedDetails = sessionStorage.getItem('bookingDetails');
            
            if (storedDetails) {
                const details = JSON.parse(storedDetails);
                setBookingDetails(details);
                console.log('Booking details loaded:', details);
                
                // If analyst has Calendly integration, load the script
                if (details.hasCalendlyIntegration && details.calendlyUrl) {
                    loadCalendlyScript();
                }
            } else {
                // Fallback to URL parameters if no sessionStorage
                const details = {
                    analystName: analysts.find(a => a.id === parseInt(searchParams.get('analyst') || '0'))?.name || 'Unknown',
                    meetingTitle: meetings.find(m => m.id === parseInt(searchParams.get('meeting') || '2'))?.title || 'Unknown',
                    meetingDuration: meetings.find(m => m.id === parseInt(searchParams.get('meeting') || '2'))?.duration || 'Unknown',
                    date: searchParams.get('date') || '',
                    time: searchParams.get('time') || '',
                    timezone: searchParams.get('timezone') || '',
                    notes: searchParams.get('notes') || '',
                    hasCalendlyIntegration: false
                };
                setBookingDetails(details);
            }
        } else {
            // Server-side: use URL parameters only
            const details = {
                analystName: analysts.find(a => a.id === parseInt(searchParams.get('analyst') || '0'))?.name || 'Unknown',
                meetingTitle: meetings.find(m => m.id === parseInt(searchParams.get('meeting') || '2'))?.title || 'Unknown',
                meetingDuration: meetings.find(m => m.id === parseInt(searchParams.get('meeting') || '2'))?.duration || 'Unknown',
                date: searchParams.get('date') || '',
                time: searchParams.get('time') || '',
                timezone: searchParams.get('timezone') || '',
                notes: searchParams.get('notes') || '',
                hasCalendlyIntegration: false
            };
            setBookingDetails(details);
        }

        // Animate the success checkmark
        const timer = setTimeout(() => setShowSuccess(true), 300);
        return () => clearTimeout(timer);
    }, [searchParams]);

    const loadCalendlyScript = () => {
        // Only run on client-side
        if (typeof window === 'undefined') return;
        
        // Load Calendly CSS if not already loaded
        if (!document.querySelector('link[href*="calendly"]')) {
            const link = document.createElement('link');
            link.href = 'https://assets.calendly.com/assets/external/widget.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
        
        // Load Calendly JS if not already loaded
        if (!document.querySelector('script[src*="calendly"]')) {
            const script = document.createElement('script');
            script.src = 'https://assets.calendly.com/assets/external/widget.js';
            script.async = true;
            script.onload = () => {
                console.log('Calendly script loaded successfully');
                setCalendlyLoaded(true);
            };
            document.body.appendChild(script);
        } else {
            setCalendlyLoaded(true);
        }
    };

    // Auto-open Calendly popup when script is loaded
    useEffect(() => {
        if (calendlyLoaded && bookingDetails?.hasCalendlyIntegration && bookingDetails?.calendlyUrl && !calendlyOpened) {
            // Small delay to ensure page is fully loaded
            const timer = setTimeout(() => {
                openCalendlyPopup();
                setCalendlyOpened(true);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [calendlyLoaded, bookingDetails, calendlyOpened]);

    const openCalendlyPopup = () => {
        if (!bookingDetails || !bookingDetails.calendlyUrl || typeof window === 'undefined') {
            console.error('No Calendly URL available or not in browser environment');
            return;
        }

        // @ts-ignore - Calendly global object
        if (window.Calendly) {
            console.log('Opening Calendly popup with URL:', bookingDetails.calendlyUrl);
            
            // Open Calendly popup with pre-filled information
            // @ts-ignore
            window.Calendly.initPopupWidget({
                url: bookingDetails.calendlyUrl,
                prefill: {
                    name: bookingDetails.fullName || '',
                    email: bookingDetails.email || '',
                    customAnswers: {
                        a1: bookingDetails.notes || ''
                    }
                },
                utm: {
                    utmSource: 'inspired-analyst',
                    utmMedium: 'booking',
                    utmCampaign: 'mentorship'
                }
            });

            // Listen for Calendly events
            // @ts-ignore
            const handleCalendlyEvent = (e: MessageEvent) => {
                if (e.data.event && e.data.event.indexOf('calendly') === 0) {
                    console.log('Calendly event:', e.data.event);
                    
                    // When booking is scheduled
                    if (e.data.event === 'calendly.event_scheduled') {
                        console.log('Calendly booking confirmed!', e.data.payload);
                        
                        // Store Calendly event details
                        const updatedDetails = {
                            ...bookingDetails,
                            calendlyEventUri: e.data.payload?.event?.uri || '',
                            calendlyInviteeUri: e.data.payload?.invitee?.uri || '',
                            bookingConfirmed: true
                        };
                        
                        if (typeof window !== 'undefined') {
                            sessionStorage.setItem('bookingDetails', JSON.stringify(updatedDetails));
                        }
                        setBookingDetails(updatedDetails);
                        
                        // Popup will close automatically, success page is already visible behind it
                        console.log('Calendly popup closed, showing success page');
                    }
                }
            };

            window.addEventListener('message', handleCalendlyEvent);
        } else {
            console.error('Calendly script not loaded');
        }
    };

    const handleBackHome = () => {
        router.push('/');
    };

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white font-sans relative">
            {/* Single Gradient Under Booking Summary with Circular Mask */}
            <div 
                className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[588px] h-[588px] pointer-events-none opacity-100"
                style={{
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    transform: 'translateY(70%)',
                    transformOrigin: 'center',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                    filter: 'blur(150px)',
                    WebkitFilter: 'blur(150px)'
                }}
            />

            {/* Navigation Header */}
            <Navbar variant="hero" />

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
                {/* Success Icon */}
                <div className="flex items-center justify-center mb-4 mt-4">
                    <div className="relative">
                        {/* Circle Background */}
                        <div 
                            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-transparent border-2 border-green-500 flex items-center justify-center"
                        >
                            {/* Checkmark */}
                            <div 
                                className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-500 ${showSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                                style={{
                                    backgroundImage: 'url("/logo/Tick.svg")',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    transform: 'translateY(1px)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4" style={{ fontSize: '32px' }}>You&apos;re Booked!</h1>
                    <p className="text-white text-sm sm:text-base lg:text-lg" style={{ fontSize: '16px' }}>
                        Your meeting has been confirmed. We&apos;ve sent a confirmation to your email.
                    </p>
                </div>

                {/* Meeting Details Card */}
                {bookingDetails && (
                    <div className="bg-[#1F1F1F] border border-gray-600/50 rounded-xl p-4 sm:p-6 w-full mb-6 mt-0" style={{ maxWidth: '600px' }}>
                        <div className="space-y-3 sm:space-y-4">
                            {/* Meeting Type */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm sm:text-base mb-2" style={{ fontSize: '14px' }}>Meeting Type</p>
                                    <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{bookingDetails.meetingTitle || 'Unknown'}</p>
                                </div>
                                <span className={`inline-block px-3 py-1 text-xs rounded-full mt-8 ${
                                    bookingDetails.meeting === '2' ? 'bg-purple-400/12 border border-purple-400 text-purple-400' :
                                    bookingDetails.meeting === '3' ? 'bg-yellow-400/12 border border-yellow-400 text-yellow-400' :
                                    'bg-teal-400/12 border border-teal-400 text-teal-400'
                                }`}>
                                    {bookingDetails.meetingDuration || 'Unknown'}
                                </span>
                            </div>
                            
                            {/* Blank Space */}
                            <div className="h-0"></div>

                            {/* Your Analyst */}
                            <div>
                                <p className="text-gray-400 text-sm sm:text-base mb-1" style={{ fontSize: '14px' }}>Your Analyst</p>
                                <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{bookingDetails.analystName || 'Unknown'}</p>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <p className="text-gray-400 text-sm sm:text-base mb-1" style={{ fontSize: '14px' }}>Date & Time</p>
                                <div className="flex flex-col">
                                    <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{formatDate(bookingDetails.date)}</p>
                                    <p className="text-white mt-1 text-base sm:text-lg" style={{ fontSize: '16px' }}>{bookingDetails.time} {bookingDetails.timezone && `(${bookingDetails.timezone})`}</p>
                                </div>
                            </div>

                            {/* Your Notes */}
                            {bookingDetails.notes && (
                                <div>
                                    <p className="text-gray-400 text-sm sm:text-base mb-1" style={{ fontSize: '14px' }}>Your Notes</p>
                                    <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{bookingDetails.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full sm:justify-center relative z-20">
                    {/* Google Calendar */}
                    <button 
                        className="bg-white text-black px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors w-full sm:w-auto focus:outline-none focus:ring-0"
                        style={{ outline: 'none', boxShadow: 'none' }}
                    >
                        <Image 
                            src="/logo/calendar.svg" 
                            alt="Google Calendar" 
                            width={20}
                            height={20}
                            className="w-5 h-5"
                        />
                        Google Calendar
                    </button>

                    {/* Outlook Calendar */}
                    <button 
                        className="bg-black border border-white text-white px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto focus:outline-none focus:ring-0"
                        style={{ backgroundColor: 'black', outline: 'none', boxShadow: 'none' }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'black'}
                    >
                        <Image 
                            src="/logo/outlook.png" 
                            alt="Outlook Calendar" 
                            width={20}
                            height={20}
                            className="w-5 h-5"
                        />
                        Outlook Calendar
                    </button>

                    {/* Back Home Button */}
                    <button 
                        onClick={handleBackHome}
                        className="bg-black border border-white text-white px-4 py-2 rounded-3xl font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto focus:outline-none focus:ring-0"
                        style={{ backgroundColor: 'black', outline: 'none', boxShadow: 'none' }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'black'}
                    >
                        Back Home
                        <Image 
                            src="/logo/backhome.png" 
                            alt="Back Home" 
                            width={20}
                            height={20}
                            className="w-5 h-5"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookingSuccessPage: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="bg-[#0D0D0D] min-h-screen text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <BookingSuccessContent />
        </Suspense>
    );
};

export default BookingSuccessPage;

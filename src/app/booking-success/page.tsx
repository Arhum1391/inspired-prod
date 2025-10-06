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

    // Get booking data from URL parameters
    const selectedAnalystId = parseInt(searchParams.get('analyst') || '0');
    const selectedMeetingId = parseInt(searchParams.get('meeting') || '1');
    const selectedDate = searchParams.get('date') || '';
    const selectedTime = searchParams.get('time') || '';
    const selectedTimezone = searchParams.get('timezone') || '';
    const notes = searchParams.get('notes') || '';

    // Get analyst and meeting data
    const selectedAnalyst = analysts.find(a => a.id === selectedAnalystId);
    const selectedMeeting = meetings.find(m => m.id === selectedMeetingId);

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

    useEffect(() => {
        // Animate the success checkmark
        const timer = setTimeout(() => setShowSuccess(true), 300);
        return () => clearTimeout(timer);
    }, []);

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
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-9">
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
                <div className="bg-[#1F1F1F] border border-gray-600/50 rounded-xl p-4 sm:p-6 w-full mb-6 mt-0" style={{ maxWidth: '600px' }}>
                    <div className="space-y-3 sm:space-y-4">
                        {/* Meeting Type */}
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-400 text-sm sm:text-base mb-2" style={{ fontSize: '14px' }}>Meeting Type</p>
                                <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{selectedMeeting?.title || 'Unknown'}</p>
                            </div>
                            <span className={`inline-block px-3 py-1 text-xs rounded-full mt-8 ${
                                selectedMeetingId === 2 ? 'bg-purple-400/12 border border-purple-400 text-purple-400' :
                                selectedMeetingId === 3 ? 'bg-yellow-400/12 border border-yellow-400 text-yellow-400' :
                                'bg-teal-400/12 border border-teal-400 text-teal-400'
                            }`}>
                                {selectedMeeting?.duration || 'Unknown'}
                            </span>
                        </div>
                        
                        {/* Blank Space */}
                        <div className="h-0"></div>

                        {/* Your Analyst */}
                        <div>
                            <p className="text-gray-400 text-sm sm:text-base mb-1" style={{ fontSize: '14px' }}>Your Analyst</p>
                            <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{selectedAnalyst?.name || 'Unknown'}</p>
                        </div>

                        {/* Date & Time */}
                        <div>
                            <p className="text-gray-400 text-sm sm:text-base mb-1" style={{ fontSize: '14px' }}>Date & Time</p>
                            <div className="flex flex-col">
                                <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{formatDate(selectedDate)}</p>
                                <p className="text-white mt-1 text-base sm:text-lg" style={{ fontSize: '16px' }}>{selectedTime} {selectedTimezone && `(${selectedTimezone})`}</p>
                            </div>
                        </div>

                        {/* Your Notes */}
                        {notes && (
                            <div>
                                <p className="text-gray-400 text-sm sm:text-base mb-1" style={{ fontSize: '14px' }}>Your Notes</p>
                                <p className="text-white font-bold text-base sm:text-lg" style={{ fontSize: '16px' }}>{notes}</p>
                            </div>
                        )}
                    </div>
                </div>

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

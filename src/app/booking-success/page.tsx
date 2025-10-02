'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
                {/* Success Icon */}
                <div className="flex items-center justify-center mb-4 mt-4">
                    <div className="relative">
                        {/* Circle Background */}
                        <div 
                            className="w-12 h-12 rounded-full bg-transparent border-2 border-green-500 flex items-center justify-center"
                        >
                            {/* Checkmark */}
                            <div 
                                className={`w-6 h-6 transition-all duration-500 ${showSuccess ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                                style={{
                                    backgroundImage: 'url("/logo/Tick.svg")',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    transform: 'translateY(2px)'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">You&apos;re Booked!</h1>
                    <p className="text-white text-lg">
                        Your meeting has been confirmed. We&apos;ve sent a confirmation to your email.
                    </p>
                </div>

                {/* Meeting Details Card */}
                <div className="bg-[#1F1F1F] border border-gray-600/50 rounded-xl p-6 max-w-lg w-full mb-6 mt-4">
                    <div className="space-y-4">
                        {/* Meeting Type */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">Meeting Type</p>
                                <p className="text-white font-bold text-lg">{selectedMeeting?.title || 'Unknown'}</p>
                            </div>
                            <span className="bg-teal-400/20 text-teal-300 text-xs px-3 py-1 rounded-full">
                                {selectedMeeting?.duration || 'Unknown'}
                            </span>
                        </div>

                        {/* Analyst Name */}
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Analyst Name</p>
                            <p className="text-white font-bold text-lg">{selectedAnalyst?.name || 'Unknown'}</p>
                        </div>

                        {/* Date & Time */}
                        <div>
                            <p className="text-gray-400 text-sm mb-1">Date & Time</p>
                            <div className="flex items-center justify-between">
                                <p className="text-white font-bold">{formatDate(selectedDate)}</p>
                                <p className="text-white text-sm">{selectedTime} {selectedTimezone && `(${selectedTimezone})`}</p>
                            </div>
                        </div>

                        {/* Your Notes */}
                        {notes && (
                            <div>
                                <p className="text-gray-400 text-sm mb-1">Your Notes</p>
                                <p className="text-white font-bold">{notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mb-8">
                    {/* Google Calendar */}
                    <button className="bg-white text-black px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                        <img 
                            src="/logo/calendar.svg" 
                            alt="Google Calendar" 
                            className="w-5 h-5"
                        />
                        Google Calendar
                    </button>

                    {/* Outlook Calendar */}
                    <button className="bg-black border border-gray-600 text-white px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                        <img 
                            src="/logo/outlook.png" 
                            alt="Outlook Calendar" 
                            className="w-5 h-5"
                        />
                        Outlook Calendar
                    </button>

                    {/* Back Home Button */}
                    <button 
                        onClick={handleBackHome}
                        className="bg-black border border-gray-600 text-white px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        Back Home
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
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

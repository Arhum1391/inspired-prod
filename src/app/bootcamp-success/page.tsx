'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

const BootcampSuccessContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showSuccess, setShowSuccess] = useState(false);
    const [bootcampDetails, setBootcampDetails] = useState<{
        bootcamp: string;
        name: string;
        email: string;
        notes: string;
        productName?: string;
        amount?: number;
    } | null>(null);

    useEffect(() => {
        // Animate the success checkmark
        const timer = setTimeout(() => setShowSuccess(true), 300);
        
        // Try to get bootcamp details from sessionStorage first
        const storedDetails = sessionStorage.getItem('bootcampDetails');
        if (storedDetails) {
            try {
                const details = JSON.parse(storedDetails);
                setBootcampDetails(details);
                // Clear sessionStorage after reading
                sessionStorage.removeItem('bootcampDetails');
            } catch (error) {
                console.error('Failed to parse bootcamp details:', error);
                // Fall back to URL parameters
                setBootcampDetails({
                    bootcamp: searchParams.get('bootcamp') || '',
                    name: searchParams.get('name') || '',
                    email: searchParams.get('email') || '',
                    notes: searchParams.get('notes') || '',
                });
            }
        } else {
            // Fall back to URL parameters if sessionStorage is empty
            setBootcampDetails({
                bootcamp: searchParams.get('bootcamp') || '',
                name: searchParams.get('name') || '',
                email: searchParams.get('email') || '',
                notes: searchParams.get('notes') || '',
            });
        }
        
        return () => clearTimeout(timer);
    }, [searchParams]);

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
            <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-24 sm:pt-16 md:pt-20 lg:pt-24">
                {/* Success Icon */}
                <div className="flex items-center justify-center mb-8 mt-8">
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
                <div className="text-center mb-8 sm:mb-10" style={{ maxWidth: '629px' }}>
                    <h1 
                        className="text-white mb-3 text-[24px] sm:text-[32px] lg:text-[40px]"
                        style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontWeight: 500,
                            lineHeight: '100%'
                        }}
                    >
                        Thank You for Registering!
                    </h1>
                    <p 
                        className="text-white text-center"
                        style={{
                            fontFamily: 'Gilroy-Medium',
                            fontWeight: 400,
                            fontSize: '18px',
                            lineHeight: '120%'
                        }}
                    >
                        Your seat has been confirmed. We&apos;ve sent a confirmation to your email.
                    </p>
                </div>

                {/* Details Card */}
                <div className="bg-[#1F1F1F] rounded-xl w-full mb-10 sm:mb-10" style={{ maxWidth: '555px', padding: '20px' }}>
                    <div className="flex flex-col gap-6 sm:gap-6">
                        {/* Bootcamp Details */}
                        <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                            <div className="flex flex-col gap-3 flex-1">
                                <p 
                                    className="text-[#909090]"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Bootcamp Details
                                </p>
                                <div className="flex flex-row items-center gap-2">
                                    <p 
                                        className="text-white"
                                        style={{
                                            fontFamily: 'Gilroy-Medium',
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '100%'
                                        }}
                                    >
                                        {bootcampDetails?.bootcamp === 'crypto-trading' ? 'Crypto Trading Bootcamp' : (bootcampDetails?.productName || bootcampDetails?.bootcamp || 'Unknown Bootcamp')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row items-start gap-2" style={{ height: '24px' }}>
                                <span 
                                    className="inline-flex items-center justify-center rounded-full bg-[#05B0B3]/12 text-[#05B0B3]"
                                    style={{
                                        padding: '10px',
                                        height: '24px',
                                        border: '1px solid #05B0B3',
                                        borderRadius: '40px',
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '12px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    6 Weeks
                                </span>
                                <span 
                                    className="inline-flex items-center justify-center rounded-full bg-[#DE50EC]/12 text-[#DE50EC]"
                                    style={{
                                        padding: '10px',
                                        height: '24px',
                                        border: '1px solid #DE50EC',
                                        borderRadius: '40px',
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '12px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Online
                                </span>
                            </div>
                        </div>

                        {/* Your Mentors */}
                        {bootcampDetails?.bootcamp === 'crypto-trading' && (
                            <div className="flex flex-col gap-3">
                                <p 
                                    className="text-[#909090]"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Your Mentors
                                </p>
                                <p 
                                    className="text-white"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Adnan, Assassin
                                </p>
                            </div>
                        )}

                        {/* Starting From */}
                        <div className="flex flex-col gap-3">
                            <p 
                                className="text-[#909090]"
                                style={{
                                    fontFamily: 'Gilroy-Medium',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%'
                                }}
                            >
                                Starting From
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                <p 
                                    className="text-white"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Wednesday, September 18
                                </p>
                                <p 
                                    className="text-white"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '12px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    11:30 AM (Berlin, Germany)
                                </p>
                            </div>
                        </div>

                        {/* User Details */}
                        {(bootcampDetails?.name || bootcampDetails?.email) && (
                            <div className="flex flex-col gap-3">
                                <p 
                                    className="text-[#909090]"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Registration Details
                                </p>
                                {bootcampDetails?.name && (
                                    <p 
                                        className="text-white"
                                        style={{
                                            fontFamily: 'Gilroy-Medium',
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '100%'
                                        }}
                                    >
                                        Name: {bootcampDetails.name}
                                    </p>
                                )}
                                {bootcampDetails?.email && (
                                    <p 
                                        className="text-white"
                                        style={{
                                            fontFamily: 'Gilroy-Medium',
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '100%'
                                        }}
                                    >
                                        Email: {bootcampDetails.email}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Your Notes */}
                        {bootcampDetails?.notes && (
                            <div className="flex flex-col gap-3">
                                <p 
                                    className="text-[#909090]"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    Your Notes
                                </p>
                                <p 
                                    className="text-white"
                                    style={{
                                        fontFamily: 'Gilroy-Medium',
                                        fontWeight: 400,
                                        fontSize: '16px',
                                        lineHeight: '100%'
                                    }}
                                >
                                    {bootcampDetails.notes}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-12 sm:mb-8 w-full sm:justify-center relative z-20 max-w-[343px] sm:max-w-none">
                    {/* Google Calendar */}
                    <button 
                        className="bg-white text-black px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors w-full sm:w-auto focus:outline-none focus:ring-0 h-12"
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
                        className="bg-black border border-white text-white px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto focus:outline-none focus:ring-0 h-12"
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

                    {/* Back to Bootcamp Button */}
                    <button 
                        onClick={() => router.push('/bootcamp/crypto-trading')}
                        className="bg-black border border-white text-white px-6 py-3 rounded-3xl font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto focus:outline-none focus:ring-0 h-12"
                        style={{ backgroundColor: 'black', outline: 'none', boxShadow: 'none' }}
                        onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'black'}
                    >
                        Back to Bootcamp
                        <Image 
                            src="/logo/backhome.png" 
                            alt="Back to Bootcamp" 
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

const BootcampSuccessPage: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="bg-[#0D0D0D] min-h-screen text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <BootcampSuccessContent />
        </Suspense>
    );
};

export default BootcampSuccessPage;


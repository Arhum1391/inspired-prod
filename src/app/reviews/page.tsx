'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

// Mock reviews data
const reviews = [
    { id: 1, userName: 'Sarah M.', rating: 5, comment: 'Excellent insights into crypto trading strategies. His analysis was spot-on and helped me make profitable decisions.' },
    { id: 2, userName: 'Mike R.', rating: 5, comment: 'Great session! Explained complex data science concepts in a way that was easy to understand.' },
    { id: 3, userName: 'Emma L.', rating: 4, comment: 'Very knowledgeable analyst. The session was informative and well-structured.' },
    { id: 4, userName: 'David K.', rating: 5, comment: 'Outstanding expertise in both crypto and data science. Worth every penny.' },
    { id: 5, userName: 'Lisa P.', rating: 5, comment: 'Practical advice that I could implement immediately. Highly recommended.' },
    { id: 6, userName: 'James T.', rating: 4, comment: 'Professional and knowledgeable. Great insights into market trends.' },
    { id: 7, userName: 'Rachel K.', rating: 5, comment: 'Exceptional analysis and clear explanations. Would book again.' },
    { id: 8, userName: 'Tom H.', rating: 5, comment: 'Very helpful session. Got exactly what I needed for my portfolio.' },
    { id: 9, userName: 'Nina S.', rating: 5, comment: 'Incredible knowledge and ability to simplify complex topics. Fantastic!' },
    { id: 10, userName: 'Alex B.', rating: 5, comment: 'Amazing session! The analyst provided clear, actionable insights that transformed my trading approach.' },
    { id: 11, userName: 'Maria G.', rating: 4, comment: 'Very professional and knowledgeable. The session exceeded my expectations.' },
    { id: 12, userName: 'John D.', rating: 5, comment: 'Outstanding expertise and clear communication. Highly recommend this analyst.' },
    { id: 13, userName: 'Sophie L.', rating: 5, comment: 'Fantastic analysis and practical advice. The session was worth every minute.' },
    { id: 14, userName: 'Chris M.', rating: 4, comment: 'Great insights into market dynamics. Very helpful for my investment strategy.' },
    { id: 15, userName: 'Anna K.', rating: 5, comment: 'Exceptional knowledge and ability to explain complex concepts clearly.' },
    { id: 16, userName: 'Robert P.', rating: 5, comment: 'Outstanding session! Got exactly the guidance I needed for my portfolio.' },
    { id: 17, userName: 'Laura S.', rating: 4, comment: 'Very informative and well-structured session. Highly professional.' },
    { id: 18, userName: 'Mark T.', rating: 5, comment: 'Excellent analysis and practical advice. Would definitely book again.' }
];

const ReviewsContent: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const reviewsPerPage = isMobile ? 6 : 9; // 6 for mobile, 9 for desktop (3x3 grid)

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const handleBack = () => {
        const step = searchParams.get('step');
        const selectedAnalyst = searchParams.get('selectedAnalyst');
        if (step) {
            // Navigate back to the meetings page with the specific step and selected analyst
            const params = new URLSearchParams();
            params.set('step', step);
            if (selectedAnalyst) {
                params.set('selectedAnalyst', selectedAnalyst);
            }
            router.push(`/meetings?${params.toString()}`);
        } else {
            // Fallback to browser back
            router.back();
        }
    };

    // Calculate pagination
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    const currentReviews = reviews.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-[#DE50EC]' : 'text-gray-600'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white font-sans relative overflow-hidden">
            {/* Fixed Left Gradient - Desktop Only */}
            <div 
                className="hidden md:block absolute pointer-events-none opacity-100"
                style={{
                    width: '588px',
                    height: '588px',
                    left: '-600px',
                    top: '50%',
                    transform: 'translateY(-50%) rotate(45deg)',
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    filter: 'blur(120px)'
                }}
            ></div>

            {/* Mobile Top Left Gradient - Same as Select Your Analyst screen */}
            <div 
                className="md:hidden absolute top-0 left-0 w-[588px] h-[588px] pointer-events-none opacity-100"
                style={{
                    transform: 'rotate(0deg) translate(-300px, -350px)',
                    transformOrigin: 'top left',
                    background: 'linear-gradient(107.68deg, rgba(75, 37, 253, 0.8) 9.35%, rgba(222, 80, 236, 0.7) 34.7%, rgba(138, 43, 226, 0.6) 60.06%, rgba(147, 112, 219, 0.5) 72.73%, rgba(186, 85, 211, 0.4) 88.58%)',
                    filter: 'blur(120px)',
                    maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)'
                }}
            ></div>

            {/* Mobile Bottom Right Gradient - Same as Select Your Analyst screen */}
            <div 
                className="md:hidden absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
                style={{
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    transform: 'rotate(-45deg) translate(250px, 250px)',
                    transformOrigin: 'bottom right',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
                    filter: 'blur(150px)',
                    WebkitFilter: 'blur(150px)'
                }}
            ></div>

            {/* Navigation Header */}
            <Navbar variant="hero" />

            {/* Main Content Container - Same structure as booking page */}
            <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-8 lg:-mt-12">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16 items-center">
                
                {/* Left Side: Image Belts */}
                <div className="hidden lg:flex justify-center items-start h-full relative w-full max-w-sm">
                    <div className="flex w-full h-screen">
                        {/* Belt 1 - Rectangle 1 Images */}
                        <div className="flex-1 fade-mask overflow-hidden">
                            <div className="animate-scrollUp flex flex-col gap-6">
                                {/* First set of images */}
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/1.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2 improved.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/3.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/4.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/1.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2 improved.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/3.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/4.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                            </div>
                        </div>

                        {/* Belt 2 - Rectangle 2 Images */}
                        <div className="flex-1 fade-mask overflow-hidden">
                            <div className="animate-scrollDown flex flex-col gap-6">
                                {/* First set of images */}
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/5.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/6.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/7.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/5.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/6.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/7.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                        {/* Right Side - Content Area (Reviews) */}
                        <div className="w-full lg:col-span-2">
                            {/* Back Button */}
                            <div className="mb-1 mt-16">
                                <button 
                                    onClick={handleBack}
                                    className="flex items-center text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-0 focus:border-none active:outline-none"
                                    style={{
                                        outline: 'none',
                                        border: 'none',
                                        boxShadow: 'none'
                                    }}
                                >
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            </div>

                            {/* Title and Description */}
                            <div className="mb-8 mt-8">
                                <h1 className="text-4xl font-bold mb-2">Reviews</h1>
                                <p className="text-gray-400 text-lg">Real stories from people just like you.</p>
                            </div>

                            {/* Reviews Grid - 3x3 on desktop, 1 column on mobile */}
                            <div className="space-y-6">
                                {isMobile ? (
                                    // Mobile: Single column layout with alternating gradients
                                    currentReviews.map((review, index) => {
                                        const isEvenIndex = index % 2 === 0;
                                        const gradientImage = isEvenIndex 
                                            ? 'url("/gradient/Ellipse 4.svg")'  // 2nd column gradient
                                            : 'url("/gradient/Ellipse 2.png")'; // 1st column gradient
                                        
                                        return (
                                            <div
                                                key={index}
                                                className="relative overflow-hidden w-full"
                                                style={{
                                                    boxSizing: 'border-box',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    padding: '16px',
                                                    gap: '16px',
                                                    isolation: 'isolate',
                                                    minWidth: '0',
                                                    height: '162px',
                                                    background: '#1F1F1F',
                                                    borderRadius: '16px'
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

                                                {/* Gradient Overlay - Alternating between 1st and 2nd column styles */}
                                                <div 
                                                    className="absolute inset-0 rounded-2xl pointer-events-none"
                                                    style={{
                                                        backgroundImage: gradientImage,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        backgroundRepeat: 'no-repeat',
                                                        opacity: 0.8,
                                                        mixBlendMode: 'normal'
                                                    }}
                                                />

                                            {/* Content */}
                                            <div className="relative z-20 flex flex-col h-full w-full">
                                                {/* Review Comment */}
                                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-2">
                                                    {review?.comment}
                                                </p>
                                                
                                                {/* Bottom Row - Avatar, Name and Stars */}
                                                <div className="flex items-center justify-between w-full">
                                                    {/* Avatar and Name - Bottom Left */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                                            <Image 
                                                                src="/logo/review.svg" 
                                                                alt="Review avatar" 
                                                                width={24}
                                                                height={24}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-white font-semibold text-sm truncate">
                                                            {review?.userName}
                                                        </p>
                                                    </div>
                                                    
                                                    {/* Stars - Bottom Right */}
                                                    <div className="flex items-center gap-0.5 flex-shrink-0">
                                                        {renderStars(review?.rating || 5)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        );
                                    })
                                ) : (
                                    // Desktop: 3x3 grid layout
                                    [0, 1, 2].map((rowIndex) => (
                                    <div key={rowIndex} className="flex gap-6">
                                        {[0, 1, 2].map((colIndex) => {
                                            const reviewIndex = rowIndex * 3 + colIndex;
                                            const review = currentReviews[reviewIndex];
                                            const isMiddleColumn = colIndex === 1;
                                            
                                            return (
                                                <div
                                                    key={colIndex}
                                                    className="relative overflow-hidden flex-1"
                                                    style={{
                                                        boxSizing: 'border-box',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'flex-start',
                                                        padding: '16px',
                                                        gap: '16px',
                                                        isolation: 'isolate',
                                                        minWidth: '0',
                                                        height: '162px',
                                                        background: '#1F1F1F',
                                                        borderRadius: '16px'
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

                                                    {/* Gradient Overlay */}
                                                    <div 
                                                        className="absolute inset-0 rounded-2xl pointer-events-none"
                                                        style={{
                                                            backgroundImage: isMiddleColumn 
                                                                ? 'url("/gradient/Ellipse 2.png")'
                                                                : 'url("/gradient/Ellipse 4.svg")',
                                                            backgroundSize: 'cover',
                                                            backgroundPosition: 'center',
                                                            backgroundRepeat: 'no-repeat',
                                                            opacity: 0.8,
                                                            mixBlendMode: 'normal'
                                                        }}
                                                    />

                                                    {/* Content */}
                                                    <div className="relative z-20 flex flex-col h-full w-full">
                                                        {/* Review Comment */}
                                                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-2">
                                                            {review?.comment}
                                                        </p>
                                                        
                                                        {/* Bottom Row - Avatar, Name and Stars */}
                                                        <div className="flex items-center justify-between w-full">
                                                            {/* Avatar and Name - Bottom Left */}
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                                                    <Image 
                                                                        src="/logo/review.svg" 
                                                                        alt="Review avatar" 
                                                                        width={24}
                                                                        height={24}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <p className="text-white font-semibold text-sm truncate">
                                                                    {review?.userName}
                                                                </p>
                                                            </div>
                                                            
                                                            {/* Stars - Bottom Right */}
                                                            <div className="flex items-center gap-0.5 flex-shrink-0">
                                                                {renderStars(review?.rating || 5)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))
                                )}
                            </div>

                            {/* Page Counter - Bottom Right on desktop, slightly left on mobile */}
                            {totalPages > 1 && (
                                <div className={`flex ${isMobile ? 'mt-12 mb-8' : 'mt-8'} ${isMobile ? 'justify-end' : 'justify-end'}`}>
                                    <div 
                                        className="flex flex-row items-start"
                                        style={{
                                            padding: '0px',
                                            gap: isMobile ? '8px' : '8px',
                                            width: isMobile ? 'auto' : '152px',
                                            height: '32px',
                                            flex: 'none',
                                            order: 1,
                                            flexGrow: 0
                                        }}
                                    >
                                        {/* Previous Button - Always reserve space */}
                                        <div className={isMobile ? 'w-8 h-8' : 'w-8 h-8'}>
                                            {currentPage > 1 && (
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    className={`${isMobile ? 'w-8 h-8 rounded-lg' : 'w-8 h-8 rounded'} flex items-center justify-center transition-colors bg-black text-white border border-white hover:bg-gray-800`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>

                                        {/* Page Numbers */}
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`${isMobile ? 'w-8 h-8 rounded-lg' : 'w-8 h-8 rounded'} flex items-center justify-center text-sm font-medium transition-colors border ${
                                                    currentPage === page
                                                        ? 'bg-white text-black border-white'
                                                        : 'bg-black text-white border-white hover:bg-gray-800'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}

                                        {/* Next Button - Always reserve space */}
                                        <div className={isMobile ? 'w-8 h-8' : 'w-8 h-8'}>
                                            {currentPage < totalPages && (
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    className={`${isMobile ? 'w-8 h-8 rounded-lg' : 'w-8 h-8 rounded'} flex items-center justify-center transition-colors bg-black text-white border border-white hover:bg-gray-800`}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                </div>
            </div>
        </div>
    );
};

const ReviewsPage: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="bg-[#0D0D0D] min-h-screen text-white font-sans flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <ReviewsContent />
        </Suspense>
    );
};

export default ReviewsPage;

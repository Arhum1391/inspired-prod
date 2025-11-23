'use client';

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import LoadingScreen from '@/components/LoadingScreen';
import { useAuth } from '@/contexts/AuthContext';
import type { ResearchReport } from '@/data/researchReports';

type FilterOption = 'All' | 'Latest Uploaded' | 'All Dates';
const FILTER_OPTIONS: FilterOption[] = ['All', 'Latest Uploaded', 'All Dates'];

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const RESEARCH_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const formatResearchDate = (value: string) => {
  if (!value) return '';
  if (DATE_INPUT_REGEX.test(value)) {
    const [year, month, day] = value.split('-').map((part) => Number(part));
    if (![year, month, day].some((part) => Number.isNaN(part))) {
      return RESEARCH_DATE_FORMATTER.format(new Date(year, month - 1, day));
    }
  }
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return RESEARCH_DATE_FORMATTER.format(parsed);
  }
  return value;
};

const formatReadTime = (value: string) => {
  if (!value) return '';
  const numeric = Number(value);
  if (!Number.isNaN(numeric) && value.trim() !== '') {
    return `${numeric} min read`;
  }
  return value;
};

export default function ResearchPage() {
  const { isAuthenticated: isSignedIn, isLoading } = useAuth();
  const router = useRouter();
  const isAuthenticated = isSignedIn;
  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});
  const [shariahOnly, setShariahOnly] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [researchCards, setResearchCards] = useState<ResearchReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/research');
        if (response.ok) {
          const data = await response.json();
          setResearchCards(data);
        }
      } catch (error) {
        console.error('Failed to fetch research reports:', error);
      } finally {
        setReportsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading || reportsLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  const previewCards = researchCards.slice(0, 3);

  const toggleTile = (index: number) => {
    setExpandedTiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const parseDate = (value: string) => {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const baseFilteredCards = researchCards.filter(card => {
    if (shariahOnly && !card.shariahCompliant) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = `${card.title} ${card.description} ${card.category}`.toLowerCase();
    return haystack.includes(normalizedQuery);
  });

  let filteredCards = baseFilteredCards;
  if (activeFilter === 'Latest Uploaded') {
    filteredCards = [...baseFilteredCards].sort((a, b) => parseDate(b.date) - parseDate(a.date));
  } else if (activeFilter === 'All Dates') {
    filteredCards = [...baseFilteredCards].sort((a, b) => parseDate(a.date) - parseDate(b.date));
  }

  const chunkedCards: ResearchReport[][] = [];
  for (let i = 0; i < filteredCards.length; i += 3) {
    chunkedCards.push(filteredCards.slice(i, i + 3));
  }

  // const renderResearchCard = (card: ResearchReport, key: string) => (
  //   <div
  //     key={key}
  //     className="relative overflow-hidden research-card"
  //     style={{
  //       boxSizing: 'border-box',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'flex-start',
  //       padding: '24px',
  //       gap: '24px',
  //       isolation: 'isolate',
  //       width: '414px',
  //       height: '281px',
  //       background: '#1F1F1F',
  //       borderRadius: '16px',
  //     }}
  //   >
  //     <div
  //       className="absolute pointer-events-none"
  //       style={{
  //         width: '588px',
  //         height: '588px',
  //         left: '399px',
  //         top: '-326px',
  //         background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
  //         filter: 'blur(100px)',
  //         transform: 'rotate(90deg)',
  //         zIndex: 0,
  //         borderRadius: '50%',
  //       }}
  //     ></div>

  //     <div
  //       style={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'flex-start',
  //         justifyContent: 'space-between',
  //         gap: '16px',
  //         width: '366px',
  //         height: '173px',
  //         zIndex: 1,
  //       }}
  //       className="card-inner"
  //     >
  //       <div
  //         style={{
  //           display: 'flex',
  //           flexDirection: 'row',
  //           alignItems: 'flex-start',
  //           gap: '8px',
  //         }}
  //       >
  //         <div
  //           style={{
  //             boxSizing: 'border-box',
  //             display: 'flex',
  //             flexDirection: 'row',
  //             justifyContent: 'center',
  //             alignItems: 'center',
  //             padding: '10px',
  //             gap: '10px',
  //             background: 'rgba(5, 176, 179, 0.12)',
  //             border: '1px solid #05B0B3',
  //             borderRadius: '40px',
  //           }}
  //         >
  //           <span
  //             style={{
  //               fontFamily: 'Gilroy-Medium',
  //               fontStyle: 'normal',
  //               fontWeight: 400,
  //               fontSize: '12px',
  //               lineHeight: '100%',
  //               color: '#05B0B3',
  //               whiteSpace: 'nowrap',
  //             }}
  //           >
  //             {card.category}
  //           </span>
  //         </div>
  //       </div>

  //       <h3
  //         style={{
  //           fontFamily: 'Gilroy-SemiBold',
  //           fontStyle: 'normal',
  //           fontWeight: 400,
  //           fontSize: '24px',
  //           lineHeight: '100%',
  //           color: '#FFFFFF',
  //           margin: 0,
  //         }}
  //         className="card-title"
  //       >
  //         {card.title}
  //       </h3>

  //       <p
  //         style={{
  //           fontFamily: 'Gilroy-Regular',
  //           fontStyle: 'normal',
  //           fontWeight: 400,
  //           fontSize: '16px',
  //           lineHeight: '130%',
  //           color: '#FFFFFF',
  //           margin: 0,
  //         }}
  //         className="card-desc"
  //       >
  //         {card.description}
  //       </p>

  //       <div className='h-full flex flex-col justify-between'>
  //         <div
  //           style={{
  //             display: 'flex',
  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             alignItems: 'flex-start',
  //             gap: '16px',
  //             width: '366px',
  //           }}
  //           className="card-meta"
  //         >
  //           <span
  //             style={{
  //               fontFamily: 'Gilroy-Regular',
  //               fontStyle: 'normal',
  //               fontWeight: 400,
  //               fontSize: '14px',
  //               lineHeight: '100%',
  //               color: '#FFFFFF',
  //             }}
  //           >
  //             {formatResearchDate(card.date)}
  //           </span>
  //           <span
  //             style={{
  //               fontFamily: 'Gilroy-Regular',
  //               fontStyle: 'normal',
  //               fontWeight: 400,
  //               fontSize: '14px',
  //               lineHeight: '100%',
  //               color: '#FFFFFF',
  //             }}
  //           >
  //             {formatReadTime(card.readTime)}
  //           </span>
  //         </div>

  //         <div
  //           style={{
  //             display: 'flex',
  //             flexDirection: 'row',
  //             alignItems: 'flex-start',
  //             gap: '16px',
  //             width: '366px',
  //           }}
  //           className="card-cta"
  //         >
  //           <button
  //             type="button"
  //             style={{
  //               boxSizing: 'border-box',
  //               display: 'flex',
  //               flexDirection: 'row',
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               padding: '10px 16px',
  //               gap: '8px',
  //               width: '366px',
  //               height: '36px',
  //               border: '1px solid #FFFFFF',
  //               borderRadius: '100px',
  //               background: 'transparent',
  //               color: '#FFFFFF',
  //               cursor: 'pointer',
  //               fontFamily: 'Gilroy-SemiBold',
  //               fontStyle: 'normal',
  //               fontWeight: 400,
  //               fontSize: '14px',
  //               lineHeight: '100%',
  //             }}
  //             onMouseDown={event => {
  //               event.preventDefault();
  //               event.currentTarget.style.border = '1px solid #FFFFFF';
  //             }}
  //             onFocus={event => {
  //               event.currentTarget.style.outline = 'none';
  //               event.currentTarget.style.border = '1px solid #FFFFFF';
  //             }}
  //             onBlur={event => {
  //               event.currentTarget.style.border = '1px solid #FFFFFF';
  //             }}
  //             onClick={() => router.push(`/research/${card.slug}`)}
  //           >
  //             Read More
  //             <svg
  //               width="16"
  //               height="16"
  //               viewBox="0 0 24 24"
  //               fill="none"
  //               xmlns="http://www.w3.org/2000/svg"
  //             >
  //               <path
  //                 d="M7 17L17 7"
  //                 stroke="white"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //               <path
  //                 d="M10 7H17V14"
  //                 stroke="white"
  //                 strokeWidth="1.5"
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //               />
  //             </svg>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );


  const renderResearchCard = (card: ResearchReport, key: string) => (
    <div
      key={key}
      className="
      relative overflow-hidden 
      flex flex-col items-start
      w-full h-[330px] md:h-[315px] p-6 gap-6
      bg-[#1F1F1F] rounded-2xl
    "
    >
      {/* Glow background */}
      <div
      className="
        absolute pointer-events-none
        w-[588px] h-[588px]
        left-[399px] top-[-326px]
        research-gradient
        blur-[100px] rotate-90 rounded-full z-0
      "
    ></div>

      <div className="flex flex-col justify-between gap-4 h-full z-10">
        {/* Category */}
        <div className="flex flex-row gap-2">
          <div className="flex justify-center items-center px-3 py-2 bg-[#05B0B320] border border-[#05B0B3] rounded-full">
            <span className="text-[12px] text-[#05B0B3] font-medium whitespace-nowrap">
              {card.category}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white text-[24px] font-semibold leading-none">
          {card.title}
        </h3>

        {/* Description */}
        <p className="text-white text-[16px] leading-[130%]">
          {card.description}
        </p>

        {/* Spacer to push CTA down */}
        <div className="flex flex-col justify-between h-full">
          {/* Meta */}
          <div className="flex justify-between items-start w-full text-white text-[14px]">
            <span>{formatResearchDate(card.date)}</span>
            <span>{formatReadTime(card.readTime)}</span>
          </div>

          {/* CTA Button (always at bottom) */}
          <div className="w-full">
            <button
              type="button"
              className="
              w-full h-[36px]
              flex justify-center items-center gap-2
              border border-white rounded-full
              bg-transparent text-white cursor-pointer
              font-semibold text-[14px]
              focus:outline-none
            "
              onClick={() => router.push(`/research/${card.slug}`)}
            >
              Read More
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 7H17V14"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        button:focus,
        button:active,
        button:focus-visible {
          outline: none !important;
        }
        button:focus {
          border: inherit !important;
        }
        button:active {
          border: inherit !important;
        }
        /* Research hero mobile styles */
        @media (max-width: 768px) {
          .research-hero-container {
            padding-top: 148px !important;
            padding-bottom: 64px !important;
          }
          /* Move main section down for unpaid (guest) users on mobile */
          .research-hero-container.is-guest {
            padding-top: 120px !important;
          }
          .research-section-wrapper {
            width: 100% !important;
            max-width: 375px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .research-hero-logo {
            display: none !important;
          }
          .research-title {
            width: 343px !important;
            height: auto !important;
            min-height: 38px !important;
            margin-top: 0 !important;
            font-size: 32px !important;
            line-height: 120% !important;
          }
          /* Guest spacing for title/description on mobile */
          .research-hero-container.is-guest .research-title {
            margin-top: 64px !important;
          }
          .research-description {
            width: 343px !important;
            margin-top: 12px !important;
          }
          .research-hero-container.is-guest .research-description {
            margin-top: 36px !important;
          }
          .research-bullets {
            width: 343px !important;
            height: auto !important;
            gap: 12px !important;
            margin-top: 16px !important;
          }
          .research-bullet-row {
            width: 343px !important;
            height: 16px !important;
          }
          .research-bullet-text {
            width: auto !important;
            height: 16px !important;
            white-space: normal !important;
          }
          .research-cta {
            width: 343px !important;
            height: auto !important;
            gap: 12px !important;
            margin-top: 24px !important;
            flex-direction: column !important;
          }
          .research-cta button {
            width: 343px !important;
            min-width: 343px !important;
          }
          /* Hide custom mobile ellipses in favor of shared SVG background */
          .research-mobile-ellipse {
            display: none !important;
          }
          /* Reduce background SVG size/position on mobile */
          .shariah-background-svg {
            width: 1100px !important;
            height: 565px !important;
            left: -400px !important;
            top: -120px !important;
            rotate: -8deg !important;
          }
          /* Hide toggle label text on mobile */
          .research-toggle-label {
            display: none !important;
          }
          /* Stack research rows as column on mobile */
          .research-cards-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
            width: 373px !important;
          }
          /* Mobile card sizing */
          .research-card {
            width: 373px !important;
            height: 273px !important;
            padding: 20px 12px !important;
            border-radius: 10px !important;
          }
          /* Ensure cards container aligns to search width */
          .research-cards-container {
            width: 373px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          /* Fit card contents within 343x273 */
          .card-inner {
            width: 329px !important;
            height: auto !important;
            gap: 12px !important;
          }
          .card-title {
            width: 339px !important;
            white-space: normal !important;
          }
          .card-desc {
            width: 339px !important;
            white-space: normal !important;
          }
          .card-meta {
            width: 339px !important;
          }
          .card-cta {
            width: 339px !important;
          }
          .research-load-more {
            width: 100% !important;
            max-width: 343px !important;
          }
          /* Guest CTA tile mobile responsive */
          .research-hero-container.is-guest .guest-cta-tile {
            width: 100% !important;
            max-width: 343px !important;
            height: auto !important;
            padding: 20px 12px !important;
            border-radius: 10px !important;
            margin: 0 auto 120px !important;
          }
          .research-hero-container.is-guest .guest-cta-ellipse {
            display: none !important;
          }
          .research-hero-container.is-guest .guest-cta-inner {
            gap: 12px !important;
          }
          .research-hero-container.is-guest .guest-cta-text {
            width: 100% !important;
            height: auto !important;
            gap: 16px !important;
          }
          .research-hero-container.is-guest .guest-cta-text h2 {
            width: 100% !important;
            height: auto !important;
            font-size: 24px !important;
            line-height: 120% !important;
            text-align: center !important;
          }
          .research-hero-container.is-guest .guest-cta-text p {
            width: 100% !important;
            height: auto !important;
            font-size: 14px !important;
            line-height: 130% !important;
            text-align: center !important;
          }
          .research-hero-container.is-guest .guest-cta-actions {
            width: 100% !important;
            height: auto !important;
            margin-top: 16px !important;
            gap: 12px !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .research-hero-container.is-guest .guest-cta-actions button {
            width: 100% !important;
            min-width: 100% !important;
          }
          /* Pricing-like FAQ mobile styles */
          .research-faq-header {
            max-width: 373px !important;
            width: 100% !important;
            align-items: center !important;
            gap: 16px !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            margin-left: auto !important;
            margin-right: auto !important;
            height: auto !important;
            max-width: 373px !important;
            display: flex !important;
          }
          .research-faq-header.is-auth {
            /* Move heading further up on mobile when authenticated */
            padding-top: 10px !important;
            margin-top: 100px !important;
          }
          .research-faq-header.is-guest {
            /* Nudge up on mobile for guests too */
            margin-top: -12px !important;
          }
          .research-faq-header h2 {
            text-align: center !important;
            font-size: 32px !important;
            line-height: 130% !important;
            width: 100% !important;
            max-width: 373px !important;
            height: auto !important;
            min-height: 31px !important;
            margin: 0 !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }
          .research-faq-header p {
            text-align: center !important;
            font-size: 14px !important;
            line-height: 100% !important;
            width: 100% !important;
            max-width: 373px !important;
            height: auto !important;
            min-height: 16px !important;
            margin: 0 !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }
          /* Extra specificity to beat inline styles */
          .research-faq-title {
            width: 100% !important;
            max-width: 373px !important;
            height: auto !important;
            min-height: 31px !important;
            font-size: 32px !important;
            line-height: 130% !important;
            text-align: center !important;
            margin: 0 !important;
            align-self: center !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }
          .research-faq-desc {
            width: 100% !important;
            max-width: 373px !important;
            height: auto !important;
            min-height: 16px !important;
            font-size: 14px !important;
            line-height: 100% !important;
            text-align: center !important;
            margin: 0 !important;
            align-self: center !important;
            white-space: normal !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
          }
          .research-faq-container {
            width: 100% !important;
            max-width: 373px !important;
            gap: 16px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .research-faq-item {
            width: 100% !important;
            max-width: 373px !important;
            padding: 20px !important;
            border-radius: 16px !important;
          }
        }
      `}} />
      <Navbar />

      {/* Background SVG Gradient */}
      <svg className="absolute pointer-events-none shariah-background-svg" viewBox="0 0 635 728" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" style={{ left: '-500px', top: '-80px', width: '1686.4px', height: '934.41px', rotate: '-12deg', zIndex: 0 }}>
        <g filter="url(#filter0_f_shariah)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_shariah)" opacity="1"></path>
        </g>
        <defs>
          <filter id="filter0_f_shariah" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_shariah"></feGaussianBlur>
          </filter>
          <linearGradient id="paint0_linear_shariah" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3813F3"></stop>
            <stop offset="0.307692" stopColor="#DE50EC"></stop>
            <stop offset="0.543269" stopColor="#B9B9E9"></stop>
            <stop offset="0.740385" stopColor="#4B25FD"></stop>
            <stop offset="0.9999" stopColor="#05B0B3"></stop>
          </linearGradient>
        </defs>
      </svg>

      {/* Main Content */}
      <div className="relative z-10">
        <div className={`min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8 flex items-start research-hero-container ${isAuthenticated ? 'is-auth' : 'is-guest'}`}>
          <div className="max-w-7xl mx-auto w-full relative research-section-wrapper">
            {/* Vector Logo */}
            <svg
              width="538"
              height="633"
              viewBox="0 0 538 633"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: '847px',
                top: '-50px',
                transform: 'rotate(5deg)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
              className="research-hero-logo"
            >
              <g opacity="0.5">
                <path d="M485.003 448.627C449.573 580.853 314.193 659.464 182.624 624.21C51.0543 588.956 -26.8824 453.187 8.54736 320.961C43.9772 188.735 179.378 110.129 310.947 145.383L478.648 190.318C517.106 200.623 558.36 174.855 558.36 174.855L485.003 448.627ZM266.707 306.134C223.047 294.435 178.123 320.521 166.366 364.399C154.609 408.277 180.471 453.33 224.131 465.029C267.791 476.727 312.715 450.641 324.472 406.763L345.76 327.316L266.707 306.134Z" fill="url(#paint0_linear_vector_logo_research)" />
                <path d="M417.104 61.0593C428.861 17.1816 473.785 -8.90461 517.445 2.79402C561.105 14.4926 586.967 59.5461 575.21 103.424C563.453 147.301 518.529 173.388 474.869 161.689L395.816 140.507L417.104 61.0593Z" fill="url(#paint1_linear_vector_logo_research)" />
              </g>
              <defs>
                <linearGradient id="paint0_linear_vector_logo_research" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333" />
                  <stop offset="1" stopColor="#1F1F1F" />
                </linearGradient>
                <linearGradient id="paint1_linear_vector_logo_research" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333" />
                  <stop offset="1" stopColor="#1F1F1F" />
                </linearGradient>
              </defs>
            </svg>

            {/* Title - Left Middle */}
            <h1
              style={{
                width: '630px',
                height: '174px',
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '120%',
                color: '#FFFFFF',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '120px',
                position: 'relative',
                zIndex: 2,
              }}
              className="research-title"
            >
              {isAuthenticated
                ? 'Latest Research - Clear, Actionable & Data-Backed'
                : 'Unlock the full experience with Inspired Analyst Premium'
              }
            </h1>
            {/* Description */}
            <p
              style={{
                width: '630px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '130%',
                color: '#FFFFFF',
                marginTop: isAuthenticated ? '0px' : '24px',
              }}
              className="research-description"
            >
              {isAuthenticated
                ? 'Access full reports covering market trends, equity insights, and Shariah-compliant opportunities - updated regularly for serious investors.'
                : 'Full research library, Position Sizing Calculator (save scenarios), portfolio analytics, and Shariah project details. Cancel anytime.'
              }
            </p>

            {/* Mobile-only gradient ellipses were removed in favor of shared SVG background */}
            {/* Bullet Points */}
            {!isAuthenticated && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '16px',
                  width: '630px',
                  height: '112px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  marginTop: '24px',
                }}
                className="research-bullets"
              >
                {[
                  'Deep-dive reports with downloadable PDFs',
                  'Position sizing tailored to your risk',
                  'Portfolio allocation & P/L tracking',
                  'Shariah methodology & detailed screens'
                ].map((bullet, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '630px',
                      height: '16px',
                      flex: 'none',
                      order: index,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                    className="research-bullet-row"
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: 'auto',
                        height: '16px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                      className="research-bullet-text"
                    >
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* Buttons Container */}
            {!isAuthenticated && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '20px',
                  width: '414px',
                  height: '50px',
                  flex: 'none',
                  order: 3,
                  flexGrow: 0,
                  marginTop: '32px',
                }}
                className="research-cta"
              >
                {/* Button 1 */}
                <button
                  style={{
                    padding: '12px 32px',
                    background: '#FFFFFF',
                    color: '#0A0A0A',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontSize: '14px',
                    fontWeight: 400,
                    border: 'none',
                    cursor: 'pointer',
                    flex: 'none',
                    minWidth: '180px',
                    whiteSpace: 'nowrap',
                    outline: 'none',
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onFocus={(e) => e.currentTarget.style.outline = 'none'}
                  onClick={() => router.push('/pricing')}
                >
                  Start Subscription
                </button>
                {/* Button 2 */}
                <button
                  style={{
                    padding: '12px 32px',
                    background: '#000000',
                    color: '#FFFFFF',
                    borderRadius: '100px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontSize: '14px',
                    fontWeight: 400,
                    border: '1px solid #FFFFFF',
                    cursor: 'pointer',
                    flex: 'none',
                    minWidth: '180px',
                    whiteSpace: 'nowrap',
                    outline: 'none',
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                >
                  Watch Free Videos
                </button>
              </div>
            )}

            {/* Latest Research Authenticated Section */}
            {isAuthenticated && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '64px',
                  width: '100%',
                }}
                className="mt-8 md:mt-[320px] research-body"
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '1282px',
                    margin: '0 auto',
                  }}
                  className="research-body-inner"
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '24px',
                      width: '100%',
                    }}
                    className="research-body-head"
                  >
                    <h2
                      style={{
                        fontFamily: 'Gilroy-SemiBold',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '36px',
                        lineHeight: '130%',
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      Latest Research
                    </h2>
                    <p
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      You have full access - explore detailed reports, data visuals, and premium analysis.
                    </p>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      maxWidth: '522px',
                      borderRadius: '8px',
                      background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                      padding: '1px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: '12px',
                        gap: '8px',
                        width: '100%',
                        background: '#0A0A0A',
                        borderRadius: '7px',
                        border: '1px solid #1F1F1F',
                      }}
                      className="research-search"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ flexShrink: 0 }}
                      >
                        <path
                          d="M11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.933 18 14.683 17.214 15.964 15.964C17.214 14.683 18 12.933 18 11C18 7.13401 14.866 4 11 4Z"
                          stroke="#909090"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M20 20L17 17"
                          stroke="#909090"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search reports..."
                        style={{
                          width: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                        }}
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '24px',
                      width: '100%',
                    }}
                    className="research-filter-row"
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                        className="research-filters-group"
                      >
                        {FILTER_OPTIONS.map(option => {
                          const isActive = activeFilter === option;
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setActiveFilter(option)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '14px 12px',
                                gap: '16px',
                                width:
                                  option === 'All'
                                    ? '40px'
                                    : option === 'Latest Uploaded'
                                      ? '132px'
                                      : '81px',
                                height: '32px',
                                background: isActive ? '#FFFFFF' : 'transparent',
                                borderRadius: '80px',
                                border: isActive ? 'none' : '1px solid #909090',
                                cursor: 'pointer',
                                fontFamily: 'Gilroy-Medium',
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: isActive ? '#1F1F1F' : '#9D9D9D',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={shariahOnly}
                        onClick={() => setShariahOnly(prev => !prev)}
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        <div
                          style={{
                            position: 'relative',
                            width: '36px',
                            height: '18px',
                            borderRadius: '30px',
                            background: shariahOnly ? '#05B0B3' : 'rgba(255, 255, 255, 0.1)',
                            border: shariahOnly ? '1px solid #05B0B3' : '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'background 0.2s ease, border 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              position: 'absolute',
                              width: '12px',
                              height: '12px',
                              left: shariahOnly ? '21px' : '3px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: '#FFFFFF',
                              borderRadius: '50%',
                              transition: 'left 0.2s ease',
                            }}
                          ></div>
                        </div>
                        <span
                          style={{
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#9D9D9D',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                          }}
                          className="research-toggle-label"
                        >
                          Shariah-compliant only
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-10 w-full max-w-[1282px] mx-auto">
                  {chunkedCards.length > 0 ? (
                    <div className="flex flex-col items-start gap-5 w-full">
                      {chunkedCards.map((rowCards, rowIndex) => (
                        <div
                          key={`research-row-${rowIndex}`}
                          className="
                            grid grid-cols-1 md:grid-cols-3 gap-5 w-full
                            
                          "
                        >
                          {rowCards.map((card, cardIndex) =>
                            renderResearchCard(card, `${rowIndex}-${cardIndex}-${card.title}`)
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-3 w-full py-12">
                      <h3 className="font-Gilroy-SemiBold font-normal text-[24px] leading-[100%] text-white text-center m-0">
                        No reports found
                      </h3>
                      <p className="font-Gilroy-Medium font-normal text-[16px] leading-[130%] text-[#9D9D9D] text-center m-0">
                        Try adjusting your filters or search terms.
                      </p>
                    </div>
                  )}

                  {filteredCards.length > 0 && (
                    <button
                      type="button"
                      className="
                        flex justify-center items-center gap-2.5
                        max-w-[197px] w-full h-[50px] px-3 py-4
                        bg-white rounded-full border-none cursor-pointer
                        font-Gilroy-SemiBold font-normal text-[14px] leading-[100%] text-black
                        research-load-more
                      "
                    >
                      Load More
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Latest Research Preview Section */}
            {!isAuthenticated && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '64px',
                  width: '100%',
                  marginTop: '220px',
                }}
                className="research-body"
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '24px',
                    width: '100%',
                    maxWidth: '1282px',
                    margin: '0 auto',
                  }}
                  className="research-body-inner research-body-head"
                >
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '36px',
                      lineHeight: '130%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Latest Research
                  </h2>
                  <p
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    You&apos;re viewing a preview. Subscribe to unlock full reports and detailed analysis.
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '1282px',
                    margin: '0 auto',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    overflowX: 'auto',
                  }}
                  className="research-cards-row"
                >
                  {previewCards.map((card, index) => (
                    <div
                      key={card.title}
                      className="relative overflow-hidden research-card"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '24px',
                        gap: '24px',
                        isolation: 'isolate',
                        width: '414px',
                        height: '281px',
                        borderRadius: '16px',
                        background: '#1F1F1F',
                      }}
                    >
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          width: '588px',
                          height: '588px',
                          left: index === 0 ? '399px' : index === 1 ? '350px' : '300px',
                          top: '-326px',
                          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                          filter: 'blur(100px)',
                          transform: 'rotate(90deg)',
                          zIndex: 0,
                          borderRadius: '50%',
                        }}
                      />

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '16px',
                          width: '366px',
                          height: '173px',
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '10px',
                              gap: '10px',
                              background: 'rgba(5, 176, 179, 0.12)',
                              border: '1px solid #05B0B3',
                              borderRadius: '40px',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '100%',
                                color: '#05B0B3',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {card.category}
                            </span>
                          </div>
                        </div>

                        <h3
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '24px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          {card.title}
                        </h3>

                        <p
                          style={{
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '130%',
                            color: '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          {card.description}
                        </p>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '16px',
                            width: '366px',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Gilroy-Regular',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: '#FFFFFF',
                            }}
                          >
                            {formatResearchDate(card.date)}
                          </span>
                          <span
                            style={{
                              fontFamily: 'Gilroy-Regular',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: '#FFFFFF',
                            }}
                          >
                            {formatReadTime(card.readTime)}
                          </span>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: '16px',
                            width: '366px',
                          }}
                        >
                          <button
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '10px 16px',
                              gap: '8px',
                              width: '366px',
                              height: '36px',
                              border: '1px solid #FFFFFF',
                              borderRadius: '100px',
                              background: 'transparent',
                              color: '#FFFFFF',
                              cursor: 'default',
                              fontFamily: 'Gilroy-SemiBold',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                            }}
                          >
                            Read More
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 17L17 7"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M10 7H17V14"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'rgba(31, 31, 31, 0.8)',
                          backdropFilter: 'blur(4px)',
                          borderRadius: '16px',
                          zIndex: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                          pointerEvents: 'none',
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '100%',
                            color: '#FFFFFF',
                            margin: 0,
                            textAlign: 'center',
                          }}
                        >
                          Preview Only
                        </h3>
                        <p
                          style={{
                            fontFamily: 'Gilroy-Regular',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '130%',
                            color: '#FFFFFF',
                            margin: 0,
                            textAlign: 'center',
                          }}
                        >
                          Subscribe to access full reports
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Big Gap */}
            <div style={{ marginTop: isAuthenticated ? '220px' : '160px' }}></div>

            {/* Ready to unlock full access Tile */}
            {!isAuthenticated && (
              <div
                className="relative overflow-hidden guest-cta-tile"
                style={{
                  width: '1064px',
                  height: '247px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '40px',
                  gap: '10px',
                  boxSizing: 'border-box',
                  marginTop: '0px',
                  marginBottom: '220px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                {/* Curved Gradient Border */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                  style={{
                    borderRadius: '16px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>

                {/* Gradient Ellipse - Top Left */}
                <div
                  className="absolute pointer-events-none guest-cta-ellipse"
                  style={{
                    width: '588px',
                    height: '588px',
                    left: '-403px',
                    top: '-510px',
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    filter: 'blur(200px)',
                    transform: 'rotate(90deg)',
                    flex: 'none',
                    flexGrow: 0,
                    zIndex: 0,
                    borderRadius: '50%'
                  }}
                ></div>

                {/* Gradient Ellipse - Bottom Right */}
                <div
                  className="absolute pointer-events-none guest-cta-ellipse"
                  style={{
                    width: '588px',
                    height: '588px',
                    left: '739px',
                    bottom: '-510px',
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    filter: 'blur(200px)',
                    transform: 'rotate(90deg)',
                    flex: 'none',
                    flexGrow: 0,
                    zIndex: 1,
                    borderRadius: '50%'
                  }}
                ></div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center guest-cta-inner" style={{ gap: '10px' }}>
                  {/* Frame 81 */}
                  <div
                    className="guest-cta-text"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '24px',
                      width: '461px',
                      height: '77px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                    }}
                  >
                    {/* Title */}
                    <h2
                      style={{
                        width: '461px',
                        height: '32px',
                        fontFamily: 'Gilroy-SemiBold',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '32px',
                        lineHeight: '100%',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        margin: 0,
                      }}
                    >
                      Ready to unlock full access?
                    </h2>

                    {/* Description */}
                    <p
                      style={{
                        width: '461px',
                        height: '21px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '16px',
                        lineHeight: '130%',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                        margin: 0,
                      }}
                    >
                      Join thousands of informed investors making better decisions.
                    </p>
                  </div>

                  {/* Buttons Container */}
                  <div
                    className="guest-cta-actions"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '20px',
                      width: '414px',
                      height: '50px',
                      flex: 'none',
                      flexGrow: 0,
                      marginTop: '24px',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  >
                    {/* Button 1 */}
                    <button
                      style={{
                        padding: '12px 32px',
                        background: '#FFFFFF',
                        color: '#0A0A0A',
                        borderRadius: '100px',
                        fontFamily: 'Gilroy-SemiBold',
                        fontSize: '14px',
                        fontWeight: 400,
                        border: 'none',
                        cursor: 'pointer',
                        flex: 'none',
                        minWidth: '180px',
                        whiteSpace: 'nowrap',
                        outline: 'none',
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onFocus={(e) => e.currentTarget.style.outline = 'none'}
                      onClick={() => router.push('/pricing')}
                    >
                      Start Subscription
                    </button>
                    {/* Button 2 */}
                    <button
                      style={{
                        padding: '12px 32px',
                        background: 'transparent',
                        color: '#FFFFFF',
                        borderRadius: '100px',
                        fontFamily: 'Gilroy-SemiBold',
                        fontSize: '14px',
                        fontWeight: 400,
                        border: '1px solid #FFFFFF',
                        cursor: 'pointer',
                        flex: 'none',
                        minWidth: '180px',
                        whiteSpace: 'nowrap',
                        outline: 'none',
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.border = '1px solid #FFFFFF';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = 'none';
                        e.currentTarget.style.border = '1px solid #FFFFFF';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.border = '1px solid #FFFFFF';
                      }}
                    >
                      Watch Free Videos
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Frequently Asked Questions Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '847px',
                height: '87px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: isAuthenticated ? '220px' : '0px',
              }}
              className={`research-faq-header ${isAuthenticated ? 'is-auth' : 'is-guest'}`}
            >
              {/* Heading */}
              <h2
                style={{
                  width: '847px',
                  height: '47px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '130%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
                className="research-faq-title"
              >
                Frequently Asked Questions
              </h2>

              {/* Description */}
              <p
                style={{
                  width: '847px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
                className="research-faq-desc"
              >
                Everything you need to know about your subscription.
              </p>
            </div>

            {/* FAQ Tiles Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '1064px',
                marginTop: isAuthenticated ? '24px' : '48px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              className="research-faq-container"
            >
              {[
                { question: 'Can I cancel anytime?', answer: 'Yes - your access continues until your period ends.' },
                { question: 'Do you offer refunds?', answer: 'We offer a 7-day money-back guarantee for all new subscribers.' },
                { question: 'What\'s Included?', answer: 'Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.' },
                { question: 'Will you add more features?', answer: 'Yes! We continuously improve our platform and add new features based on user feedback.' }
              ].map((faq, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden research-faq-item"
                  style={{
                    width: '1064px',
                    height: expandedTiles[index] ? 'auto' : '68px',
                    borderRadius: '16px',
                    background: '#1F1F1F',
                    padding: '24px',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'height 0.3s ease',
                  }}
                  onClick={() => toggleTile(index)}
                >
                  {/* Curved Gradient Border */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-2xl"
                    style={{
                      borderRadius: '16px',
                      padding: '1px',
                      background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                    }}
                  >
                    <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                    <h3
                      style={{
                        fontFamily: 'Gilroy-SemiBold',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '20px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      {faq.question}
                    </h3>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        transform: expandedTiles[index] ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        flexShrink: 0,
                      }}
                    >
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {expandedTiles[index] && (
                    <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                      <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Newsletter Subscription */}
            {isAuthenticated && (
              <div className="mt-16 mb-16 w-full" style={{ marginTop: '220px' }}>
                <NewsletterSubscription />
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import CollaborationForm from '@/components/sections/CollaborationForm';
import Footer from '@/components/Footer';
import Link from 'next/link';

type Analyst = {
  id: number;
  name: string;
  description: string;
  image: string;
  about?: string;
  slug?: string; // URL-friendly slug from API
};

const MOBILE_BELT_IMAGE_STYLE = {
  width: '120px',
  height: '72px',
  borderRadius: '80px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
};

const MOBILE_BELT_ROW1_IMAGES = [
  'team-mob/1.png',
  'team-mob/2 improved.png',
  'team-mob/3.jpg',
  'team-mob/4 - colored.png',
  'team-mob/5.png',
  'team-mob/6.jpg',
  'team-mob/7.png',
  'team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg',
];

const MOBILE_BELT_ROW2_IMAGES = [
  'team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg',
  'team-mob/7.png',
  'team-mob/6.jpg',
  'team-mob/5.png',
  'team-mob/4 - colored.png',
  'team-mob/3.jpg',
  'team-mob/2 improved.png',
  'team-mob/1.png',
];

const renderMobileBeltRow = (images: string[], animationClass: string) => (
  <div className={`${animationClass} flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4`}>
    {[...images, ...images].map((src, index) => (
      <div
        key={`${animationClass}-${index}-${src}`}
        className="rounded-[80px] overflow-hidden bg-zinc-800 flex-shrink-0"
        style={{
          ...MOBILE_BELT_IMAGE_STYLE,
          backgroundImage: `url("${src}")`,
        }}
      ></div>
    ))}
  </div>
);

export default function AboutPage() {
  const router = useRouter();
  const [analysts, setAnalysts] = useState<Analyst[]>([]);
  const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
  const [teamDataError, setTeamDataError] = useState<string>('');
  const [analystAboutData, setAnalystAboutData] = useState<Record<number, string>>({});

  // Function to fetch analyst about data
  const fetchAnalystAbout = async (analystName: string): Promise<string> => {
    try {
      const response = await fetch('/api/analyst-about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: analystName }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.about || 'No additional information available.';
      }
      return 'No additional information available.';
    } catch (error) {
      console.error('Error fetching analyst about data:', error);
      return 'No additional information available.';
    }
  };

  // Function to fetch about data for all analysts
  const fetchAllAnalystAbout = async (analystsList: Analyst[]) => {
    const aboutData: Record<number, string> = {};
    
    for (const analyst of analystsList) {
      const about = await fetchAnalystAbout(analyst.name);
      aboutData[analyst.id] = about;
    }
    
    setAnalystAboutData(aboutData);
  };

  // Data validation function
  const validateAnalystData = (analyst: Analyst) => {
    const isValid = analyst && 
                   typeof analyst.id === 'number' && 
                   typeof analyst.name === 'string' && 
                   typeof analyst.description === 'string' &&
                   typeof analyst.image === 'string';
    
    if (!isValid) {
      console.warn('⚠️ Invalid analyst data:', analyst);
    }
    
    return isValid;
  };

  // Function to fetch team data from MongoDB
  const fetchTeamData = async (retryCount = 0) => {
    try {
      console.log(`🔄 Fetching team data from API... (attempt ${retryCount + 1})`);
      setTeamDataError('');
      
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        
        // Use the transformed analyst data directly and sort by ID
        const sortedAnalysts = data.team.sort((a: Analyst, b: Analyst) => a.id - b.id);
        
        // Validate data before setting
        const validAnalysts = sortedAnalysts.filter(validateAnalystData);
        if (validAnalysts.length !== sortedAnalysts.length) {
          console.warn('⚠️ Some analyst data is invalid, filtering out invalid entries');
        }
        
        setAnalysts(validAnalysts);
        setIsTeamDataLoaded(true);
        console.log('✅ Team data loaded successfully');
        
        // Fetch about data for all analysts
        fetchAllAnalystAbout(validAnalysts);
      } else {
        console.error('❌ API failed with status:', response.status);
        
        // Retry logic for 500 errors
        if (response.status === 500 && retryCount < 2) {
          console.log(`🔄 Retrying in ${(retryCount + 1) * 1000}ms...`);
          setTimeout(() => {
            fetchTeamData(retryCount + 1);
          }, (retryCount + 1) * 1000);
          return;
        }
        
        setTeamDataError('We encountered an issue, please try again later');
        setIsTeamDataLoaded(true);
      }
    } catch (error) {
      console.error('❌ Error fetching team data:', error);
      
      // Retry logic for network errors
      if (retryCount < 2) {
        console.log(`🔄 Retrying in ${(retryCount + 1) * 1000}ms...`);
        setTimeout(() => {
          fetchTeamData(retryCount + 1);
        }, (retryCount + 1) * 1000);
        return;
      }
      
      setTeamDataError('We encountered an issue, please try again later');
      setIsTeamDataLoaded(true);
    }
  };

  // Fetch team data on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTeamData();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  console.log("analysts", analysts)

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white relative overflow-hidden">
      {/* Top Right Gradient Ellipse */}
      <div 
        className="absolute pointer-events-none opacity-100 hidden md:block"
        style={{
          width: '400px',
          height: '400px',
          left: '1300px',
          top: '-100px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          zIndex: 5,
        }}
      ></div>
      {/* Mobile Top Right Gradient Ellipse */}
      <div
        className="absolute pointer-events-none opacity-100 md:hidden"
        style={{
          width: '520px',
          height: '520px',
          left: '160px',
          top: '-440px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(100px)',
          transform: 'rotate(-60deg)',
          zIndex: 4,
        }}
      ></div>
      {/* Mobile Top Fade Mask */}
      <div
        className="absolute pointer-events-none md:hidden"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(180deg, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0) 100%)',
          zIndex: 15,
        }}
      ></div>
      
      <Navbar />
      
      {/* Main Content - Centered with gap from navbar */}
      <div className="pt-[120px] sm:pt-[140px] md:pt-[180px] flex flex-col items-center" style={{ position: 'relative', zIndex: 10 }}>
        {/* Frame 25 - Centered Container (Title and Description only) */}
        <div 
          className="flex flex-col items-center px-4 sm:px-6"
          style={{
            width: '846px',
            maxWidth: '100%',
            gap: '24px',
          }}
        >
          {/* Title */}
          <h1
            className="text-center text-white text-[32px] sm:text-[40px] md:text-[48px]"
            style={{
              width: '100%',
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '120%',
              color: '#FFFFFF',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0,
            }}
          >
            Clarity in Finance, Powered by Insight
          </h1>

          {/* Description */}
          <p
            className="text-center text-white text-[14px] sm:text-[16px]"
            style={{
              width: '100%',
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400,
              lineHeight: '130%',
              color: '#FFFFFF',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
            }}
          >
            At Inspired Analyst, we make complex financial analysis simple, practical, and actionable - helping learners and investors focus on what truly matters
          </p>
        </div>
        
        {/* Image Belts - Below Description */}
        <div className="flex flex-col justify-center items-center relative w-full overflow-x-hidden overflow-y-hidden mt-4 py-4" style={{ zIndex: 10 }}>
          {/* Mobile: Horizontal Belts */}
          <div className="lg:hidden flex flex-col justify-center items-center h-40 sm:h-48 relative w-full overflow-hidden mt-10">
            <div className="flex flex-col w-full h-full gap-2">
              {/* Belt 1 - Rectangle 1 Images */}
              <div className="flex-1 fade-mask overflow-hidden">
                {renderMobileBeltRow(MOBILE_BELT_ROW1_IMAGES, 'animate-scrollUp')}
              </div>

              {/* Belt 2 - Rectangle 2 Images */}
              <div className="flex-1 fade-mask overflow-hidden">
                {renderMobileBeltRow(MOBILE_BELT_ROW2_IMAGES, 'animate-scrollDown')}
              </div>
              </div>
          </div>

          {/* Desktop: Horizontal Belt with Desktop Dimensions - Alternating Scroll Directions */}
          <div className="hidden lg:flex flex-row gap-6 items-center w-full overflow-x-hidden relative mt-8" style={{ justifyContent: 'flex-start', paddingLeft: '10px', paddingRight: '48px' }}>
              <div className="fade-mask overflow-x-visible">
                  <div className="flex flex-row gap-6 items-center" style={{
                      width: 'calc(12 * ((100vw - 192px) / 13) + 11 * 24px)'
                  }}>
                      {/* Image 1 (Odd) - Scrolls Up - From MeetingsPage */}
                      <div className="animate-scrollUp overflow-hidden">
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/5.png")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 2 (Even) - Scrolls Down */}
                      <div className="animate-scrollDown overflow-hidden" style={{ marginTop: 'calc(((100vw - 192px) / 13) * 1.1)' }}>
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 3 (Odd) - Scrolls Up - From MeetingsPage */}
                      <div className="animate-scrollUp overflow-hidden">
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/6.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 4 (Even) - Scrolls Down */}
                      <div className="animate-scrollDown overflow-hidden" style={{ marginTop: 'calc(((100vw - 192px) / 13) * 1.1)' }}>
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 5 (Odd) - Scrolls Up - From MeetingsPage */}
                      <div className="animate-scrollUp overflow-hidden">
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/7.png")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 6 (Even) - Scrolls Down */}
                      <div className="animate-scrollDown overflow-hidden" style={{ marginTop: 'calc(((100vw - 192px) / 13) * 1.1)' }}>
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 7 (Odd) - Scrolls Up - From MeetingsPage */}
                      <div className="animate-scrollUp overflow-hidden">
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/2.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 8 (Even) - Scrolls Down */}
                      <div className="animate-scrollDown overflow-hidden" style={{ marginTop: 'calc(((100vw - 192px) / 13) * 1.1)' }}>
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 9 (Odd) - Scrolls Up - From MeetingsPage */}
                      <div className="animate-scrollUp overflow-hidden">
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/1.png")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 10 (Even) - Scrolls Down */}
                      <div className="animate-scrollDown overflow-hidden" style={{ marginTop: 'calc(((100vw - 192px) / 13) * 1.1)' }}>
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/rectangle 3/6f56bacd424b99039a802a8a0f9f6cc53ed558a0.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 11 (Odd) - Scrolls Up - From MeetingsPage */}
                      <div className="animate-scrollUp overflow-hidden">
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/3.jpg")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                      {/* Image 12 (Even) - Scrolls Down */}
                      <div className="animate-scrollDown overflow-hidden" style={{ marginTop: 'calc(((100vw - 192px) / 13) * 1.1)' }}>
                          <div
                              className="aspect-[1/2.2] rounded-full bg-zinc-800 flex-shrink-0"
                              style={{
                                  width: 'calc((100vw - 192px) / 13)',
                                  minWidth: 'calc((100vw - 192px) / 13)',
                                  maxWidth: 'calc((100vw - 192px) / 13)',
                                  height: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  minHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  maxHeight: 'calc(((100vw - 192px) / 13) * 2.2)',
                                  flexShrink: 0,
                                  backgroundImage: 'url("/inspired analysts team/4.png")',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat'
                              }}
                          ></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Mobile Text Block */}
          <div className="lg:hidden w-full flex justify-center mt-10">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                padding: '24px 16px 0px',
                width: '100%',
                maxWidth: '375px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 0,
                  gap: '24px',
                  width: '100%',
                  maxWidth: '343px',
                }}
              >
                <p
                  style={{
                    width: '100%',
                    maxWidth: '343px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '24px',
                    lineHeight: '180%',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  We believe great analysis isn't about predicting markets - it's about understanding them deeply enough to make confident decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Group 12 - Content Below Belt */}
          <div className="hidden lg:flex w-full flex-col items-center mt-60 mb-16">
            <p
              className="text-center text-white"
              style={{
                width: '1064px',
                maxWidth: '100%',
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '36px',
                lineHeight: '180%',
                textAlign: 'center',
                textTransform: 'capitalize',
                color: '#FFFFFF',
              }}
            >
              We believe great analysis isn't about predicting markets - it's about understanding them deeply enough to make confident decisions.
            </p>
          </div>

          {/* Frame 86 - Meet the Founder Section */}
          <div className="w-full flex flex-col items-center justify-center mt-24 md:mt-60" style={{
            width: '846px',
            maxWidth: '100%',
            gap: '40px',
            padding: '0px',
          }}>
            {/* Group 12 - Meet the Founder Heading */}
            <div className="w-full" style={{
              width: '846px',
              maxWidth: '100%',
              height: '65px',
            }}>
              <h2
                className="text-center text-white"
                style={{
                  width: '100%',
                  height: '65px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '180%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                }}
              >
                Meet the Founder
              </h2>
            </div>

            {/* Frame 77 - Content Row */}
            <div className="flex flex-row justify-center items-center" style={{
              width: '846px',
              maxWidth: '100%',
              height: 'auto',
              gap: '40px',
              padding: '0px',
              flexWrap: 'wrap',
            }}>
              {/* Frame 32 - Founder Image Card */}
              <div
                className="flex flex-col justify-center items-start md:p-4"
                style={{
                  boxSizing: 'border-box',
                  width: '343px',
                  height: '303px',
                  background: 'url("/team dark/Adnan.png"), #1F1F1F',
                  backgroundSize: '110%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '10px',
                  gap: '16px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'rgba(255,255,255,0.2)',
                  padding: '16px',
                }}
              >
              </div>

              {/* Frame 74 - Founder Info */}
              <div
                className="flex flex-col items-start gap-8"
                style={{
                  width: '100%',
                  maxWidth: '343px',
                }}
              >
                {/* Description Text */}
                <div
                  className="text-white"
                  style={{
                    width: '100%',
                    maxWidth: '343px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '130%',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    I transform complex financial concepts into actionable insights that drive real results. As a content creator specializing in market analysis, cryptocurrency trends, and data science applications in finance, my approach combines rigorous technical analysis with clear, engaging explanations.
                  </p>
                  <p style={{ margin: 0 }}>
                    Whether you're a beginner taking your first steps into investing or an experienced trader looking for fresh perspectives, my content bridges the gap between complex market dynamics and practical decision-making.
                  </p>
                </div>

                {/* Frame 23 - Book Mentorship Button */}
                <Link
                 href="/meetings/adnan"
                  // href={`/meetings?step=2&selectedAnalyst=${analysts.length > 0 ? analysts[0].id : 0}`}
                  className="flex flex-row justify-center items-center w-full md:w-auto md:max-w-[187px] mt-4 md:mt-0"
                  style={{
                    width: '100%',
                    maxWidth: '343px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    height: '48px',
                    background: '#FFFFFF',
                    borderRadius: '100px',
                    textDecoration: 'none',
                  }}
                >
                  <span
                    className="text-center"
                    style={{
                      
                      height: '14px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#0A0A0A',
                    }}
                  >
                    Book Mentorship
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Frame 1000012164 - The Team Behind Inspired Analyst */}
          <div className="w-full flex flex-col items-center mt-16 lg:mt-60">
            <div
              className="flex flex-col items-start gap-6"
              style={{
                width: '100%',
                maxWidth: '343px',
              }}
            >
            {/* The Team Behind Inspired Analyst Heading */}
            <h2
              className="text-center text-white"
              style={{
                width: '100%',
                maxWidth: '343px',
                height: '90px',
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '36px',
                lineHeight: '125%',
                textAlign: 'center',
                color: '#FFFFFF',
              }}
            >
              The Team Behind Inspired Analyst
            </h2>

            {/* Description */}
            <p
              className="text-center text-white"
              style={{
                width: '100%',
                maxWidth: '343px',
                height: '42px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '130%',
                textAlign: 'center',
                color: '#FFFFFF',
              }}
            >
              A group of analysts, and educators dedicated to clarity and credibility.
            </p>
            </div>
          </div>

          {/* Team Cards Grid */}
          <div className="w-full flex flex-col items-center mt-12 mb-16" style={{ padding: '0 16px' }}>
            {teamDataError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <div>
                    <p className="text-red-400 font-medium">{teamDataError}</p>
                    <button 
                      onClick={() => fetchTeamData()}
                      className="text-red-300 text-sm underline hover:text-red-200 mt-1"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!isTeamDataLoaded && !teamDataError && (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
                style={{
                  gap: '32px 20px',
                  width: 'fit-content',
                  margin: '0 auto',
                }}
              >
                {Array.from({ length: 6 }, (_, index) => (
                  <div 
                    key={index} 
                    className="flex flex-col items-center"
                    style={{
                      boxSizing: 'border-box',
                      padding: '20px',
                      gap: '20px',
                      width: '341px',
                      height: '302px',
                      background: '#1F1F1F',
                      borderRadius: '16px',
                    }}
                  >
                    <div className="w-full h-40 bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="w-full h-4 bg-gray-600 rounded animate-pulse"></div>
                    <div className="w-full h-3 bg-gray-600 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            )}

            {isTeamDataLoaded && !teamDataError && analysts.length > 0 && (
              <div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center"
                style={{
                  gap: '32px 20px',
                  width: 'fit-content',
                  margin: '0 auto',
                }}
              >
                {analysts
                  .filter((analyst) => analyst.description?.toLowerCase() !== 'founder-inspired analyst')
                  .map((analyst) => (
                  <div
                    key={analyst.id}
                    className="flip-card"
                    style={{ position: 'relative' }}
                  >
                    <div className="flip-card-inner" style={{ pointerEvents: 'auto' }}>
                      {/* Front of Card - Image, Name, Role */}
                      <div className="flip-card-front relative overflow-hidden flex flex-col items-center"
                        style={{
                          boxSizing: 'border-box',
                          padding: '20px',
                          gap: '20px',
                          width: '341px',
                          height: '302px',
                          borderRadius: '16px',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                        }}
                      >
                        {/* Curved Gradient Border */}
                        <div 
                          className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                          style={{
                            background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                          }}
                        >
                          <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                        </div>

                        {/* Frame 1000012167 - Inner Container */}
                        <div
                          className="relative z-10 flex flex-col items-start w-full"
                          style={{
                            gap: '16px',
                            width: '301px',
                            height: '262px',
                          }}
                        >
                          {/* Rectangle 440 - Image */}
                          <div
                            className="relative overflow-hidden rounded-full mx-auto"
                            style={{
                              width: '160px',
                              height: '160px',
                              background: '#1F1F1F',
                              borderRadius: '50%',
                              userSelect: 'none',
                              WebkitUserSelect: 'none',
                              MozUserSelect: 'none',
                              msUserSelect: 'none',
                              pointerEvents: 'none',
                            }}
                          >
                            {analyst.image && analyst.image.trim() !== '' ? (
                              <Image
                                src={analyst.image}
                                alt={analyst.name}
                                fill
                                className="object-cover rounded-full"
                                draggable={false}
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'flex';
                                  }
                                }}
                                style={{
                                  userSelect: 'none',
                                  WebkitUserSelect: 'none',
                                  MozUserSelect: 'none',
                                  msUserSelect: 'none',
                                  pointerEvents: 'none',
                                  borderRadius: '50%',
                                }}
                              />
                            ) : null}
                            <div 
                              className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-lg font-bold"
                              style={{display: analyst.image && analyst.image.trim() !== '' ? 'none' : 'flex'}}
                            >
                              {analyst.name.charAt(0)}
                            </div>
                          </div>

                          {/* Frame 1000004776 - Text Container */}
                          <div
                            className="flex flex-col items-start w-full"
                            style={{
                              gap: '8px',
                              width: '301px',
                              height: '46px',
                            }}
                          >
                            {/* Name */}
                            <h3
                              className="text-center text-white w-full"
                              style={{
                                width: '301px',
                                height: '20px',
                                fontFamily: 'Gilroy-SemiBold',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '20px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#FFFFFF',
                              }}
                            >
                              {analyst.name}
                            </h3>

                            {/* Frame 99 - Role Container */}
                            <div
                              className="flex flex-row items-center w-full"
                              style={{
                                gap: '24px',
                                width: '301px',
                                height: '18px',
                              }}
                            >
                              <p
                                className="text-center text-gray-400 flex-1"
                                style={{
                                  width: '301px',
                                  height: '18px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '130%',
                                  textAlign: 'center',
                                  color: '#909090',
                                }}
                              >
                                {analyst.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Back of Card - Description and Buttons */}
                      <div className="flip-card-back relative overflow-hidden flex flex-col items-center"
                        style={{
                          boxSizing: 'border-box',
                          padding: '20px',
                          gap: '16px',
                          width: '341px',
                          height: '302px',
                          borderRadius: '16px',
                          pointerEvents: 'auto',
                          userSelect: 'none',
                          WebkitUserSelect: 'none',
                          MozUserSelect: 'none',
                          msUserSelect: 'none',
                        }}
                      >
                        {/* Curved Gradient Border */}
                        <div 
                          className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                          style={{
                            background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                          }}
                        >
                          <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                        </div>

                        {/* Back Content */}
                        <div
                          className="relative flex flex-col items-center w-full h-full justify-between"
                          style={{
                            width: '301px',
                            height: '262px',
                            pointerEvents: 'auto',
                            zIndex: 20,
                            position: 'relative',
                          }}
                        >
                          {/* Name - Centered */}
                          <h3
                            className="text-center text-white w-full"
                            style={{
                              fontFamily: 'Gilroy-SemiBold',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '20px',
                              lineHeight: '100%',
                              textAlign: 'center',
                              color: '#FFFFFF',
                              marginBottom: '8px',
                            }}
                          >
                            {analyst.name}
                          </h3>

                          {/* Role - Centered below name */}
                          <p
                            className="text-center text-gray-400 w-full"
                            style={{
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '130%',
                              textAlign: 'center',
                              color: '#909090',
                              marginBottom: '12px',
                            }}
                          >
                            {analyst.description}
                          </p>

                          {/* Description - Scrollable */}
                          <div
                            className="flex-1 overflow-y-auto w-full flip-card-description-scroll"
                            style={{
                              maxHeight: '120px',
                              minHeight: '0',
                              paddingRight: '4px',
                              cursor: 'pointer',
                              pointerEvents: 'auto',
                              position: 'relative',
                              zIndex: 15,
                            }}
                          >
                            <p
                              className="text-white text-sm leading-relaxed"
                              style={{
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '130%',
                                color: '#FFFFFF',
                                whiteSpace: 'pre-line',
                              }}
                            >
                              {analystAboutData[analyst.id] || 'Loading description...'}
                            </p>
                          </div>

                          {/* Buttons - Side by Side */}
                          <div 
                            className="flex flex-row gap-2 w-full mt-auto" 
                            style={{ 
                              position: 'relative', 
                              zIndex: 25,
                              pointerEvents: 'auto',
                              width: '100%',
                            }}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/reviews?analyst=${analyst.id}&selectedAnalyst=${analyst.id}`);
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onMouseUp={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="flex-1 flex flex-row justify-center items-center"
                              style={{
                                padding: '8px 16px',
                                gap: '10px',
                                height: '36px',
                                background: '#1F1F1F',
                                borderRadius: '100px',
                                border: '1px solid #FFFFFF',
                                cursor: 'pointer',
                                fontFamily: 'Gilroy-SemiBold',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#FFFFFF',
                                position: 'relative',
                                zIndex: 26,
                                pointerEvents: 'auto',
                                outline: 'none',
                                WebkitTapHighlightColor: 'transparent',
                              }}
                            >
                              View All Reviews
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Use slug directly from API (API ensures slug is always present and valid)
                                if (analyst.slug) {
                                  router.push(`/meetings/${analyst.slug}`);
                                } else {
                                  router.push('/meetings');
                                }
                              }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onMouseUp={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              className="flex-1 flex flex-row justify-center items-center"
                              style={{
                                padding: '8px 16px',
                                gap: '10px',
                                height: '36px',
                                background: '#FFFFFF',
                                borderRadius: '100px',
                                cursor: 'pointer',
                                fontFamily: 'Gilroy-SemiBold',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#0A0A0A',
                                position: 'relative',
                                zIndex: 26,
                                pointerEvents: 'auto',
                                outline: 'none',
                                WebkitTapHighlightColor: 'transparent',
                              }}
                            >
                              Book Mentorship
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
              </div>
            )}

            {isTeamDataLoaded && !teamDataError && analysts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-400 text-2xl">👥</span>
                </div>
                <p className="text-gray-400 text-lg">No team members available at the moment</p>
                <button 
                  onClick={() => fetchTeamData()}
                  className="text-indigo-400 hover:text-indigo-300 underline mt-2"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>

          {/* Newsletter Subscription Form Tile */}
          <div
            className="mt-16 mb-16 w-full box-border about-newsletter-section"
            style={{
              width: '100%',
              maxWidth: '1064px',
              margin: '64px auto',
              padding: 0,
            }}
          >
            <NewsletterSubscription />
          </div>

          {/* Collaboration Form */}
          <div className="mt-16 mb-16 w-full">
            <CollaborationForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
      <style jsx>{`
        @media (max-width: 768px) {
          .about-newsletter-section {
            width: 100% !important;
            max-width: none !important;
            margin: 48px 0 !important;
            padding: 0 !important;
          }
          .about-newsletter-section > div {
            width: 100% !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

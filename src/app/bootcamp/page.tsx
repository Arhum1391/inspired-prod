'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { NewsletterSubscription } from '@/components';
import BootcampCardSkeleton from '@/components/BootcampCardSkeleton';
import LoadingScreen from '@/components/LoadingScreen';
import { Bootcamp } from '@/types/admin';
import { getFallbackBootcamps } from '@/lib/fallbackBootcamps';
import { useAuth } from '@/contexts/AuthContext';

interface EnrolledBootcamp {
  bootcamp: Bootcamp;
  enrollment: {
    bootcampId: string;
    enrolledAt: string;
    amount: number;
    currency: string;
  };
  progress: {
    overallProgress: number;
    completedLessons: number;
    totalLessons: number;
    lastUpdated: string;
  };
}

export default function BootcampPage() {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [enrolledBootcamps, setEnrolledBootcamps] = useState<EnrolledBootcamp[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolledLoading, setEnrolledLoading] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    fetchBootcamps();
  }, []);

  useEffect(() => {
    // Fetch enrolled bootcamps when authentication status is known
    if (!authLoading && isAuthenticated) {
      fetchEnrolledBootcamps();
    } else if (!authLoading && !isAuthenticated) {
      setEnrolledBootcamps([]);
    }
  }, [authLoading, isAuthenticated]);

  // Listen for enrollment updates (e.g., after payment)
  useEffect(() => {
    const handleEnrollmentUpdate = () => {
      if (isAuthenticated && !authLoading) {
        console.log('🔄 Enrollment updated event received, refreshing enrolled bootcamps...');
        // Small delay to ensure webhook has processed
        setTimeout(() => {
          fetchEnrolledBootcamps();
        }, 1000);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('bootcamp-enrollment-updated', handleEnrollmentUpdate);
      return () => {
        window.removeEventListener('bootcamp-enrollment-updated', handleEnrollmentUpdate);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  const fetchBootcamps = async () => {
    try {
      const response = await fetch('/api/bootcamp');
      if (response.ok) {
        const data = await response.json();
        // If no bootcamps from API, use fallback data
        setBootcamps(data.length > 0 ? data : getFallbackBootcamps());
      } else {
        // Fall back to hardcoded data if API fails
        setBootcamps(getFallbackBootcamps());
      }
    } catch (error) {
      console.error('Failed to fetch bootcamps:', error);
      // Fall back to hardcoded data if API fails
      setBootcamps(getFallbackBootcamps());
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledBootcamps = async () => {
    setEnrolledLoading(true);
    try {
      const response = await fetch('/api/bootcamp/enrolled', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        // Store all enrolled bootcamps
        if (data.enrolledBootcamps && data.enrolledBootcamps.length > 0) {
          setEnrolledBootcamps(data.enrolledBootcamps);
        } else {
          setEnrolledBootcamps([]);
        }
      } else if (response.status === 401) {
        // Not authenticated - clear enrolled bootcamps
        setEnrolledBootcamps([]);
      } else {
        console.error('Failed to fetch enrolled bootcamps');
        setEnrolledBootcamps([]);
      }
    } catch (error) {
      console.error('Error fetching enrolled bootcamps:', error);
      setEnrolledBootcamps([]);
    } finally {
      setEnrolledLoading(false);
    }
  };

  const formatDateWithOrdinal = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th';

    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    return `${day}${suffix} ${month}, ${year}`;
  };

  const ProgressCircle = ({ value }: { value: number }) => {
    const normalized = Math.min(Math.max(value, 0), 100);
    const circumference = 2 * Math.PI * 14;
    const offset = circumference - (normalized / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-10 h-10">
        <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14" stroke="#FFFFFF" strokeWidth="3" fill="none" opacity={0.2} />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#667EEA"
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-white"
          style={{ fontFamily: 'Gilroy-Regular' }}
        >
          {value}%
        </span>
      </div>
    );
  };

  const renderEnrolledHero = (enrolledData: EnrolledBootcamp) => {
    const bootcamp = enrolledData.bootcamp;
    const mentors = bootcamp.mentors ?? [];
    const enrollmentDate = formatDateWithOrdinal(enrolledData.enrollment.enrolledAt) || '1st Oct, 2025';
    const { overallProgress, completedLessons, totalLessons } = enrolledData.progress;

    return (
      <div key={enrolledData.enrollment.bootcampId} className="relative bg-[#1F1F1F] rounded-2xl p-4 sm:p-6 lg:p-8 overflow-hidden isolate">
        {/* Curved Gradient Border */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
            padding: '1px',
            zIndex: 0,
          }}
        >
          <div
            className="w-full h-full rounded-[15px]"
            style={{
              background: '#1F1F1F',
            }}
          ></div>
        </div>
        <div
          className="absolute w-[688px] h-[288px] left-1/2 -translate-x-1/2 -top-[410px] blur-[120px] rotate-90 rounded-full pointer-events-none"
          style={{
            background:
              'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          }}
        />

        <div className="relative z-10 flex flex-col gap-4 text-white">
          <div className="flex flex-col gap-3">
            <div className="flex lg:flex-row lg:items-center gap-4">
              <h3
                className="text-2xl sm:text-[26px] flex-1"
                style={{ fontFamily: 'Gilroy-SemiBold', lineHeight: '100%' }}
              >
                {bootcamp.title}
              </h3>

              <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#1F1F1F] text-xs uppercase tracking-wide border border-white/10">
                {bootcamp.price}
              </div>
            </div>
            <p className="text-base leading-[130%]" style={{ fontFamily: 'Gilroy-Regular' }}>
              {bootcamp.description}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-lg font-semibold" style={{ fontFamily: 'Gilroy-SemiBold' }}>
              Mentors:
            </p>
            <div className="flex flex-wrap gap-4 text-base" style={{ fontFamily: 'Gilroy-Regular' }}>
              {mentors.map((mentor, index) => (
                <span key={mentor + index}>{mentor}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span
              className="rounded-full border border-[#05B0B3] bg-[rgba(5,176,179,0.12)] text-[#05B0B3] px-4 py-1 text-xs font-medium"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              {bootcamp.duration}
            </span>
            <span
              className="rounded-full border border-[#DE50EC] bg-[rgba(222,80,236,0.12)] text-[#DE50EC] px-4 py-1 text-xs font-medium"
              style={{ fontFamily: 'Gilroy-Medium' }}
            >
              {bootcamp.format}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <p className="text-lg font-semibold" style={{ fontFamily: 'Gilroy-SemiBold' }}>
                Progress
              </p>
              <div className="flex items-center gap-3">
                <ProgressCircle value={overallProgress} />
                <p className="text-base" style={{ fontFamily: 'Gilroy-Regular' }}>
                  {completedLessons}/{totalLessons} Videos Completed
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <p className="text-base" style={{ fontFamily: 'Gilroy-Regular' }}>
                Enrolled on: {enrollmentDate}
              </p>
              <Link
                href={`/bootcamp/${bootcamp.id}/progress`}
                className="flex items-center gap-2 rounded-full border border-white px-5 py-2 text-sm font-semibold"
                style={{ fontFamily: 'Gilroy-SemiBold' }}
              >
                View Full Progress
                <Image
                  src="/logo/backhome.png"
                  alt="View progress"
                  width={16}
                  height={16}
                  className="w-4 h-4"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBootcampCard = (bootcamp: Bootcamp) => (
    <div
      key={bootcamp._id}
      className='relative p-[1px]'
    >
      <div
        className="absolute inset-0 -top-[1px] -right-[1px] pointer-events-none rounded-2xl"
        style={{
          background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50%)'
        }}
      >
      </div>
      <div
        className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden h-full">

        {/* Gradient Ellipse */}
        <div
          className="absolute w-[588px] h-[588px] z-0"
          style={{
            left: bootcamp.gradientPosition.left,
            top: bootcamp.gradientPosition.top,
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: `rotate(${bootcamp.gradientPosition.rotation})`,
            borderRadius: '50%'
          }}
        />

        {/* Title and Price */}
        <div className="flex items-start justify-between gap-6 relative z-10">
          <h3 className="text-2xl text-white flex-1" style={{ fontFamily: 'Gilroy', fontWeight: 600 }}>{bootcamp.title}</h3>
          <div className="relative flex-shrink-0 rounded-full overflow-hidden">
            {/* Enhanced Shiny Glint Effect - Top Right Corner */}
            <div
              className="absolute top-0 right-0 w-3 h-3 opacity-60 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
                borderRadius: '50% 0 0 0'
              }}
            ></div>

            {/* Enhanced Top Border Glint */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 opacity-70 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.1) 85%, transparent 100%)',
                borderRadius: '50% 50% 0 0'
              }}
            ></div>

            {/* Enhanced Right Border Glint */}
            <div
              className="absolute top-0 right-0 w-0.5 h-4 opacity-70 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                borderRadius: '0 50% 0 0'
              }}
            ></div>

            <span className="relative z-10 inline-block bg-[#1F1F1F] text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600/50 transition-colors duration-300 whitespace-nowrap">{bootcamp.price}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-base text-white leading-[130%] relative z-10" style={{ fontFamily: 'Gilroy' }}>
          {bootcamp.description}
        </p>

        {/* Mentors */}
        <div className="flex flex-col gap-2 relative z-10">
          <h4 className="text-xl text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600 }}>Mentors:</h4>
          {bootcamp.mentors.map((mentor, index) => (
            <p key={index} className="text-base text-white leading-[130%]" style={{ fontFamily: 'Gilroy' }}>{mentor}</p>
          ))}
        </div>

        {/* Tags - Dynamic Duration and Format */}
        <div className="flex gap-2 relative z-10">
          {/* Duration tag */}
          <span
            className="border-[#05B0B3] bg-[rgba(5,176,179,0.12)] text-[#05B0B3] border rounded-full px-2.5 py-1 text-xs"
            style={{ fontFamily: 'Gilroy', fontWeight: 500 }}
          >
            {bootcamp.duration}
          </span>

          {/* Format tag */}
          <span
            className="border-[#DE50EC] bg-[rgba(222,80,236,0.12)] text-[#DE50EC] border rounded-full px-2.5 py-1 text-xs"
            style={{ fontFamily: 'Gilroy', fontWeight: 500 }}
          >
            {bootcamp.format}
          </span>
        </div>

        {/* Registration Dates */}
        <p className="text-base text-white leading-[130%] relative z-10" style={{ fontFamily: 'Gilroy' }}>
          Registration Dates: {new Date(bootcamp.registrationStartDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })} - {new Date(bootcamp.registrationEndDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 relative z-10 mt-auto">
          <Link href={`/bootcamp/${bootcamp.id}`} className="flex-1 border border-white rounded-full py-2.5 px-4 text-sm text-white text-center hover:bg-white/10 transition-colors flex items-center justify-center gap-2" style={{ fontFamily: 'Gilroy', fontWeight: 600 }}>
            Learn More
            <Image
              src="/logo/backhome.png"
              alt="Arrow"
              width={20}
              height={20}
              className="w-5 h-5"
            />
          </Link>
          <Link href={`/bootcamp/${bootcamp.id}/register`} className="flex-1 bg-white border border-white rounded-full py-2.5 px-4 text-sm text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Gilroy', fontWeight: 600 }}>Register Now</Link>
        </div>
      </div >

    </div>
  );

  const showEnrolledHero = isAuthenticated && !authLoading && !enrolledLoading && enrolledBootcamps.length > 0;

  // Show loading state while checking enrollment status for authenticated users
  const isLoadingEnrollment = isAuthenticated && !authLoading && enrolledLoading;
  const isInitialLoad = loading || authLoading || isLoadingEnrollment;

  // Show loading screen while checking enrollment
  if (isInitialLoad) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Vector Background SVG - Enhanced for Mobile Only */}
      <div
        className="absolute z-0 left-[-400px] top-[-100px] sm:left-auto sm:top-0 sm:right-[-10px]"
        style={{
          opacity: 1,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/bootcamp bg.svg"
          alt="Bootcamp gradient background"
          width={900}
          height={700}
          className="w-[1200px] h-[900px] sm:w-full sm:h-full lg:w-full lg:h-full"
          priority
        />
      </div>

      {/* Desktop Image Belts - Right Side */}
      {!showEnrolledHero && (
        <div className="hidden lg:block absolute z-0 right-24 xl:right-32 top-0 w-56 xl:w-72" style={{ height: 'calc(70vh + 160px)' }}>
          <div className="flex w-full h-full pt-20">
            {/* Belt 1 - Rectangle 1 Images */}
            <div className="flex-1 fade-mask-reduced overflow-hidden">
              <div className="animate-scrollUp flex flex-col gap-5">
                {/* First set of images */}
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/1.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/2 improved.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/4.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                {/* Duplicate for seamless loop */}
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/1.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/2 improved.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
                  style={{
                    backgroundImage: 'url("inspired analysts team/3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full mr-auto ml-1"
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
            <div className="flex-1 fade-mask-reduced overflow-hidden">
              <div className="animate-scrollDown flex flex-col gap-5">
                {/* First set of images */}
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/5.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/6.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/7.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("rectangle 1/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                {/* Duplicate for seamless loop */}
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/5.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/6.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/7.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1/2.2] w-18 xl:w-24 rounded-full ml-1 mr-auto"
                  style={{
                    backgroundImage: 'url("inspired analysts team/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Mobile Screen Border Masks */}
      <div className="absolute inset-0 sm:hidden z-0 pointer-events-none">
        {/* Left border mask - fades overflowing SVG to black */}
        <div
          className="absolute left-0 top-0 w-40 h-full"
          style={{
            background: 'linear-gradient(to right, rgba(10, 10, 10, 0.8) 0%, rgba(10, 10, 10, 0.6) 15%, rgba(10, 10, 10, 0.4) 35%, rgba(10, 10, 10, 0.2) 60%, rgba(10, 10, 10, 0.05) 85%, transparent 100%)',
            filter: 'blur(1px)'
          }}
        />
        {/* Right border mask - lighter version */}
        <div
          className="absolute right-0 top-0 w-40 h-full"
          style={{
            background: 'linear-gradient(to left, rgba(10, 10, 10, 0.4) 0%, rgba(10, 10, 10, 0.3) 15%, rgba(10, 10, 10, 0.2) 35%, rgba(10, 10, 10, 0.1) 60%, rgba(10, 10, 10, 0.025) 85%, transparent 100%)',
            filter: 'blur(1px)'
          }}
        />
      </div>



      {/* Navigation Header */}
      <div className="relative z-[9999]">
        <Navbar variant="hero" />
      </div>

      {/* Hero Section */}
      <section className="relative z-0 min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
        <div className="relative z-0 w-full px-4 sm:px-6 lg:px-6 pt-44 sm:pt-44 md:pt-48 lg:pt-56">
          <div className="mx-auto max-w-7xl">
            {/* Text Content - Frame 25 - Aligned with logo using same spacing, mobile adjusted for sidebar */}
            {!showEnrolledHero && (
              <div className="flex flex-col items-start gap-6 w-full max-w-[280px] min-[400px]:max-w-[343px] min-[500px]:max-w-[460px] min-[600px]:max-w-[560px] min-[700px]:max-w-[630px] md:w-full md:max-w-[630px] lg:ml-0">
                {/* Main Heading */}
                <h1 className="text-[32px] leading-[120%] min-[400px]:text-[36px] md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-white w-full" style={{ fontFamily: 'Gilroy', fontWeight: 600 }}>
                  Master AI, Finance & Tech Through Expert-Led Bootcamps
                </h1>

                {/* Subheading */}
                <p className="text-base leading-[130%] min-[400px]:text-[17px] md:text-base lg:text-lg text-white w-full" style={{ fontFamily: 'Gilroy' }}>
                  Intensive, hands-on learning programs designed to transform you into an industry-ready professional in weeks, not years.
                </p>
              </div>
            )}
            {enrolledBootcamps.length > 0 && (
              <div className="relative z-[1] w-full px-0 sm:px-2 -mt-16">
                <div className="flex flex-col gap-6 w-full max-w-[1280px] mx-auto">
                  <div className="flex flex-col gap-4">
                    <p
                      className="text-3xl sm:text-[36px] text-white"
                      style={{ fontFamily: 'Gilroy-SemiBold', lineHeight: '100%' }}
                    >
                      {enrolledBootcamps.length === 1 ? 'Enrolled Bootcamp' : 'Enrolled Bootcamps'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-6">
                    {enrolledBootcamps.map((enrolledData) => renderEnrolledHero(enrolledData))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {showEnrolledHero && (
        <div className="relative z-[1] w-full px-4 sm:px-6 lg:px-6 mt-32">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-3">

              <h2 className="text-3xl text-white" style={{ fontFamily: 'Gilroy-SemiBold' }}>
                Trending Bootcamps
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Image Belts - Only visible on mobile */}
      {!showEnrolledHero && (
        <div className="lg:hidden flex flex-col justify-center items-center h-40 sm:h-48 relative w-full overflow-hidden mt-8 mb-8">
          <div className="flex flex-col w-full h-full gap-2">
            {/* Belt 1 - Rectangle 1 Images */}
            <div className="flex-1 fade-mask-reduced overflow-hidden">
              <div className="animate-scrollUp flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                {/* First set of images */}
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/1.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/2 improved.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/4 - colored.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/5.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/6.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/7.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                {/* Duplicate for seamless loop */}
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/1.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/2 improved.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/4 - colored.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/5.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/6.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/7.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
              </div>
            </div>

            {/* Belt 2 - Rectangle 2 Images */}
            <div className="flex-1 fade-mask-reduced overflow-hidden">
              <div className="animate-scrollDown flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                {/* First set of images */}
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/5.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/6.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/7.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/1.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/2 improved.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/4 - colored.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                {/* Duplicate for seamless loop */}
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/5.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/6.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/7.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/1.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/2 improved.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/3.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
                <div
                  className="aspect-[1.95/1] h-full rounded-full overflow-hidden flex-shrink-0 w-28"
                  style={{
                    backgroundImage: 'url("team-mob/4 - colored.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Bootcamp Cards Section */}
      <section className={`relative z-0 ${showEnrolledHero ? 'pt-12' : 'pt-32 sm:pt-40 lg:pt-44'} pb-12 sm:pb-16 lg:pb-20`}>
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-7xl">
            {/* Cards Grid - 3 columns on desktop, 1 on mobile */}
            <div className="flex flex-col gap-5">
              {loading ? (
                // Loading skeleton
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <BootcampCardSkeleton key={index} />
                  ))}
                </div>
              ) : (
                // Dynamic bootcamp cards (always has data due to fallback)
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bootcamps.map((bootcamp) => renderBootcampCard(bootcamp))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Mentorship Section */}
      <section className="relative z-0 py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col items-center gap-12 sm:gap-16">
              {/* Section Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center max-w-4xl" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '130%' }}>
                Why Choose Our Mentorship?
              </h2>

              {/* Features Grid */}
              <div className="flex flex-col gap-5 w-full">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Personalized Roadmap */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4 relative">
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

                    <h3 className="text-xl text-white relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em' }}>
                      Personalized Roadmap
                    </h3>
                    <p className="text-base text-white leading-[130%] relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 400 }}>
                      Every learner has unique goals. Whether you want to become a profitable trader, a confident investor, a Web3 innovator, or grow your career in tech, we create a step-by-step mentorship plan tailored to your journey, skills, and aspirations.
                    </p>
                  </div>

                  {/* Hands-on Learning */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4 relative">
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

                    <h3 className="text-xl text-white relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                      Hands-on Learning
                    </h3>
                    <p className="text-base text-white leading-[130%] relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 400 }}>
                      Forget outdated theory. Our mentorship is built around real market case studies, live examples, and practical exercises so you can immediately apply what you learn. You&apos;ll gain not just knowledge, but the confidence to use it in real-world scenarios.
                    </p>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Accountability & Guidance */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4 relative">
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

                    <h3 className="text-xl text-white relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                      Accountability & Guidance
                    </h3>
                    <p className="text-base text-white leading-[130%] relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 400 }}>
                      Success comes with consistency. Through weekly 1-on-1 check-ins, continuous feedback, and structured assignments, your mentor ensures you stay on track, overcome challenges, and make steady progress toward your goals.
                    </p>
                  </div>

                  {/* Proven Expertise */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4 relative">
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

                    <h3 className="text-xl text-white relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                      Proven Expertise
                    </h3>
                    <p className="text-base text-white leading-[130%] relative z-10" style={{ fontFamily: 'Gilroy', fontWeight: 400 }}>
                      Learn directly from Inspired Analyst experts with years of trading, investing, and data-driven experience. Our mentors have guided hundreds of learners and bring insider knowledge, strategies, and industry insights you won&apos;t find in standard courses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 sm:py-16 lg:py-20">
        <NewsletterSubscription />
      </div>

      <Footer />
    </div>
  );
}

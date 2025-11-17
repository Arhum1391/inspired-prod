'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Bootcamp } from '@/types/admin';
import { getFallbackBootcamps } from '@/lib/fallbackBootcamps';
import { Clock, Globe, Calendar, Award, BookOpen, TrendingUp, Target, ChevronLeft, LucideIcon } from 'lucide-react';

type LessonStatus = 'completed' | 'in-progress';

interface ProgressLesson {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  status: LessonStatus;
}

const staticLessons: ProgressLesson[] = [
  {
    id: 'lesson-1',
    title: 'Mastering Market Trends: Navigating Volatility in Crypto | Lec 1',
    thumbnail: '/bootcamp/progress/lec-1.png',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'lesson-2',
    title: 'Altcoin Strategies: Maximizing Your Portfolio | Essential Training | Lec 2',
    thumbnail: '/bootcamp/progress/lec-2.png',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'lesson-3',
    title: 'Mastering Market Trends: Navigating Volatility in Crypto | Lec 3',
    thumbnail: '/bootcamp/progress/lec-3.png',
    progress: 100,
    status: 'completed',
  },
  {
    id: 'lesson-4',
    title: 'Mastering Market Trends: Navigating Volatility in Crypto | Lec 4',
    thumbnail: '/bootcamp/progress/lec-4.png',
    progress: 35,
    status: 'in-progress',
  },
  {
    id: 'lesson-5',
    title: 'Altcoin Strategies: Maximizing Your Portfolio | Essential Training | Lec 5',
    thumbnail: '/bootcamp/progress/lec-5.png',
    progress: 5,
    status: 'in-progress',
  },
  {
    id: 'lesson-6',
    title: 'Mastering Market Trends: Navigating Volatility in Crypto | Lec 6',
    thumbnail: '/bootcamp/progress/lec-6.png',
    progress: 5,
    status: 'in-progress',
  },
];

const formatDateWithOrdinal = (date?: Date | string) => {
  if (!date) return '';
  const parsed = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(parsed.getTime())) return '';

  const day = parsed.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
      ? 'nd'
      : day % 10 === 3 && day !== 13
      ? 'rd'
      : 'th';

  const month = parsed.toLocaleString('en-US', { month: 'short' });
  const year = parsed.getFullYear();

  return `${day}${suffix} ${month}, ${year}`;
};

const getIconComponent = (iconName: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    Clock,
    Globe,
    Calendar,
    Award,
    BookOpen,
    TrendingUp,
    Target,
  };
  return icons[iconName] || BookOpen;
};

const BootcampProgressPage = () => {
  const params = useParams();
  const router = useRouter();
  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      fetchBootcamp(params.id as string);
    }
  }, [params?.id]);

  const fetchBootcamp = async (id: string) => {
    try {
      const response = await fetch(`/api/bootcamp/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBootcamp(data);
      } else {
        const fallback = getFallbackBootcamps().find((bootcamp) => bootcamp.id === id);
        setBootcamp(fallback ?? null);
      }
    } catch (error) {
      console.error('Failed to fetch bootcamp:', error);
      const fallback = getFallbackBootcamps().find((bootcamp) => bootcamp.id === id);
      setBootcamp(fallback ?? null);
    } finally {
      setLoading(false);
    }
  };

  const lessons = useMemo(() => staticLessons, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden flex items-center justify-center">
        <Navbar variant="hero" />
        <p className="text-white">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Background Vector */}
      <div
        className="absolute z-0 left-[-400px] top-[-100px] sm:left-auto sm:top-0 sm:right-[-10px]"
        style={{ opacity: 1, pointerEvents: 'none' }}
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

      {/* Navigation */}
      <div className="relative z-20">
        <Navbar variant="hero" />
      </div>

      {/* Progress Section */}
      <section className="relative z-10 pt-22 sm:pt-26 lg:pt-30 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-8">
              <div className="flex">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-white hover:text-white/80 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Back
                </button>
              </div>
              {/* Heading */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h1
                    className="text-3xl sm:text-4xl text-white"
                    style={{ fontFamily: 'Gilroy-SemiBold', lineHeight: '100%' }}
                  >
                    {bootcamp?.title || 'Bootcamp Progress Overview'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-base text-white" style={{ fontFamily: 'Gilroy-Regular' }}>
                    <span>6 Videos</span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                    <span>Last updated on {formatDateWithOrdinal('2025-10-30')}</span>
                  </div>
                </div>
              </div>

              {/* Lessons Grid */}
              <div className="flex flex-col gap-6">
                {Array.from({ length: 2 }).map((_, rowIndex) => {
                  const start = rowIndex * 3;
                  const rowLessons = lessons.slice(start, start + 3);
                  return (
                    <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {rowLessons.map((lesson) => (
                        <LessonCard key={lesson.id} lesson={lesson} />
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* What You'll Learn Section */}
              <div className="relative z-0 pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
                <div className="w-full px-4 sm:px-6 lg:px-6">
                  <div className="mx-auto max-w-[1064px]">
                    <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16">
                      {/* Section Header */}
                      <div className="flex flex-col items-center gap-6 w-full">
                        <h2
                          className="text-2xl sm:text-3xl lg:text-4xl text-white text-center max-w-[888px]"
                          style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '130%' }}
                        >
                          What You&apos;ll Learn
                        </h2>
                        <p
                          className="text-sm sm:text-base text-white text-center w-full"
                          style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%' }}
                        >
                          Our comprehensive curriculum is designed to take you from beginner to advanced level
                        </p>
                      </div>

                      {/* Curriculum Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                        {bootcamp?.curriculumSections && bootcamp.curriculumSections.length > 0 ? (
                          bootcamp.curriculumSections.map((section, index) => {
                            const IconComponent = getIconComponent(section.icon);
                            return (
                              <div
                                key={`${section.title}-${index}`}
                                className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden"
                              >
                                {/* Curved Gradient Border */}
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    borderRadius: '16px',
                                    background:
                                      'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                                    padding: '1px',
                                  }}
                                >
                                  <div
                                    className="w-full h-full rounded-[15px]"
                                    style={{
                                      background: '#1F1F1F',
                                    }}
                                  ></div>
                                </div>

                                {/* Background Ellipse */}
                                <div
                                  className="absolute w-[588px] h-[588px] z-0"
                                  style={{
                                    left: '285px',
                                    top: '-360px',
                                    background:
                                      'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                                    filter: 'blur(100px)',
                                    transform: 'rotate(-172.95deg)',
                                    borderRadius: '50%',
                                  }}
                                />

                                {/* Header */}
                                <div className="flex items-start gap-4 relative z-10">
                                  <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center flex-shrink-0">
                                    <IconComponent className="w-5 h-5 text-white" />
                                  </div>

                                  <div className="flex flex-col gap-2 flex-1">
                                    <p
                                      className="text-sm text-white"
                                      style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}
                                    >
                                      {section.weekRange}
                                    </p>
                                    <h3
                                      className="text-xl text-white"
                                      style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em' }}
                                    >
                                      {section.title}
                                    </h3>
                                  </div>
                                </div>

                                {/* List Items */}
                                <div className="flex flex-col gap-4 relative z-10">
                                  {section.items.map((item, itemIndex) => (
                                    <div key={`${section.title}-${itemIndex}`} className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                                      <p
                                        className="text-base text-white"
                                        style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}
                                      >
                                        {item}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="col-span-full text-center text-gray-400">No curriculum sections available</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

interface LessonCardProps {
  lesson: ProgressLesson;
}

const LessonCard = ({ lesson }: LessonCardProps) => {
  const isCompleted = lesson.status === 'completed';

  return (
    <div className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
      {/* Curved Gradient Border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: '16px',
          background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
          padding: '1px',
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
        className="relative z-10 w-full rounded-xl bg-cover bg-center bg-no-repeat aspect-[366/204]"
        style={{ backgroundImage: `url(${lesson.thumbnail})` }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-base text-white leading-[130%]" style={{ fontFamily: 'Gilroy-SemiBold' }}>
          {lesson.title}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <ProgressCircle value={lesson.progress} />
            <p className="text-base text-white" style={{ fontFamily: 'Gilroy-Regular' }}>
              {isCompleted ? 'Completed' : `${lesson.progress}% Complete`}
            </p>
          </div>

          {!isCompleted && (
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm text-white font-semibold"
              style={{ fontFamily: 'Gilroy-SemiBold' }}
            >
              Continue Learning
              <Image
                src="/logo/backhome.png"
                alt="Continue learning"
                width={16}
                height={16}
                className="w-4 h-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const ProgressCircle = ({ value }: { value: number }) => {
  const normalized = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * 14;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 32 32">
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
        className="absolute inset-0 flex items-center justify-center text-[10px] text-white"
        style={{ fontFamily: 'Gilroy-Regular' }}
      >
        {value}%
      </span>
    </div>
  );
};

export default BootcampProgressPage;


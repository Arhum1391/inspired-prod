'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { Bootcamp } from '@/types/admin';
import { getFallbackBootcamps } from '@/lib/fallbackBootcamps';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Globe, Calendar, Award, BookOpen, TrendingUp, Target, ChevronLeft, LucideIcon } from 'lucide-react';

const VideoPlayerModal = dynamic(
  () => import('@/components/bootcamp/VideoPlayerModal'),
  { ssr: false }
);

type LessonStatus = 'completed' | 'in-progress';

interface ProgressLesson {
  id: string;
  lessonId: string;
  title: string;
  thumbnail: string;
  youtubeVideoId: string;
  progress: number;
  status: LessonStatus;
  duration?: number;
}

interface ProgressData {
  bootcamp: {
    id: string;
    title: string;
    description: string;
  };
  enrollment: {
    enrolledAt: string;
    bootcampId: string;
  };
  lessons: ProgressLesson[];
  overallProgress: number;
  completedLessons: number;
  totalLessons: number;
  lastUpdated: string;
}

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
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<{ enrolled: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<ProgressLesson | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (params?.id) {
      fetchBootcamp(params.id as string);
    }
  }, [params?.id]);

  // Handle lesson query parameter for direct video opening
  useEffect(() => {
    const lessonId = searchParams?.get('lesson');
    if (lessonId && progressData?.lessons) {
      const lesson = progressData.lessons.find((l) => l.lessonId === lessonId);
      if (lesson) {
        setSelectedLesson(lesson);
        setIsModalOpen(true);
        // Remove query parameter from URL
        router.replace(`/bootcamp/${params.id}/progress`, { scroll: false });
      }
    }
  }, [searchParams, progressData, params?.id, router]);

  useEffect(() => {
    // Check authentication and enrollment status
    if (!authLoading && params?.id) {
      checkEnrollmentAndFetchProgress(params.id as string);
    }
  }, [authLoading, isAuthenticated, params?.id]);

  // Listen for enrollment updates (e.g., after payment)
  useEffect(() => {
    const handleEnrollmentUpdate = () => {
      if (isAuthenticated && !authLoading && params?.id) {
        console.log('🔄 Enrollment updated event received, refreshing enrollment status...');
        // Small delay to ensure webhook has processed
        setTimeout(() => {
          checkEnrollmentAndFetchProgress(params.id as string);
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
  }, [isAuthenticated, authLoading, params?.id]);

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
    }
  };

  const checkEnrollmentAndFetchProgress = async (id: string) => {
    if (!isAuthenticated) {
      setError('Please sign in to view your bootcamp progress.');
      setLoading(false);
      return;
    }

    try {
      // Check enrollment status
      const enrollmentResponse = await fetch(`/api/bootcamp/${id}/enrollment`, {
        credentials: 'include',
      });

      if (enrollmentResponse.status === 401) {
        setError('Please sign in to view your bootcamp progress.');
        setLoading(false);
        return;
      }

      const enrollmentData = await enrollmentResponse.json();
      setEnrollmentStatus(enrollmentData);

      if (!enrollmentData.enrolled) {
        setError('You are not enrolled in this bootcamp. Please register first.');
        setLoading(false);
        return;
      }

      // Fetch progress data
      const progressResponse = await fetch(`/api/bootcamp/${id}/progress`, {
        credentials: 'include',
      });

      if (progressResponse.ok) {
        const progressData = await progressResponse.json();
        setProgressData(progressData);
        setError(null);
      } else if (progressResponse.status === 403) {
        setError('You are not enrolled in this bootcamp. Please register first.');
      } else if (progressResponse.status === 401) {
        setError('Please sign in to view your bootcamp progress.');
      } else {
        setError('Failed to load progress data.');
      }
    } catch (error) {
      console.error('Failed to fetch enrollment/progress:', error);
      setError('Failed to load progress data.');
    } finally {
      setLoading(false);
    }
  };

  const lessons = progressData?.lessons || [];

  if (loading || authLoading) {
    return <LoadingScreen message="Loading progress..." />;
  }

  // Show error if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
        <Navbar variant="hero" />
        <section className="relative z-10 pt-22 sm:pt-26 lg:pt-30 pb-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl text-white mb-4" style={{ fontFamily: 'Gilroy-SemiBold' }}>
                    Sign In Required
                  </h2>
                  <p className="text-base text-gray-400 mb-6" style={{ fontFamily: 'Gilroy-Regular' }}>
                    Please sign in to view your bootcamp progress.
                  </p>
                  <button
                    onClick={() => router.push(`/signin?redirect=/bootcamp/${params.id}/progress`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                    style={{ fontFamily: 'Gilroy-Medium' }}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // Show error if not enrolled
  if (error && (!enrollmentStatus?.enrolled || enrollmentStatus === null)) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
        <Navbar variant="hero" />
        <section className="relative z-10 pt-22 sm:pt-26 lg:pt-30 pb-16">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl text-white mb-4" style={{ fontFamily: 'Gilroy-SemiBold' }}>
                    Not Enrolled
                  </h2>
                  <p className="text-base text-gray-400 mb-6" style={{ fontFamily: 'Gilroy-Regular' }}>
                    {error}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => router.push(`/bootcamp/${params.id}/register`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors"
                      style={{ fontFamily: 'Gilroy-Medium' }}
                    >
                      Register Now
                    </button>
                    <button
                      onClick={() => router.push(`/bootcamp/${params.id}`)}
                      className="bg-transparent hover:bg-white/10 border border-white/30 text-white px-6 py-3 rounded-lg transition-colors"
                      style={{ fontFamily: 'Gilroy-Medium' }}
                    >
                      View Bootcamp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
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
              {/* <div className="flex">
                <button
                  onClick={() => router.back()}
                  className="flex items-center text-white hover:text-white/80 transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                >
                  <ChevronLeft size={20} className="mr-2" />
                  Back
                </button>
              </div> */}
              {/* Heading */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h1
                    className="text-3xl sm:text-4xl text-white"
                    style={{ fontFamily: 'Gilroy-SemiBold', lineHeight: '100%' }}
                  >
                    {progressData?.bootcamp?.title || bootcamp?.title || 'Bootcamp Progress Overview'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-base text-white" style={{ fontFamily: 'Gilroy-Regular' }}>
                    <span>{progressData?.totalLessons || lessons.length || 0} Videos</span>
                    {progressData && (
                      <>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span>{progressData.completedLessons} Completed</span>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span>{progressData.overallProgress}% Overall Progress</span>
                      </>
                    )}
                    {progressData?.lastUpdated && (
                      <>
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/40" />
                        <span>Last updated on {formatDateWithOrdinal(progressData.lastUpdated)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Lessons Grid */}
              {lessons.length > 0 ? (
                <div className="flex flex-col gap-6">
                  {Array.from({ length: Math.ceil(lessons.length / 3) }).map((_, rowIndex) => {
                    const start = rowIndex * 3;
                    const rowLessons = lessons.slice(start, start + 3);
                    return (
                      <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {rowLessons.map((lesson) => (
                          <LessonCard 
                            key={lesson.id} 
                            lesson={lesson}
                            onPlay={() => {
                              setSelectedLesson(lesson);
                              setIsModalOpen(true);
                            }}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-12" style={{ fontFamily: 'Gilroy-Regular' }}>
                  No lessons available yet.
                </div>
              )}

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
      
      {/* Video Player Modal */}
      {selectedLesson && (
        <VideoPlayerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLesson(null);
          }}
          lesson={{
            lessonId: selectedLesson.lessonId,
            title: selectedLesson.title,
            youtubeVideoId: selectedLesson.youtubeVideoId,
            progress: selectedLesson.progress,
          }}
          bootcampId={params.id as string}
          allLessons={progressData?.lessons.map((l) => ({
            lessonId: l.lessonId,
            title: l.title,
            youtubeVideoId: l.youtubeVideoId,
            progress: l.progress,
          })) || []}
          onProgressUpdate={() => {
            // Refresh progress data
            if (params?.id) {
              checkEnrollmentAndFetchProgress(params.id as string);
            }
          }}
          onLessonChange={(newLesson) => {
            const foundLesson = progressData?.lessons.find((l) => l.lessonId === newLesson.lessonId);
            if (foundLesson) {
              setSelectedLesson(foundLesson);
            }
          }}
        />
      )}
      
      <Footer />
    </div>
  );
};

interface LessonCardProps {
  lesson: ProgressLesson;
  onPlay: () => void;
}

const LessonCard = ({ lesson, onPlay }: LessonCardProps) => {
  const isCompleted = lesson.status === 'completed';
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={onPlay}
      className="group bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden cursor-pointer transition-all duration-300 hover:bg-[#2A2A2A] hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/20"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPlay();
        }
      }}
      aria-label={`${isCompleted ? 'Watch again' : 'Continue learning'}: ${lesson.title}`}
    >
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
        className="relative z-10 w-full rounded-xl bg-cover bg-center bg-no-repeat aspect-[366/204] transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundImage: `url(${lesson.thumbnail})` }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        <p className="text-base text-white leading-[130%]" style={{ fontFamily: 'Gilroy-SemiBold' }}>
          {lesson.title}
        </p>

        <div className="flex flex-row-reverse justify-between gap-3">
          <div className="flex items-center gap-3">
            <ProgressCircle value={lesson.progress} />
            <p className="text-base text-white" style={{ fontFamily: 'Gilroy-Regular' }}>
              {isCompleted ? 'Completed' : `${lesson.progress}% Complete`}
            </p>
          </div>

          <div className="flex items-center justify-between">
            {lesson.duration && (
              <span className="text-xs text-gray-400" style={{ fontFamily: 'Gilroy-Regular' }}>
                {formatDuration(lesson.duration)}
              </span>
            )}
            <div className="flex items-center gap-2 text-sm text-white font-semibold transition-colors">
              <span className="hover:text-indigo-400">
                {isCompleted ? 'Watch Again' : 'Continue Learning'}
              </span>
              <Image
                src="/logo/backhome.png"
                alt="Continue learning"
                width={16}
                height={16}
                className="w-4 h-4"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
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


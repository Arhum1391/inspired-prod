'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Footer from '@/components/Footer';
import { NewsletterSubscription } from '@/components';
import LoadingScreen from '@/components/LoadingScreen';
import { Bootcamp, TeamMember } from '@/types/admin';
import { getFallbackBootcamps } from '@/lib/fallbackBootcamps';
import { getTeamMemberAbout, getTeamMemberById } from '@/lib/teamUtils';
import { Clock, Globe, Calendar, Award, BookOpen, TrendingUp, Target, LucideIcon } from 'lucide-react';

// Helper function to get icon component dynamically
const getIconComponent = (iconName: string): LucideIcon => {
  const icons: { [key: string]: LucideIcon } = {
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

export default function BootcampDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchBootcamp(params.id as string);
      fetchTeamMembers();
    }
  }, [params.id]);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team', {
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error('Failed to fetch team members:', response.statusText);
        return;
      }

      const data = await response.json();
      const rawTeam = Array.isArray(data?.rawTeam) ? data.rawTeam : [];
      const publicTeam = Array.isArray(data?.team) ? data.team : [];

      const normalizedMembers: TeamMember[] = rawTeam.map((member: any) => {
        const name = typeof member.name === 'string' ? member.name.trim() : '';

        const publicRecord = publicTeam.find(
          (analyst: any) =>
            (typeof analyst.id !== 'undefined' && analyst.id === member.id) ||
            (typeof analyst.name === 'string' && analyst.name.trim() === name),
        );

        const image =
          publicRecord?.image?.trim() ||
          member.image?.trim() ||
          (name ? `/team dark/${name}.png` : undefined);

        return {
          _id: member._id,
          id: member.id,
          name,
          role: member.role,
          about: member.about ?? '',
          bootcampAbout: member.bootcampAbout?.trim()
            ? member.bootcampAbout
            : member.about ?? '',
          calendar: member.calendar ?? '',
          image,
          createdAt: member.createdAt ? new Date(member.createdAt) : new Date(),
          updatedAt: member.updatedAt ? new Date(member.updatedAt) : new Date(),
        };
      });

      setTeamMembers(normalizedMembers);
    } catch (error) {
      console.error('Failed to fetch team members:', error);
    }
  };

  const fetchBootcamp = async (id: string) => {
    try {
      const response = await fetch(`/api/bootcamp/${id}`);
      if (response.ok) {
        const data = await response.json();
        setBootcamp(data);
      } else if (response.status === 404) {
        // Try to find in fallback data
        const fallbackBootcamp = getFallbackBootcamps().find(b => b.id === id);
        if (fallbackBootcamp) {
          setBootcamp(fallbackBootcamp);
        } else {
          setError('Bootcamp not found');
        }
      } else {
        setError('Failed to load bootcamp');
      }
    } catch (error) {
      console.error('Failed to fetch bootcamp:', error);
      // Try to find in fallback data
      const fallbackBootcamp = getFallbackBootcamps().find(b => b.id === id);
      if (fallbackBootcamp) {
        setBootcamp(fallbackBootcamp);
      } else {
        setError('Failed to load bootcamp');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to find team member by name (extract name from mentor string)
  const findTeamMemberByName = (mentorString: string): TeamMember | null => {
    const mentorName = mentorString.split(' - ')[0]?.trim().toLowerCase(); // Extract name part before " - "
    if (!mentorName) return null;

    return teamMembers.find(member => member.name?.trim().toLowerCase() === mentorName) || null;
  };

  const getMentorImage = (mentorName: string, providedImage?: string) => {
    if (providedImage && providedImage.trim() !== '') {
      return providedImage.trim();
    }

    const normalizedName = mentorName?.split(' - ')[0]?.trim();
    return normalizedName ? `/team dark/${normalizedName}.png` : '/team dark/Adnan.png';
  };

  if (loading) {
    return <LoadingScreen message="Loading bootcamp..." />;
  }

  if (error || !bootcamp) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
        <Navbar variant="hero" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">{error || 'Bootcamp not found'}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Background Ellipse */}
      <div
        className="absolute z-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[588px] lg:h-[588px]"
        style={{
          right: '-230px',
          top: '-230px',
          background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
          filter: 'blur(180px)',
          transform: 'rotate(96.22deg)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />

      {/* Navigation Header */}
      <div className="relative z-10">
        <Navbar variant="hero" />
      </div>


      {/* Hero Section */}
      <section className="relative z-0 pt-32 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-24 xl:gap-28">
              {/* Left Content */}
              <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 flex-1 max-w-full lg:max-w-[630px]">
                {/* Text Content */}
                <div className="flex flex-col gap-6">
                  {/* Main Heading */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '120%' }}>
                    {bootcamp.title}
                  </h1>

                  {/* Subheading */}
                  {bootcamp.heroSubheading && (
                    <p className="text-base text-white leading-[130%]" style={{ fontFamily: 'Gilroy', fontWeight: 350 }}>
                      {bootcamp.heroSubheading}
                    </p>
                  )}

                  {/* Description Paragraphs */}
                  {bootcamp.heroDescription && bootcamp.heroDescription.map((paragraph, index) => (
                    <p key={index} className="text-base text-white leading-[130%]" style={{ fontFamily: 'Gilroy', fontWeight: 350 }}>
                      {paragraph}
                    </p>
                  ))}

                  {/* Fallback to basic description if no hero description */}
                  {!bootcamp.heroDescription && bootcamp.description && (
                    <p className="text-base text-white leading-[130%]" style={{ fontFamily: 'Gilroy', fontWeight: 350 }}>
                      {bootcamp.description}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <div className="flex">
                  <button
                    onClick={() => router.push(`/bootcamp/${bootcamp.id}/register`)}
                    className="bg-white rounded-full px-6 py-4 text-sm text-[#0A0A0A] hover:bg-gray-100 transition-colors"
                    style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}
                  >
                    Register Now - {bootcamp.price}
                  </button>
                </div>
              </div>

              {/* Right Info Cards */}
              <div className="flex flex-col gap-5 w-full lg:w-126 lg:flex-none lg:justify-between">
                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Duration Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-6 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '180px',
                        top: '-190px',
                        background: 'linear-gradient(107.68deg,rgb(99, 71, 243) 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Clock className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-3 relative z-10">
                      <h3 className="text-xl text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.duration?.value || bootcamp.duration}
                      </h3>
                      <p className="text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.duration?.label || 'Duration'}
                      </p>
                    </div>
                  </div>

                  {/* Mode Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-6 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '160px',
                        top: '-190px',
                        background: 'linear-gradient(110.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Globe className="w-5 h-5 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-3 relative z-10">
                      <h3 className="text-xl text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.mode?.value || bootcamp.format}
                      </h3>
                      <p className="text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.mode?.label || 'Mode'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-8">
                  {/* Interactive Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-6 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '180px',
                        top: '-190px',
                        background: 'linear-gradient(110.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-2 relative z-10">
                      <h3 className="text-lg text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.interactive?.value || 'Live Sessions'}
                      </h3>
                      <p className="text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.interactive?.label || 'Interactive'}
                      </p>
                    </div>
                  </div>

                  {/* Certificate Card */}
                  <div className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden">
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

                    {/* Gradient Ellipse */}
                    <div
                      className="absolute w-[300px] h-[300px] z-0"
                      style={{
                        left: '170px',
                        top: '-190px',
                        background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                        filter: 'blur(60px)',
                        transform: 'rotate(137.16deg)',
                        borderRadius: '50%'
                      }}
                    />

                    {/* Icon */}
                    <div className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center relative z-10">
                      <Award className="w-4 h-4 text-white" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-2 relative z-10">
                      <h3 className="text-lg text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.certificate?.value || 'Certificate'}
                      </h3>
                      <p className="text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                        {bootcamp.infoCards?.certificate?.label || 'Completion'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registration Card */}
                <div className="bg-[#1F1F1F] rounded-2xl p-7 flex items-center justify-between gap-4 relative overflow-hidden">
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

                  {/* Gradient Ellipse */}
                  <div
                    className="absolute w-[300px] h-[300px] z-0"
                    style={{
                      left: '400px',
                      top: '-200px',
                      background: 'linear-gradient(110.68deg,rgb(115, 92, 230) 9.35%,rgb(3, 130, 133) 34.7%,rgb(46, 13, 194) 60.06%, #B9B9E9 72.73%,rgb(223, 71, 236) 88.58%)',
                      filter: 'blur(80px)',
                      transform: 'rotate(137.16deg)',
                      borderRadius: '50%'
                    }}
                  />

                  {/* Text */}
                  <div className="flex flex-col gap-2 flex-1 relative z-10">
                    <h3 className="text-lg text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                      {new Date(bootcamp.registrationEndDate) < new Date() ? (
                        <>
                          Registration Closed
                        </>
                      ) : (
                        <>Registration Open</>
                      )}
                    </h3>
                    <p className="text-sm text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                      {bootcamp.infoCards?.registrationText ||
                        `${new Date(bootcamp.registrationStartDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })} - ${new Date(bootcamp.registrationEndDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}`
                      }
                    </p>
                  </div>

                  {/* Indicator Dot */}
                  <div className="w-4 h-4 bg-white rounded-full relative z-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Your Mentors Section */}
      <section className="relative z-0 py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-[846px]">
            <div className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-16">
              {/* Section Header */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                  Meet Your Mentors
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                  Learn from industry experts with proven track records
                </p>
              </div>

              {/* Mentor Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                {bootcamp.mentorDetails && bootcamp.mentorDetails.length > 0 ? (
                  bootcamp.mentorDetails.map((mentor, index) => (
                    <div key={index} className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col items-center gap-4 relative">
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

                      {/* Profile Image */}
                      <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative z-10">
                        <Image
                          src={getMentorImage(mentor.name, mentor.image)}
                          alt={mentor.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover filter grayscale"
                        />
                      </div>

                      {/* Mentor Info */}
                      <div className="flex flex-col items-start gap-2 w-full relative z-10">
                        {/* Name */}
                        <h3 className="text-lg sm:text-xl text-white text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                          {mentor.name}
                        </h3>

                        {/* Details */}
                        <div className="flex flex-col items-center gap-4 w-full">
                          {/* Title */}
                          <p className="text-sm text-[#909090] text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%' }}>
                            {mentor.role}
                          </p>

                          {/* Description */}
                          <p className="text-sm text-[#909090] text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%' }}>
                            {mentor.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : bootcamp.mentors && bootcamp.mentors.length > 0 ? (
                  bootcamp.mentors.map((mentor, index) => {
                    const teamMember = findTeamMemberByName(mentor);
                    return (
                      <div key={index} className="bg-[#1F1F1F] rounded-2xl p-4 flex flex-col items-center gap-4 relative">
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

                        {/* Profile Image */}
                        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden relative z-10">
                          {(() => {
                            const resolvedImage = teamMember?.image || getMentorImage(mentor);
                            if (resolvedImage) {
                              return (
                                <Image
                                  src={resolvedImage}
                                  alt={mentor}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover filter grayscale"
                                />
                              );
                            }
                            return (
                              <div className="w-full h-full flex items-center justify-center text-white text-base font-semibold">
                                  {mentor.charAt(0).toUpperCase()}
                              </div>
                            );
                          })()}
                        </div>

                        {/* Mentor Info */}
                        <div className="flex flex-col items-start gap-2 w-full relative z-10">
                          {/* Name */}
                          <h3 className="text-lg sm:text-xl text-white text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                            {mentor}
                          </h3>

                          {/* Details */}
                          <div className="flex flex-col items-center gap-4 w-full">
                            {/* Description */}
                            {teamMember && (
                              <p className="text-sm text-[#909090] text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%' }}>
                                {getTeamMemberAbout(teamMember, 'bootcamp')}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center text-gray-400">
                    No mentor details available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="relative z-0 py-12 sm:py-16 lg:py-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-[1064px]">
            <div className="flex flex-col items-center gap-8 sm:gap-12 lg:gap-16">
              {/* Section Header */}
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white text-center max-w-[888px]" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '130%' }}>
                  What You&apos;ll Learn
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white text-center w-full" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%' }}>
                  Our comprehensive curriculum is designed to take you from beginner to advanced level
                </p>
              </div>

              {/* Curriculum Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {bootcamp.curriculumSections && bootcamp.curriculumSections.length > 0 ? (
                  bootcamp.curriculumSections.map((section, index) => {
                    const IconComponent = getIconComponent(section.icon);
                    return (
                      <div key={index} className="bg-[#1F1F1F] rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden">
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

                        {/* Background Ellipse */}
                        <div
                          className="absolute w-[588px] h-[588px] z-0"
                          style={{
                            left: '285.45px',
                            top: '-359.87px',
                            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                            filter: 'blur(100px)',
                            transform: 'rotate(-172.95deg)',
                            borderRadius: '50%'
                          }}
                        />

                        {/* Header */}
                        <div className="flex items-start gap-4 relative z-10">
                          {/* Icon */}
                          <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>

                          {/* Title */}
                          <div className="flex flex-col gap-2 flex-1">
                            <p className="text-sm text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                              {section.weekRange}
                            </p>
                            <h3 className="text-xl text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%', letterSpacing: '-0.02em' }}>
                              {section.title}
                            </h3>
                          </div>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col gap-4 relative z-10">
                          {section.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                              <p className="text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                                {item}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center text-gray-400">
                    No curriculum sections available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Join Section */}
      <section className="relative z-0 py-22 sm:py-26 lg:py-30">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-[1064px]">
            <div className="bg-[#1F1F1F] rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
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

              {/* Background Ellipse */}
              <div
                className="absolute w-[588px] h-[588px] z-0"
                style={{
                  right: '-180px',
                  top: '-456px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  borderRadius: '50%'
                }}
              />

              {/* Content */}
              <div className="flex flex-col gap-6 relative z-10">
                {/* Title */}
                <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white" style={{ fontFamily: 'Gilroy', fontWeight: 600, lineHeight: '100%' }}>
                  {bootcamp.targetAudience?.title || 'Who Should Join?'}
                </h2>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '130%' }}>
                  {bootcamp.targetAudience?.subtitle || 'This bootcamp is perfect for:'}
                </p>

                {/* List Items */}
                <div className="flex flex-col gap-4">
                  {bootcamp.targetAudience?.items && bootcamp.targetAudience.items.length > 0 ? (
                    bootcamp.targetAudience.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                        <p className="text-sm sm:text-base text-white" style={{ fontFamily: 'Gilroy', fontWeight: 400, lineHeight: '100%' }}>
                          {item}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400">No target audience information available</div>
                  )}
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

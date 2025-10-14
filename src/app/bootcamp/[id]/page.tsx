'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { NewsletterSubscription } from '@/components';
import { Bootcamp, TeamMember } from '@/types/admin';
import { getFallbackBootcamps } from '@/lib/fallbackBootcamps';
import { getTeamMemberAbout, getTeamMemberById } from '@/lib/teamUtils';

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
      const response = await fetch('/admin/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
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
    const mentorName = mentorString.split(' - ')[0]; // Extract name part before " - "
    return teamMembers.find(member => member.name === mentorName) || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
        <Navbar variant="hero" />
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading bootcamp...</div>
        </div>
      </div>
    );
  }

  if (error || !bootcamp) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
        <Navbar variant="hero" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-white mb-2">{error || 'Bootcamp not found'}</h3>
            <Link 
              href="/bootcamp"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors inline-block"
            >
              Back to Bootcamps
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-x-hidden">
      {/* Vector Background SVG */}
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

      {/* Navigation Header */}
      <div className="relative z-10">
        <Navbar variant="hero" />
      </div>

      {/* Back Button */}
      <div className="relative z-10 pt-24 px-4 sm:px-6 lg:px-6">
        <div className="mx-auto max-w-7xl">
          <Link 
            href="/bootcamp"
            className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <Image 
              src="/logo/backhome.png" 
              alt="Back" 
              width={20}
              height={20}
              className="w-5 h-5 rotate-180"
            />
            Back to Bootcamps
          </Link>
        </div>
      </div>

      {/* Bootcamp Detail Section */}
      <section className="relative z-0 pt-8 pb-12 sm:pb-16 lg:pb-20">
        <div className="w-full px-4 sm:px-6 lg:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="bg-[#1F1F1F] rounded-2xl p-8 flex flex-col gap-8 relative overflow-hidden">
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

              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl text-white mb-4" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                    {bootcamp.title}
                  </h1>
                  <p className="text-lg text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                    {bootcamp.description}
                  </p>
                </div>
                <div className="relative flex-shrink-0 rounded-full overflow-hidden">
                  {/* Enhanced Shiny Glint Effect */}
                  <div 
                    className="absolute top-0 right-0 w-3 h-3 opacity-60 pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
                      borderRadius: '50% 0 0 0'
                    }}
                  ></div>
                  
                  <div 
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-70 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.1) 85%, transparent 100%)',
                      borderRadius: '50% 50% 0 0'
                    }}
                  ></div>
                  
                  <div 
                    className="absolute top-0 right-0 w-0.5 h-4 opacity-70 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                      borderRadius: '0 50% 0 0'
                    }}
                  ></div>
                  
                  <span className="relative z-10 inline-block bg-[#1F1F1F] text-white text-lg font-semibold px-6 py-3 rounded-full border border-gray-600/50 transition-colors duration-300 whitespace-nowrap">
                    {bootcamp.price}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Mentors */}
                <div>
                  <h3 className="text-xl text-white mb-4" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Mentors</h3>
                  <div className="space-y-4">
                    {bootcamp.mentors.map((mentor, index) => {
                      const teamMember = findTeamMemberByName(mentor);
                      return (
                        <div key={index} className="border-l-2 border-indigo-500 pl-4">
                          <h4 className="text-lg text-white font-semibold" style={{fontFamily: 'Gilroy'}}>
                            {mentor}
                          </h4>
                          {teamMember && (
                            <p className="text-gray-300 text-sm mt-1 leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                              {getTeamMemberAbout(teamMember, 'bootcamp')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Program Details */}
                <div>
                  <h3 className="text-xl text-white mb-4" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Program Details</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {bootcamp.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className={`border rounded-full px-3 py-1 text-sm ${
                            index === 0 
                              ? 'border-[#05B0B3] bg-[rgba(5,176,179,0.12)] text-[#05B0B3]' 
                              : 'border-[#DE50EC] bg-[rgba(222,80,236,0.12)] text-[#DE50EC]'
                          }`}
                          style={{fontFamily: 'Gilroy', fontWeight: 500}}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                      <strong>Duration:</strong> {bootcamp.duration}
                    </p>
                    <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                      <strong>Format:</strong> {bootcamp.format}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Dates */}
              <div className="relative z-10">
                <h3 className="text-xl text-white mb-4" style={{fontFamily: 'Gilroy', fontWeight: 600}}>Registration Period</h3>
                <p className="text-base text-white leading-[130%]" style={{fontFamily: 'Gilroy'}}>
                  {new Date(bootcamp.registrationStartDate).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })} - {new Date(bootcamp.registrationEndDate).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                <button className="flex-1 bg-white border border-white rounded-full py-3 px-6 text-lg text-[#1F1F1F] text-center hover:bg-gray-100 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                  Register Now
                </button>
                <button className="flex-1 border border-white rounded-full py-3 px-6 text-lg text-white text-center hover:bg-white/10 transition-colors" style={{fontFamily: 'Gilroy', fontWeight: 600}}>
                  Contact Us
                </button>
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

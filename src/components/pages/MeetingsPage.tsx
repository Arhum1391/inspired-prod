'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronLeft, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

// --- TYPE DEFINITIONS ---
type Meeting = {
  id: number;
  title: string;
  duration: string;
  price: string;
  description: string;
  color: string;
};

type Analyst = {
  id: number;
  name: string;
  description: string;
  image: string;
  slug?: string; // URL-friendly slug from API
};

type ReviewStats = {
  totalReviews: number;
  averageRating: number | null;
};

// --- COMPONENT PROPS ---
interface MeetingCardProps {
  meeting: Meeting;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

interface AnalystCardProps {
  analyst: Analyst;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onAdvance: () => void;
  isTeamDataLoaded: boolean;
  router?: any; // Next.js router for navigation
}

interface Timezone {
    value: string;
    label: string;
}

// --- NO HARDCODED DATA ---
// All analyst data is now fetched dynamically from the database

const meetings: Meeting[] = [
  {
    id: 2,
    title: '30-Min Strategy',
    duration: '30 minutes',
    price: '60 USD',
    description: 'A focused session to address specific challenges and develop targeted strategies.',
    color: 'text-purple-400',
  },
  {
    id: 3,
    title: '60-Min Deep',
    duration: '60 minutes',
    price: '80 USD',
    description: 'A comprehensive consultation to analyze complex issues and create detailed action plans.',
    color: 'text-yellow-400',
  },
];

interface TimezoneGroup {
  region: string;
  timezones: Timezone[];
}

const timezoneGroups: TimezoneGroup[] = [
  {
    region: "NORTH AMERICA",
    timezones: [
      { value: 'America/New_York', label: 'Eastern Time (US & Canada)' },
      { value: 'America/Chicago', label: 'Central Time (US & Canada)' },
      { value: 'America/Denver', label: 'Mountain Time (US & Canada)' },
      { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada)' },
      { value: 'America/Anchorage', label: 'Alaska' },
      { value: 'Pacific/Honolulu', label: 'Hawaii' },
      { value: 'America/Toronto', label: 'Eastern Time - Toronto' },
      { value: 'America/Vancouver', label: 'Pacific Time - Vancouver' },
      { value: 'America/Winnipeg', label: 'Central Time - Winnipeg' },
      { value: 'America/Edmonton', label: 'Mountain Time - Edmonton' },
      { value: 'America/Halifax', label: 'Atlantic Time - Halifax' },
      { value: 'America/St_Johns', label: 'Newfoundland' },
      { value: 'America/Mexico_City', label: 'Central Time - Mexico City' },
      { value: 'America/Cancun', label: 'Eastern Time - Cancun' },
      { value: 'America/Tijuana', label: 'Pacific Time - Tijuana' },
    ]
  },
  {
    region: "SOUTH AMERICA",
    timezones: [
      { value: 'America/Sao_Paulo', label: 'Brasilia' },
      { value: 'America/Argentina/Buenos_Aires', label: 'Buenos Aires' },
      { value: 'America/Santiago', label: 'Santiago' },
      { value: 'America/Bogota', label: 'Bogota' },
      { value: 'America/Lima', label: 'Lima' },
      { value: 'America/Caracas', label: 'Caracas' },
      { value: 'America/Guayaquil', label: 'Guayaquil' },
      { value: 'America/La_Paz', label: 'La Paz' },
      { value: 'America/Asuncion', label: 'Asuncion' },
      { value: 'America/Montevideo', label: 'Montevideo' },
      { value: 'America/Paramaribo', label: 'Paramaribo' },
      { value: 'America/Cayenne', label: 'Cayenne' },
    ]
  },
  {
    region: "EUROPE",
    timezones: [
      { value: 'Europe/London', label: 'London' },
      { value: 'Europe/Dublin', label: 'Dublin' },
      { value: 'Europe/Paris', label: 'Paris' },
      { value: 'Europe/Berlin', label: 'Berlin' },
      { value: 'Europe/Rome', label: 'Rome' },
      { value: 'Europe/Madrid', label: 'Madrid' },
      { value: 'Europe/Amsterdam', label: 'Amsterdam' },
      { value: 'Europe/Brussels', label: 'Brussels' },
      { value: 'Europe/Vienna', label: 'Vienna' },
      { value: 'Europe/Zurich', label: 'Zurich' },
      { value: 'Europe/Stockholm', label: 'Stockholm' },
      { value: 'Europe/Oslo', label: 'Oslo' },
      { value: 'Europe/Copenhagen', label: 'Copenhagen' },
      { value: 'Europe/Helsinki', label: 'Helsinki' },
      { value: 'Europe/Warsaw', label: 'Warsaw' },
      { value: 'Europe/Prague', label: 'Prague' },
      { value: 'Europe/Budapest', label: 'Budapest' },
      { value: 'Europe/Bucharest', label: 'Bucharest' },
      { value: 'Europe/Sofia', label: 'Sofia' },
      { value: 'Europe/Athens', label: 'Athens' },
      { value: 'Europe/Istanbul', label: 'Istanbul' },
      { value: 'Europe/Moscow', label: 'Moscow' },
      { value: 'Europe/Kiev', label: 'Kiev' },
      { value: 'Europe/Minsk', label: 'Minsk' },
      { value: 'Europe/Lisbon', label: 'Lisbon' },
      { value: 'Europe/Reykjavik', label: 'Reykjavik' },
    ]
  },
  {
    region: "AFRICA",
    timezones: [
      { value: 'Africa/Cairo', label: 'Cairo' },
      { value: 'Africa/Johannesburg', label: 'Johannesburg' },
      { value: 'Africa/Lagos', label: 'Lagos' },
      { value: 'Africa/Casablanca', label: 'Casablanca' },
      { value: 'Africa/Nairobi', label: 'Nairobi' },
      { value: 'Africa/Tunis', label: 'Tunis' },
      { value: 'Africa/Algiers', label: 'Algiers' },
      { value: 'Africa/Addis_Ababa', label: 'Addis Ababa' },
      { value: 'Africa/Khartoum', label: 'Khartoum' },
      { value: 'Africa/Dakar', label: 'Dakar' },
      { value: 'Africa/Abidjan', label: 'Abidjan' },
      { value: 'Africa/Accra', label: 'Accra' },
      { value: 'Africa/Douala', label: 'Douala' },
      { value: 'Africa/Luanda', label: 'Luanda' },
      { value: 'Africa/Maputo', label: 'Maputo' },
      { value: 'Africa/Windhoek', label: 'Windhoek' },
    ]
  },
  {
    region: "ASIA",
    timezones: [
      { value: 'Asia/Tokyo', label: 'Tokyo' },
      { value: 'Asia/Shanghai', label: 'Shanghai' },
      { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
      { value: 'Asia/Singapore', label: 'Singapore' },
      { value: 'Asia/Seoul', label: 'Seoul' },
      { value: 'Asia/Manila', label: 'Manila' },
      { value: 'Asia/Jakarta', label: 'Jakarta' },
      { value: 'Asia/Bangkok', label: 'Bangkok' },
      { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City' },
      { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur' },
      { value: 'Asia/Taipei', label: 'Taipei' },
      { value: 'Asia/Kolkata', label: 'New Delhi' },
      { value: 'Asia/Karachi', label: 'Karachi' },
      { value: 'Asia/Dhaka', label: 'Dhaka' },
      { value: 'Asia/Kathmandu', label: 'Kathmandu' },
      { value: 'Asia/Colombo', label: 'Colombo' },
      { value: 'Asia/Dubai', label: 'Dubai' },
      { value: 'Asia/Riyadh', label: 'Riyadh' },
      { value: 'Asia/Kuwait', label: 'Kuwait' },
      { value: 'Asia/Qatar', label: 'Qatar' },
      { value: 'Asia/Bahrain', label: 'Bahrain' },
      { value: 'Asia/Muscat', label: 'Muscat' },
      { value: 'Asia/Tehran', label: 'Tehran' },
      { value: 'Asia/Baghdad', label: 'Baghdad' },
      { value: 'Asia/Jerusalem', label: 'Jerusalem' },
      { value: 'Asia/Amman', label: 'Amman' },
      { value: 'Asia/Beirut', label: 'Beirut' },
      { value: 'Asia/Baku', label: 'Baku' },
      { value: 'Asia/Tbilisi', label: 'Tbilisi' },
      { value: 'Asia/Yerevan', label: 'Yerevan' },
      { value: 'Asia/Almaty', label: 'Almaty' },
      { value: 'Asia/Tashkent', label: 'Tashkent' },
      { value: 'Asia/Kabul', label: 'Kabul' },
    ]
  },
  {
    region: "OCEANIA",
    timezones: [
      { value: 'Australia/Sydney', label: 'Sydney' },
      { value: 'Australia/Melbourne', label: 'Melbourne' },
      { value: 'Australia/Brisbane', label: 'Brisbane' },
      { value: 'Australia/Perth', label: 'Perth' },
      { value: 'Australia/Adelaide', label: 'Adelaide' },
      { value: 'Australia/Darwin', label: 'Darwin' },
      { value: 'Australia/Hobart', label: 'Hobart' },
      { value: 'Pacific/Auckland', label: 'Auckland' },
      { value: 'Pacific/Fiji', label: 'Fiji' },
      { value: 'Pacific/Port_Moresby', label: 'Port Moresby' },
      { value: 'Pacific/Guam', label: 'Guam' },
      { value: 'Pacific/Saipan', label: 'Saipan' },
      { value: 'Pacific/Noumea', label: 'Noumea' },
      { value: 'Pacific/Norfolk', label: 'Norfolk Island' },
    ]
  },
  {
    region: "OTHER",
    timezones: [
      { value: 'UTC', label: 'UTC' },
      { value: 'GMT', label: 'Greenwich Mean Time' },
    ]
  },
  {
    region: "PACIFIC",
    timezones: [
      { value: 'hst_pacific', label: 'Hawaii-Aleutian Time' },
      { value: 'akst_pacific', label: 'Alaska Time' },
      { value: 'pst_pacific', label: 'Pacific Standard Time' },
      { value: 'mst_pacific', label: 'Mountain Standard Time' },
      { value: 'cst_pacific', label: 'Central Standard Time' },
      { value: 'est_pacific', label: 'Eastern Standard Time' },
    ]
  }
];

type DurationPricing = Record<number, number>;

const ANALYST_CUSTOM_PRICING: Record<string, DurationPricing> = {
  adnan: {
    30: 300,
    90: 500,
  },
  assassin: {
    30: 300,
    90: 400,
  },
};

const DEFAULT_PRICING: DurationPricing = {
  30: 60,
  90: 100,
};

const getMeetingPriceForAnalyst = (duration: number, analystName?: string): string => {
  if (duration === 60) {
    return '500 USD';
  }

  const normalizedName = analystName?.trim().toLowerCase() || '';
  const pricingTable = ANALYST_CUSTOM_PRICING[normalizedName] || DEFAULT_PRICING;
  const price = pricingTable[duration];

  if (price) {
    return `${price} USD`;
  }

  // Fallback to closest default tiers if new durations appear
  return duration < 60 ? '60 USD' : '100 USD';
};

// --- TIMEZONE OFFSET HELPERS ---
// Mapping of IANA timezone identifiers to their UTC offsets (in hours)
const getTimezoneOffsets = (): { [key: string]: number } => ({
  // North America
  'America/New_York': -5, 'America/Chicago': -6, 'America/Denver': -7, 'America/Los_Angeles': -8,
  'America/Anchorage': -9, 'Pacific/Honolulu': -10, 'America/Toronto': -5, 'America/Vancouver': -8,
  'America/Winnipeg': -6, 'America/Edmonton': -7, 'America/Halifax': -4, 'America/St_Johns': -3.5,
  'America/Mexico_City': -6, 'America/Cancun': -5, 'America/Tijuana': -8,
  
  // South America
  'America/Sao_Paulo': -3, 'America/Argentina/Buenos_Aires': -3, 'America/Santiago': -4,
  'America/Bogota': -5, 'America/Lima': -5, 'America/Caracas': -4, 'America/Guayaquil': -5,
  'America/La_Paz': -4, 'America/Asuncion': -3, 'America/Montevideo': -3, 'America/Paramaribo': -3,
  'America/Cayenne': -3,
  
  // Europe
  'Europe/London': 0, 'Europe/Dublin': 0, 'Europe/Paris': 1, 'Europe/Berlin': 1, 'Europe/Rome': 1,
  'Europe/Madrid': 1, 'Europe/Amsterdam': 1, 'Europe/Brussels': 1, 'Europe/Vienna': 1, 'Europe/Zurich': 1,
  'Europe/Stockholm': 1, 'Europe/Oslo': 1, 'Europe/Copenhagen': 1, 'Europe/Helsinki': 2, 'Europe/Warsaw': 1,
  'Europe/Prague': 1, 'Europe/Budapest': 1, 'Europe/Bucharest': 2, 'Europe/Sofia': 2, 'Europe/Athens': 2,
  'Europe/Istanbul': 3, 'Europe/Moscow': 3, 'Europe/Kiev': 2, 'Europe/Minsk': 3, 'Europe/Lisbon': 0,
  'Europe/Reykjavik': 0,
  
  // Africa
  'Africa/Cairo': 2, 'Africa/Johannesburg': 2, 'Africa/Lagos': 1, 'Africa/Casablanca': 0, 'Africa/Nairobi': 3,
  'Africa/Tunis': 1, 'Africa/Algiers': 1, 'Africa/Addis_Ababa': 3, 'Africa/Khartoum': 2, 'Africa/Dakar': 0,
  'Africa/Abidjan': 0, 'Africa/Accra': 0, 'Africa/Douala': 1, 'Africa/Luanda': 1, 'Africa/Maputo': 2,
  'Africa/Windhoek': 2,
  
  // Asia
  'Asia/Tokyo': 9, 'Asia/Shanghai': 8, 'Asia/Hong_Kong': 8, 'Asia/Singapore': 8, 'Asia/Seoul': 9,
  'Asia/Manila': 8, 'Asia/Jakarta': 7, 'Asia/Bangkok': 7, 'Asia/Ho_Chi_Minh': 7, 'Asia/Kuala_Lumpur': 8,
  'Asia/Taipei': 8, 'Asia/Kolkata': 5.5, 'Asia/Karachi': 5, 'Asia/Dhaka': 6, 'Asia/Kathmandu': 5.75,
  'Asia/Colombo': 5.5, 'Asia/Dubai': 4, 'Asia/Riyadh': 3, 'Asia/Kuwait': 3, 'Asia/Qatar': 3,
  'Asia/Bahrain': 3, 'Asia/Muscat': 4, 'Asia/Tehran': 3.5, 'Asia/Baghdad': 3, 'Asia/Jerusalem': 2,
  'Asia/Amman': 2, 'Asia/Beirut': 2, 'Asia/Baku': 4, 'Asia/Tbilisi': 4, 'Asia/Yerevan': 4,
  'Asia/Almaty': 6, 'Asia/Tashkent': 5, 'Asia/Kabul': 4.5,
  
  // Oceania
  'Australia/Sydney': 10, 'Australia/Melbourne': 10, 'Australia/Brisbane': 10, 'Australia/Perth': 8,
  'Australia/Adelaide': 9.5, 'Australia/Darwin': 9.5, 'Australia/Hobart': 10, 'Pacific/Auckland': 12,
  'Pacific/Fiji': 12, 'Pacific/Port_Moresby': 10, 'Pacific/Guam': 10, 'Pacific/Saipan': 10,
  'Pacific/Noumea': 11, 'Pacific/Norfolk': 11,
  
  // Other
  'UTC': 0, 'GMT': 0
});

// --- HELPER COMPONENTS ---



// Reusable Analyst Card Component
const AnalystCard: React.FC<AnalystCardProps> = ({ analyst, isSelected, onSelect, onAdvance, isTeamDataLoaded, router }) => {
    const handleClick = () => {
        // If router is provided and analyst has slug, navigate to slug route
        if (router && analyst.slug) {
            router.push(`/meetings/${analyst.slug}`);
            return;
        }
        
        // Fallback to old behavior if no router or slug
        onSelect(analyst.id);
        // Auto-advance to next step after selection
        setTimeout(() => {
            onAdvance();
            // Scroll to top on mobile when advancing to next step
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer relative overflow-hidden group transition-all duration-300 flex flex-col items-center p-4 gap-4 w-full min-w-[180px] sm:max-w-[220px] h-44 bg-[#1F1F1F] rounded-2xl"
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
            
            {/* Gradient Overlay for Selected Card */}
            {isSelected && (
                <div 
                    className="absolute inset-0 opacity-80 rounded-2xl"
                    style={{
                        backgroundImage: 'url("/gradient/Ellipse 2.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}
            
            {/* Content with relative positioning to appear above gradient */}
            <div className="relative z-10 flex flex-col items-center text-center w-full">
                {/* Large Circular Image */}
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {analyst.image && analyst.image.trim() !== '' ? (
                                <Image 
                                    src={analyst.image} 
                                    alt={analyst.name}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover filter grayscale"
                                    onError={(e) => {
                                        // Fallback to placeholder if image doesn't exist
                                        e.currentTarget.style.display = 'none';
                                        const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                        if (nextElement) {
                                            nextElement.style.display = 'flex';
                                        }
                                    }}
                                />
                            ) : null}
                    <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-lg font-bold" style={{display: analyst.image && analyst.image.trim() !== '' ? 'none' : 'flex'}}>
                                {analyst.name.charAt(0)}
                            </div>
                        </div>
                        
                        {/* Name */}
                <h3 className="text-sm font-bold text-white mb-2 mt-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>{analyst.name}</h3>
                
                {/* Role - Use dynamic role from MongoDB */}
                <p className="text-gray-400 text-xs leading-tight line-clamp-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                    {isTeamDataLoaded ? analyst.description : (
                        <span className="inline-block w-20 h-3 bg-gray-600 rounded animate-pulse"></span>
                    )}
                </p>
            </div>
        </div>
    );
};

// Reusable Meeting Card Component
const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(meeting.id)}
            className="cursor-pointer relative overflow-hidden group transition-all duration-300 hover:border-gray-500 flex flex-col items-center p-5 gap-4 w-full bg-[#1F1F1F] rounded-2xl"
        >
            {/* Gradient Overlay for Selected Card */}
            {isSelected && (
                <div 
                    className="absolute inset-0 rounded-2xl opacity-80 pointer-events-none z-[5]"
                    style={{
                        backgroundImage: 'url("/gradient/Ellipse 2.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}
            
            {/* Curved Gradient Border */}
            <div 
                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                style={{
                    background: isSelected 
                        ? 'linear-gradient(226.35deg, #DE50EC 0%, rgba(222, 80, 236, 0) 50.5%)'
                        : 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                }}
            >
                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
            </div>
            
            {/* Content with relative positioning to appear above gradient */}
            <div className="relative z-20 flex flex-col items-start text-left w-full">
                <div className="flex justify-between items-start mb-1 w-full gap-2">
                    <h3 className="text-xl font-bold text-white flex-shrink" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>{meeting.title}</h3>
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
                        
                        <span className="relative z-10 inline-block bg-[#1F1F1F] text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600/50 group-hover:border-gray-500/70 transition-colors duration-300 whitespace-nowrap">{meeting.price}</span>
                </div>
                </div>
                <div className="mb-2">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                        meeting.id === 2 ? 'bg-purple-400/12 border border-purple-400 text-purple-400' :
                        'bg-yellow-400/12 border border-yellow-400 text-yellow-400'
                    }`}>
                        {meeting.duration}
                    </span>
                </div>
                <p className="text-gray-400 text-sm leading-tight line-clamp-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>{meeting.description}</p>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const MeetingsPage = ({ slug }: { slug?: string } = {}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Ref to track if slug routing has been initialized (prevents re-running on step changes)
    const slugInitializedRef = useRef<boolean>(false);
    
    // Initialize step based on slug or URL params to prevent flash
    // Check URL params synchronously on client side for immediate initialization
    const getInitialStep = (): number => {
        if (slug) return 2; // Slug route always starts at step 2
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const stepParam = params.get('step');
            if (stepParam) {
                const step = parseInt(stepParam);
                if (step >= 1 && step <= 3) return step;
            }
        }
        return 1; // Default to step 1
    };
    
    const [currentStep, setCurrentStep] = useState<number>(getInitialStep());
    const [selectedAnalyst, setSelectedAnalyst] = useState<number | null>(null); // No default selection
    const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null); // No default selection
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [reviewStatsByAnalyst, setReviewStatsByAnalyst] = useState<Record<number, ReviewStats>>({});
    const [isLoadingReviewStats, setIsLoadingReviewStats] = useState<boolean>(false);
    
    // Cache invalidation function
    const invalidateCache = () => {
        if (typeof sessionStorage !== 'undefined') {
            console.log('🗑️ Invalidating cache for section navigation');
            sessionStorage.removeItem('teamData');
            sessionStorage.removeItem('lastTeamDataFetch');
            sessionStorage.removeItem('calendlyEventTypes');
            sessionStorage.removeItem('calendlyAvailability');
            sessionStorage.removeItem('calendlyEventDetails');
        }
    };
    
    // Data validation function to ensure consistent data structure
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
    
    // Cache invalidation on step navigation
    useEffect(() => {
        console.log(`🔄 Step changed to: ${currentStep}`);
        
        // Invalidate cache when moving between sections
        if (currentStep === 1) {
            // Moving to analyst selection - invalidate all cache
            console.log('🗑️ Moving to analyst selection - invalidating all cache');
            invalidateCache();
        } else if (currentStep === 2) {
            // Moving to meeting selection - invalidate Calendly cache
            console.log('🗑️ Moving to meeting selection - invalidating Calendly cache');
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('calendlyEventTypes');
                sessionStorage.removeItem('calendlyAvailability');
                sessionStorage.removeItem('calendlyEventDetails');
            }
        } else if (currentStep === 3) {
            // Moving to payment - invalidate booking cache
            console.log('🗑️ Moving to payment - invalidating booking cache');
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('calendlyEventDetails');
            }
        }
    }, [currentStep]);
    const [analystAbout, setAnalystAbout] = useState<string>('');
    const [isLoadingAbout, setIsLoadingAbout] = useState<boolean>(false);
    const [isTimezoneOpen, setIsTimezoneOpen] = useState<boolean>(false);
    const [analysts, setAnalysts] = useState<Analyst[]>([]);
    const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
    const [teamDataError, setTeamDataError] = useState<string>('');
    
    // Calendly Integration States
    const [calendlyEventTypes, setCalendlyEventTypes] = useState<any[]>([]);
    const [calendlyMeetings, setCalendlyMeetings] = useState<Meeting[]>([]);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimesByDate, setAvailableTimesByDate] = useState<Record<string, string[]>>({});
    const [slotUrlsByDateTime, setSlotUrlsByDateTime] = useState<Record<string, string>>({});
    const [rawTimestampsByDateTime, setRawTimestampsByDateTime] = useState<Record<string, string>>({});
    const [isLoadingEventTypes, setIsLoadingEventTypes] = useState<boolean>(false);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false);
    const [isTimezoneChanging, setIsTimezoneChanging] = useState<boolean>(false);
    const [analystsWithCalendly, setAnalystsWithCalendly] = useState<Set<number>>(new Set());
    const [selectedEventTypeUri, setSelectedEventTypeUri] = useState<string>('');
    const [isCreatingBooking, setIsCreatingBooking] = useState<boolean>(false);

    // Function to fetch analyst about data from MongoDB
    const fetchAnalystAbout = async (analystName: string) => {
        setIsLoadingAbout(true);
        setAnalystAbout(''); // Clear previous data immediately
        
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
                const aboutText = data.about || 'No additional information available.';


                setAnalystAbout(aboutText);
            } else {
                setAnalystAbout('No additional information available.');
            }
        } catch (error) {
            console.error('Error fetching analyst about data:', error);
            setAnalystAbout('No additional information available.');
        } finally {
            setIsLoadingAbout(false);
        }
    };

    // Function to fetch team data from MongoDB with retry logic
    const fetchTeamData = async (retryCount = 0) => {
        try {
            console.log(`🔄 Fetching team data from API... (attempt ${retryCount + 1})`);
            setTeamDataError(''); // Clear any previous errors
            
            const response = await fetch('/api/team');
            if (response.ok) {
                const data = await response.json();
                console.log('📊 API Response:', {
                    teamCount: data.team?.length || 0,
                    hasRawTeam: !!data.rawTeam,
                    firstAnalyst: data.team?.[0] ? {
                        id: data.team[0].id,
                        name: data.team[0].name,
                        description: data.team[0].description?.substring(0, 30) + '...',
                        hasImage: !!data.team[0].image
                    } : null
                });
                
                // Use the transformed analyst data directly and sort by ID
                const sortedAnalysts = data.team.sort((a: Analyst, b: Analyst) => a.id - b.id);
                
                // Validate data before setting
                const validAnalysts = sortedAnalysts.filter(validateAnalystData);
                if (validAnalysts.length !== sortedAnalysts.length) {
                    console.warn('⚠️ Some analyst data is invalid, filtering out invalid entries');
                }
                
                setAnalysts(validAnalysts);
                // Cache for future use
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.setItem('teamData', JSON.stringify(sortedAnalysts));
                    sessionStorage.setItem('lastTeamDataFetch', Date.now().toString());
                }
                setIsTeamDataLoaded(true);
                console.log('✅ Team data loaded successfully');
            } else {
                console.error('❌ API failed with status:', response.status);
                
                // Retry logic for 500 errors (server issues)
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


    // Helper function to check if an analyst has Calendly integration
    const hasCalendlyIntegration = (analystId: number) => {
        return analystsWithCalendly.has(analystId);
    };

    // Function to check if a specific analyst has Calendly integration (async version)
    const checkAnalystCalendlyIntegration = async (analystId: number) => {
        try {
            console.log(`🔍 Checking Calendly integration for analyst ${analystId} only`);
            const response = await fetch(`/api/analysts/calendly-credentials?analystId=${analystId}`);
            if (response.ok) {
                const data = await response.json();
                return data.analyst.calendly.enabled;
            }
            return false;
        } catch (error) {
            console.error(`Error checking Calendly integration for analyst ${analystId}:`, error);
            return false;
        }
    };

    // Function to check Calendly integration for all analysts (only called once on mount)
    const checkAllAnalystsCalendlyIntegration = async () => {
        const calendlyAnalysts = new Set<number>();
        
        // Check each analyst for Calendly integration (only on initial load)
        for (let i = 0; i <= 7; i++) {
            try {
                const response = await fetch(`/api/analysts/calendly-credentials?analystId=${i}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.analyst.calendly.enabled) {
                        calendlyAnalysts.add(i);
                        console.log(`✅ Analyst ${i} (${data.analyst.name}) has Calendly integration`);
                    } else {
                        console.log(`❌ Analyst ${i} (${data.analyst.name}) has Calendly disabled`);
                    }
                } else {
                    console.log(`❌ Analyst ${i} not found or no credentials`);
                }
            } catch (error) {
                console.error(`Error checking Calendly integration for analyst ${i}:`, error);
            }
        }
        
        setAnalystsWithCalendly(calendlyAnalysts);
        console.log('🎯 Final list - Analysts with Calendly integration:', Array.from(calendlyAnalysts));
    };

    // Function to check Calendly integration for a specific analyst only
    const checkSpecificAnalystCalendlyIntegration = async (analystId: number) => {
        try {
            console.log(`🎯 Checking Calendly integration for SELECTED analyst ${analystId} only`);
            const response = await fetch(`/api/analysts/calendly-credentials?analystId=${analystId}`);
            if (response.ok) {
                const data = await response.json();
                const hasCalendly = data.analyst.calendly.enabled;
                
                // Update the set for this specific analyst
                setAnalystsWithCalendly(prev => {
                    const newSet = new Set(prev);
                    if (hasCalendly) {
                        newSet.add(analystId);
                        console.log(`✅ Analyst ${analystId} (${data.analyst.name}) has Calendly integration`);
                    } else {
                        newSet.delete(analystId);
                        console.log(`❌ Analyst ${analystId} (${data.analyst.name}) has Calendly disabled`);
                    }
                    return newSet;
                });
                
                return hasCalendly;
            } else {
                console.log(`❌ Analyst ${analystId} not found or no credentials`);
                return false;
            }
        } catch (error) {
            console.error(`Error checking Calendly integration for analyst ${analystId}:`, error);
            return false;
        }
    };

    // Function to fetch Calendly event types
    const fetchCalendlyEventTypes = async () => {
        if (selectedAnalyst === null) return;
        console.log(`🔄 Starting to fetch Calendly event types for Analyst ${selectedAnalyst}...`);
        try {
            const response = await fetch(`/api/calendly/event-types?analystId=${selectedAnalyst}`);
            console.log('📡 API Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ API Response data:', data);
                setCalendlyEventTypes(data.eventTypes || []);
                const selectedAnalystName = analysts.find(a => a.id === selectedAnalyst)?.name;
                
                // Transform Calendly event types to Meeting format with deduplication
                const uniqueEventTypes = data.eventTypes.filter((eventType: any, index: number, self: any[]) => 
                    // Remove duplicates based on name and duration
                    index === self.findIndex(e => e.name === eventType.name && e.duration === eventType.duration)
                );
                
                console.log(`🔄 Filtered ${data.eventTypes.length} event types to ${uniqueEventTypes.length} unique types`);
                
                const transformedMeetings: Meeting[] = uniqueEventTypes.map((eventType: any, index: number) => {
                    return {
                        id: index + 2, // Start from 2 to match existing IDs
                        title: eventType.name,
                        duration: `${eventType.duration} minutes`,
                        price: getMeetingPriceForAnalyst(eventType.duration, selectedAnalystName),
                        description: eventType.description || 'A focused session to address specific challenges.',
                        color: index % 2 === 0 ? 'text-purple-400' : 'text-yellow-400',
                    };
                });
                
                console.log('🔄 Transformed meetings:', transformedMeetings);
                
                if (transformedMeetings.length > 0) {
                    setCalendlyMeetings(transformedMeetings);
                    console.log('✅ Set Calendly meetings successfully');
                } else {
                    console.log('⚠️ No transformed meetings found - setting empty array');
                    setCalendlyMeetings([]);
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('❌ API Error:', response.status, errorData);
            }
        } catch (error) {
            console.error('❌ Error fetching Calendly event types:', error);
            // Keep empty array if Calendly fetch fails
            setCalendlyMeetings([]);
        } finally {
            console.log('🏁 Finished fetching Calendly event types');
        }
    };

    // Function to fetch Calendly availability
    const fetchCalendlyAvailability = async (eventTypeUri: string, startDate: string, endDate: string, timezone?: string) => {
        if (selectedAnalyst === null) return;
        setIsLoadingAvailability(true);
        console.log('Fetching Calendly availability:', { eventTypeUri, startDate, endDate, timezone, analystId: selectedAnalyst });
        try {
            const url = new URL('/api/calendly/availability', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
            url.searchParams.append('eventTypeUri', eventTypeUri);
            url.searchParams.append('startDate', startDate);
            url.searchParams.append('endDate', endDate);
            url.searchParams.append('analystId', selectedAnalyst.toString());
            if (timezone) {
                url.searchParams.append('timezone', timezone);
            }
            
            const response = await fetch(url.toString());
            if (response.ok) {
                const data = await response.json();
                console.log('Received availability data:', data);
                setAvailableDates(data.availableDates || []);
                setAvailableTimesByDate(data.availabilityByDate || {});
                setSlotUrlsByDateTime(data.slotUrls || {});
                setRawTimestampsByDateTime(data.rawTimestamps || {});
            } else {
                console.error('Failed to fetch availability:', response.status, await response.text());
            }
        } catch (error) {
            console.error('Error fetching Calendly availability:', error);
        } finally {
            setIsLoadingAvailability(false);
        }
    };

    const [hoveredTimezone, setHoveredTimezone] = useState<string>('');
    const [timezoneSearch, setTimezoneSearch] = useState<string>('');
    const [userTimezone, setUserTimezone] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [notesError, setNotesError] = useState<string>('');
    const [paymentCompleted, setPaymentCompleted] = useState<boolean>(false);
    const [paymentInitiating, setPaymentInitiating] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<string>('');

    // Detect user's timezone once on mount (used only for sorting suggestions; user still chooses)
    useEffect(() => {
        if (typeof window === 'undefined' || typeof Intl === 'undefined' || !Intl.DateTimeFormat) return;

        try {
            const resolvedTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (resolvedTz) {
                setUserTimezone(resolvedTz);
            }
        } catch (error) {
            console.warn('Unable to resolve user timezone:', error);
        }
    }, []);

    // Load Calendly widget script for popup functionality
    useEffect(() => {
        // Only run on client-side
        if (typeof window === 'undefined') return;
        
        // Load Calendly CSS
        const link = document.createElement('link');
        link.href = 'https://assets.calendly.com/assets/external/widget.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        
        // Load Calendly JS
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);
        
        return () => {
            if (typeof window !== 'undefined') {
                try {
                    document.head.removeChild(link);
                    document.body.removeChild(script);
                } catch (e) {
                    // Ignore errors if elements don't exist
                }
            }
        };
    }, []);

    // Check payment status and restore form data on mount (run only once)
    useEffect(() => {
        // Ensure we're on the client side
        if (typeof window === 'undefined') return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');
        const sessionId = urlParams.get('session_id');
        const formDataKey = 'meetings-form';
        
        console.log('🔄 Component mounted. Payment status:', paymentStatus, 'Session ID:', sessionId ? 'present' : 'none');
        
        // Handle payment status first
        if (paymentStatus === 'success' && sessionId) {
            // Payment was successful
            console.log('✅ Payment successful detected!');
            
            // Restore form data from sessionStorage (with safety check)
            const savedFormData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(formDataKey) : null;
            console.log('📦 Checking for saved form data:', savedFormData ? 'FOUND' : 'NOT FOUND');
            
            if (savedFormData) {
                try {
                    const formData = JSON.parse(savedFormData);
                    console.log('📝 Form data to restore:', {
                        name: formData.fullName,
                        email: formData.email,
                        analyst: formData.selectedAnalyst,
                        meeting: formData.selectedMeeting,
                        date: formData.selectedDate,
                        time: formData.selectedTime,
                        timezone: formData.selectedTimezone
                    });
                    
                    // CRITICAL: Set loading state IMMEDIATELY to disable Continue button
                    setIsLoadingAvailability(true);
                    console.log('🔒 Set isLoadingAvailability=true to disable Continue button during data fetch');
                    
                    // Use setTimeout to batch all state updates together
                    setTimeout(() => {
                        // Restore all form fields in one batch
                        const restoredFullName = formData.fullName || '';
                        const restoredEmail = formData.email || '';
                        const restoredNotes = formData.notes || '';
                        
                        setFullName(restoredFullName);
                        setEmail(restoredEmail);
                        setNotes(restoredNotes);
                        
                        // Validate restored fields
                        setNameError(validateName(restoredFullName));
                        setEmailError(validateEmail(restoredEmail));
                        setNotesError(validateNotes(restoredNotes));
                        
                        setSelectedAnalyst(formData.selectedAnalyst !== undefined ? formData.selectedAnalyst : null);
                        setSelectedMeeting(formData.selectedMeeting !== undefined ? formData.selectedMeeting : null);
                        setSelectedDate(formData.selectedDate || '');
                        setSelectedTime(formData.selectedTime || '');
                        setSelectedTimezone(formData.selectedTimezone || '');
                        
                        // CRITICAL: Set currentMonth to match the saved date so availability fetches correctly
                        if (formData.selectedDate) {
                            // Parse date more reliably for production (YYYY-MM-DD format)
                            const dateParts = formData.selectedDate.split('-');
                            const savedDateObj = new Date(
                                parseInt(dateParts[0]), // year
                                parseInt(dateParts[1]) - 1, // month (0-indexed)
                                parseInt(dateParts[2]), // day
                                12, 0, 0, 0 // noon local time
                            );
                            console.log('📅 Setting currentMonth to match saved date:', formData.selectedDate, '→', savedDateObj);
                            setCurrentMonth(savedDateObj);
                        }
                        
                        setPaymentCompleted(true);
                        setPaymentError('');
                        
                        // CRITICAL: Set to step 3
                        setCurrentStep(3);
                        
                        console.log('✅ All state restored, should now be on step 3');
                        
                        // DON'T clear URL params - let user stay with params visible
                        // This prevents any race condition
                        console.log('ℹ️ Keeping URL params visible for transparency');
                    }, 0); // Use 0 to defer to next tick but keep it fast
                    
                } catch (error) {
                    console.error('❌ Failed to restore form data:', error);
                }
            } else {
                console.error('⚠️ CRITICAL: No saved form data found after payment! SessionStorage might have been cleared.');
                alert('There was an issue restoring your booking information. Please try again.');
            }
        } else if (paymentStatus === 'cancelled') {
            // Payment was cancelled - restore form data but don't activate payment
            console.log('❌ Payment cancelled');
            
            const savedFormData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(formDataKey) : null;
            if (savedFormData) {
                try {
                    const formData = JSON.parse(savedFormData);
                    console.log('📝 Restoring form data after cancellation');
                    
                    // Set loading state to ensure consistency
                    setIsLoadingAvailability(true);
                    console.log('🔒 Set isLoadingAvailability=true after cancellation');
                    
                    setTimeout(() => {
                        const restoredFullName = formData.fullName || '';
                        const restoredEmail = formData.email || '';
                        const restoredNotes = formData.notes || '';
                        
                        setFullName(restoredFullName);
                        setEmail(restoredEmail);
                        setNotes(restoredNotes);
                        
                        // Validate restored fields
                        setNameError(validateName(restoredFullName));
                        setEmailError(validateEmail(restoredEmail));
                        setNotesError(validateNotes(restoredNotes));
                        
                        setSelectedAnalyst(formData.selectedAnalyst !== undefined ? formData.selectedAnalyst : null);
                        setSelectedMeeting(formData.selectedMeeting !== undefined ? formData.selectedMeeting : null);
                        setSelectedDate(formData.selectedDate || '');
                        setSelectedTime(formData.selectedTime || '');
                        setSelectedTimezone(formData.selectedTimezone || '');
                        
                        // Set currentMonth to match the saved date
                        if (formData.selectedDate) {
                            // Parse date more reliably for production (YYYY-MM-DD format)
                            const dateParts = formData.selectedDate.split('-');
                            const savedDateObj = new Date(
                                parseInt(dateParts[0]), // year
                                parseInt(dateParts[1]) - 1, // month (0-indexed)
                                parseInt(dateParts[2]), // day
                                12, 0, 0, 0 // noon local time
                            );
                            console.log('📅 Setting currentMonth to match saved date after cancellation:', formData.selectedDate, '→', savedDateObj);
                            setCurrentMonth(savedDateObj);
                        }
                        
                        setPaymentCompleted(false);
                        setPaymentError('Payment was cancelled. Please try again.');
                        setCurrentStep(3);
                        
                        console.log('✅ Restored after cancellation');
                    }, 0);
                } catch (error) {
                    console.error('❌ Failed to restore form data:', error);
                }
            }
        } else {
            console.log('ℹ️ Normal page load, no payment flow');
        }
    }, []); // Run only once on mount

    // Fetch team data and check Calendly integration on component mount
    useEffect(() => {
        // Small delay to ensure any recent database operations have completed
        const timer = setTimeout(() => {
            fetchTeamData();
            checkAllAnalystsCalendlyIntegration();
        }, 100);
        
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Auto-refresh team data when user returns to the page (focus event)
    useEffect(() => {
        const handleFocus = () => {
            // Only refresh if we're not currently loading and it's been more than 30 seconds since last fetch
            const lastFetch = sessionStorage.getItem('lastTeamDataFetch');
            const now = Date.now();
            const timeSinceLastFetch = lastFetch ? now - parseInt(lastFetch) : Infinity;
            
            if (timeSinceLastFetch > 30000) { // 30 seconds
                console.log('🔄 Page focused - refreshing team data...');
                fetchTeamData();
            }
        };

        // Listen for focus events
        window.addEventListener('focus', handleFocus);
        
        // Also refresh when page becomes visible (handles tab switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                handleFocus();
            }
        });

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleFocus);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle slug-based routing when slug is provided (using Next.js dynamic route)
    useEffect(() => {
        // If slug is provided, find analyst by slug and set up the booking flow
        if (!slug) {
            slugInitializedRef.current = false;
            return;
        }

        // Skip slug routing if we have payment query params (returning from payment)
        // This prevents resetting the form when returning from payment
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const paymentStatus = urlParams.get('payment');
            if (paymentStatus === 'success' || paymentStatus === 'cancelled') {
                console.log('🔄 Skipping slug routing - payment query params present');
                return;
            }
        }

        // Only process slug if team data is loaded and we have analysts
        if (!isTeamDataLoaded || analysts.length === 0) {
            return;
        }

        // If already initialized and analyst matches, don't re-run (prevents interfering with step navigation)
        const analystBySlug = analysts.find(a => {
            return a.slug && a.slug.toLowerCase() === slug.toLowerCase();
        });
        
        if (analystBySlug && selectedAnalyst === analystBySlug.id && slugInitializedRef.current) {
            // Already initialized, don't interfere with current step
            return;
        }

        // Use slug directly from API (API ensures slug is always present and valid)
        if (analystBySlug) {
            console.log(`🔗 Slug-based routing: Found analyst ${analystBySlug.id} (${analystBySlug.name}) from slug "${slug}"`);
            
            // Set selected analyst immediately (this will trigger Calendly data fetch)
            if (selectedAnalyst !== analystBySlug.id) {
                setSelectedAnalyst(analystBySlug.id);
            }
            
            // Only set step to 2 if we're on step 1 (don't override step 2 or step 3)
            // This allows navigation from step 2 to step 3 without being forced back to step 2
            // Also prevents overriding step 3 when returning from payment
            if (currentStep === 1) {
                setCurrentStep(2);
            }
            
            // Mark as initialized
            slugInitializedRef.current = true;
        } else {
            console.warn(`⚠️ No analyst found with slug "${slug}"`);
            // If slug doesn't match, redirect to meetings page without slug
            router.replace('/meetings');
            slugInitializedRef.current = false;
        }
        // Remove currentStep from dependencies to prevent re-running when step changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug, isTeamDataLoaded, analysts, selectedAnalyst, router]);

    // Fetch Calendly event types when an analyst with Calendly integration is selected
    useEffect(() => {
        const handleAnalystSelection = async () => {
            if (selectedAnalyst === null) return;
            
            // Check if we're returning from payment (with safety checks)
            if (typeof window === 'undefined') return;
            
            const urlParams = new URLSearchParams(window.location.search);
            const paymentStatus = urlParams.get('payment');
            const formDataKey = 'meetings-form';
            const savedFormData = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(formDataKey) : null;
            const isReturningFromPayment = (paymentStatus === 'success' || paymentStatus === 'cancelled') && savedFormData;
            
            // Detect URL-based redirects (coming from about page with step=2 in URL OR slug-based route)
            const stepParam = searchParams.get('step');
            const isUrlRedirect = (stepParam === '2' && searchParams.get('selectedAnalyst') !== null) || !!slug;
            
            // Allow fetching when:
            // 1. Normal flow: currentStep !== 2 (user manually selected analyst from step 1)
            // 2. URL redirect: currentStep === 2 but we detected step=2 in URL (coming from about page)
            const shouldFetch = currentStep !== 2 || isUrlRedirect;
            
            if (!shouldFetch) return;
            
            // Ensure analysts array is loaded before fetching
            if (!isTeamDataLoaded || analysts.length === 0) {
                console.log('⏳ Waiting for team data to load before fetching meeting types...');
                return;
            }
            
            if (isReturningFromPayment) {
                console.log(`✋ Returning from payment for analyst ${selectedAnalyst} - loading Calendly data WITHOUT reset`);
                
                // Parse saved form data to get the selected date/meeting
                let savedDate = '';
                let savedMeeting = null;
                try {
                    const formData = JSON.parse(savedFormData);
                    savedDate = formData.selectedDate || '';
                    savedMeeting = formData.selectedMeeting;
                } catch (error) {
                    console.error('Error parsing saved form data:', error);
                }
                
                // Load Calendly data but don't reset the form
                setIsLoadingEventTypes(true);
                
                try {
                    const hasCalendly = await checkSpecificAnalystCalendlyIntegration(selectedAnalyst);
                    
                    if (hasCalendly) {
                        console.log(`📅 Analyst ${selectedAnalyst} has Calendly - fetching event types and availability`);
                        await fetchCalendlyEventTypes();
                        
                        // If we have a saved date, fetch availability for that date
                        if (savedDate && savedMeeting !== null) {
                            console.log(`📆 Fetching Calendly availability for saved date: ${savedDate}`);
                            // The availability will be fetched by the selectedDate useEffect
                        }
                    } else {
                        console.log(`ℹ️ Analyst ${selectedAnalyst} has no Calendly integration`);
                    }
                } catch (error) {
                    console.error('Error loading Calendly data after payment:', error);
                } finally {
                    setIsLoadingEventTypes(false);
                }
                
                // Don't reset form or step - just return after loading Calendly data
                return;
            }
            
            // Handle URL redirect (coming from about page)
            if (isUrlRedirect && currentStep === 2) {
                console.log(`🔗 URL redirect detected: Fetching meeting types for analyst ${selectedAnalyst} at step 2`);
                setIsLoadingEventTypes(true);
                
                try {
                    // Check if this specific analyst has Calendly integration
                    const hasCalendly = await checkSpecificAnalystCalendlyIntegration(selectedAnalyst);
                    
                    if (hasCalendly) {
                        console.log(`🎯 Analyst ${selectedAnalyst} has Calendly integration - fetching event types from URL redirect`);
                        await fetchCalendlyEventTypes();
                    } else {
                        console.log(`📋 Analyst ${selectedAnalyst} does not have Calendly integration - no meetings available`);
                        // Keep empty array - will show "no bookings available" message
                        setCalendlyMeetings([]);
                    }
                } catch (error) {
                    console.error('Error handling URL redirect analyst selection:', error);
                    setCalendlyMeetings([]);
                } finally {
                    setIsLoadingEventTypes(false);
                }
                
                // Don't reset step or selections - we're already at step 2 from URL
                return;
            }
            
            // Reset ALL selections when analyst changes (normal flow only)
            console.log(`🔄 Normal flow: Resetting all selections for new analyst ${selectedAnalyst}`);
            setCalendlyMeetings([]);
            setSelectedMeeting(null);
            setSelectedDate('');
            setSelectedTime('');
            setSelectedTimezone('');
            setAvailableDates([]);
            setAvailableTimesByDate({});
            setSlotUrlsByDateTime({});
            setRawTimestampsByDateTime({});
            setCurrentStep(1); // Reset to analyst selection step
            setIsLoadingEventTypes(true);
            
            try {
                // Check if this specific analyst has Calendly integration
                const hasCalendly = await checkSpecificAnalystCalendlyIntegration(selectedAnalyst);
                
                if (hasCalendly) {
                    console.log(`🎯 Analyst ${selectedAnalyst} has Calendly integration - fetching event types`);
                    await fetchCalendlyEventTypes();
                } else {
                    console.log(`📋 Analyst ${selectedAnalyst} does not have Calendly integration - no meetings available`);
                    // Keep empty array - will show "no bookings available" message
                    setCalendlyMeetings([]);
                }
            } catch (error) {
                console.error('Error handling analyst selection:', error);
                setCalendlyMeetings([]);
            } finally {
                setIsLoadingEventTypes(false);
            }
        };
        
        handleAnalystSelection();
    }, [selectedAnalyst, searchParams, isTeamDataLoaded, analysts.length, slug]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Calendly availability when meeting type, month, or timezone change
    useEffect(() => {
        const handleAvailabilityFetch = async () => {
            if (selectedAnalyst !== null && selectedMeeting !== null && calendlyEventTypes.length > 0) {
                // Use the cached Calendly integration status instead of making another API call
                const hasCalendly = hasCalendlyIntegration(selectedAnalyst);
                
                if (hasCalendly) {
                    // Check if we're returning from payment - if so, always fetch availability
                    const urlParams = new URLSearchParams(window.location.search);
                    const paymentStatus = urlParams.get('payment');
                    const isReturningFromPayment = paymentStatus === 'success' || paymentStatus === 'cancelled';
                    
                    // CRITICAL: Always fetch when timezone is selected, don't skip initial fetch
                    // Only skip if NO timezone is selected (to avoid fetching without timezone context)
                    if (!selectedTimezone) {
                        console.log('⏭️ Skipping availability fetch - no timezone selected yet');
                        return;
                    }
                    
                    if (isReturningFromPayment) {
                        console.log('🔄 Returning from payment - fetching availability for selected date and timezone');
                    } else if (Object.keys(availableTimesByDate).length === 0) {
                        console.log('🆕 First timezone selection - fetching availability');
                    } else {
                        console.log('🔄 Timezone changed - refetching availability with new timezone');
                    }
                    console.log('Attempting to fetch availability:', {
                        selectedMeeting,
                        calendlyEventTypesLength: calendlyEventTypes.length,
                        calculatedIndex: selectedMeeting - 2,
                        selectedTimezone,
                        currentMonth: currentMonth.toISOString().split('T')[0]
                    });
            
            const selectedEventType = calendlyEventTypes[selectedMeeting - 2]; // Adjust index
            console.log('Selected event type:', selectedEventType);
            
            if (selectedEventType && selectedEventType.id) {
                setSelectedEventTypeUri(selectedEventType.id);
                
                // Calendly API limitations:
                // 1. Date range can't be greater than 7 days
                // 2. Start time must be in the future (at least 24 hours from now)
                
                // Start from at least 24 hours in the future to be safe with Calendly's API
                const minStartDate = new Date();
                minStartDate.setDate(minStartDate.getDate() + 1); // Tomorrow
                minStartDate.setHours(12, 0, 0, 0); // Noon tomorrow to be safe
                
                const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                startOfMonth.setHours(0, 0, 0, 0);
                
                // Always use the future date - never fetch past dates for scheduling
                // If the month being viewed is in the past, start from tomorrow instead
                let startDate = startOfMonth > minStartDate ? startOfMonth : minStartDate;
                
                // Double-check: ensure we never start from a past date
                const now = new Date();
                if (startDate <= now) {
                    console.warn('⚠️ Start date was in the past, adjusting to tomorrow');
                    startDate = new Date(now);
                    startDate.setDate(startDate.getDate() + 1);
                    startDate.setHours(12, 0, 0, 0);
                }
                
                console.log('Date range calculation:', {
                    currentMonth: currentMonth.toISOString().split('T')[0],
                    startOfMonth: startOfMonth.toISOString().split('T')[0],
                    minStartDate: minStartDate.toISOString().split('T')[0],
                    finalStartDate: startDate.toISOString().split('T')[0],
                    isStartOfMonthInPast: startOfMonth < minStartDate
                });
                
                // Limit the end date to avoid requesting too far in the future (Calendly typically allows 3-6 months)
                const maxEndDate = new Date();
                maxEndDate.setMonth(maxEndDate.getMonth() + 3); // 3 months from now
                
                const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                
                // Use the earlier of end of month or max allowed date
                const endDate = endOfMonth < maxEndDate ? endOfMonth : maxEndDate;
                
                // Fetch availability in 7-day chunks
                const fetchAllAvailability = async () => {
                    const allDates: string[] = [];
                    const allTimesByDate: Record<string, string[]> = {};
                    const allSlotUrls: Record<string, string> = {};
                    const allRawTimestamps: Record<string, string> = {};
                    
                    let currentStart = new Date(startDate);
                    let chunkCount = 0;
                    const maxChunks = 12; // Limit to 12 chunks (12 weeks = 3 months)
                    
                    while (currentStart <= endDate && chunkCount < maxChunks) {
                        // Calculate end date (7 days from start or end date, whichever is earlier)
                        const currentEnd = new Date(currentStart);
                        currentEnd.setDate(currentEnd.getDate() + 6); // 7 days total (inclusive)
                        
                        if (currentEnd > endDate) {
                            currentEnd.setTime(endDate.getTime());
                        }
                        
                        const startDateStr = currentStart.toISOString().split('T')[0];
                        const endDateStr = currentEnd.toISOString().split('T')[0];
                        
                        console.log('Fetching availability chunk:', { startDateStr, endDateStr });
                        
                        try {
                            const url = new URL('/api/calendly/availability', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                            url.searchParams.append('eventTypeUri', selectedEventType.id);
                            url.searchParams.append('startDate', startDateStr);
                            url.searchParams.append('endDate', endDateStr);
                            url.searchParams.append('analystId', selectedAnalyst.toString());
                            if (selectedTimezone) {
                                url.searchParams.append('timezone', selectedTimezone);
                            }
                            
                            const response = await fetch(url.toString());
                            
                            if (response.ok) {
                                const data = await response.json();
                                console.log('Received chunk data:', data);
                                
                                // Merge the results
                                if (data.availableDates) {
                                    allDates.push(...data.availableDates);
                                }
                                if (data.availabilityByDate) {
                                    Object.assign(allTimesByDate, data.availabilityByDate);
                                }
                                if (data.slotUrls) {
                                    Object.assign(allSlotUrls, data.slotUrls);
                                }
                                if (data.rawTimestamps) {
                                    Object.assign(allRawTimestamps, data.rawTimestamps);
                                }
                            } else {
                                const errorText = await response.text();
                                
                                // Handle different error types appropriately
                                if (response.status === 403) {
                                    // Permission denied - this is expected for some date ranges
                                    console.log(`ℹ️ Skipping date range ${startDateStr} to ${endDateStr} - no permission (this is normal)`);
                                } else if (response.status === 400) {
                                    // Bad request - likely invalid date range
                                    console.log(`ℹ️ Skipping date range ${startDateStr} to ${endDateStr} - invalid range`);
                                } else {
                                    // Other errors - log as warning but don't treat as critical
                                    console.warn(`⚠️ Failed to fetch chunk for ${startDateStr} to ${endDateStr}:`, response.status, errorText);
                                }
                            }
                        } catch (error) {
                            console.error('Error fetching chunk:', error);
                        }
                        
                        // Move to next week
                        currentStart.setDate(currentStart.getDate() + 7);
                        chunkCount++;
                    }
                    
                    // Remove duplicates and sort
                    const uniqueDates = [...new Set(allDates)].sort();
                    
                    console.log('Total availability fetched:', {
                        totalDates: uniqueDates.length,
                        dates: uniqueDates,
                        totalSlotUrls: Object.keys(allSlotUrls).length,
                        chunksProcessed: chunkCount,
                        maxChunks: maxChunks
                    });
                    
                    // Only set availability if we got some data, otherwise keep empty arrays
                    if (uniqueDates.length > 0) {
                        setAvailableDates(uniqueDates);
                        setAvailableTimesByDate(allTimesByDate);
                        setSlotUrlsByDateTime(allSlotUrls);
                        setRawTimestampsByDateTime(allRawTimestamps);
                    } else {
                        console.warn('No availability data received - user can still book directly through Calendly popup');
                        // Keep empty arrays - this will show "no available times" but booking will still work
                        setAvailableDates([]);
                        setAvailableTimesByDate({});
                        setSlotUrlsByDateTime({});
                        setRawTimestampsByDateTime({});
                    }
                };
                
                setIsLoadingAvailability(true);
                fetchAllAvailability().finally(() => {
                    setIsLoadingAvailability(false);
                    console.log('✅ Calendly availability fetch completed');
                });
            } else {
                console.error('No valid event type found at index', selectedMeeting - 2);
            }
                } else {
                    console.log('Skipping Calendly fetch:', {
                        selectedAnalyst,
                        selectedMeeting,
                        calendlyEventTypesLength: calendlyEventTypes.length
                    });
                }
            }
        };
        
        handleAvailabilityFetch();
    }, [selectedMeeting, currentMonth, selectedAnalyst, calendlyEventTypes, selectedTimezone]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle step and selectedAnalyst parameters from URL (for navigation back from reviews page)
    useEffect(() => {
        // Skip if we're handling slug-based routing (slug takes precedence)
        if (slug) {
            return;
        }

        const stepParam = searchParams.get('step');
        const selectedAnalystParam = searchParams.get('selectedAnalyst');
        
        // If step param exists, initialize step immediately to prevent flash
        if (stepParam) {
            const step = parseInt(stepParam);
            if (step >= 1 && step <= 3) {
                console.log("setting current step", step)
                setCurrentStep(step);
            }
        }
        
        if (selectedAnalystParam) {
            const analystId = parseInt(selectedAnalystParam);
            if (analystId >= 0) {
                setSelectedAnalyst(analystId);
            }
        }
    }, [searchParams, slug]);

    // Fetch analyst about data when analyst is selected
    useEffect(() => {
        if (selectedAnalyst !== null) {
            const analystName = analysts.find(a => a.id === selectedAnalyst)?.name;
            if (analystName) {
                fetchAnalystAbout(analystName);
            }
        }
    }, [selectedAnalyst, analysts]); // eslint-disable-line react-hooks/exhaustive-deps

    const hasReviewStatsForSelectedAnalyst = selectedAnalyst !== null && !!reviewStatsByAnalyst[selectedAnalyst];

    useEffect(() => {
        const analystId = selectedAnalyst;
        if (analystId === null || hasReviewStatsForSelectedAnalyst) {
            return;
        }

        let isSubscribed = true;
        const controller = new AbortController();

        const fetchReviewStats = async () => {
            try {
                setIsLoadingReviewStats(true);
                const response = await fetch(`/api/reviews/stats?analystId=${analystId}`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch review stats');
                }

                const data = await response.json();
                if (!isSubscribed) return;

                setReviewStatsByAnalyst(prev => ({
                    ...prev,
                    [analystId]: data.stats || { totalReviews: 0, averageRating: null },
                }));
            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    return;
                }
                console.error('Failed to load review stats:', error);
                if (isSubscribed) {
                    setReviewStatsByAnalyst(prev => ({
                        ...prev,
                        [analystId]: { totalReviews: 0, averageRating: null },
                    }));
                }
            } finally {
                if (isSubscribed) {
                    setIsLoadingReviewStats(false);
                }
            }
        };

        fetchReviewStats();

        return () => {
            isSubscribed = false;
            controller.abort();
        };
    }, [selectedAnalyst, hasReviewStatsForSelectedAnalyst]);
    
    // Reset selected time when timezone changes (times will be converted)
    useEffect(() => {
        if (selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst) && selectedTimezone && selectedDate) {
            setSelectedTime(''); // Reset so user re-selects with new timezone
        }
    }, [selectedTimezone]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle timezone change loading state
    useEffect(() => {
        if (selectedTimezone && Object.keys(availableTimesByDate).length > 0) {
            console.log('🌍 Timezone changed, clearing old availability data and setting loading state');
            setIsTimezoneChanging(true);
            setIsLoadingAvailability(true); // CRITICAL: Set loading to prevent showing old data
            
            // Clear old availability data immediately to prevent showing incorrect times
            setAvailableDates([]);
            setAvailableTimesByDate({});
            setSlotUrlsByDateTime({});
            setRawTimestampsByDateTime({});
            
            // Clear the timezone changing flag after a short delay
            const timer = setTimeout(() => {
                setIsTimezoneChanging(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [selectedTimezone]); // eslint-disable-line react-hooks/exhaustive-deps

    // const router = useRouter(); // Removed to prevent compilation error

    // Flatten all timezones for filtering and sort by proximity to user's timezone
    const allTimezones = useMemo(() => {
        const flat = timezoneGroups.flatMap(group =>
            group.timezones.map(tz => ({ ...tz, region: group.region }))
        );

        if (!userTimezone) return flat;

        const offsets = getTimezoneOffsets();
        const userOffset = offsets[userTimezone] ?? 0;

        return [...flat].sort((a, b) => {
            const offsetA = offsets[a.value] ?? 0;
            const offsetB = offsets[b.value] ?? 0;
            return Math.abs(offsetA - userOffset) - Math.abs(offsetB - userOffset);
        });
    }, [userTimezone]);

    const filteredTimezones = allTimezones.filter(tz => 
        tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
        tz.region.toLowerCase().includes(timezoneSearch.toLowerCase())
    );

    // Get time slot objects - moved before handleContinue
    const getTimeSlotObjects = (): Array<{ displayTime: string; schedulingUrl: string; utcTime: string }> => {
        // CRITICAL: If availability is loading, return empty array to prevent showing stale data
        if (isLoadingAvailability) {
            console.log('⏳ Availability is loading, returning empty slots');
            return [];
        }
        
        // For analysts with Calendly integration
        if (selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst) && selectedDate && availableTimesByDate[selectedDate]) {
            // If no timezone is selected, return empty array (no slots available)
            if (!selectedTimezone) {
                return [];
            }
            
            // If timezone is changing, return empty array to prevent showing old data
            if (isTimezoneChanging) {
                return [];
            }
            
            const localTimes = availableTimesByDate[selectedDate]; // These are now in user's timezone
            
            // Map each local time to an object with display time and URL
            const slots = localTimes.map(localTime => {
                const dateTimeKey = `${selectedDate}|${localTime}`;
                const schedulingUrl = slotUrlsByDateTime[dateTimeKey] || '';
                
                // Since the API now handles timezone conversion, 
                // the times are already in the user's timezone
                return {
                    displayTime: localTime, // Already in user's timezone
                    schedulingUrl,
                    utcTime: localTime // For matching purposes, use the same value
                };
            });
            
            console.log('Time slot objects (API converted):', slots.slice(0, 3));
            return slots;
        }
        
        // Default time slots for other analysts (no Calendly URLs)
        // Only show default times if no timezone is selected and not changing timezone
        if (!selectedTimezone && !isTimezoneChanging) {
            const defaultTimes = [
                '9:00 AM', '10:00 AM', '11:30 AM', '12:30 PM', 
                '1:30 PM', '2:00 PM', '2:30 PM', '5:30 PM'
            ];
            return defaultTimes.map(time => ({ displayTime: time, schedulingUrl: '', utcTime: time }));
        }
        
        // Return empty array if timezone is selected but no Calendly integration
        return [];
    };

    // Get time slots based on selected date and convert to selected timezone
    const getTimeSlots = () => {
        return getTimeSlotObjects().map(slot => slot.displayTime);
    };

    // Available time slots
    const timeSlots = getTimeSlots();
    const timeSlotObjects = getTimeSlotObjects();

    const isContinueDisabled = currentStep === 2 ? (selectedMeeting === null || !selectedTimezone || !selectedDate || !selectedTime) : 
                               currentStep === 3 ? (!fullName || !email || !notes || !!nameError || !!emailError || !!notesError || !paymentCompleted || isLoadingAvailability) : false;

    const handleStripePayment = async () => {
        if (!fullName || !email || !notes || !!nameError || !!emailError || !!notesError) {
            setPaymentError('Please fill in all required fields correctly');
            return;
        }

        setPaymentInitiating(true);
        setPaymentError('');

        try {
            // Save form data to sessionStorage before redirecting (with safety check)
            if (typeof sessionStorage === 'undefined') {
                throw new Error('SessionStorage not available');
            }
            
            const formDataKey = 'meetings-form';
            const formData = {
                fullName,
                email,
                notes,
                selectedAnalyst,
                selectedMeeting,
                selectedDate,
                selectedTime,
                selectedTimezone,
                currentStep: 3 // Always save as step 3 so we return to the form
            };
            
            console.log('Saving form data before Stripe redirect:', formData);
            sessionStorage.setItem(formDataKey, JSON.stringify(formData));
            
            // Verify data was saved
            const savedData = sessionStorage.getItem(formDataKey);
            console.log('Verified saved data:', savedData ? 'Data saved successfully' : 'ERROR: Data not saved!');

                    // Map meeting ID to meeting type ID for Stripe API
                    const meetingTypeMap: Record<number, string> = {
                        2: 'initial-consultation',      // 30-Min Strategy
                        3: 'initial-consultation-1'     // 60-Min Deep
                    };
                    
                    const meetingTypeId = meetingTypeMap[selectedMeeting || 2];
            
            if (!meetingTypeId) {
                setPaymentError('Invalid meeting selection. Please try again.');
                setPaymentInitiating(false);
                        return;
                    }
            
            // Get the actual price from the selected meeting
            const selectedMeetingData = getSelectedMeetingData();
            let priceAmount = 60; // Default fallback
            
            if (selectedMeetingData && selectedMeetingData.price) {
                // Extract numeric value from price string like "60 USD"
                const priceMatch = selectedMeetingData.price.match(/[\d.]+/);
                if (priceMatch) {
                    priceAmount = parseFloat(priceMatch[0]);
                }
            }
                    
            console.log('Creating Stripe checkout session...', { meetingTypeId, priceAmount });
            
            // Create Stripe checkout session
                    const response = await fetch('/api/stripe/create-checkout-session', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            type: 'booking',
                            meetingTypeId: meetingTypeId,
                            priceAmount: priceAmount, // Send the actual price
                            customerEmail: email,
                            customerName: fullName
                        }),
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok && data.success) {
                console.log('Stripe session created successfully. Redirecting to:', data.url);
                // Small delay to ensure sessionStorage write completes
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        window.location.href = data.url;
                    }
                }, 100);
            } else {
                console.error('Failed to create Stripe checkout session:', data);
                setPaymentError(data.error || 'Failed to create payment session. Please try again.');
                setPaymentInitiating(false);
            }
        } catch (error) {
            console.error('Error creating Stripe checkout session:', error);
            setPaymentError('Network error. Please check your connection and try again.');
            setPaymentInitiating(false);
        }
    };

    const handleContinue = async () => {
        console.log('handleContinue clicked!', { 
            currentStep, 
            isContinueDisabled, 
            selectedAnalyst,
            selectedEventTypeUri,
            paymentCompleted,
            isLoadingAvailability
        });
        
        if (!isContinueDisabled) {
            if (currentStep === 2) {
                console.log('➡️ Advancing from step 2 to step 3 - invalidating booking cache');
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem('calendlyEventDetails');
                }
                
                // Check if we're returning from payment (has payment query params)
                const urlParams = new URLSearchParams(window.location.search);
                const paymentStatus = urlParams.get('payment');
                const sessionId = urlParams.get('session_id');
                const isReturningFromPayment = paymentStatus === 'success' || paymentStatus === 'cancelled';
                
                // Preserve slug in URL when advancing to step 3, but preserve payment query params if present
                if (selectedAnalyst !== null) {
                    const analyst = analysts.find(a => a.id === selectedAnalyst);
                    if (analyst && analyst.slug) {
                        // If we're returning from payment, preserve the query params
                        if (isReturningFromPayment) {
                            // Keep the current URL with payment params, just update step
                            // Don't navigate to slug route as it will reset everything
                            console.log('🔄 Preserving payment query params, not navigating to slug route');
                            // Just update URL to preserve payment params
                            const currentUrl = window.location.pathname + window.location.search;
                            window.history.pushState({}, '', currentUrl);
                        } else if (slug) {
                            // Already on slug route, just update URL
                            window.history.pushState({}, '', `/meetings/${analyst.slug}`);
                        } else {
                            // Not on slug route, navigate to slug route
                            // Use replace to avoid adding to history
                            router.replace(`/meetings/${analyst.slug}`);
                        }
                    }
                }
                
                // Set step to 3 immediately (before any navigation effects)
                setCurrentStep(3);
                
                // Scroll to top on mobile when advancing to next step
                if (typeof window !== 'undefined' && window.innerWidth < 768) {
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                }
            } else if (currentStep === 3 && paymentCompleted) {
                // Payment completed, process booking submission
                console.log('🎯 Processing final step after payment completion');
                console.log('📊 Current state:', {
                    selectedAnalyst,
                    hasCalendlyIntegration: selectedAnalyst !== null ? hasCalendlyIntegration(selectedAnalyst) : false,
                    selectedDate,
                    selectedTime,
                    isLoadingAvailability,
                    timeSlotObjectsCount: timeSlotObjects.length,
                    timeSlotObjects: timeSlotObjects
                });
                
                const selectedTimezoneData = allTimezones.find(tz => tz.value === selectedTimezone);
                const selectedMeetingData = getSelectedMeetingData() || meetings.find(m => m.id === selectedMeeting);
                
                // Get Calendly scheduling URL if analyst has Calendly integration
                let calendlyUrl = '';
                if (selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst) && selectedDate && selectedTime) {
                    console.log('🔍 Looking for time slot:', selectedTime);
                    console.log('🔍 Selected date:', selectedDate);
                    console.log('🔍 Available dates in availableTimesByDate:', Object.keys(availableTimesByDate));
                    console.log('🔍 Times for selected date:', availableTimesByDate[selectedDate]);
                    console.log('🔍 All time slot objects:', timeSlotObjects.map(s => ({ date: selectedDate, time: s.displayTime, url: s.schedulingUrl })));
                    
                    const selectedSlot = timeSlotObjects.find(slot => slot.displayTime === selectedTime);
                    
                    if (selectedSlot && selectedSlot.schedulingUrl) {
                        calendlyUrl = selectedSlot.schedulingUrl;
                        console.log('✅ Found Calendly scheduling URL:', calendlyUrl);
                    } else {
                        console.warn('⚠️ No Calendly URL found for selected time slot');
                        console.log('Available slots:', timeSlotObjects.map(s => ({ time: s.displayTime, hasUrl: !!s.schedulingUrl })));
                    }
                } else {
                    console.log('❌ Calendly requirements not met:', {
                        hasAnalyst: selectedAnalyst !== null,
                        hasIntegration: selectedAnalyst !== null ? hasCalendlyIntegration(selectedAnalyst) : false,
                        hasDate: !!selectedDate,
                        hasTime: !!selectedTime
                    });
                }

                // Store booking details in sessionStorage for success page
                        const bookingDetails = {
                            analyst: selectedAnalyst?.toString() || '0',
                            analystName: analysts.find(a => a.id === selectedAnalyst)?.name || '',
                            meeting: selectedMeeting?.toString() || '1',
                    meetingTitle: selectedMeetingData?.title || '',
                    meetingDuration: selectedMeetingData?.duration || '',
                            date: selectedDate || '',
                            time: selectedTime || '',
                            timezone: selectedTimezoneData?.label || '',
                            timezoneValue: selectedTimezone || '',
                            notes: notes || '',
                            fullName: fullName,
                            email: email,
                    paymentCompleted: true,
                    calendlyUrl: calendlyUrl,
                            hasCalendlyIntegration: calendlyUrl !== ''
                        };
                        
                        if (typeof sessionStorage !== 'undefined') {
                            sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
                        }
                        
                // Clear form data from sessionStorage
                const formDataKey = 'meetings-form';
                if (typeof sessionStorage !== 'undefined') {
                    sessionStorage.removeItem(formDataKey);
                }
                
                // If analyst has Calendly integration, open Calendly popup
                if (calendlyUrl) {
                    console.log('Opening Calendly popup for analyst booking with URL:', calendlyUrl);
                    
                    // Check if Calendly is available
                    // @ts-ignore
                    if (typeof window !== 'undefined' && window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
                        console.log('Calendly is loaded, opening popup...');
                        
                        // Open Calendly popup with a slight delay to ensure DOM is ready
                        setTimeout(() => {
                            // @ts-ignore
                            window.Calendly.initPopupWidget({
                                url: calendlyUrl,
                                prefill: {
                                    name: fullName || '',
                                    email: email || '',
                                    customAnswers: {
                                        a1: notes || ''
                                    }
                                },
                                utm: {
                                    utmSource: 'inspired-analyst',
                                    utmMedium: 'booking',
                                    utmCampaign: 'mentorship'
                                }
                            });
                            console.log('Calendly popup initiated');
                        }, 300);

                        // Listen for Calendly event completion
                        const handleCalendlyEvent = (e: MessageEvent) => {
                            if (e.data.event && e.data.event === 'calendly.event_scheduled') {
                                console.log('Calendly booking completed:', e.data);
                                
                                // Save Calendly event details
                                if (e.data.payload && typeof sessionStorage !== 'undefined') {
                                    sessionStorage.setItem('calendlyEventDetails', JSON.stringify(e.data.payload));
                                }
                                
                                // Close the Calendly popup automatically
                                console.log('Closing Calendly popup automatically...');
                                // @ts-ignore
                                if (window.Calendly && window.Calendly.closePopupWidget) {
                                    // @ts-ignore
                                    window.Calendly.closePopupWidget();
                                }
                                
                                // Redirect to success page after Calendly booking
                                console.log('Redirecting to success page...');
                                setTimeout(() => {
                                    router.push('/booking-success');
                                }, 500);
                                
                                // Clean up event listener
                                window.removeEventListener('message', handleCalendlyEvent);
                            }
                        };

                        window.addEventListener('message', handleCalendlyEvent);
                    } else {
                        // @ts-ignore
                        console.error('Calendly script not loaded or not available. Window.Calendly:', typeof window !== 'undefined' ? window.Calendly : 'undefined');
                        alert('Unable to open booking calendar. Redirecting to confirmation page...');
                        // Fall back to direct redirect if Calendly fails
                        setTimeout(() => {
                            router.push('/booking-success');
                        }, 1000);
                    }
                } else {
                    console.log('No Calendly URL found, redirecting directly to success page');
                    // No Calendly integration, redirect directly to success page
                    router.push('/booking-success');
                }
            }
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            console.log('⬅️ Navigating back from step 2 to step 1 - invalidating cache');
            invalidateCache();
            
            // Check if we have payment query params - if so, preserve them
            const urlParams = new URLSearchParams(window.location.search);
            const paymentStatus = urlParams.get('payment');
            const sessionId = urlParams.get('session_id');
            const hasPaymentParams = paymentStatus || sessionId;
            
            if (hasPaymentParams) {
                // Preserve payment query params when going back
                const queryString = window.location.search;
                router.push(`/meetings${queryString}`);
            } else {
                // Navigate to /meetings (without slug) to show analyst selection (step 1)
                router.push('/meetings');
            }
            setCurrentStep(1);
        } else if (currentStep === 3) {
            console.log('⬅️ Navigating back from step 3 to step 2 - invalidating booking cache');
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.removeItem('calendlyEventDetails');
            }
            
            // Check if we have payment query params - if so, preserve them
            const urlParams = new URLSearchParams(window.location.search);
            const paymentStatus = urlParams.get('payment');
            const sessionId = urlParams.get('session_id');
            const hasPaymentParams = paymentStatus || sessionId;
            
            if (hasPaymentParams) {
                // Preserve payment query params when going back to step 2
                const queryString = window.location.search;
                window.history.pushState({}, '', `/meetings${queryString}`);
            } else if (slug && selectedAnalyst !== null) {
                // If we came from slug route, preserve slug in URL
                const analyst = analysts.find(a => a.id === selectedAnalyst);
                // Use slug directly from API (API ensures it's always present)
                if (analyst && analyst.slug) {
                    // Update URL to preserve slug when going back to step 2
                    window.history.pushState({}, '', `/meetings/${analyst.slug}`);
                }
            }
            
            setCurrentStep(2);
        } else {
            // Navigate to the landing page using standard web APIs
            window.location.href = '/';
        }
    };

    const handleTimezoneSelect = (timezone: string) => {
        setSelectedTimezone(timezone);
        setIsTimezoneOpen(false);
        setHoveredTimezone('');
        setTimezoneSearch('');
    };


    // Get current time for a timezone (simplified - in real app you'd use a proper timezone library)
    const getCurrentTime = (timezoneValue: string): string => {
        const now = new Date();
        const timezoneOffsets: { [key: string]: number } = {
            'pst': -8, 'mst': -7, 'cst': -6, 'est': -5, 'akst': -9, 'hst': -10, 'ast_ca': -4,
            'brt': -3, 'art': -3, 'clt': -4, 'cot': -5, 'pet': -5, 'vet': -4, 'gyt': -4, 'srt': -3, 'fkt': -3,
            'gmt': 0, 'cet': 1, 'eet': 2, 'wet': 0, 'msk': 3, 'trt': 3, 'eest': 3, 'cest': 2, 'west': 1,
            'cat': 2, 'eat': 3, 'wat': 1, 'sast': 2, 'cairo': 2, 'lagos': 1, 'casablanca': 0, 'johannesburg': 2, 'nairobi': 3,
            'ist': 5.5, 'bdt': 6, 'pkt': 5, 'cst_cn': 8, 'jst': 9, 'kst': 9, 'pht': 8, 'ict': 7, 'myt': 8, 'sgt': 8, 'hkt': 8, 'tst': 8,
            'jordan': 2, 'baghdad': 3, 'baku': 4, 'lebanon': 2,
            'gst': 4, 'ast_me': 3, 'irt': 3.5, 'israel': 2, 'kuwait': 3, 'qatar': 3, 'bahrain': 3, 'oman': 4,
            'aest': 10, 'acst': 9.5, 'awst': 8, 'nzst': 12, 'fjt': 12, 'pgt': 10, 'sbt': 11, 'vut': 11,
            'hst_pacific': -10, 'akst_pacific': -9, 'pst_pacific': -8, 'mst_pacific': -7, 'cst_pacific': -6, 'est_pacific': -5
        };
        
        const offset = timezoneOffsets[timezoneValue] || 0;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const timezoneTime = new Date(utc + (offset * 3600000));
        
        return timezoneTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
    };

    const handleTimezoneSearch = (searchValue: string) => {
        setTimezoneSearch(searchValue);
        if (!isTimezoneOpen) {
            setIsTimezoneOpen(true);
        }
        // Clear selected timezone when user starts typing
        if (searchValue !== '' && selectedTimezone) {
            setSelectedTimezone('');
        }
    };

    const handleTimezoneInputFocus = () => {
        setIsTimezoneOpen(true);
        // Clear the search field when focusing to allow fresh input
        setTimezoneSearch('');
    };

    // Calendar helper functions
    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        
        // Prevent navigation to past months for scheduling
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const newMonthStart = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
        
        if (newMonthStart < currentMonthStart) {
            console.log('🚫 Cannot navigate to past months for scheduling');
            return; // Don't navigate to past months
        }
        
        setCurrentMonth(newMonth);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        
        return days;
    };

    const formatDate = (date: Date) => {
        // Use local date to match user's calendar selection
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isDateAvailable = (date: Date) => {
        // For analysts with Calendly integration
        if (selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst)) {
            // Must have a meeting type selected first
            if (selectedMeeting === null) {
                return false; // Disable all dates until meeting type is selected
            }
            
            // Check if date is in the available dates from Calendly
            if (availableDates.length > 0) {
                const dateStr = formatDate(date);
                const isAvailable = availableDates.includes(dateStr);
                // Only log first few checks to avoid spam
                if (date.getDate() <= 5) {
                    console.log('Checking date availability:', { dateStr, isAvailable, availableDates });
                }
                return isAvailable;
            }
            
            // If no available dates yet (still loading), disable all
            return false;
        }
        
        // For other analysts, must select meeting type first
        if (selectedMeeting === null) {
            return false;
        }
        
        // Then allow today and future dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);
        return compareDate >= today;
    };

    const isDateSelected = (date: Date) => {
        return selectedDate === formatDate(date);
    };

    const handleDateSelect = (date: Date) => {
        if (isDateAvailable(date)) {
            setSelectedDate(formatDate(date));
            setSelectedTime(''); // Reset time selection when date changes
        }
    };

    // Convert UTC time to selected timezone (for display)
    // NOTE: This function is now mainly for backwards compatibility
    // The API now handles timezone conversion automatically when fetching availability
    const convertTimeToTimezone = (utcTimeStr: string, timezoneValue: string): string => {
        if (!timezoneValue) return utcTimeStr; // Return UTC if no timezone selected
        
        // Since the API now handles timezone conversion, we can return the time as-is
        // The API will have already converted it to the user's timezone
        console.log('Time conversion (API handled):', {
            originalTime: utcTimeStr,
            timezone: timezoneValue,
            note: 'API handles timezone conversion automatically'
        });
        
        return utcTimeStr;
    };

    // Convert local time back to UTC time string (for finding the correct UTC slot)
    // NOTE: Since the API now handles timezone conversion, this function is simplified
    // The user selects times that are already in their timezone, so we just need to match them
    const convertLocalTimeToUTC = (localTimeStr: string, timezoneValue: string): string => {
        if (!timezoneValue) return localTimeStr; // Return as-is if no timezone selected
        
        console.log('Time conversion (simplified):', {
            localTime: localTimeStr,
            timezone: timezoneValue,
            note: 'API handles timezone conversion, using direct match'
        });
        
        // Since the API now converts times to the user's timezone,
        // we can return the time as-is for matching purposes
        return localTimeStr;
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    // Helper functions for booking summary
    const getSelectedMeetingData = () => {
        return calendlyMeetings.find(meeting => meeting.id === selectedMeeting);
    };

    const selectedMeetingDetails = getSelectedMeetingData();
    const selectedAnalystStats = selectedAnalyst !== null ? reviewStatsByAnalyst[selectedAnalyst] : undefined;
    const reviewTotalForSelectedAnalyst = selectedAnalystStats?.totalReviews ?? 0;
    const hasReviewsForSelectedAnalyst = reviewTotalForSelectedAnalyst > 0;
    const averageRatingDisplay =
        hasReviewsForSelectedAnalyst &&
        selectedAnalystStats &&
        selectedAnalystStats.averageRating !== null
            ? selectedAnalystStats.averageRating.toFixed(1)
            : '—';
    const reviewCountDisplay = hasReviewsForSelectedAnalyst
        ? `(${reviewTotalForSelectedAnalyst} ${
              reviewTotalForSelectedAnalyst === 1 ? 'review' : 'reviews'
          })`
        : '(No reviews yet)';
    const reviewStatsLoadingState = isLoadingReviewStats && !selectedAnalystStats;

    const getSelectedTimezoneLabel = () => {
        const timezone = allTimezones.find(tz => tz.value === selectedTimezone);
        return timezone ? timezone.label : 'Unknown Timezone';
    };

    // Validation functions
    const validateName = (name: string) => {
        // Only allow letters, spaces, hyphens, and apostrophes
        const nameRegex = /^[a-zA-Z\s\-']+$/;
        if (!name.trim()) {
            return 'Name is required';
        }
        if (!nameRegex.test(name)) {
            return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        if (name.length < 2) {
            return 'Name must be at least 2 characters long';
        }
        return '';
    };

    const validateEmail = (email: string) => {
        // Standard email regex pattern
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email.trim()) {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const validateNotes = (notes: string) => {
        if (!notes.trim()) {
            return 'Notes are required';
        }
        // Check character count
        const charCount = notes.trim().length;
        if (charCount < 100) {
            return 'Notes must contain at least 100 characters';
        }
        return '';
    };

    const getTimezoneDisplayLabel = () => {
        const timezone = allTimezones.find(tz => tz.value === selectedTimezone);
        return timezone ? timezone.label : 'Select Timezone';
    };

    const formatSelectedDate = () => {
        if (!selectedDate) return '';
        const date = new Date(selectedDate);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getMeetingPrice = () => {
        if (selectedMeetingDetails?.price) {
            return selectedMeetingDetails.price;
        }
        // Default fallback - should not happen in normal flow
        return '60 USD';
    };

    const isBookingSummaryReady = currentStep === 3 &&
        selectedAnalyst !== null &&
        selectedMeeting !== null &&
        !!selectedMeetingDetails &&
        !!selectedDate &&
        !!selectedTime &&
        !!selectedTimezone;

    console.log("selectedAnalyst", selectedAnalyst)
    console.log("current step", currentStep)

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white font-sans relative overflow-hidden" style={{ fontFamily: 'Gilroy-Medium, sans-serif' }}>
            {/* Lower Corner Gradients - Hidden on step 2 (booking section) */}
            {currentStep !== 2 && (
                <>
            <div 
                className="hidden md:block fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-100"
                style={{
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    transform: 'rotate(0deg) translate(-160px, 300px)',
                    transformOrigin: 'bottom left',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                    filter: 'blur(150px)',
                    WebkitFilter: 'blur(150px)'
                }}
            ></div>
            {/* Mobile version - positioned at page bottom */}
            <div 
                className="md:hidden absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
                style={{
                    background: 'linear-gradient(107.68deg, rgba(23, 64, 136, 1) 9.35%, rgba(23, 64, 136, 1) 34.7%, rgba(23, 64, 136, 1) 60.06%, rgba(23, 64, 136, 0.9) 72.73%, rgba(23, 64, 136, 0.8) 88.58%)',
                    transform: 'rotate(-45deg) translate(250px, 250px)',
                    transformOrigin: 'bottom right',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
                    filter: 'blur(150px)',
                    WebkitFilter: 'blur(150px)'
                }}
            ></div>
            
            {/* Desktop version - original positioning and values */}
            <div 
                className="hidden md:block fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
                style={{
                    background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                    transform: 'rotate(-45deg) translate(300px, 200px)',
                    transformOrigin: 'bottom right',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 70%)',
                    filter: 'blur(150px)',
                    WebkitFilter: 'blur(150px)'
                }}
            ></div>
                </>
            )}

            {/* Mid Left Gradient - Only visible on step 2 (booking section) - Desktop */}
            {currentStep === 2 && (
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
            )}

            {/* Mobile Top Left Gradient - Only visible on step 2 (booking section) for mobile */}
            {currentStep === 2 && (
                <div 
                    className="md:hidden absolute top-0 left-0 w-[588px] h-[588px] pointer-events-none opacity-100"
                    style={{
                        transform: 'rotate(0deg) translate(-280px, -330px)',
                        transformOrigin: 'top left',
                        background: 'linear-gradient(107.68deg, rgba(110, 77, 136, 1) 9.35%, rgba(110, 77, 136, 0.9) 34.7%, rgba(110, 77, 136, 0.8) 60.06%, rgba(110, 77, 136, 0.7) 72.73%, rgba(110, 77, 136, 0.6) 88.58%)',
                        filter: 'blur(120px)',
                        maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)'
                    }}
                ></div>
            )}

            {/* Mobile Bottom Right Gradient - Only visible on step 2 (booking section) for mobile */}
            {currentStep === 2 && (
                <div 
                    className="md:hidden absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
                    style={{
                        background: 'linear-gradient(107.68deg, rgba(23, 64, 136, 1) 9.35%, rgba(23, 64, 136, 1) 34.7%, rgba(23, 64, 136, 1) 60.06%, rgba(23, 64, 136, 0.9) 72.73%, rgba(23, 64, 136, 0.8) 88.58%)',
                        transform: 'rotate(-45deg) translate(250px, 250px)',
                        transformOrigin: 'bottom right',
                        borderRadius: '50%',
                        maskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 5%, transparent 70%)',
                        filter: 'blur(150px)',
                        WebkitFilter: 'blur(150px)'
                    }}
                ></div>
            )}

            {/* Mobile Top Left Gradient - Only visible on step 1 (select analyst) for mobile */}
            {currentStep === 1 && (
                <div 
                    className="md:hidden absolute top-0 left-0 w-[588px] h-[588px] pointer-events-none opacity-100"
                    style={{
                        transform: 'rotate(0deg) translate(-280px, -330px)',
                        transformOrigin: 'top left',
                        background: 'linear-gradient(107.68deg, rgba(110, 77, 136, 1) 9.35%, rgba(110, 77, 136, 0.9) 34.7%, rgba(110, 77, 136, 0.8) 60.06%, rgba(110, 77, 136, 0.7) 72.73%, rgba(110, 77, 136, 0.6) 88.58%)',
                        filter: 'blur(120px)',
                        maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)'
                    }}
                ></div>
            )}

            {/* Mobile Top Left Gradient - Only visible on step 3 (pay and confirm) for mobile */}
            {currentStep === 3 && (
                <div 
                    className="md:hidden absolute top-0 left-0 w-[588px] h-[588px] pointer-events-none opacity-100"
                    style={{
                        transform: 'rotate(0deg) translate(-280px, -330px)',
                        transformOrigin: 'top left',
                        background: 'linear-gradient(107.68deg, rgba(110, 77, 136, 1) 9.35%, rgba(110, 77, 136, 0.9) 34.7%, rgba(110, 77, 136, 0.8) 60.06%, rgba(110, 77, 136, 0.7) 72.73%, rgba(110, 77, 136, 0.6) 88.58%)',
                        filter: 'blur(120px)',
                        maskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 50%)'
                    }}
                ></div>
            )}
            
            {/* Navigation Header */}
            <Navbar variant="hero" />

            {/* Mobile Image Belts - Only visible on mobile */}
            <div className="lg:hidden flex flex-col justify-center items-center h-40 sm:h-48 relative w-full overflow-hidden mt-24">
                <div className="flex flex-col w-full h-full gap-2">
                    {/* Belt 1 - Rectangle 1 Images */}
                    <div className="flex-1 fade-mask overflow-hidden">
                        <div className="animate-scrollUp flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                            {/* First set of images */}
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/1.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/2 improved.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/3.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/4 - colored.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/5.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/6.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/7.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            {/* Duplicate for seamless loop */}
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/1.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/2 improved.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/3.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/4 - colored.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/5.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/6.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/7.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
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
                    <div className="flex-1 fade-mask overflow-hidden">
                        <div className="animate-scrollDown flex h-16 sm:h-20 md:h-24 flex-row gap-3 sm:gap-4">
                            {/* First set of images */}
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/7.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/6.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/5.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/4 - colored.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/3.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/2 improved.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/1.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            {/* Duplicate for seamless loop */}
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/7.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/6.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/5.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/4 - colored.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/3.jpg")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/2 improved.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                            <div
                                className="aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28"
                                style={{
                                    backgroundImage: 'url("team-mob/1.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10 -mt-2 lg:-mt-8">
                <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
                
                {/* Left Side: Image Belts */}
                <div className="hidden lg:flex justify-center items-start h-full relative w-full max-w-xs xl:max-w-sm">
                    <div className="flex w-64 xl:w-80 h-screen pt-20 fixed left-24 xl:left-32 top-0">
                        {/* Belt 1 - Rectangle 1 Images */}
                        <div className="flex-1 fade-mask overflow-hidden">
                            <div className="animate-scrollUp flex flex-col gap-6">
                                {/* First set of images */}
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                            style={{
                                        backgroundImage: 'url("/inspired analysts team/1.png")',
                                        backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/2 improved.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/3.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/4.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/1.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/2 improved.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/3.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/4.png")',
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
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/5.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/6.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/7.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/2.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/5.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/6.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/inspired analysts team/7.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                            style={{
                                        backgroundImage: 'url("/inspired analysts team/2.jpg")',
                                        backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right Side: Booking Form */}
                <div className="w-full lg:col-span-2 px-2 sm:px-0">
                    {/* Back Button */}
                    <div className="mb-1 mt-24 lg:mt-20">
                        <button 
                            onClick={handleBack} 
                            className="flex items-center text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-0 focus:border-none active:outline-none relative z-20"
                            style={{ outline: 'none', boxShadow: 'none' }}
                            onFocus={(e) => e.target.blur()}
                        >
                        <ChevronLeft size={20} className="mr-1" />
                        Back...
                    </button>
                    </div>

                                    {/* Selected Analyst Display */}
                    {selectedAnalyst !== null && currentStep === 2 && (
                        <div className="mb-6 mt-8">
                            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 justify-start items-start">
                                {/* Analyst Profile Tile */}
                                <div
                                    className="relative overflow-hidden group transition-all duration-300 flex flex-col items-center justify-start p-4 gap-2 w-full sm:w-auto sm:min-w-[200px] sm:max-w-[240px] h-[240px] bg-[#1F1F1F] rounded-2xl"
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

                                    {/* Profile Image */}
                                    <div className="rounded-full overflow-hidden relative z-10 w-20 h-20">
                                        <Image
                                            src={(() => {
                                                const analyst = analysts.find(a => a.id === selectedAnalyst);
                                                const imageUrl = analyst?.image;
                                                return (imageUrl && imageUrl.trim() !== '') ? imageUrl : '/team dark/Adnan.jpeg';
                                            })()}
                                            alt={analysts.find(a => a.id === selectedAnalyst)?.name || 'Analyst'}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover filter grayscale"
                                        />
                            </div>

                                    {/* Name */}
                                    <h3 className="text-white text-center relative z-10 text-lg font-semibold w-full px-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                        {analysts.find(a => a.id === selectedAnalyst)?.name || 'Analyst'}
                                    </h3>

                                    {/* Role Display for Reviews Section */}
                                    <p className="text-gray-400 text-center relative z-10 text-sm leading-tight w-full px-2 flex-1" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                        {analysts.find(a => a.id === selectedAnalyst)?.description}
                                    </p>

                                    {/* Rating Stars */}
                                    <div className="flex flex-row items-center justify-center relative z-10 w-full gap-1 min-h-[20px]">
                                        {/* Star */}
                                        <div className="flex items-center justify-center w-3 h-3 flex-shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z" fill="#DE50EC"/>
                                            </svg>
                                        </div>
                                        
                                        {reviewStatsLoadingState ? (
                                            <div className="flex items-center gap-2 w-full justify-center">
                                                <span className="w-8 h-3 rounded-full bg-gray-600/70 animate-pulse" />
                                                <span className="w-20 h-3 rounded-full bg-gray-600/70 animate-pulse" />
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-gray-400 text-sm" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                                    {averageRatingDisplay}
                                                </span>
                                                <span className="text-gray-400 text-sm" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                                    {reviewCountDisplay}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* View All Reviews Button */}
                                    <button 
                                        onClick={() => router.push(`/reviews?analyst=${selectedAnalyst}&step=${currentStep}&selectedAnalyst=${selectedAnalyst}`)}
                                        className="flex flex-row justify-center items-center relative z-20 w-full max-w-[180px] h-7 bg-white rounded-full px-3 py-2 mt-auto focus:outline-none focus:ring-0"
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                    >
                                        <span className="text-xs text-[#1F1F1F] whitespace-nowrap">
                                            View All Reviews
                                        </span>
                                    </button>
                                </div>

                                {/* About Tile */}
                                <div
                                    className="relative overflow-hidden overflow-x-hidden group transition-all duration-300 flex flex-col items-start p-4 gap-4 w-full lg:flex-1 h-auto lg:h-[240px] bg-[#1F1F1F] rounded-2xl"
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

                                    {/* Selected State Gradient Overlay */}
                                    <div 
                                        className="absolute inset-0 rounded-2xl opacity-80 pointer-events-none"
                                        style={{
                                            backgroundImage: 'url("/gradient/Ellipse 2.png")',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat'
                                        }}
                                    ></div>

                                    {/* About Content */}
                                    <div className="relative z-10 w-full h-full flex flex-col min-w-0">
                                        <h3 className="text-white text-lg font-semibold mb-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>About</h3>
                                        <div className="flex-1 lg:overflow-y-auto min-w-0">
                                            {isLoadingAbout ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line break-words" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                                                    {analystAbout || 'No additional information available.'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-8 mt-8">
                        <h1 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Book Mentorship</h1>
                    </div>

                    {/* Step 1: Analyst Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Select Your Analyst</h2>
                                <p className="text-sm sm:text-base text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Choose the expert who best matches your needs and investment goals</p>
                            </div>
                            
                            {/* Error Message */}
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
                            
                            {/* Loading State - 8 Skeleton Cards */}
                            {!isTeamDataLoaded && !teamDataError && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-stretch max-w-none">
                                    {Array.from({ length: 8 }, (_, index) => (
                                        <div key={index} className="cursor-pointer relative overflow-hidden group transition-all duration-300 flex flex-col items-center p-4 gap-4 w-full min-w-[180px] sm:max-w-[220px] h-44 bg-[#1F1F1F] rounded-2xl">
                                            {/* Curved Gradient Border - Same as real cards */}
                                            <div 
                                                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                                                style={{
                                                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                                                }}
                                            >
                                                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                                            </div>
                                            
                                            {/* Content with relative positioning to appear above gradient */}
                                            <div className="relative z-10 flex flex-col items-center text-center w-full">
                                                {/* Skeleton Image - Same size and style as real cards */}
                                                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    <div className="w-16 h-16 bg-gray-600 rounded-full animate-pulse"></div>
                                                </div>
                                                
                                                {/* Skeleton Name - Same styling as real cards */}
                                                <div className="w-20 h-4 bg-gray-600 rounded animate-pulse mb-2 mt-3"></div>
                                                
                                                {/* Skeleton Role - Same styling as real cards */}
                                                <div className="w-16 h-3 bg-gray-600 rounded animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            {/* Analyst Cards */}
                            {isTeamDataLoaded && !teamDataError && analysts.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-stretch max-w-none">
                                    {analysts.map((analyst) => (
                                        <AnalystCard
                                            key={analyst.id}
                                            analyst={analyst}
                                            isSelected={selectedAnalyst === analyst.id}
                                            onSelect={setSelectedAnalyst}
                                            onAdvance={() => {
                                                console.log('➡️ Advancing from step 1 to step 2 - invalidating Calendly cache');
                                                if (typeof sessionStorage !== 'undefined') {
                                                    sessionStorage.removeItem('calendlyEventTypes');
                                                    sessionStorage.removeItem('calendlyAvailability');
                                                    sessionStorage.removeItem('calendlyEventDetails');
                                                }
                                                setCurrentStep(2);
                                            }}
                                            isTeamDataLoaded={isTeamDataLoaded}
                                            router={router}
                                        />
                                    ))}
                                </div>
                            )}
                            
                            {/* No Analysts Available */}
                            {isTeamDataLoaded && !teamDataError && analysts.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-gray-400 text-2xl">👥</span>
                                    </div>
                                    <p className="text-gray-400 text-lg">No analysts available at the moment</p>
                                    <button 
                                        onClick={() => fetchTeamData()}
                                        className="text-indigo-400 hover:text-indigo-300 underline mt-2"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Meeting Selection, Timezone, Date & Time */}
                    {currentStep === 2 && (
                        <div className="space-y-8">
                            {/* Meeting Selection */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Select Meeting</h2>
                            <p className="text-sm sm:text-base text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Choose the session that best fits your needs</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {isLoadingEventTypes ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-3"></div>
                                    <p className="text-gray-400 text-sm">Loading meeting types...</p>
                                </div>
                            ) : calendlyMeetings.length === 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                                    <div className="text-gray-400 text-lg mb-2">📅</div>
                                    <h3 className="text-white text-lg font-semibold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                        No Bookings Available
                                    </h3>
                                    <p className="text-gray-400 text-sm max-w-md">
                                        This analyst doesn't have any active meeting types set up in their Calendly account yet.
                                    </p>
                                </div>
                            ) : (
                                calendlyMeetings.map((meeting) => (
                                    <MeetingCard
                                        key={meeting.id}
                                        meeting={meeting}
                                        isSelected={selectedMeeting === meeting.id}
                                        onSelect={setSelectedMeeting}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Timezone Selection */}
                            <div>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Select Time Zone</h2>
                        <div className="relative w-full max-w-md">
                            {/* Search Input */}
                            <div className="relative">
                                        <div 
                                            className="relative w-full h-[41px] bg-[#0A0A0A] rounded-lg flex flex-row justify-center items-center gap-2.5 border border-[#2A2A2A]"
                                        >
                                            {/* Curved Gradient Border */}
                                            <div 
                                                className="absolute inset-0 pointer-events-none rounded-lg p-[1px]"
                                                style={{
                                                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                                                }}
                                            >
                                                <div className="w-full h-full rounded-[7px] bg-[#0A0A0A]"></div>
                                            </div>

                                <input
                                    type="text"
                                            value={isTimezoneOpen ? timezoneSearch : (selectedTimezone ? getTimezoneDisplayLabel() : '')}
                                    onChange={(e) => handleTimezoneSearch(e.target.value)}
                                    onFocus={handleTimezoneInputFocus}
                                                placeholder="Select Timezone"
                                                className="w-full h-full px-4 py-3 text-white placeholder-white bg-transparent border-none focus:outline-none transition-colors relative z-10 rounded-lg"
                                />
                                <button
                                    onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 z-10 focus:outline-none focus:ring-0 focus:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none"
                                    style={{ outline: 'none', boxShadow: 'none' }}
                                >
                                <ChevronDown 
                                    size={20} 
                                        className={`transition-transform duration-200 ${isTimezoneOpen ? 'rotate-180' : ''}`}
                                />
                                </button>
                                        </div>
                            </div>

                            {/* Custom Dropdown Options */}
                            <div 
                                className={`absolute z-50 mt-1 w-full bg-black border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto transition-all duration-300 ease-in-out ${
                                    isTimezoneOpen 
                                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}
                            >
                                            {/* Enhanced Shiny Glint Effect - Top Right Corner */}
                                            <div 
                                                className="absolute top-0 right-0 w-12 h-12 opacity-60"
                                                style={{
                                                    background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
                                                    borderRadius: '8px 8px 0 0'
                                                }}
                                            ></div>
                                            
                                            {/* Enhanced Top Border Glint */}
                                            <div 
                                                className="absolute top-0 left-0 right-0 h-0.5 opacity-70"
                                                style={{
                                                    background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 10%, rgba(255,255,255,0.4) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 70%, rgba(255,255,255,0.1) 85%, transparent 100%)'
                                                }}
                                            ></div>
                                            
                                            {/* Enhanced Right Border Glint */}
                                            <div 
                                                className="absolute top-0 right-0 w-0.5 opacity-70 overflow-hidden"
                                                style={{
                                                    height: '20px',
                                                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                                                    borderRadius: '0 8px 0 0'
                                                }}
                                            ></div>
                                    {timezoneSearch ? (
                                        // Show filtered results when searching
                                        filteredTimezones.length > 0 ? (
                                            filteredTimezones.map((tz) => (
                                                <button
                                                    key={tz.value}
                                                    type="button"
                                                    onClick={() => handleTimezoneSelect(tz.value)}
                                                    onMouseEnter={() => setHoveredTimezone(tz.value)}
                                                    onMouseLeave={() => setHoveredTimezone('')}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex justify-between items-center focus:outline-none focus:ring-0 ${
                                                        selectedTimezone === tz.value
                                                            ? 'bg-purple-600 text-white'
                                                            : hoveredTimezone === tz.value
                                                            ? 'bg-purple-500 text-white'
                                                                    : 'bg-black text-white hover:bg-gray-800'
                                                    }`}
                                                    style={{ outline: 'none', boxShadow: 'none' }}
                                                >
                                                    <span>{tz.label}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                No timezones found
                                            </div>
                                        )
                                    ) : (
                                        // No search: show a flat list sorted globally by proximity to the user's timezone
                                        allTimezones.map((tz) => (
                                            <button
                                                key={tz.value}
                                                type="button"
                                                onClick={() => handleTimezoneSelect(tz.value)}
                                                onMouseEnter={() => setHoveredTimezone(tz.value)}
                                                onMouseLeave={() => setHoveredTimezone('')}
                                                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex justify-between items-center focus:outline-none focus:ring-0 ${
                                                    selectedTimezone === tz.value
                                                        ? 'bg-purple-600 text-white'
                                                        : hoveredTimezone === tz.value
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-black text-white hover:bg-gray-800'
                                                }`}
                                                style={{ outline: 'none', boxShadow: 'none' }}
                                            >
                                                <span>{tz.label}</span>
                                            </button>
                                        ))
                                    )}
                                </div>

                            {/* Backdrop to close dropdown */}
                                <div 
                                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                                    isTimezoneOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                                }`}
                                    onClick={() => {
                                        setIsTimezoneOpen(false);
                                        setTimezoneSearch('');
                                    }}
                                />
                        </div>
                    </div>

                            {/* Date & Time Selection */}
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                {/* Left side - Calendar with header */}
                                <div className="w-full lg:flex-[1.2]">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Pick a Date & Time</h2>
                                        <p className="text-sm sm:text-base text-gray-400">Select when you would like to schedule your meeting</p>
                                    </div>
                                    
                                        <div 
                                            className="bg-[#1F1F1F] rounded-xl mt-6 relative overflow-hidden p-4 w-full max-w-[412px] min-h-[284px] flex flex-col items-start gap-2.5"
                                        >
                                            {/* Loading Overlay */}
                                            {isLoadingAvailability && selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst) && (
                                                <div className="absolute inset-0 bg-[#1F1F1F]/90 flex items-center justify-center z-30 rounded-xl">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400"></div>
                                                        <p className="text-sm text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                                            Loading availability...
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Curved Gradient Border */}
                                            <div 
                                                className="absolute inset-0 pointer-events-none rounded-xl p-[1px]"
                                                style={{
                                                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                                                }}
                                            >
                                                <div className="w-full h-full rounded-[11px] bg-[#1F1F1F]"></div>
                                            </div>

                                            {/* Calendar Content Container */}
                                            <div className="relative z-10 w-full flex flex-col gap-4">
                                        {/* Calendar Header */}
                                                <div className="flex items-center justify-between w-full">
                                                    <h3 className="text-white font-medium text-sm">
                                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </h3>
                                                    <div className="flex gap-2">
                                            <button
                                                onClick={() => navigateMonth('prev')}
                                                disabled={(() => {
                                                    const now = new Date();
                                                    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                                                    const viewingMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                                                    return viewingMonthStart <= currentMonthStart;
                                                })()}
                                                className={`transition-colors w-4 h-4 focus:outline-none focus:ring-0 ${
                                                    (() => {
                                                        const now = new Date();
                                                        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                                                        const viewingMonthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
                                                        return viewingMonthStart <= currentMonthStart 
                                                            ? 'text-gray-500 cursor-not-allowed' 
                                                            : 'text-white hover:text-gray-300';
                                                    })()
                                                }`}
                                                style={{ outline: 'none', boxShadow: 'none' }}
                                            >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => navigateMonth('next')}
                                                            className="text-white hover:text-gray-300 transition-colors w-4 h-4 focus:outline-none focus:ring-0"
                                                            style={{ outline: 'none', boxShadow: 'none' }}
                                            >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                                    </div>
                                        </div>

                                                {/* Calendar Grid */}
                                                <div className="flex flex-row items-start gap-4 w-full">
                                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, dayIndex) => (
                                                        <div 
                                                            key={day} 
                                                            className="flex flex-col items-center flex-1 gap-4 min-w-0"
                                                        >
                                                            {/* Day Header */}
                                                            <div className="text-center font-medium text-[#909090] text-xs w-full">
                                                    {day}
                                        </div>

                                                            {/* Date Column */}
                                                            <div className="flex flex-col items-center w-full gap-2">
                                                                {getDaysInMonth(currentMonth).filter((_, index) => index % 7 === dayIndex).map((day, weekIndex) => (
                                                        <button
                                                                        key={weekIndex}
                                                                        onClick={() => day && !isLoadingAvailability && handleDateSelect(day)}
                                                                        disabled={!day || !isDateAvailable(day) || (isLoadingAvailability && selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst))}
                                                            className={`
                                                                            flex items-center justify-center transition-all duration-200 w-8 h-8 rounded-lg text-sm focus:outline-none focus:ring-0
                                                                            ${day && isDateSelected(day)
                                                                                ? 'bg-white text-black'
                                                                                : day && isDateAvailable(day) && !(isLoadingAvailability && selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst))
                                                                                ? 'bg-[#404040] text-white hover:bg-gray-500 cursor-pointer'
                                                                                : 'text-[#909090] cursor-not-allowed'
                                                                            }
                                                                        `}
                                                                        style={{ outline: 'none', boxShadow: 'none' }}
                                                                    >
                                                                        {day?.getDate()}
                                                        </button>
                                                                ))}
                                                            </div>
                                                </div>
                                            ))}
                                                </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right side - Time Slots */}
                                <div className="w-full lg:flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Available Time Slots</h3>
                                    
                                    {/* Loading state for time slots */}
                                    {isLoadingAvailability && selectedAnalyst !== null && hasCalendlyIntegration(selectedAnalyst) ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                                                <p className="text-sm text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                                    Loading time slots...
                                                </p>
                                            </div>
                                        </div>
                                    ) : timeSlotObjects.length > 0 ? (
                                        <div 
                                            className="flex flex-wrap sm:grid sm:grid-cols-3 md:grid-cols-4 sm:gap-2 mb-4"
                                            style={{
                                                width: window.innerWidth < 480 ? '320px' : window.innerWidth < 640 ? '343px' : '100%',
                                                gap: window.innerWidth < 480 ? '8px' : window.innerWidth < 640 ? '10px' : undefined
                                            }}
                                        >
                                        {timeSlotObjects.map((slot, index) => {
                                            const isDisabled = !selectedTimezone || isTimezoneChanging;
                                            return (
                                            <button
                                                key={slot.displayTime}
                                                onClick={() => !isDisabled && handleTimeSelect(slot.displayTime)}
                                                disabled={isDisabled}
                                                className={`
                                                        font-medium transition-all duration-200 relative z-20 focus:outline-none focus:ring-0
                                                        lg:text-xs lg:w-full lg:py-2 lg:px-3 lg:rounded-lg lg:h-auto
                                                        sm:w-full
                                                        ${window.innerWidth < 480 ? 'text-[10px]' : window.innerWidth < 640 ? 'text-xs' : 'text-xs'}
                                                    ${isDisabled 
                                                        ? 'bg-black text-gray-400 border border-gray-500 cursor-not-allowed'
                                                        : selectedTime === slot.displayTime
                                                            ? 'bg-white text-black border border-white'
                                                            : 'bg-[#0D0D0D] text-white border border-white'
                                                    }
                                                `}
                                                style={{
                                                    backgroundColor: isDisabled 
                                                        ? '#000000' 
                                                        : selectedTime === slot.displayTime ? 'white' : '#0D0D0D',
                                                    width: window.innerWidth < 480 ? '75px' : window.innerWidth < 640 ? '85px' : '100%',
                                                    height: window.innerWidth < 480 ? '36px' : window.innerWidth < 640 ? '41px' : 'auto',
                                                    paddingTop: window.innerWidth < 480 ? '8px' : window.innerWidth < 640 ? '12px' : undefined,
                                                    paddingRight: window.innerWidth < 480 ? '8px' : window.innerWidth < 640 ? '16px' : undefined,
                                                    paddingBottom: window.innerWidth < 480 ? '8px' : window.innerWidth < 640 ? '12px' : undefined,
                                                    paddingLeft: window.innerWidth < 480 ? '8px' : window.innerWidth < 640 ? '16px' : undefined,
                                                    borderRadius: window.innerWidth < 640 ? '8px' : undefined,
                                                    borderWidth: window.innerWidth < 640 ? '1px' : undefined,
                                                    marginRight: window.innerWidth < 640 ? '0px' : '0px',
                                                    marginBottom: window.innerWidth < 640 ? '0px' : '0px',
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                    fontSize: window.innerWidth < 480 ? '10px' : window.innerWidth < 640 ? '12px' : undefined,
                                                    lineHeight: window.innerWidth < 640 ? '1.2' : undefined
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isDisabled && selectedTime !== slot.displayTime) {
                                                        (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isDisabled && selectedTime !== slot.displayTime) {
                                                        (e.target as HTMLButtonElement).style.backgroundColor = '#0D0D0D';
                                                    }
                                                }}
                                            >
                                                {slot.displayTime}
                                            </button>
                                            );
                                        })}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                            <div className="text-gray-400 text-lg mb-2">
                                                {!selectedTimezone ? '🌍' : isTimezoneChanging ? '⏳' : '⏰'}
                                            </div>
                                            <h3 className="text-white text-lg font-semibold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                                {!selectedTimezone 
                                                    ? 'Select Timezone First' 
                                                    : isTimezoneChanging 
                                                        ? 'Loading Time Slots...' 
                                                        : 'No Available Times'
                                                }
                                            </h3>
                                            <p className="text-gray-400 text-sm max-w-md mb-4">
                                                {!selectedTimezone 
                                                    ? 'Please select a timezone to see available time slots.'
                                                    : isTimezoneChanging 
                                                        ? 'Converting time slots to your selected timezone...'
                                                        : 'No available time slots found for the selected date.'
                                                }
                                            </p>
                                        </div>
                                    )}
                                    {timeSlotObjects.length > 0 && (
                                        <p className="text-sm text-gray-400">Times shown in {getSelectedTimezoneLabel() || 'UTC'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        </div>
                    )}

                    {/* Step 3: Pay & Confirm */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex flex-col lg:flex-row gap-8 items-start">
                                {/* Left side - Payment Form */}
                                <div className="w-full lg:flex-[1.2]">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-semibold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Pay & Confirm</h2>
                                        <p className="text-sm sm:text-base text-gray-400">Complete your booking by providing your details and payment</p>
                                    </div>
                                    
                                    {/* Your Information */}
                                    <div className="mt-4 space-y-4">
                                        <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Your Information</h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setFullName(value);
                                                        const error = validateName(value);
                                                        setNameError(error);
                                                    }}
                                                    placeholder="Enter Name"
                                                    className={`w-full bg-black border-2 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-0 hover:border-gray-400 transition-colors text-sm ${
                                                        nameError ? 'border-red-500' : 'border-gray-500 focus:border-gray-400'
                                                    }`}
                                                    style={{ outline: 'none', boxShadow: 'none' }}
                                                />
                                                {nameError && (
                                                    <p className="text-red-400 text-xs mt-1">{nameError}</p>
                                                )}
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setEmail(value);
                                                        const error = validateEmail(value);
                                                        setEmailError(error);
                                                    }}
                                                    placeholder="abc@example.com"
                                                    className={`w-full bg-black border-2 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-0 hover:border-gray-400 transition-colors text-sm ${
                                                        emailError ? 'border-red-500' : 'border-gray-500 focus:border-gray-400'
                                                    }`}
                                                    style={{ outline: 'none', boxShadow: 'none' }}
                                                />
                                                {emailError && (
                                                    <p className="text-red-400 text-xs mt-1">{emailError}</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Notes <span className="text-red-400">*</span> <span className="text-xs text-gray-400">(Minimum 100 characters required)</span></label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setNotes(value);
                                                    const error = validateNotes(value);
                                                    setNotesError(error);
                                                }}
                                                placeholder="Let us know if you want to discuss specific topics... (Minimum 100 characters required)"
                                                rows={window.innerWidth < 640 ? 3 : 4}
                                                className={`w-full bg-black border-2 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors resize-none ${
                                                    notesError ? 'border-red-500' : 'border-gray-500'
                                                }`}
                                                style={{ outline: 'none', boxShadow: 'none' }}
                                            />
                                            {notesError && (
                                                <p className="text-red-400 text-xs mt-1">{notesError}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Payment Details</h3>
                                        
                                        <div className="flex flex-col gap-3 mt-4">
                                            <button
                                                onClick={handleStripePayment}
                                                disabled={!fullName || !email || !notes || !!nameError || !!emailError || !!notesError || paymentInitiating || paymentCompleted}
                                                className={`w-fit flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-all duration-300 ${
                                                    paymentCompleted
                                                        ? 'border-green-500/50 bg-green-500/10 cursor-not-allowed'
                                                        : !fullName || !email || !!nameError || !!emailError || paymentInitiating
                                                        ? 'border-white/20 bg-white/5 cursor-not-allowed opacity-50'
                                                        : 'border-white/30 hover:border-white/60 hover:bg-white/5 cursor-pointer hover:scale-105'
                                                }`}
                                            >
                                                <CreditCard className="w-5 h-5 text-white" />
                                                <span className="text-white font-semibold" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Card Payment</span>
                                            </button>
                                            
                                            {paymentCompleted && (
                                                <div className="flex items-center gap-2 text-green-400">
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm" style={{fontFamily: 'Gilroy-SemiBold, sans-serif'}}>
                                                        Payment Verified
                                                    </span>
                                            </div>
                                            )}
                                            
                                            {paymentInitiating && (
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    <span className="text-sm" style={{fontFamily: 'Gilroy-SemiBold, sans-serif'}}>
                                                        Redirecting to payment...
                                                    </span>
                                        </div>
                                            )}
                                            
                                            {!paymentCompleted && !paymentInitiating && (
                                                <p className="text-xs text-gray-400">
                                                    {(!fullName || !email || !notes || !!nameError || !!emailError || !!notesError) ? 'Fill in all required fields above to proceed with payment' : 'Click to complete payment via Stripe'}
                                                </p>
                                            )}
                                            
                                            {paymentError && (
                                                <div className="p-3 rounded-lg text-sm bg-red-900/20 text-red-400 border border-red-400/20">
                                                    {paymentError}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <p className="text-xs text-gray-400 leading-relaxed mt-4">
                                            By completing this booking, you agree to our Terms of Service and Privacy Policy. All services are provided for informational purposes only. Results may vary.
                                        </p>
                                    </div>
                                </div>

                                {/* Right side - Booking Summary */}
                                <div className="w-full lg:w-80 relative z-50">
                                    <div className="bg-[#1F1F1F] border border-gray-600/50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Booking Summary</h3>
                                        
                                        {/* Separation Line */}
                                        <div className="mb-4 w-full h-px border-t border-[#404040]"></div>
                                        
                                        {isBookingSummaryReady ? (
                                            <>
                                                {/* Meeting Type */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-xl font-bold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>{selectedMeetingDetails?.title}</h4>
                                                    <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                                                        selectedMeeting === 1 ? 'bg-teal-400/12 border border-teal-400 text-teal-400' :
                                                        selectedMeeting === 2 ? 'bg-purple-400/12 border border-purple-400 text-purple-400' :
                                                        'bg-yellow-400/12 border border-yellow-400 text-yellow-400'
                                                    }`}>
                                                        {selectedMeetingDetails?.duration}
                                                    </span>
                                                </div>
                                                
                                                <div className="space-y-4">
                                                    {/* Your Analyst */}
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-300">Your Analyst</span>
                                                        <span className="text-sm text-white">{analysts.find(a => a.id === selectedAnalyst)?.name}</span>
                                                    </div>
                                                    
                                                    {/* Date and Time */}
                                                    <div>
                                                        <p className="text-lg text-white">{formatSelectedDate()}</p>
                                                        <p className="text-xs text-white">{selectedTime} ({getSelectedTimezoneLabel()})</p>
                                                    </div>
                                                    
                                                    {/* Price */}
                                                    <div className="pt-1">
                                                        <div className="flex justify-between text-sm mb-4">
                                                            <span className="text-gray-300">Price</span>
                                                            <span className="text-white">{getMeetingPrice()}</span>
                                                        </div>
                                                        <div className="flex justify-between text-sm mb-2">
                                                            <span className="text-gray-300">Tax</span>
                                                            <span className="text-white">10%</span>
                                                        </div>
                                                        {/* Separation Line Above Total */}
                                                        <div className="mb-2 w-full h-px border-t border-[#404040]"></div>
                                                        <div className="flex justify-between text-base font-semibold">
                                                            <span className="text-white">Total</span>
                                                            <span className="text-white">{getMeetingPrice()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-4 animate-pulse" aria-live="polite" aria-busy="true">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="h-6 bg-gray-700/60 rounded w-32"></div>
                                                    <div className="h-6 bg-gray-700/60 rounded w-20"></div>
                                                </div>
                                                <div className="flex justify-between">
                                                    <div className="h-4 bg-gray-700/60 rounded w-20"></div>
                                                    <div className="h-4 bg-gray-700/60 rounded w-24"></div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-gray-700/60 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-700/60 rounded w-1/2"></div>
                                                </div>
                                                <div className="pt-1 space-y-3">
                                                    <div className="h-4 bg-gray-700/60 rounded w-full"></div>
                                                    <div className="h-4 bg-gray-700/60 rounded w-1/2"></div>
                                                    <div className="h-px bg-[#404040]" />
                                                    <div className="h-4 bg-gray-700/60 rounded w-full"></div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    {currentStep !== 1 && (
                    <div className="mt-12 flex justify-end gap-4 relative z-[9999]">
                            {(currentStep === 2 || currentStep === 3) && (
                            <button
                                onClick={handleBack}
                                className="w-44 py-3 rounded-3xl font-semibold transition-all duration-300 bg-black text-white border border-white hover:border-gray-300 focus:outline-none focus:ring-0 focus:border-none active:outline-none relative z-[9999]"
                                style={{ 
                                    outline: 'none', 
                                    boxShadow: window.innerWidth < 768 ? '0 4px 20px rgba(0, 0, 0, 0.8)' : 'none',
                                    backgroundColor: 'rgb(0, 0, 0)'
                                }}
                                onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
                                onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'rgb(0, 0, 0)'}
                                onFocus={(e) => e.target.blur()}
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleContinue}
                            disabled={isContinueDisabled}
                            className={`w-44 py-3 rounded-3xl font-semibold transition-all duration-300 relative z-[9999]
                            ${isContinueDisabled ? 'text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
                            style={{ 
                                backgroundColor: isContinueDisabled ? 'rgba(255, 255, 255, 0.62)' : 'rgb(255, 255, 255)',
                                outline: 'none',
                                boxShadow: window.innerWidth < 768 ? '0 4px 20px rgba(0, 0, 0, 0.8)' : 'none'
                            }}
                        >
                                {currentStep === 3 && isLoadingAvailability ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading...
                                    </span>
                                ) : currentStep === 3 ? 'Continue' : 'Proceed to Pay'}
                        </button>
                    </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingsPage;

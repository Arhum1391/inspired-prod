'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronLeft } from 'lucide-react';
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
}

interface Timezone {
    value: string;
    label: string;
}

// --- MOCK DATA ---
const baseAnalysts: Analyst[] = [
  {
    id: 0,
    name: 'Adnan',
    description: 'Content creator specializing in stocks, crypto, data science, & side hustles.',
    image: '/team dark/Adnan.png'
  },
  {
    id: 1,
    name: 'Assassin',
    description: 'Better known as Assassin Co-Founder of Inspired Analyst Discord Server, Trading crypto since 2019. My expertise is in Fibonacci Retracements, Trend-based-Fibs, Quant Analysis, Institutional Orderflow, Volume Profiling, Orderblocks, Fair Value Gaps, Supply/Demand, ICT Concepts, and textbook charts/candlestick patterns.',
    image: '/team dark/Assassin.png'
  },
  {
    id: 2,
    name: 'Hassan Tariq',
    description: 'I am Hassan Tariq and I have been trading crypto solely since 2020. I have been a part of Inspired Analyst team since April 2023. My expertise is in Fibonacci Retracements, Trend-based-Fibs, Fixed Range Volume Profile, Harmonics and Supply & Demand Concept.',
    image: '/team dark/Hassan Tariq.png'
  },
  {
    id: 3,
    name: 'Hamza Ali',
    description: 'My name is Hamza Ali and I have 5 years of experience in trading I specialize in risk management and consistent profit-making. My core strategy is price action trading, which naturally covers SMC, ICT, and other advanced concepts in a simplified way I keep my charts clean and to the point no unnecessary complications, just clarity and precision.',
    image: '/team dark/Hamza Ali.png'
  },
  {
    id: 4,
    name: 'Hassan Khan',
    description: 'I\'m Hassankhan, Co-founder of Inspired Analyst Forex Server, I don\'t just trade gold — I eat, breathe, and live XAU. I am also leading the CIVIC CHALLENGE, one of the most recognized and respected trading challenges across local Discord communities. With over 4–5 years of dedicated experience in trading gold, I\'ve developed a deep understanding of market movements, risk management, and profitable trading strategies.',
    image: '/team dark/Hassan Khan.png'
  },
  {
    id: 5,
    name: 'Meower',
    description: 'I\'m Meower, a 17-year-old cryptocurrency trader with experience in the market since February 2021. I specialize in breakout trading, focusing on large percentage moves on centralized exchanges. My strategy is based on a high-risk-to-reward framework, with a consistent win rate of over 85%. In 2025, I completed a publicly tracked $1,000 to $2,000 trading challenge.',
    image: '/team dark/Meower.png'
  },
  {
    id: 6,
    name: 'Mohid',
    description: 'Stop wasting time on outdated trading strategies that don\'t work anymore. As a professional trader with over 5 years of experience, I specialize in teaching advanced, fresh ICT concepts that are both simple to grasp and highly effective. My unique approach is built on two core trading models, the Fractal Model and the Forever Model, designed for maximum accuracy and clarity.',
    image: '/team dark/Mohid.png'
  },
  {
    id: 7,
    name: 'M. Usama',
    description: 'I\'m Muhammad Usama, and I\'ve been trading crypto since 2020, and I started trading forex in 2023. This experience has taught me how to navigate everything from bull runs to brutal bear markets. I trade on indicators to refine my entries and exits, and try to keep my trading simple by using the price action. What keeps me consistent is blending institutional concepts with simple, practical tools.',
    image: '/team dark/M. Usama.png'
  }
];

const meetings: Meeting[] = [
  {
    id: 2,
    title: '30-Min Strategy',
    duration: '30 minutes',
    price: '3 BNB',
    description: 'A focused session to address specific challenges and develop targeted strategies.',
    color: 'text-purple-400',
  },
  {
    id: 3,
    title: '60-Min Deep',
    duration: '60 minutes',
    price: '5 BNB',
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
    region: "US/CANADA",
    timezones: [
      { value: 'pst', label: 'Pacific Time - US & Canada' },
      { value: 'mst', label: 'Mountain Time - US & Canada' },
      { value: 'cst', label: 'Central Time - US & Canada' },
      { value: 'est', label: 'Eastern Time - US & Canada' },
      { value: 'akst', label: 'Alaska Time' },
      { value: 'hst', label: 'Hawaii Time' },
      { value: 'ast_ca', label: 'Atlantic Time - Canada' },
    ]
  },
  {
    region: "AMERICAS",
    timezones: [
      { value: 'brt', label: 'Brasilia Time' },
      { value: 'art', label: 'Argentina Time' },
      { value: 'clt', label: 'Chile Time' },
      { value: 'cot', label: 'Colombia Time' },
      { value: 'pet', label: 'Peru Time' },
      { value: 'vet', label: 'Venezuela Time' },
      { value: 'gyt', label: 'Guyana Time' },
      { value: 'srt', label: 'Suriname Time' },
      { value: 'fkt', label: 'Falkland Islands Time' },
    ]
  },
  {
    region: "EUROPE",
    timezones: [
      { value: 'gmt', label: 'Greenwich Mean Time' },
      { value: 'cet', label: 'Central European Time' },
      { value: 'eet', label: 'Eastern European Time' },
      { value: 'wet', label: 'Western European Time' },
      { value: 'msk', label: 'Moscow Time' },
      { value: 'trt', label: 'Turkey Time' },
      { value: 'eest', label: 'Eastern European Summer Time' },
      { value: 'cest', label: 'Central European Summer Time' },
      { value: 'west', label: 'Western European Summer Time' },
    ]
  },
  {
    region: "AFRICA",
    timezones: [
      { value: 'cat', label: 'Central Africa Time' },
      { value: 'eat', label: 'East Africa Time' },
      { value: 'wat', label: 'West Africa Time' },
      { value: 'sast', label: 'South Africa Standard Time' },
      { value: 'cairo', label: 'Africa/Cairo' },
      { value: 'lagos', label: 'Africa/Lagos' },
      { value: 'casablanca', label: 'Africa/Casablanca' },
      { value: 'johannesburg', label: 'Africa/Johannesburg' },
      { value: 'nairobi', label: 'Africa/Nairobi' },
    ]
  },
  {
    region: "ASIA",
    timezones: [
      { value: 'ist', label: 'India Standard Time' },
      { value: 'bdt', label: 'Bangladesh Time' },
      { value: 'pkt', label: 'Pakistan Time' },
      { value: 'cst_cn', label: 'China Standard Time' },
      { value: 'jst', label: 'Japan Standard Time' },
      { value: 'kst', label: 'Korea Standard Time' },
      { value: 'pht', label: 'Philippines Time' },
      { value: 'ict', label: 'Indochina Time' },
      { value: 'myt', label: 'Malaysia Time' },
      { value: 'sgt', label: 'Singapore Time' },
      { value: 'hkt', label: 'Hong Kong Time' },
      { value: 'tst', label: 'Taiwan Time' },
      { value: 'jordan', label: 'Jordan Time' },
      { value: 'baghdad', label: 'Baghdad, East Africa Time' },
      { value: 'baku', label: 'Asia/Baku' },
      { value: 'lebanon', label: 'Lebanon Time' },
    ]
  },
  {
    region: "MIDDLE EAST",
    timezones: [
      { value: 'gst', label: 'Gulf Standard Time' },
      { value: 'ast_me', label: 'Arabia Standard Time' },
      { value: 'irt', label: 'Iran Time' },
      { value: 'israel', label: 'Israel Time' },
      { value: 'kuwait', label: 'Kuwait Time' },
      { value: 'qatar', label: 'Qatar Time' },
      { value: 'bahrain', label: 'Bahrain Time' },
      { value: 'oman', label: 'Oman Time' },
    ]
  },
  {
    region: "OCEANIA",
    timezones: [
      { value: 'aest', label: 'Australian Eastern Time' },
      { value: 'acst', label: 'Australian Central Time' },
      { value: 'awst', label: 'Australian Western Time' },
      { value: 'nzst', label: 'New Zealand Time' },
      { value: 'fjt', label: 'Fiji Time' },
      { value: 'pgt', label: 'Papua New Guinea Time' },
      { value: 'sbt', label: 'Solomon Islands Time' },
      { value: 'vut', label: 'Vanuatu Time' },
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

// --- HELPER COMPONENTS ---



// Reusable Analyst Card Component
const AnalystCard: React.FC<AnalystCardProps> = ({ analyst, isSelected, onSelect, onAdvance, isTeamDataLoaded }) => {
    const handleClick = () => {
        onSelect(analyst.id);
        // Auto-advance to next step after selection
        setTimeout(() => {
            onAdvance();
            // Scroll to top on mobile when advancing to next step
            if (window.innerWidth < 768) {
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
                    <div className="w-full h-full bg-gray-600 rounded-full flex items-center justify-center text-gray-300 text-lg font-bold" style={{display: 'none'}}>
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
const MeetingsPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedAnalyst, setSelectedAnalyst] = useState<number | null>(null); // No default selection
    const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null); // No default selection
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [analystAbout, setAnalystAbout] = useState<string>('');
    const [isLoadingAbout, setIsLoadingAbout] = useState<boolean>(false);
    const [isTimezoneOpen, setIsTimezoneOpen] = useState<boolean>(false);
    const [teamData, setTeamData] = useState<{name: string, role: string}[]>([]);
    const [analysts, setAnalysts] = useState<Analyst[]>(baseAnalysts);
    const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);
    
    // Calendly Integration States
    const [calendlyEventTypes, setCalendlyEventTypes] = useState<any[]>([]);
    const [calendlyMeetings, setCalendlyMeetings] = useState<Meeting[]>(meetings);
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [availableTimesByDate, setAvailableTimesByDate] = useState<Record<string, string[]>>({});
    const [slotUrlsByDateTime, setSlotUrlsByDateTime] = useState<Record<string, string>>({});
    const [rawTimestampsByDateTime, setRawTimestampsByDateTime] = useState<Record<string, string>>({});
    const [isLoadingEventTypes, setIsLoadingEventTypes] = useState<boolean>(false);
    const [isLoadingAvailability, setIsLoadingAvailability] = useState<boolean>(false);
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

    // Function to fetch team data from MongoDB
    const fetchTeamData = async () => {
        try {
            // First try to get from sessionStorage (pre-fetched from landing page)
            const cachedData = sessionStorage.getItem('teamData');
            if (cachedData) {
                const team = JSON.parse(cachedData);
                setTeamData(team);
                updateAnalystsWithTeamData(team);
                setIsTeamDataLoaded(true);
                return;
            }

            // If not in cache, fetch from API
            const response = await fetch('/api/team');
            if (response.ok) {
                const data = await response.json();
                setTeamData(data.team);
                updateAnalystsWithTeamData(data.team);
                // Cache for future use
                sessionStorage.setItem('teamData', JSON.stringify(data.team));
                setIsTeamDataLoaded(true);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
            // Keep existing analysts with default descriptions
            setIsTeamDataLoaded(true);
        }
    };

    // Function to update analysts array with team data
    const updateAnalystsWithTeamData = (team: {name: string, role: string}[]) => {
        const updatedAnalysts = baseAnalysts.map(analyst => {
            const teamMember = team.find(member => member.name === analyst.name);
            if (teamMember && teamMember.role) {
                return {
                    ...analyst,
                    description: teamMember.role
                };
            }
            return analyst;
        });
        setAnalysts(updatedAnalysts);
    };

    // Function to fetch Calendly event types
    const fetchCalendlyEventTypes = async () => {
        setIsLoadingEventTypes(true);
        try {
            const response = await fetch('/api/calendly/event-types');
            if (response.ok) {
                const data = await response.json();
                setCalendlyEventTypes(data.eventTypes || []);
                
                // Transform Calendly event types to Meeting format
                const transformedMeetings: Meeting[] = data.eventTypes.map((eventType: any, index: number) => ({
                    id: index + 2, // Start from 2 to match existing IDs
                    title: eventType.name,
                    duration: `${eventType.duration} minutes`,
                    price: '3 BNB', // Default price, can be customized
                    description: eventType.description || 'A focused session to address specific challenges.',
                    color: index % 2 === 0 ? 'text-purple-400' : 'text-yellow-400',
                }));
                
                if (transformedMeetings.length > 0) {
                    setCalendlyMeetings(transformedMeetings);
                }
            }
        } catch (error) {
            console.error('Error fetching Calendly event types:', error);
            // Keep using default meetings if Calendly fetch fails
        } finally {
            setIsLoadingEventTypes(false);
        }
    };

    // Function to fetch Calendly availability
    const fetchCalendlyAvailability = async (eventTypeUri: string, startDate: string, endDate: string) => {
        setIsLoadingAvailability(true);
        console.log('Fetching Calendly availability:', { eventTypeUri, startDate, endDate });
        try {
            const response = await fetch(
                `/api/calendly/availability?eventTypeUri=${encodeURIComponent(eventTypeUri)}&startDate=${startDate}&endDate=${endDate}`
            );
            if (response.ok) {
                const data = await response.json();
                console.log('Received availability data:', data);
                setAvailableDates(data.availableDates || []);
                setAvailableTimesByDate(data.availabilityByDate || {});
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
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [nameError, setNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    // Load Calendly widget script for popup functionality
    useEffect(() => {
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
            document.head.removeChild(link);
            document.body.removeChild(script);
        };
    }, []);

    // Fetch team data on component mount
    useEffect(() => {
        fetchTeamData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Calendly event types when Assassin is selected
    useEffect(() => {
        if (selectedAnalyst === 1) { // Assassin's ID is 1
            fetchCalendlyEventTypes();
        } else {
            // Use default meetings for other analysts
            setCalendlyMeetings(meetings);
        }
    }, [selectedAnalyst]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Calendly availability when meeting type and month change
    useEffect(() => {
        if (selectedAnalyst === 1 && selectedMeeting !== null && calendlyEventTypes.length > 0) {
            console.log('Attempting to fetch availability:', {
                selectedMeeting,
                calendlyEventTypesLength: calendlyEventTypes.length,
                calculatedIndex: selectedMeeting - 2
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
                
                // Use whichever is later: minimum safe date or start of month
                const startDate = startOfMonth > minStartDate ? startOfMonth : minStartDate;
                const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
                endOfMonth.setHours(23, 59, 59, 999);
                
                // Fetch availability in 7-day chunks
                const fetchAllAvailability = async () => {
                    const allDates: string[] = [];
                    const allTimesByDate: Record<string, string[]> = {};
                    const allSlotUrls: Record<string, string> = {};
                    const allRawTimestamps: Record<string, string> = {};
                    
                    let currentStart = new Date(startDate);
                    
                    while (currentStart <= endOfMonth) {
                        // Calculate end date (7 days from start or end of month, whichever is earlier)
                        const currentEnd = new Date(currentStart);
                        currentEnd.setDate(currentEnd.getDate() + 6); // 7 days total (inclusive)
                        
                        if (currentEnd > endOfMonth) {
                            currentEnd.setTime(endOfMonth.getTime());
                        }
                        
                        const startDateStr = currentStart.toISOString().split('T')[0];
                        const endDateStr = currentEnd.toISOString().split('T')[0];
                        
                        console.log('Fetching availability chunk:', { startDateStr, endDateStr });
                        
                        try {
                            const response = await fetch(
                                `/api/calendly/availability?eventTypeUri=${encodeURIComponent(selectedEventType.id)}&startDate=${startDateStr}&endDate=${endDateStr}`
                            );
                            
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
                                console.error('Failed to fetch chunk:', response.status, await response.text());
                            }
                        } catch (error) {
                            console.error('Error fetching chunk:', error);
                        }
                        
                        // Move to next week
                        currentStart.setDate(currentStart.getDate() + 7);
                    }
                    
                    // Remove duplicates and sort
                    const uniqueDates = [...new Set(allDates)].sort();
                    
                    console.log('Total availability fetched:', {
                        totalDates: uniqueDates.length,
                        dates: uniqueDates,
                        totalSlotUrls: Object.keys(allSlotUrls).length
                    });
                    
                    setAvailableDates(uniqueDates);
                    setAvailableTimesByDate(allTimesByDate);
                    setSlotUrlsByDateTime(allSlotUrls);
                    setRawTimestampsByDateTime(allRawTimestamps);
                };
                
                fetchAllAvailability();
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
    }, [selectedMeeting, currentMonth, selectedAnalyst, calendlyEventTypes]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle step and selectedAnalyst parameters from URL (for navigation back from reviews page)
    useEffect(() => {
        const stepParam = searchParams.get('step');
        const selectedAnalystParam = searchParams.get('selectedAnalyst');
        
        if (stepParam) {
            const step = parseInt(stepParam);
            if (step >= 1 && step <= 3) {
                setCurrentStep(step);
            }
        }
        
        if (selectedAnalystParam) {
            const analystId = parseInt(selectedAnalystParam);
            if (analystId >= 0) {
                setSelectedAnalyst(analystId);
            }
        }
    }, [searchParams]);

    // Fetch analyst about data when analyst is selected
    useEffect(() => {
        if (selectedAnalyst !== null) {
            const analystName = analysts.find(a => a.id === selectedAnalyst)?.name;
            if (analystName) {
                fetchAnalystAbout(analystName);
            }
        }
    }, [selectedAnalyst, analysts]); // eslint-disable-line react-hooks/exhaustive-deps
    
    // Reset selected time when timezone changes (times will be converted)
    useEffect(() => {
        if (selectedAnalyst === 1 && selectedTimezone && selectedDate) {
            setSelectedTime(''); // Reset so user re-selects with new timezone
        }
    }, [selectedTimezone]); // eslint-disable-line react-hooks/exhaustive-deps
    // const router = useRouter(); // Removed to prevent compilation error

    const isContinueDisabled = currentStep === 2 ? (selectedMeeting === null || !selectedTimezone || !selectedDate || !selectedTime) : 
                               currentStep === 3 ? (!fullName || !email || !!nameError || !!emailError) : false;

    const handleContinue = async () => {
        console.log('handleContinue clicked!', { 
            currentStep, 
            isContinueDisabled, 
            selectedAnalyst,
            selectedEventTypeUri 
        });
        
        if (!isContinueDisabled) {
            if (currentStep === 2) {
                console.log('Advancing to step 3');
                setCurrentStep(3);
                // Scroll to top on mobile when advancing to next step
                if (window.innerWidth < 768) {
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                }
            } else {
                console.log('Processing final step, currentStep:', currentStep);
                const selectedTimezoneData = allTimezones.find(tz => tz.value === selectedTimezone);
                
                // For Assassin (ID: 1), open Calendly popup widget
                if (selectedAnalyst === 1 && selectedDate && selectedTime) {
                    // Find the UTC time that corresponds to the selected (possibly converted) time
                    let utcTimeForSlot = selectedTime;
                    let schedulingUrl = slotUrlsByDateTime[`${selectedDate}|${selectedTime}`];
                    
                    // If timezone is selected and URL not found, the time might be converted
                    // We need to find the original UTC time
                    if (!schedulingUrl && selectedTimezone && availableTimesByDate[selectedDate]) {
                        const utcTimes = availableTimesByDate[selectedDate];
                        for (const utcTime of utcTimes) {
                            const convertedTime = convertTimeToTimezone(utcTime, selectedTimezone);
                            if (convertedTime === selectedTime) {
                                utcTimeForSlot = utcTime;
                                schedulingUrl = slotUrlsByDateTime[`${selectedDate}|${utcTime}`];
                                break;
                            }
                        }
                    }
                    
                    const dateTimeKey = `${selectedDate}|${utcTimeForSlot}`;
                    
                    console.log('Looking for scheduling URL:', { 
                        selectedTime, 
                        utcTimeForSlot,
                        dateTimeKey, 
                        schedulingUrl 
                    });
                    console.log('Available slots:', Object.keys(slotUrlsByDateTime).slice(0, 5));
                    
                    if (schedulingUrl) {
                        // Build URL with pre-filled information
                        const bookingUrl = new URL(schedulingUrl);
                        bookingUrl.searchParams.append('name', fullName);
                        bookingUrl.searchParams.append('email', email);
                        if (notes) {
                            bookingUrl.searchParams.append('a1', notes);
                        }
                        
                        console.log('Opening Calendly popup with pre-filled info:', bookingUrl.toString());
                        
                        // Open Calendly popup widget
                        if (typeof window !== 'undefined' && (window as any).Calendly) {
                            (window as any).Calendly.initPopupWidget({
                                url: bookingUrl.toString(),
                                prefill: {
                                    name: fullName,
                                    email: email,
                                    customAnswers: {
                                        a1: notes || ''
                                    }
                                },
                                utm: {
                                    utmSource: 'inspired-analyst',
                                    utmMedium: 'website',
                                    utmCampaign: 'meeting-booking'
                                }
                            });
                            
                            // Listen for Calendly events
                            const handleCalendlyEvent = (e: MessageEvent) => {
                                if (e.data.event && e.data.event === 'calendly.event_scheduled') {
                                    console.log('Calendly booking completed:', e.data);
                                    
                                    // Redirect to success page after booking is confirmed
                                    const params = new URLSearchParams({
                                        analyst: selectedAnalyst?.toString() || '0',
                                        meeting: selectedMeeting?.toString() || '1',
                                        date: selectedDate || '',
                                        time: selectedTime || '',
                                        timezone: selectedTimezoneData?.label || '',
                                        notes: notes || '',
                                        calendlyEventUri: e.data.payload?.event?.uri || ''
                                    });
                                    
                                    window.location.href = `/booking-success?${params.toString()}`;
                                }
                            };
                            
                            window.addEventListener('message', handleCalendlyEvent);
                        } else {
                            console.error('Calendly widget not loaded, falling back to redirect');
                            window.location.href = bookingUrl.toString();
                        }
                        return;
                    } else {
                        console.error('No scheduling URL found for selected date/time:', dateTimeKey);
                        alert('Unable to find the selected time slot. Please try selecting a different time.');
                        return;
                    }
                }
                
                // For other analysts, redirect to success page
                const params = new URLSearchParams({
                    analyst: selectedAnalyst?.toString() || '0',
                    meeting: selectedMeeting?.toString() || '1',
                    date: selectedDate || '',
                    time: selectedTime || '',
                    timezone: selectedTimezoneData?.label || '',
                    notes: notes || ''
                });
                
                window.location.href = `/booking-success?${params.toString()}`;
            }
        }
    };

    const handleBack = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        } else if (currentStep === 3) {
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

    // Flatten all timezones for filtering
    const allTimezones = timezoneGroups.flatMap(group => 
        group.timezones.map(tz => ({ ...tz, region: group.region }))
    );

    const filteredTimezones = allTimezones.filter(tz => 
        tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
        tz.region.toLowerCase().includes(timezoneSearch.toLowerCase())
    );

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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isDateAvailable = (date: Date) => {
        // For Assassin with Calendly integration
        if (selectedAnalyst === 1) {
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

    // Convert UTC time to selected timezone
    const convertTimeToTimezone = (utcTimeStr: string, timezoneValue: string): string => {
        if (!timezoneValue) return utcTimeStr; // Return UTC if no timezone selected
        
        // Parse the UTC time (format: "H:MM AM/PM")
        const utcDate = new Date(rawTimestampsByDateTime[`${selectedDate}|${utcTimeStr}`]);
        if (!utcDate || isNaN(utcDate.getTime())) {
            return utcTimeStr; // Return original if can't parse
        }
        
        // Get timezone offset in hours
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
        
        // Apply timezone offset
        const localDate = new Date(utcDate.getTime() + (offset * 3600000));
        
        // Format the converted time
        const hours = localDate.getUTCHours();
        const minutes = localDate.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMinutes = String(minutes).padStart(2, '0');
        
        return `${displayHours}:${displayMinutes} ${ampm}`;
    };

    // Get time slots based on selected date and convert to selected timezone
    const getTimeSlots = () => {
        // For Assassin with Calendly integration
        if (selectedAnalyst === 1 && selectedDate && availableTimesByDate[selectedDate]) {
            const utcTimes = availableTimesByDate[selectedDate];
            
            // If timezone is selected, convert times
            if (selectedTimezone) {
                const convertedTimes = utcTimes.map(utcTime => 
                    convertTimeToTimezone(utcTime, selectedTimezone)
                );
                console.log('Returning converted Calendly time slots for', selectedDate, ':', convertedTimes);
                return convertedTimes;
            }
            
            console.log('Returning UTC Calendly time slots for', selectedDate, ':', utcTimes);
            return utcTimes;
        }
        
        console.log('Using default time slots. Assassin?', selectedAnalyst === 1, 'Selected date:', selectedDate, 'Has times?', !!availableTimesByDate[selectedDate]);
        
        // Default time slots for other analysts
        return [
            '9:00 AM', '10:00 AM', '11:30 AM', '12:30 PM', 
            '1:30 PM', '2:00 PM', '2:30 PM', '5:30 PM'
        ];
    };

    // Available time slots
    const timeSlots = getTimeSlots();

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    // Helper functions for booking summary
    const getSelectedMeetingData = () => {
        return calendlyMeetings.find(meeting => meeting.id === selectedMeeting);
    };

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
        const meeting = getSelectedMeetingData();
        return meeting ? meeting.price : '0 BNB';
    };

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
                                        backgroundImage: 'url("inspired analysts team/1.png")',
                                        backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2 improved.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/3.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/4.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/1.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2 improved.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/3.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-auto mr-1"
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
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/5.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/6.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/7.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/2.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/5.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/6.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("inspired analysts team/7.png")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-20 xl:w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
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
                        Back
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
                                            src={analysts.find(a => a.id === selectedAnalyst)?.image || '/team dark/Adnan.png'}
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
                                    <div className="flex flex-row items-center justify-center relative z-10 w-full gap-1">
                                        {/* Star */}
                                        <div className="flex items-center justify-center w-3 h-3 flex-shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z" fill="#DE50EC"/>
                                            </svg>
                                        </div>
                                        
                                        {/* Rating Text */}
                                        <span className="text-gray-400 text-sm" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>4.9</span>
                                        
                                        {/* Reviews Count */}
                                        <span className="text-gray-400 text-sm" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>(21 reviews)</span>
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
                                    className="relative overflow-hidden group transition-all duration-300 flex flex-col items-start p-4 gap-4 w-full lg:flex-1 h-auto lg:h-[240px] bg-[#1F1F1F] rounded-2xl"
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
                                    <div className="relative z-10 w-full h-full flex flex-col">
                                        <h3 className="text-white text-lg font-semibold mb-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>About</h3>
                                        <div className="flex-1 lg:overflow-y-auto">
                                            {isLoadingAbout ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                                </div>
                                            ) : (
                                                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-stretch max-w-none">
                                {analysts.map((analyst) => (
                                    <AnalystCard
                                        key={analyst.id}
                                        analyst={analyst}
                                        isSelected={selectedAnalyst === analyst.id}
                                        onSelect={setSelectedAnalyst}
                                        onAdvance={() => setCurrentStep(2)}
                                        isTeamDataLoaded={isTeamDataLoaded}
                                    />
                                ))}
                            </div>
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
                            {isLoadingEventTypes && selectedAnalyst === 1 ? (
                                <div className="col-span-full flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
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
                                                    <span className="text-xs text-gray-400 ml-2">{getCurrentTime(tz.value)}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                No timezones found
                                            </div>
                                        )
                                    ) : (
                                        // Show grouped results when not searching
                                        timezoneGroups.map((group) => (
                                            <div key={group.region}>
                                                {/* Region Header */}
                                                        <div className="px-4 py-2 text-xs font-semibold text-gray-300 bg-gray-800/50 border-b border-gray-600">
                                                    {group.region}
                                                </div>
                                                {/* Timezone Options */}
                                                {group.timezones.map((tz) => (
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
                                                        <span className="text-xs text-gray-400 ml-2">{getCurrentTime(tz.value)}</span>
                                                    </button>
                                                ))}
                                            </div>
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
                                            {isLoadingAvailability && selectedAnalyst === 1 && (
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
                                                            className="text-white hover:text-gray-300 transition-colors w-4 h-4 focus:outline-none focus:ring-0"
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
                                                                        disabled={!day || !isDateAvailable(day) || (isLoadingAvailability && selectedAnalyst === 1)}
                                                            className={`
                                                                            flex items-center justify-center transition-all duration-200 w-8 h-8 rounded-lg text-sm focus:outline-none focus:ring-0
                                                                            ${day && isDateSelected(day)
                                                                                ? 'bg-white text-black'
                                                                                : day && isDateAvailable(day) && !(isLoadingAvailability && selectedAnalyst === 1)
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
                                    {isLoadingAvailability && selectedAnalyst === 1 ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                                                <p className="text-sm text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                                                    Loading time slots...
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div 
                                            className="flex flex-wrap sm:grid sm:grid-cols-3 md:grid-cols-4 sm:gap-2 mb-4"
                                            style={{
                                                width: window.innerWidth < 480 ? '320px' : window.innerWidth < 640 ? '343px' : '100%',
                                                gap: window.innerWidth < 480 ? '8px' : window.innerWidth < 640 ? '10px' : undefined
                                            }}
                                        >
                                        {timeSlots.map((time, index) => (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`
                                                        font-medium transition-all duration-200 relative z-20 focus:outline-none focus:ring-0
                                                        lg:text-xs lg:w-full lg:py-2 lg:px-3 lg:rounded-lg lg:h-auto
                                                        sm:w-full
                                                        ${window.innerWidth < 480 ? 'text-[10px]' : window.innerWidth < 640 ? 'text-xs' : 'text-xs'}
                                                    ${selectedTime === time
                                                        ? 'bg-white text-black border border-white'
                                                            : 'bg-[#0D0D0D] text-white border border-white'
                                                    }
                                                `}
                                                style={{
                                                    backgroundColor: selectedTime === time ? 'white' : '#0D0D0D',
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
                                                    if (selectedTime !== time) {
                                                        (e.target as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (selectedTime !== time) {
                                                        (e.target as HTMLButtonElement).style.backgroundColor = '#0D0D0D';
                                                    }
                                                }}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-400">Times shown in {getSelectedTimezoneLabel() || 'UTC'}</p>
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
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Let us know if you want to discuss specific topics..."
                                                rows={window.innerWidth < 640 ? 3 : 4}
                                                className="w-full bg-black border-2 border-gray-500 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors resize-none"
                                                style={{ outline: 'none', boxShadow: 'none' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Payment Details</h3>
                                        <div className="w-fit mt-4">
                                            <div className="flex items-center justify-center px-4 py-3 border border-white/30 rounded-lg">
                                                <Image
                                                    src="/logo/Binance.svg"
                                                    alt="Binance"
                                                    width={138}
                                                    height={20}
                                                    className="h-5 w-auto"
                                                />
                                            </div>
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
                                        
                                        {/* Meeting Type - Moved to top */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-bold text-white" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>{getSelectedMeetingData()?.title}</h4>
                                                <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                                                    selectedMeeting === 1 ? 'bg-teal-400/12 border border-teal-400 text-teal-400' :
                                                    selectedMeeting === 2 ? 'bg-purple-400/12 border border-purple-400 text-purple-400' :
                                                    'bg-yellow-400/12 border border-yellow-400 text-yellow-400'
                                                }`}>
                                                    {getSelectedMeetingData()?.duration}
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
                                {currentStep === 3 ? 'Continue' : 'Proceed to Pay'}
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

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronLeft } from 'lucide-react';
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
    description: 'Focused session to address specific challenges and develop targeted strategies for success.',
    color: 'text-purple-400',
  },
  {
    id: 3,
    title: '60-Min Deep',
    duration: '60 minutes',
    price: '5 BNB',
    description: 'Comprehensive consultation to analyze complex issues and create detailed action plans.',
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
const AnalystCard: React.FC<AnalystCardProps> = ({ analyst, isSelected, onSelect, onAdvance }) => {
    const handleClick = () => {
        onSelect(analyst.id);
        // Auto-advance to next step after selection
        setTimeout(() => {
            onAdvance();
        }, 100);
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer relative overflow-hidden group transition-all duration-300"
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                gap: '16px',
                width: '196.75px',
                height: '176px',
                background: '#1F1F1F',
                borderRadius: '16px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 1,
                position: 'relative'
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
            
            {/* Gradient Overlay for Selected Card */}
            {isSelected && (
                <div 
                    className="absolute inset-0 opacity-80"
                    style={{
                        backgroundImage: 'url("/gradient/Ellipse 2.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        borderRadius: '16px'
                    }}
                />
            )}
            
            {/* Content with relative positioning to appear above gradient */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Large Circular Image */}
                <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img 
                                src={analyst.image} 
                                alt={analyst.name}
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
                <h3 className="text-sm font-bold text-white mb-2">{analyst.name}</h3>
                
                {/* Role - Use dynamic role from MongoDB */}
                <p className="text-gray-400 text-sm leading-tight line-clamp-2">
                    {analyst.description}
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
            className="cursor-pointer relative overflow-hidden group transition-all duration-300 hover:border-gray-500"
            style={{
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                gap: '16px',
                width: '100%',
                background: '#1F1F1F',
                borderRadius: '16px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 1,
                position: 'relative'
            }}
        >
            {/* Gradient Overlay for Selected Card */}
            {isSelected && (
                <div 
                    className="absolute inset-0 rounded-2xl opacity-80 pointer-events-none"
                    style={{
                        backgroundImage: 'url("/gradient/Ellipse 2.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        zIndex: 5
                    }}
                />
            )}
            
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
            
            {/* Content with relative positioning to appear above gradient */}
            <div className="relative z-20 flex flex-col items-start text-left w-full">
                <div className="flex justify-between items-start mb-1 w-full">
                    <h3 className="text-xl font-bold text-white">{meeting.title}</h3>
                    <div className="relative overflow-hidden rounded-full">
                        {/* Enhanced Shiny Glint Effect - Top Right Corner */}
                        <div 
                            className="absolute top-0 right-0 opacity-60"
                            style={{
                                width: '12px',
                                height: '12px',
                                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 30%, transparent 70%)',
                                borderRadius: '6px 6px 0 0'
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
                            className="absolute top-0 right-0 w-0.5 opacity-70"
                            style={{
                                height: '16px',
                                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                                borderRadius: '0 6px 0 0'
                            }}
                        ></div>
                        
                        <span className="relative z-10 bg-[#1F1F1F] text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600/50 group-hover:border-gray-500/70 transition-colors duration-300">{meeting.price}</span>
                </div>
                </div>
                <div className="mb-2">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full bg-[#1F1F1F] border ${
                        meeting.id === 2 ? 'text-purple-300 border-purple-300/50' :
                        'text-yellow-300 border-yellow-300/50'
                    }`}>
                        {meeting.duration}
                    </span>
                </div>
                <p className="text-gray-400 text-sm leading-tight line-clamp-3">{meeting.description}</p>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const MeetingsPage: React.FC = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [selectedAnalyst, setSelectedAnalyst] = useState<number | null>(null); // No default selection
    const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null); // No default selection
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [analystAbout, setAnalystAbout] = useState<string>('');
    const [isLoadingAbout, setIsLoadingAbout] = useState<boolean>(false);
    const [isTimezoneOpen, setIsTimezoneOpen] = useState<boolean>(false);
    const [teamData, setTeamData] = useState<any[]>([]);
    const [analysts, setAnalysts] = useState<Analyst[]>([]);
    const [isTeamDataLoaded, setIsTeamDataLoaded] = useState<boolean>(false);

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
                setAnalystAbout(data.about || 'No additional information available.');
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
            // Fallback to base analysts if API fails
            setAnalysts(baseAnalysts);
            setIsTeamDataLoaded(true);
        }
    };

    // Function to update analysts array with team data
    const updateAnalystsWithTeamData = (team: any[]) => {
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

    const [hoveredTimezone, setHoveredTimezone] = useState<string>('');
    const [timezoneSearch, setTimezoneSearch] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    // Fetch team data on component mount
    useEffect(() => {
        fetchTeamData();
    }, []);

    // Fetch analyst about data when analyst is selected
    useEffect(() => {
        if (selectedAnalyst !== null) {
            const analystName = analysts.find(a => a.id === selectedAnalyst)?.name;
            if (analystName) {
                fetchAnalystAbout(analystName);
            }
        }
    }, [selectedAnalyst]);
    // const router = useRouter(); // Removed to prevent compilation error

    const isContinueDisabled = currentStep === 2 ? (selectedMeeting === null || !selectedTimezone || !selectedDate || !selectedTime) : 
                               currentStep === 3 ? (!fullName || !email) : false;

    const handleContinue = () => {
        if (!isContinueDisabled) {
            if (currentStep === 2) {
                setCurrentStep(3);
            } else {
                // Complete booking - redirect to success page with data
                const selectedTimezoneData = allTimezones.find(tz => tz.value === selectedTimezone);
                
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
    };

    const handleTimezoneInputFocus = () => {
        setIsTimezoneOpen(true);
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
        return date.toISOString().split('T')[0];
    };

    const isDateAvailable = (date: Date) => {
        // For now, make all future dates available for testing
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    };

    const isDateSelected = (date: Date) => {
        return selectedDate === formatDate(date);
    };

    const handleDateSelect = (date: Date) => {
        if (isDateAvailable(date)) {
            setSelectedDate(formatDate(date));
        }
    };

    // Available time slots
    const timeSlots = [
        '9:00 AM', '10:00 AM', '11:30 AM', '12:30 PM', 
        '1:30 PM', '2:00 PM', '2:30 PM', '5:30 PM'
    ];

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    // Helper functions for booking summary
    const getSelectedMeetingData = () => {
        return meetings.find(meeting => meeting.id === selectedMeeting);
    };

    const getSelectedTimezoneLabel = () => {
        const timezone = allTimezones.find(tz => tz.value === selectedTimezone);
        return timezone ? timezone.label : 'Unknown Timezone';
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
        <div className="bg-[#0D0D0D] min-h-screen text-white font-sans relative">
            {/* Lower Corner Gradients - Hidden on step 2 (booking section) */}
            {currentStep !== 2 && (
                <>
            <div 
                className="fixed bottom-0 left-0 w-[500px] h-[500px] pointer-events-none opacity-100"
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
            <div 
                className="fixed bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-100"
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

            {/* Mid Left Gradient - Only visible on step 2 (booking section) */}
            {currentStep === 2 && (
                <div 
                    className="absolute pointer-events-none opacity-100"
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
            
            {/* Navigation Header */}
            <Navbar variant="hero" />

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

                {/* Right Side: Booking Form */}
                <div className="w-full lg:col-span-2">
                    {/* Back Button */}
                    <div className="mb-1 mt-16 -ml-4">
                        <button onClick={handleBack} className="flex items-center text-white hover:text-gray-300 transition-colors">
                        <ChevronLeft size={20} className="mr-1" />
                        Back
                    </button>
                    </div>

                    {/* Selected Analyst Display */}
                    {selectedAnalyst !== null && currentStep === 2 && (
                        <div className="mb-6 mt-8 -ml-4">
                            <div className="flex flex-col lg:flex-row gap-6 justify-center items-start">
                                {/* Analyst Profile Tile */}
                                <div
                                    className="relative overflow-hidden group transition-all duration-300"
                                    style={{
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: '16px',
                                        gap: '8px',
                                        width: '196.75px',
                                        height: '220px',
                                        background: '#1F1F1F',
                                        borderRadius: '16px',
                                        flex: 'none',
                                        order: 0,
                                        alignSelf: 'flex-start',
                                        flexGrow: 0,
                                        position: 'relative'
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

                                    {/* Profile Image */}
                                    <div 
                                        className="rounded-full overflow-hidden relative z-10"
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            borderRadius: '50%'
                                        }}
                                    >
                                        <img
                                            src={analysts.find(a => a.id === selectedAnalyst)?.image || '/team dark/Adnan.png'}
                                            alt={analysts.find(a => a.id === selectedAnalyst)?.name || 'Analyst'}
                                            className="w-full h-full object-cover filter grayscale"
                                        />
                            </div>

                                    {/* Name */}
                                    <h3 
                                        className="text-white text-center relative z-10"
                                        style={{
                                            width: '164.75px',
                                            height: '18px',
                                            fontSize: '18px',
                                            lineHeight: '100%',
                                            fontWeight: '400',
                                            fontFamily: 'Gilroy-SemiBold'
                                        }}
                                    >
                                        {analysts.find(a => a.id === selectedAnalyst)?.name || 'Analyst'}
                                    </h3>

                                    {/* Role Display for Reviews Section */}
                                    <p 
                                        className="text-gray-400 text-center relative z-10"
                                        style={{
                                            width: '164.75px',
                                            minHeight: '16px',
                                            fontSize: '14px',
                                            lineHeight: '130%',
                                            fontWeight: '400',
                                            fontFamily: 'Gilroy-Medium'
                                        }}
                                    >
                                        {analysts.find(a => a.id === selectedAnalyst)?.description}
                                    </p>

                                    {/* Rating Stars */}
                                    <div 
                                        className="flex flex-row items-center justify-center relative z-10"
                                        style={{
                                            width: '164.75px',
                                            height: '14px',
                                            gap: '4px'
                                        }}
                                    >
                                        {/* Star */}
                                        <div 
                                            className="flex items-center justify-center"
                                            style={{
                                                width: '12px',
                                                height: '12px',
                                                flex: 'none',
                                                order: 0,
                                                flexGrow: 0
                                            }}
                                        >
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M6 0L7.5 4.5L12 4.5L8.25 7.5L9.75 12L6 9L2.25 12L3.75 7.5L0 4.5L4.5 4.5L6 0Z" fill="#DE50EC"/>
                                            </svg>
                            </div>
                                        
                                        {/* Rating Text */}
                                        <span 
                                            className="text-gray-400"
                                            style={{
                                                fontSize: '14px',
                                                lineHeight: '100%',
                                                fontWeight: '400',
                                                fontFamily: 'Gilroy-Medium'
                                            }}
                                        >
                                            4.9
                                        </span>
                                        
                                        {/* Reviews Count */}
                                        <span 
                                            className="text-gray-400"
                                            style={{
                                                fontSize: '14px',
                                                lineHeight: '100%',
                                                fontWeight: '400',
                                                fontFamily: 'Gilroy-Medium'
                                            }}
                                        >
                                            (21 reviews)
                                        </span>
                        </div>

                                    {/* View All Reviews Button */}
                                    <button 
                                        onClick={() => router.push(`/reviews?analyst=${selectedAnalyst}`)}
                                        className="flex flex-row justify-center items-center relative z-10"
                                        style={{
                                            width: '164.75px',
                                            height: '24px',
                                            background: '#FFFFFF',
                                            borderRadius: '40px',
                                            padding: '10px',
                                            gap: '10px'
                                        }}
                                    >
                                        <span 
                                            style={{
                                                width: '89px',
                                                height: '12px',
                                                fontSize: '12px',
                                                lineHeight: '100%',
                                                fontWeight: '400',
                                                fontFamily: 'Gilroy-Medium',
                                                color: '#1F1F1F'
                                            }}
                                        >
                                            View All Reviews
                                        </span>
                                    </button>
                                </div>

                                {/* About Tile */}
                                <div
                                    className="relative overflow-hidden group transition-all duration-300"
                                    style={{
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        padding: '16px',
                                        gap: '16px',
                                        isolation: 'isolate',
                                        width: '630.25px',
                                        height: '220px',
                                        background: '#1F1F1F',
                                        borderRadius: '16px',
                                        flex: 'none',
                                        order: 1,
                                        alignSelf: 'stretch',
                                        flexGrow: 1,
                                        position: 'relative'
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
                                    <div className="relative z-10 w-full h-full">
                                        <h3 className="text-white text-lg font-semibold mb-3">About</h3>
                                        {isLoadingAbout ? (
                                            <div className="flex items-center justify-center py-8">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                {analystAbout || 'No additional information available.'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-8 mt-8 -ml-4">
                        <h1 className="text-4xl font-bold">Book Mentorship</h1>
                    </div>

                    {/* Step 1: Analyst Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6 -ml-4">
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">Select Your Analyst</h2>
                                <p className="text-gray-400">Choose the expert who best matches your needs and investment goals</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {!isTeamDataLoaded ? (
                                    // Loading skeleton
                                    Array.from({ length: 8 }, (_, index) => (
                                        <div
                                            key={index}
                                            className="relative overflow-hidden group transition-all duration-300"
                                            style={{
                                                boxSizing: 'border-box',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                padding: '16px',
                                                gap: '16px',
                                                width: '196.75px',
                                                height: '176px',
                                                background: '#1F1F1F',
                                                borderRadius: '16px',
                                                flex: 'none',
                                                order: 0,
                                                alignSelf: 'stretch',
                                                flexGrow: 1,
                                                position: 'relative'
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
                                            
                                            {/* Loading content */}
                                            <div className="relative z-10 flex flex-col items-center text-center">
                                                <div className="w-20 h-20 rounded-full bg-gray-700 animate-pulse"></div>
                                                <div className="w-16 h-4 bg-gray-700 rounded animate-pulse mt-2"></div>
                                                <div className="w-24 h-3 bg-gray-700 rounded animate-pulse mt-1"></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    analysts.map((analyst) => (
                                        <AnalystCard
                                            key={analyst.id}
                                            analyst={analyst}
                                            isSelected={selectedAnalyst === analyst.id}
                                            onSelect={setSelectedAnalyst}
                                            onAdvance={() => setCurrentStep(2)}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Meeting Selection, Timezone, Date & Time */}
                    {currentStep === 2 && (
                        <div className="space-y-8">
                            {/* Meeting Selection */}
                    <div className="space-y-6 -ml-4">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Select Meeting</h2>
                            <p className="text-gray-400">Choose the session that best fits your needs</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {meetings.map((meeting) => (
                                <MeetingCard
                                    key={meeting.id}
                                    meeting={meeting}
                                    isSelected={selectedMeeting === meeting.id}
                                    onSelect={setSelectedMeeting}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Timezone Selection */}
                            <div className="-ml-4">
                        <h2 className="text-2xl font-semibold mb-2">Select Time Zone</h2>
                        <div className="relative max-w-md">
                            {/* Search Input */}
                            <div className="relative">
                                        <div 
                                            className="relative"
                                            style={{
                                                width: '414px',
                                                height: '41px',
                                                background: '#0A0A0A',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                gap: '10px',
                                                boxSizing: 'border-box',
                                                position: 'relative'
                                            }}
                                        >
                                            {/* Curved Gradient Border */}
                                            <div 
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    borderRadius: '8px',
                                                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                                                    padding: '1px'
                                                }}
                                            >
                                                <div 
                                                    className="w-full h-full rounded-[7px]"
                                                    style={{
                                                        background: '#0A0A0A'
                                                    }}
                                                ></div>
                                            </div>

                                <input
                                    type="text"
                                            value={timezoneSearch || (selectedTimezone ? getTimezoneDisplayLabel() : '')}
                                    onChange={(e) => handleTimezoneSearch(e.target.value)}
                                    onFocus={handleTimezoneInputFocus}
                                                placeholder="Select Timezone"
                                                className="w-full text-white placeholder-white focus:outline-none transition-colors relative z-10"
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    padding: '12px 16px',
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: '8px'
                                                }}
                                />
                                <button
                                    onClick={() => setIsTimezoneOpen(!isTimezoneOpen)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 z-10"
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
                                className={`absolute z-50 mt-1 bg-black border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto transition-all duration-300 ease-in-out ${
                                    isTimezoneOpen 
                                        ? 'opacity-100 translate-y-0 pointer-events-auto' 
                                        : 'opacity-0 -translate-y-2 pointer-events-none'
                                }`}
                                style={{ width: '414px' }}
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
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex justify-between items-center ${
                                                        selectedTimezone === tz.value
                                                            ? 'bg-purple-600 text-white'
                                                            : hoveredTimezone === tz.value
                                                            ? 'bg-purple-500 text-white'
                                                                    : 'bg-black text-white hover:bg-gray-800'
                                                    }`}
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
                                                        className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex justify-between items-center ${
                                                            selectedTimezone === tz.value
                                                                ? 'bg-purple-600 text-white'
                                                                : hoveredTimezone === tz.value
                                                                ? 'bg-purple-500 text-white'
                                                                        : 'bg-black text-white hover:bg-gray-800'
                                                        }`}
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
                        <div className="space-y-6 -ml-4">
                            <div className="flex gap-8 items-start">
                                {/* Left side - Calendar with header */}
                                <div className="flex-[1.2]">
                                    <div>
                                        <h2 className="text-2xl font-semibold mb-2">Pick a Date & Time</h2>
                                        <p className="text-gray-400">Select when you would like to schedule your meeting</p>
                                    </div>
                                    
                                        <div 
                                            className="bg-[#1F1F1F] rounded-xl mt-6 relative overflow-hidden"
                                            style={{
                                                width: '412px',
                                                height: '284px',
                                                padding: '16px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'flex-start',
                                                gap: '10px',
                                                position: 'relative'
                                            }}
                                        >
                                            {/* Curved Gradient Border */}
                                            <div 
                                                className="absolute inset-0 pointer-events-none"
                                                style={{
                                                    borderRadius: '12px',
                                                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                                                    padding: '1px'
                                                }}
                                            >
                                                <div 
                                                    className="w-full h-full rounded-[11px]"
                                                    style={{
                                                        background: '#1F1F1F'
                                                    }}
                                                ></div>
                                            </div>

                                            {/* Calendar Content Container */}
                                            <div 
                                                className="relative z-10 w-full"
                                                style={{
                                                    width: '380px',
                                                    height: '252px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '16px'
                                                }}
                                            >
                                        {/* Calendar Header */}
                                                <div 
                                                    className="flex items-center justify-between"
                                                    style={{
                                                        width: '380px',
                                                        height: '15.56px',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        gap: '24px'
                                                    }}
                                                >
                                                    <h3 
                                                        className="text-white font-medium"
                                                        style={{
                                                            width: '118px',
                                                            height: '14px',
                                                            fontSize: '14px',
                                                            lineHeight: '100%'
                                                        }}
                                                    >
                                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                                    </h3>
                                                    <div className="flex gap-2">
                                            <button
                                                onClick={() => navigateMonth('prev')}
                                                            className="text-white hover:text-gray-300 transition-colors"
                                                            style={{ width: '16px', height: '16px' }}
                                            >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => navigateMonth('next')}
                                                            className="text-white hover:text-gray-300 transition-colors"
                                                            style={{ width: '16px', height: '16px' }}
                                            >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                                    </div>
                                        </div>

                                                {/* Calendar Grid */}
                                                <div 
                                                    className="grid grid-cols-7 gap-1"
                                                    style={{
                                                        width: '376.77px',
                                                        height: '213.1px',
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'flex-start',
                                                        gap: '20px'
                                                    }}
                                                >
                                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, dayIndex) => (
                                                        <div 
                                                            key={day} 
                                                            className="flex flex-col items-center"
                                                            style={{
                                                                width: dayIndex === 0 ? '35.76px' : dayIndex === 1 ? '40.59px' : dayIndex === 2 ? '38.35px' : dayIndex === 3 ? '33.64px' : dayIndex === 4 ? '32px' : dayIndex === 5 ? '34.3px' : '32px',
                                                                height: '219.16px',
                                                                gap: '16px'
                                                            }}
                                                        >
                                                            {/* Day Header */}
                                                            <div 
                                                                className="text-center font-medium text-gray-400"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '11.16px',
                                                                    fontSize: '14px',
                                                                    lineHeight: '100%',
                                                                    color: '#909090'
                                                                }}
                                                            >
                                                    {day}
                                        </div>

                                                            {/* Date Column */}
                                                            <div 
                                                                className="flex flex-col items-center"
                                                                style={{
                                                                    width: '100%',
                                                                    height: '192px',
                                                                    gap: '8px'
                                                                }}
                                                            >
                                                                {getDaysInMonth(currentMonth).filter((_, index) => index % 7 === dayIndex).map((day, weekIndex) => (
                                                        <button
                                                                        key={weekIndex}
                                                                        onClick={() => day && handleDateSelect(day)}
                                                                        disabled={!day || !isDateAvailable(day)}
                                                            className={`
                                                                            flex items-center justify-center transition-all duration-200
                                                                            ${day && isDateSelected(day)
                                                                                ? 'bg-white text-black'
                                                                                : day && isDateAvailable(day)
                                                                                ? 'bg-[#404040] text-white hover:bg-gray-500 cursor-pointer'
                                                                                : 'text-[#909090] cursor-not-allowed'
                                                                            }
                                                                        `}
                                                                        style={{
                                                                            width: '32px',
                                                                            height: '32px',
                                                                            borderRadius: '8px',
                                                                            fontSize: '14px',
                                                                            lineHeight: '100%',
                                                                            fontFamily: 'Gilroy-Medium',
                                                                            fontWeight: '400'
                                                                        }}
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
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white mb-2">Available Time Slots</h3>
                                    
                                        <div className="grid grid-cols-4 gap-2 mb-4">
                                        {timeSlots.map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`
                                                        py-2 px-2 rounded-lg text-xs font-medium transition-all duration-200 w-20
                                                    ${selectedTime === time
                                                        ? 'bg-white text-black border-2 border-white'
                                                            : 'bg-[#0D0D0D] text-white hover:bg-gray-800 border border-white'
                                                    }
                                                `}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                        </div>
                                        <p className="text-sm text-gray-400">Times shown in Berlin, Germany</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Pay & Confirm */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex gap-8 items-start -ml-4">
                                {/* Left side - Payment Form */}
                                <div className="flex-[1.2]">
                                    <div className="-mt-4">
                                        <h2 className="text-xl font-semibold mb-2">Pay & Confirm</h2>
                                        <p className="text-gray-400 text-sm">Complete your booking by providing your details and payment</p>
                                    </div>
                                    
                                    {/* Your Information */}
                                    <div className="mt-4 space-y-4">
                                        <h3 className="text-base font-semibold text-white">Your Information</h3>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    placeholder="Enter Name"
                                                    className="w-full bg-black border-2 border-gray-500 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors text-sm"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="abc@example.com"
                                                    className="w-full bg-black border-2 border-gray-500 rounded-lg py-2 px-3 text-white focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors text-sm"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Optional)</label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Let us know if you want to discuss specific topics..."
                                                rows={4}
                                                className="w-full bg-black border-2 border-gray-500 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-gray-400 hover:border-gray-400 transition-colors resize-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="mt-6">
                                        <h3 className="text-base font-semibold text-white">Payment Details</h3>
                                        <img src="/logo/Binance.svg" alt="Binance" className="w-32 h-32 -mt-8" />
                                        <p className="text-xs text-gray-400 leading-relaxed -mt-8">
                                            By completing this booking, you agree to our Terms of Service and Privacy Policy. All services are provided for informational purposes only. Results may vary.
                                        </p>
                                    </div>
                                </div>

                                {/* Right side - Booking Summary */}
                                <div className="w-80">
                                    <div className="bg-[#1F1F1F] border border-gray-600/50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-white mb-4">Booking Summary</h3>
                                        
                                        {/* Meeting Type - Moved to top */}
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-bold text-white">{getSelectedMeetingData()?.title}</h4>
                                                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                                    selectedMeeting === 1 ? 'bg-teal-400/20 text-teal-300' :
                                                    selectedMeeting === 2 ? 'bg-purple-400/20 text-purple-300' :
                                                    'bg-yellow-400/20 text-yellow-300'
                                                }`}>
                                                    {getSelectedMeetingData()?.duration}
                                                </span>
                                        </div>
                                        
                                        {/* Separation Line */}
                                        <div 
                                            className="mb-4 mx-auto"
                                            style={{
                                                width: '250px',
                                                height: '0px',
                                                border: '1px solid #404040',
                                                flex: 'none',
                                                order: 1,
                                                alignSelf: 'stretch',
                                                flexGrow: 0
                                            }}
                                        ></div>
                                        
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
                                                <div 
                                                    className="mb-2 mx-auto"
                                                    style={{
                                                        width: '2,50px',
                                                        height: '0px',
                                                        border: '1px solid #404040',
                                                        flex: 'none',
                                                        order: 1,
                                                        alignSelf: 'stretch',
                                                        flexGrow: 0
                                                    }}
                                                ></div>
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
                    <div className="mt-12 flex justify-end gap-4">
                            {(currentStep === 2 || currentStep === 3) && (
                            <button
                                onClick={handleBack}
                                className="px-10 py-3 rounded-3xl font-semibold transition-all duration-300 bg-black text-white hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
                            >
                                Back
                            </button>
                        )}
                        <button
                            onClick={handleContinue}
                            disabled={isContinueDisabled}
                            className={`px-10 py-3 rounded-3xl font-semibold transition-all duration-300
                            ${isContinueDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                                {currentStep === 3 ? 'Complete Booking' : 'Proceed to Pay'}
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

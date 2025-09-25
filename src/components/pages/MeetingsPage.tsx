'use client';

import { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Removed to prevent compilation error
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

// --- COMPONENT PROPS ---
interface MeetingCardProps {
  meeting: Meeting;
  isSelected: boolean;
  onSelect: (id: number) => void;
}

interface Timezone {
    value: string;
    label: string;
}

// --- MOCK DATA ---
const meetings: Meeting[] = [
  {
    id: 1,
    title: '15-Min Intro',
    duration: '15 minutes',
    price: '1 BNB',
    description: 'Quick introduction to discuss your needs and see if we\'re a good fit for your goals.',
    color: 'text-teal-400',
  },
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

// A simple Circle icon for the progress steps
const CircleStep = ({ step, isActive }: { step: number; isActive: boolean }) => (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${isActive ? 'bg-blue-500 border-blue-500 text-white' : 'bg-[#0D0D0D] border-gray-600 text-gray-400'}`}>
        {step}
    </div>
);

// A line segment to connect the circles with proper spacing
const Line = ({ isActive }: { isActive: boolean }) => (
    <div className={`flex-1 h-0.5 mx-2 ${isActive ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
);


// Reusable Meeting Card Component
const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, isSelected, onSelect }) => {
    return (
        <div
            onClick={() => onSelect(meeting.id)}
            className={`cursor-pointer bg-gray-800/50 p-5 rounded-2xl border-2 transition-all duration-300 w-full relative overflow-hidden group
                ${isSelected ? 'border-purple-500 bg-gray-700/80' : 'border-gray-700 hover:border-gray-500'}`}
        >
            {/* Gradient Overlay for Selected Card */}
            {isSelected && (
                <div 
                    className="absolute inset-0 rounded-2xl opacity-80"
                    style={{
                        backgroundImage: 'url("/gradient/Ellipse 2.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
            )}
            
            {/* Glint Effect */}
            <div className="absolute inset-0 -top-1 -left-1 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            {/* Content with relative positioning to appear above gradient */}
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{meeting.title}</h3>
                    <span className="bg-gray-900/70 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">{meeting.price}</span>
                </div>
                <div className="mb-3">
                    <span className={`inline-block px-3 py-1 text-xs rounded-full bg-opacity-20 ${
                        meeting.id === 1 ? 'bg-teal-400/20 text-teal-300' :
                        meeting.id === 2 ? 'bg-purple-400/20 text-purple-300' :
                        'bg-yellow-400/20 text-yellow-300'
                    }`}>
                        {meeting.duration}
                    </span>
                </div>
                <p className="text-gray-400 text-sm leading-tight line-clamp-2">{meeting.description}</p>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const MeetingsPage: React.FC = () => {
    const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null); // No default selection
    const [selectedTimezone, setSelectedTimezone] = useState<string>('');
    const [isTimezoneOpen, setIsTimezoneOpen] = useState<boolean>(false);
    const [hoveredTimezone, setHoveredTimezone] = useState<string>('');
    const [timezoneSearch, setTimezoneSearch] = useState<string>('');
    // const router = useRouter(); // Removed to prevent compilation error

    const isContinueDisabled = !selectedMeeting || !selectedTimezone;

    const handleContinue = () => {
        if (!isContinueDisabled) {
            // Navigate to the next step using standard web APIs
            window.location.href = '/book-meeting/date-time';
        }
    };

    const handleBack = () => {
        // Navigate to the landing page using standard web APIs
        window.location.href = '/';
    };

    const handleTimezoneSelect = (timezone: string) => {
        setSelectedTimezone(timezone);
        setIsTimezoneOpen(false);
        setHoveredTimezone('');
        setTimezoneSearch('');
    };

    const getSelectedTimezoneLabel = () => {
        const timezone = allTimezones.find(tz => tz.value === selectedTimezone);
        return timezone ? timezone.label : 'Select Timezone';
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

    return (
        <div className="bg-[#0D0D0D] min-h-screen text-white font-sans relative">
            {/* Lower Corner Gradients */}
            <div 
                className="fixed bottom-0 left-0 w-96 h-96 pointer-events-none opacity-100"
                style={{
                    backgroundImage: 'url("/gradient/Ellipse 4.svg")',
                    backgroundSize: '250%',
                    backgroundPosition: 'bottom left',
                    backgroundRepeat: 'no-repeat',
                    transform: 'rotate(0deg) translate(-40px, 260px)',
                    transformOrigin: 'bottom left',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
                    filter: 'brightness(1.3) contrast(1.2) blur(10px)',
                    WebkitFilter: 'brightness(1.3) contrast(1.2) blur(10px)'
                }}
            ></div>
            <div 
                className="fixed bottom-0 right-0 w-96 h-96 pointer-events-none opacity-100"
                style={{
                    backgroundImage: 'url("/gradient/Ellipse 4.svg")',
                    backgroundSize: '250%',
                    backgroundPosition: 'bottom right',
                    backgroundRepeat: 'no-repeat',
                    transform: 'rotate(-45deg) translate(350px, 150px)',
                    transformOrigin: 'bottom right',
                    borderRadius: '50%',
                    maskImage: 'radial-gradient(circle at center, black 10%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
                    filter: 'brightness(1.3) contrast(1.2) blur(7px)',
                    WebkitFilter: 'brightness(1.3) contrast(1.2) blur(7px)'
                }}
            ></div>
            
            {/* Navigation Header */}
            <Navbar variant="hero" />

            <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
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
                                        backgroundImage: 'url("/rectangle 1/0a1b3220b634dbcbf74285bbbef61b759ccc34ab.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/0a1b3220b634dbcbf74285bbbef61b759ccc34ab.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/57e0ff4971c44d340158dd76e84f4e1677eacc77.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/cc997f059c3f8ef1a60e530cd062817abadc1f9a.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-auto mr-1"
                                    style={{
                                        backgroundImage: 'url("/rectangle 1/ff58303fb8ee3c463d0e11521f0df2d4414b9022.jpg")',
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
                                        backgroundImage: 'url("/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/4b9330666fbce22736fe4a8911e962c0d7b01e58.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/8c32b6a7d2dc3f1c6145f0d8ce2f4cbf7624bdb9.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                {/* Duplicate for seamless loop */}
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/35d259aa3566f583840eee2ac6b1184268dff7ec.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/4b9330666fbce22736fe4a8911e962c0d7b01e58.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/8c32b6a7d2dc3f1c6145f0d8ce2f4cbf7624bdb9.jpg")',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                ></div>
                                <div
                                    className="aspect-[1/2.2] w-28 rounded-full bg-zinc-800 ml-1 mr-auto"
                                    style={{
                                        backgroundImage: 'url("/rectangle 2/e98d95025c673e0467f8be4c1a95fe9b294c4d26.jpg")',
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
                    <button onClick={handleBack} className="flex items-center text-gray-400 hover:text-white transition-colors mb-6">
                        <ChevronLeft size={20} className="mr-1" />
                        Back
                    </button>

                    {/* Title and Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-4xl font-bold">Book a Meeting</h1>
                        
                        {/* Progress Indicator - Scaled Down */}
                        <div className="w-64">
                            <div className="flex items-center">
                                <CircleStep step={1} isActive={true} />
                                <Line isActive={true} />
                                <CircleStep step={2} isActive={false} />
                                <Line isActive={false} />
                                <CircleStep step={3} isActive={false} />
                            </div>
                            <div className="flex justify-between mt-1">
                                <p className="text-xs text-white w-1/3 text-left">Select Meeting</p>
                                <p className="text-xs text-gray-400 w-1/3 text-center">Pick Date & Time</p>
                                <p className="text-xs text-gray-400 w-1/3 text-right">Pay & Confirm</p>
                            </div>
                        </div>
                    </div>

                    {/* Meeting Selection */}
                    <div className="space-y-6">
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
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-2">Select Time Zone</h2>
                        <div className="relative max-w-md">
                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={timezoneSearch || (selectedTimezone ? getSelectedTimezoneLabel() : '')}
                                    onChange={(e) => handleTimezoneSearch(e.target.value)}
                                    onFocus={handleTimezoneInputFocus}
                                    placeholder="Search timezone..."
                                    className="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg py-3 px-4 pr-10 text-white focus:outline-none focus:border-purple-500 hover:border-purple-400 transition-colors"
                                />
                                <ChevronDown 
                                    size={20} 
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isTimezoneOpen ? 'rotate-180' : ''}`}
                                />
                            </div>

                            {/* Custom Dropdown Options */}
                            {isTimezoneOpen && (
                                <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-80 overflow-y-auto">
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
                                                            : 'bg-gray-800 text-white hover:bg-gray-700'
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
                                                <div className="px-4 py-2 text-xs font-semibold text-gray-300 bg-gray-700/50 border-b border-gray-600">
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
                                                                : 'bg-gray-800 text-white hover:bg-gray-700'
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
                            )}

                            {/* Backdrop to close dropdown */}
                            {isTimezoneOpen && (
                                <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => {
                                        setIsTimezoneOpen(false);
                                        setTimezoneSearch('');
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Continue Button */}
                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={handleContinue}
                            disabled={isContinueDisabled}
                            className={`px-10 py-3 rounded-3xl font-semibold transition-all duration-300
                            ${isContinueDisabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            Continue
                        </button>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default MeetingsPage;

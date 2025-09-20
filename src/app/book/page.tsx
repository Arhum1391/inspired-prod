'use client';

import { useState, useEffect } from 'react';
import NewsletterSubscription from '@/components/NewsletterSubscription';

// Meeting types configuration - matches your existing Calendly events
const meetingTypes = [
  {
    id: 'initial-consultation',
    name: 'Initial Consultation',
    duration: 30,
    price: 50,
    description: 'Quick overview and needs assessment',
    color: 'blue'
  },
  {
    id: 'initial-consultation-1',
    name: 'Extended Initial Consultation',
    duration: 45,
    price: 75,
    description: 'Extended consultation with detailed analysis',
    color: 'blue'
  },
  {
    id: 'strategy-workshop',
    name: 'Strategy Workshop',
    duration: 90,
    price: 150,
    description: 'Intensive planning and implementation workshop',
    color: 'purple'
  },
  {
    id: 'follow-up-session',
    name: 'Follow-up Session',
    duration: 45,
    price: 75,
    description: 'Progress review and next steps',
    color: 'orange'
  }
];

export default function BookingPage() {
  const [selectedMeetingType, setSelectedMeetingType] = useState(meetingTypes[0]);
  const [calendlyUrl, setCalendlyUrl] = useState('');

  // Generate Calendly URL based on selected meeting type
  useEffect(() => {
    const baseUrl = 'https://calendly.com/maxpace94';
    const eventType = selectedMeetingType.id;
    setCalendlyUrl(`${baseUrl}/${eventType}`);
  }, [selectedMeetingType]);

  // Load Calendly widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleMeetingTypeChange = (meetingType: typeof meetingTypes[0]) => {
    setSelectedMeetingType(meetingType);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Book Your Meeting
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Select your preferred meeting type and schedule a time that works for you
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Compact Meeting Type Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Choose Meeting Type
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {meetingTypes.map((meeting) => (
                <div
                  key={meeting.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedMeetingType.id === meeting.id
                      ? `border-${meeting.color}-500 bg-${meeting.color}-50 dark:bg-${meeting.color}-900/20`
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleMeetingTypeChange(meeting)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {meeting.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium bg-${meeting.color}-100 text-${meeting.color}-800 dark:bg-${meeting.color}-900/50 dark:text-${meeting.color}-200`}>
                      {meeting.duration}m
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {meeting.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${meeting.price}
                    </span>
                    {selectedMeetingType.id === meeting.id && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendly Widget - Takes up most of the space */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Select Your Time
              </h2>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedMeetingType.name} • {selectedMeetingType.duration} minutes • ${selectedMeetingType.price}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Calendly Inline Widget - Much larger */}
              <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '800px' }}>
                {calendlyUrl && (
                  <iframe
                    src={calendlyUrl}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Calendly Scheduling Widget"
                  />
                )}
              </div>
            </div>

            {/* Compact Payment Notice */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Payment will be required to confirm your booking after selecting a time slot.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-12">
            <NewsletterSubscription />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  // Random data for demonstration
  const randomData = {
    name: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Brown'][Math.floor(Math.random() * 5)],
    email: ['john@example.com', 'sarah@example.com', 'mike@example.com', 'emma@example.com', 'david@example.com'][Math.floor(Math.random() * 5)],
    plan: ['Premium Monthly', 'Premium Annual'][Math.floor(Math.random() * 2)],
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
  };

  const handleToggle = () => {
    console.log('Toggle clicked, current state:', isOpen);
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    // Navigate to profile page or account settings
    router.push('/account');
    setIsOpen(false);
  };

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={handleToggle}
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
        style={{
          background: 'linear-gradient(135deg, #DE50EC 0%, #667EEA 100%)'
        }}
      >
        <span className="text-white font-semibold text-sm">
          {randomData.name.charAt(0).toUpperCase()}
        </span>
      </button>

      {/* Dropdown Arrow - Next to the profile icon */}
      <button
        onClick={handleToggle}
        className="w-5 h-5 flex items-center justify-center hover:opacity-80 transition-opacity"
      >
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 top-full mt-2 bg-[#1F1F1F] rounded-3xl z-50"
          style={{
            width: '301px',
            height: '206px',
            padding: '20px',
            isolation: 'isolate'
          }}
        >

          {/* Main Content */}
          <div 
            className="flex flex-col items-center"
            style={{
              width: '261px',
              height: '166px',
              gap: '12px',
              zIndex: 0
            }}
          >
            {/* User Info Section */}
            <div 
              className="flex flex-col items-start"
              style={{
                width: '261px',
                height: '166px',
                gap: '24px'
              }}
            >
              {/* User Details Row */}
              <div 
                className="flex flex-row items-center"
                style={{
                  width: '261px',
                  height: '48px',
                  gap: '3px'
                }}
              >
            {/* User Info */}
                <div 
                  className="flex flex-col items-start"
                  style={{
                    width: '210px',
                    height: '44px',
                    gap: '2px'
                  }}
                >
                  <div 
                    className="text-white"
                    style={{
                      width: '210px',
                      height: '25px',
                      fontSize: '18px',
                      fontWeight: '400',
                      lineHeight: '140%',
                      letterSpacing: '0.01em'
                    }}
                  >
                {randomData.name}
                  </div>
                  <div 
                    className="text-[#656565]"
                    style={{
                      width: '210px',
                      height: '17px',
                      fontSize: '12px',
                      fontWeight: '400',
                      lineHeight: '140%',
                      letterSpacing: '0.01em'
                    }}
                  >
                {randomData.email}
                  </div>
                </div>

                {/* Profile Avatar */}
                <div 
                  className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #DE50EC 0%, #667EEA 100%)'
                  }}
                >
                  <span className="text-white font-semibold text-lg">
                    {randomData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
            </div>
            
            {/* Menu Items */}
              <div 
                className="flex flex-col items-start"
                style={{
                  width: '261px',
                  height: '94px'
                }}
              >
                {/* Profile Button */}
            <button
              onClick={handleProfileClick}
                  className="flex flex-row items-center hover:opacity-80 transition-opacity"
                  style={{
                    width: '261px',
                    height: '46px',
                    padding: '12px 0px',
                    gap: '12px',
                    borderRadius: '64px'
                  }}
                >
                  <div 
                    className="flex flex-row items-center"
                    style={{
                      width: '168px',
                      height: '22px',
                      gap: '12px'
                    }}
                  >
                    {/* User Icon */}
                    <div 
                      className="relative"
                      style={{
                        width: '19.25px',
                        height: '22px'
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="absolute"
                        style={{
                          left: '-10.39%',
                          right: '-14.29%',
                          top: '-4.55%',
                          bottom: '-4.55%'
                        }}
                      >
                        <path
                          d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                          fill="white"
                        />
                        <path
                          d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <span 
                      className="text-white"
                      style={{
                        width: '40px',
                        height: '20px',
                        fontSize: '14px',
                        fontWeight: '400',
                        lineHeight: '140%',
                        letterSpacing: '0.01em'
                      }}
                    >
                      Profile
                    </span>
                  </div>
            </button>
            
                {/* Sign Out Button */}
            <button
              onClick={handleLogout}
                  className="flex flex-row items-center hover:opacity-80 transition-opacity"
                  style={{
                    width: '261px',
                    height: '48px',
                    padding: '12px 0px',
                    gap: '12px',
                    borderRadius: '64px'
                  }}
                >
                  <div 
                    className="flex flex-row items-center"
                    style={{
                      width: '166px',
                      height: '24px',
                      gap: '12px'
                    }}
                  >
                    {/* Logout Icon */}
                    <div 
                      className="relative"
                      style={{
                        width: '24px',
                        height: '24px'
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="absolute"
                      >
                        <path
                          d="M17 7L7 17"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M7 7H17V17"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M17 3H21V21H17"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span 
                      className="text-white"
                      style={{
                        width: '58px',
                        height: '20px',
                        fontSize: '14px',
                        fontWeight: '400',
                        lineHeight: '140%',
                        letterSpacing: '0.01em'
                      }}
            >
              Sign Out
                    </span>
                  </div>
            </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;

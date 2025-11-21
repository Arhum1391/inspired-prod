'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import  userIcon from "../../public/icons/user.svg"
import logoutIcon from "../../public/icons/logout.svg"

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const updateViewport = () => {
      if (typeof window !== 'undefined') {
        setIsDesktop(window.innerWidth >= 1024);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

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
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    router.push('/account');
    setIsOpen(false);
  };

  useEffect(() => {
    const handleBodyScroll = () => {
      document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    };

    handleBodyScroll();
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!user) {
    return null;
  }

  const displayName = user.name || user.email.split('@')[0];
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user.email[0].toUpperCase();

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      {/* Profile Icon Button */}
      <button
        onClick={handleToggle}
        className="w-[38px] h-[38px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity overflow-hidden"
        style={{
          background: user?.image ? 'transparent' : 'linear-gradient(135deg, #DE50EC 0%, #667EEA 100%)'
        }}
      >
        {user?.image ? (
          <img 
            src={user.image} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white font-semibold text-sm">
            {initials[0]}
          </span>
        )}
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
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: 11000 }}
            onClick={() => setIsOpen(false)}
          ></div>
          <div 
            className="absolute top-full mt-2 bg-[#1F1F1F] rounded-3xl"
            style={{
              zIndex: 11001,
              width: '301px',
              height: '206px',
              padding: '20px',
              isolation: 'isolate',
              right: isDesktop ? 0 : '50%',
              left: isDesktop ? 'auto' : '50%',
              transform: isDesktop ? 'none' : 'translateX(-50%)'
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
                      {displayName}
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
                      {user.email}
                    </div>
                  </div>

                  {/* Profile Avatar */}
                  <div 
                    className="rounded-full flex items-center justify-center overflow-hidden"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: user?.image ? 'transparent' : 'linear-gradient(135deg, #DE50EC 0%, #667EEA 100%)'
                    }}
                  >
                    {user?.image ? (
                      <img 
                        src={user.image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {initials[0]}
                      </span>
                    )}
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
                      <img src={userIcon.src} />
                      {/* <div 
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
                      </div> */}
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
                      <img src={logoutIcon.src} />
                      {/* <div 
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
                      </div> */}
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
        </>
       )}
    </div>
  );
};

export default ProfileDropdown;


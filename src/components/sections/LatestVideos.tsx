'use client';

import { useState, useRef, useEffect } from 'react';

interface Video {
  episode: string;
  title: string;
  thumbnail: string;
  link: string;
}

const videos: Video[] = [
  {
    episode: 'LATEST',
    title: 'CPI Data Sparks Stagflation Fears? | 50bps Rate Cuts Ahead? | BTC Update | Ep 68 | Inspired Analyst',
    thumbnail: 'https://i.ytimg.com/vi/NCRvbqQ_lNk/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=NCRvbqQ_lNk',
  },
  {
    episode: 'LATEST',
    title: "The Next Bear Market Will Be Brutal? | Silver's Next Move towards $100? | Ep 67 | Inspired Analyst",
    thumbnail: 'https://i.ytimg.com/vi/m1b1iqjcdTE/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=m1b1iqjcdTE',
  },
  {
    episode: 'LATEST',
    title: 'XRP Holders NEED to See This | DEXRP Breakdown',
    thumbnail: 'https://i.ytimg.com/vi/MFOqAymJ4IE/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=MFOqAymJ4IE',
  },
  {
    episode: 'LATEST',
    title: "142% Return from Google Trends?! | Spotting Fan Token Hype Early | Ep 66 | Inspired Analyst",
    thumbnail: 'https://i.ytimg.com/vi/1kMJCVNE3EM/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=1kMJCVNE3EM',
  },
  {
    episode: 'LATEST',
    title: 'Inflation, Rates & BlackRock’s Moves - What’s Next for Crypto Markets? | Ep#65 | Inspired Analyst',
    thumbnail: 'https://i.ytimg.com/vi/n-H-TVejLEE/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=n-H-TVejLEE',
  },
  {
    episode: 'LATEST',
    title: 'Binance Shariah Earn: HALAL Profits Explained! | Forex and Crypto Updates | Inspired analyst | Ep 64',
    thumbnail: 'https://i.ytimg.com/vi/Lzeypsy3c1o/maxresdefault.jpg',
    link: 'https://www.youtube.com/watch?v=Lzeypsy3c1o',
  },
];

const LatestVideos = () => {
  // Duplicate videos array for seamless infinite scroll
  const duplicatedVideos = [...videos, ...videos];

  // State for drag functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for carousel elements
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Pause/resume CSS animation based on user interaction
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    if (isPaused || isDragging) {
      carousel.style.animationPlayState = 'paused';
    } else {
      carousel.style.animationPlayState = 'running';
    }
  }, [isPaused, isDragging]);

  // Delay auto-scroll start for Safari compatibility
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    // Start with animation paused
    carousel.style.animationPlayState = 'paused';
    
    // Resume after Safari finishes layout
    const timer = setTimeout(() => {
      carousel.style.animationPlayState = 'running';
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Set up proper touch event listeners with passive: false for Safari
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      setIsPaused(true);
      setIsDragging(true);
      setDragStart(e.touches[0].pageX - container.offsetLeft);
      setScrollLeft(container.scrollLeft);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Now this works because we set passive: false
      
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - dragStart) * 2;
      const newScrollLeft = scrollLeft - walk;
      container.scrollLeft = newScrollLeft;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      // Resume auto-scroll after a short delay
      setTimeout(() => {
        setIsPaused(false);
      }, 100);
    };

    // Add event listeners with passive: false for Safari compatibility
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart, scrollLeft]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsPaused(true);
    setIsDragging(true);
    setDragStart(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - dragStart) * 2;
    const newScrollLeft = scrollLeft - walk;
    containerRef.current.scrollLeft = newScrollLeft;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Resume auto-scroll after a short delay
    setTimeout(() => {
      setIsPaused(false);
    }, 100);
  };

  return (
    <div className="text-white py-20 font-gilroy">
      <div className="container mx-auto px-4">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-12"
          style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
        >
          Check Out the Weekly Crypto & Forex Podcasts with <br className="hidden sm:block"></br>Team Inspired Analyst
        </h2>

        {/* Carousel Wrapper with edge vignette effect */}
        <div className="relative rounded-3xl overflow-hidden">

          {/* Left edge fade overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-2 bg-gradient-to-r from-[#0A0A0A]/60 to-transparent z-10 pointer-events-none"></div>

          {/* Right edge fade overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-1 sm:w-2 bg-gradient-to-l from-[#0A0A0A]/60 to-transparent z-10 pointer-events-none"></div>
          {/* Carousel Content */}
          <div className="relative bg-[#0A0A0A] rounded-3xl p-2 md:p-8">
            <div
              ref={containerRef}
              className="overflow-x-auto scrollbar-hide pb-4 cursor-grab"
              style={{
                minWidth: '100%',
                cursor: isDragging ? 'grabbing' : 'grab',
                scrollBehavior: 'auto',
                touchAction: 'pan-x',
                overscrollBehaviorX: 'contain',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                WebkitOverflowScrolling: 'touch',
                WebkitTransform: 'translateZ(0)',
                transform: 'translateZ(0)',
                willChange: 'scroll-position'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                ref={carouselRef}
                className="flex gap-6 animate-video-carousel"
                style={{
                  width: 'max-content'
                }}
              >
                {duplicatedVideos.map((video, index) => {
                return (
                  <a
                    key={index}
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1C1C1E] rounded-2xl overflow-hidden group flex-shrink-0 w-80 block cursor-pointer relative"
                    onClick={(e) => {
                      if (isDragging) {
                        e.preventDefault();
                        return false;
                      }
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
                          background: '#1C1C1E'
                        }}
                      ></div>
                    </div>
                    <div className="p-2 relative z-10">
                      <div className="relative bg-gray-700" style={{ aspectRatio: '16/8' }}>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded-lg relative z-10"
                          onError={(e) => {
                            console.log('Image failed to load:', video.thumbnail);
                            const target = e.currentTarget;
                            const videoId = video.link.split('v=')[1]?.split('&')[0];
                            console.log('Video ID:', videoId);

                            // Try different thumbnail URLs in order
                            if (target.src.includes('maxresdefault')) {
                              console.log('Trying hqdefault...');
                              target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                            } else if (target.src.includes('hqdefault')) {
                              console.log('Trying mqdefault...');
                              target.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
                            } else if (target.src.includes('mqdefault')) {
                              console.log('Trying default...');
                              target.src = `https://i.ytimg.com/vi/${videoId}/default.jpg`;
                            } else {
                              console.log('Using placeholder fallback');
                              // Final fallback - placeholder
                              target.src = 'https://via.placeholder.com/600x337/404040/FFFFFF?text=Video+Thumbnail';
                            }
                          }}
                          onLoad={() => {
                            console.log(`Thumbnail loaded successfully: ${video.thumbnail}`);
                          }}
                        />
                      </div>
                    </div>
                    <div className="py-3 px-3 relative z-10">
                      <h3
                        className="text-lg font-semibold mb-4 line-clamp-2 sm:line-clamp-3"
                        style={{ fontFamily: 'Gilroy', fontWeight: 400 }}
                      >
                        {video.title}
                      </h3>
                      <div className="text-gray-200 flex items-center text-sm"
                        style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
                      >
                        Watch Video
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 17l9.2-9.2M17 17V7h-10"
                          ></path>
                        </svg>
                      </div>
                    </div>
                  </a>
                );
              })}
              </div>
            </div>
          </div>
        </div>
        {/* End of gradient wrapper */}
      </div>
    </div>
  );
};

export default LatestVideos;

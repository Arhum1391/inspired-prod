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

  // State for drag functionality and infinite scroll
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAnimationPaused, setIsAnimationPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  
  // Auto-scroll functionality
  useEffect(() => {
    if (isAnimationPaused || isDragging) return;

    const autoScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const maxScroll = container.scrollWidth / 2; // Half way point for seamless loop

      // Smooth auto-scroll
      container.scrollLeft += 0.5; // Adjust speed here

      // Reset to beginning when we reach halfway (end of first set)
      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      }

      animationRef.current = requestAnimationFrame(autoScroll);
    };

    animationRef.current = requestAnimationFrame(autoScroll);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimationPaused, isDragging]);

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setIsAnimationPaused(true);
    setDragStart(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - dragStart) * 2;
    const newScrollLeft = scrollLeft - walk;

    const container = containerRef.current;
    const maxScroll = container.scrollWidth / 2;

    // Handle infinite loop during drag
    if (newScrollLeft < 0) {
      container.scrollLeft = maxScroll + newScrollLeft;
      setScrollLeft(maxScroll);
      setDragStart(x);
    } else if (newScrollLeft >= maxScroll) {
      container.scrollLeft = newScrollLeft - maxScroll;
      setScrollLeft(0);
      setDragStart(x);
    } else {
      container.scrollLeft = newScrollLeft;
    }
  };

  // Handle mouse up/leave
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsAnimationPaused(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setIsAnimationPaused(true);
    setDragStart(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - dragStart) * 2;
    const newScrollLeft = scrollLeft - walk;

    const container = containerRef.current;
    const maxScroll = container.scrollWidth / 2;

    if (newScrollLeft < 0) {
      container.scrollLeft = maxScroll + newScrollLeft;
      setScrollLeft(maxScroll);
      setDragStart(x);
    } else if (newScrollLeft >= maxScroll) {
      container.scrollLeft = newScrollLeft - maxScroll;
      setScrollLeft(0);
      setDragStart(x);
    } else {
      container.scrollLeft = newScrollLeft;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsAnimationPaused(false);
  };

  return (
    <div className="text-white py-20 font-gilroy">
      <div className="container mx-auto px-4">
        <h2
          className="text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
        >
          Check Out the Weekly Crypto & Forex Podcasts with <br></br>Team Inspired Analyst
        </h2>

        {/* Carousel Wrapper with edge vignette effect */}
        <div className="relative rounded-3xl overflow-hidden">

          {/* Left edge vignette overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Right edge vignette overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Carousel Content */}
          <div className="relative bg-[#0A0A0A] rounded-3xl p-8">
            <div
              ref={containerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                scrollBehavior: isDragging ? 'auto' : 'smooth',
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-y pinch-zoom',
                overscrollBehaviorX: 'contain'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                ref={carouselRef}
                className="flex gap-6"
              >
                {duplicatedVideos.map((video, index) => {
                return (
                  <a
                    key={index}
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1C1C1E] rounded-2xl overflow-hidden group flex-shrink-0 w-80 block cursor-pointer"
                    onClick={(e) => {
                      if (isDragging) {
                        e.preventDefault();
                        return false;
                      }
                    }}
                  >
                    <div className="bg-[#1C1C1E] p-2">
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
                    <div className="py-3 px-3">
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

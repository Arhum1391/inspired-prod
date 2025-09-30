'use client';

import { useState, useRef, useEffect } from 'react';


interface BrandStory {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  link: string;
}

const brandStories: BrandStory[] = [
  {
    id: 1,
    title: 'Binance Write to Earn Campaign',
    description: 'Revolutionary content creation strategy that generated 1.2M+ views and transformed crypto engagement.',
    thumbnail: 'insta reels/526853861_1288609226095906_384361709264331048_n.jpg',
    link: 'https://www.instagram.com/reel/DM-q8R0JHYq/',
  },
  {
    id: 2,
    title: 'Algorand Blockchain Innovation',
    description: 'Cutting-edge blockchain storytelling that reached 600K+ viewers and showcased sustainable crypto solutions.',
    thumbnail: 'insta reels/486730182_18049736126256795_1390507338576305510_n.jpg',
    link: 'https://www.instagram.com/reel/DHqt63eMk83/?hl=en',
  },
  {
    id: 3,
    title: 'Ledger Security Excellence',
    description: 'Hardware wallet education campaign achieving 250K+ views with compelling security narratives.',
    thumbnail: 'insta reels/544612103_814732628383048_2408225710129440532_n.jpg',
    link: 'https://www.instagram.com/reel/DKZ0w3wgkpv/',
  },
  {
    id: 4,
    title: 'Tari Universe Gaming',
    description: 'Next-gen gaming ecosystem promotion that captivated 200K+ viewers with immersive storytelling.',
    thumbnail: 'insta reels/523817363_1087807726647003_2347515624379629528_n.jpg',
    link: 'https://www.instagram.com/reel/DMh_GSiMYaF/?hl=en',
  },
  {
    id: 5,
    title: 'Clearwave Technology',
    description: 'Innovative fintech solution showcase reaching 185K+ viewers through strategic content marketing.',
    thumbnail: 'insta reels/504242017_2399699880410218_331808368986846690_n.jpg',
    link: 'https://www.instagram.com/reel/C_5y_kdJ7n5/?hl=en',
  },
  {
    id: 6,
    title: 'Fasset Digital Assets',
    description: 'Tokenization platform story that engaged 171K+ viewers with compelling financial innovation narratives.',
    thumbnail: 'insta reels/502998911_3472787822851307_6711770676072270006_n.jpg',
    link: 'https://www.instagram.com/reel/DHTb3FQo3fA/',
  },
  {
    id: 7,
    title: 'Fellou AI Innovation',
    description: 'AI-powered solution demonstration reaching 140K+ viewers with cutting-edge technology storytelling.',
    thumbnail: 'insta reels/544612103_814732628383048_2408225710129440532_n.jpg',
    link: 'https://www.facebook.com/reel/812109268007070',
  },
  {
    id: 8,
    title: 'Mymemo AI Solutions',
    description: 'Smart memory enhancement platform showcasing 117K+ views through innovative AI storytelling.',
    thumbnail:'insta reels/503051577_1407273850399847_2928174126947382849_n.jpg',
    link: 'https://www.instagram.com/reel/C6OhFZEr4ry/?hl=en',
  },
];

const BrandStories: React.FC = () => {
  // Duplicate stories array for seamless infinite scroll
  const duplicatedStories = [...brandStories, ...brandStories];

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

  return (
    <section
      className="relative z-10 bg-[#0A0A0A] px-2 sm:px-3 md:px-4 lg:px-6 py-12 sm:py-16 md:py-20"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0px',
        gap: '64px'
      }}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
          >
            Where Leading Brands Meet Engaging Stories
          </h2>
        </div>

        {/* Carousel Wrapper with edge vignette effect */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Left edge vignette overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Right edge vignette overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Carousel Content */}
          <div className="relative bg-[#0A0A0A] rounded-3xl p-8">
            <div
              ref={containerRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 cursor-grab"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                scrollBehavior: isDragging ? 'auto' : 'smooth'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                ref={carouselRef}
                className="flex gap-6"
                onMouseEnter={() => !isDragging && setIsAnimationPaused(true)}
                onMouseLeave={() => !isDragging && setIsAnimationPaused(false)}
              >
                {duplicatedStories.map((story, index) => (
                  <a
                    key={`${story.id}-${index}`}
                    href={story.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1C1C1E] rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 flex-shrink-0 w-80 block cursor-pointer"
                    onClick={(e) => {
                      if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <div className="bg-[#1C1C1E] p-2">
                      <div className="relative bg-gray-700" style={{ aspectRatio: '16/10' }}>
                        <img
                          src={story.thumbnail}
                          alt={story.title}
                          className="w-full h-full object-cover rounded-lg relative z-10"
                          onError={(e) => {
                            console.log('Thumbnail failed to load:', story.thumbnail);
                            const target = e.currentTarget;
                            // Fallback to a solid color placeholder
                            target.src = 'https://via.placeholder.com/400x250/1C1C1E/FFFFFF?text=Brand+Story';
                          }}
                          onLoad={() => {
                            console.log(`Brand thumbnail loaded: ${story.thumbnail}`);
                          }}
                        />

                      </div>
                    </div>
                    <div className="py-4 px-4">
                      <h3
                        className="text-lg font-semibold mb-3 line-clamp-2 text-white"
                        style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
                      >
                        {story.title}
                      </h3>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-200 group-hover:text-white transition-colors duration-300 flex items-center text-sm"
                          style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
                        >
                          Watch Video
                          <svg
                            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
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
                        <div className="text-gray-300 text-xs font-bold"
                          style={{ fontFamily: 'Gilroy', fontWeight: 700 }}
                        >
                          {story.id === 1 ? '1.2M+' :
                           story.id === 2 ? '600K+' :
                           story.id === 3 ? '250K+' :
                           story.id === 4 ? '200K+' :
                           story.id === 5 ? '185K+' :
                           story.id === 6 ? '171K+' :
                           story.id === 7 ? '140K+' :
                           '117K+'} views
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStories;
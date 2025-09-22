import Image from 'next/image';
import Link from 'next/link';

interface Video {
  episode: string;
  title: string;
  thumbnail: string;
  link: string;
}

const videos: Video[] = [
  {
    episode: 'EPISODE 69',
    title: 'CPI Data Sparks Stagflation Fears? | 50bps Rate Cuts Ahead? | BTC Update | Ep 68',
    thumbnail: 'https://placehold.co/600x400/000000/FFFFFF?text=Video+Thumbnail',
    link: '#',
  },
  {
    episode: 'EPISODE 69',
    title: 'CPI Data Sparks Stagflation Fears? | 50bps Rate Cuts Ahead? | BTC Update | Ep 68',
    thumbnail: 'https://placehold.co/600x400/000000/FFFFFF?text=Video+Thumbnail',
    link: '#',
  },
  {
    episode: 'EPISODE 69',
    title: 'CPI Data Sparks Stagflation Fears? | 50bps Rate Cuts Ahead? | BTC Update | Ep 68',
    thumbnail: 'https://placehold.co/600x400/000000/FFFFFF?text=Video+Thumbnail',
    link: '#',
  },
  {
    episode: 'EPISODE 69',
    title: 'CPI Data Sparks Stagflation Fears? | 50bps Rate Cuts Ahead? | BTC Update | Ep 68',
    thumbnail: 'https://placehold.co/600x400/000000/FFFFFF?text=Video+Thumbnail',
    link: '#',
  },
];

const LatestVideos = () => {
  return (
    <div className="text-white py-20 font-gilroy">
      <div className="container mx-auto px-4">
        <h2
          className="text-4xl font-bold text-center mb-12"
          style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
        >
          Check Out My Latest Videos
        </h2>

        {/* Carousel Wrapper with gradient borders and edge blur */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Left gradient border */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 blur-sm opacity-70 z-20"></div>

          {/* Right gradient border */}
          <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 blur-sm opacity-70 z-20"></div>

          {/* Left edge blur overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>

          {/* Right edge blur overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none"></div>

          {/* Carousel Content */}
          <div className="relative bg-[#0A0A0A] rounded-3xl p-8">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {videos.map((video, index) => {
                const isExternal = video.thumbnail.startsWith('http');
                return (
                  <div
                    key={index}
                    className="bg-[#1C1C1E] rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300 flex-shrink-0 w-80"
                  >
                    <div className="bg-[#1C1C1E] p-4">
                      <div className="relative aspect-video">
                        {isExternal ? (
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={600}
                            height={337}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        )}
                        <div className="absolute inset-0 bg-gray-800 bg-opacity-30 rounded-lg"></div>
                        <div
                          className="absolute top-4 left-4 bg-black bg-opacity-50 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full flex items-center"
                          style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.636 5.636a9 9 0 0112.728 0m-12.728 0a9 9 0 0012.728 12.728"
                            />
                          </svg>
                          {video.episode}
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3
                        className="text-lg font-semibold mb-4 h-16 overflow-hidden"
                        style={{ fontFamily: 'Gilroy', fontWeight: 600 }}
                      >
                        {video.title}
                      </h3>
                      <Link
                        href={video.link}
                        className="text-gray-400 group-hover:text-white transition-colors duration-300 flex items-center"
                        style={{ fontFamily: 'Gilroy' }}
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
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* End of gradient wrapper */}
      </div>
    </div>
  );
};

export default LatestVideos;

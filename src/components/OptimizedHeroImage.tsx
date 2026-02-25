'use client';

import Image from 'next/image';

interface OptimizedHeroImageProps {
  src: string;
  /** Use true only for the single LCP image */
  priority?: boolean;
  /** Bypass Image Optimization API for faster TTFB on LCP (slightly larger file) */
  unoptimized?: boolean;
  /** Responsive sizes - small for hero carousel thumbnails */
  sizes?: string;
  /** 'mobile' = horizontal row, 'desktop' = vertical column */
  variant?: 'mobile' | 'desktop';
}

const VARIANT_CLASSES = {
  mobile: 'relative aspect-[1.95/1] h-full rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 w-28',
  desktop: 'relative aspect-[1/1.95] w-full rounded-full overflow-hidden bg-zinc-800',
};

/**
 * Replaces background-image divs with Next.js Image for automatic WebP/AVIF,
 * responsive sizing, and lazy loading. Reduces LCP and network payload.
 */
export default function OptimizedHeroImage({
  src,
  priority = false,
  unoptimized = false,
  sizes = '(max-width: 640px) 112px, 140px',
  variant = 'mobile',
}: OptimizedHeroImageProps) {
  return (
    <div className={VARIANT_CLASSES[variant]}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        className="object-cover object-center"
        loading={priority ? undefined : 'lazy'}
        priority={priority}
        fetchPriority={priority ? 'high' : 'low'}
        quality={unoptimized ? undefined : 75}
        unoptimized={unoptimized}
      />
    </div>
  );
}

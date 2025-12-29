'use client';

import { useEffect, useState, useRef } from 'react';
import NewsletterModal from './NewsletterModal';

export default function ScrollNewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const lastCheckScrollYRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<'up' | 'down'>('down');

  useEffect(() => {
    // Check if modal was already shown in this session
    const modalShown = sessionStorage.getItem('newsletterModalShown');
    if (modalShown === 'true') {
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollYRef.current;

      // Determine scroll direction
      if (scrollDelta > 0) {
        scrollDirectionRef.current = 'down';
      } else if (scrollDelta < 0) {
        scrollDirectionRef.current = 'up';
      }

      lastScrollYRef.current = currentScrollY;

      // Only check on downward scroll and if we haven't shown yet
      if (scrollDirectionRef.current !== 'down' || hasShown) {
        return;
      }

      // Only check if user has scrolled at least 200px since last check
      const scrollSinceLastCheck = currentScrollY - lastCheckScrollYRef.current;
      if (scrollSinceLastCheck < 200) {
        return;
      }

      // Check if we're in a reasonable scroll range (between 25% and 75% of page)
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = pageHeight > 0 ? (currentScrollY / pageHeight) * 100 : 0;

      if (scrollPercentage >= 25 && scrollPercentage <= 75) {
        // Random chance to show (25% probability on each check)
        const shouldShow = Math.random() < 0.25;

        if (shouldShow) {
          setIsOpen(true);
          setHasShown(true);
          sessionStorage.setItem('newsletterModalShown', 'true');
          lastCheckScrollYRef.current = currentScrollY;
          return;
        }
      }

      // Update last check position
      lastCheckScrollYRef.current = currentScrollY;
    };

    // Throttle scroll events
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return <NewsletterModal isOpen={isOpen} onClose={handleClose} />;
}


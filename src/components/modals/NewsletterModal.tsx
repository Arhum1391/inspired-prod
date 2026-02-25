'use client';

import { useEffect } from 'react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
      }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full relative"
        style={{
          border: '1px solid #000',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10 bg-white rounded-full p-1"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6">
          {/* Substack Embed Section */}
          <div className="mb-4">
            <iframe 
              src="https://inspiredanalyst.substack.com/embed" 
              width="100%" 
              height="400" 
              style={{
                border: '1px solid #EEE', 
                background: 'white'
              }} 
              frameBorder="0" 
              scrolling="no"
            />
          </div>
          
          {/* Footer Note */}
          <div className="pt-0">
            <p className="text-xs text-gray-500 text-center">
              By subscribing you agree to{' '}
              <a
                href="https://substack.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Substack's Terms of Use
              </a>
              , our{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Privacy Policy
              </a>
              {' '}and our{' '}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Information collection notice
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


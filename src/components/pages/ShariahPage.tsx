'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import type { ShariahTile } from '@/types/admin';

const FOOTER_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

const isIsoDateString = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const formatFooterDate = (value?: string) => {
  if (!value) return '';

  if (isIsoDateString(value)) {
    const [year, month, day] = value.split('-').map((part) => Number(part));
    if (![year, month, day].some((part) => Number.isNaN(part))) {
      const date = new Date(year, (month as number) - 1, day as number);
      return FOOTER_DATE_FORMATTER.format(date);
    }
  }

  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return FOOTER_DATE_FORMATTER.format(parsed);
  }

  return value;
};

export default function ShariahPage() {

  const auth = useAuth();
  const { isLoading } = auth;
  const isSignedIn = auth.isAuthenticated;

  const router = useRouter();
  const isAuthenticated = isSignedIn;
  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});
  const [showMethodologyPopup, setShowMethodologyPopup] = useState(false);
  const popupContentRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [tiles, setTiles] = useState<ShariahTile[]>([]);
  const [tilesLoading, setTilesLoading] = useState(true);
  const [tilesError, setTilesError] = useState<string | null>(null);

  // All hooks must be called before any conditional returns
  useEffect(() => {
    if (showMethodologyPopup) {
      // Lock body scroll when popup is open
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const scrollY = window.scrollY;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body scroll when popup is closed
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showMethodologyPopup]);

  useEffect(() => {
    const fetchTiles = async () => {
      try {
        setTilesLoading(true);
        const response = await fetch('/api/shariah-tiles');
        if (!response.ok) {
          throw new Error('Failed to load Shariah tiles');
        }
        const data = await response.json();
        setTiles(data);
        setTilesError(null);
      } catch (error) {
        console.error('Failed to load Shariah tiles:', error);
        setTilesError('Unable to load Shariah projects right now.');
      } finally {
        setTilesLoading(false);
      }
    };

    fetchTiles();
  }, []);

  const getDetailPath = (tile: ShariahTile) =>
    tile.detailPath?.trim() && tile.detailPath.startsWith('/shariah/')
      ? tile.detailPath
      : `/shariah/${tile.slug}`;

  const renderTile = (tile: ShariahTile) => {
    const detailPath = getDetailPath(tile);
    return (
      <div
        key={tile._id ?? tile.slug}
        className="relative overflow-hidden shariah-preview-tile"
        style={{
          boxSizing: 'border-box',
          width: '414px',
          height: '392px',
          borderRadius: '16px',
          flex: 'none',
          flexGrow: 0,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
          }}
        >
          <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
        </div>

        <div
          className="absolute pointer-events-none shariah-preview-gradient"
          style={{
            width: '588px',
            height: '588px',
            left: '399px',
            top: '-326px',
            background:
              'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(100px)',
            transform: 'rotate(90deg)',
            flex: 'none',
            flexGrow: 0,
            zIndex: 0,
            borderRadius: '50%',
          }}
        ></div>

        <div
          className="relative z-10 shariah-preview-content"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '24px',
            gap: '8px',
            isolation: 'isolate',
            width: '100%',
            height: '100%',
            filter: isAuthenticated ? 'none' : 'blur(8px)',
            pointerEvents: isAuthenticated ? 'auto' : 'none',
          }}
        >
          <div
            className="shariah-preview-badge"
            style={{
              background: 'rgba(5, 176, 179, 0.12)',
              border: '2px solid rgba(5, 176, 179, 0.72)',
              borderRadius: '25px',
              padding: '3px 12px',
              textAlign: 'center',
              display: 'inline-block',
            }}
          >
            <span
              style={{
                fontFamily: 'Gilroy-SemiBold, sans-serif',
                color: 'rgba(5, 176, 179, 1)',
                fontSize: '12px',
              }}
            >
              {tile.category}
            </span>
          </div>

          <h3
            className="shariah-preview-heading"
            style={{
              width: '366px',
              height: '24px',
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: '100%',
              color: '#FFFFFF',
              flex: 'none',
              margin: 0,
              marginTop: '4px',
            }}
          >
            {tile.title}
          </h3>

          <p
            className="shariah-preview-desc"
            style={{
              color: '#FFFFFF',
              fontFamily: 'Gilroy-Medium, sans-serif',
              fontSize: '16px',
              lineHeight: '130%',
              margin: 0,
              marginTop: '5px',
            }}
          >
            {tile.description}
          </p>

          <div
            className="shariah-preview-compliance"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '8px',
              width: '366px',
              height: '108px',
              flex: 'none',
              alignSelf: 'stretch',
              flexGrow: 0,
              marginTop: '8px',
            }}
          >
            <h4
              className="shariah-preview-compliance-title"
              style={{
                width: '366px',
                height: '18px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: '100%',
                color: '#FFFFFF',
                flex: 'none',
                margin: 0,
              }}
            >
              Compliance Rationale:
            </h4>

            <div
              className="shariah-preview-bullets"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '8px',
                width: '366px',
                height: '80px',
                flex: 'none',
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '5px',
              }}
            >
              {tile.compliancePoints?.map((point, index) => (
                <div
                  key={`${tile.slug}-point-${index}`}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '366px',
                    height: '14px',
                    flex: 'none',
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      background: '#FFFFFF',
                      borderRadius: '50%',
                      flex: 'none',
                    }}
                  />
                  <span
                    style={{
                      width: '320px',
                      minHeight: '14px',
                      fontFamily: 'Gilroy-Regular',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '100%',
                      color: '#FFFFFF',
                      flex: 'none',
                    }}
                  >
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className="shariah-preview-footer"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '366px',
              marginTop: '15px',
            }}
          >
            <span
              style={{
                fontFamily: 'Gilroy-Medium, sans-serif',
                fontSize: '14px',
                color: '#FFFFFF',
              }}
            >
              {tile.footerLeft}
            </span>
            <span
              style={{
                fontFamily: 'Gilroy-Medium, sans-serif',
                fontSize: '14px',
                color: '#FFFFFF',
              }}
            >
              {formatFooterDate(tile.footerRight)}
            </span>
          </div>

          <button
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '6px 16px',
              gap: '8px',
              width: '366px',
              height: '36px',
              border: '1px solid #FFFFFF',
              borderRadius: '100px',
              background: 'transparent',
              color: '#FFFFFF',
              cursor: 'pointer',
              marginTop: '15px',
              fontFamily: 'Gilroy-SemiBold, sans-serif',
              fontSize: '14px',
              outline: 'none',
            }}
            onClick={() => {
              if (isAuthenticated) {
                router.push(detailPath);
              }
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.currentTarget.style.border = '1px solid #FFFFFF';
            }}
            onFocus={(e) => {
              e.currentTarget.style.outline = 'none';
              e.currentTarget.style.border = '1px solid #FFFFFF';
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = '1px solid #FFFFFF';
            }}
          >
            {tile.ctaLabel || 'View Details'}
            <Image
              src="/logo/backhome.png"
              alt={tile.ctaLabel || 'View Details'}
              width={16}
              height={16}
              className="w-4 h-4"
            />
          </button>
        </div>

        {!isAuthenticated && (
          <>
            <div
              className="shariah-preview-tint-overlay"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(31, 31, 31, 0.8)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                borderRadius: '16px',
                zIndex: 15,
                pointerEvents: 'none',
              }}
            />
            <div
              className="shariah-preview-overlay"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                zIndex: 20,
                pointerEvents: 'none',
              }}
            >
              <h2
                className="shariah-preview-title"
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '32px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {tile.lockedTitle || 'Preview Only'}
              </h2>
              <p
                className="shariah-preview-description"
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: 0,
                  textAlign: 'center',
                }}
              >
                {tile.lockedDescription || 'Explore Verified Projects, Screening Criteria and Compliance Rationale'}
              </p>
            </div>
          </>
        )}
      </div>
    );
  };

  const toggleTile = (index: number) => {
    setExpandedTiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Conditional returns must come after all hooks
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{__html: `
        button:focus,
        button:active,
        button:focus-visible {
          outline: none !important;
        }
        button:focus {
          border: inherit !important;
        }
        button:active {
          border: inherit !important;
        }
        .popup-content-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .popup-content-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .popup-content-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .popup-content-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        .methodology-popup-content::-webkit-scrollbar {
          width: 6px;
        }
        .methodology-popup-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .methodology-popup-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .methodology-popup-content::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        @media (min-width: 769px) {
          .shariah-hero-description {
            margin-top: 12px !important;
          }
          /* Methodology Popup Desktop Styles */
          .methodology-popup-backdrop {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            overflow: auto !important;
          }
          .methodology-popup-content {
            position: relative !important;
            width: 630px !important;
            max-width: 90vw !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            margin: auto !important;
            padding: 24px !important;
            gap: 24px !important;
            border-radius: 16px !important;
          }
        }
        @media (max-width: 768px) {
          .shariah-hero-container {
            padding-top: 94px !important;
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-bottom: 24px !important;
          }
          .shariah-layout {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .shariah-section-wrapper {
            position: relative !important;
            width: 100% !important;
            max-width: 375px !important;
            margin: 0 auto !important;
          }
          .shariah-background-svg {
            left: -180px !important;
            top: -60px !important;
            width: 620px !important;
            height: 500px !important;
            transform: rotate(15deg) !important;
          }
          .shariah-hero-title {
            width: 100% !important;
            max-width: 343px !important;
            height: auto !important;
            font-size: 32px !important;
            line-height: 120% !important;
            margin-top: 0 !important;
            min-height: 152px !important;
            text-align: left !important;
          }
          .shariah-hero-description {
            width: 100% !important;
            max-width: 343px !important;
            font-size: 16px !important;
            line-height: 130% !important;
            margin-top: 12px !important;
            min-height: 63px !important;
            text-align: left !important;
          }
          .shariah-hero-bullets {
            width: 100% !important;
            max-width: 343px !important;
            gap: 16px !important;
            margin-top: 0 !important;
          }
          .shariah-hero-stack {
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            width: 343px !important;
            gap: 24px !important;
            z-index: 1 !important;
            isolation: isolate !important;
            margin: 0 !important;
            margin-left: 16px !important;
          }
          .shariah-hero-stack .shariah-hero-bullets {
            width: 343px !important;
            max-width: 343px !important;
            gap: 16px !important;
            margin-top: 0 !important;
            height: auto !important;
            min-height: 112px !important;
          }
          .shariah-hero-stack .shariah-hero-bullet {
            width: 343px !important;
            gap: 8px !important;
          }
          .shariah-hero-stack .shariah-hero-bullet span {
            width: calc(100% - 24px) !important;
          }
          .shariah-hero-bullet {
            width: 100% !important;
            flex-wrap: wrap !important;
          }
          .shariah-hero-bullet span {
            width: calc(100% - 24px) !important;
          }
          .shariah-hero-cta {
            flex-direction: column !important;
            align-items: center !important;
            width: 343px !important;
            height: 120px !important;
            gap: 20px !important;
            margin-top: 0 !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            margin: 0 auto !important;
          }
          .shariah-hero-cta-primary,
          .shariah-hero-cta-secondary {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 343px !important;
            height: 50px !important;
            padding: 18px 12px !important;
            gap: 10px !important;
            border-radius: 100px !important;
            font-size: 14px !important;
            line-height: 100% !important;
          }
          .shariah-hero-cta-primary {
            background: #FFFFFF !important;
            color: #0A0A0A !important;
          }
          .shariah-hero-cta-secondary {
            border: 1px solid #FFFFFF !important;
            color: #FFFFFF !important;
            background: transparent !important;
            box-sizing: border-box !important;
          }
          .shariah-projects-section {
            margin-top: 45px !important;
            width: 100% !important;
            max-width: 343px !important;
            margin-left: 16px !important;
            margin-right: auto !important;
            height: auto !important;
            min-height: auto !important;
          }
          .shariah-projects-heading {
            width: 343px !important;
            height: 84px !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 32px !important;
            line-height: 130% !important;
            color: #FFFFFF !important;
            flex: none !important;
            order: 0 !important;
            align-self: stretch !important;
            flex-grow: 0 !important;
          }
          .shariah-projects-description {
            width: 343px !important;
            height: auto !important;
            min-height: 40px !important;
            font-family: 'Gilroy-Medium' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            line-height: 125% !important;
            color: #FFFFFF !important;
            flex: none !important;
            order: 1 !important;
            align-self: stretch !important;
            flex-grow: 0 !important;
          }
          .shariah-methodology-tile {
            margin-top: 24px !important;
            margin-bottom: 60px !important;
            width: 100% !important;
            max-width: 343px !important;
            margin-left: 16px !important;
            margin-right: auto !important;
            position: relative !important;
            z-index: 1 !important;
          }
          .shariah-tiles-container {
            width: 100% !important;
            max-width: 343px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-top: 24px !important;
          }
          .shariah-tiles-wrapper {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
            width: 100% !important;
          }
          .shariah-preview-tile {
            width: 343px !important;
            height: auto !important;
            min-height: 405px !important;
            max-height: 527px !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            opacity: 1 !important;
            transform: rotate(0deg) !important;
            margin-left: auto !important;
            margin-right: auto !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            position: relative !important;
          }
          .shariah-preview-content[style] {
            padding: 20px 12px !important;
            gap: 16px !important;
            width: 319px !important;
            max-width: 319px !important;
            box-sizing: border-box !important;
            height: auto !important;
            min-height: 365px !important;
            overflow: visible !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .shariah-preview-content {
            padding: 20px 12px !important;
            gap: 16px !important;
            width: 319px !important;
            max-width: 319px !important;
            box-sizing: border-box !important;
            height: auto !important;
            min-height: 365px !important;
            overflow: visible !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .shariah-preview-badge[style] {
            width: 84px !important;
            height: 24px !important;
            padding: 10px !important;
            border: 1px solid #05B0B3 !important;
            border-radius: 40px !important;
            box-sizing: border-box !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: rgba(5, 176, 179, 0.12) !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          .shariah-preview-badge {
            width: 84px !important;
            height: 24px !important;
            padding: 10px !important;
            border: 1px solid #05B0B3 !important;
            border-radius: 40px !important;
            box-sizing: border-box !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background: rgba(5, 176, 179, 0.12) !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          .shariah-preview-badge span {
            font-size: 12px !important;
            line-height: 100% !important;
            font-family: 'Gilroy-Medium' !important;
            text-align: center !important;
            white-space: nowrap !important;
          }
          .shariah-preview-heading[style],
          .shariah-preview-heading {
            width: 319px !important;
            height: auto !important;
            min-height: 24px !important;
            font-size: 24px !important;
            line-height: 100% !important;
            margin: 0 !important;
            text-align: left !important;
            flex-shrink: 0 !important;
          }
          .shariah-preview-desc[style],
          .shariah-preview-desc {
            width: 319px !important;
            height: auto !important;
            font-size: 16px !important;
            line-height: 130% !important;
            margin: 0 !important;
            text-align: left !important;
            flex-shrink: 0 !important;
          }
          .shariah-preview-compliance[style],
          .shariah-preview-compliance {
            width: 319px !important;
            gap: 8px !important;
            margin: 0 !important;
            height: auto !important;
            flex-shrink: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .shariah-preview-compliance-title[style],
          .shariah-preview-compliance-title {
            width: 319px !important;
            height: auto !important;
            min-height: 16px !important;
            font-size: 16px !important;
            line-height: 100% !important;
            margin: 0 !important;
            font-family: 'Gilroy-Medium' !important;
            flex-shrink: 0 !important;
            text-align: left !important;
          }
          .shariah-preview-bullets[style],
          .shariah-preview-bullets {
            width: 319px !important;
            gap: 8px !important;
            margin: 0 !important;
            height: auto !important;
            flex-shrink: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .shariah-preview-bullets > div {
            width: 319px !important;
            max-width: 319px !important;
            height: auto !important;
            min-height: 14px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 8px !important;
            box-sizing: border-box !important;
            overflow: visible !important;
          }
          .shariah-preview-bullets > div[style] {
            width: 319px !important;
            max-width: 319px !important;
            align-items: center !important;
          }
          .shariah-preview-bullets > div > div {
            width: 8px !important;
            height: 8px !important;
            min-width: 8px !important;
            min-height: 8px !important;
            flex-shrink: 0 !important;
            flex-grow: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            align-self: center !important;
            display: block !important;
          }
          .shariah-preview-bullets > div > span {
            width: 295px !important;
            max-width: 295px !important;
            min-width: 0 !important;
            height: auto !important;
            min-height: 14px !important;
            font-size: 14px !important;
            line-height: 130% !important;
            text-align: left !important;
            flex: 1 1 auto !important;
            flex-basis: 295px !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            white-space: normal !important;
            overflow: visible !important;
            box-sizing: border-box !important;
            display: block !important;
            hyphens: auto !important;
            word-break: break-word !important;
            overflow-wrap: anywhere !important;
            margin: 0 !important;
            padding: 0 !important;
            align-self: center !important;
            vertical-align: middle !important;
          }
          .shariah-preview-bullets > div > span[style] {
            width: 295px !important;
            max-width: 295px !important;
            min-width: 0 !important;
            white-space: normal !important;
            overflow-wrap: anywhere !important;
            word-break: break-word !important;
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .shariah-preview-footer[style],
          .shariah-preview-footer {
            width: 319px !important;
            height: auto !important;
            min-height: 14px !important;
            gap: 16px !important;
            margin: 0 !important;
            justify-content: space-between !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            flex-shrink: 0 !important;
          }
          .shariah-preview-footer > span[style],
          .shariah-preview-footer > span {
            font-size: 14px !important;
            line-height: 100% !important;
            width: auto !important;
            font-family: 'Gilroy-Regular' !important;
            text-align: left !important;
            white-space: nowrap !important;
          }
          .shariah-preview-footer > span:first-child[style],
          .shariah-preview-footer > span:first-child {
            margin: 0 !important;
            flex: 0 0 auto !important;
          }
          .shariah-preview-footer > span:last-child[style],
          .shariah-preview-footer > span:last-child {
            margin: 0 !important;
            flex: 0 0 auto !important;
            margin-left: auto !important;
          }
          .shariah-preview-tile button[style],
          .shariah-preview-tile button {
            width: 319px !important;
            height: 36px !important;
            padding: 10px 16px !important;
            gap: 8px !important;
            border-radius: 100px !important;
            margin: 0 !important;
            box-sizing: border-box !important;
            flex-shrink: 0 !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .shariah-preview-gradient {
            left: 319px !important;
            top: -326px !important;
          }
          .shariah-preview-tint-overlay {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 343px !important;
            height: 369px !important;
            background: rgba(31, 31, 31, 0.8) !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
            border-radius: 10px !important;
            z-index: 15 !important;
            pointer-events: none !important;
          }
          .shariah-preview-overlay {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            padding: 0px !important;
            gap: 16px !important;
            position: absolute !important;
            width: 303.23px !important;
            height: 54px !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
          }
          .shariah-preview-title {
            width: 303.23px !important;
            height: 20px !important;
            font-family: 'Gilroy-SemiBold' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 20px !important;
            line-height: 100% !important;
            text-align: center !important;
            color: #FFFFFF !important;
            flex: none !important;
            order: 0 !important;
            flex-grow: 1 !important;
            margin: 0 !important;
          }
          .shariah-preview-description {
            width: 303.23px !important;
            height: 18px !important;
            font-family: 'Gilroy-Regular' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 14px !important;
            line-height: 130% !important;
            text-align: center !important;
            color: #FFFFFF !important;
            flex: none !important;
            order: 1 !important;
            align-self: stretch !important;
            flex-grow: 0 !important;
            margin: 0 !important;
          }
          .shariah-methodology-text {
            width: 319px !important;
            height: auto !important;
            min-height: 168px !important;
            font-family: 'Gilroy-Regular' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            line-height: 130% !important;
            color: #FFFFFF !important;
            flex: none !important;
            order: 0 !important;
            align-self: stretch !important;
            flex-grow: 0 !important;
          }
          .shariah-methodology-button {
            order: 1 !important;
            align-self: flex-start !important;
            margin-top: 8px !important;
          }
          .calculator-ready-tile {
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: flex-start !important;
            padding: 20px 16px !important;
            gap: 10px !important;
            isolation: isolate !important;
            width: 343px !important;
            height: 330px !important;
            border-radius: 10px !important;
            margin-top: 60px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            margin-bottom: 24px !important;
          }
          .calculator-ready-ellipse-left {
            width: 588px !important;
            height: 588px !important;
            left: -492px !important;
            top: -508px !important;
            filter: blur(200px) !important;
            transform: rotate(90deg) !important;
          }
          .calculator-ready-ellipse-right {
            width: 588px !important;
            height: 588px !important;
            left: 330px !important;
            bottom: -370px !important;
            filter: blur(200px) !important;
            transform: rotate(90deg) !important;
          }
          .calculator-ready-content {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            justify-content: center !important;
            gap: 8px !important;
            width: 311px !important;
            height: 290px !important;
            margin: 0 auto !important;
            padding-top: 16px !important;
            padding-bottom: 16px !important;
          }
          .calculator-ready-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 24px !important;
            width: 311px !important;
            height: 130px !important;
          }
          .calculator-ready-header h2 {
            width: 311px !important;
            height: 64px !important;
            font-size: 32px !important;
            line-height: 100% !important;
            text-align: center !important;
          }
          .calculator-ready-header p {
            width: 311px !important;
            height: 42px !important;
            font-size: 16px !important;
            line-height: 130% !important;
            text-align: center !important;
          }
          .calculator-ready-buttons {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
            width: 311px !important;
            height: 120px !important;
            margin-bottom: 12px !important;
          }
          .calculator-ready-buttons button {
            width: 311px !important;
            height: 50px !important;
            padding: 18px 12px !important;
            gap: 10px !important;
            border-radius: 100px !important;
          }
          .calculator-ready-buttons button:first-child {
            background: #FFFFFF !important;
            color: #0A0A0A !important;
          }
          .calculator-ready-buttons button:last-child {
            border: 1px solid #FFFFFF !important;
            color: #FFFFFF !important;
            background: transparent !important;
          }
          .calculator-faq-tile {
            width: 343px !important;
            padding: 24px !important;
          }
          .calculator-faq-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 0 !important;
            gap: 24px !important;
            width: 343px !important;
            height: 140px !important;
            margin: 40px auto !important;
          }
          /* Methodology Popup Mobile Styles */
          .methodology-popup-backdrop {
            padding: 20px !important;
            align-items: center !important;
            justify-content: center !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
          .methodology-popup-content {
            position: relative !important;
            width: 343px !important;
            max-width: 100% !important;
            min-height: auto !important;
            height: auto !important;
            padding: 20px 12px !important;
            gap: 24px !important;
            border-radius: 10px !important;
            margin: auto !important;
            max-height: 90vh !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
          }
          .methodology-popup-header {
            width: 319px !important;
            height: 52px !important;
            gap: 16px !important;
            padding: 0 !important;
          }
          .methodology-popup-header-row {
            width: 319px !important;
            height: 20px !important;
            gap: 63px !important;
            padding: 0 !important;
          }
          .methodology-popup-title-container {
            width: 236px !important;
            height: 20px !important;
            gap: 4px !important;
            padding: 0 !important;
            flex: 1 !important;
          }
          .methodology-popup-title {
            width: 221px !important;
            height: 20px !important;
            font-size: 20px !important;
            line-height: 100% !important;
            color: #F3F8FF !important;
            margin: 0 !important;
          }
          .methodology-popup-close-btn {
            width: 20px !important;
            height: 20px !important;
            border: 1px solid #AFB9BF !important;
            border-radius: 20px !important;
            padding: 0 !important;
            flex-shrink: 0 !important;
          }
          .methodology-popup-description {
            width: 319px !important;
            height: 16px !important;
            font-size: 16px !important;
            line-height: 100% !important;
            color: #F3F8FF !important;
            margin: 0 !important;
          }
          .methodology-popup-content-area {
            width: 319px !important;
            height: 952px !important;
            gap: 16px !important;
            padding: 0 !important;
          }
          .methodology-popup-section {
            box-sizing: border-box !important;
            width: 319px !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 8px !important;
            padding: 20px !important;
            gap: 12px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .methodology-popup-section-title {
            width: 279px !important;
            height: 20px !important;
            font-size: 20px !important;
            line-height: 100% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            align-self: stretch !important;
          }
          .methodology-popup-bullet-list {
            width: 279px !important;
            gap: 8px !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .methodology-popup-bullet-item {
            width: 279px !important;
            gap: 8px !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .methodology-popup-bullet-row {
            width: 279px !important;
            height: 14px !important;
            gap: 8px !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
          }
          .methodology-popup-bullet-dot {
            width: 8px !important;
            height: 8px !important;
            background: #FFFFFF !important;
            border-radius: 50% !important;
            flex-shrink: 0 !important;
          }
          .methodology-popup-bullet-text {
            font-size: 14px !important;
            line-height: 100% !important;
            color: #FFFFFF !important;
            flex-shrink: 0 !important;
          }
          .methodology-popup-bullet-description {
            width: 279px !important;
            height: 28px !important;
            font-size: 14px !important;
            line-height: 100% !important;
            color: rgba(255, 255, 255, 0.3) !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 10px !important;
          }
          .methodology-popup-close-button-container {
            width: 319px !important;
            height: 48px !important;
            gap: 20px !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
            margin-top: 0 !important;
          }
          .methodology-popup-close-button {
            width: 319px !important;
            height: 48px !important;
            padding: 12px 16px !important;
            gap: 10px !important;
            background: #FFFFFF !important;
            border-radius: 100px !important;
            border: none !important;
            font-size: 16px !important;
            line-height: 100% !important;
            color: #404040 !important;
            font-family: 'Gilroy-SemiBold' !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            flex: 1 !important;
            cursor: pointer !important;
          }
          .calculator-faq-header h2 {
            width: 343px !important;
            height: 84px !important;
            font-size: 32px !important;
            line-height: 130% !important;
            text-align: center !important;
          }
          .calculator-faq-header p {
            width: 343px !important;
            height: 32px !important;
            font-size: 16px !important;
            line-height: 100% !important;
            text-align: center !important;
          }
          .calculator-faq-list {
            width: 343px !important;
            margin: 24px auto 0 !important;
            gap: 16px !important;
          }
          .calculator-faq-answer {
            margin-top: 8px !important;
            padding-top: 8px !important;
          }
        }
      `}} />
      <Navbar />
      
      {/* Background SVG Gradient */}
      <svg 
        className="absolute pointer-events-none shariah-background-svg"
        style={{
          left: '-500px',
          top: '-80px',
          width: '1686.4px',
          height: '934.41px',
          rotate: '-12deg',
          zIndex: 0,
        }}
        viewBox="0 0 635 728" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <g filter="url(#filter0_f_shariah)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_shariah)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_shariah" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_shariah"/>
          </filter>
          <linearGradient id="paint0_linear_shariah" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3813F3"/>
            <stop offset="0.307692" stopColor="#DE50EC"/>
            <stop offset="0.543269" stopColor="#B9B9E9"/>
            <stop offset="0.740385" stopColor="#4B25FD"/>
            <stop offset="0.9999" stopColor="#05B0B3"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8 flex items-start shariah-hero-container shariah-layout">
          <div className="max-w-7xl mx-auto w-full relative shariah-section-wrapper">
            {/* Vector Logo */}
            <svg
              width="538"
              height="633"
              viewBox="0 0 538 633"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                left: '847px',
                top: '-50px',
                transform: 'rotate(5deg)',
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              <g opacity="0.5">
                <path d="M485.003 448.627C449.573 580.853 314.193 659.464 182.624 624.21C51.0543 588.956 -26.8824 453.187 8.54736 320.961C43.9772 188.735 179.378 110.129 310.947 145.383L478.648 190.318C517.106 200.623 558.36 174.855 558.36 174.855L485.003 448.627ZM266.707 306.134C223.047 294.435 178.123 320.521 166.366 364.399C154.609 408.277 180.471 453.33 224.131 465.029C267.791 476.727 312.715 450.641 324.472 406.763L345.76 327.316L266.707 306.134Z" fill="url(#paint0_linear_vector_logo)"/>
                <path d="M417.104 61.0593C428.861 17.1816 473.785 -8.90461 517.445 2.79402C561.105 14.4926 586.967 59.5461 575.21 103.424C563.453 147.301 518.529 173.388 474.869 161.689L395.816 140.507L417.104 61.0593Z" fill="url(#paint1_linear_vector_logo)"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_vector_logo" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
                <linearGradient id="paint1_linear_vector_logo" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
              </defs>
            </svg>
            
            <div className="shariah-hero-stack">
            {/* Title - Left Middle */}
            <h1
              className="shariah-hero-title"
              style={{
                width: '630px',
                height: '174px',
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '120%',
                color: '#FFFFFF',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '120px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {isAuthenticated 
                ? 'Shariah-Compliant Projects - Invest with Principles, Backed by Transparency'
                : 'Unlock the full experience with Inspired Analyst Premium'
              }
            </h1>
            {/* Description */}
            <p
              className="shariah-hero-description"
              style={{
                width: '630px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '130%',
                color: '#FFFFFF',
                marginTop: isAuthenticated ? '-26px' : '12px',
              }}
            >
              {isAuthenticated
                ? 'Explore screened projects, compliance rationales, and methodology details. Designed to help you invest confidently with your values.'
                : 'Full research library, Position Sizing Calculator (save scenarios), portfolio analytics, and Shariah project details. Cancel anytime.'
              }
            </p>
            {/* Bullet Points */}
            {!isAuthenticated && (
            <div
              className="shariah-hero-bullets"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                width: '630px',
                height: '112px',
                flex: 'none',
                order: 2,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '24px',
              }}
            >
              {/* Bullet 1 */}
              <div
                className="shariah-hero-bullet"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '323px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Deep-dive reports with downloadable PDFs
                </span>
              </div>
              
              {/* Bullet 2 */}
              <div
                className="shariah-hero-bullet"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '246px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Position sizing tailored to your risk
                </span>
              </div>
              
              {/* Bullet 3 */}
              <div
                className="shariah-hero-bullet"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '247px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Portfolio allocation & P/L tracking
                </span>
              </div>
              
              {/* Bullet 4 */}
              <div
                className="shariah-hero-bullet"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '8px',
                  width: '630px',
                  height: '16px',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#FFFFFF',
                    borderRadius: '50%',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                />
                <span
                  style={{
                    width: '299px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                  }}
                >
                  Shariah methodology & detailed screens
                </span>
              </div>
            </div>
            )}
            {/* Buttons Container */}
            {!isAuthenticated && (
            <div
              className="shariah-hero-cta"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '414px',
                height: '50px',
                flex: 'none',
                order: 3,
                flexGrow: 0,
                marginTop: '24px',
              }}
            >
              {/* Button 1 */}
              <button
                className="shariah-hero-cta-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 32px',
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  flex: 'none',
                  minWidth: '180px',
                  height: '50px',
                  width: 'auto',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseDown={(e) => e.preventDefault()}
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                Start Subscription
              </button>
              {/* Button 2 */}
              <button
                className="shariah-hero-cta-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px 32px',
                  background: '#000000',
                  color: '#FFFFFF',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: '1px solid #FFFFFF',
                  cursor: 'pointer',
                  flex: 'none',
                  minWidth: '180px',
                  height: '50px',
                  width: 'auto',
                  whiteSpace: 'nowrap',
                  outline: 'none',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid #FFFFFF';
                }}
              >
                Watch Free Videos
              </button>
            </div>
            )}
            </div>
            
            {/* Shariah-Compliant Projects Section */}
            <div
              className="shariah-projects-section"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '1290px',
                height: '87px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '200px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Heading */}
              <h2
                className="shariah-projects-heading"
                style={{
                  width: '1282px',
                  height: '47px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '130%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Shariah-Compliant Projects
              </h2>
              
              {/* Description */}
              <p
                className="shariah-projects-description"
                style={{
                  width: '1282px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                {isAuthenticated 
                  ? 'Explore verified projects, screening criteria, and detailed compliance rationales.'
                  : 'Detailed screening is available with Premium. Subscribe to unlock full compliance analysis.'
                }
              </p>
            </div>
            
            {/* Methodology Tile */}
            <div
              className="relative overflow-hidden group transition-all duration-300 flex flex-col items-start p-4 gap-4 h-auto bg-[#1F1F1F] rounded-2xl shariah-methodology-tile"
              style={{
                marginTop: '48px',
                width: '1290px',
                maxWidth: '1290px',
                marginLeft: 'auto',
                marginRight: 'auto',
                
              }}
            >
              {/* Curved Gradient Border */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                style={{
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                }}
              >
                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
              </div>

              {/* Gradient Ellipse */}
              <div 
                className="absolute pointer-events-none"
                style={{
                  width: '588px',
                  height: '588px',
                  right: '-308px',
                  top: '-495px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(100px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 0,
                  borderRadius: '50%'
                }}
              ></div>
              
              {/* Content with relative positioning to appear above gradient */}
              <div className="relative z-10 w-full h-full flex flex-col">
                <h3 className="text-white text-lg font-semibold mb-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>Methodology</h3>
                <p className="text-white-400 text-sm leading-relaxed mb-4 shariah-methodology-text" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  Our Shariah screening process follows a comprehensive approach that evaluates businesses based on their core activities, financial ratios, and ethical standards. We exclude companies with significant involvement in prohibited activities and those with excessive debt or interest income.
                </p>
                <button
                  className="flex items-center justify-center gap-2 bg-[#1F1F1F] text-white border border-white px-4 py-2 rounded-full font-semibold hover:bg-[#2A2A2A] transition-colors focus:outline-none focus:ring-0 w-fit shariah-methodology-button"
                  style={{ 
                    fontFamily: 'Gilroy-SemiBold, sans-serif',
                    outline: 'none',
                    boxShadow: 'none'
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid #FFFFFF';
                  }}
                  onClick={() => setShowMethodologyPopup(true)}
                >
                  View Full Criteria
                  <Image 
                    src="/logo/backhome.png" 
                    alt="View Full Criteria" 
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
            
            {/* Three Tiles Container */}
            <div
              className="shariah-tiles-container"
              style={{
                position: 'relative',
                marginTop: '72px',
                width: '1290px',
                maxWidth: '1290px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {tilesLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  Loading Shariah projects...
                </div>
              ) : tilesError ? (
                <div className="text-center py-12 text-red-400">{tilesError}</div>
              ) : tiles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  No Shariah tiles available yet. Check back soon.
                </div>
              ) : (
                <div className="flex flex-row gap-6 shariah-tiles-wrapper flex-wrap">
                  {tiles.map((tile) => renderTile(tile))}
                </div>
              )}
            </div>

            {/* New Single Tile */}
            {!isAuthenticated && (
            <div
              className="relative overflow-hidden calculator-tile calculator-ready-tile"
              style={{
                width: '1064px',
                height: '247px',
                borderRadius: '16px',
                background: '#1F1F1F',
                padding: '40px',
                gap: '10px',
                boxSizing: 'border-box',
                marginTop: '220px',
                marginBottom: '220px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Curved Gradient Border */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-2xl p-[1px]"
                style={{
                  borderRadius: '16px',
                  background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                }}
              >
                <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
              </div>

              {/* Gradient Ellipse - Top Left */}
              <div 
                className="absolute pointer-events-none calculator-ready-ellipse-left"
                style={{
                  width: '588px',
                  height: '588px',
                  left: '-403px',
                  top: '-510px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 0,
                  borderRadius: '50%'
                }}
              ></div>

              {/* Gradient Ellipse - Bottom Right */}
              <div 
                className="absolute pointer-events-none calculator-ready-ellipse-right"
                style={{
                  width: '588px',
                  height: '588px',
                  left: '739px',
                  bottom: '-510px',
                  background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
                  filter: 'blur(200px)',
                  transform: 'rotate(90deg)',
                  flex: 'none',
                  flexGrow: 0,
                  zIndex: 1,
                  borderRadius: '50%'
                }}
              ></div>
              
              {/* Content */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center calculator-ready-content" style={{ gap: '10px' }}>
                {/* Frame 81 */}
                <div
                  className="calculator-ready-header"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '24px',
                    width: '461px',
                    height: '77px',
                    flex: 'none',
                    order: 0,
                    flexGrow: 0,
                  }}
                >
                  {/* Title */}
                  <h2
                    style={{
                      width: '461px',
                      height: '32px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '32px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      margin: 0,
                    }}
                  >
                    Ready to unlock full access?
                  </h2>
                  
                  {/* Description */}
                  <p
                    style={{
                      width: '461px',
                      height: '21px',
                      fontFamily: 'Gilroy-Medium',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '130%',
                      textAlign: 'center',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      margin: 0,
                    }}
                  >
                    Join thousands of informed investors making better decisions.
                  </p>
                </div>
                
                {/* Buttons Container */}
                <div
                  className="calculator-ready-buttons"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '20px',
                    width: '414px',
                    height: '50px',
                    flex: 'none',
                    flexGrow: 0,
                    marginTop: '24px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                >
                  {/* Button 1 */}
                  <button
                    style={{
                      padding: '12px 32px',
                      background: '#FFFFFF',
                      color: '#0A0A0A',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '14px',
                      fontWeight: 400,
                      border: 'none',
                      cursor: 'pointer',
                      flex: 'none',
                      minWidth: '180px',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                    onFocus={(e) => e.currentTarget.style.outline = 'none'}
                    onClick={() => router.push('/pricing')}
                  >
                    Start Subscription
                  </button>
                  {/* Button 2 */}
                  <button
                    style={{
                      padding: '12px 32px',
                      background: 'transparent',
                      color: '#FFFFFF',
                      borderRadius: '100px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '14px',
                      fontWeight: 400,
                      border: '1px solid #FFFFFF',
                      cursor: 'pointer',
                      flex: 'none',
                      minWidth: '180px',
                      whiteSpace: 'nowrap',
                      outline: 'none',
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.border = '1px solid #FFFFFF';
                    }}
                  >
                    Watch Free Videos
                  </button>
                </div>
              </div>
            </div>
            )}
            
            {/* Frequently Asked Questions Section */}
            <div
              className="calculator-faq-header"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '847px',
                height: '87px',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                marginLeft: 'auto',
                marginRight: 'auto',
                marginTop: isAuthenticated ? '220px' : '0px',
              }}
            >
              {/* Heading */}
              <h2
                style={{
                  width: '847px',
                  height: '47px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '36px',
                  lineHeight: '130%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Frequently Asked Questions
              </h2>
              
              {/* Description */}
              <p
                style={{
                  width: '847px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Everything you need to know about your subscription.
              </p>
            </div>
            
            {/* FAQ Tiles Container */}
            <div
              className="calculator-faq-list"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                width: '1064px',
                marginTop: isAuthenticated ? '24px' : '48px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* FAQ Tile 1 */}
              <div
                className="relative overflow-hidden calculator-tile calculator-faq-tile"
                style={{
                  width: '1064px',
                  height: expandedTiles[0] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(0)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Can I cancel anytime?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[0] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[0] && (
                  <div className="relative z-10 mt-4 calculator-faq-answer" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Yes - your access continues until your period ends.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 2 */}
              <div
                className="relative overflow-hidden calculator-tile calculator-faq-tile"
                style={{
                  width: '1064px',
                  height: expandedTiles[1] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(1)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Do you offer refunds?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[1] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[1] && (
                  <div className="relative z-10 mt-4 calculator-faq-answer" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Answer placeholder text - will be updated later.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 3 */}
              <div
                className="relative overflow-hidden calculator-tile calculator-faq-tile"
                style={{
                  width: '1064px',
                  height: expandedTiles[2] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(2)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    What's Included?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[2] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[2] && (
                  <div className="relative z-10 mt-4 calculator-faq-answer" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Answer placeholder text - will be updated later.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 4 */}
              <div
                className="relative overflow-hidden calculator-tile calculator-faq-tile"
                style={{
                  width: '1064px',
                  height: expandedTiles[3] ? 'auto' : '68px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  padding: '24px',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  transition: 'height 0.3s ease',
                }}
                onClick={() => toggleTile(3)}
              >
                {/* Curved Gradient Border */}
                <div 
                  className="absolute inset-0 pointer-events-none rounded-2xl"
                  style={{
                    borderRadius: '16px',
                    padding: '1px',
                    background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)'
                  }}
                >
                  <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between" style={{ width: '100%' }}>
                  <h3
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '20px',
                      lineHeight: '100%',
                      letterSpacing: '0%',
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Will you add more features?
                  </h3>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: expandedTiles[3] ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0,
                    }}
                  >
                    <path
                      d="M5 7.5L10 12.5L15 7.5"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {expandedTiles[3] && (
                  <div className="relative z-10 mt-4 calculator-faq-answer" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Answer placeholder text - will be updated later.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            {isAuthenticated && (
              <div className="mt-16 mb-16 w-full" style={{ marginTop: '220px' }}>
                <NewsletterSubscription />
              </div>
            )}
            {/* Page content will go here */}
          </div>
        </div>
      </div>
      
      {/* Methodology Popup */}
      {showMethodologyPopup && (
        <div
          ref={backdropRef}
          className="methodology-popup-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 10002,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            overflow: 'auto',
          }}
          onClick={() => setShowMethodologyPopup(false)}
        >
          <div
            ref={popupContentRef}
            data-popup-content
            className="methodology-popup-content"
            style={{
              position: 'relative',
              width: '630px',
              maxWidth: '100%',
              background: '#1F1F1F',
              borderRadius: '16px',
              padding: '24px',
              gap: '24px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 10003,
              flexShrink: 0,
              maxHeight: '90vh',
              overflowY: 'auto',
              margin: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div
              className="methodology-popup-header"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                width: '100%',
                marginBottom: '5px',
                position: 'relative',
              }}
            >
              {/* Heading and Description */}
              <div
                className="methodology-popup-header-row"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '63px',
                  width: '100%',
                }}
              >
                <div 
                  className="methodology-popup-title-container"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '4px',
                    flex: 1,
                  }}
                >
                  <h2
                    className="methodology-popup-title"
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '24px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                    }}
                  >
                    Screening Methodology
                  </h2>
                </div>
                
                {/* Close Button */}
                <button
                  className="methodology-popup-close-btn"
                  onClick={() => setShowMethodologyPopup(false)}
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '1px solid #AFB9BF',
                    borderRadius: '20px',
                    background: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    flex: 'none',
                    flexGrow: 0,
                    position: 'relative',
                    boxSizing: 'border-box',
                  }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.border = '1px solid #AFB9BF';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.border = '1px solid #AFB9BF';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid #AFB9BF';
                }}
              >
                {/* X Icon */}
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 8 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <path
                    d="M1 1L7 7M7 1L1 7"
                    stroke="#AFB9BF"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              </div>
              <p
                className="methodology-popup-description"
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: 0,
                  lineHeight: '130%',
                }}
              >
                Comprehensive framework aligned with AAOIFI standards
              </p>
            </div>
            
            {/* Content Area */}
            <div 
              className="methodology-popup-content-area"
              style={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Financial Ratios Box */}
              <div
                className="methodology-popup-section"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  padding: '20px',
                  gap: '16px',
                  width: '560px',
                  maxWidth: '560px',
                  minHeight: '252px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'visible',
                }}
              >
                {/* Heading */}
                <h3
                  className="methodology-popup-section-title"
                  style={{
                    width: '100%',
                    minHeight: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Financial Ratios
                </h3>
                
                {/* Bullet List */}
                <div
                  className="methodology-popup-bullet-list"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '100%',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Debt to Market Cap */}
                  <div
                    className="methodology-popup-bullet-item"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '100%',
                      minHeight: '36px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      className="methodology-popup-bullet-row"
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        padding: '0px',
                        gap: '8px',
                        width: '100%',
                        minHeight: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        className="methodology-popup-bullet-dot"
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                      <span
                        className="methodology-popup-bullet-text"
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      >
                        Debt to Market Cap
                      </span>
                    </div>
                    <div
                      className="methodology-popup-bullet-description"
                      style={{
                        width: '100%',
                        minHeight: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '140%',
                          color: 'rgba(255, 255, 255, 0.3)',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          display: 'block',
                        }}
                      >
                        Total debt should not exceed one-third of market capitalization
                      </span>
                    </div>
                  </div>
                  
                  {/* Bullet 2: Cash & Interest Securities */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '100%',
                      minHeight: '36px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        padding: '0px',
                        gap: '8px',
                        width: '100%',
                        minHeight: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      >
                        Cash & Interest Securities
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        minHeight: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '140%',
                          color: 'rgba(255, 255, 255, 0.3)',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          display: 'block',
                        }}
                      >
                        Interest-bearing assets limited to one-third of total assets
                      </span>
                    </div>
                  </div>
                  
                  {/* Bullet 3: Accounts Receivable */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '100%',
                      minHeight: '36px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        padding: '0px',
                        gap: '8px',
                        width: '100%',
                        minHeight: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      >
                        Accounts Receivable
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        minHeight: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '140%',
                          color: 'rgba(255, 255, 255, 0.3)',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          display: 'block',
                        }}
                      >
                        Receivables should be less than 49% of total assets
                      </span>
                    </div>
                  </div>
                  
                  {/* Bullet 4: Interest Income */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '100%',
                      minHeight: '36px',
                      flex: 'none',
                      order: 4,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        padding: '0px',
                        gap: '8px',
                        width: '100%',
                        minHeight: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#FFFFFF',
                          borderRadius: '50%',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          flexShrink: 0,
                          marginTop: '3px',
                        }}
                      />
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                        }}
                      >
                        Interest Income
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        minHeight: '14px',
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '140%',
                          color: 'rgba(255, 255, 255, 0.3)',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word',
                          display: 'block',
                        }}
                      >
                        Income from interest sources must be below 5% of total revenue
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Governance & Ethics Box */}
              <div
                className="methodology-popup-section"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '12px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '164px',
                  background: '#1F1F1F',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  className="methodology-popup-section-title"
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    marginBottom: '5px',
                  }}
                >
                  Governance & Ethics
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '12px',
                    width: '520px',
                    height: '92px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Transparent financial reporting */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '199px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Transparent financial reporting
                    </span>
                  </div>
                  
                  {/* Bullet 2: Ethical business practices */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '165px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Ethical business practices
                    </span>
                  </div>
                  
                  {/* Bullet 3: No involvement in harmful activities */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '228px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      No involvement in harmful activities
                    </span>
                  </div>
                  
                  {/* Bullet 4: Compliance with international standards */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '263px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Compliance with international standards
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Prohibited Business Activities Box */}
              <div
                className="methodology-popup-section"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '12px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '242px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  className="methodology-popup-section-title"
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    marginBottom: '5px',
                  }}
                >
                  Prohibited Business Activities
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '12px',
                    width: '520px',
                    height: '170px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Alcohol production or distribution */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '214px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Alcohol production or distribution
                    </span>
                  </div>
                  
                  {/* Bullet 2: Conventional banking and insurance */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '237px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Conventional banking and insurance
                    </span>
                  </div>
                  
                  {/* Bullet 3: Adult entertainment and media */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '203px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Adult entertainment and media
                    </span>
                  </div>
                  
                  {/* Bullet 4: Weapons and defense (controversial) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '240px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Weapons and defense (controversial)
                    </span>
                  </div>
                  
                  {/* Bullet 5: Gambling and gaming operations */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 4,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '219px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Gambling and gaming operations
                    </span>
                  </div>
                  
                  {/* Bullet 6: Pork and pork-related products */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 5,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '204px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Pork and pork-related products
                    </span>
                  </div>
                  
                  {/* Bullet 7: Tobacco (threshold < 5% revenue) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 6,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '214px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Tobacco (threshold &lt; 5% revenue)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Data Sources Box */}
              <div
                className="methodology-popup-section"
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '12px',
                  width: '560px',
                  maxWidth: '560px',
                  height: '190px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'center',
                  flexGrow: 0,
                  overflow: 'hidden',
                }}
              >
                {/* Heading */}
                <h3
                  className="methodology-popup-section-title"
                  style={{
                    width: '520px',
                    height: '20px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '20px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    marginBottom: '5px',
                  }}
                >
                  Data Sources
                </h3>
                
                {/* Bullet List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '12px',
                    width: '520px',
                    height: '118px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Bullet 1: Company financial statements (10-K, 10-Q) */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '278px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Company financial statements (10-K, 10-Q)
                    </span>
                  </div>
                  
                  {/* Bullet 2: AAOIFI Shariah standards */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '165px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      AAOIFI Shariah standards
                    </span>
                  </div>
                  
                  {/* Bullet 3: Leading Islamic finance scholars */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '208px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Leading Islamic finance scholars
                    </span>
                  </div>
                  
                  {/* Bullet 4: Third-party financial databases */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 3,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '206px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Third-party financial databases
                    </span>
                  </div>
                  
                  {/* Bullet 5: Industry research and analysis */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: '0px',
                      gap: '8px',
                      width: '520px',
                      height: '14px',
                      flex: 'none',
                      order: 4,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFFFFF',
                        borderRadius: '50%',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                      }}
                    />
                    <span
                      style={{
                        width: '194px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      Industry research and analysis
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <div className="methodology-popup-close-button-container" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
              <button
                className="methodology-popup-close-button"
                onClick={() => setShowMethodologyPopup(false)}
                style={{
                  width: '560px',
                  maxWidth: '560px',
                  padding: '12px 32px',
                  background: '#FFFFFF',
                  color: '#0A0A0A',
                  borderRadius: '100px',
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '14px',
                  fontWeight: 400,
                  border: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.currentTarget.style.border = 'none';
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.border = 'none';
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = 'none';
              }}
            >
              Close
            </button>
          </div>
        </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}


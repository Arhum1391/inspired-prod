'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { useState, useEffect } from 'react';
import type { ShariahTile, ComplianceMetric, CustomTable } from '@/types/admin';

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

interface ShariahDetailsPageProps {
  fundId: string;
}

export default function ShariahDetailsPage({ fundId }: ShariahDetailsPageProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileComplianceModalOpen, setIsMobileComplianceModalOpen] = useState(false);
  const [isDesktopComplianceModalOpen, setIsDesktopComplianceModalOpen] = useState(false);
  const [tile, setTile] = useState<ShariahTile | null>(null);
  const [tileLoading, setTileLoading] = useState(true);
  const [tileError, setTileError] = useState<string | null>(null);

  const fallbackComplianceMetrics: ComplianceMetric[] = [
    {
      criteria: 'Debt to Market Cap',
      threshold: '< 33%',
      actual: '0%',
      comparisonType: 'less_than',
    },
    {
      criteria: 'Interest Income',
      threshold: '< 5%',
      actual: '0%',
      comparisonType: 'less_than',
    },
    {
      criteria: 'Business Activity',
      threshold: 'Halal',
      actual: 'Permissible',
      comparisonType: 'custom',
      customStatus: 'pass',
    },
    {
      criteria: 'Cash Holdings',
      threshold: '< 33%',
      actual: '12%',
      comparisonType: 'less_than',
    },
  ];

  const parseNumericValue = (value: string) => {
    if (!value) return null;
    const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  };

  const metricIsPass = (metric: ComplianceMetric) => {
    const comparison = metric.comparisonType || 'less_than';
    if (comparison === 'custom') {
      return (metric.customStatus || 'pass').toLowerCase() !== 'fail';
    }
    const actualVal = parseNumericValue(metric.actual);
    const thresholdVal = parseNumericValue(metric.threshold);
    if (actualVal === null || thresholdVal === null) {
      return true;
    }
    switch (comparison) {
      case 'less_than':
        return actualVal <= thresholdVal;
      case 'greater_than':
        return actualVal >= thresholdVal;
      case 'equal':
        return Math.abs(actualVal - thresholdVal) < 0.001;
      default:
        return true;
    }
  };

  const metricStatusLabel = (metric: ComplianceMetric) => (metricIsPass(metric) ? 'Pass' : 'Fail');

  const renderMobileComplianceCard = (metric: ComplianceMetric, index: number) => {
    const isPass = metricIsPass(metric);
    const statusLabel = metricStatusLabel(metric);

    return (
      <div
        key={`${metric.criteria}-${index}`}
        className="w-full max-w-full p-4 sm:p-5 gap-5 border border-white/30 rounded-lg flex flex-col justify-center items-center box-border min-h-[180px] sm:min-h-[200px]"
      >
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Status
            </span>
          </div>
          <span
            className={`text-sm leading-none text-right flex-1 ${
              isPass ? 'text-[#05B353]' : 'text-[#FF4D4D]'
            }`}
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {statusLabel}
          </span>
        </div>
        <div className="w-full h-px border-t border-[#404040]" />
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Criteria
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.criteria}
          </span>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Threshold
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.threshold}
          </span>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Actual
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.actual}
          </span>
        </div>
      </div>
    );
  };

  const renderModalComplianceCard = (metric: ComplianceMetric, index: number) => {
    const isPass = metricIsPass(metric);
    const statusLabel = metricStatusLabel(metric);

    return (
      <div
        key={`modal-${metric.criteria}-${index}`}
        className="shariah-details-compliance-card w-full max-w-full min-h-[152px] p-4 gap-4 border border-white/30 rounded-lg flex flex-col justify-center items-center box-border flex-shrink-0 overflow-hidden"
      >
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0 flex-shrink-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white flex-shrink-0"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Status
            </span>
          </div>
          <span
            className={`text-sm leading-none text-right flex-1 ${
              isPass ? 'text-[#05B353]' : 'text-[#FF4D4D]'
            }`}
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {statusLabel}
          </span>
        </div>
        <div className="w-full h-px border-t border-[#404040] flex-shrink-0" />
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0 flex-shrink-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white flex-shrink-0"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Criteria
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.criteria}
          </span>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0 flex-shrink-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white flex-shrink-0"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Threshold
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.threshold}
          </span>
        </div>
        <div className="w-full flex flex-row justify-between items-center gap-4 p-0 flex-shrink-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white flex-shrink-0"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              Actual
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.actual}
          </span>
        </div>
      </div>
    );
  };

  const renderDesktopComplianceRow = (metric: ComplianceMetric, index: number) => {
    const isPass = metricIsPass(metric);
    const statusLabel = metricStatusLabel(metric);

    return (
      <div
        key={`${metric.criteria}-${index}`}
        className="hidden lg:grid lg:grid-cols-4 gap-6 w-full p-4 border-b border-white/10"
      >
        <div className="flex flex-col justify-center items-start p-0">
          <span
            className="text-sm leading-none text-[#909090]"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.criteria}
          </span>
        </div>
        <div className="flex flex-col justify-center items-end p-0">
          <span
            className="text-sm leading-none text-[#909090] text-right"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.threshold}
          </span>
        </div>
        <div className="flex flex-col justify-center items-end p-0">
          <span
            className="text-sm leading-none text-[#909090] text-right"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {metric.actual}
          </span>
        </div>
        <div className="flex flex-col justify-center items-end p-0">
          <span
            className="text-sm leading-none text-right"
            style={{
              fontFamily: 'Gilroy-Medium',
              fontWeight: 400,
              color: isPass ? '#05B353' : '#FF4D4D'
            }}
          >
            {statusLabel}
          </span>
        </div>
      </div>
    );
  };

  // Custom Table Render Functions
  const renderCustomTableMobileCard = (row: { values: string[] }, headings: string[], index: number) => {
    const cardElements: JSX.Element[] = [];
    
    // First row - no divider before
    cardElements.push(
      <div key={`row-0`} className="w-full flex flex-row justify-between items-center gap-4 p-0">
        <div className="flex flex-row items-center gap-2 p-0 flex-1">
          <span 
            className="text-sm leading-none text-white"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {headings[0]}
          </span>
        </div>
        <span 
          className="text-sm leading-none text-[#909090] text-right flex-1"
          style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
        >
          {row.values[0] || ''}
        </span>
      </div>
    );
    
    // Remaining rows with dividers between each row
    headings.slice(1).forEach((heading, colIndex) => {
      // Add divider before each row (except the first)
      cardElements.push(
        <div key={`divider-${colIndex + 1}`} className="w-full h-px border-t border-[#404040]" />
      );
      // Add the row
      cardElements.push(
        <div key={`row-${colIndex + 1}`} className="w-full flex flex-row justify-between items-center gap-4 p-0">
          <div className="flex flex-row items-center gap-2 p-0 flex-1">
            <span 
              className="text-sm leading-none text-white"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              {heading}
            </span>
          </div>
          <span 
            className="text-sm leading-none text-[#909090] text-right flex-1"
            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
          >
            {row.values[colIndex + 1] || ''}
          </span>
        </div>
      );
    });

    return (
      <div
        key={`custom-${index}`}
        className="w-full max-w-full p-4 sm:p-5 gap-5 border border-white/30 rounded-lg flex flex-col justify-center items-center box-border min-h-[180px] sm:min-h-[200px]"
      >
        {cardElements}
      </div>
    );
  };

  const renderCustomTableModalCard = (row: { values: string[] }, headings: string[], index: number) => {
    return (
      <div
        key={`custom-modal-${index}`}
        className="shariah-details-compliance-card w-full max-w-full min-h-[152px] p-4 gap-4 border border-white/30 rounded-lg flex flex-col justify-center items-center box-border flex-shrink-0 overflow-hidden"
      >
        {headings.map((heading, colIndex) => (
          <div key={colIndex}>
            {colIndex > 0 && <div className="w-full h-px border-t border-[#404040] mb-2 mt-2 flex-shrink-0" />}
            <div className="w-full flex flex-row justify-between items-center gap-4 p-0 flex-shrink-0">
              <div className="flex flex-row items-center gap-2 p-0 flex-1">
                <span 
                  className="text-sm leading-none text-white flex-shrink-0"
                  style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                >
                  {heading}
                </span>
              </div>
              <span 
                className="text-sm leading-none text-[#909090] text-right flex-1"
                style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
              >
                {row.values[colIndex] || ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCustomTableDesktopRow = (row: { values: string[] }, headings: string[], index: number) => {
    return (
      <div
        key={`custom-desktop-${index}`}
        className="hidden lg:grid lg:grid-cols-4 gap-6 w-full p-4 border-b border-white/10"
      >
        {headings.map((heading, colIndex) => (
          <div key={colIndex} className={`flex flex-col justify-center p-0 ${colIndex === 0 ? 'items-start' : 'items-end'}`}>
            <span
              className={`text-sm leading-none text-[#909090] ${colIndex === 0 ? 'text-left' : 'text-right'}`}
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              {row.values[colIndex] || ''}
            </span>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchTile = async () => {
      try {
        setTileLoading(true);
        const response = await fetch(`/api/shariah-tiles/${fundId}`);
        if (!response.ok) {
          throw new Error('Failed to load Shariah tile');
        }
        const data = await response.json();
        setTile(data);
        setTileError(null);
      } catch (error) {
        console.error('Failed to load Shariah tile:', error);
        setTileError('Unable to load this fund right now.');
        setTile(null);
      } finally {
        setTileLoading(false);
      }
    };

    fetchTile();
  }, [fundId]);

  // Close modal when screen size changes from mobile to desktop
  useEffect(() => {
    if (!isMobile && isMobileComplianceModalOpen) {
      setIsMobileComplianceModalOpen(false);
    }
  }, [isMobile, isMobileComplianceModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isMobileComplianceModalOpen || isDesktopComplianceModalOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPosition = window.getComputedStyle(document.body).position;
      const originalTop = window.getComputedStyle(document.body).top;
      const originalWidth = window.getComputedStyle(document.body).width;

      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${window.scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        const scrollY = document.body.style.top;
        document.body.style.overflow = originalStyle;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        if (scrollY) {
          window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }
      };
    }
  }, [isMobileComplianceModalOpen, isDesktopComplianceModalOpen]);

  const handleBack = () => {
    router.push('/shariah');
  };

  if (tileLoading) {
    return <LoadingScreen message="Loading..." />;
  }

  if (tileError || !tile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>{tileError || 'Fund not found.'}</div>
      </div>
    );
  }

  // Only use actual compliance metrics, no fallback
  const complianceMetrics = tile.complianceMetrics && tile.complianceMetrics.length > 0
    ? tile.complianceMetrics
    : [];

  // Calculate mobile tile height based on number of visible cards (1-5)
  const visibleCardsCount = Math.min(complianceMetrics.length, 5);
  const cardHeight = 152;
  const cardGap = 16;
  const headerHeight = 50; // Title + View All button
  const tilePadding = 32; // 20px top + 12px bottom
  const extraSpacing = 40; // Increased for better spacing
  const mobileTileHeight = headerHeight + tilePadding + (visibleCardsCount * cardHeight) + ((visibleCardsCount - 1) * cardGap) + extraSpacing;

  // Calculate analyst notes position dynamically based on tile position and height
  const mobileTileTop = 353; // Compliance tile top position on mobile
  const mobileAnalystNotesSpacing = 40; // Spacing between tile and analyst notes on mobile
  const mobileAnalystNotesTop = mobileTileTop + mobileTileHeight + mobileAnalystNotesSpacing;
  
  // For relative positioning on mobile, calculate margin-top from top of wrapper
  // The wrapper has padding (px-4 = 16px on mobile), and the compliance tile is at top: 353px
  // So margin-top should be: tile top + tile height + spacing
  const mobileAnalystNotesMarginTop = mobileTileTop + mobileTileHeight + mobileAnalystNotesSpacing;

  const desktopTileTop = 604; // Compliance tile top position on desktop
  const desktopTileHeight = 384; // Fixed desktop tile height
  const desktopAnalystNotesSpacing = 140; // Spacing between tile and analyst notes on desktop
  const desktopAnalystNotesTop = desktopTileTop + desktopTileHeight + desktopAnalystNotesSpacing;

  // Calculate analyst notes height dynamically
  const analystNotesMinHeight = 145; // Minimum height for analyst notes section
  const analystNotesHeadingHeight = isMobile ? 58 : 58; // Heading height (same for both)
  const analystNotesTextMinHeight = 63; // Text min height
  // Text height can vary, so we use min-height but account for potential expansion
  const analystNotesGap = isMobile ? 8 : 24; // Gap between heading and text
  const analystNotesPadding = isMobile ? 0 : 0; // Padding is 0px for both
  // Use a reasonable estimate for analyst notes height (can expand if content is longer)
  const analystNotesHeight = Math.max(
    analystNotesMinHeight,
    analystNotesHeadingHeight + analystNotesTextMinHeight + analystNotesGap + analystNotesPadding
  );

  // Calculate where analyst notes section ends (bottom position)
  const mobileAnalystNotesBottom = mobileAnalystNotesTop + analystNotesHeight;
  const desktopAnalystNotesBottom = desktopAnalystNotesTop + analystNotesHeight;

  // Calculate footer spacing dynamically based on analyst notes
  const mobileFooterSpacing = 16; // Minimal spacing between analyst notes and footer on mobile
  const desktopFooterSpacing = 120; // Spacing between analyst notes and footer on desktop (marginBottom)

  // Calculate minimum page height to accommodate all content + footer
  // Footer component has its own padding (py-12 on mobile, py-16 on desktop), so we account for that
  const footerApproxHeight = isMobile ? 150 : 250; // Approximate footer content height (excluding padding)
  const footerPadding = isMobile ? 48 : 64; // Footer padding (py-12 = 48px, py-16 = 64px)
  const mobilePageMinHeight = mobileAnalystNotesTop + analystNotesHeight + mobileFooterSpacing + footerApproxHeight + footerPadding;
  const desktopPageMinHeight = desktopAnalystNotesTop + analystNotesHeight + desktopFooterSpacing + footerApproxHeight + footerPadding;

  return (
    <div 
      className="bg-[#0A0A0A] text-white relative min-h-screen w-full overflow-x-hidden"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Custom Minimal Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        /* Compliance Modal Mobile Styles - Keep minimal styles for modal */
          .shariah-details-compliance-mobile-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            background: rgba(0, 0, 0, 0.6) !important;
            backdrop-filter: blur(4px) !important;
            -webkit-backdrop-filter: blur(4px) !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
            z-index: 10000 !important;
            padding: 80px 16px 16px 16px !important;
            margin: 0 !important;
            overflow-x: hidden !important;
            box-sizing: border-box !important;
          }
          .shariah-details-compliance-mobile-modal-content {
            max-height: calc(100vh - 32px) !important;
            max-width: calc(100vw - 32px) !important;
            width: 100% !important;
            min-width: 0 !important;
            background: #1F1F1F !important;
            border-radius: 16px !important;
            padding: 24px 12px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            box-sizing: border-box !important;
            position: relative !important;
            margin: 0 auto !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
          }
          .shariah-details-compliance-mobile-modal-close {
            width: 24px !important;
            height: 24px !important;
            border-radius: 12px !important;
            border: 1px solid #AFB9BF !important;
            background: transparent !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            cursor: pointer !important;
            padding: 0 !important;
            align-self: flex-end !important;
            position: absolute !important;
            top: 24px !important;
            right: 12px !important;
          }
          .shariah-details-compliance-mobile-modal-title {
            font-family: 'Gilroy-SemiBold' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 24px !important;
            line-height: 125% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            margin-bottom: 4px !important;
          }
          .shariah-details-compliance-mobile-modal-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
            padding-right: 4px !important;
            align-items: center !important;
            box-sizing: border-box !important;
            padding-left: 4px !important;
          }
          .shariah-details-compliance-mobile-modal-list .shariah-details-compliance-card {
            display: flex !important;
        }
      `}} />
      <Navbar />

      {/* Background Gradient - Mobile (Original) */}
      {isMobile && (
        <svg
          width="507"
          height="713"
          viewBox="0 0 507 713"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <g filter="url(#filter0_f_1639_1215)">
            <circle cx="594.064" cy="118.608" r="294" transform="rotate(-153.197 594.064 118.608)" fill="url(#paint0_linear_1639_1215)" />
          </g>
          <defs>
            <filter id="filter0_f_1639_1215" x="0" y="-475.457" width="1188.13" height="1188.13" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur_1639_1215" />
            </filter>
            <linearGradient id="paint0_linear_1639_1215" x1="362.934" y1="-145.173" x2="920.636" y2="32.5919" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3813F3" />
              <stop offset="0.32" stopColor="#05B0B3" />
              <stop offset="0.64" stopColor="#4B25FD" />
              <stop offset="0.8" stopColor="#B9B9E9" />
              <stop offset="1" stopColor="#DE50EC" />
            </linearGradient>
          </defs>
        </svg>
      )}

      {/* Background Gradient - Desktop (Web Version) */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            width: '588px',
            height: '588px',
            left: '1132.63px',
            top: '-276.38px',
            background: 'linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%)',
            filter: 'blur(150px)',
            transform: 'rotate(-153.2deg)',
            zIndex: 0,
            pointerEvents: 'none',
            borderRadius: '50%',
          }}
        />
      )}

      <div 
        className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-start justify-start px-4 sm:px-6 lg:px-12 xl:px-16 pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-24" 
      >
        {/* Content Container */}
        <div
          className="w-full max-w-4xl lg:max-w-5xl flex flex-col items-start gap-6 mb-8 sm:mb-12 lg:mb-16"
        >
          <div
            className="w-full flex flex-col items-start gap-6"
          >
            {/* Back Button Row */}
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-white hover:text-gray-300 transition-colors focus:outline-none bg-transparent border-none cursor-pointer p-0 text-base leading-none relative z-20"
              style={{ fontFamily: 'Gilroy-Medium' }}
              onFocus={(e) => e.target.blur()}
            >
              <ChevronLeft size={16} className="flex-shrink-0" />
              <span>Back</span>
            </button>

            {/* Heading */}
            <h1
              className="w-full text-3xl sm:text-4xl lg:text-5xl leading-[120%] text-white m-0"
              style={{ fontFamily: 'Gilroy-SemiBold', fontWeight: 400 }}
            >
              {tile.title}
            </h1>

            {/* Description */}
            <p
              className="w-full text-base leading-[130%] text-white m-0"
              style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
            >
              {tile.description}
            </p>

            {/* Footer Row */}
            <div
              className="w-full flex flex-row items-center gap-4"
            >
              {/* Footer Left */}
              <span
                className="text-sm leading-none text-white"
                style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
              >
                {tile.footerLeft}
              </span>

              {/* Dot Separator */}
              <div
                className="w-1.5 h-1.5 bg-[#D9D9D9] rounded-full flex-shrink-0"
              />

              {/* Footer Right */}
              <span
                className="text-sm leading-none text-white"
                style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
              >
                {formatFooterDate(tile.footerRight)}
              </span>
            </div>
          </div>
        </div>

        {/* Compliance Breakdown Tile - Only show if compliance metrics exist */}
        {complianceMetrics.length > 0 && (
        <div
          className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mb-8 sm:mb-12 lg:mb-16 rounded-2xl bg-[#1F1F1F] p-3 sm:p-4 lg:p-5 flex flex-col items-start gap-4 lg:gap-6 relative overflow-hidden"
        >
          {/* Curved Gradient Border - Desktop */}
          <div
            className="hidden lg:block absolute inset-0 pointer-events-none rounded-2xl p-[1px] z-0"
            style={{
              background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
            }}
          >
            <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
          </div>

          <div
            className="w-full h-full rounded-2xl bg-transparent p-3 sm:p-4 lg:p-5 flex flex-col items-start relative overflow-hidden z-10"
          >

            <div
              className="w-full flex flex-col items-start gap-3 lg:gap-3 p-0 relative z-10 box-border min-h-[200px] sm:min-h-[250px]"
            >
              {/* Header with Title and View All */}
              <div
                className="w-full flex flex-row items-start justify-between gap-4 p-0 mb-2 lg:mb-4 relative z-10"
              >
                <div
                  className="flex flex-col items-start gap-0 lg:gap-3 p-0 flex-1"
                >
                  <h2
                    className="w-full text-xl sm:text-2xl text-white m-0 relative z-10"
                    style={{ fontFamily: 'Gilroy-SemiBold', fontWeight: 400 }}
                  >
                    Compliance Breakdown
                  </h2>
                </div>
                {complianceMetrics.length > 0 && (
                  <button
                    className="flex flex-row items-center gap-1 bg-transparent border-none cursor-pointer p-0 relative z-10 self-start mt-0"
                    onClick={() => {
                      if (isMobile) {
                        setIsMobileComplianceModalOpen(true);
                      } else {
                        setIsDesktopComplianceModalOpen(true);
                      }
                    }}
                  >
                    <span className="text-xs sm:text-sm lg:text-sm text-white" style={{ fontFamily: 'Gilroy-SemiBold' }}>View All</span>
                    <ChevronLeft size={16} className="rotate-180 text-white" />
                  </button>
                )}
              </div>

              {/* Desktop Table Header */}
              <div
                className="hidden lg:grid lg:grid-cols-4 gap-6 w-full p-4 border-b border-white/30"
              >
                {/* Criteria Column */}
                <div className="flex flex-col justify-center items-start p-0">
                  <span
                    className="text-sm leading-none text-white"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Criteria
                  </span>
                </div>

                {/* Threshold Column */}
                <div className="flex flex-col justify-center items-end p-0">
                  <span
                    className="text-sm leading-none text-white text-right"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Threshold
                  </span>
                </div>

                {/* Actual Column */}
                <div className="flex flex-col justify-center items-end p-0">
                  <span
                    className="text-sm leading-none text-white text-right"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Actual
                  </span>
                </div>

                {/* Status Column */}
                <div className="flex flex-col justify-center items-end p-0">
                  <span
                    className="text-sm leading-none text-white text-right"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Status
                  </span>
                </div>
              </div>

              {false && (
                <>
                  {/* Mobile Cards Container */}
                  <div
                    className="shariah-details-compliance-cards-container"
                    style={{
                      display: 'none',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '16px',
                      width: '319px',
                    }}
                  >
                    {/* Card 1: Debt to Market Cap */}
                    <div
                      className="shariah-details-compliance-card"
                      style={{
                        display: 'none',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px 12px',
                        gap: '16px',
                        width: '319px',
                        height: '152px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                      }}
                    >
                      {/* Status Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Status</span>
                        </div>
                        <span className="shariah-details-compliance-card-value status">Pass</span>
                      </div>
                      {/* Divider */}
                      <div className="shariah-details-compliance-card-divider" />
                      {/* Criteria Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Criteria</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">Debt to Market Cap</span>
                      </div>
                      {/* Threshold Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Threshold</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">&lt; 33%</span>
                      </div>
                      {/* Actual Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Actual</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">0%</span>
                      </div>
                    </div>

                    {/* Card 2: Interest Income */}
                    <div
                      className="shariah-details-compliance-card"
                      style={{
                        display: 'none',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px 12px',
                        gap: '16px',
                        width: '319px',
                        height: '152px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                      }}
                    >
                      {/* Status Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Status</span>
                        </div>
                        <span className="shariah-details-compliance-card-value status">Pass</span>
                      </div>
                      {/* Divider */}
                      <div className="shariah-details-compliance-card-divider" />
                      {/* Criteria Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Criteria</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">Interest Income</span>
                      </div>
                      {/* Threshold Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Threshold</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">&lt; 5%</span>
                      </div>
                      {/* Actual Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Actual</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">0%</span>
                      </div>
                    </div>

                    {/* Card 3: Business Activity */}
                    <div
                      className="shariah-details-compliance-card"
                      style={{
                        display: 'none',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px 12px',
                        gap: '16px',
                        width: '319px',
                        height: '152px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                      }}
                    >
                      {/* Status Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Status</span>
                        </div>
                        <span className="shariah-details-compliance-card-value status">Pass</span>
                      </div>
                      {/* Divider */}
                      <div className="shariah-details-compliance-card-divider" />
                      {/* Criteria Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Criteria</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">Business Activity</span>
                      </div>
                      {/* Threshold Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Threshold</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">Halal</span>
                      </div>
                      {/* Actual Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Actual</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">Permissible</span>
                      </div>
                    </div>

                    {/* Card 4: Cash Holdings */}
                    <div
                      className="shariah-details-compliance-card"
                      style={{
                        display: 'none',
                        boxSizing: 'border-box',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px 12px',
                        gap: '16px',
                        width: '319px',
                        height: '152px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                      }}
                    >
                      {/* Status Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Status</span>
                        </div>
                        <span className="shariah-details-compliance-card-value status">Pass</span>
                      </div>
                      {/* Divider */}
                      <div className="shariah-details-compliance-card-divider" />
                      {/* Criteria Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Criteria</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">Cash Holdings</span>
                      </div>
                      {/* Threshold Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Threshold</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">&lt; 33%</span>
                      </div>
                      {/* Actual Row */}
                      <div className="shariah-details-compliance-card-row">
                        <div className="shariah-details-compliance-card-label-group">
                          <span className="shariah-details-compliance-card-label">Actual</span>
                        </div>
                        <span className="shariah-details-compliance-card-value">N/A</span>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Data Rows Container */}
                  <div
                    className="shariah-details-compliance-table-rows"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '8px',
                      width: '100%',
                      maxWidth: '1024px',
                      height: '208px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Row 1: Debt to Market Cap */}
                    <div
                      className="shariah-details-compliance-table-row"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1024px',
                        height: '46px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Criteria */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Debt to Market Cap
                        </span>
                      </div>

                      {/* Threshold */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          &lt; 33%
                        </span>
                      </div>

                      {/* Actual */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          0%
                        </span>
                      </div>

                      {/* Status */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#05B353',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Pass
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Interest Income */}
                    <div
                      className="shariah-details-compliance-table-row"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1024px',
                        height: '46px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Criteria */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Interest Income
                        </span>
                      </div>

                      {/* Threshold */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          &lt; 5%
                        </span>
                      </div>

                      {/* Actual */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          0%
                        </span>
                      </div>

                      {/* Status */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#05B353',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Pass
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Business Activity */}
                    <div
                      className="shariah-details-compliance-table-row"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1024px',
                        height: '46px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        flex: 'none',
                        order: 2,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Criteria */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Business Activity
                        </span>
                      </div>

                      {/* Threshold */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Halal
                        </span>
                      </div>

                      {/* Actual */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Permissible
                        </span>
                      </div>

                      {/* Status */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#05B353',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Pass
                        </span>
                      </div>
                    </div>

                    {/* Row 4: Cash Holdings */}
                    <div
                      className="shariah-details-compliance-table-row"
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1024px',
                        height: '46px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                        flex: 'none',
                        order: 3,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Criteria */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Cash Holdings
                        </span>
                      </div>

                      {/* Threshold */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          &lt; 33%
                        </span>
                      </div>

                      {/* Actual */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          N/A
                        </span>
                      </div>

                      {/* Status */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '230px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '230px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'right',
                            color: '#05B353',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Pass
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {/* Mobile Cards Container */}
              <div className="lg:hidden flex flex-col items-start gap-4 w-full p-0">
                {complianceMetrics.slice(0, visibleCardsCount).map((metric, index) => renderMobileComplianceCard(metric, index))}
              </div>

              {/* Desktop Data Rows Container */}
              <div className="hidden lg:flex lg:flex-col lg:items-start gap-2 w-full p-0">
                {complianceMetrics.map((metric, index) => renderDesktopComplianceRow(metric, index))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Custom Table Tile */}
        {tile.customTable && tile.customTable.headings && tile.customTable.headings.every(h => h.trim()) && tile.customTable.rows && tile.customTable.rows.length > 0 && (
          <div
            className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mb-8 sm:mb-12 lg:mb-16 rounded-2xl bg-[#1F1F1F] p-3 sm:p-4 lg:p-5 flex flex-col items-start gap-4 lg:gap-6 relative overflow-hidden"
          >
            {/* Curved Gradient Border - Desktop */}
            <div
              className="hidden lg:block absolute inset-0 pointer-events-none rounded-2xl p-[1px] z-0"
              style={{
                background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
              }}
            >
              <div className="w-full h-full rounded-[15px] bg-[#1F1F1F]"></div>
            </div>

            <div
              className="w-full h-full rounded-2xl bg-transparent p-3 sm:p-4 lg:p-5 flex flex-col items-start relative overflow-hidden z-10"
            >
              <div
                className="w-full flex flex-col items-start gap-3 lg:gap-3 p-0 relative z-10 box-border min-h-[200px] sm:min-h-[250px]"
              >
                {/* Header with Title */}
                <div
                  className="w-full flex flex-row items-start justify-between gap-4 p-0 mb-2 lg:mb-4 relative z-10"
                >
                  <div
                    className="flex flex-col items-start gap-0 lg:gap-3 p-0 flex-1"
                  >
                    <h2
                      className="w-full text-xl sm:text-2xl text-white m-0 relative z-10"
                      style={{ fontFamily: 'Gilroy-SemiBold', fontWeight: 400 }}
                    >
                      {tile.customTable.title}
                    </h2>
                  </div>
                </div>

                {/* Desktop Table Header */}
                <div className="hidden lg:grid lg:grid-cols-4 gap-6 w-full p-4 border-b border-white/30">
                  {tile.customTable.headings.map((heading, index) => (
                    <div key={index} className={`flex flex-col justify-center p-0 ${index === 0 ? 'items-start' : 'items-end'}`}>
                      <span
                        className={`text-sm leading-none text-white ${index === 0 ? 'text-left' : 'text-right'}`}
                        style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                      >
                        {heading}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Mobile Cards Container */}
                <div className="lg:hidden flex flex-col items-start gap-4 w-full p-0">
                  {(() => {
                    const customTableVisibleCardsCount = Math.min(tile.customTable.rows.length, 5);
                    return tile.customTable.rows.slice(0, customTableVisibleCardsCount).map((row, index) => 
                      renderCustomTableMobileCard(row, tile.customTable!.headings, index)
                    );
                  })()}
                </div>

                {/* Desktop Data Rows Container */}
                <div className="hidden lg:flex lg:flex-col lg:items-start gap-2 w-full p-0">
                  {tile.customTable.rows.map((row, index) => 
                    renderCustomTableDesktopRow(row, tile.customTable!.headings, index)
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analyst Notes Section */}
        <div
          className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl flex flex-col items-start gap-6 lg:gap-6 mb-8 sm:mb-12 lg:mb-16"
        >
          {/* Heading */}
          <h2
            className="w-full text-3xl sm:text-4xl lg:text-5xl leading-[120%] text-white m-0"
            style={{ fontFamily: 'Gilroy-SemiBold', fontWeight: 400 }}
          >
            Analyst Notes
          </h2>

          {/* Description */}
          <p
            className="w-full text-base leading-[130%] text-white m-0"
            style={{
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400
            }}
          >
            {tile.analystNotes}
          </p>
        </div>
      </div>

      {/* Mobile Spacer - no longer needed with relative positioning */}
      {!isMobile && (
        <div className="shariah-details-mobile-spacer" />
      )}

      {/* Desktop Compliance Modal */}
      {!isMobile && isDesktopComplianceModalOpen && complianceMetrics.length > 0 && (
        <div
          className="fixed inset-0 w-full h-full bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 lg:p-8"
          onClick={() => setIsDesktopComplianceModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] bg-[#1F1F1F] rounded-2xl p-5 lg:p-6 flex flex-col gap-6 relative overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              className="absolute top-5 right-5 lg:top-6 lg:right-6 w-6 h-6 rounded-full border border-[#AFB9BF] bg-transparent flex items-center justify-center cursor-pointer p-0 z-10"
              onClick={() => setIsDesktopComplianceModalOpen(false)}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7" stroke="#AFB9BF" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M7 1L1 7" stroke="#AFB9BF" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </button>

            {/* Title */}
            <h2 
              className="text-xl sm:text-2xl lg:text-2xl text-white m-0 pr-8"
              style={{ fontFamily: 'Gilroy-SemiBold', fontWeight: 400 }}
            >
              Compliance Breakdown
            </h2>

            {/* Scrollable Table Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-6 w-full p-4 border-b border-white/30 sticky top-0 bg-[#1F1F1F] z-10">
                <div className="flex flex-col justify-center items-start p-0">
                  <span
                    className="text-sm leading-none text-white"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Criteria
                  </span>
                </div>
                <div className="flex flex-col justify-center items-end p-0">
                  <span
                    className="text-sm leading-none text-white text-right"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Threshold
                  </span>
                </div>
                <div className="flex flex-col justify-center items-end p-0">
                  <span
                    className="text-sm leading-none text-white text-right"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Actual
                  </span>
                </div>
                <div className="flex flex-col justify-center items-end p-0">
                  <span
                    className="text-sm leading-none text-white text-right"
                    style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                  >
                    Status
                  </span>
                </div>
              </div>

              {/* Table Rows */}
              <div className="flex flex-col items-start gap-2 w-full p-0">
                {complianceMetrics.map((metric, index) => {
                  const isPass = metricIsPass(metric);
                  const statusLabel = metricStatusLabel(metric);
                  return (
                    <div
                      key={`modal-${metric.criteria}-${index}`}
                      className="grid grid-cols-4 gap-6 w-full p-4 border-b border-white/10"
                    >
                      <div className="flex flex-col justify-center items-start p-0">
                        <span
                          className="text-sm leading-none text-[#909090]"
                          style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                        >
                          {metric.criteria}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-end p-0">
                        <span
                          className="text-sm leading-none text-[#909090] text-right"
                          style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                        >
                          {metric.threshold}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-end p-0">
                        <span
                          className="text-sm leading-none text-[#909090] text-right"
                          style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                        >
                          {metric.actual}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center items-end p-0">
                        <span
                          className="text-sm leading-none text-right"
                          style={{ 
                            fontFamily: 'Gilroy-Medium', 
                            fontWeight: 400,
                            color: isPass ? '#05B353' : '#FF4D4D'
                          }}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Table Section in Modal */}
            {tile.customTable && tile.customTable.headings && tile.customTable.headings.every(h => h.trim()) && tile.customTable.rows && tile.customTable.rows.length > 0 && (
              <>
                <div className="border-t border-white/30 pt-6 mt-6">
                  <h2 
                    className="text-xl sm:text-2xl lg:text-2xl text-white m-0 pr-8 mb-4"
                    style={{ fontFamily: 'Gilroy-SemiBold', fontWeight: 400 }}
                  >
                    {tile.customTable.title}
                  </h2>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-4 gap-6 w-full p-4 border-b border-white/30 sticky top-0 bg-[#1F1F1F] z-10">
                  {tile.customTable.headings.map((heading, index) => (
                    <div key={index} className={`flex flex-col justify-center p-0 ${index === 0 ? 'items-start' : 'items-end'}`}>
                      <span
                        className={`text-sm leading-none text-white ${index === 0 ? 'text-left' : 'text-right'}`}
                        style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                      >
                        {heading}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Table Rows */}
                <div className="flex flex-col items-start gap-2 w-full p-0">
                  {tile.customTable.rows.map((row, index) => (
                    <div
                      key={`custom-modal-${index}`}
                      className="grid grid-cols-4 gap-6 w-full p-4 border-b border-white/10"
                    >
                      {tile.customTable!.headings.map((heading, colIndex) => (
                        <div key={colIndex} className={`flex flex-col justify-center p-0 ${colIndex === 0 ? 'items-start' : 'items-end'}`}>
                          <span
                            className={`text-sm leading-none text-[#909090] ${colIndex === 0 ? 'text-left' : 'text-right'}`}
                            style={{ fontFamily: 'Gilroy-Medium', fontWeight: 400 }}
                          >
                            {row.values[colIndex] || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Compliance Modal */}
      {isMobile && isMobileComplianceModalOpen && complianceMetrics.length > 0 && (
        <div
          className="shariah-details-compliance-mobile-modal"
          onClick={() => setIsMobileComplianceModalOpen(false)}
        >
          <div
            className="shariah-details-compliance-mobile-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="shariah-details-compliance-mobile-modal-close"
              onClick={() => setIsMobileComplianceModalOpen(false)}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7" stroke="#AFB9BF" strokeWidth="1.25" strokeLinecap="round" />
                <path d="M7 1L1 7" stroke="#AFB9BF" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
            </button>
            <h2 className="shariah-details-compliance-mobile-modal-title">Compliance Breakdown</h2>
            {false && (
              <div className="shariah-details-compliance-mobile-modal-list">
                {/* Card 1: Debt to Market Cap */}
                <div
                  className="shariah-details-compliance-card"
                  style={{
                    boxSizing: 'border-box',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 12px',
                    gap: '16px',
                    width: '319px',
                    height: '152px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Status</span>
                    </div>
                    <span className="shariah-details-compliance-card-value status">Pass</span>
                  </div>
                  <div className="shariah-details-compliance-card-divider" />
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Criteria</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">Debt to Market Cap</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Threshold</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">&lt; 33%</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Actual</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">0%</span>
                  </div>
                </div>

                {/* Card 2: Interest Income */}
                <div
                  className="shariah-details-compliance-card"
                  style={{
                    boxSizing: 'border-box',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 12px',
                    gap: '16px',
                    width: '319px',
                    height: '152px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Status</span>
                    </div>
                    <span className="shariah-details-compliance-card-value status">Pass</span>
                  </div>
                  <div className="shariah-details-compliance-card-divider" />
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Criteria</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">Interest Income</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Threshold</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">&lt; 5%</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Actual</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">2%</span>
                  </div>
                </div>

                {/* Card 3: Business Activity */}
                <div
                  className="shariah-details-compliance-card"
                  style={{
                    boxSizing: 'border-box',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 12px',
                    gap: '16px',
                    width: '319px',
                    height: '152px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Status</span>
                    </div>
                    <span className="shariah-details-compliance-card-value status">Pass</span>
                  </div>
                  <div className="shariah-details-compliance-card-divider" />
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Criteria</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">Business Activity</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Threshold</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">No prohibited activities</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Actual</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">Compliant</span>
                  </div>
                </div>

                {/* Card 4: Cash Holdings */}
                <div
                  className="shariah-details-compliance-card"
                  style={{
                    boxSizing: 'border-box',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '16px 12px',
                    gap: '16px',
                    width: '319px',
                    height: '152px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Status</span>
                    </div>
                    <span className="shariah-details-compliance-card-value status">Pass</span>
                  </div>
                  <div className="shariah-details-compliance-card-divider" />
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Criteria</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">Cash Holdings</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Threshold</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">&lt; 33%</span>
                  </div>
                  <div className="shariah-details-compliance-card-row">
                    <div className="shariah-details-compliance-card-label-group">
                      <span className="shariah-details-compliance-card-label">Actual</span>
                    </div>
                    <span className="shariah-details-compliance-card-value">15%</span>
                  </div>
                </div>
              </div>
            )}
            <div className="shariah-details-compliance-mobile-modal-list">
              {complianceMetrics.map((metric, index) => renderModalComplianceCard(metric, index))}
            </div>

            {/* Custom Table Section in Mobile Modal */}
            {tile.customTable && tile.customTable.headings && tile.customTable.headings.every(h => h.trim()) && tile.customTable.rows && tile.customTable.rows.length > 0 && (
              <>
                <h2 className="shariah-details-compliance-mobile-modal-title" style={{ marginTop: '32px' }}>
                  {tile.customTable.title}
                </h2>
                <div className="shariah-details-compliance-mobile-modal-list">
                  {tile.customTable.rows.map((row, index) => 
                    renderCustomTableModalCard(row, tile.customTable!.headings, index)
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


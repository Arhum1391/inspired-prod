'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState, useEffect } from 'react';
import type { ShariahTile, ComplianceMetric } from '@/types/admin';

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
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Status</span>
          </div>
          <span
            className={`shariah-details-compliance-card-value status ${isPass ? 'pass' : 'fail'}`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="shariah-details-compliance-card-divider" />
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Criteria</span>
          </div>
          <span className="shariah-details-compliance-card-value">{metric.criteria}</span>
        </div>
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Threshold</span>
          </div>
          <span className="shariah-details-compliance-card-value">{metric.threshold}</span>
        </div>
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Actual</span>
          </div>
          <span className="shariah-details-compliance-card-value">{metric.actual}</span>
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
          <span
            className={`shariah-details-compliance-card-value status ${isPass ? 'pass' : 'fail'}`}
          >
            {statusLabel}
          </span>
        </div>
        <div className="shariah-details-compliance-card-divider" />
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Criteria</span>
          </div>
          <span className="shariah-details-compliance-card-value">{metric.criteria}</span>
        </div>
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Threshold</span>
          </div>
          <span className="shariah-details-compliance-card-value">{metric.threshold}</span>
        </div>
        <div className="shariah-details-compliance-card-row">
          <div className="shariah-details-compliance-card-label-group">
            <span className="shariah-details-compliance-card-label">Actual</span>
          </div>
          <span className="shariah-details-compliance-card-value">{metric.actual}</span>
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
          order: index,
          alignSelf: 'stretch',
          flexGrow: 0,
        }}
      >
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
            {metric.criteria}
          </span>
        </div>
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
            {metric.threshold}
          </span>
        </div>
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
            {metric.actual}
          </span>
        </div>
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
              color: isPass ? '#05B353' : '#FF4D4D',
              flex: 'none',
              order: 0,
              alignSelf: 'stretch',
              flexGrow: 0,
            }}
          >
            {statusLabel}
          </span>
        </div>
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
    if (isMobileComplianceModalOpen) {
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
  }, [isMobileComplianceModalOpen]);

  const handleBack = () => {
    router.push('/shariah');
  };

  if (tileLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (tileError || !tile) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div>{tileError || 'Fund not found.'}</div>
      </div>
    );
  }

  const complianceMetrics =
    tile.complianceMetrics && tile.complianceMetrics.length > 0
      ? tile.complianceMetrics
      : fallbackComplianceMetrics;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Desktop View All Icon - Point Right */
        .shariah-details-compliance-viewall-icon {
          transform: rotate(180deg) !important;
        }
        /* Mobile Spacer - Hidden on Desktop */
        .shariah-details-mobile-spacer {
          display: none !important;
        }
        @media (max-width: 768px) {
          .shariah-details-header-container {
            position: absolute !important;
            width: 375px !important;
            height: auto !important;
            min-height: 227px !important;
            left: 0px !important;
            top: 94px !important;
            padding: 0px 16px 24px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: flex-start !important;
          }
          .shariah-details-header-content {
            width: 343px !important;
            height: auto !important;
            min-height: 203px !important;
            gap: 24px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .shariah-details-back-button {
            width: 343px !important;
            height: 16px !important;
            gap: 4px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
          }
          .shariah-details-back-icon {
            width: 16px !important;
            height: 16px !important;
            transform: none !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-back-text {
            width: 37px !important;
            height: 16px !important;
            font-family: 'Gilroy-Medium' !important;
            font-size: 16px !important;
            line-height: 100% !important;
            color: #FFFFFF !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-heading {
            width: 343px !important;
            height: auto !important;
            min-height: 38px !important;
            font-family: 'Gilroy-SemiBold' !important;
            font-size: 32px !important;
            line-height: 120% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-description {
            width: 343px !important;
            height: auto !important;
            min-height: 63px !important;
            font-family: 'Gilroy-Medium' !important;
            font-size: 16px !important;
            line-height: 130% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-footer {
            width: 343px !important;
            height: 14px !important;
            gap: 16px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
          }
          .shariah-details-footer-left {
            width: 162px !important;
            height: 14px !important;
            font-family: 'Gilroy-Medium' !important;
            font-size: 14px !important;
            line-height: 100% !important;
            color: #FFFFFF !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-footer-dot {
            width: 6px !important;
            height: 6px !important;
            background: #D9D9D9 !important;
            border-radius: 50% !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-footer-right {
            width: 121px !important;
            height: 14px !important;
            font-family: 'Gilroy-Medium' !important;
            font-size: 14px !important;
            line-height: 100% !important;
            color: #FFFFFF !important;
            flex-shrink: 0 !important;
          }
          /* Compliance Breakdown Tile Mobile Styles */
          .shariah-details-compliance-container {
            position: absolute !important;
            max-width: 375px !important;
            height: 794px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: 353px !important;
            padding: 0px 16px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            box-sizing: border-box !important;
            margin-bottom: 40px !important;
          }
          .shariah-details-compliance-container > div:first-child {
            display: none !important;
          }
          .shariah-details-compliance-tile {
            width: 100% !important;
            max-width: 343px !important;
            height: 794px !important;
            padding: 20px 12px !important;
            gap: 8px !important;
            background: #1F1F1F !important;
            border-radius: 10px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            isolation: isolate !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            border: none !important;
          }
          .shariah-details-compliance-content {
            width: 100% !important;
            height: 754px !important;
            gap: 24px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            z-index: 0 !important;
          }
          .shariah-details-compliance-header {
            width: 100% !important;
            height: 50px !important;
            gap: 24px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
          }
          .shariah-details-compliance-title-block {
            width: 100% !important;
            height: 50px !important;
            gap: 12px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            flex: 1 !important;
          }
          .shariah-details-compliance-title {
            width: 100% !important;
            height: auto !important;
            min-height: 50px !important;
            font-family: 'Gilroy-SemiBold' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 24px !important;
            line-height: 125% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            flex: none !important;
            order: 0 !important;
            flex-grow: 0 !important;
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
          }
          .shariah-details-compliance-viewall {
            width: 63px !important;
            height: 17px !important;
            gap: 4px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            background: transparent !important;
            border: none !important;
            cursor: pointer !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-compliance-viewall span {
            width: 43px !important;
            height: 17px !important;
            font-family: 'Gilroy-SemiBold' !important;
            font-size: 12px !important;
            line-height: 145% !important;
            color: #FFFFFF !important;
            text-align: center !important;
            display: flex !important;
            align-items: center !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-compliance-viewall-icon {
            width: 16px !important;
            height: 16px !important;
            transform: rotate(180deg) !important;
            flex-shrink: 0 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          /* Compliance Modal Mobile Styles */
          .shariah-details-compliance-mobile-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            background: rgba(0, 0, 0, 0.6) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 1000 !important;
            padding: 16px !important;
          }
          .shariah-details-compliance-mobile-modal-content {
            max-height: calc(100vh - 64px) !important;
            background: #1F1F1F !important;
            border-radius: 16px !important;
            padding: 24px 12px !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 20px !important;
            box-sizing: border-box !important;
            position: relative !important;
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
          .shariah-details-compliance-table-header {
            display: none !important;
          }
          .shariah-details-compliance-table-rows {
            display: none !important;
          }
          .shariah-details-compliance-table-row {
            display: none !important;
          }
          .shariah-details-compliance-cards-container {
            width: 319px !important;
            max-width: 319px !important;
            gap: 16px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            box-sizing: border-box !important;
          }
          .shariah-details-compliance-card {
            box-sizing: border-box !important;
            width: 319px !important;
            max-width: 319px !important;
            height: 152px !important;
            padding: 16px 12px !important;
            gap: 16px !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
            border-radius: 8px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            flex-shrink: 0 !important;
            overflow: hidden !important;
          }
          .shariah-details-compliance-card-row {
            width: 295px !important;
            height: 14px !important;
            gap: 16px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-compliance-card-label-group {
            width: auto !important;
            height: 14px !important;
            gap: 8px !important;
            padding: 0px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            flex: 1 !important;
          }
          .shariah-details-compliance-card-label {
            font-family: 'Gilroy-Medium' !important;
            font-size: 14px !important;
            line-height: 100% !important;
            color: #FFFFFF !important;
            flex-shrink: 0 !important;
          }
          .shariah-details-compliance-card-value {
            font-family: 'Gilroy-Medium' !important;
            font-size: 14px !important;
            line-height: 100% !important;
            color: #909090 !important;
            text-align: right !important;
            flex: 1 !important;
          }
          .shariah-details-compliance-card-value.status {
            color: #05B353 !important;
          }
          .shariah-details-compliance-card-divider {
            width: 295px !important;
            height: 0px !important;
            border: 1px solid #404040 !important;
            flex-shrink: 0 !important;
          }
          /* Analyst Notes Section Mobile Styles */
          .shariah-details-analyst-notes {
            position: absolute !important;
            width: 343px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            top: 1187px !important;
            height: auto !important;
            min-height: 145px !important;
            padding: 0px 16px !important;
            margin-bottom: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 8px !important;
            box-sizing: border-box !important;
          }
          /* Spacer to prevent Footer overlap on mobile */
          .shariah-details-mobile-spacer {
            display: block !important;
            width: 100% !important;
            height: 60px !important;
            min-height: 60px !important;
          }
          .shariah-details-analyst-notes h2 {
            width: 311px !important;
            height: auto !important;
            min-height: 58px !important;
            font-family: 'Gilroy-SemiBold' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 32px !important;
            line-height: 120% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            flex: none !important;
            order: 0 !important;
            align-self: stretch !important;
            flex-grow: 0 !important;
          }
          .shariah-details-analyst-notes p {
            width: 311px !important;
            height: auto !important;
            min-height: 63px !important;
            font-family: 'Gilroy-Medium' !important;
            font-style: normal !important;
            font-weight: 400 !important;
            font-size: 16px !important;
            line-height: 130% !important;
            color: #FFFFFF !important;
            margin: 0 !important;
            flex: none !important;
            order: 1 !important;
            align-self: stretch !important;
            flex-grow: 0 !important;
          }
        }
      `}} />
      <Navbar />

      {/* Background Gradient SVG - Top Right */}
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

      <div className="relative z-10 flex flex-col items-start justify-center px-4 sm:px-6 lg:px-8" style={{ minHeight: '1400px', paddingBottom: '150px' }}>
        {/* Content Container */}
        <div
          className="shariah-details-header-container"
          style={{
            position: 'absolute',
            width: '630px',
            left: '188px',
            top: '262px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '24px',
          }}
        >
          <div
            className="shariah-details-header-content"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0px',
              gap: '24px',
            }}
          >
            {/* Back Button Row */}
            <button
              onClick={handleBack}
              className="shariah-details-back-button flex items-center text-white hover:text-gray-300 transition-colors focus:outline-none focus:ring-0 focus:border-none active:outline-none relative z-20"
              style={{
                outline: 'none',
                boxShadow: 'none',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                fontFamily: 'Gilroy-Medium',
                fontSize: '16px',
                lineHeight: '100%',
                color: '#FFFFFF',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: '4px',
              }}
              onFocus={(e) => e.target.blur()}
            >
              <ChevronLeft size={16} className="shariah-details-back-icon" />
              <span className="shariah-details-back-text">Back</span>
            </button>

            {/* Heading */}
            <h1
              className="shariah-details-heading"
              style={{
                width: '630px',
                fontFamily: 'Gilroy-SemiBold',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '120%',
                color: '#FFFFFF',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0,
                margin: 0,
              }}
            >
              {tile.title}
            </h1>

            {/* Description */}
            <p
              className="shariah-details-description"
              style={{
                width: '630px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '130%',
                color: '#FFFFFF',
                flex: 'none',
                order: 2,
                alignSelf: 'stretch',
                flexGrow: 0,
                margin: 0,
              }}
            >
              {tile.description}
            </p>

            {/* Footer Row */}
            <div
              className="shariah-details-footer"
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0px',
                gap: '16px',
                width: '630px',
                height: '14px',
                flex: 'none',
                order: 3,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              {/* Footer Left */}
              <span
                className="shariah-details-footer-left"
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '100%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0,
                }}
              >
                {tile.footerLeft}
              </span>

              {/* Dot Separator */}
              <div
                className="shariah-details-footer-dot"
                style={{
                  width: '6px',
                  height: '6px',
                  background: '#D9D9D9',
                  borderRadius: '50%',
                  flex: 'none',
                  order: 1,
                  flexGrow: 0,
                }}
              />

              {/* Footer Right */}
              <span
                className="shariah-details-footer-right"
                style={{
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '100%',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 2,
                  flexGrow: 0,
                }}
              >
                {formatFooterDate(tile.footerRight)}
              </span>
            </div>
          </div>
        </div>

        {/* Compliance Breakdown Tile */}
        <div
          className="shariah-details-compliance-container"
          style={{
            position: 'absolute',
            width: '1064px',
            height: '384px',
            top: '604px',
            left: '188px',
            gap: '24px',
            borderRadius: '16px',
            background: '#1F1F1F',
            padding: '20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {/* Curved Gradient Border - Desktop */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              borderRadius: '16px',
              padding: '1px',
              background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
              boxSizing: 'border-box',
              zIndex: 0,
            }}
          >
            <div style={{ width: '100%', height: '100%', borderRadius: '15px', background: '#1F1F1F' }}></div>
          </div>

          <div
            className="shariah-details-compliance-tile"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '16px',
              background: 'transparent',
              padding: '20px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              position: 'relative',
              overflow: 'hidden',
              zIndex: 1,
            }}
          >

            <div
              className="shariah-details-compliance-content"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '12px',
                width: '100%',
                maxWidth: '1024px',
                height: '266px',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0,
                position: 'relative',
                zIndex: 1,
                boxSizing: 'border-box',
              }}
            >
              {/* Header with Title and View All */}
              <div
                // className="shariah-details-compliance-header"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '0px',
                  gap: '24px',
                  width: '100%',
                  marginBottom: '15px',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                <div
                  className="shariah-details-compliance-title-block"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '12px',
                    flex: 1,
                  }}
                >
                  <h2
                    className="shariah-details-compliance-title"
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontSize: '24px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      margin: 0,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    Compliance Breakdown...
                  </h2>
                </div>
                <button
                  className="shariah-details-compliance-viewall"
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '4px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    zIndex: 1,
                  }}
                  onClick={() => {
                    if (isMobile) {
                      setIsMobileComplianceModalOpen(true);
                    }
                  }}
                >
                  <span>View All</span>
                  <ChevronLeft size={16} className="shariah-details-compliance-viewall-icon" />
                </button>
              </div>

              {/* Desktop Table Header */}
              <div
                className="shariah-details-compliance-table-header"
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
                  borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Criteria Column */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '0px',
                    gap: '8px',
                    width: '100%',
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
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Criteria
                  </span>
                </div>

                {/* Threshold Column */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '100%',
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
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Threshold
                  </span>
                </div>

                {/* Actual Column */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '100%',
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
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    Actual
                  </span>
                </div>

                {/* Status Column */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '100%',
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
                      color: '#FFFFFF',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
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
                {complianceMetrics.map((metric, index) => renderMobileComplianceCard(metric, index))}
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
                  height: 'auto',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                  boxSizing: 'border-box',
                }}
              >
                {complianceMetrics.map((metric, index) => renderDesktopComplianceRow(metric, index))}
              </div>
            </div>
          </div>
        </div>

        {/* Analyst Notes Section */}
        <div
          className="shariah-details-analyst-notes"
          style={{
            position: 'absolute',
            width: '1064px',
            height: '145px',
            left: '188px',
            top: '1128px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '24px',
            marginBottom: '120px',
          }}
        >
          {/* Heading */}
          <h2
            style={{
              width: '1064px',
              height: '58px',
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
              margin: 0,
            }}
          >
            Analyst Notes
          </h2>

          {/* Description */}
          <p
            style={{
              width: '1064px',
              height: '63px',
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '130%',
              color: '#FFFFFF',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0,
            }}
          >
            {tile.analystNotes}
          </p>
        </div>
      </div>

      {/* Mobile Spacer to prevent Footer overlap */}
      <div className="shariah-details-mobile-spacer" />

      {/* Mobile Compliance Modal */}
      {isMobile && isMobileComplianceModalOpen && (
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
            <h2 className="shariah-details-compliance-mobile-modal-title">Compliance Breakdown...</h2>
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
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}


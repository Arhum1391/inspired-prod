'use client';

import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import HoldingsTable from '@/components/HoldingsTable';
import NewsletterSubscription from '@/components/forms/NewsletterSubscription';
import PortfolioBalanceCard from '@/components/PortfolioBalanceCard';

type AllocationSlice = {
  label: string;
  percentage: string;
  amount: number;
  displayValue: string;
  color: string;
};

type AllocationDatum = AllocationSlice & { id: string; value: number };

const allocationSlices: AllocationSlice[] = [
  { label: 'BTC', percentage: '40.5%', amount: 24000, displayValue: '$24,000', color: '#EB72FF' },
  { label: 'ETH', percentage: '43.1%', amount: 25600, displayValue: '$25,600', color: '#EB72FF' },
  { label: 'GOLD', percentage: '16.4%', amount: 9750, displayValue: '$9,750', color: '#EB72FF' },
];

type HoldingRow = {
  asset: string;
  quantity: string;
  avgPrice: string;
  currentPrice: string;
  value: string;
  pnl: string;
  pnlColor: string;
};

const holdingsColumns = [
  'Asset',
  'Quantity',
  'AVG Price',
  'Current Price',
  'Value',
  'P&L',
  'Actions',
] as const;

const holdingsRows: HoldingRow[] = [
  { asset: 'AAPL', quantity: '100', avgPrice: '$2,800', currentPrice: '$220', value: '$6,600', pnl: '+46.67%', pnlColor: '#05B353' },
  { asset: 'MSFT', quantity: '150', avgPrice: '$30', currentPrice: '$35', value: '$5,250', pnl: '+7.50%', pnlColor: '#05B353' },
  { asset: 'GOOGL', quantity: '200', avgPrice: '$40', currentPrice: '$45', value: '$9,000', pnl: '+12.50%', pnlColor: '#05B353' },
  { asset: 'AAPL', quantity: '150', avgPrice: '$140', currentPrice: '$145', value: '$21,000', pnl: '+3.57%', pnlColor: '#05B353' },
  { asset: 'AMZN', quantity: '300', avgPrice: '$120', currentPrice: '$125', value: '$36,000', pnl: '+4.17%', pnlColor: '#05B353' },
  { asset: 'MSFT', quantity: '250', avgPrice: '$250', currentPrice: '$255', value: '$63,750', pnl: '+2.00%', pnlColor: '#05B353' },
  { asset: 'TSLA', quantity: '180', avgPrice: '$600', currentPrice: '$610', value: '$108,000', pnl: '+1.67%', pnlColor: '#05B353' },
  { asset: 'FB', quantity: '100', avgPrice: '$300', currentPrice: '$310', value: '$31,000', pnl: '+3.33%', pnlColor: '#05B353' },
  { asset: 'NFLX', quantity: '90', avgPrice: '$500', currentPrice: '$510', value: '$45,900', pnl: '+2.00%', pnlColor: '#05B353' },
  { asset: 'NVDA', quantity: '130', avgPrice: '$220', currentPrice: '$225', value: '$29,500', pnl: '+2.27%', pnlColor: '#05B353' },
];

export default function PortfolioPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});
  const [isAddHoldingModalOpen, setAddHoldingModalOpen] = useState(false);
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [hasConnectedApi, setHasConnectedApi] = useState(false);

  const toggleTile = (index: number) => {
    setExpandedTiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const openAddHoldingModal = () => {
    setAddHoldingModalOpen(true);
  };

  const closeAddHoldingModal = () => {
    setAddHoldingModalOpen(false);
    setApiKeyValue('');
  };

  const handleConfirmAddHolding = () => {
    setHasConnectedApi(true);
    closeAddHoldingModal();
  };

  const handleApiKeyChange = (event: ChangeEvent<HTMLInputElement>) => {
    setApiKeyValue(event.target.value);
  };

  const previewTimeRanges = ['1Hr', '1D', '1W', '1M', '1Y'] as const;
  const previewChartLabels = ['16/6', '22/6', '28/6', '4/7', '10/7', '16/7', '22/7'];
  const previewYAxisLabels = ['$3000', '$2000', '$1000', '$0'];

  const AllocationDistributionCard = () => {
    const chartData = useMemo<AllocationDatum[]>(
      () =>
        allocationSlices.map(slice => ({
          id: slice.label,
          label: slice.label,
          value: slice.amount,
          amount: slice.amount,
          color: slice.color,
          percentage: slice.percentage,
          displayValue: slice.displayValue,
        })),
      []
    );

    // Gradient angles based on Figma design (in degrees)
    const gradientAngles = useMemo(() => {
      // Map each datum to its gradient angle based on Figma design
      // BTC: 35.87deg, ETH: 27.79deg, GOLD: 92.41deg
      const angleMap: Record<string, number> = {
        'BTC': 35.87,
        'ETH': 27.79,
        'GOLD': 92.41,
      };
      return chartData.map(datum => angleMap[datum.label] || 0);
    }, [chartData]);

    const gradientDefs = useMemo(
      () =>
        chartData.map((datum, index) => {
          const angle = gradientAngles[index];
          // Convert angle to radians for SVG gradient calculation
          // SVG gradients: angle 0° = right, 90° = down, -90° = up
          // CSS gradients: angle 0° = up, 90° = right
          // Need to adjust: SVG_angle = CSS_angle - 90
          const angleRad = ((angle - 90) * Math.PI) / 180;
          
          // Calculate gradient line endpoints (from center outward)
          const length = 0.707; // Diagonal length for full coverage
          const x1 = 0.5 - length * Math.cos(angleRad);
          const y1 = 0.5 - length * Math.sin(angleRad);
          const x2 = 0.5 + length * Math.cos(angleRad);
          const y2 = 0.5 + length * Math.sin(angleRad);
          
          // Create gradient that simulates white overlay effect
          // rgba(255, 255, 255, 0) over #141414 = #141414
          // rgba(255, 255, 255, 0.12) over #141414 ≈ #303030
          // Making it slightly lighter to match Figma's beautiful gradient
          return {
            id: `allocation-gradient-${datum.id}`,
            colors: [
              { offset: 0, color: '#141414', opacity: 1 },
              { offset: 3.62, color: '#141414', opacity: 1 },
              { offset: 96.98, color: '#3A3A3A', opacity: 1 },
              { offset: 100, color: '#3A3A3A', opacity: 1 },
            ],
            x1,
            y1,
            x2,
            y2,
          };
        }),
      [chartData, gradientAngles]
    );
    const totalValue = useMemo(
      () => chartData.reduce((sum, datum) => sum + datum.value, 0),
      [chartData]
    );

    const SVG_SIZE = 320;
    const CENTER = SVG_SIZE / 2;
    const OUTER_RADIUS = 115;
    const INNER_RADIUS = OUTER_RADIUS * 0.62;

    type SliceGeometry = {
      datum: AllocationDatum;
      path: string;
      connector: {
        startX: number;
        startY: number;
        elbowX: number;
        elbowY: number;
        endX: number;
        endY: number;
        textAnchor: 'start' | 'end';
        labelX: number;
        labelY: number;
      };
    };

    const polarToCartesian = (radius: number, angle: number) => ({
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
    });

    const slices = useMemo<SliceGeometry[]>(() => {
      if (totalValue === 0) {
        return [];
      }

      const TAU = Math.PI * 2;
      let currentAngle = -Math.PI / 2; // Start at top

      return chartData.map(datum => {
        const sliceAngle = (datum.value / totalValue) * TAU;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

        const startOuter = polarToCartesian(OUTER_RADIUS, startAngle);
        const endOuter = polarToCartesian(OUTER_RADIUS, endAngle);
        const startInner = polarToCartesian(INNER_RADIUS, endAngle);
        const endInner = polarToCartesian(INNER_RADIUS, startAngle);

        const path = [
          `M ${startOuter.x.toFixed(3)} ${startOuter.y.toFixed(3)}`,
          `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArcFlag} 1 ${endOuter.x.toFixed(3)} ${endOuter.y.toFixed(3)}`,
          `L ${startInner.x.toFixed(3)} ${startInner.y.toFixed(3)}`,
          `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArcFlag} 0 ${endInner.x.toFixed(3)} ${endInner.y.toFixed(3)}`,
          'Z',
        ].join(' ');

        const midAngle = startAngle + sliceAngle / 2;
        const startConnector = polarToCartesian(OUTER_RADIUS, midAngle);
        const elbowPoint = polarToCartesian(OUTER_RADIUS + 12, midAngle);
        const isRightSide = Math.cos(midAngle) >= 0;
        const horizontalOffset = isRightSide ? 32 : -32;
        const endX = elbowPoint.x + horizontalOffset;
        const endY = elbowPoint.y;
        const labelX = endX + (isRightSide ? 8 : -8);
        const labelY = endY;

        currentAngle = endAngle;

        return {
          datum,
          path,
          connector: {
            startX: startConnector.x,
            startY: startConnector.y,
            elbowX: elbowPoint.x,
            elbowY: elbowPoint.y,
            endX,
            endY,
            textAnchor: isRightSide ? 'start' : 'end',
            labelX,
            labelY,
          },
        };
      });
    }, [chartData, totalValue]);

    const formatNumber = (value: number) => Number(value.toFixed(2));

    return (
      <div className="relative flex h-[344px] w-[413px] flex-col items-center gap-6 overflow-hidden rounded-2xl bg-[#1F1F1F] p-5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: '16px',
            background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
            padding: '1px',
          }}
        >
          <div
            className="w-full h-full rounded-[15px]"
            style={{
              background: '#1F1F1F',
            }}
          ></div>
        </div>
        <div className="flex w-full items-center">
          <span
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '20px',
              lineHeight: '130%',
              color: '#FFFFFF',
            }}
          >
            Allocation
          </span>
        </div>

        <div className="flex w-full flex-1 flex-col items-center justify-center">
          <div className="h-[200px] w-full">
            <svg viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`} className="h-full w-full">
              <defs>
                {gradientDefs.map(def => (
                  <linearGradient
                    key={def.id}
                    id={def.id}
                    x1={def.x1.toString()}
                    y1={def.y1.toString()}
                    x2={def.x2.toString()}
                    y2={def.y2.toString()}
                    gradientUnits="objectBoundingBox"
                  >
                    {def.colors.map(stop => (
                      <stop
                        key={`${def.id}-stop-${stop.offset}`}
                        offset={`${stop.offset}%`}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity}
                      />
                    ))}
                  </linearGradient>
                ))}
              </defs>

              {slices.map(slice => (
                <path
                  key={`slice-${slice.datum.id}`}
                  d={slice.path}
                  fill={`url(#allocation-gradient-${slice.datum.id})`}
                  stroke="none"
                />
              ))}

              {slices.map(slice => (
                <g key={`connector-${slice.datum.id}`}>
                  <path
                    d={`M ${formatNumber(slice.connector.startX)} ${formatNumber(slice.connector.startY)} L ${formatNumber(slice.connector.elbowX)} ${formatNumber(slice.connector.elbowY)} L ${formatNumber(slice.connector.endX)} ${formatNumber(slice.connector.endY)}`}
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth={1.2}
                    fill="none"
                  />
                  <circle
                    cx={formatNumber(slice.connector.startX)}
                    cy={formatNumber(slice.connector.startY)}
                    r={3}
                    fill="#EB72FF"
                  />
                  <text
                    x={formatNumber(slice.connector.labelX)}
                    y={formatNumber(slice.connector.labelY - 6)}
                    textAnchor={slice.connector.textAnchor}
                    dominantBaseline="middle"
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontSize: 13,
                      fontWeight: 400,
                      fill: '#FFFFFF',
                    }}
                  >
                    {`${slice.datum.label}: ${slice.datum.percentage}`}
                  </text>
                  <text
                    x={formatNumber(slice.connector.labelX)}
                    y={formatNumber(slice.connector.labelY + 8)}
                    textAnchor={slice.connector.textAnchor}
                    dominantBaseline="middle"
                    style={{
                      fontFamily: 'Gilroy-Medium',
                      fontSize: 12,
                      fontWeight: 400,
                      fill: '#FFFFFF',
                      opacity: 0.85,
                    }}
                  >
                    {slice.datum.displayValue}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    );
  };
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
      `}} />
      <Navbar />
      
      {/* Background SVG Gradient */}
      <svg 
        className="absolute pointer-events-none"
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
        <g filter="url(#filter0_f_portfolio)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_portfolio)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_portfolio" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_portfolio"/>
          </filter>
          <linearGradient id="paint0_linear_portfolio" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
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
        <div className="min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8 flex items-start">
          <div className="max-w-7xl mx-auto w-full relative">
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
                <path d="M485.003 448.627C449.573 580.853 314.193 659.464 182.624 624.21C51.0543 588.956 -26.8824 453.187 8.54736 320.961C43.9772 188.735 179.378 110.129 310.947 145.383L478.648 190.318C517.106 200.623 558.36 174.855 558.36 174.855L485.003 448.627ZM266.707 306.134C223.047 294.435 178.123 320.521 166.366 364.399C154.609 408.277 180.471 453.33 224.131 465.029C267.791 476.727 312.715 450.641 324.472 406.763L345.76 327.316L266.707 306.134Z" fill="url(#paint0_linear_vector_logo_portfolio)"/>
                <path d="M417.104 61.0593C428.861 17.1816 473.785 -8.90461 517.445 2.79402C561.105 14.4926 586.967 59.5461 575.21 103.424C563.453 147.301 518.529 173.388 474.869 161.689L395.816 140.507L417.104 61.0593Z" fill="url(#paint1_linear_vector_logo_portfolio)"/>
              </g>
              <defs>
                <linearGradient id="paint0_linear_vector_logo_portfolio" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
                <linearGradient id="paint1_linear_vector_logo_portfolio" x1="541.13" y1="2.97459" x2="237.63" y2="468.975" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#333333"/>
                  <stop offset="1" stopColor="#1F1F1F"/>
                </linearGradient>
              </defs>
            </svg>
            
            {/* Title - Left Middle */}
            <h1
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
                ? 'Your Portfolio - Track Allocation, P/L, and Performance in One View'
                : 'Unlock the full experience with Inspired Analyst Premium'
              }
            </h1>
            {/* Description */}
            <p
              style={{
                width: '630px',
                fontFamily: 'Gilroy-Medium',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '130%',
                color: '#FFFFFF',
                marginTop: '24px',
              }}
            >
              {isAuthenticated
                ? 'Analyze your holdings, visualize profit & loss, and monitor diversification over time. Built for clarity and accountability.'
                : 'Full research library, Position Sizing Calculator (save scenarios), portfolio analytics, and Shariah project details. Cancel anytime.'
              }
            </p>
            {/* Bullet Points */}
            {!isAuthenticated && (
            <div
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
                marginTop: '32px',
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

            {isAuthenticated && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '64px',
                width: '100%',
                maxWidth: '1280px',
                margin: '300px auto 0 auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '24px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    width: '100%',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '36px',
                      lineHeight: '130%',
                      color: '#FFFFFF',
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    Your Portfolio
                  </h2>
                  <button
                    type="button"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '4px',
                      width: '180px',
                      height: '48px',
                      background: '#FFFFFF',
                      borderRadius: '100px',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      color: '#404040',
                    }}
                    onClick={openAddHoldingModal}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '16px',
                        height: '16px',
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 3.33337V12.6667"
                          stroke="#404040"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.33398 8H12.6673"
                          stroke="#404040"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    Add Holding
                  </button>
                </div>
                <p
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Track allocation, P/L, and trends - all in one place.
                </p>
              </div>

              <div style={{ width: '100%' }}>
                {hasConnectedApi ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'stretch',
                      gap: '20px',
                      width: '100%',
                      maxWidth: '1280px',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '847px',
                        height: '344px',
                        borderRadius: '16px',
                        background: '#1F1F1F',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          borderRadius: '16px',
                          background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                          padding: '1px',
                        }}
                      >
                        <div
                          className="w-full h-full rounded-[15px]"
                          style={{
                            background: '#1F1F1F',
                          }}
                        ></div>
                      </div>
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 1,
                          width: '100%',
                          height: '100%',
                          borderRadius: '15px',
                        }}
                      >
                        <PortfolioBalanceCard />
                      </div>
                    </div>
                    <AllocationDistributionCard />
                  </div>
                ) : (
                  <div
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '100px',
                      gap: '40px',
                      width: '100%',
                      background: '#1F1F1F',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[15px]"
                        style={{
                          background: '#1F1F1F',
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '24px',
                        width: '100%',
                        maxWidth: '1240px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '24px',
                          width: '100%',
                        }}
                      >
                        <h3
                          style={{
                            width: '100%',
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '24px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          Add Your First Holding
                        </h3>
                        <p
                          style={{
                            width: '100%',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            margin: 0,
                          }}
                        >
                          Start with the asset you track most - see allocation and P/L instantly
                        </p>
                      </div>
                      <button
                        type="button"
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '12px 16px',
                          gap: '10px',
                          width: '180px',
                          height: '48px',
                          background: '#FFFFFF',
                          borderRadius: '100px',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'Gilroy-SemiBold',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          color: '#404040',
                        }}
                        onClick={openAddHoldingModal}
                      >
                        Add Holding
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {hasConnectedApi && (
                <div style={{ width: '100%' }}>
                  <div
                    style={{
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '24px',
                      gap: '32px',
                      width: '100%',
                      maxWidth: '1280px',
                      margin: '116px auto 0',
                      background: '#1F1F1F',
                      borderRadius: '16px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        borderRadius: '16px',
                        background: 'linear-gradient(226.35deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 50.5%)',
                        padding: '1px',
                      }}
                    >
                      <div
                        className="w-full h-full rounded-[15px]"
                        style={{
                          background: '#1F1F1F',
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          gap: '40px',
                          width: '100%',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '16px',
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: '24px',
                              width: '100%',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                flex: 1,
                              }}
                            >
                              <h3
                                style={{
                                  fontFamily: 'Gilroy-SemiBold',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '36px',
                                  lineHeight: '100%',
                                  color: '#FFFFFF',
                                  margin: 0,
                                }}
                              >
                                Holdings
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '12px',
                            width: '100%',
                          }}
                        >
                          <div
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '16px',
                              gap: '24px',
                              width: '100%',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '8px',
                            }}
                          >
                            {holdingsColumns.map(column => (
                              <span
                                key={column}
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: '#FFFFFF',
                                }}
                              >
                                {column}
                              </span>
                            ))}
                          </div>

                          {holdingsRows.map((row, index) => (
                            <div
                              key={`${row.asset}-${index}`}
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '16px',
                                gap: '24px',
                                width: '100%',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                              }}
                            >
                              <span
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: '#909090',
                                }}
                              >
                                {row.asset}
                              </span>
                              <span
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: '#909090',
                                }}
                              >
                                {row.quantity}
                              </span>
                              <span
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: '#909090',
                                }}
                              >
                                {row.avgPrice}
                              </span>
                              <span
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: '#909090',
                                }}
                              >
                                {row.currentPrice}
                              </span>
                              <span
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: '#909090',
                                }}
                              >
                                {row.value}
                              </span>
                              <span
                                style={{
                                  width: '150.86px',
                                  fontFamily: 'Gilroy-Medium',
                                  fontStyle: 'normal',
                                  fontWeight: 400,
                                  fontSize: '14px',
                                  lineHeight: '100%',
                                  textAlign: 'center',
                                  color: row.pnlColor,
                                }}
                              >
                                {row.pnl}
                              </span>
                              <span
                                style={{
                                  width: '150.86px',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <button
                                  type="button"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                  }}
                                  aria-label={`Edit ${row.asset}`}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M3 12.9998L5.6 12.5998C5.82091 12.5668 6.01777 12.4552 6.16 12.2898L12.6 5.69984C12.9186 5.36585 13.1004 4.92125 13.1061 4.45553C13.1118 3.98982 12.941 3.54056 12.63 3.19984C12.4776 3.03707 12.2902 2.90963 12.0811 2.82671C11.872 2.74379 11.6467 2.70743 11.42 2.71984C10.9933 2.72156 10.5862 2.89754 10.28 3.20984L3.84 9.79984C3.6839 9.95507 3.57208 10.1508 3.52 10.3648L3 12.9998Z"
                                      fill="#909090"
                                    />
                                    <path
                                      d="M2 14.6665H14"
                                      stroke="#909090"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'rgba(255, 0, 0, 0.08)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                  }}
                                  aria-label={`Delete ${row.asset}`}
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M6 3.33333L6.27333 2.55333C6.39174 2.22287 6.62305 1.94347 6.92592 1.76489C7.22878 1.58631 7.58558 1.51953 7.93333 1.57333H8.06667C8.41442 1.51953 8.77122 1.58631 9.07408 1.76489C9.37695 1.94347 9.60826 2.22287 9.72667 2.55333L10 3.33333"
                                      stroke="#BB0404"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M12.6667 3.3335H3.33333"
                                      stroke="#BB0404"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M5.33398 3.3335V12.0002C5.33398 12.3538 5.47445 12.693 5.72449 12.9431C5.97454 13.1931 6.3137 13.3335 6.66732 13.3335H9.33398C9.6876 13.3335 10.0268 13.1931 10.2768 12.9431C10.5269 12.693 10.6673 12.3538 10.6673 12.0002V3.3335"
                                      stroke="#BB0404"
                                      strokeWidth="1.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </button>
                              </span>
                            </div>
                          ))}
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: '#909090',
                            }}
                          >
                            10 of 100
                          </span>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            {[1, 2, 3, 4].map(page => {
                              const isActive = page === 1;
                              return (
                                <button
                                  key={page}
                                  type="button"
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '30px',
                                    borderRadius: '8px',
                                    border: isActive ? '1px solid #667EEA' : '1px solid #909090',
                                    background: isActive ? '#667EEA' : 'transparent',
                                    color: isActive ? '#FFFFFF' : '#909090',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {page}
                                </button>
                              );
                            })}
                            <button
                              type="button"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '32px',
                                height: '30px',
                                borderRadius: '8px',
                                border: '1px solid #909090',
                                background: 'transparent',
                                cursor: 'pointer',
                              }}
                              aria-label="Next page"
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ transform: 'rotate(-90deg)' }}
                              >
                                <path
                                  d="M3 2.5L5 4.5L7 2.5"
                                  stroke="#909090"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M5 4.5V7.5"
                                  stroke="#909090"
                                  strokeWidth="1.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            )}

            {!isAuthenticated && (
            <>
            <div
              style={{
                position: 'relative',
                width: '1280px',
                maxWidth: '100%',
                margin: '120px auto 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '64px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '24px',
                  width: '100%',
                }}
              >
                <h2
                  style={{
                    width: '100%',
                    maxWidth: '1280px',
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '36px',
                    lineHeight: '130%',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Your Portfolio
                </h2>
                <p
                  style={{
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  Sample view—subscribe to add holdings and track P/L.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '20px',
                  width: '100%',
                  maxWidth: '1280px',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: '847px',
                    height: '344px',
                    borderRadius: '16px',
                    background: '#1F1F1F',
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/graph.svg"
                    alt="Portfolio preview chart"
                    width={847}
                    height={344}
                    priority
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                <div className="relative">
                  <AllocationDistributionCard />
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{
                      background: 'linear-gradient(180deg, rgba(10, 10, 10, 0) 0%, #0A0A0A 100%)',
                        }}
                      ></div>
                    </div>
                          </div>
            </div>
            <div
              style={{
                marginTop: '150px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <HoldingsTable />
            </div>
            </>
            )}
            
            {/* Big Gap */}
            <div style={{ marginTop: isAuthenticated ? '220px' : '160px' }}></div>
            
            {/* Ready to unlock full access Tile */}
            {!isAuthenticated && (
            <div
              className="relative overflow-hidden"
              style={{
                width: '1064px',
                height: '247px',
                borderRadius: '16px',
                background: '#1F1F1F',
                padding: '40px',
                gap: '10px',
                boxSizing: 'border-box',
                marginTop: '0px',
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
                className="absolute pointer-events-none"
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
                className="absolute pointer-events-none"
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
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center" style={{ gap: '10px' }}>
                {/* Frame 81 */}
                <div
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
                className="relative overflow-hidden"
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
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Yes - your access continues until your period ends.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 2 */}
              <div
                className="relative overflow-hidden"
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
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      We offer a 7-day money-back guarantee for all new subscribers.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 3 */}
              <div
                className="relative overflow-hidden"
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
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.
                    </p>
                  </div>
                )}
              </div>

              {/* FAQ Tile 4 */}
              <div
                className="relative overflow-hidden"
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
                  <div className="relative z-10 mt-4" style={{ paddingTop: '16px' }}>
                    <p style={{ color: '#FFFFFF', fontFamily: 'Gilroy-Medium', fontSize: '16px', lineHeight: '130%', margin: 0 }}>
                      Yes! We continuously improve our platform and add new features based on user feedback.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Newsletter Subscription */}
            {isAuthenticated && (
            <div className="w-full" style={{ marginTop: '220px' }}>
              <NewsletterSubscription />
            </div>
            )}
          </div>
        </div>
      </div>

    {isAddHoldingModalOpen && (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-holding-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 10, 10, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '24px',
      }}
      onClick={closeAddHoldingModal}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#1F1F1F',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0px 24px 80px rgba(0, 0, 0, 0.6)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
        onClick={event => event.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2
            id="add-holding-modal-title"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: '130%',
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Add Holding
          </h2>
          <p
            style={{
              fontFamily: 'Gilroy-Medium',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '130%',
              color: '#9D9D9D',
              margin: 0,
            }}
          >
            Enter your brokerage API key to securely sync holdings and monitor portfolio performance.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label
            htmlFor="portfolio-api-key-input"
            style={{
              fontFamily: 'Gilroy-SemiBold',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '130%',
              color: '#FFFFFF',
            }}
          >
            API Key
          </label>
          <input
            id="portfolio-api-key-input"
            type="text"
            value={apiKeyValue}
            onChange={handleApiKeyChange}
            placeholder="Enter your API key"
            style={{
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontFamily: 'Gilroy-Medium',
              fontSize: '14px',
              lineHeight: '130%',
              outline: 'none',
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: '#FFFFFF',
              borderRadius: '100px',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              fontFamily: 'Gilroy-SemiBold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={closeAddHoldingModal}
          >
            Cancel
          </button>
          <button
            type="button"
            style={{
              padding: '12px 24px',
              background: '#FFFFFF',
              color: '#0A0A0A',
              borderRadius: '100px',
              border: 'none',
              fontFamily: 'Gilroy-SemiBold',
              fontSize: '14px',
              cursor: 'pointer',
            }}
            onClick={handleConfirmAddHolding}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
    )}

      <Footer />
    </div>
  );
}


'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function CalculatorPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFormulaPopupOpen, setIsFormulaPopupOpen] = useState(false);
  const formulaPopupRef = useRef<HTMLDivElement>(null);
  const [isSaveScenarioPopupOpen, setIsSaveScenarioPopupOpen] = useState(false);
  const saveScenarioPopupRef = useRef<HTMLDivElement>(null);
  const saveScenarioBackdropRef = useRef<HTMLDivElement>(null);
  const [scenarioName, setScenarioName] = useState('');
  const [tradingPair, setTradingPair] = useState<string | null>(null);
  const [isTradingPairDropdownOpen, setIsTradingPairDropdownOpen] = useState(false);
  const tradingPairDropdownRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);
  const deleteConfirmPopupRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const scenariosPerPage = 10;
  const savedScenariosTileRef = useRef<HTMLDivElement>(null);
  
  // Trading pair options
  const tradingPairs = [
    'BTC/USD',
    'ETH/USD',
    'XAU/USD',
    'EUR/USD',
    'GBP/USD',
    'USD/JPY',
    'USD/CHF',
    'AUD/USD',
    'USD/CAD',
    'NZD/USD',
    'BNB/USD',
    'XRP/USD',
    'ADA/USD',
    'SOL/USD',
  ];
  
  // Input fields state (shared for Gold and Forex)
  const [accountBalance, setAccountBalance] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [pipValue, setPipValue] = useState('');
  const [lotSize, setLotSize] = useState('');
  
  // Forex lot type state
  const [forexLotType, setForexLotType] = useState('Standard Lot');
  const [isForexLotTypeDropdownOpen, setIsForexLotTypeDropdownOpen] = useState(false);
  const forexLotTypeRef = useRef<HTMLDivElement>(null);
  
  const forexLotTypes = ['Standard Lot', 'Mini Lot', 'Micro Lot'];
  const forexLotTypePipValues: { [key: string]: number } = {
    'Standard Lot': 10,
    'Mini Lot': 1,
    'Micro Lot': 0.10
  };

  // Set default values for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      setSelectedAsset('Gold (XAUUSD)');
      setAccountBalance('80000');
      setRiskPercentage('10');
      setStopLoss('45');
      setPipValue('1');
      setLotSize('160');
    }
  }, [isAuthenticated]);

  // Fetch saved scenarios for authenticated users
  useEffect(() => {
    const fetchScenarios = async () => {
      if (!isAuthenticated) {
        setSavedScenarios([]);
        return;
      }

      try {
        const response = await fetch('/api/scenarios');
        if (response.ok) {
          const data = await response.json();
          setSavedScenarios(data.scenarios || []);
          // Reset to page 1 when scenarios change
          setCurrentPage(1);
        } else {
          console.error('Failed to fetch scenarios');
        }
      } catch (error) {
        console.error('Error fetching scenarios:', error);
      }
    };

    fetchScenarios();
  }, [isAuthenticated]);

  // Scroll to tile on page change
  useEffect(() => {
    if (savedScenariosTileRef.current) {
      savedScenariosTileRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  // Calculate Lot Size in real-time for Gold and Forex
  useEffect(() => {
    if (selectedAsset === 'Gold (XAUUSD)') {
      // Set Pip Value as constant for Gold
      setPipValue('1');

      // Parse input values, handling empty strings and invalid inputs
      const balance = parseFloat(accountBalance.trim()) || 0;
      const risk = parseFloat(riskPercentage.trim()) || 0;
      const stop = parseFloat(stopLoss.trim()) || 0;

      // Validate inputs - if any field is empty or invalid, show empty lot size
      if (!accountBalance.trim() || !riskPercentage.trim() || !stopLoss.trim() || 
          balance <= 0 || risk <= 0 || stop <= 0) {
        setLotSize('');
        return;
      }

      // Risk Amount = (Account Balance × Risk%) / 100
      const riskAmount = (balance * risk) / 100;

      // For Gold: Pip Value per standard lot = $1 per pip (constant)
      // This means: 1 Standard Lot (100 oz) → 1 pip (0.01 move) = $1
      // Formula: Lot Size = Risk Amount / (Stop Loss × Pip Value)
      // Where Pip Value = $1 per pip (constant for Gold)
      const pipValuePerStandardLot = 1; // $1 per pip for 1 standard lot (100 oz)
      
      // Lot Size = Risk Amount / (Stop Loss × Pip Value per standard lot)
      // Calculates the number of standard lots needed
      const calculatedLotSize = riskAmount / (stop * pipValuePerStandardLot);

      // Update Lot Size with 2 decimal places
      setLotSize(calculatedLotSize.toFixed(2));
    } else if (selectedAsset === 'Currency (Forex Pairs)') {
      // For Forex: Pip Value depends on lot type
      // Standard Lot = $10/pip, Mini Lot = $1/pip, Micro Lot = $0.10/pip
      const pipValueForLotType = forexLotTypePipValues[forexLotType] || 10;
      setPipValue(pipValueForLotType.toString());

      // Parse input values, handling empty strings and invalid inputs
      const balance = parseFloat(accountBalance.trim()) || 0;
      const risk = parseFloat(riskPercentage.trim()) || 0;
      const stop = parseFloat(stopLoss.trim()) || 0;

      // Validate inputs - if any field is empty or invalid, show empty lot size
      if (!accountBalance.trim() || !riskPercentage.trim() || !stopLoss.trim() || 
          balance <= 0 || risk <= 0 || stop <= 0) {
        setLotSize('');
        return;
      }

      // Risk Amount = (Account Balance × Risk%) / 100
      const riskAmount = (balance * risk) / 100;

      // Formula: Lot Size = Risk Amount / (Stop Loss × Pip Value)
      const calculatedLotSize = riskAmount / (stop * pipValueForLotType);

      // Update Lot Size with 2 decimal places
      setLotSize(calculatedLotSize.toFixed(2));
    } else if (selectedAsset === 'Crypto (BTC, ETH, etc.)') {
      // For Crypto: Pip Value is not used, Position Size is calculated differently
      setPipValue('');

      // Parse input values, handling empty strings and invalid inputs
      const balance = parseFloat(accountBalance.trim()) || 0;
      const risk = parseFloat(riskPercentage.trim()) || 0;
      const stopPercent = parseFloat(stopLoss.trim()) || 0;

      // Validate inputs - if any field is empty or invalid, show empty position size
      if (!accountBalance.trim() || !riskPercentage.trim() || !stopLoss.trim() || 
          balance <= 0 || risk <= 0 || stopPercent <= 0) {
        setLotSize('');
        return;
      }

      // Risk Amount = (Account Balance × Risk%) / 100
      const riskAmount = (balance * risk) / 100;

      // For Crypto: Position Size (USD) = Risk Amount / (Stop Loss%)
      // Stop Loss% should be converted to decimal (e.g., 5% = 0.05)
      const stopLossDecimal = stopPercent / 100;
      const calculatedPositionSize = riskAmount / stopLossDecimal;

      // Update Position Size (displayed as Lot Size) with 2 decimal places
      setLotSize(calculatedPositionSize.toFixed(2));
    } else {
      // Reset values when no asset is selected
      setLotSize('');
      setPipValue('');
    }
  }, [accountBalance, riskPercentage, stopLoss, selectedAsset, forexLotType]);
  
  // Close Forex lot type dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (forexLotTypeRef.current && !forexLotTypeRef.current.contains(event.target as Node)) {
        setIsForexLotTypeDropdownOpen(false);
      }
    };

    if (isForexLotTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isForexLotTypeDropdownOpen]);

  // Close formula popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formulaPopupRef.current && !formulaPopupRef.current.contains(event.target as Node)) {
        setIsFormulaPopupOpen(false);
      }
    };

    if (isFormulaPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFormulaPopupOpen]);

  const toggleTile = (index: number) => {
    setExpandedTiles(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Numeric input validation handler
  const handleNumericInput = (value: string, setter: (value: string) => void) => {
    // Allow empty string, numbers, and single decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  // Handle input field click when no asset is selected - show tooltip
  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!selectedAsset) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setTimeout(() => setTooltipPosition(null), 3000); // Hide after 3 seconds
    }
  };

  // Reset handler - clears all input fields
  const handleReset = () => {
    setAccountBalance('');
    setRiskPercentage('');
    setStopLoss('');
    setLotSize('');
    // Reset Pip Value based on selected asset
    if (selectedAsset === 'Gold (XAUUSD)') {
      setPipValue('1');
    } else if (selectedAsset === 'Currency (Forex Pairs)') {
      setPipValue('');
    } else {
      setPipValue('');
    }
  };

  const assetOptions = [
    'Gold (XAUUSD)',
    'Crypto (BTC, ETH, etc.)',
    'Currency (Forex Pairs)'
  ];

  const handleAssetSelect = (asset: string) => {
    setSelectedAsset(asset);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Handle click outside for Save Scenario popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (saveScenarioPopupRef.current && !saveScenarioPopupRef.current.contains(event.target as Node)) {
        setIsSaveScenarioPopupOpen(false);
      }
    };

    if (isSaveScenarioPopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSaveScenarioPopupOpen]);

  // Handle click outside for Delete Confirmation popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteConfirmPopupRef.current && !deleteConfirmPopupRef.current.contains(event.target as Node)) {
        setIsDeleteConfirmOpen(false);
        setScenarioToDelete(null);
      }
    };

    if (isDeleteConfirmOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDeleteConfirmOpen]);

  // Handle click outside for Trading Pair dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tradingPairDropdownRef.current && !tradingPairDropdownRef.current.contains(event.target as Node)) {
        setIsTradingPairDropdownOpen(false);
      }
    };

    if (isTradingPairDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTradingPairDropdownOpen]);

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
        input::placeholder {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .trading-pair-dropdown::-webkit-scrollbar {
          width: 4px;
        }
        .trading-pair-dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
        .trading-pair-dropdown::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
        }
        .trading-pair-dropdown::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
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
        <g filter="url(#filter0_f_calculator)">
          <path d="M-323.419 -963.166C-339.01 -913.804 -341.542 -793.642 -219.641 -721.835C68.1756 -552.293 47.4452 -238.748 50.2608 -183.474C54.8056 -94.2532 60.7748 113.384 232.274 209.929C361.298 282.563 423.638 276.679 416.511 277.203L434.837 526.531C384.709 530.216 273.76 520.175 109.635 427.781C-199.701 253.642 -196.356 -110.679 -199.416 -170.757C-204.206 -264.783 -195.12 -417.24 -346.527 -506.428C-604.593 -658.445 -598.186 -923.295 -561.811 -1038.46L-323.419 -963.166Z" fill="url(#paint0_linear_calculator)" opacity="1"/>
        </g>
        <defs>
          <filter id="filter0_f_calculator" x="-780.181" y="-1238.46" width="1415.02" height="1965.62" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_calculator"/>
          </filter>
          <linearGradient id="paint0_linear_calculator" x1="-442.615" y1="-1000.81" x2="328.493" y2="452.779" gradientUnits="userSpaceOnUse">
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
                ? 'Latest Research - Clear, Actionable & Data-Backed'
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
                marginTop: isAuthenticated ? '-26px' : '12px',
              }}
            >
              {isAuthenticated
                ? 'Access full reports covering market trends, equity insights, and Shariah-compliant opportunities - updated regularly for serious investors.'
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
            
            {/* Frame 1000012125 - Heading Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '24px',
                width: '1280px',
                height: '87px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
                marginTop: '200px',
              }}
            >
              {/* Position Sizing Calculator */}
              <h2
                style={{
                  width: '1280px',
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
                Position Sizing Calculator
              </h2>
              
              {/* Description - conditional based on authentication */}
              <p
                style={{
                  width: '1280px',
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
                  ? 'Enter your numbers, analyze your positions and freely save your scenarios.'
                  : 'Demo mode - subscribe to enter your numbers and save scenarios.'}
              </p>
            </div>
            
            {/* Calculator Tiles Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '42px',
                marginTop: '24px',
                width: '100%',
              }}
            >
              {/* Calculator Tile 1 */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '846px',
                  height: selectedAsset === 'Crypto (BTC, ETH, etc.)' ? '326px' : undefined,
                  minHeight: selectedAsset !== 'Crypto (BTC, ETH, etc.)' ? '326px' : undefined,
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
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
                
                {/* Content */}
                <div 
                  className="relative z-10 w-full flex flex-col" 
                  style={{ 
                    padding: '24px', 
                    flex: '1 1 auto',
                  }}
                >
                  {/* Title and Dropdown Row */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      marginBottom: '16px',
                    }}
                  >
                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'Gilroy-SemiBold',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '20px',
                        lineHeight: '100%',
                        letterSpacing: '0%',
                        color: '#FFFFFF',
                        margin: 0,
                      }}
                    >
                      Asset Type
                    </h3>
                    
                    {/* Dropdown - Frame 1000004764 */}
                    <div
                      ref={dropdownRef}
                      style={{
                        position: 'relative',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      {/* Dropdown Button */}
                      <div
                        onClick={() => {
                          if (!isAuthenticated) return;
                          setIsDropdownOpen(!isDropdownOpen);
                        }}
                        style={{
                          cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                          opacity: isAuthenticated ? 1 : 0.6,
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '8px',
                          paddingRight: '12px',
                          paddingBottom: '8px',
                          paddingLeft: '12px',
                          gap: '8px',
                          height: '42px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '8px',
                          width: 'fit-content',
                          minWidth: '173px',
                        }}
                      >
                        {/* Selected Asset Text */}
                        <span
                          style={{
                            fontFamily: 'Gilroy-SemiBold',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '20px',
                            lineHeight: '130%',
                            color: selectedAsset ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)',
                            order: 0,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {selectedAsset || 'Choose Asset Type'}
                        </span>
                        
                        {/* Frame 1000004698 - Arrow Icon */}
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            position: 'relative',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                            flexShrink: 0,
                          }}
                        >
                          {/* ep:arrow-up-bold */}
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: isDropdownOpen 
                                ? 'translate(-50%, -50%) rotate(180deg)' 
                                : 'translate(-50%, -50%) rotate(0deg)',
                              transition: 'transform 0.3s ease',
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
                      </div>

                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            marginTop: '8px',
                            width: '100%',
                            background: '#1F1F1F',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            zIndex: 1000,
                            overflow: 'hidden',
                          }}
                        >
                          {assetOptions.map((option, index) => (
                            <div
                              key={index}
                              onClick={() => handleAssetSelect(option)}
                              style={{
                                padding: '12px 16px',
                                cursor: 'pointer',
                                fontFamily: 'Gilroy-SemiBold',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '20px',
                                lineHeight: '130%',
                                color: '#FFFFFF',
                                backgroundColor: selectedAsset === option 
                                  ? 'rgba(255, 255, 255, 0.1)' 
                                  : 'transparent',
                                transition: 'background-color 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                if (selectedAsset !== option) {
                                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (selectedAsset !== option) {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }
                              }}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Input Fields - Frame 101 (visible by default, disabled until asset selected) */}
                  {true && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '24px',
                        width: '798px',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                      }}
                    >
                      {/* Row 1 - Frame 1000004761 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '24px',
                          width: '798px',
                          height: '58px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Account Balance - Frame 1000004750 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '0px',
                            gap: '8px',
                            width: '387px',
                            height: '58px',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1,
                          }}
                        >
                          {/* Label */}
                          <label
                            style={{
                              width: '387px',
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
                              margin: 0,
                            }}
                          >
                            Account Balance ($)
                          </label>
                          
                          {/* Input - Frame 1000004673 */}
                          <div
                            style={{ position: 'relative', width: '387px' }}
                            onMouseDown={(e) => {
                              if (!selectedAsset) {
                                e.preventDefault();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10
                                });
                                setTimeout(() => setTooltipPosition(null), 3000);
                              }
                            }}
                          >
                            <input
                              type="text"
                              value={accountBalance}
                              disabled={!selectedAsset || !isAuthenticated}
                              onChange={(e) => {
                                if (!isAuthenticated) return;
                                handleNumericInput(e.target.value, setAccountBalance);
                              }}
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '10px',
                                width: '387px',
                                height: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                background: (!isAuthenticated || selectedAsset) ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: (!selectedAsset || !isAuthenticated) ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                outline: 'none',
                                cursor: !selectedAsset ? 'not-allowed' : 'text',
                                pointerEvents: selectedAsset ? 'auto' : 'none',
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Risk Percentage - Frame 1000004751 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '0px',
                            gap: '8px',
                            width: '387px',
                            height: '58px',
                            flex: 'none',
                            order: 1,
                            flexGrow: 1,
                          }}
                        >
                          {/* Label */}
                          <label
                            style={{
                              width: '387px',
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
                              margin: 0,
                            }}
                          >
                            Risk Percentage (%)
                          </label>
                          
                          {/* Input - Frame 1000004673 */}
                          <div
                            style={{ position: 'relative', width: '387px' }}
                            onMouseDown={(e) => {
                              if (!selectedAsset) {
                                e.preventDefault();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10
                                });
                                setTimeout(() => setTooltipPosition(null), 3000);
                              }
                            }}
                          >
                            <input
                              type="text"
                              value={riskPercentage}
                              disabled={!selectedAsset || !isAuthenticated}
                              onChange={(e) => {
                                if (!isAuthenticated) return;
                                handleNumericInput(e.target.value, setRiskPercentage);
                              }}
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '10px',
                                width: '387px',
                                height: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                background: (!isAuthenticated || selectedAsset) ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: (!selectedAsset || !isAuthenticated) ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                outline: 'none',
                                cursor: !selectedAsset ? 'not-allowed' : 'text',
                                pointerEvents: selectedAsset ? 'auto' : 'none',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Row 2 - Frame 1000004762 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '24px',
                          width: '798px',
                          height: '58px',
                          flex: 'none',
                          order: 1,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Stop Loss - Frame 1000004751 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '0px',
                            gap: '8px',
                            width: '387px',
                            height: '58px',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1,
                          }}
                        >
                          {/* Label */}
                          <label
                            style={{
                              width: '387px',
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
                              margin: 0,
                            }}
                          >
                            {selectedAsset === 'Crypto (BTC, ETH, etc.)' ? 'Stop Loss (%)' : 'Stop Loss (Pips)'}
                          </label>
                          
                          {/* Input - Frame 1000004673 */}
                          <div
                            style={{ position: 'relative', width: '387px' }}
                            onMouseDown={(e) => {
                              if (!selectedAsset) {
                                e.preventDefault();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10
                                });
                                setTimeout(() => setTooltipPosition(null), 3000);
                              }
                            }}
                          >
                            <input
                              type="text"
                              value={stopLoss}
                              disabled={!selectedAsset || !isAuthenticated}
                              onChange={(e) => {
                                if (!isAuthenticated) return;
                                handleNumericInput(e.target.value, setStopLoss);
                              }}
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '10px',
                                width: '387px',
                                height: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                background: (!isAuthenticated || selectedAsset) ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: (!selectedAsset || !isAuthenticated) ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                outline: 'none',
                                cursor: !selectedAsset ? 'not-allowed' : 'text',
                                pointerEvents: selectedAsset ? 'auto' : 'none',
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Pip Value (Gold/Forex) or Position Size (Crypto) - Frame 1000004750 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '0px',
                            gap: '8px',
                            width: '387px',
                            height: '58px',
                            flex: 'none',
                            order: 1,
                            flexGrow: 1,
                          }}
                        >
                          {/* Label */}
                          <label
                            style={{
                              width: '387px',
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
                              margin: 0,
                            }}
                          >
                            {selectedAsset === 'Crypto (BTC, ETH, etc.)' ? 'Position Size (USD)' : 'Pip Value ($)'}
                          </label>
                          
                          {/* For Crypto: Position Size, For Gold: Read-only input, For Forex: Lot Type Dropdown */}
                          {!selectedAsset ? (
                            <div
                              style={{ position: 'relative', width: '387px' }}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTooltipPosition({
                                  x: rect.left + rect.width / 2,
                                  y: rect.top - 10
                                });
                                setTimeout(() => setTooltipPosition(null), 3000);
                              }}
                            >
                              <input
                                type="text"
                                value=""
                                disabled
                                readOnly
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '10px',
                                width: '387px',
                                height: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                background: !isAuthenticated ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: 'rgba(255, 255, 255, 0.5)',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                outline: 'none',
                                cursor: 'not-allowed',
                              }}
                            />
                            </div>
                          ) : selectedAsset === 'Crypto (BTC, ETH, etc.)' ? (
                            <input
                              type="text"
                              value={lotSize}
                              readOnly
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '10px',
                                width: '387px',
                                height: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                background: 'transparent',
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#FFFFFF',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                outline: 'none',
                                cursor: 'not-allowed',
                              }}
                            />
                          ) : selectedAsset === 'Gold (XAUUSD)' ? (
                            <input
                              type="text"
                              value={pipValue}
                              readOnly
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '12px 16px',
                                gap: '10px',
                                width: '387px',
                                height: '40px',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '8px',
                                background: 'transparent',
                                fontFamily: 'Gilroy-Medium',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '100%',
                                color: '#FFFFFF',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                                outline: 'none',
                                cursor: 'not-allowed',
                              }}
                            />
                          ) : (
                            <div
                              ref={forexLotTypeRef}
                              style={{
                                position: 'relative',
                                width: '387px',
                                flex: 'none',
                                order: 1,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                              }}
                            >
                              {/* Dropdown Button */}
                              <div
                                onClick={() => {
                                  if (!isAuthenticated) return;
                                  setIsForexLotTypeDropdownOpen(!isForexLotTypeDropdownOpen);
                                }}
                                style={{
                                  boxSizing: 'border-box',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  paddingTop: '12px',
                                  paddingRight: '16px',
                                  paddingBottom: '12px',
                                  paddingLeft: '16px',
                                  gap: '10px',
                                  width: '387px',
                                  height: '40px',
                                  background: 'transparent',
                                  border: '1px solid rgba(255, 255, 255, 0.3)',
                                  borderRadius: '8px',
                                  cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                                  opacity: isAuthenticated ? 1 : 0.6,
                                }}
                              >
                                {/* Selected Lot Type Text */}
                                <span
                                  style={{
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    color: '#FFFFFF',
                                    order: 0,
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {forexLotType} (${forexLotTypePipValues[forexLotType]}/pip)
                                </span>

                                {/* Arrow Icon */}
                                <div
                                  style={{
                                    width: '20px',
                                    height: '20px',
                                    position: 'relative',
                                    flex: 'none',
                                    order: 1,
                                    flexGrow: 0,
                                    flexShrink: 0,
                                  }}
                                >
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      position: 'absolute',
                                      left: '50%',
                                      top: '50%',
                                      transform: isForexLotTypeDropdownOpen
                                        ? 'translate(-50%, -50%) rotate(180deg)'
                                        : 'translate(-50%, -50%) rotate(0deg)',
                                      transition: 'transform 0.3s ease',
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
                              </div>

                              {/* Dropdown Menu */}
                              {isForexLotTypeDropdownOpen && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    marginTop: '8px',
                                    width: '100%',
                                    background: '#1F1F1F',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                    zIndex: 1000,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {forexLotTypes.map((lotType, index) => (
                                    <div
                                      key={index}
                                      onClick={() => {
                                        setForexLotType(lotType);
                                        setIsForexLotTypeDropdownOpen(false);
                                      }}
                                      style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        fontFamily: 'Gilroy-Medium',
                                        fontStyle: 'normal',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '100%',
                                        color: '#FFFFFF',
                                        backgroundColor: forexLotType === lotType
                                          ? 'rgba(255, 255, 255, 0.1)'
                                          : 'transparent',
                                        transition: 'background-color 0.2s ease',
                                      }}
                                      onMouseEnter={(e) => {
                                        if (forexLotType !== lotType) {
                                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                                        }
                                      }}
                                      onMouseLeave={(e) => {
                                        if (forexLotType !== lotType) {
                                          e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                      }}
                                    >
                                      {lotType} (${forexLotTypePipValues[lotType]}/pip)
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Row 3 - Frame 1000004763 (Only for Gold and Forex, hidden for Crypto) */}
                      {selectedAsset !== 'Crypto (BTC, ETH, etc.)' && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '24px',
                          width: '798px',
                          height: '58px',
                          flex: 'none',
                          order: 2,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Lot Size - Frame 1000004751 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            padding: '0px',
                            gap: '8px',
                            width: '798px',
                            height: '58px',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1,
                          }}
                        >
                          {/* Label */}
                          <label
                            style={{
                              width: '798px',
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
                              margin: 0,
                            }}
                          >
                            Lot Size
                          </label>
                          
                          {/* Input - Frame 1000004673 */}
                          <input
                            type="text"
                            value={lotSize}
                            readOnly
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '12px 16px',
                              gap: '10px',
                              width: '798px',
                              height: '40px',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              borderRadius: '8px',
                              background: (!isAuthenticated || selectedAsset) ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: !selectedAsset ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF',
                              flex: 'none',
                              order: 1,
                              alignSelf: 'stretch',
                              flexGrow: 0,
                              outline: 'none',
                              cursor: 'not-allowed',
                            }}
                          />
                        </div>
                      </div>
                      )}
                      
                      {/* Buttons Row - Frame 1000012140 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '20px',
                          width: '798px',
                          height: '48px',
                          flex: 'none',
                          order: 2,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Buttons Container - Frame 1000012178 */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '20px',
                            width: '705px',
                            height: '48px',
                            flex: 'none',
                            order: 0,
                            flexGrow: 1,
                          }}
                        >
                          {/* Save Scenario Button - Frame 23 */}
                          <button
                            disabled={!isAuthenticated}
                            onClick={() => {
                              if (!isAuthenticated) return;
                              setEditingScenarioId(null);
                              setScenarioName('');
                              setTradingPair(null);
                              setIsSaveScenarioPopupOpen(true);
                            }}
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '12px 16px',
                              gap: '10px',
                              width: '184.5px',
                              height: '48px',
                              background: '#FFFFFF',
                              borderRadius: '100px',
                              border: 'none',
                              cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                              flex: 'none',
                              order: 0,
                              flexGrow: 0,
                              outline: 'none',
                              opacity: isAuthenticated ? 1 : 0.6,
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onFocus={(e) => e.currentTarget.style.outline = 'none'}
                          >
                            <span
                              style={{
                                width: '107px',
                                height: '16px',
                                fontFamily: 'Gilroy-SemiBold',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#404040',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0,
                              }}
                            >
                              Save Scenario
                            </span>
                          </button>
                          
                          {/* Formula Button - Frame 1000012106 */}
                          <button
                            onClick={() => {
                              if (!isAuthenticated || !selectedAsset) return;
                              setIsFormulaPopupOpen(true);
                            }}
                            disabled={!selectedAsset || !isAuthenticated}
                            style={{
                              boxSizing: 'border-box',
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '12px 16px',
                              gap: '10px',
                              width: '184.5px',
                              height: '48px',
                              border: '1px solid #909090',
                              borderRadius: '100px',
                              background: 'transparent',
                              cursor: !selectedAsset ? 'not-allowed' : 'pointer',
                              opacity: !selectedAsset ? 0.5 : 1,
                              flex: 'none',
                              order: 1,
                              flexGrow: 0,
                              outline: 'none',
                            }}
                            onMouseDown={(e) => e.preventDefault()}
                            onFocus={(e) => e.currentTarget.style.outline = 'none'}
                          >
                            <span
                              style={{
                                width: '60px',
                                height: '16px',
                                fontFamily: 'Gilroy-SemiBold',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '16px',
                                lineHeight: '100%',
                                textAlign: 'center',
                                color: '#909090',
                                flex: 'none',
                                order: 0,
                                flexGrow: 0,
                              }}
                            >
                              Formula
                            </span>
                          </button>
                        </div>
                        
                        {/* Reset Button - Frame 1000012107 */}
                        <button
                          onClick={() => {
                            if (!isAuthenticated) return;
                            handleReset();
                          }}
                          disabled={!isAuthenticated}
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '12px 16px',
                            gap: '10px',
                            width: '73px',
                            height: '48px',
                            borderRadius: '100px',
                            background: 'transparent',
                            border: 'none',
                            cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                            outline: 'none',
                            opacity: isAuthenticated ? 1 : 0.6,
                          }}
                          onMouseDown={(e) => e.preventDefault()}
                          onFocus={(e) => e.currentTarget.style.outline = 'none'}
                        >
                          <span
                            style={{
                              width: '41px',
                              height: '16px',
                              fontFamily: 'Gilroy-SemiBold',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '16px',
                              lineHeight: '100%',
                              textAlign: 'center',
                              color: '#FFFFFF',
                              flex: 'none',
                              order: 0,
                              flexGrow: 0,
                            }}
                          >
                            Reset
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Bottom Gradient Mask for non-authenticated users */}
                {!isAuthenticated && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)',
                      pointerEvents: 'none',
                      zIndex: 15,
                      borderRadius: '16px',
                    }}
                  />
                )}
              </div>

              {/* Calculator Tile 2 - Results */}
              <div
                className="relative overflow-hidden"
                style={{
                  width: '394px',
                  minHeight: '326px',
                  borderRadius: '16px',
                  background: '#1F1F1F',
                  boxSizing: 'border-box',
                }}
              >
                {/* Demo Overlay for non-authenticated users */}
                {!isAuthenticated && (
                  <div
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
                      style={{
                        fontFamily: 'Gilroy-SemiBold',
                        fontSize: '28px',
                        fontWeight: 400,
                        color: '#FFFFFF',
                        margin: 0,
                        textAlign: 'center',
                      }}
                    >
                      Demo
                    </h2>
                    <p
                      style={{
                        fontFamily: 'Gilroy-Medium',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#FFFFFF',
                        margin: 0,
                        textAlign: 'center',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Subscribe to access full calculator
                    </p>
                  </div>
                )}
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
                
                {/* Content - Frame 104 */}
                <div 
                  className="relative z-10"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '24px',
                    gap: '32px',
                    width: '394px',
                    minHeight: '326px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 1,
                    filter: isAuthenticated ? 'none' : 'blur(8px)',
                    pointerEvents: isAuthenticated ? 'auto' : 'none',
                  }}
                >
                  {/* Results Title */}
                  <h3
                    style={{
                      width: '346px',
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
                      margin: 0,
                    }}
                  >
                    Results
                  </h3>
                  
                  {/* Divider - Vector 77 */}
                  <div
                    style={{
                      width: '346px',
                      height: '0px',
                      border: '1px solid #404040',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  />
                  
                  {/* Results Content */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '32px',
                      width: '346px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    {/* Account Balance Row */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px',
                        width: '346px',
                        height: '16px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#909090',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      >
                        Account Balance
                      </span>
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          textAlign: 'right',
                        }}
                      >
                        {accountBalance ? `$${parseFloat(accountBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                      </span>
                    </div>
                    
                    {/* Risk % Row */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px',
                        width: '346px',
                        height: '16px',
                        flex: 'none',
                        order: 1,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#909090',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      >
                        Risk %
                      </span>
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          textAlign: 'right',
                        }}
                      >
                        {riskPercentage ? `${parseFloat(riskPercentage).toFixed(2)}%` : '-'}
                      </span>
                    </div>
                    
                    {/* Stop Loss Row */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px',
                        width: '346px',
                        height: '16px',
                        flex: 'none',
                        order: 2,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#909090',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      >
                        Stop Loss
                      </span>
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          textAlign: 'right',
                        }}
                      >
                        {stopLoss ? `${parseFloat(stopLoss).toFixed(2)}${selectedAsset === 'Crypto (BTC, ETH, etc.)' ? '%' : ''}` : '-'}
                      </span>
                    </div>
                    
                    {/* Pip Value Row (Only for Gold and Forex) */}
                    {(selectedAsset === 'Gold (XAUUSD)' || selectedAsset === 'Currency (Forex Pairs)') && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0px',
                          width: '346px',
                          height: '16px',
                          flex: 'none',
                          order: 3,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        <span
                          style={{
                            width: 'auto',
                            height: '16px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        >
                          Pip Value
                        </span>
                        <span
                          style={{
                            width: 'auto',
                            height: '16px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '16px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                            textAlign: 'right',
                          }}
                        >
                          {selectedAsset === 'Gold (XAUUSD)' 
                            ? '$1/pip' 
                            : selectedAsset === 'Currency (Forex Pairs)' 
                              ? `$${forexLotTypePipValues[forexLotType]}/pip`
                              : '-'}
                        </span>
                      </div>
                    )}
                    
                    {/* Position Size / Lot Size Row */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px',
                        width: '346px',
                        height: '16px',
                        flex: 'none',
                        order: 4,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#909090',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      >
                        {selectedAsset === 'Crypto (BTC, ETH, etc.)' ? 'Position Size' : 'Lot Size'}
                      </span>
                      <span
                        style={{
                          width: 'auto',
                          height: '16px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '16px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                          textAlign: 'right',
                        }}
                      >
                        {lotSize ? (selectedAsset === 'Crypto (BTC, ETH, etc.)' ? `$${parseFloat(lotSize).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : lotSize) : '-'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Gradient Mask for non-authenticated users */}
                {!isAuthenticated && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)',
                      pointerEvents: 'none',
                      zIndex: 15,
                      borderRadius: '16px',
                    }}
                  />
                )}
              </div>
            </div>
            
            {/* Saved Scenarios Section - Authorized Users Only */}
            {isAuthenticated && (
              <>
                {/* Big Gap */}
                <div style={{ marginTop: '250px' }}></div>
                
                {/* Saved Scenarios Title and Description */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '8px',
                    width: '1280px',
                    flex: 'none',
                    order: 0,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Saved Scenarios Title */}
                  <h2
                    style={{
                      width: '1280px',
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
                    Saved Scenarios
                  </h2>
                  
                  {/* Description */}
                  <p
                    style={{
                      width: '1280px',
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
                    Manage or modify your previously saved position setups.
                  </p>
                </div>
                
                {/* Saved Scenarios Tile */}
                <div
                  ref={savedScenariosTileRef}
                  className="relative"
                  style={{
                    width: '1280px',
                    minHeight: '164px',
                    maxHeight: '750px',
                    height: 'auto',
                    borderRadius: '16px',
                    background: '#1F1F1F',
                    boxSizing: 'border-box',
                    marginTop: '32px',
                    overflow: 'visible',
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
                  
                  {/* Content */}
                  <div 
                    className="relative z-10 w-full flex flex-col" 
                    style={{ 
                      padding: '24px', 
                      gap: '24px',
                      minHeight: '100%',
                    }}
                  >
                    {/* Header Row - Frame 1000004673 */}
                    <div
                      style={{
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '16px',
                        gap: '24px',
                        width: '1232px',
                        height: '46px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Scenario Name - Frame 1000012108 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
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
                          Scenario Name
                        </span>
                      </div>

                      {/* Pair - Frame 1000012109 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 1,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Pair
                        </span>
                      </div>

                      {/* Risk % - Frame 1000012110 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 2,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Risk %
                        </span>
                      </div>

                      {/* Position Size - Frame 1000012111 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 3,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Position Size
                        </span>
                      </div>

                      {/* Position Value - Frame 1000012113 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 4,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Position Value
                        </span>
                      </div>

                      {/* Date - Frame 1000012112 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 5,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Date
                        </span>
                      </div>

                      {/* Actions - Frame 1000012114 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          padding: '0px',
                          gap: '8px',
                          width: '150.86px',
                          height: '14px',
                          flex: 'none',
                          order: 6,
                          flexGrow: 1,
                        }}
                      >
                        <span
                          style={{
                            width: '150.86px',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            textAlign: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 0,
                            alignSelf: 'stretch',
                            flexGrow: 0,
                          }}
                        >
                          Actions
                        </span>
                      </div>
                    </div>

                    {/* Scenarios Rows */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        width: '100%',
                        overflowY: 'auto',
                        maxHeight: '580px',
                        flex: 1,
                      }}
                    >
                      {savedScenarios.length === 0 ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '40px',
                            color: 'rgba(255, 255, 255, 0.5)',
                            fontFamily: 'Gilroy-Medium',
                            fontSize: '14px',
                          }}
                        >
                          No saved scenarios yet. Save your first scenario to see it here.
                        </div>
                      ) : (() => {
                        // Calculate pagination
                        const totalPages = Math.ceil(savedScenarios.length / scenariosPerPage);
                        const startIndex = (currentPage - 1) * scenariosPerPage;
                        const endIndex = startIndex + scenariosPerPage;
                        const currentScenarios = savedScenarios.slice(startIndex, endIndex);
                        const startItem = startIndex + 1;
                        const endItem = Math.min(endIndex, savedScenarios.length);

                        return (
                          <>
                            {currentScenarios.map((scenario) => {
                          // Calculate entry price (using account balance as reference, or position value)
                          const entryPrice = scenario.positionValue 
                            ? parseFloat(scenario.positionValue) / (scenario.lotSize ? parseFloat(scenario.lotSize) : 1)
                            : scenario.accountBalance || 0;
                          
                          // Calculate Stop Loss in dollars for all asset types
                          let stopLossInDollars = 0;
                          if (scenario.stopLoss && scenario.accountBalance && scenario.riskPercentage) {
                            const balance = parseFloat(scenario.accountBalance) || 0;
                            const riskPercent = parseFloat(scenario.riskPercentage) || 0;
                            const stopLoss = parseFloat(scenario.stopLoss) || 0;
                            const lotSize = parseFloat(scenario.lotSize) || 0;

                            if (scenario.selectedAsset === 'Crypto (BTC, ETH, etc.)') {
                              // For Crypto: SL in $ = Risk Amount = (Account Balance × Risk%) / 100
                              stopLossInDollars = (balance * riskPercent) / 100;
                            } else if (scenario.selectedAsset === 'Currency (Forex Pairs)') {
                              // For Forex: SL in $ = Stop Loss (pips) × Pip Value per lot × Lot Size
                              // Pip Value depends on lot type
                              const pipValuePerLot = scenario.forexLotType 
                                ? (forexLotTypePipValues[scenario.forexLotType] || 10)
                                : 10; // Default to Standard Lot
                              stopLossInDollars = stopLoss * pipValuePerLot * lotSize;
                            } else if (scenario.selectedAsset === 'Gold (XAUUSD)') {
                              // For Gold: 1 pip = $1 USD
                              // So if stop loss is 45 pips, it should show $45
                              stopLossInDollars = stopLoss;
                            }
                          }
                          
                          // Format stop loss for display (always in $)
                          const stopLossDisplay = stopLossInDollars > 0
                            ? `$${stopLossInDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '-';

                          return (
                            <div
                              key={scenario.id}
                              style={{
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '16px',
                                gap: '24px',
                                width: '1232px',
                                height: '46px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                flex: 'none',
                                order: 0,
                                alignSelf: 'stretch',
                                flexGrow: 0,
                              }}
                            >
                              {/* Scenario Name - Frame 1000012108 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: '0px',
                                  gap: '4px',
                                  width: '150.86px',
                                  height: '28px',
                                  flex: 'none',
                                  order: 0,
                                  flexGrow: 1,
                                }}
                              >
                                {/* Conservative BTC long */}
                                <span
                                  style={{
                                    width: '150.86px',
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
                                  {scenario.scenarioName}
                                </span>
                                
                                {/* Entry: $50 | SL: $45 */}
                                <span
                                  style={{
                                    width: '150.86px',
                                    height: '10px',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '10px',
                                    lineHeight: '100%',
                                    color: '#909090',
                                    flex: 'none',
                                    order: 1,
                                    alignSelf: 'stretch',
                                    flexGrow: 0,
                                  }}
                                >
                                  {scenario.accountBalance && scenario.stopLoss
                                    ? `Entry: $${parseFloat(scenario.accountBalance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} | SL: ${stopLossDisplay}`
                                    : '-'}
                                </span>
                              </div>

                              {/* Pair - Frame 1000012109 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  padding: '0px',
                                  gap: '8px',
                                  width: '150.86px',
                                  height: '14px',
                                  flex: 'none',
                                  order: 1,
                                  flexGrow: 1,
                                }}
                              >
                                <span
                                  style={{
                                    width: '150.86px',
                                    height: '14px',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    textAlign: 'center',
                                    color: '#909090',
                                    flex: 'none',
                                    order: 0,
                                    alignSelf: 'stretch',
                                    flexGrow: 0,
                                  }}
                                >
                                  {scenario.tradingPair}
                                </span>
                              </div>

                              {/* Risk % - Frame 1000012110 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  padding: '0px',
                                  gap: '8px',
                                  width: '150.86px',
                                  height: '14px',
                                  flex: 'none',
                                  order: 2,
                                  flexGrow: 1,
                                }}
                              >
                                <span
                                  style={{
                                    width: '150.86px',
                                    height: '14px',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    textAlign: 'center',
                                    color: '#909090',
                                    flex: 'none',
                                    order: 0,
                                    alignSelf: 'stretch',
                                    flexGrow: 0,
                                  }}
                                >
                                  {scenario.riskPercentage ? `${scenario.riskPercentage}%` : '-'}
                                </span>
                              </div>

                              {/* Position Size - Frame 1000012111 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  padding: '0px',
                                  gap: '8px',
                                  width: '150.86px',
                                  height: '14px',
                                  flex: 'none',
                                  order: 3,
                                  flexGrow: 1,
                                }}
                              >
                                <span
                                  style={{
                                    width: '150.86px',
                                    height: '14px',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    textAlign: 'center',
                                    color: '#909090',
                                    flex: 'none',
                                    order: 0,
                                    alignSelf: 'stretch',
                                    flexGrow: 0,
                                  }}
                                >
                                  {scenario.lotSize 
                                    ? (scenario.selectedAsset === 'Crypto (BTC, ETH, etc.)'
                                        ? parseFloat(scenario.lotSize).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                        : parseFloat(scenario.lotSize).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
                                    : '-'}
                                </span>
                              </div>

                              {/* Position Value - Frame 1000012113 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  padding: '0px',
                                  gap: '8px',
                                  width: '150.86px',
                                  height: '14px',
                                  flex: 'none',
                                  order: 4,
                                  flexGrow: 1,
                                }}
                              >
                                <span
                                  style={{
                                    width: '150.86px',
                                    height: '14px',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    textAlign: 'center',
                                    color: '#909090',
                                    flex: 'none',
                                    order: 0,
                                    alignSelf: 'stretch',
                                    flexGrow: 0,
                                  }}
                                >
                                  {scenario.positionValue 
                                    ? `$${parseFloat(scenario.positionValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : '-'}
                                </span>
                              </div>

                              {/* Date - Frame 1000012112 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'flex-start',
                                  padding: '0px',
                                  gap: '8px',
                                  width: '150.86px',
                                  height: '14px',
                                  flex: 'none',
                                  order: 5,
                                  flexGrow: 1,
                                }}
                              >
                                <span
                                  style={{
                                    width: '150.86px',
                                    height: '14px',
                                    fontFamily: 'Gilroy-Medium',
                                    fontStyle: 'normal',
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '100%',
                                    textAlign: 'center',
                                    color: '#909090',
                                    flex: 'none',
                                    order: 0,
                                    alignSelf: 'stretch',
                                    flexGrow: 0,
                                  }}
                                >
                                  {scenario.createdAt 
                                    ? new Date(scenario.createdAt).toLocaleDateString('en-US', { 
                                        month: '2-digit', 
                                        day: '2-digit', 
                                        year: 'numeric' 
                                      })
                                    : '-'}
                                </span>
                              </div>

                              {/* Actions - Frame 1000012115 */}
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: '0px',
                                  gap: '8px',
                                  width: '150.86px',
                                  height: '24px',
                                  flex: 'none',
                                  order: 6,
                                  flexGrow: 1,
                                }}
                              >
                                {/* Edit Icon - Frame 1000012114 */}
                                <button
                                  onClick={() => {
                                    // Set editing mode and load scenario data
                                    setEditingScenarioId(scenario.id);
                                    setScenarioName(scenario.scenarioName);
                                    setTradingPair(scenario.tradingPair);
                                    setSelectedAsset(scenario.selectedAsset);
                                    setAccountBalance(scenario.accountBalance?.toString() || '');
                                    setRiskPercentage(scenario.riskPercentage?.toString() || '');
                                    setStopLoss(scenario.stopLoss?.toString() || '');
                                    setPipValue(scenario.pipValue?.toString() || '');
                                    setLotSize(scenario.lotSize?.toString() || '');
                                    if (scenario.forexLotType) {
                                      setForexLotType(scenario.forexLotType);
                                    }
                                    // Open save scenario popup
                                    setIsSaveScenarioPopupOpen(true);
                                  }}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    position: 'relative',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 'none',
                                    order: 0,
                                    flexGrow: 0,
                                    outline: 'none',
                                  }}
                                >
                                  {/* Edit Icon SVG */}
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      position: 'absolute',
                                      left: '50%',
                                      top: '50%',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                  >
                                    <g clipPath={`url(#clip0_edit_${scenario.id})`}>
                                      <path d="M2.75 11.75H13.25V12.5H2.75V11.75Z" fill="#909090"/>
                                      <path d="M11.525 5.375C11.825 5.075 11.825 4.625 11.525 4.325L10.175 2.975C9.875 2.675 9.425 2.675 9.125 2.975L3.5 8.6V11H5.9L11.525 5.375ZM9.65 3.5L11 4.85L9.875 5.975L8.525 4.625L9.65 3.5ZM4.25 10.25V8.9L8 5.15L9.35 6.5L5.6 10.25H4.25Z" fill="#909090"/>
                                    </g>
                                    <defs>
                                      <clipPath id={`clip0_edit_${scenario.id}`}>
                                        <rect width="12" height="12" fill="white" transform="translate(2 2)"/>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </button>

                                {/* Delete Icon - Frame 1000012115 */}
                                <button
                                  onClick={() => {
                                    setScenarioToDelete(scenario.id);
                                    setIsDeleteConfirmOpen(true);
                                  }}
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    position: 'relative',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flex: 'none',
                                    order: 1,
                                    flexGrow: 0,
                                    outline: 'none',
                                  }}
                                >
                                  {/* Delete Icon SVG */}
                                  <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                      position: 'absolute',
                                      left: '50%',
                                      top: '50%',
                                      transform: 'translate(-50%, -50%)',
                                    }}
                                  >
                                    <g clipPath={`url(#clip0_delete_${scenario.id})`}>
                                      <path d="M6.5 6.5H7.25V11H6.5V6.5Z" fill="#BB0404"/>
                                      <path d="M8.75 6.5H9.5V11H8.75V6.5Z" fill="#BB0404"/>
                                      <path d="M3.5 4.25V5H4.25V12.5C4.25 12.6989 4.32902 12.8897 4.46967 13.0303C4.61032 13.171 4.80109 13.25 5 13.25H11C11.1989 13.25 11.3897 13.171 11.5303 13.0303C11.671 12.8897 11.75 12.6989 11.75 12.5V5H12.5V4.25H3.5ZM5 12.5V5H11V12.5H5Z" fill="#BB0404"/>
                                      <path d="M6.5 2.75H9.5V3.5H6.5V2.75Z" fill="#BB0404"/>
                                    </g>
                                    <defs>
                                      <clipPath id={`clip0_delete_${scenario.id}`}>
                                        <rect width="12" height="12" fill="white" transform="translate(2 2)"/>
                                      </clipPath>
                                    </defs>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    );
                  })()}
                    </div>

                    {/* Pagination - Frame 1000004757 - Outside scenarios rows, at bottom */}
                    {(() => {
                      // Only show pagination if there are more than scenariosPerPage scenarios
                      if (savedScenarios.length <= scenariosPerPage) {
                        return null;
                      }

                      const totalPages = Math.ceil(savedScenarios.length / scenariosPerPage);
                      const startIndex = (currentPage - 1) * scenariosPerPage;
                      const endIndex = startIndex + scenariosPerPage;
                      const startItem = startIndex + 1;
                      const endItem = Math.min(endIndex, savedScenarios.length);

                      return (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '24px',
                            width: '100%',
                            minHeight: '30px',
                            flex: 'none',
                            alignSelf: 'stretch',
                            flexGrow: 0,
                            marginTop: '12px',
                            position: 'relative',
                            zIndex: 10,
                            backgroundColor: 'transparent',
                            visibility: 'visible',
                            opacity: 1,
                          }}
                        >
                          {/* 1-10 of 11 - Left side */}
                          <span
                            style={{
                              width: 'auto',
                              height: '14px',
                              fontFamily: 'Gilroy-Medium',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: '14px',
                              lineHeight: '100%',
                              color: '#909090',
                              flex: 'none',
                              order: 0,
                              flexGrow: 0,
                            }}
                          >
                            {startItem}-{endItem} of {savedScenarios.length}
                          </span>

                          {/* Frame 1000004756 - Page Buttons - Right side */}
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              padding: '0px',
                              gap: '8px',
                              width: 'auto',
                              height: '30px',
                              flex: 'none',
                              order: 1,
                              flexGrow: 0,
                            }}
                          >
                            {/* Previous Page Arrow Button */}
                            {currentPage > 1 && (
                              <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                style={{
                                  boxSizing: 'border-box',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  gap: '63px',
                                  width: '32px',
                                  height: '30px',
                                  border: '1px solid #909090',
                                  borderRadius: '8px',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  flex: 'none',
                                  order: 0,
                                  flexGrow: 0,
                                  outline: 'none',
                                  position: 'relative',
                                }}
                                onMouseDown={(e) => e.preventDefault()}
                                onFocus={(e) => e.currentTarget.style.outline = 'none'}
                              >
                                {/* Arrow Icon - Rotated 90deg for previous */}
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%) rotate(90deg)',
                                  }}
                                >
                                  <path
                                    d="M2 2L5 5L8 2"
                                    stroke="#909090"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            )}

                            {/* Page Number Buttons */}
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                              let pageNum;
                              if (totalPages <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage <= 3) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                              } else {
                                pageNum = currentPage - 2 + i;
                              }

                              const isActive = pageNum === currentPage;

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  style={{
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '8px 12px',
                                    gap: '63px',
                                    width: '32px',
                                    height: '30px',
                                    background: isActive ? '#667EEA' : 'transparent',
                                    border: isActive ? '1px solid #667EEA' : '1px solid #909090',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    flex: 'none',
                                    order: i + 1,
                                    flexGrow: 0,
                                    outline: 'none',
                                  }}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onFocus={(e) => e.currentTarget.style.outline = 'none'}
                                >
                                  <span
                                    style={{
                                      width: 'auto',
                                      height: '14px',
                                      fontFamily: 'Gilroy-Medium',
                                      fontStyle: 'normal',
                                      fontWeight: 400,
                                      fontSize: '14px',
                                      lineHeight: '100%',
                                      color: isActive ? '#FFFFFF' : '#909090',
                                      flex: 'none',
                                      order: 0,
                                      flexGrow: 0,
                                    }}
                                  >
                                    {pageNum}
                                  </span>
                                </button>
                              );
                            })}

                            {/* Next Page Arrow Button */}
                            {currentPage < totalPages && (
                              <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                style={{
                                  boxSizing: 'border-box',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: '8px 12px',
                                  gap: '63px',
                                  width: '32px',
                                  height: '30px',
                                  border: '1px solid #909090',
                                  borderRadius: '8px',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  flex: 'none',
                                  order: 6,
                                  flexGrow: 0,
                                  outline: 'none',
                                  position: 'relative',
                                }}
                                onMouseDown={(e) => e.preventDefault()}
                                onFocus={(e) => e.currentTarget.style.outline = 'none'}
                              >
                                {/* Arrow Icon */}
                                <svg
                                  width="10"
                                  height="10"
                                  viewBox="0 0 10 10"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%) rotate(-90deg)',
                                  }}
                                >
                                  <path
                                    d="M2 2L5 5L8 2"
                                    stroke="#909090"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}
            
            {/* Big Gap - For non-authenticated users */}
            {!isAuthenticated && (
              <div style={{ marginTop: '220px' }}></div>
            )}
            
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
          </div>
        </div>
      </div>
      
      {/* Formula Popup Overlay */}
      {isFormulaPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10000,
          }}
          onClick={() => setIsFormulaPopupOpen(false)}
        >
          {/* Formula Popup - Frame 104 */}
          <div
            ref={formulaPopupRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '24px',
              gap: '32px',
              width: '394px',
              height: '408px',
              background: '#1F1F1F',
              borderRadius: '16px',
              boxSizing: 'border-box',
            }}
          >
            {/* Title Section - Frame 1000012179 */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '12px',
                width: '346px',
                height: '78px',
                flex: 'none',
                order: 0,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              {/* Formula Title */}
              <h3
                style={{
                  width: '346px',
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
                  margin: 0,
                }}
              >
                Formula
              </h3>
              
              {/* Description Text */}
              {selectedAsset === 'Gold (XAUUSD)' && (
                <p
                  style={{
                    width: '346px',
                    height: '46px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '145%',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#909090',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Pip Value for Gold: 1 Standard Lot (100 oz) → 1 pip (0.01 move) = $1
                </p>
              )}
              
              {selectedAsset === 'Currency (Forex Pairs)' && (
                <p
                  style={{
                    width: '346px',
                    height: '46px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '145%',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#909090',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Pip Value for Forex: Standard Lot = $10/pip, Mini Lot = $1/pip, Micro Lot = $0.10/pip
                </p>
              )}
              
              {selectedAsset === 'Crypto (BTC, ETH, etc.)' && (
                <p
                  style={{
                    width: '346px',
                    height: '46px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '145%',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#909090',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Position Size is calculated based on risk amount and stop loss percentage.
                </p>
              )}
              
              {/* Divider - Vector 77 */}
              <div
                style={{
                  width: '346px',
                  height: '0px',
                  border: '1px solid #404040',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              />
            </div>
            
            {/* Formula Lines */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '16px',
                flex: 'none',
                order: 1,
                alignSelf: 'stretch',
                flexGrow: 0,
              }}
            >
              {/* Risk Amount Formula */}
              <p
                style={{
                  width: '340px',
                  height: '16px',
                  fontFamily: 'Gilroy-Medium',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#FFFFFF',
                  flex: 'none',
                  order: 2,
                  flexGrow: 0,
                  margin: 0,
                }}
              >
                Risk Amount = (Account Balance × Risk%) / 100
              </p>
              
              {/* Lot Size / Position Size Formula */}
              {selectedAsset === 'Crypto (BTC, ETH, etc.)' ? (
                <p
                  style={{
                    width: '342px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 3,
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Position Size (USD) = Risk Amount / (Stop Loss%)
                </p>
              ) : (
                <p
                  style={{
                    width: '342px',
                    height: '16px',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 3,
                    flexGrow: 0,
                    margin: 0,
                  }}
                >
                  Lot Size = Risk Amount / (Stop Loss × Pip Value)
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Red Tooltip for disabled inputs */}
      {tooltipPosition && (
        <div
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%) translateY(-100%)',
            padding: '8px 12px',
            background: '#FF4444',
            color: '#FFFFFF',
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'Gilroy-Medium',
            whiteSpace: 'nowrap',
            zIndex: 99999,
            pointerEvents: 'none',
            marginBottom: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          }}
        >
          Please select an asset type first
          {/* Tooltip arrow */}
          <div
            style={{
              position: 'absolute',
              bottom: '-5px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid #FF4444',
            }}
          />
        </div>
      )}
      
      {/* Save Scenario Popup */}
      {isSaveScenarioPopupOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => setIsSaveScenarioPopupOpen(false)}
        >
          <div
            ref={saveScenarioPopupRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '24px',
              gap: '24px',
              width: '528px',
              minHeight: '436px',
              background: '#1F1F1F',
              borderRadius: '16px',
              boxSizing: 'border-box',
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '5px',
                position: 'relative',
              }}
            >
              {/* Heading and Close Button */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontSize: '24px',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    margin: 0,
                  }}
                >
                  {editingScenarioId ? 'Update Scenario' : 'Save Scenario'}
                </h2>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsSaveScenarioPopupOpen(false);
                    setEditingScenarioId(null);
                    setScenarioName('');
                    setTradingPair(null);
                  }}
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
                    marginLeft: 'auto',
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
            </div>
            
            {/* Content Area */}
            <div 
              style={{ 
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                flex: 1,
              }}
            >
              {/* Scenario Name Field - Frame 1000004751 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '4px',
                  width: '480px',
                  height: '58px',
                  flex: 'none',
                  order: 1,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Scenario Name Label */}
                <span
                  style={{
                    width: '480px',
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
                  Scenario Name
                </span>
                
                {/* Input Field - Frame 1000004673 */}
                <input
                  type="text"
                  value={scenarioName}
                  onChange={(e) => setScenarioName(e.target.value)}
                  placeholder="e.g, Conservative BTC long"
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '480px',
                    height: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    background: 'transparent',
                    fontFamily: 'Gilroy-Medium',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '100%',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                />
              </div>
              
              {/* Trading Pair Dropdown - Frame 1000012141 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '4px',
                  width: '480px',
                  height: '58px',
                  flex: 'none',
                  order: 2,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Trading Pair Label */}
                <span
                  style={{
                    width: '480px',
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
                  Trading Pair
                </span>
                
                {/* Dropdown Container - Frame 1000004673 */}
                <div
                  ref={tradingPairDropdownRef}
                  style={{
                    position: 'relative',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '480px',
                    height: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Dropdown Button */}
                  <div
                    onClick={() => setIsTradingPairDropdownOpen(!isTradingPairDropdownOpen)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: '100%',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Selected Trading Pair Text */}
                    <span
                      style={{
                        width: '418px',
                        height: '14px',
                        fontFamily: 'Gilroy-Medium',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '100%',
                        color: tradingPair ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                        flex: 'none',
                        order: 0,
                        flexGrow: 1,
                      }}
                    >
                      {tradingPair || 'BTC/USD'}
                    </span>
                    
                    {/* Arrow Icon - Frame 1000004697 */}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        flex: 'none',
                        order: 1,
                        flexGrow: 0,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transform: isTradingPairDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                        }}
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="#909090"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Dropdown Options */}
                  {isTradingPairDropdownOpen && (
                    <div
                      className="trading-pair-dropdown"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '4px',
                        background: '#1F1F1F',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        zIndex: 10001,
                        maxHeight: '200px',
                        overflowY: 'auto',
                      }}
                    >
                      {tradingPairs.map((pair) => (
                        <div
                          key={pair}
                          onClick={() => {
                            setTradingPair(pair);
                            setIsTradingPairDropdownOpen(false);
                          }}
                          style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            fontFamily: 'Gilroy-Medium',
                            fontSize: '14px',
                            color: '#FFFFFF',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          {pair}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Preview Section - Frame 1000004673 */}
              <div
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 16px',
                  gap: '12px',
                  width: '480px',
                  minHeight: '108px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '8px',
                  flex: 'none',
                  order: 3,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Preview Label */}
                <span
                  style={{
                    width: '448px',
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
                  Preview
                </span>
                
                {/* Preview Content - Frame 1000012143 */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '16px',
                    width: '448px',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                  }}
                >
                  {/* Row 1 - Position Size - Frame 1000004754 */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '16px',
                      width: '448px',
                      height: '14px',
                      flex: 'none',
                      order: 0,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    {/* Frame 1000004758 */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0px',
                        gap: '192px',
                        width: '448px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Position Size (units) Label */}
                      <span
                        style={{
                          width: 'auto',
                          height: '14px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#909090',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                        }}
                      >
                        Position Size (units)
                      </span>
                      
                      {/* Position Size Value */}
                      <span
                        style={{
                          width: 'auto',
                          height: '14px',
                          fontFamily: 'Gilroy-Medium',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 1,
                          flexGrow: 0,
                        }}
                      >
                        {lotSize ? (selectedAsset === 'Crypto (BTC, ETH, etc.)' 
                          ? `$${parseFloat(lotSize).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                          : lotSize) : '-'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Row 2 - Risk Amount - Frame 1000004761 */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '24px',
                      width: '448px',
                      height: '14px',
                      flex: 'none',
                      order: 1,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    {/* Frame 1000004754 */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '16px',
                        width: '448px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Frame 1000004758 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '192px',
                          width: '448px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Risk Amount ($) Label */}
                        <span
                          style={{
                            width: 'auto',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        >
                          Risk Amount ($)
                        </span>
                        
                        {/* Risk Amount Value */}
                        <span
                          style={{
                            width: 'auto',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          {accountBalance && riskPercentage 
                            ? `$${((parseFloat(accountBalance) * parseFloat(riskPercentage)) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Row 3 - Position Value - Frame 1000004760 */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '0px',
                      gap: '24px',
                      width: '448px',
                      height: '14px',
                      flex: 'none',
                      order: 2,
                      alignSelf: 'stretch',
                      flexGrow: 0,
                    }}
                  >
                    {/* Frame 1000004754 */}
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '16px',
                        width: '448px',
                        height: '14px',
                        flex: 'none',
                        order: 0,
                        alignSelf: 'stretch',
                        flexGrow: 0,
                      }}
                    >
                      {/* Frame 1000004758 */}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '0px',
                          gap: '192px',
                          width: '448px',
                          height: '14px',
                          flex: 'none',
                          order: 0,
                          alignSelf: 'stretch',
                          flexGrow: 0,
                        }}
                      >
                        {/* Position Value ($) Label */}
                        <span
                          style={{
                            width: 'auto',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#909090',
                            flex: 'none',
                            order: 0,
                            flexGrow: 0,
                          }}
                        >
                          Position Value ($)
                        </span>
                        
                        {/* Position Value */}
                        <span
                          style={{
                            width: 'auto',
                            height: '14px',
                            fontFamily: 'Gilroy-Medium',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#FFFFFF',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                          }}
                        >
                          {accountBalance && lotSize 
                            ? (() => {
                                const balance = parseFloat(accountBalance);
                                const lot = parseFloat(lotSize);
                                if (selectedAsset === 'Crypto (BTC, ETH, etc.)') {
                                  return `$${lot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                } else {
                                  // For Gold/Forex, position value would be lot size * contract size
                                  // This is a simplified calculation - adjust based on your needs
                                  return `$${(lot * 100000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                }
                              })()
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Buttons Container - Frame 1000012140 */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '20px',
                  width: '480px',
                  height: '48px',
                  flex: 'none',
                  order: 4,
                  alignSelf: 'stretch',
                  flexGrow: 0,
                }}
              >
                {/* Save Button - Frame 23 */}
                <button
                  onClick={async () => {
                    if (!scenarioName || !tradingPair) {
                      alert('Please fill in scenario name and trading pair');
                      return;
                    }

                    try {
                      // Calculate risk amount
                      const riskAmt = accountBalance && riskPercentage
                        ? (parseFloat(accountBalance) * parseFloat(riskPercentage)) / 100
                        : null;

                      // Calculate position value
                      let posValue = null;
                      if (accountBalance && lotSize) {
                        const lot = parseFloat(lotSize);
                        if (selectedAsset === 'Crypto (BTC, ETH, etc.)') {
                          posValue = lot;
                        } else {
                          posValue = lot * 100000; // Standard contract size for Gold/Forex
                        }
                      }

                      const isEditing = editingScenarioId !== null;
                      const url = isEditing 
                        ? `/api/scenarios/${editingScenarioId}`
                        : '/api/scenarios';
                      const method = isEditing ? 'PUT' : 'POST';

                      const response = await fetch(url, {
                        method: method,
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          scenarioName,
                          tradingPair,
                          selectedAsset,
                          accountBalance,
                          riskPercentage,
                          stopLoss,
                          pipValue,
                          lotSize,
                          forexLotType: selectedAsset === 'Currency (Forex Pairs)' ? forexLotType : null,
                          riskAmount: riskAmt,
                          positionValue: posValue,
                        }),
                      });

                      const data = await response.json();

                      if (response.ok) {
                        // Reset form and close popup
                        setScenarioName('');
                        setTradingPair(null);
                        setEditingScenarioId(null);
                        setIsSaveScenarioPopupOpen(false);
                        // Refresh scenarios list
                        const fetchResponse = await fetch('/api/scenarios');
                        if (fetchResponse.ok) {
                          const fetchData = await fetchResponse.json();
                          setSavedScenarios(fetchData.scenarios || []);
                        }
                      } else {
                        alert(data.error || `Failed to ${isEditing ? 'update' : 'save'} scenario`);
                      }
                    } catch (error) {
                      console.error(`Error ${editingScenarioId ? 'updating' : 'saving'} scenario:`, error);
                      alert(`An error occurred while ${editingScenarioId ? 'updating' : 'saving'} the scenario`);
                    }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '230px',
                    height: '48px',
                    background: '#FFFFFF',
                    borderRadius: '100px',
                    border: 'none',
                    cursor: 'pointer',
                    flex: 'none',
                    order: 0,
                    flexGrow: 1,
                    outline: 'none',
                  }}
                  onMouseDown={(e) => e.preventDefault()}
                  onFocus={(e) => e.currentTarget.style.outline = 'none'}
                >
                  <span
                    style={{
                      width: editingScenarioId ? '60px' : '37px',
                      height: '16px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#404040',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                    }}
                  >
                    {editingScenarioId ? 'Update' : 'Save'}
                  </span>
                </button>
                
                {/* Cancel Button - Frame 1000012106 */}
                <button
                  onClick={() => {
                    setIsSaveScenarioPopupOpen(false);
                  }}
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px 16px',
                    gap: '10px',
                    width: '230px',
                    height: '48px',
                    border: '1px solid #909090',
                    borderRadius: '100px',
                    background: 'transparent',
                    cursor: 'pointer',
                    flex: 'none',
                    order: 1,
                    flexGrow: 1,
                    outline: 'none',
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.border = '1px solid #909090';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = 'none';
                    e.currentTarget.style.border = '1px solid #909090';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.border = '1px solid #909090';
                  }}
                >
                  <span
                    style={{
                      width: '53px',
                      height: '16px',
                      fontFamily: 'Gilroy-SemiBold',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '16px',
                      lineHeight: '100%',
                      textAlign: 'center',
                      color: '#909090',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0,
                    }}
                  >
                    Cancel
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Popup */}
      {isDeleteConfirmOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
          }}
          onClick={() => {
            setIsDeleteConfirmOpen(false);
            setScenarioToDelete(null);
          }}
        >
          <div
            ref={deleteConfirmPopupRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '24px',
              gap: '24px',
              width: '400px',
              background: '#1F1F1F',
              borderRadius: '16px',
              boxSizing: 'border-box',
            }}
          >
            {/* Header Section */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '5px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'Gilroy-SemiBold',
                  fontSize: '24px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  margin: 0,
                }}
              >
                Delete Scenario
              </h2>
              
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setScenarioToDelete(null);
                }}
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
                  marginLeft: 'auto',
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
            
            {/* Message */}
            <p
              style={{
                fontFamily: 'Gilroy-Medium',
                fontSize: '16px',
                fontWeight: 400,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: '130%',
              }}
            >
              Are you sure you want to delete this scenario? This action cannot be undone.
            </p>
            
            {/* Buttons Container */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '100%',
                height: '48px',
                flex: 'none',
                alignSelf: 'stretch',
                flexGrow: 0,
                boxSizing: 'border-box',
              }}
            >
              {/* Cancel Button */}
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setScenarioToDelete(null);
                }}
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 16px',
                  gap: '10px',
                  flex: '1 1 0',
                  minWidth: 0,
                  height: '48px',
                  border: '1px solid #909090',
                  borderRadius: '100px',
                  background: 'transparent',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.border = '1px solid #909090';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = 'none';
                  e.currentTarget.style.border = '1px solid #909090';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.border = '1px solid #909090';
                }}
              >
                <span
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#909090',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Cancel
                </span>
              </button>
              
              {/* Delete Button */}
              <button
                onClick={async () => {
                  if (!scenarioToDelete) return;
                  
                  try {
                    const response = await fetch(`/api/scenarios/${scenarioToDelete}`, {
                      method: 'DELETE',
                    });
                    if (response.ok) {
                      // Close popup
                      setIsDeleteConfirmOpen(false);
                      setScenarioToDelete(null);
                      // Refresh scenarios list
                      const fetchResponse = await fetch('/api/scenarios');
                      if (fetchResponse.ok) {
                        const fetchData = await fetchResponse.json();
                        setSavedScenarios(fetchData.scenarios || []);
                      }
                    } else {
                      const data = await response.json();
                      alert(data.error || 'Failed to delete scenario');
                    }
                  } catch (error) {
                    console.error('Error deleting scenario:', error);
                    alert('An error occurred while deleting the scenario');
                  }
                }}
                style={{
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 16px',
                  gap: '10px',
                  flex: '1 1 0',
                  minWidth: 0,
                  height: '48px',
                  background: '#BB0404',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  outline: 'none',
                }}
                onMouseDown={(e) => e.preventDefault()}
                onFocus={(e) => e.currentTarget.style.outline = 'none'}
              >
                <span
                  style={{
                    fontFamily: 'Gilroy-SemiBold',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '100%',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Delete
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}


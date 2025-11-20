'use client';



import { useState, useEffect, useRef, Fragment, useCallback } from 'react';

import { useRouter } from 'next/navigation';

import Navbar from '@/components/Navbar';

import Footer from '@/components/Footer';

import NewsletterSubscription from '@/components/forms/NewsletterSubscription';

import { useAuth } from '@/contexts/AuthContext';



export default function CalculatorPage() {



  const auth = useAuth();

  const { isLoading } = auth;

  const isSignedIn = auth.isAuthenticated;



  const router = useRouter();

  const isAuthenticated = isSignedIn;

  const [expandedTiles, setExpandedTiles] = useState<{ [key: number]: boolean }>({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const [accountBalance, setAccountBalance] = useState('');

  const [riskPercentage, setRiskPercentage] = useState('');

  const [stopLoss, setStopLoss] = useState('');

  const [pipValue, setPipValue] = useState('');

  const [lotSize, setLotSize] = useState('');

  const [forexLotType, setForexLotType] = useState('Standard Lot');

  const [isForexLotTypeDropdownOpen, setIsForexLotTypeDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isFormulaPopupOpen, setIsFormulaPopupOpen] = useState(false);

  const formulaPopupRef = useRef<HTMLDivElement>(null);

  // Controls whether the shared save/edit scenario popup is visible.
  const [isSaveScenarioPopupOpen, setIsSaveScenarioPopupOpen] = useState(false);

  const saveScenarioPopupRef = useRef<HTMLDivElement>(null);

  const [scenarioName, setScenarioName] = useState('');

  const [tradingPair, setTradingPair] = useState<string | null>(null);

  const [isTradingPairDropdownOpen, setIsTradingPairDropdownOpen] = useState(false);

  const tradingPairDropdownRef = useRef<HTMLDivElement>(null);

  const forexLotTypeRef = useRef<HTMLDivElement>(null);

  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);

  // When populated we render the popup in "edit" mode for the given scenario.
  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [scenarioToDelete, setScenarioToDelete] = useState<string | null>(null);

  const deleteConfirmPopupRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const scenariosPerPage = 10;

  const savedScenariosTileRef = useRef<HTMLDivElement>(null);
  const calculatorInputsRef = useRef<HTMLDivElement>(null);



  const previousAuthStatus = useRef<boolean | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const [isMobileScenariosModalOpen, setIsMobileScenariosModalOpen] = useState(false);

  const previousPage = useRef<number>(1);

  const isEditingScenario = editingScenarioId !== null;

  const resetScenarioPopupState = useCallback(() => {
    setScenarioName('');
    setTradingPair(null);
    setEditingScenarioId(null);
  }, []);

  const handleScenarioPopupClose = useCallback(() => {
    resetScenarioPopupState();
    setIsSaveScenarioPopupOpen(false);
  }, [resetScenarioPopupState]);



  useEffect(() => {

    const handleResize = () => {

      if (typeof window !== 'undefined') {

        setIsMobile(window.innerWidth <= 768);

      }

    };



    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {

      window.removeEventListener('resize', handleResize);

    };

  }, []);



  useEffect(() => {

    if (!isMobile && isMobileScenariosModalOpen) {

      setIsMobileScenariosModalOpen(false);

    }

  }, [isMobile, isMobileScenariosModalOpen]);



  useEffect(() => {

    if (!isMobileScenariosModalOpen) {

      return;

    }

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    return () => {

      document.body.style.overflow = originalOverflow;

    };

  }, [isMobileScenariosModalOpen]);



  useEffect(() => {

    window.scrollTo({ top: 0, behavior: 'auto' });

  }, []);

  



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



  const forexLotTypes = ['Standard Lot', 'Mini Lot', 'Micro Lot'];

  const forexLotTypePipValues: { [key: string]: number } = {

    'Standard Lot': 10,

    'Mini Lot': 1,

    'Micro Lot': 0.10,

  };



  const isCryptoAsset = selectedAsset === 'Crypto (BTC, ETH, etc.)' || selectedAsset === 'Gold (XAUUSD)';



  const formatCompactCurrency = (value: number) => {

    if (!Number.isFinite(value)) {

      return '$0.00';

    }

    const absValue = Math.abs(value);

    if (absValue >= 1000000) {

      return `$${new Intl.NumberFormat('en-US', {

        notation: 'compact',

        compactDisplay: 'short',

        minimumFractionDigits: 2,

        maximumFractionDigits: 2,

      }).format(value)}`;

    }

    return `$${value.toLocaleString('en-US', {

      minimumFractionDigits: 2,

      maximumFractionDigits: 2,

    })}`;

  };



  const buildScenarioDisplayData = (scenario: any) => {

    let stopLossInDollars = 0;

    if (scenario.stopLoss && scenario.accountBalance && scenario.riskPercentage) {

      const balance = parseFloat(scenario.accountBalance) || 0;

      const riskPercent = parseFloat(scenario.riskPercentage) || 0;

      const stopLoss = parseFloat(scenario.stopLoss) || 0;

      const lotSize = parseFloat(scenario.lotSize) || 0;



      if (scenario.selectedAsset === 'Crypto (BTC, ETH, etc.)') {

        stopLossInDollars = (balance * riskPercent) / 100;

      } else if (scenario.selectedAsset === 'Currency (Forex Pairs)') {

        const pipValuePerLot = scenario.forexLotType

          ? (forexLotTypePipValues[scenario.forexLotType] || 10)

          : 10;

        stopLossInDollars = stopLoss * pipValuePerLot * lotSize;

      } else if (scenario.selectedAsset === 'Gold (XAUUSD)') {

        stopLossInDollars = stopLoss;

      }

    }



    const stopLossDisplay = stopLossInDollars > 0

      ? `$${stopLossInDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

      : '-';



    const scenarioNameDisplay = scenario.scenarioName || '-';

    const entryValue = scenario.accountBalance

      ? parseFloat(scenario.accountBalance).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

      : null;

    const entryText = entryValue

      ? `Entry: $${entryValue} | SL: ${stopLossDisplay}`

      : '-';

    const pairDisplay = scenario.tradingPair || '-';

    const riskDisplay = scenario.riskPercentage ? `${scenario.riskPercentage}%` : '-';

    const positionSizeDisplay = scenario.lotSize

      ? parseFloat(scenario.lotSize).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

      : '-';

    const positionValueDisplay = scenario.positionValue

      ? `$${parseFloat(scenario.positionValue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

      : '-';

    const dateDisplay = scenario.createdAt

      ? new Date(scenario.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })

      : '-';



    return {

      scenarioNameDisplay,

      entryText,

      pairDisplay,

      riskDisplay,

      positionSizeDisplay,

      positionValueDisplay,

      stopLossDisplay,

      dateDisplay,

    };

  };





  // Set default values for non-authenticated users

  useEffect(() => {

    if (isLoading) {

      return;

    }

    if (isAuthenticated === false) {

      setSelectedAsset('Gold (XAUUSD)');

      setAccountBalance('80000');

      setRiskPercentage('10');

      setStopLoss('45');

      setPipValue('10');

      setLotSize('160');

      previousAuthStatus.current = false;

      return;

    }



    if (isAuthenticated === true && previousAuthStatus.current !== true) {

      setSelectedAsset(null);

      setAccountBalance('');

      setRiskPercentage('');

      setStopLoss('');

      setPipValue('');

      setLotSize('');

      previousAuthStatus.current = true;

      return;

    }



    previousAuthStatus.current = isAuthenticated ?? null;

  }, [isAuthenticated, isLoading]);



  // Fetch saved scenarios for authenticated users

  useEffect(() => {

    if (isLoading) {

      return;

    }

    const fetchScenarios = async () => {

      if (!isAuthenticated) {

        setSavedScenarios([]);

        return;

      }



      try {

        const response = await fetch('/api/scenarios', {

          credentials: 'include',

        });

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

  }, [isAuthenticated, isLoading]);



  // Scroll to tile on page change

  useEffect(() => {

    if (currentPage > 1 && savedScenariosTileRef.current) {

      savedScenariosTileRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

    }

    previousPage.current = currentPage;

  }, [currentPage]);



  // Calculate Lot Size in real-time for Gold and Forex

  useEffect(() => {

    if (selectedAsset === 'Gold (XAUUSD)') {

      // Set Pip Value as constant for Gold

      setPipValue('10');



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



      // For Gold: Pip Value per standard lot = $10 per pip (constant)

      // This means: 1 Standard Lot (100 oz) → 1 pip (0.01 move) = $10

      // Formula: Lot Size = Risk Amount / (Stop Loss × Pip Value)

      // Where Pip Value = $10 per pip (constant for Gold)

      const pipValuePerStandardLot = 10; // $10 per pip for 1 standard lot (100 oz)

      

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

    setSelectedAsset(null);
    setIsDropdownOpen(false);
    setAccountBalance('');

    setRiskPercentage('');

    setStopLoss('');

    setLotSize('');

    setPipValue('');
    setForexLotType('Standard Lot');
    setEditingScenarioId(null);
    setTradingPair(null);

  };



  const assetOptions = [

    'Gold (XAUUSD)',

    'Crypto (BTC, ETH, etc.)',

    'Currency (Forex Pairs)'

  ];



  const splitAssetLabel = (label: string) => {
    const match = label.match(/^(.*?)(\s*\(.*\))$/);
    if (match) {
      return {
        main: match[1].trim(),
        bracket: match[2].trim(),
      };
    }
    return { main: label, bracket: '' };
  };



  const handleAssetSelect = (asset: string) => {

    setSelectedAsset(asset);

    setIsDropdownOpen(false);

  };



  const handleEditScenario = (scenario: any) => {

    if (!scenario) {

      return;

    }



    setEditingScenarioId(scenario.id);

    setScenarioName(scenario.scenarioName || '');

    setTradingPair(scenario.tradingPair || null);

    setSelectedAsset(scenario.selectedAsset || null);

    setAccountBalance(scenario.accountBalance?.toString() || '');

    setRiskPercentage(scenario.riskPercentage?.toString() || '');

    setStopLoss(scenario.stopLoss?.toString() || '');

    setPipValue(scenario.pipValue?.toString() || '');

    setLotSize(scenario.lotSize?.toString() || '');

    if (scenario.forexLotType) {

      setForexLotType(scenario.forexLotType);

    }



    setIsSaveScenarioPopupOpen(false);

    calculatorInputsRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

  };



  const renderScenarioPreviewSection = () => (

    <>

      {/* Preview Section - Frame 1000004673 */}

      <div

        className="calculator-save-preview"

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

          className="calculator-save-preview-list"

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

                className="calculator-save-preview-label"

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

                className="calculator-save-preview-value"

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

                  ? formatCompactCurrency(parseFloat(lotSize))

                  : parseFloat(lotSize).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : '-'}

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

                className="calculator-save-preview-row"

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

                  className="calculator-save-preview-label"

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

                  className="calculator-save-preview-value"

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

                className="calculator-save-preview-row"

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

                {/* Position Value Label */}

                <span

                  className="calculator-save-preview-label"

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



                {/* Position Value Value */}

                <span

                  className="calculator-save-preview-value"

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

                  {(() => {

                    if (!lotSize) {

                      return '-';

                    }



                    const lot = parseFloat(lotSize);

                    if (!Number.isFinite(lot)) {

                      return '-';

                    }



                    if (selectedAsset === 'Crypto (BTC, ETH, etc.)') {

                      return formatCompactCurrency(lot);

                    }



                    if (selectedAsset === 'Gold (XAUUSD)') {

                      return formatCompactCurrency(lot * 100);

                    }



                    return formatCompactCurrency(lot * 100000);

                  })()}

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>

  );



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

        handleScenarioPopupClose();

      }

    };



    if (isSaveScenarioPopupOpen) {

      document.addEventListener('mousedown', handleClickOutside);

    }



    return () => {

      document.removeEventListener('mousedown', handleClickOutside);

    };

  }, [handleScenarioPopupClose, isSaveScenarioPopupOpen]);



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



  if (isLoading) {



    return (

      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">

        <div>Loading...</div>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden calculator-page">

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

        .calculator-page .calculator-saved-mobile-section,

        .calculator-page .calculator-saved-card {

          display: none;

        }

        .calculator-page .calculator-save-popup {

          max-height: 90vh;

          overflow-y: auto;

        }

        .calculator-page .calculator-save-section {

          width: 100%;

        }

        .calculator-page .calculator-save-field-row {

          width: 100%;

          display: flex;

          gap: 16px;

        }

        .calculator-page .calculator-save-field-row > div {

          flex: 1;

        }

        .calculator-page .calculator-save-select-wrapper select {

          appearance: none;

          background-color: #1F1F1F;

        }

        .calculator-page .calculator-save-select-wrapper select::-ms-expand {

          display: none;

        }

        @media (max-width: 768px) {

          .calculator-page .calculator-hero-container {

            padding-top: 94px !important;

            padding-left: 16px !important;

            padding-right: 16px !important;

            padding-bottom: 24px !important;

          }

          .calculator-page .calculator-layout {

            padding-left: 0 !important;

            padding-right: 0 !important;

          }

          .calculator-page .calculator-hero-title {

            width: 100% !important;

            max-width: 343px !important;

            height: auto !important;

            font-size: 32px !important;

            line-height: 120% !important;

            margin-top: 0 !important;

            min-height: 152px !important;

            text-align: left !important;

          }

          .calculator-page .calculator-hero-description {

            width: 100% !important;

            max-width: 343px !important;

            font-size: 16px !important;

            line-height: 130% !important;

            margin-top: 12px !important;

            min-height: 63px !important;

            text-align: left !important;

          }

          .calculator-page .calculator-hero-bullets {

            width: 100% !important;

            max-width: 343px !important;

            gap: 16px !important;

            margin-top: 0 !important;

          }

          .calculator-page .calculator-hero-stack {

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

          }

          .calculator-page .calculator-hero-stack .calculator-hero-bullets {

            width: 343px !important;

            max-width: 343px !important;

            gap: 16px !important;

            margin-top: 0 !important;

            height: auto !important;

            min-height: 112px !important;

          }

          .calculator-page .calculator-hero-stack .calculator-hero-bullet {

            width: 343px !important;

            gap: 8px !important;

          }

          .calculator-page .calculator-hero-stack .calculator-hero-bullet span {

            width: calc(100% - 24px) !important;

          }

          .calculator-page .calculator-hero-stack .calculator-hero-cta {

            width: 343px !important;

            margin-top: 0 !important;

          }

          .calculator-page .calculator-hero-bullet {

            width: 100% !important;

            flex-wrap: wrap !important;

          }

          .calculator-page .calculator-hero-bullet span {

            width: calc(100% - 24px) !important;

          }

            .calculator-page .calculator-tiles-container {

            flex-direction: column !important;

            gap: 24px !important;

          }

          .calculator-page .calculator-hero-cta {

            flex-direction: column !important;

            align-items: flex-start !important;

            width: 343px !important;

            height: 120px !important;

            gap: 20px !important;

            margin-top: 0 !important;

          }

          .calculator-page .calculator-hero-cta-primary,

          .calculator-page .calculator-hero-cta-secondary {

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

          .calculator-page .calculator-hero-cta-primary {

            background: #FFFFFF !important;

            color: #0A0A0A !important;

          }

          .calculator-page .calculator-hero-cta-secondary {

            border: 1px solid #FFFFFF !important;

            color: #FFFFFF !important;

            background: transparent !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-section-wrapper {

            position: relative !important;

            width: 100% !important;

            max-width: 375px !important;

            margin: 0 auto !important;

            padding: 24px 16px 0 !important;

          }

          .calculator-page .calculator-section-heading-block {

            width: 343px !important;

            height: 150px !important;

            gap: 24px !important;

            margin-top: 32px !important;

            margin-left: 0 !important;

            margin-right: 0 !important;

            padding: 0 !important;

            align-items: flex-start !important;

          }

          .calculator-page .calculator-section-title {

            width: 343px !important;

            height: 94px !important;

            font-size: 36px !important;

            line-height: 130% !important;

            text-align: left !important;

          }

          .calculator-page .calculator-section-description {

            width: 343px !important;

            height: 32px !important;

            font-size: 16px !important;

            line-height: 100% !important;

            text-align: left !important;

          }

          .calculator-page .calculator-section-grid {

            flex-direction: column !important;

            align-items: flex-start !important;

            width: 343px !important;

            gap: 32px !important;

            height: auto !important;

            margin-left: 0 !important;

            margin-right: 0 !important;

          }

          .calculator-page .calculator-tile {

            width: 343px !important;

            max-width: 343px !important;

            margin: 0 !important;

          }

          .calculator-page .calculator-inputs-tile {

            min-height: 520px !important;

            height: 520px !important;

            border-radius: 10px !important;

          }

          .calculator-page .calculator-inputs-tile.is-crypto {

            min-height: 380px !important;

            height: 380px !important;

          }

          .calculator-page .calculator-inputs-tile .calculator-input-field-half .calculator-input-control span {

            font-size: 13px !important;

          }

          .calculator-page .calculator-inputs-tile .calculator-input-field-half .calculator-input-control > div,

          .calculator-page .calculator-inputs-tile .calculator-input-field-half .calculator-input-control input {

            width: 100% !important;

          }

          .calculator-page .calculator-inputs-content {

            width: 319px !important;

            max-width: 319px !important;

            padding-top: 20px !important;

            padding-bottom: 20px !important;

            padding-left: 0 !important;

            padding-right: 0 !important;

            gap: 24px !important;

            margin: 0 !important;

            margin-left: -12px !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-asset-row {

            width: 319px !important;

            height: 34px !important;

            gap: 12px !important;

            justify-content: flex-start !important;

            align-items: center !important;

            flex-wrap: nowrap !important;

            margin-bottom: 0 !important;

          }

          .calculator-page .calculator-asset-label {

            width: auto !important;

            height: 16px !important;

            font-size: 16px !important;

            line-height: 100% !important;

            font-family: 'Gilroy-SemiBold' !important;

            flex: 0 0 auto !important;

          }

          .calculator-page .calculator-asset-dropdown {

            flex: 1 1 auto !important;

            width: auto !important;

            display: flex !important;

            justify-content: flex-end !important;

          }

          .calculator-page .calculator-asset-dropdown-button {

            min-width: 140px !important;

            width: auto !important;

            height: 34px !important;

            padding: 4px 12px !important;

            gap: 8px !important;

            border-radius: 8px !important;

            overflow: visible !important;

            white-space: nowrap !important;

            margin-left: auto !important;

          }

          .calculator-page .calculator-asset-dropdown-button span {

            font-size: 14px !important;

            line-height: 130% !important;

            display: inline-flex !important;

            align-items: baseline !important;

            gap: 4px !important;

            white-space: nowrap !important;

          }

          .calculator-page .calculator-forex-dropdown {

            width: 147.5px !important;

          }

          .calculator-page .calculator-forex-dropdown-button {

            box-sizing: border-box !important;

            width: 147.5px !important;

            padding: 12px 12px !important;

            border-radius: 8px !important;

            overflow: hidden !important;

          }

          .calculator-page .calculator-forex-dropdown-button span {

            font-size: 13px !important;

            white-space: nowrap !important;

            overflow: hidden !important;

            text-overflow: ellipsis !important;

          }

          .calculator-page .calculator-forex-dropdown-menu {

            width: 147.5px !important;

          }

          .calculator-page .calculator-inputs-group {

            width: 319px !important;

            gap: 24px !important;

            height: 480px !important;

          }

          .calculator-page .calculator-input-row {

            width: 319px !important;

            height: 58px !important;

            gap: 24px !important;

            flex-wrap: nowrap !important;

          }

          .calculator-page .calculator-input-field {

            width: 319px !important;

            height: 58px !important;

            gap: 4px !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-input-field-half {

            width: 147.5px !important;

          }

          .calculator-page .calculator-input-field-half .calculator-input-control {

            width: 147.5px !important;

          }

          .calculator-page .calculator-input-field-half .calculator-input {

            width: 147.5px !important;

            max-width: 147.5px !important;

          }

          .calculator-page .calculator-input-field:only-child {

            width: 319px !important;

          }

          .calculator-page .calculator-input-label {

            width: 100% !important;

            height: 14px !important;

            font-size: 14px !important;

            line-height: 100% !important;

            font-family: 'Gilroy-Medium' !important;

          }

          .calculator-page .calculator-input-control {

            width: 100% !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-input {

            width: 100% !important;

            height: 40px !important;

            padding: 12px 16px !important;

            gap: 10px !important;

            font-size: 14px !important;

            line-height: 100% !important;

          }

          .calculator-page .calculator-input-actions {

            width: 319px !important;

            flex-direction: column !important;

            gap: 16px !important;

            height: auto !important;

            align-items: flex-start !important;

          }

          .calculator-page .calculator-input-actions button {

            width: 319px !important;

            height: 48px !important;

            justify-content: center !important;

            align-items: center !important;

          }

          .calculator-page .calculator-input-actions button span {

            width: auto !important;

          }

          .calculator-page .calculator-save-popup {

            width: 343px !important;

            max-height: 90vh !important;

            min-height: auto !important;

            padding: 24px !important;

            border-radius: 10px !important;

            gap: 24px !important;

            align-items: flex-start !important;

            justify-content: center !important;

            overflow-y: auto !important;

          }

          .calculator-page .calculator-save-header {

            width: 295px !important;

            height: 20px !important;

            padding: 0 !important;

            gap: 63px !important;

            align-self: center !important;

            justify-content: flex-start !important;

          }

          .calculator-page .calculator-save-header-inner {

            width: 295px !important;

            height: 20px !important;

            gap: 63px !important;

            align-items: flex-start !important;

          }

          .calculator-page .calculator-save-heading {

            width: 133px !important;

            height: 20px !important;

            font-size: 20px !important;

            line-height: 100% !important;

            color: #F3F8FF !important;

          }

          .calculator-page .calculator-save-close {

            width: 20px !important;

            height: 20px !important;

            border-radius: 20px !important;

            border: 1px solid #AFB9BF !important;

          }

          .calculator-page .calculator-save-content {

            width: 295px !important;

            gap: 24px !important;

            align-self: center !important;

          }

          .calculator-page .calculator-save-field {

            width: 295px !important;

            gap: 4px !important;

          }

          .calculator-page .calculator-save-field span {

            width: 295px !important;

            height: 14px !important;

          }

          .calculator-page .calculator-save-field input {

            width: 295px !important;

            height: 40px !important;

            border-radius: 8px !important;

          }

          .calculator-page .calculator-save-field-row {

            flex-direction: column !important;

            gap: 16px !important;

          }

          .calculator-page .calculator-save-field-row > div {

            width: 100% !important;

          }

          .calculator-page .calculator-save-dropdown {

            width: 295px !important;

            height: 40px !important;

            border-radius: 8px !important;

            padding: 12px 16px !important;

          }

          .calculator-page .calculator-save-dropdown-button {

            width: 263px !important;

            gap: 10px !important;

          }

          .calculator-page .calculator-save-dropdown-button span {

            width: 233px !important;

            font-size: 14px !important;

            line-height: 100% !important;

            overflow: hidden !important;

            text-overflow: ellipsis !important;

            white-space: nowrap !important;

          }

          .calculator-page .calculator-save-dropdown-button span.has-value {

            color: #FFFFFF !important;

          }

          .calculator-page .calculator-save-dropdown .trading-pair-dropdown {

            width: 295px !important;

          }

          .calculator-page .calculator-save-preview {

            width: 295px !important;

            min-height: 108px !important;

            padding: 12px 16px !important;

            border-radius: 8px !important;

          }

      .calculator-page .calculator-save-preview > span,

      .calculator-page .calculator-save-preview-list,

      .calculator-page .calculator-save-preview-list > div,

      .calculator-page .calculator-save-preview-list > div > div,

      .calculator-page .calculator-save-preview-row {

        width: 100% !important;

        max-width: 295px !important;

        margin: 0 auto !important;

      }

      .calculator-page .calculator-save-preview-row {

        display: flex !important;

        flex-direction: row !important;

        justify-content: space-between !important;

        align-items: center !important;

        gap: 8px !important;

        width: 100% !important;

      }

      .calculator-page .calculator-save-preview-label {

        color: #909090 !important;

        text-align: left !important;

        flex: 1 1 auto !important;

        display: block !important;

        min-width: 0 !important;

        max-width: 175px !important;

        white-space: nowrap !important;

      }

      .calculator-page .calculator-save-preview-value {

        color: #FFFFFF !important;

        text-align: right !important;

        flex: 0 0 auto !important;

        min-width: 0 !important;

        max-width: 115px !important;

        overflow: hidden !important;

        white-space: nowrap !important;

        text-overflow: ellipsis !important;

        display: block !important;

      }

          .calculator-page .calculator-save-actions {

            width: 295px !important;

            height: 116px !important;

            flex-direction: column !important;

            gap: 20px !important;

            align-items: stretch !important;

          }

          .calculator-page .calculator-save-actions button {

            width: 295px !important;

            height: 48px !important;

            border-radius: 100px !important;

          }

          .calculator-page .calculator-save-actions button:first-child {

            background: #FFFFFF !important;

            color: #404040 !important;

          }

          .calculator-page .calculator-save-actions button:last-child {

            border: 1px solid #909090 !important;

            color: #909090 !important;

            background: transparent !important;

          }

          .calculator-page .calculator-save-actions button span {

            font-size: 16px !important;

            line-height: 100% !important;

          }

          .calculator-page .calculator-results-tile {

            min-height: 372px !important;

            height: 372px !important;

          }

          .calculator-page .calculator-results-content {

            width: 343px !important;

            max-width: 343px !important;

            padding: 24px !important;

            gap: 32px !important;

          }

          .calculator-page .calculator-results-content > h3 {

            width: 295px !important;

            font-size: 20px !important;

            line-height: 100% !important;

          }

          .calculator-page .calculator-results-content > div {

            width: 295px !important;

          }

          .calculator-page .calculator-results-list {

            width: 295px !important;

            gap: 32px !important;

          }

          .calculator-page .calculator-results-list > div {

            width: 295px !important;

          }

          .calculator-page .calculator-results-list span {

            font-size: 16px !important;

            line-height: 100% !important;

          }

          .calculator-page .calculator-tile {

            width: 100% !important;

            max-width: 343px !important;

            margin: 0 auto !important;

          }

          .calculator-page .calculator-tile-content {

            padding: 20px !important;

          }

          .calculator-page .calculator-section-heading {

            align-items: flex-start !important;

            width: 100% !important;

            max-width: 343px !important;

            margin: 0 !important;

            gap: 16px !important;

            padding: 0 !important;

          }

          .calculator-page .calculator-wide-tile {

            width: 100% !important;

            max-width: 343px !important;

            margin: 32px auto 0 !important;

          }

          .calculator-page .calculator-saved-gap {

            display: none !important;

          }

          .calculator-page .calculator-saved-heading {

            display: none !important;

          }

          .calculator-page .calculator-saved-content {

            padding: 20px 12px !important;

            gap: 16px !important;

          }

          .calculator-page .calculator-saved-content {

            padding: 20px 12px !important;

            gap: 16px !important;

          }

          .calculator-page .calculator-saved-mobile-section {

            display: flex !important;

            flex-direction: column !important;

            align-items: flex-start !important;

            padding: 0 !important;

            gap: 12px !important;

            width: 319px !important;

            margin: 0 auto !important;

          }

          .calculator-page .calculator-saved-mobile-title-row {

            display: flex !important;

            flex-direction: row !important;

            align-items: center !important;

            padding: 0 !important;

            gap: 24px !important;

            width: 319px !important;

            height: 20px !important;

          }

          .calculator-page .calculator-saved-mobile-title-block {

            display: flex !important;

            flex-direction: column !important;

            align-items: flex-start !important;

            padding: 0 !important;

            gap: 12px !important;

            width: 232px !important;

            height: 20px !important;

            flex-grow: 1 !important;

          }

          .calculator-page .calculator-saved-mobile-title-block h3 {

            font-family: 'Gilroy-SemiBold' !important;

            font-style: normal !important;

            font-weight: 400 !important;

            font-size: 20px !important;

            line-height: 100% !important;

            color: #FFFFFF !important;

            width: 155px !important;

            height: 20px !important;

            margin: 0 !important;

          }

          .calculator-page .calculator-saved-mobile-actions {

            display: flex !important;

            flex-direction: row !important;

            align-items: center !important;

            padding: 0 !important;

            gap: 4px !important;

            width: 63px !important;

            height: 17px !important;

          }

          .calculator-page .calculator-saved-mobile-viewall {

            display: flex !important;

            flex-direction: row !important;

            align-items: center !important;

            justify-content: center !important;

            padding: 0 !important;

            gap: 4px !important;

            width: 63px !important;

            height: 17px !important;

            background: transparent !important;

            border: none !important;

            cursor: pointer !important;

          }

          .calculator-page .calculator-saved-mobile-viewall span:first-child {

            font-family: 'Gilroy-SemiBold' !important;

            font-style: normal !important;

            font-weight: 400 !important;

            font-size: 12px !important;

            line-height: 145% !important;

            color: #FFFFFF !important;

            width: 43px !important;

            height: 17px !important;

            text-align: center !important;

          }

          .calculator-page .calculator-saved-mobile-viewall-icon {

            width: 16px !important;

            height: 16px !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            transform: rotate(-90deg) !important;

          }

          .calculator-page .calculator-saved-mobile-description {

            font-family: 'Gilroy-Medium' !important;

            font-style: normal !important;

            font-weight: 400 !important;

            font-size: 16px !important;

            line-height: 100% !important;

            color: #FFFFFF !important;

            width: 319px !important;

            height: auto !important;

            margin: 0 !important;

          }

          .calculator-page .calculator-saved-mobile-modal {

            position: fixed !important;

            top: 0 !important;

            left: 0 !important;

            width: 100vw !important;

            height: 100vh !important;

            background: rgba(0, 0, 0, 0.6) !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            z-index: 1000 !important;

            padding: 16px !important;

          }

          .calculator-page .calculator-saved-mobile-modal-content {

            width: 343px !important;

            max-height: calc(100vh - 64px) !important;

            background: #1F1F1F !important;

            border-radius: 16px !important;

            padding: 24px 12px !important;

            display: flex !important;

            flex-direction: column !important;

            gap: 20px !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-saved-mobile-modal-close {

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

          }

          .calculator-page .calculator-saved-mobile-modal-list {

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

          .calculator-page .calculator-newsletter-section {

            width: 100% !important;

            margin: 48px 0 !important;

            padding: 0 0 !important;

          }

          .calculator-page .calculator-newsletter-section > div {

            width: 100% !important;

            margin: 0 !important;

            padding: 0 !important;

          }

          .calculator-page .calculator-saved-header {

            display: none !important;

          }

          .calculator-page .calculator-saved-list {

            display: flex !important;

            flex-direction: column !important;

            width: 319px !important;

            margin: 0 auto !important;

            gap: 16px !important;

            max-height: 520px !important;

            overflow-y: auto !important;

            padding-right: 4px !important;

            overflow-x: hidden !important;

          }

          .calculator-page .calculator-saved-list.is-empty {

            max-height: none !important;

            overflow: visible !important;

            padding-right: 0 !important;

          }

          .calculator-page .calculator-saved-empty {

            width: 100% !important;

            padding: 32px 0 !important;

          }

          .calculator-page .calculator-saved-row {

            display: none !important;

          }

          .calculator-page .calculator-saved-card {

            display: flex !important;

            flex-direction: column !important;

            justify-content: flex-start !important;

            align-items: stretch !important;

            padding: 24px 16px 36px !important;

            gap: 20px !important;

            width: 319px !important;

            min-height: 272px !important;

            border: 1px solid rgba(255, 255, 255, 0.3) !important;

            border-radius: 8px !important;

            background: #1F1F1F !important;

            box-sizing: border-box !important;

            height: auto !important;

            overflow: visible !important;

            margin-bottom: 16px !important;

          }

          .calculator-page .calculator-saved-card-inner {

            display: flex !important;

            flex-direction: column !important;

            align-items: flex-start !important;

            padding: 0 !important;

            gap: 16px !important;

            width: 100% !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-saved-card-header {

            display: flex !important;

            flex-direction: row !important;

            justify-content: center !important;

            align-items: center !important;

            padding: 0 !important;

            gap: 16px !important;

            width: 100% !important;

            height: 20px !important;

          }

          .calculator-page .calculator-saved-card-title {

            display: flex !important;

            flex-direction: column !important;

            gap: 4px !important;

            width: 100% !important;

          }

          .calculator-page .calculator-saved-card-title-text {

            font-size: 16px !important;

            line-height: 100% !important;

            color: #FFFFFF !important;

          }

          .calculator-page .calculator-saved-card-subtitle {

            font-size: 10px !important;

            line-height: 100% !important;

            color: #909090 !important;

            text-align: right !important;

          }

          .calculator-page .calculator-saved-card-actions {

            display: flex !important;

            flex-direction: row !important;

            align-items: center !important;

            justify-content: space-between !important;

            padding: 0 !important;

            gap: 16px !important;

            width: 100% !important;

          }

          .calculator-page .calculator-saved-card-actions-label {

            font-size: 14px !important;

            line-height: 100% !important;

            color: #FFFFFF !important;

            margin: 0 !important;

            text-align: left !important;

          }

          .calculator-page .calculator-saved-card-action-buttons {

            display: flex !important;

            flex-direction: row !important;

            align-items: center !important;

            gap: 4px !important;

          }

          .calculator-page .calculator-saved-card-action {

            width: 20px !important;

            height: 20px !important;

            border-radius: 12px !important;

            border: none !important;

            display: flex !important;

            align-items: center !important;

            justify-content: center !important;

            padding: 4px !important;

            position: relative !important;

          }

          .calculator-page .calculator-saved-card-action--edit {

            background: #FFFFFF !important;

          }

          .calculator-page .calculator-saved-card-action--delete {

            background: rgba(187, 4, 4, 0.12) !important;

            border: 1px solid #BB0404 !important;

          }

          .calculator-page .calculator-saved-card-divider {

            width: 100% !important;

            height: 0 !important;

            border: 1px solid #404040 !important;

          }

          .calculator-page .calculator-saved-card-grid {

            display: flex !important;

            flex-direction: column !important;

            gap: 12px !important;

            width: 100% !important;

            padding-bottom: 12px !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-saved-card-row {

            display: flex !important;

            flex-direction: row !important;

            justify-content: space-between !important;

            align-items: flex-start !important;

            flex-wrap: nowrap !important;

            padding: 0 !important;

            gap: 16px !important;

            width: 100% !important;

            min-height: 14px !important;

            box-sizing: border-box !important;

          }

          .calculator-page .calculator-saved-card-grid .calculator-saved-card-row:last-child {

            padding-bottom: 0 !important;

          }

          .calculator-page .calculator-saved-card-row:not(.calculator-saved-card-row--scenario) {

            align-items: center !important;

          }

          .calculator-page .calculator-saved-card-label {

            font-size: 14px !important;

            line-height: 100% !important;

            color: #FFFFFF !important;

            flex: 0 0 auto !important;

          }

          .calculator-page .calculator-saved-card-value {

            font-size: 14px !important;

            line-height: 100% !important;

            color: #909090 !important;

            text-align: right !important;

            flex: 1 1 auto !important;

            min-width: 0 !important;

            white-space: nowrap !important;

            overflow: hidden !important;

            text-overflow: ellipsis !important;

            padding-right: 2px !important;

          }

          .calculator-page .calculator-saved-card-row--scenario {

            align-items: flex-start !important;

            height: auto !important;

          }

          .calculator-page .calculator-saved-card-value--scenario {

            display: flex !important;

            flex-direction: column !important;

            align-items: flex-end !important;

            gap: 4px !important;

            white-space: normal !important;

            overflow: visible !important;

            text-overflow: initial !important;

          }

          .calculator-page .calculator-saved-card-value--scenario span:first-child {

            font-size: 14px !important;

            line-height: 100% !important;

            color: #909090 !important;

          }

          .calculator-page .calculator-saved-card-value--scenario span:last-child {

            font-size: 10px !important;

            line-height: 100% !important;

            color: #909090 !important;

          }

          .calculator-page .calculator-ready-tile {

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

            margin: 0 auto 120px !important;

          }

          .calculator-page .calculator-ready-ellipse-left {

            width: 588px !important;

            height: 588px !important;

            left: -492px !important;

            top: -508px !important;

            filter: blur(200px) !important;

            transform: rotate(90deg) !important;

          }

          .calculator-page .calculator-ready-ellipse-right {

            width: 588px !important;

            height: 588px !important;

            left: 330px !important;

            bottom: -370px !important;

            filter: blur(200px) !important;

            transform: rotate(90deg) !important;

          }

          .calculator-page .calculator-ready-content {

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

          .calculator-page .calculator-ready-header {

            display: flex !important;

            flex-direction: column !important;

            align-items: flex-start !important;

            gap: 24px !important;

            width: 311px !important;

            height: 130px !important;

          }

          .calculator-page .calculator-ready-header h2 {

            width: 311px !important;

            height: 64px !important;

            font-size: 32px !important;

            line-height: 100% !important;

            text-align: center !important;

          }

          .calculator-page .calculator-ready-header p {

            width: 311px !important;

            height: 42px !important;

            font-size: 16px !important;

            line-height: 130% !important;

            text-align: center !important;

          }

          .calculator-page .calculator-ready-buttons {

            display: flex !important;

            flex-direction: column !important;

            align-items: center !important;

            gap: 20px !important;

            width: 311px !important;

            height: 120px !important;

            margin-bottom: 12px !important;

          }

          .calculator-page .calculator-ready-buttons button {

            width: 311px !important;

            height: 50px !important;

            padding: 18px 12px !important;

            gap: 10px !important;

            border-radius: 100px !important;

          }

          .calculator-page .calculator-ready-buttons button:first-child {

            background: #FFFFFF !important;

            color: #0A0A0A !important;

          }

          .calculator-page .calculator-ready-buttons button:last-child {

            border: 1px solid #FFFFFF !important;

            color: #FFFFFF !important;

            background: transparent !important;

          }

          .calculator-page .calculator-faq-tile {

            width: 343px !important;

            padding: 24px !important;

          }

          .calculator-page .calculator-faq-header {

            display: flex !important;

            flex-direction: column !important;

            align-items: flex-start !important;

            padding: 0 !important;

            gap: 24px !important;

            width: 343px !important;

            height: 140px !important;

            margin: 48px auto 0 !important;

          }

          .calculator-page .calculator-faq-header h2 {

            width: 343px !important;

            height: 84px !important;

            font-size: 32px !important;

            line-height: 130% !important;

            text-align: center !important;

          }

          .calculator-page .calculator-faq-header p {

            width: 343px !important;

            height: 32px !important;

            font-size: 16px !important;

            line-height: 100% !important;

            text-align: center !important;

          }

          .calculator-page .calculator-faq-list {

            width: 343px !important;

            margin: 24px auto 0 !important;

            gap: 16px !important;

          }

          .calculator-page .calculator-faq-answer {

            margin-top: 8px !important;

            padding-top: 8px !important;

          }

          .calculator-page .calculator-saved-header,

          .calculator-page .calculator-saved-row {

            flex-direction: column !important;

            align-items: flex-start !important;

            width: 100% !important;

            max-width: 343px !important;

            gap: 16px !important;

          }

          .calculator-page .calculator-saved-header > div,

          .calculator-page .calculator-saved-row > div {

            width: 100% !important;

          }

        }

        @media (max-width: 768px) {

          .calculator-background-svg {

            left: -180px !important;

            top: -60px !important;

            width: 620px !important;

            height: 500px !important;

            transform: rotate(15deg) !important;

          }

        }

      `}} />

      <Navbar />

      

      {/* Background SVG Gradient */}

      <svg 

        className="absolute pointer-events-none calculator-background-svg"

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

        <div className="min-h-screen pt-32 pb-32 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-start calculator-hero-container calculator-layout">

          <div
            className="max-w-7xl mx-auto w-full relative calculator-section-wrapper"
          >

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

            

            <div className="calculator-hero-stack">

            {/* Title - Left Middle */}

            <h1

              className="calculator-hero-title"

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

              className="calculator-hero-description"

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

              className="calculator-hero-bullets"

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

                className="calculator-hero-bullet"

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

                className="calculator-hero-bullet"

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

                className="calculator-hero-bullet"

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

                className="calculator-hero-bullet"

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

              className="calculator-tiles-container calculator-hero-cta"

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

                className="calculator-hero-cta-primary"

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

                onClick={() => router.push('/signin')}

              >

                Sign In to Use

              </button>

              {/* Button 2 */}

              <button

                className="calculator-hero-cta-secondary"

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

                onClick={() => router.push('/signup')}

              >

                Watch Free Videos

              </button>

            </div>

            )}

            </div>

            

            {/* Frame 1000012125 - Heading Section */}

            <div

              className="calculator-section-heading-block"

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

                className="calculator-section-title"

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

                className="calculator-section-description"

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

                  : 'Demo mode - sign in to enter your numbers and save scenarios.'}

              </p>

            </div>

            

            {/* Calculator Tiles Container */}

            <div

              ref={calculatorInputsRef}
              className="calculator-section-grid"

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

                className={`relative overflow-hidden calculator-tile calculator-inputs-tile ${isCryptoAsset ? 'is-crypto' : ''}`}

                style={{

                  width: '846px',

                  minHeight: '326px',

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

                  className="relative z-10 w-full flex flex-col calculator-tile-content calculator-inputs-content" 

                  style={{ 

                    padding: '24px', 

                    flex: '1 1 auto',

                  }}

                >

                  {/* Title and Dropdown Row */}

                  <div

                    className="calculator-asset-row"

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

                      className="calculator-asset-label"

                      style={{

                        fontFamily: 'Gilroy-SemiBold',

                        fontStyle: 'normal',

                        fontWeight: 400,

                        fontSize: '16px',

                        lineHeight: '100%',

                        letterSpacing: '0%',

                        color: '#FFFFFF',

                        margin: 0,

                      }}

                    >

                      Asset Type

                    </h3>

                    

                    <div

                      className="calculator-asset-dropdown"

                      ref={dropdownRef}

                      style={{

                        position: 'relative',

                        flex: '0 0 auto',

                        order: 1,

                      }}

                    >

                      {/* Dropdown Button */}

                      <div

                        className="calculator-asset-dropdown-button"

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

                          justifyContent: 'center',

                          alignItems: 'center',

                          padding: '4px 12px',

                          gap: '8px',

                          height: '34px',

                          background: 'rgba(255, 255, 255, 0.1)',

                          border: '1px solid rgba(255, 255, 255, 0.3)',

                          borderRadius: '8px',

                          width: 'auto',

                          minWidth: '135px',

                          maxWidth: '320px',

                          whiteSpace: 'nowrap',

                        }}

                      >

                        {/* Selected Asset Text */}

                        {selectedAsset ? (

                          (() => {

                            const { main, bracket } = splitAssetLabel(selectedAsset);

                            return (

                              <span

                                style={{

                                  fontFamily: 'Gilroy-SemiBold',

                                  fontStyle: 'normal',

                                  fontWeight: 400,

                                  fontSize: '14px',

                                  lineHeight: '130%',

                                  color: '#FFFFFF',

                                  order: 0,

                                  display: 'inline-flex',

                                  alignItems: 'baseline',

                                  gap: '4px',

                                  whiteSpace: 'nowrap',

                                }}

                              >

                                <span>{main}</span>

                                {bracket && (

                                  <span

                                    style={{

                                      fontSize: isMobile ? '11px' : '12px',

                                      color: 'rgba(255, 255, 255, 0.7)',

                                      lineHeight: '120%',

                                    }}

                                  >

                                    {bracket}

                                  </span>

                                )}

                              </span>

                            );

                          })()

                        ) : (

                          <span

                            style={{

                              fontFamily: 'Gilroy-SemiBold',

                              fontStyle: 'normal',

                              fontWeight: 400,

                              fontSize: '14px',

                              lineHeight: '130%',

                              color: 'rgba(255, 255, 255, 0.5)',

                              order: 0,

                            }}

                          >

                            Choose Asset Type

                          </span>

                        )}

                        

                        {/* Frame 1000004698 - Arrow Icon */}

                        <div

                          style={{

                            width: '16px',

                            height: '16px',

                            display: 'flex',

                            alignItems: 'center',

                            justifyContent: 'center',

                            flex: 'none',

                            order: 1,

                            flexGrow: 0,

                            flexShrink: 0,

                          }}

                        >

                          {/* ep:arrow-up-bold */}

                          <svg

                            width="16"

                            height="16"

                            viewBox="0 0 20 20"

                            fill="none"

                            xmlns="http://www.w3.org/2000/svg"

                            style={{

                              transition: 'transform 0.3s ease',

                              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',

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

                                fontSize: '16px',

                                lineHeight: '130%',

                                color: '#FFFFFF',

                                backgroundColor: selectedAsset === option 

                                  ? 'rgba(255, 255, 255, 0.1)' 

                                  : 'transparent',

                                transition: 'background-color 0.2s ease',

                                display: 'flex',

                                alignItems: 'baseline',

                                gap: '4px',

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

                              {(() => {

                                const { main, bracket } = splitAssetLabel(option);

                                return (

                                  <>

                                    <span>{main}</span>

                                    {bracket && (

                                      <span

                                        style={{

                                          fontSize: isMobile ? '11px' : '12px',

                                          color: 'rgba(255, 255, 255, 0.7)',

                                        }}

                                      >

                                        {bracket}

                                      </span>

                                    )}

                                  </>

                                );

                              })()}

                            </div>

                          ))}

                        </div>

                      )}

                    </div>

                  </div>

                  

                  {/* Input Fields - Frame 101 (visible by default, disabled until asset selected) */}

                  {true && (

                    <div

                      className="calculator-inputs-group"

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

                        className="calculator-input-row"

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

                          className="calculator-input-field calculator-input-field-half"

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

                            className="calculator-input-label"

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

                            className="calculator-input-control"

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

                              className="calculator-input"

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

                          className="calculator-input-field calculator-input-field-half"

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

                            className="calculator-input-label"

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

                            className="calculator-input-control"

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

                              className="calculator-input"

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

                        className="calculator-input-row"

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

                          className="calculator-input-field calculator-input-field-half"

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

                            className="calculator-input-label"

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

                            className="calculator-input-control"

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

                              className="calculator-input"

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

                        

                        {/* Pip Value (Forex), Position Size (Crypto), or Lot Size (Gold) - Frame 1000004750 */}

                        {(selectedAsset === 'Crypto (BTC, ETH, etc.)' || selectedAsset === 'Gold (XAUUSD)' || selectedAsset === 'Currency (Forex Pairs)') && (

                        <div

                          className="calculator-input-field calculator-input-field-half"

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

                            className="calculator-input-label"

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

                            {selectedAsset === 'Crypto (BTC, ETH, etc.)' ? 'Position Size (USD)' : selectedAsset === 'Gold (XAUUSD)' ? 'Lot Size' : selectedAsset === 'Currency (Forex Pairs)' ? 'Pip Value ($)' : ''}

                          </label>

                          

                          {/* For Crypto: Position Size, For Gold: Lot Size, For Forex: Lot Type Dropdown */}

                          {!selectedAsset ? (

                          <div

                            className="calculator-input-control"

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

                                className="calculator-input"

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

                              className="calculator-input"

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

                              className="calculator-input"

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

                          ) : (

                            <div

                              ref={forexLotTypeRef}

                              className="calculator-forex-dropdown"

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

                                className="calculator-forex-dropdown-button"

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

                                  className="calculator-forex-dropdown-menu"

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

                        )}

                      </div>

                      

                      {/* Row 3 - Frame 1000004763 (Only for Forex, hidden for Crypto and Gold) */}

                      {selectedAsset === 'Currency (Forex Pairs)' && (

                      <div

                        className="calculator-input-row"

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

                          className="calculator-input-field"

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

                            className="calculator-input-label"

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

                          <div

                            className="calculator-input-control"

                            style={{ position: 'relative', width: '798px' }}

                          >

                            <input

                              className="calculator-input"

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

                      </div>

                      )}

                      

                      {/* Buttons Row - Frame 1000012140 */}

                      <div

                        className="calculator-input-actions"

                        style={{

                          display: 'flex',

                          flexDirection: 'row',

                          alignItems: 'center',

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

                        {/* Save Scenario Button - Frame 23 */}

                        <button

                          disabled={!isAuthenticated}

                          onClick={() => {

                            if (!isAuthenticated) return;

                            if (!editingScenarioId) {

                              setScenarioName('');

                              setTradingPair(null);

                            }

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

                            order: 2,

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

                className="relative overflow-hidden calculator-tile calculator-results-tile"

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

                      Sign in to access the full calculator

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

                  className="relative z-10 calculator-results-content"

                  style={{

                    display: 'flex',

                    flexDirection: 'column',

                    alignItems: 'flex-start',

                    padding: '24px',

                    gap: '32px',

                    width: '394px',

                    minHeight: '290px',

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

                    className="calculator-results-list"

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

                      className="calculator-save-preview-row"

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

                        className="calculator-save-preview-label"

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

                        className="calculator-save-preview-value"

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

                    

                    {/* Pip Value Row (Only for Forex) */}

                    {selectedAsset === 'Currency (Forex Pairs)' && (

                      <div

                        className="calculator-save-preview-row"

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

                          className="calculator-save-preview-label"

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

                          className="calculator-save-preview-value"

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

                          {`$${forexLotTypePipValues[forexLotType]}/pip`}

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

                <div className="calculator-saved-gap" style={{ marginTop: '250px' }}></div>

                

                {/* Saved Scenarios Title and Description */}

                <div

                  className="calculator-section-heading calculator-saved-heading"

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

                    className="calculator-section-title"

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

                    className="calculator-section-description"

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

                  className="relative calculator-wide-tile"

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

                  className="relative z-10 w-full flex flex-col calculator-tile-content calculator-saved-content" 

                    style={{ 

                      padding: '24px', 

                      gap: '24px',

                      minHeight: '100%',

                    }}

                  >

                    <div className="calculator-saved-mobile-section">

                      <div className="calculator-saved-mobile-title-row">

                        <div className="calculator-saved-mobile-title-block">

                          <h3>Saved Scenarios</h3>

                        </div>

                        <button

                          type="button"

                          className="calculator-saved-mobile-viewall"

                          onClick={() => setIsMobileScenariosModalOpen(true)}

                        >

                          <span>View All</span>

                          <span className="calculator-saved-mobile-viewall-icon">

                            <svg

                              width="10"

                              height="6"

                              viewBox="0 0 10 6"

                              fill="none"

                              xmlns="http://www.w3.org/2000/svg"

                            >

                              <path

                                d="M1 1L5 5L9 1"

                                stroke="#FFFFFF"

                                strokeWidth="1.5"

                                strokeLinecap="round"

                                strokeLinejoin="round"

                              />

                            </svg>

                          </span>

                        </button>

                      </div>

                      <p className="calculator-saved-mobile-description">

                        Manage or modify your previously saved position setups.

                      </p>

                    </div>

                    {/* Header Row - Frame 1000004673 */}

                    <div

                      className="calculator-saved-header"

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

                      className={`calculator-saved-list${savedScenarios.length === 0 ? ' is-empty' : ''}`}

                      style={{

                        display: 'flex',

                        flexDirection: 'column',

                        gap: '12px',

                        width: '100%',

                        overflowY: savedScenarios.length === 0 ? 'visible' : 'auto',

                        overflowX: 'hidden',

                        maxHeight: savedScenarios.length === 0 ? 'none' : '580px',

                        flex: savedScenarios.length === 0 ? 'none' : 1,

                        paddingRight: savedScenarios.length === 0 ? 0 : '4px',

                      }}

                    >

                      {savedScenarios.length === 0 ? (

                        <div

                          className="calculator-saved-empty"

                          style={{

                            display: 'flex',

                            justifyContent: 'center',

                            alignItems: 'center',

                            padding: '40px 24px',

                            color: 'rgba(255, 255, 255, 0.5)',

                            fontFamily: 'Gilroy-Medium',

                            fontSize: '14px',

                            textAlign: 'center',

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

                            {currentScenarios.map((scenario, scenarioIndex) => {

                          const {

                            scenarioNameDisplay,

                            entryText,

                            pairDisplay,

                            riskDisplay,

                            positionSizeDisplay,

                            positionValueDisplay,

                            stopLossDisplay,

                            dateDisplay,

                          } = buildScenarioDisplayData(scenario);



                          return (

                            <Fragment key={scenario.id}>

                            <div

                              className="calculator-saved-row"

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

                                  {scenarioNameDisplay}

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

                                  {entryText}

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

                                  {pairDisplay}

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

                                  {riskDisplay}

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

                                  {positionSizeDisplay}

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

                                  {positionValueDisplay}

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

                                  {dateDisplay}

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

                                  onClick={() => handleEditScenario(scenario)}

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

                              {(!isMobile || scenarioIndex < 5) && (

                                <div className="calculator-saved-card">

                                  <div className="calculator-saved-card-inner">

                                    <div className="calculator-saved-card-header">

                                      <div className="calculator-saved-card-actions">

                                        <span className="calculator-saved-card-actions-label">Actions</span>

                                        <div className="calculator-saved-card-action-buttons">

                                          <button

                                            type="button"

                                            className="calculator-saved-card-action calculator-saved-card-action--edit"

                                            onClick={() => handleEditScenario(scenario)}

                                          >

                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">

                                              <path d="M1.5 9.75H10.5V10.5H1.5V9.75Z" fill="#0A0A0A"/>

                                              <path d="M8.64375 4.03125C8.86875 3.80625 8.86875 3.44375 8.64375 3.21875L7.38125 1.95625C7.15625 1.73125 6.79375 1.73125 6.56875 1.95625L2.25 6.275V8.625H4.6L8.91875 4.30625L8.64375 4.03125ZM6.75 2.275L8.0125 3.5375L7.19375 4.35625L5.93125 3.09375L6.75 2.275ZM3 7.875V6.6125L5.56875 4.04375L6.83125 5.30625L4.2625 7.875H3Z" fill="#0A0A0A"/>

                                            </svg>

                                          </button>

                                          <button

                                            type="button"

                                            className="calculator-saved-card-action calculator-saved-card-action--delete"

                                            onClick={() => {

                                              setScenarioToDelete(scenario.id);

                                              setIsDeleteConfirmOpen(true);

                                            }}

                                          >

                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">

                                              <path d="M4.5 4.5H5.25V9H4.5V4.5Z" fill="#BB0404"/>

                                              <path d="M6.75 4.5H7.5V9H6.75V4.5Z" fill="#BB0404"/>

                                              <path d="M1.5 3.1875V3.9375H2.25V10.5C2.25 10.6989 2.32902 10.8897 2.46967 11.0303C2.61032 11.171 2.80109 11.25 3 11.25H9C9.19891 11.25 9.38968 11.171 9.53033 11.0303C9.67098 10.8897 9.75 10.6989 9.75 10.5V3.9375H10.5V3.1875H1.5ZM3 10.5V3.9375H9V10.5H3Z" fill="#BB0404"/>

                                            </svg>

                                          </button>

                                        </div>

                                      </div>

                                    </div>

                                    <div className="calculator-saved-card-divider"></div>

                                    <div className="calculator-saved-card-grid">

                                      <div className="calculator-saved-card-row calculator-saved-card-row--scenario">

                                        <span className="calculator-saved-card-label">Scenario Name</span>

                                        <span className="calculator-saved-card-value calculator-saved-card-value--scenario">

                                          <span>{scenarioNameDisplay}</span>

                                          <span>{entryText}</span>

                                        </span>

                                      </div>

                                      <div className="calculator-saved-card-row">

                                        <span className="calculator-saved-card-label">Pair</span>

                                        <span className="calculator-saved-card-value">{pairDisplay}</span>

                                      </div>

                                      <div className="calculator-saved-card-row">

                                        <span className="calculator-saved-card-label">Risk %</span>

                                        <span className="calculator-saved-card-value">{riskDisplay}</span>

                                      </div>

                                      <div className="calculator-saved-card-row">

                                        <span className="calculator-saved-card-label">Position Size</span>

                                        <span className="calculator-saved-card-value">{positionSizeDisplay}</span>

                                      </div>

                                      <div className="calculator-saved-card-row">

                                        <span className="calculator-saved-card-label">Position Value</span>

                                        <span className="calculator-saved-card-value">{positionValueDisplay}</span>

                                      </div>

                                      <div className="calculator-saved-card-row">

                                        <span className="calculator-saved-card-label">Stop Loss</span>

                                        <span className="calculator-saved-card-value">{stopLossDisplay}</span>

                                      </div>

                                      <div className="calculator-saved-card-row">

                                        <span className="calculator-saved-card-label">Date</span>

                                        <span className="calculator-saved-card-value calculator-saved-card-value--date">{dateDisplay}</span>

                                      </div>

                                    </div>

                                  </div>

                                </div>

                              )}

                            </Fragment>

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

            {isMobile && isMobileScenariosModalOpen && (

              <div

                className="calculator-saved-mobile-modal"

                onClick={() => setIsMobileScenariosModalOpen(false)}

              >

                <div

                  className="calculator-saved-mobile-modal-content"

                  onClick={(event) => event.stopPropagation()}

                >

              <button

                type="button"

                className="calculator-saved-mobile-modal-close"

                onClick={() => setIsMobileScenariosModalOpen(false)}

              >

                <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">

                  <path d="M1 1L7 7" stroke="#AFB9BF" strokeWidth="1.25" strokeLinecap="round"/>

                  <path d="M7 1L1 7" stroke="#AFB9BF" strokeWidth="1.25" strokeLinecap="round"/>

                </svg>

              </button>

                  <div className="calculator-saved-mobile-modal-list">

                    {savedScenarios.length === 0 ? (

                      <div className="calculator-saved-empty">

                        No saved scenarios yet. Save your first scenario to see it here.

                      </div>

                    ) : (

                      savedScenarios.map((scenario) => {

                        const {

                          scenarioNameDisplay,

                          entryText,

                          pairDisplay,

                          riskDisplay,

                          positionSizeDisplay,

                          positionValueDisplay,

                          stopLossDisplay,

                          dateDisplay,

                        } = buildScenarioDisplayData(scenario);



                        return (

                          <div key={`mobile-modal-${scenario.id}`} className="calculator-saved-card">

                            <div className="calculator-saved-card-inner">

                              <div className="calculator-saved-card-header">

                                <div className="calculator-saved-card-actions">

                                  <span className="calculator-saved-card-actions-label">Actions</span>

                                  <div className="calculator-saved-card-action-buttons">

                                    <button

                                      type="button"

                                      className="calculator-saved-card-action calculator-saved-card-action--edit"

                                      onClick={() => handleEditScenario(scenario)}

                                    >

                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">

                                        <path d="M1.5 9.75H10.5V10.5H1.5V9.75Z" fill="#0A0A0A"/>

                                        <path d="M8.64375 4.03125C8.86875 3.80625 8.86875 3.44375 8.64375 3.21875L7.38125 1.95625C7.15625 1.73125 6.79375 1.73125 6.56875 1.95625L2.25 6.275V8.625H4.6L8.91875 4.30625L8.64375 4.03125ZM6.75 2.275L8.0125 3.5375L7.19375 4.35625L5.93125 3.09375L6.75 2.275ZM3 7.875V6.6125L5.56875 4.04375L6.83125 5.30625L4.2625 7.875H3Z" fill="#0A0A0A"/>

                                      </svg>

                                    </button>

                                    <button

                                      type="button"

                                      className="calculator-saved-card-action calculator-saved-card-action--delete"

                                      onClick={() => {

                                        setScenarioToDelete(scenario.id);

                                        setIsDeleteConfirmOpen(true);

                                        setIsMobileScenariosModalOpen(false);

                                      }}

                                    >

                                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">

                                        <path d="M4.5 4.5H5.25V9H4.5V4.5Z" fill="#BB0404"/>

                                        <path d="M6.75 4.5H7.5V9H6.75V4.5Z" fill="#BB0404"/>

                                        <path d="M1.5 3.1875V3.9375H2.25V10.5C2.25 10.6989 2.32902 10.8897 2.46967 11.0303C2.61032 11.171 2.80109 11.25 3 11.25H9C9.19891 11.25 9.38968 11.171 9.53033 11.0303C9.67098 10.8897 9.75 10.6989 9.75 10.5V3.9375H10.5V3.1875H1.5ZM3 10.5V3.9375H9V10.5H3Z" fill="#BB0404"/>

                                      </svg>

                                    </button>

                                  </div>

                                </div>

                              </div>

                              <div className="calculator-saved-card-divider"></div>

                              <div className="calculator-saved-card-grid">

                                <div className="calculator-saved-card-row calculator-saved-card-row--scenario">

                                  <span className="calculator-saved-card-label">Scenario Name</span>

                                  <span className="calculator-saved-card-value calculator-saved-card-value--scenario">

                                    <span>{scenarioNameDisplay}</span>

                                    <span>{entryText}</span>

                                  </span>

                                </div>

                                <div className="calculator-saved-card-row">

                                  <span className="calculator-saved-card-label">Pair</span>

                                  <span className="calculator-saved-card-value">{pairDisplay}</span>

                                </div>

                                <div className="calculator-saved-card-row">

                                  <span className="calculator-saved-card-label">Risk %</span>

                                  <span className="calculator-saved-card-value">{riskDisplay}</span>

                                </div>

                                <div className="calculator-saved-card-row">

                                  <span className="calculator-saved-card-label">Position Size</span>

                                  <span className="calculator-saved-card-value">{positionSizeDisplay}</span>

                                </div>

                                <div className="calculator-saved-card-row">

                                  <span className="calculator-saved-card-label">Position Value</span>

                                  <span className="calculator-saved-card-value">{positionValueDisplay}</span>

                                </div>

                                <div className="calculator-saved-card-row">

                                  <span className="calculator-saved-card-label">Stop Loss</span>

                                  <span className="calculator-saved-card-value">{stopLossDisplay}</span>

                                </div>

                                <div className="calculator-saved-card-row">

                                  <span className="calculator-saved-card-label">Date</span>

                                  <span className="calculator-saved-card-value calculator-saved-card-value--date">{dateDisplay}</span>

                                </div>

                              </div>

                            </div>

                          </div>

                        );

                      })

                    )}

                  </div>

                </div>

              </div>

            )}

            

            {/* Big Gap - For non-authenticated users */}

            {!isAuthenticated && (

              <div style={{ marginTop: '220px' }}></div>

            )}

            

            {/* Ready to unlock full access Tile */}

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

                      We offer a 7-day money-back guarantee for all new subscribers.

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

                      Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.

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

                      Yes! We continuously improve our platform and add new features based on user feedback.

                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      

      {isAuthenticated && (

        <div

          className="calculator-newsletter-section"

          style={{

            width: '100%',

            maxWidth: '1064px',

            margin: '64px auto',

            padding: '0',

          }}

        >

          <NewsletterSubscription />

        </div>

      )}

      

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

              <div

                style={{

                  width: '100%',

                  display: 'flex',

                  flexDirection: 'row',

                  alignItems: 'center',

                  justifyContent: 'space-between',

                  gap: '12px',

                }}

              >

                <h3

                  style={{

                    fontFamily: 'Gilroy-SemiBold',

                    fontStyle: 'normal',

                    fontWeight: 400,

                    fontSize: '20px',

                    lineHeight: '100%',

                    color: '#FFFFFF',

                    margin: 0,

                  }}

                >

                  Formula

                </h3>



                <button

                  onClick={() => setIsFormulaPopupOpen(false)}

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

                  <svg

                    width="8"

                    height="8"

                    viewBox="0 0 8 8"

                    fill="none"

                    xmlns="http://www.w3.org/2000/svg"

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

                  Pip Value for Gold: 1 Standard Lot (100 oz) → 1 pip (0.01 move) = $10

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

          onClick={handleScenarioPopupClose}

        >

          <div

            ref={saveScenarioPopupRef}

            className="calculator-save-popup"

            onClick={(e) => e.stopPropagation()}

            style={{

              display: 'flex',

              flexDirection: 'column',

              alignItems: 'flex-start',

              padding: '24px',

              gap: '24px',

              width: '528px',

              minHeight: '436px',

              maxHeight: '90vh',

              overflowY: 'auto',

              background: '#1F1F1F',

              borderRadius: '16px',

              boxSizing: 'border-box',

            }}

          >

            {/* Header Section */}

            <div

              className="calculator-save-header"

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

                  className="calculator-save-heading"

                  style={{

                    fontFamily: 'Gilroy-SemiBold',

                    fontSize: '24px',

                    fontWeight: 400,

                    color: '#FFFFFF',

                    margin: 0,

                    whiteSpace: 'nowrap',

                  }}

                >

                  {editingScenarioId ? 'Update Scenario' : 'Save Scenario'}

                </h2>

                

                {/* Close Button */}

                <button

                  className="calculator-save-close"

                  onClick={handleScenarioPopupClose}

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

                className="calculator-save-content"

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

                className="calculator-save-field"

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

                className="calculator-save-field"

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

                  className="calculator-save-dropdown"

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

                    className="calculator-save-dropdown-button"

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

                      className={tradingPair ? 'has-value' : ''}

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



              {renderScenarioPreviewSection()}

              {/* Buttons Container - Frame 1000012140 */}

              <div

                className="calculator-save-actions"

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

                        credentials: 'include',

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

                        // Reset calculator inputs, form, and close popup
                        handleReset();
                        handleScenarioPopupClose();

                        // Refresh scenarios list

                        const fetchResponse = await fetch('/api/scenarios', {

                          credentials: 'include',

                        });

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

                  onClick={handleScenarioPopupClose}

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

                      credentials: 'include',

                    });

                    if (response.ok) {

                      // Close popup

                      setIsDeleteConfirmOpen(false);

                      setScenarioToDelete(null);

                      // Refresh scenarios list

                      const fetchResponse = await fetch('/api/scenarios', {

                        credentials: 'include',

                      });

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




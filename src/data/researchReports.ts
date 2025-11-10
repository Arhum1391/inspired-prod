export type ResearchReport = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  shariahCompliant: boolean;
  summaryPoints: string[];
  pdfUrl?: string;
  content: Array<{
    heading: string;
    body: string[];
  }>;
};

export const researchReports: ResearchReport[] = [
  {
    slug: 'market-outlook-q2-2025',
    title: 'Market Outlook Q2 2025',
    description: 'A comprehensive analysis of current market conditions and projections for Q2 2025.',
    date: 'April 15, 2025',
    readTime: '12 min read',
    category: 'Market Analysis',
    shariahCompliant: true,
    summaryPoints: [
      'Macro overview covering GDP, inflation, and employment trends across major regions.',
      'Equity and fixed-income positioning with focus on defensive reallocations.',
      'Scenario analysis for bull, base, and bear cases including risk triggers.',
    ],
    pdfUrl: '/downloads/market-outlook-q2-2025.pdf',
    content: [
      {
        heading: 'Executive Summary',
        body: [
          'Heading into Q2 2025, global growth remains resilient with the US labor market moderating but not contracting. Inflation continues to normalize, supporting a gradual easing outlook from major central banks.',
          'Investors should remain balanced: favor high-quality equities with earnings visibility and maintain exposure to investment-grade credit where spreads still compensate for macro risks.',
        ],
      },
      {
        heading: 'Regional Breakdown',
        body: [
          'North American markets are supported by fiscal tailwinds and reshoring initiatives. We expect EPS growth of 8-10% for the S&P 500 as AI productivity benefits begin to flow through.',
          'In Europe, valuations remain attractive but growth differentials persist. Allocate selectively to industrial automation and energy transition leaders.',
        ],
      },
      {
        heading: 'Portfolio Implications',
        body: [
          'Maintain a core allocation to quality growth and add exposure to cash-generative compounders in healthcare and technology.',
          'Within fixed income, extend duration opportunistically and consider sukuk with strong coverage ratios for Shariah-aligned portfolios.',
        ],
      },
    ],
  },
  {
    slug: 'emerging-tech-themes-2025',
    title: 'Emerging Tech Themes Watchlist',
    description: 'Innovation trends, key players, and valuations relative to long-term growth opportunities in 2025.',
    date: 'April 9, 2025',
    readTime: '9 min read',
    category: 'Sector Insights',
    shariahCompliant: true,
    summaryPoints: [
      'Edge AI, spatial computing, and biocomputing dominate new capital flows.',
      'Valuation spreads between incumbents and disruptors remain elevated, offering tactical entry points.',
      'Top picks include platform providers with ecosystem lock-in and recurring monetisation.',
    ],
    pdfUrl: '/downloads/emerging-tech-themes-2025.pdf',
    content: [
      {
        heading: 'Key Takeaways',
        body: [
          'Edge AI deployments accelerate as enterprises prioritise latency-sensitive workloads. Semiconductor design cycles are shortening, benefiting IP licensors and foundry specialists.',
          'Spatial computing shifts from pilot programs to revenue-generating applications in design, training, and healthcare.',
        ],
      },
      {
        heading: 'Opportunities & Risks',
        body: [
          'Focus on companies with diversified revenue streams and pricing power. Avoid single-product stories with elevated R&D burn and limited moats.',
          'Monitor regulatory developments around AI governance and data privacy, especially across the EU and GCC.',
        ],
      },
    ],
  },
  {
    slug: 'income-ideas-volatile-markets',
    title: 'Income Ideas For Volatile Markets',
    description: 'Structured approaches to generate dependable returns while managing risk through diversified allocations.',
    date: 'March 28, 2025',
    readTime: '11 min read',
    category: 'Portfolio Strategy',
    shariahCompliant: false,
    summaryPoints: [
      'Blend dividend aristocrats with covered-call overlays for downside protection.',
      'Incorporate short-duration sukuk and high-quality corporate credit to stabilise cash yields.',
      'Use tactical tilts into commodities and infrastructure for inflation resilience.',
    ],
    pdfUrl: '/downloads/income-ideas-volatile-markets.pdf',
    content: [
      {
        heading: 'Strategy Overview',
        body: [
          'Income portfolios should diversify across equities, fixed income, and alternatives, emphasising assets with contractual cash flows.',
          'Dividend growth strategies outperform high yielders in volatile environments, as payout sustainability becomes paramount.',
        ],
      },
      {
        heading: 'Implementation Notes',
        body: [
          'Layer covered calls on core equity holdings to monetise volatility spikes while maintaining upside participation.',
          'Consider real assets such as toll roads and renewable energy projects with inflation-linked contracts.',
        ],
      },
    ],
  },
  {
    slug: 'global-macro-rate-cycle',
    title: 'Global Macro Update: Rate Cycle',
    description: 'Central bank policy shifts, inflation expectations, and implications for cross-asset allocation.',
    date: 'March 22, 2025',
    readTime: '14 min read',
    category: 'Economic Research',
    shariahCompliant: false,
    summaryPoints: [
      'Fed and ECB signal a slower pace of tightening with focus on balance sheet runoff.',
      'Emerging markets navigate divergent cycles; LATAM leads with pre-emptive easing while Asia remains cautious.',
      'FX positioning favours USD neutrality with selective exposure to commodity-linked currencies.',
    ],
    pdfUrl: '/downloads/global-macro-rate-cycle.pdf',
    content: [
      {
        heading: 'Policy Landscape',
        body: [
          'The Fed maintains optionality, balancing disinflation progress with persistent wage growth. Markets price two cuts by year-end, aligning with our base case.',
          'The ECB leans dovish as growth risks materialise in core economies, prompting recalibration of forward guidance.',
        ],
      },
      {
        heading: 'Investment Themes',
        body: [
          'Duration adds value as breakevens compress. Favor quality credit over high yield given tighter spreads and rising default risks.',
          'Maintain exposure to gold and energy as geopolitical risks keep volatility elevated.',
        ],
      },
    ],
  },
  {
    slug: 'ai-leaders-earnings-dashboard',
    title: 'AI Leaders Earnings Dashboard',
    description: 'Key metrics, valuation snapshots, and forward guidance from the leading AI and cloud infrastructure players.',
    date: 'March 18, 2025',
    readTime: '10 min read',
    category: 'Equity Research',
    shariahCompliant: true,
    summaryPoints: [
      'Hyperscale providers maintain double-digit revenue growth with expanding margins.',
      'Semiconductor demand remains supply-constrained; backlog visibility extends into 2026.',
      'Software monetisation of AI copilots accelerates ARR growth across enterprise suites.',
    ],
    pdfUrl: '/downloads/ai-leaders-earnings-dashboard.pdf',
    content: [
      {
        heading: 'Quarterly Highlights',
        body: [
          'Cloud spending reaccelerates as optimisation phases conclude. GenAI workloads drive incremental compute demand.',
          'Capital expenditure guidance rises across the Big 3 hyperscalers, reaffirming secular investment trends.',
        ],
      },
      {
        heading: 'Valuation & Positioning',
        body: [
          'Valuations remain elevated but justified by earnings revisions. Focus on operators with unique datasets and platform scale.',
          'Smaller AI infrastructure plays present asymmetric upside but require strict risk management.',
        ],
      },
    ],
  },
  {
    slug: 'high-yield-opportunities-radar',
    title: 'High-Yield Opportunities Radar',
    description: 'Screened opportunities in high-yield credit with coverage notes, spreads, and covenant checklists.',
    date: 'March 12, 2025',
    readTime: '8 min read',
    category: 'Fixed Income',
    shariahCompliant: false,
    summaryPoints: [
      'Carry remains attractive but selectivity is key as downgrades pick up in cyclical sectors.',
      'Prefer short-dated issues with strong asset coverage and covenant protections.',
      'Watch for refinancing cliffs in 2026-2027; prioritize issuers with ample liquidity buffers.',
    ],
    pdfUrl: '/downloads/high-yield-opportunities-radar.pdf',
    content: [
      {
        heading: 'Market Overview',
        body: [
          'High-yield spreads stabilise around 420 bps as risk appetite improves. Primary issuance returns with manageable concessions.',
          'Energy and industrial credits lead performance, while consumer discretionary names face pressure from margin compression.',
        ],
      },
      {
        heading: 'Issuer Watchlist',
        body: [
          'Highlighting three issuers with improving leverage profiles and deleveraging catalysts scheduled for the next two quarters.',
          'Avoid issuers with unsustainable dividend policies and limited covenant protections.',
        ],
      },
    ],
  },
];


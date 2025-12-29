export interface Partner {
  slug: string;
  name: string;
  heading?: string;
  description?: string;
  link?: string; // Registration/affiliate link
  steps?: {
    number: number;
    title: string;
    description?: string;
    link?: string;
    points?: string[];
  }[];
  benefits?: {
    heading: string;
    points: string[];
    footer?: string; // Optional footer text
  };
  videoId: string; // YouTube video ID
}

export const partners: Partner[] = [
  {
    slug: 'binance',
    name: 'Binance',
    heading:"Join Our Discord for Free Via Binance",
    description: 'Join our exclusive Binance partner program and unlock premium trading benefits.',
    link: 'https://accounts.binance.info/register?ref=75431452',
    benefits: {
      heading: 'Why Join Through Inspired Analyst?',
      points: [
        ' 10% discount on Spot trading fees',
        ' Monthly giveaways for referral users',
        ' Dedicated customer support',
        ' Interactive quiz events with rewards',
        ' Trade on the world\'s most secure and trusted crypto platform — Binance',
      ],
      footer: ' Start your crypto journey today with Inspired Analyst × Binance.',
    },
    videoId: 'xGP9oQd3mxE', // Placeholder - replace with actual video ID
  },
  {
    slug: 'exness',
    name: 'Exness',
    heading:"Join Our Discord for Free Via Exness",
    link: 'https://one.exnesstrack.org/a/40mum98fwt',
    steps: [
      {
        number: 1,
        title: 'Register with Exness',
        description: 'Sign up using our official affiliate link (Affiliate Code: 40mum98fwt)',
      },
      {
        number: 2,
        title: 'Complete Account Verification',
        description: 'Finish your KYC to activate your trading account.',
      },
      {
        number: 3,
        title: 'Make Your First Deposit',
        description: 'Fund your account with a minimum deposit of **$1,000** to proceed.',
      },
      {
        number: 4,
        title: 'Get Access',
        description: 'Once done, get access from bot by providing your Exness Signup Email.',
      },
    ],
    videoId: 'nJYaqIcjccs', // Placeholder - replace with actual video ID
  },
  {
    slug: 'primexbt',
    name: 'PrimeXBT',
    heading:"Join Our Discord for Free Via PrimeXBT",

    steps: [
      {
        number: 1,
        title: 'Create Your PrimeXBT Account',
        description: 'Register using our official partner link (Referral Code: 46521)',
      link: 'https://go.primexbt.direct/visit/?bta=46521&brand=primexbt',

      },
      {
        number: 2,
        title: 'Complete KYC Verification',
        description: 'Verify your identity on the PrimeXBT platform to activate your account.',
      },
      {
        number: 3,
        title: 'Make Your First Deposit',
        description: 'Deposit a minimum of **$100 USD** to qualify.',
      },
      {
        number: 4,
        title: 'Discord Verification',
        description: 'Click the verification button and submit',
        points:[
           'Your PrimeXBT User ID / Account ID',
           'Your registration date',

        ]
      },
    ],
    videoId: 'kYlYU8jR9i4', // Placeholder - replace with actual video ID
  },
  {
    slug: 'klein-funding',
    name: 'Klein Funding',
    heading:"Join Our Discord for Free Via Klein",

    steps: [
      {
        number: 1,
        title: 'Create Your Klein Funding Account',
        description: 'Sign up using our official partner link',
    link: 'https://kleinfunding.com/ref/4961',
      },
      {
        number: 2,
        title: 'Purchase Any Account (With Discount)',
        description: 'Use one of the following discount codes at checkout:',
        points:[
          '25% OFF on Standard Accounts — Code: IA25',
          '15% OFF on Instant Accounts — Code: IA15',
        ]
      },
      {
        number: 3,
        title: 'Submit a Support Ticket',
        description: 'Create a support ticket and share your **Order ID** in the **support-ticket** channel.',
      },
      {
        number: 4,
        title: 'Get Access',
        description: 'Once verified, you\'ll receive **free access** to the **Klein Funded Tier**.',
      }
    ],
    videoId: 'LDtURmq4bRA', // Placeholder - replace with actual video ID
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find(partner => partner.slug === slug);
}


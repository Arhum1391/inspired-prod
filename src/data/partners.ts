export interface Partner {
  slug: string;
  name: string;
  heading: string;
  description: string;
  steps: {
    number: number;
    title: string;
    description: string;
  }[];
  videoId: string; // YouTube video ID
}

export const partners: Partner[] = [
  {
    slug: 'binance',
    name: 'Binance',
    heading: 'Join Our Discord for Free via Binance',
    description: 'Get exclusive access to our Discord community by completing a simple process through Binance. Follow the steps below to get started today.',
    steps: [
      {
        number: 1,
        title: 'Complete Binance requirement',
        description: 'Create your free Binance account and complete the registration process.',
      },
      {
        number: 2,
        title: 'Sign up on Binance',
        description: 'Verify your account and meet the simple criteria to qualify for Discord access.',
      },
      {
        number: 3,
        title: 'Receive access confirmation',
        description: 'Get your confirmation email with your unique Discord invitation link.',
      },
      {
        number: 4,
        title: 'Join the Discord',
        description: 'Click the link and join our exclusive community. Welcome aboard!',
      },
    ],
    videoId: 'yTXSsPP163w', // Placeholder - replace with actual video ID
  },
  {
    slug: 'exness',
    name: 'Exness',
    heading: 'Join Our Discord for Free via Exness',
    description: 'Get exclusive access to our Discord community by completing a simple process through Exness. Follow the steps below to get started today.',
    steps: [
      {
        number: 1,
        title: 'Create Exness Account',
        description: 'Sign up for a free Exness account if you don’t already have one.',
      },
      {
        number: 2,
        title: 'Complete Required Action',
        description: 'Follow the steps shown in the video (such as registering through a referral link or meeting the eligibility requirement set by Exness).',
      },
      {
        number: 3,
        title: 'Get Access Approval',
        description: 'Once the requirement is completed, your eligibility for free Discord access will be confirmed.',
      },
      {
        number: 4,
        title: 'Join the Discord Community',
        description: 'Use the provided invite link to join our private Discord server and access exclusive discussions, insights, and updates.',
      },
    ],
    videoId: 'yTXSsPP163w', // Placeholder - replace with actual video ID
  },
  {
    slug: 'primexbt',
    name: 'PrimeXBT',
    heading: 'Join Our Discord for Free via PrimeXBT',
    description: 'Get exclusive access to our Discord community by completing a simple process through PrimeXBT. Follow the steps below to get started today.',
    steps: [
      {
        number: 1,
        title: 'Create PrimeXBT Account',
        description: 'Sign up for a free PrimeXBT account if you don’t already have one.',
      },
      {
        number: 2,
        title: 'Complete the Required Step',
        description: 'Follow the instructions shown in the video (such as registering through a referral link or completing the required action set by PrimeXBT).',
      },
      {
        number: 3,
        title: 'Get Access Confirmation',
        description: 'After completing the requirement, you’ll receive confirmation for free Discord access.',
      },
      {
        number: 4,
        title: 'Join the Discord Community',
        description: 'Use the provided invite link to join our private Discord server and connect with other traders.',
      },
    ],
    videoId: 'yTXSsPP163w', // Placeholder - replace with actual video ID
  },
  {
    slug: 'klein-funding',
    name: 'Klein Funding',
    heading: 'Join Our Discord for Free via Klein Funding',
    description: 'Get exclusive access to our Discord community by completing a simple process through Klein Funding. Follow the steps below to get started today.',
    steps: [
      {
        number: 1,
        title: 'Create Klein Funding Account',
      
        description: 'Sign up for a free account on Klein Funding\'s platform and complete your profile setup.',
      },
        {
        number: 2,
        title: 'Verify Your Email',
        description: 'Check your inbox for the verification email and confirm your account to activate full access.',
      },
      {
        number: 3,
        title: 'Complete Onboarding',
        description: 'Go through the quick onboarding process to familiarize yourself with Klein Funding\'s platform.',
      },
      {
        number: 4,
        title: 'Join the Discord Community',
        description: 'Receive your exclusive Discord invite link and join our active trading community.'
      }
    ],
    videoId: 'yTXSsPP163w', // Placeholder - replace with actual video ID
  },
];

export function getPartnerBySlug(slug: string): Partner | undefined {
  return partners.find(partner => partner.slug === slug);
}


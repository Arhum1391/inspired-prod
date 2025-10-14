import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Bootcamp } from '@/types/admin';

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Sample bootcamp data based on the bootcamp page
    const sampleBootcamps: Bootcamp[] = [
      {
        id: 'crypto-trading',
        title: 'Crypto Trading Bootcamp',
        description: 'Gain the skills to analyze crypto markets with confidence, manage risks like a pro, and apply proven trading strategies.',
        price: '30 BNB',
        duration: '6 Weeks',
        format: 'Online',
        mentors: [
          'Adnan - Senior Marketing Analyst',
          'Assassin - Co-Founder, Inspired Analyst'
        ],
        registrationStartDate: new Date('2025-10-01'),
        registrationEndDate: new Date('2025-10-30'),
        tags: ['6 Weeks', 'Online'],
        gradientPosition: {
          left: '399px',
          top: '-326px',
          rotation: '90deg'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'ai-data-finance',
        title: 'AI & Data for Finance',
        description: 'Explore the power of AI-driven trading, master data analysis techniques, and learn how to build automated systems that uncover market opportunities and enhance decision-making.',
        price: '30 BNB',
        duration: '4 Weeks',
        format: 'Online',
        mentors: [
          'Hassan Tariq - Senior Crypto Analyst',
          'Hamza Ali - Risk Management Specialist',
          'Meower - Breakout Trading Specialist'
        ],
        registrationStartDate: new Date('2025-10-01'),
        registrationEndDate: new Date('2025-10-30'),
        tags: ['4 Weeks', 'Online'],
        gradientPosition: {
          left: '365.45px',
          top: '-359.87px',
          rotation: '-172.95deg'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'forex-mastery',
        title: 'Forex Mastery Mentorship',
        description: 'Learn the fundamentals of forex trading, develop the skills to read live charts with accuracy, and apply advanced strategies to navigate global currency markets with confidence.',
        price: '30 BNB',
        duration: '8 Weeks',
        format: 'Online',
        mentors: [
          'Adnan - Senior Marketing Analyst',
          'Hassan Khan - Gold Trading Expert & Co-Founder'
        ],
        registrationStartDate: new Date('2025-10-01'),
        registrationEndDate: new Date('2025-10-30'),
        tags: ['8 Weeks', 'Online'],
        gradientPosition: {
          left: '367px',
          top: '-359px',
          rotation: '-96.58deg'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'stock-market-investing',
        title: 'Stock Market Investing Bootcamp',
        description: 'Learn how to build and manage a strong investment portfolio, accurately value companies, and apply long-term wealth-building strategies that stand the test of time.',
        price: '30 BNB',
        duration: '6 Weeks',
        format: 'Online',
        mentors: [
          'Mohid - Advanced ICT Mentor',
          'Assassin - Co-Founder, Inspired Analyst'
        ],
        registrationStartDate: new Date('2025-10-01'),
        registrationEndDate: new Date('2025-10-30'),
        tags: ['6 Weeks', 'Online'],
        gradientPosition: {
          left: '399px',
          top: '-326px',
          rotation: '90deg'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'web3-blockchain',
        title: 'Web3 & Blockchain Mentorship',
        description: 'Take a deep dive into blockchain technology, understand the mechanics of smart contracts, and explore the world of decentralized finance (DeFi) to unlcok real-world applications of Web3.',
        price: '30 BNB',
        duration: '5 Weeks',
        format: 'Online',
        mentors: [
          'M. Usama - Multi-Asset Trader',
          'Meower - Breakout Trading Specialist'
        ],
        registrationStartDate: new Date('2025-10-01'),
        registrationEndDate: new Date('2025-10-30'),
        tags: ['5 Weeks', 'Online'],
        gradientPosition: {
          left: '365.45px',
          top: '-326px',
          rotation: '-172.95deg'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'career-growth-finance-tech',
        title: 'Career Growth in Finance & Tech',
        description: 'Receive personalized career guidance, professional resume reviews, and interview preparation directly from industry mentors to help you stand out and achieve your career goals in finance and technology.',
        price: '30 BNB',
        duration: '4 Weeks',
        format: 'Online',
        mentors: [
          'Hamza Ali - Risk Management Specialist',
          'Mohid - Advanced ICT Mentor'
        ],
        registrationStartDate: new Date('2025-10-01'),
        registrationEndDate: new Date('2025-10-30'),
        tags: ['4 Weeks', 'Online'],
        gradientPosition: {
          left: '367.25px',
          top: '-357.75px',
          rotation: '-96.58deg'
        },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // Clear existing bootcamps and insert sample data
    await db.collection('bootcamps').deleteMany({});
    
    // Convert Bootcamp objects to plain objects for MongoDB insertion
    const bootcampDocuments = sampleBootcamps.map(({ _id, ...bootcamp }) => bootcamp);
    await db.collection('bootcamps').insertMany(bootcampDocuments);

    return NextResponse.json({ 
      message: 'Bootcamps populated successfully',
      count: sampleBootcamps.length
    });
  } catch (error) {
    console.error('Failed to populate bootcamps:', error);
    return NextResponse.json({ error: 'Failed to populate bootcamps' }, { status: 500 });
  }
}

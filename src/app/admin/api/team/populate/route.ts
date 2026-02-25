import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { TeamMember } from '@/types/admin';

// Analyst data extracted from MeetingsPage.tsx
const analystsData = [
  {
    id: 0,
    name: 'Adnan',
    role: 'Content Creator',
    about: 'Content creator specializing in stocks, crypto, data science, & side hustles.',
    calendar: ''
  },
  {
    id: 1,
    name: 'Assassin',
    role: 'Co-Founder & Trading Expert',
    about: 'Better known as Assassin Co-Founder of Inspired Analyst Discord Server, Trading crypto since 2019. My expertise is in Fibonacci Retracements, Trend-based-Fibs, Quant Analysis, Institutional Orderflow, Volume Profiling, Orderblocks, Fair Value Gaps, Supply/Demand, ICT Concepts, and textbook charts/candlestick patterns.',
    calendar: ''
  },
  {
    id: 2,
    name: 'Hassan Tariq',
    role: 'Trading Analyst',
    about: 'I am Hassan Tariq and I have been trading crypto solely since 2020. I have been a part of Inspired Analyst team since April 2023. My expertise is in Fibonacci Retracements, Trend-based-Fibs, Fixed Range Volume Profile, Harmonics and Supply & Demand Concept.',
    calendar: ''
  },
  {
    id: 3,
    name: 'Hamza Ali',
    role: 'Risk Management Specialist',
    about: 'My name is Hamza Ali and I have 5 years of experience in trading I specialize in risk management and consistent profit-making. My core strategy is price action trading, which naturally covers SMC, ICT, and other advanced concepts in a simplified way I keep my charts clean and to the point no unnecessary complications, just clarity and precision.',
    calendar: ''
  },
  {
    id: 4,
    name: 'Hassan Khan',
    role: 'Gold Trading Expert',
    about: 'I\'m Hassankhan, Co-founder of Inspired Analyst Forex Server, I don\'t just trade gold — I eat, breathe, and live XAU. I am also leading the CIVIC CHALLENGE, one of the most recognized and respected trading challenges across local Discord communities. With over 4–5 years of dedicated experience in trading gold, I\'ve developed a deep understanding of market movements, risk management, and profitable trading strategies.',
    calendar: ''
  },
  {
    id: 5,
    name: 'Meower',
    role: 'Crypto Trader',
    about: 'I\'m Meower, a 17-year-old cryptocurrency trader with experience in the market since February 2021. I specialize in breakout trading, focusing on large percentage moves on centralized exchanges. My strategy is based on a high-risk-to-reward framework, with a consistent win rate of over 85%. In 2025, I completed a publicly tracked $1,000 to $2,000 trading challenge.',
    calendar: ''
  },
  {
    id: 6,
    name: 'Mohid',
    role: 'Professional Trader',
    about: 'Stop wasting time on outdated trading strategies that don\'t work anymore. As a professional trader with over 5 years of experience, I specialize in teaching advanced, fresh ICT concepts that are both simple to grasp and highly effective. My unique approach is built on two core trading models, the Fractal Model and the Forever Model, designed for maximum accuracy and clarity.',
    calendar: ''
  },
  {
    id: 7,
    name: 'M. Usama',
    role: 'Multi-Asset Trader',
    about: 'I\'m Muhammad Usama, and I\'ve been trading crypto since 2020, and I started trading forex in 2023. This experience has taught me how to navigate everything from bull runs to brutal bear markets. I trade on indicators to refine my entries and exits, and try to keep my trading simple by using the price action. What keeps me consistent is blending institutional concepts with simple, practical tools.',
    calendar: ''
  }
];

export async function POST() {
  try {
    const db = await getDatabase();
    
    // Clear existing team members
    await db.collection('team').deleteMany({});
    
    // Insert new team members
    const teamMembers: Omit<TeamMember, '_id'>[] = analystsData.map(analyst => ({
      id: analyst.id,
      name: analyst.name,
      role: analyst.role,
      about: analyst.about,
      calendar: analyst.calendar,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await db.collection('team').insertMany(teamMembers);
    
    return NextResponse.json({
      message: 'Team members populated successfully',
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds)
    });
  } catch (error) {
    console.error('Populate team members error:', error);
    return NextResponse.json(
      { error: 'Failed to populate team members' },
      { status: 500 }
    );
  }
}

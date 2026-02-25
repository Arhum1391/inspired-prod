import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// GET research page content for public access
export async function GET() {
  try {
    const db = await getDatabase();
    const content = await db.collection('researchPageContent').findOne({});

    if (!content) {
      // Return default content if none exists
      return NextResponse.json({
        heroTitleAuthenticated: 'Latest Research - Clear, Actionable & Data-Backed',
        heroDescriptionAuthenticated: 'Access full reports covering market trends, equity insights, and Shariah-compliant opportunities - updated regularly for serious investors.',
        heroTitleGuest: 'Unlock the full experience with Inspired Analyst Premium',
        heroDescriptionGuest: 'Full research library, Position Sizing Calculator (save scenarios), portfolio analytics, and Shariah project details. Cancel anytime.',
        heroBulletPoints: [
          'Deep-dive reports with downloadable PDFs',
          'Position sizing tailored to your risk',
          'Portfolio allocation & P/L tracking',
          'Shariah methodology & detailed screens'
        ],
        faqTitle: 'Frequently Asked Questions',
        faqDescription: 'Everything you need to know about your subscription.',
        faqItems: [
          {
            question: 'Can I cancel anytime?',
            answer: 'Yes - your access continues until your period ends.'
          },
          {
            question: 'Do you offer refunds?',
            answer: 'We offer a 7-day money-back guarantee for all new subscribers.'
          },
          {
            question: 'What\'s Included?',
            answer: 'Full research library, position sizing calculator, portfolio analytics, and Shariah project details & screens.'
          },
          {
            question: 'Will you add more features?',
            answer: 'Yes! We continuously improve our platform and add new features based on user feedback.'
          }
        ]
      });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to fetch research page content:', error);
    return NextResponse.json({ error: 'Failed to fetch research page content' }, { status: 500 });
  }
}


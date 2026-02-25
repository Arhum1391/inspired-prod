import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ResearchPageContent } from '@/types/admin';

// GET research page content
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

// PUT update research page content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as Partial<ResearchPageContent>;
    const db = await getDatabase();

    // Validate required fields
    const requiredFields = [
      'heroTitleAuthenticated',
      'heroDescriptionAuthenticated',
      'heroTitleGuest',
      'heroDescriptionGuest',
      'heroBulletPoints',
      'faqTitle',
      'faqDescription',
      'faqItems'
    ];

    const missingFields = requiredFields.filter(field => {
      if (field === 'heroBulletPoints' || field === 'faqItems') {
        return !body[field as keyof typeof body] || !Array.isArray(body[field as keyof typeof body]);
      }
      return !body[field as keyof typeof body];
    });

    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields 
      }, { status: 400 });
    }

    // Validate FAQ items structure
    if (!Array.isArray(body.faqItems) || body.faqItems.length === 0) {
      return NextResponse.json({ 
        error: 'FAQ items must be a non-empty array' 
      }, { status: 400 });
    }

    for (const faqItem of body.faqItems) {
      if (!faqItem.question || !faqItem.answer) {
        return NextResponse.json({ 
          error: 'Each FAQ item must have both question and answer' 
        }, { status: 400 });
      }
    }

    // Check if content exists
    const existingContent = await db.collection('researchPageContent').findOne({});

    const updateData = {
      heroTitleAuthenticated: body.heroTitleAuthenticated,
      heroDescriptionAuthenticated: body.heroDescriptionAuthenticated,
      heroTitleGuest: body.heroTitleGuest,
      heroDescriptionGuest: body.heroDescriptionGuest,
      heroBulletPoints: body.heroBulletPoints,
      faqTitle: body.faqTitle,
      faqDescription: body.faqDescription,
      faqItems: body.faqItems,
      updatedAt: new Date(),
      ...(existingContent ? {} : { createdAt: new Date() })
    };

    if (existingContent) {
      // Update existing content
      const result = await db.collection('researchPageContent').updateOne(
        { _id: existingContent._id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
    } else {
      // Create new content
      await db.collection('researchPageContent').insertOne(updateData);
    }

    return NextResponse.json({ message: 'Research page content updated successfully' });
  } catch (error) {
    console.error('Failed to update research page content:', error);
    return NextResponse.json({ 
      error: 'Failed to update research page content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


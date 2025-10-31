import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { Bootcamp, MentorDetail, CurriculumSection, InfoCards, TargetAudience } from '@/types/admin';

// Validation function for detailed content fields
function validateDetailedContentFields(body: any) {
  const errors: string[] = [];

  // Validate heroSubheading if provided
  if (body.heroSubheading !== undefined && typeof body.heroSubheading !== 'string') {
    errors.push('heroSubheading must be a string');
  }

  // Validate heroDescription if provided
  if (body.heroDescription && !Array.isArray(body.heroDescription)) {
    errors.push('heroDescription must be an array of strings');
  }

  // Validate mentorDetails if provided
  if (body.mentorDetails) {
    if (!Array.isArray(body.mentorDetails)) {
      errors.push('mentorDetails must be an array');
    } else {
      body.mentorDetails.forEach((mentor: any, index: number) => {
        if (!mentor.mentorId || typeof mentor.mentorId !== 'string') {
          errors.push(`mentorDetails[${index}].mentorId is required and must be a string`);
        }
        if (!mentor.name || typeof mentor.name !== 'string') {
          errors.push(`mentorDetails[${index}].name is required and must be a string`);
        }
        if (!mentor.role || typeof mentor.role !== 'string') {
          errors.push(`mentorDetails[${index}].role is required and must be a string`);
        }
        if (mentor.image !== undefined && typeof mentor.image !== 'string') {
          errors.push(`mentorDetails[${index}].image must be a string`);
        }
        if (!mentor.description || typeof mentor.description !== 'string') {
          errors.push(`mentorDetails[${index}].description is required and must be a string`);
        }
      });
    }
  }

  // Validate curriculumSections if provided
  if (body.curriculumSections) {
    if (!Array.isArray(body.curriculumSections)) {
      errors.push('curriculumSections must be an array');
    } else {
      body.curriculumSections.forEach((section: any, index: number) => {
        if (!section.weekRange || typeof section.weekRange !== 'string') {
          errors.push(`curriculumSections[${index}].weekRange is required and must be a string`);
        }
        if (!section.title || typeof section.title !== 'string') {
          errors.push(`curriculumSections[${index}].title is required and must be a string`);
        }
        if (!section.icon || typeof section.icon !== 'string') {
          errors.push(`curriculumSections[${index}].icon is required and must be a string`);
        }
        if (!Array.isArray(section.items)) {
          errors.push(`curriculumSections[${index}].items must be an array`);
        }
      });
    }
  }

  // Validate infoCards if provided
  if (body.infoCards) {
    const infoCardFields = ['duration', 'mode', 'interactive', 'certificate'];
    infoCardFields.forEach(field => {
      if (body.infoCards[field]) {
        if (!body.infoCards[field].value || typeof body.infoCards[field].value !== 'string') {
          errors.push(`infoCards.${field}.value is required and must be a string`);
        }
        if (!body.infoCards[field].label || typeof body.infoCards[field].label !== 'string') {
          errors.push(`infoCards.${field}.label is required and must be a string`);
        }
      }
    });
    if (body.infoCards.registrationText && typeof body.infoCards.registrationText !== 'string') {
      errors.push('infoCards.registrationText must be a string');
    }
  }

  // Validate targetAudience if provided
  if (body.targetAudience) {
    if (body.targetAudience.title !== undefined && typeof body.targetAudience.title !== 'string') {
      errors.push('targetAudience.title must be a string');
    }
    if (body.targetAudience.subtitle !== undefined && typeof body.targetAudience.subtitle !== 'string') {
      errors.push('targetAudience.subtitle must be a string');
    }
    if (body.targetAudience.items !== undefined && !Array.isArray(body.targetAudience.items)) {
      errors.push('targetAudience.items must be an array');
    } else if (Array.isArray(body.targetAudience.items)) {
      body.targetAudience.items.forEach((item: any, index: number) => {
        if (typeof item !== 'string') {
          errors.push(`targetAudience.items[${index}] must be a string`);
        }
      });
    }
  }

  return errors;
}

// GET all bootcamps
export async function GET() {
  try {
    const db = await getDatabase();
    const bootcamps = await db.collection('bootcamps').find({}).toArray();

    return NextResponse.json(bootcamps);
  } catch (error) {
    console.error('Failed to fetch bootcamps:', error);
    return NextResponse.json({ error: 'Failed to fetch bootcamps' }, { status: 500 });
  }
}

// POST create new bootcamp
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDatabase();

    // Validate required fields (ID is auto-generated, so removed from required)
    const requiredFields = ['title', 'description', 'price', 'priceAmount', 'duration', 'format'];
    const missingFields = requiredFields.filter(field => !body[field] && body[field] !== 0);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: 'Missing required fields', 
        missingFields 
      }, { status: 400 });
    }

    // Validate priceAmount is a number
    if (typeof body.priceAmount !== 'number' || body.priceAmount < 0) {
      return NextResponse.json({ 
        error: 'priceAmount must be a valid non-negative number' 
      }, { status: 400 });
    }

    // Validate detailed content fields
    const validationErrors = validateDetailedContentFields(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: validationErrors 
      }, { status: 400 });
    }

    // Auto-generate numeric ID
    // Find the highest numeric ID and increment
    const allBootcamps = await db.collection('bootcamps').find({}).toArray();
    let maxId = 0;
    
    for (const bootcamp of allBootcamps) {
      // Handle both string numeric IDs and actual numbers
      const idValue = typeof bootcamp.id === 'number' ? bootcamp.id : parseInt(bootcamp.id);
      if (!isNaN(idValue) && idValue > maxId) {
        maxId = idValue;
      }
    }
    
    const newId = maxId + 1;
    console.log(`Auto-generating bootcamp ID: ${newId}`);

    // Convert dates to Date objects if they're strings
    if (body.registrationStartDate && typeof body.registrationStartDate === 'string') {
      body.registrationStartDate = new Date(body.registrationStartDate);
    }
    if (body.registrationEndDate && typeof body.registrationEndDate === 'string') {
      body.registrationEndDate = new Date(body.registrationEndDate);
    }
    if (body.bootcampStartDate && typeof body.bootcampStartDate === 'string') {
      body.bootcampStartDate = new Date(body.bootcampStartDate);
    }

    const bootcampData: Bootcamp = {
      ...body,
      id: newId.toString(), // Store as string for consistency with URL routing
      mentors: body.mentors || [],
      tags: body.tags || [],
      gradientPosition: body.gradientPosition || {
        left: '399px',
        top: '-326px',
        rotation: '90deg'
      },
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bootcamps').insertOne(bootcampData);

    return NextResponse.json({
      message: 'Bootcamp created successfully',
      id: newId.toString(),
      insertedId: result.insertedId
    });
  } catch (error) {
    console.error('Failed to create bootcamp:', error);
    return NextResponse.json({ error: 'Failed to create bootcamp' }, { status: 500 });
  }
}

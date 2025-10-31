import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Bootcamp } from '@/types/admin';

// Validation function for detailed content fields (same as in route.ts)
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

// PUT update bootcamp
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    console.log('PUT request received for bootcamp ID:', params.id);
    console.log('Update data:', body);
    
    const db = await getDatabase();

    // Validate priceAmount if provided
    if (body.priceAmount !== undefined && (typeof body.priceAmount !== 'number' || body.priceAmount < 0)) {
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

    // Prevent ID changes - IDs are auto-generated and immutable
    // Get the current bootcamp to preserve its ID
    const currentBootcamp = await db.collection('bootcamps').findOne({ 
      _id: new ObjectId(params.id) 
    });
    
    if (!currentBootcamp) {
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    // Remove ID from update data - IDs cannot be changed
    const { id, ...updateFields } = body;
    
    const updateData = {
      ...updateFields,
      id: currentBootcamp.id, // Preserve original ID
      updatedAt: new Date(),
    };

    console.log('Final update data:', updateData);

    const result = await db.collection('bootcamps').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    console.log('MongoDB update result:', result);

    if (result.matchedCount === 0) {
      console.log('No bootcamp found with ID:', params.id);
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    if (result.modifiedCount === 0) {
      console.log('Bootcamp found but no changes made');
      return NextResponse.json({ message: 'Bootcamp found but no changes were made' });
    }

    console.log('Bootcamp updated successfully');
    return NextResponse.json({ message: 'Bootcamp updated successfully' });
  } catch (error) {
    console.error('Failed to update bootcamp:', error);
    return NextResponse.json({ 
      error: 'Failed to update bootcamp', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE bootcamp
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = await getDatabase();

    const result = await db.collection('bootcamps').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Bootcamp not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Bootcamp deleted successfully' });
  } catch (error) {
    console.error('Failed to delete bootcamp:', error);
    return NextResponse.json({ error: 'Failed to delete bootcamp' }, { status: 500 });
  }
}

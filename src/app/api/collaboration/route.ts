import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = 'inspired-analyst';
const COLLECTION_NAME = 'collaborations';

// Email configuration
const COLLAB_EMAIL = process.env.COLLAB_EMAIL;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_SECURE = process.env.SMTP_SECURE === 'true';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Create email transporter
const createTransporter = () => {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP configuration is missing');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
};

// Send email notification
const sendEmailNotification = async (formData: {
  brandName: string;
  email: string;
  website?: string;
  message: string;
}) => {
  if (!COLLAB_EMAIL) {
    console.error('COLLAB_EMAIL environment variable is not set');
    return false;
  }

  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: SMTP_USER,
      to: COLLAB_EMAIL,
      subject: `New Collaboration Request from ${formData.brandName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4B25FD; padding-bottom: 10px;">
            New Collaboration Request
          </h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #555; margin-top: 0;">Contact Details:</h3>
            <p><strong>Brand Name:</strong> ${formData.brandName}</p>
            <p><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
            ${formData.website ? `<p><strong>Website:</strong> <a href="${formData.website}" target="_blank">${formData.website}</a></p>` : ''}
          </div>
          
          <div style="background: #fff; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
            <h3 style="color: #555; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; color: #666;">${formData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f4f8; border-radius: 8px; border-left: 4px solid #4B25FD;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              This message was sent from the "Work with Inspired Analyst" form on your website.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    const { brandName, email, website, message } = await request.json();

    // Validate required fields
    if (!brandName || !email || !message) {
      return NextResponse.json(
        { error: 'Brand name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Create new collaboration document
    const newCollaboration = {
      id: new Date().getTime().toString() + Math.random().toString(36).substr(2, 9),
      brandName,
      email: email.toLowerCase(),
      website: website || null,
      message,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert into database
    const result = await collection.insertOne(newCollaboration);

    await client.close();

    if (result.insertedId) {
      // Send email notification (fire and forget - don't fail the request if email fails)
      sendEmailNotification({ brandName, email, website, message })
        .then((emailSent) => {
          if (emailSent) {
            console.log('✅ Email notification sent successfully for collaboration:', newCollaboration.id);
          } else {
            console.error('❌ Failed to send email notification for collaboration:', newCollaboration.id);
          }
        })
        .catch((error) => {
          console.error('❌ Error sending email notification:', error);
        });

      return NextResponse.json(
        {
          success: true,
          message: 'Collaboration request submitted successfully!',
          collaborationId: newCollaboration.id
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to submit collaboration request' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Collaboration submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Get all collaboration requests
    const collaborations = await collection.find({}).sort({ createdAt: -1 }).toArray();

    await client.close();

    return NextResponse.json({
      success: true,
      collaborations: collaborations,
      count: collaborations.length
    });

  } catch (error) {
    console.error('Get collaborations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
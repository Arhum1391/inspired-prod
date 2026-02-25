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
      subject: `🚀 New Collaboration Request from ${formData.brandName}`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Collaboration Request</title>
          <link href="https://db.onlinewebfonts.com/c/1dc8ecd8056a5ea7aa7de1db42b5b639?family=Gilroy-Regular" rel="stylesheet">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Gilroy', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              background: #0A0A0A;
              color: #ffffff;
              line-height: 1.6;
            }
            
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #0A0A0A;
              padding: 40px 20px;
            }
            
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            
            .logo {
              font-size: 28px;
              font-weight: 700;
              color: #ffffff;
              margin-bottom: 8px;
            }
            
            .tagline {
              font-size: 14px;
              color: rgba(255, 255, 255, 0.7);
              font-weight: 400;
            }
            
            .main-card {
              background: linear-gradient(135deg, rgba(75, 37, 253, 0.1) 0%, rgba(222, 80, 236, 0.1) 100%);
              border: 1px solid rgba(75, 37, 253, 0.2);
              border-radius: 16px;
              padding: 32px;
              margin-bottom: 24px;
              position: relative;
              overflow: hidden;
            }
            
            .card-content {
              position: relative;
              z-index: 1;
            }
            
            .card-title {
              font-size: 24px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 24px;
              text-align: center;
            }
            
            .info-section {
              background: linear-gradient(135deg, rgba(75, 37, 253, 0.08) 0%, rgba(222, 80, 236, 0.08) 100%);
              border: 1px solid rgba(75, 37, 253, 0.15);
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 24px;
            }
            
            .info-title {
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 16px;
            }
            
            .info-item {
              margin-bottom: 12px;
              display: flex;
              align-items: flex-start;
              gap: 12px;
            }
            
            .info-label {
              font-weight: 600;
              color: rgba(255, 255, 255, 0.8);
              min-width: 90px;
              flex-shrink: 0;
              padding-top: 2px;
            }
            
            .info-value {
              color: #ffffff;
              flex: 1;
              word-break: break-all;
              overflow-wrap: break-word;
              hyphens: auto;
              padding-top: 2px;
            }
            
            .info-value a {
              color: #4B25FD;
              text-decoration: none;
              font-weight: 500;
              word-break: break-all;
              overflow-wrap: break-word;
            }
            
            .info-value a:hover {
              color: #6B46C1;
            }
            
            .message-section {
              background: linear-gradient(135deg, rgba(75, 37, 253, 0.08) 0%, rgba(222, 80, 236, 0.08) 100%);
              border: 1px solid rgba(75, 37, 253, 0.15);
              border-radius: 12px;
              padding: 24px;
              margin-bottom: 24px;
            }
            
            .message-title {
              font-size: 16px;
              font-weight: 600;
              color: #ffffff;
              margin-bottom: 16px;
            }
            
            .message-content {
              color: rgba(255, 255, 255, 0.9);
              line-height: 1.7;
              white-space: pre-wrap;
            }
            
            .footer {
              text-align: center;
              padding: 24px;
              background: linear-gradient(135deg, rgba(75, 37, 253, 0.1) 0%, rgba(222, 80, 236, 0.1) 100%);
              border-radius: 12px;
              border: 1px solid rgba(75, 37, 253, 0.2);
            }
            
            .footer-text {
              color: rgba(255, 255, 255, 0.7);
              font-size: 14px;
              margin-bottom: 8px;
            }
            
            .footer-subtext {
              color: rgba(255, 255, 255, 0.5);
              font-size: 12px;
            }
            
            .gradient-accent {
              background: linear-gradient(107.68deg, #3813F3 9.35%, #05B0B3 34.7%, #4B25FD 60.06%, #B9B9E9 72.73%, #DE50EC 88.58%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 600;
            }
            
            @media (max-width: 600px) {
              .email-container {
                padding: 16px 12px;
              }
              
              .main-card {
                padding: 20px 16px;
              }
              
              .card-title {
                font-size: 18px;
                margin-bottom: 20px;
              }
              
              .info-section {
                padding: 16px 12px;
                margin-bottom: 16px;
              }
              
              .message-section {
                padding: 16px 12px;
                margin-bottom: 16px;
              }
              
              .info-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
                margin-bottom: 8px;
              }
              
              .info-label {
                margin-bottom: 0;
                margin-right: 0;
                min-width: auto;
                font-size: 12px;
                font-weight: 600;
                padding-top: 0;
              }
              
              .info-value {
                font-size: 12px;
                line-height: 1.4;
                word-break: break-all;
                overflow-wrap: break-word;
                padding-top: 0;
              }
              
              .info-value a {
                font-size: 12px;
                word-break: break-all;
                overflow-wrap: break-word;
              }
              
              .message-content {
                font-size: 12px;
                line-height: 1.5;
              }
              
              .message-title {
                font-size: 14px;
                margin-bottom: 12px;
              }
              
              .info-title {
                font-size: 14px;
                margin-bottom: 12px;
              }
              
              .footer {
                padding: 16px 12px;
              }
              
              .footer-text {
                font-size: 12px;
              }
              
              .footer-subtext {
                font-size: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header -->
            <div class="header">
              <div class="logo">Inspired Analyst</div>
              <div class="tagline">Making Finance & Tech Accessible</div>
            </div>
            
            <!-- Main Card -->
            <div class="main-card">
              <div class="gradient-border"></div>
              <div class="card-content">
                <h1 class="card-title">New Collaboration Request</h1>
                
                <!-- Contact Information -->
                <div class="info-section">
                  <h3 class="info-title">Contact Details</h3>
                  <div class="info-item">
                    <span class="info-label">Brand:</span>
                    <span class="info-value">${formData.brandName}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${formData.email}">${formData.email}</a></span>
                  </div>
                  ${formData.website ? `
                  <div class="info-item">
                    <span class="info-label">Website:</span>
                    <span class="info-value"><a href="${formData.website}" target="_blank">${formData.website}</a></span>
                  </div>
                  ` : ''}
          </div>
          
                <!-- Message -->
                <div class="message-section">
                  <h3 class="message-title">Message</h3>
                  <div class="message-content">${formData.message.replace(/\n/g, '<br>')}</div>
                </div>
              </div>
          </div>
          
            <!-- Footer -->
            <div class="footer">
              <div class="footer-text">This message was sent from the <span class="gradient-accent">"Work with Inspired Analyst"</span> form</div>
              <div class="footer-subtext">Submitted on ${new Date().toLocaleString()}</div>
            </div>
          </div>
        </body>
        </html>
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
    // Check environment variables first
    if (!MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

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
    
    // Log specific error details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a MongoDB connection error
    if (error && typeof error === 'object' && 'name' in error) {
      console.error('Error name:', (error as any).name);
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : 'Contact support'
      },
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
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Get SMTP configuration from environment variables
function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const secure = process.env.SMTP_SECURE === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration is missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.');
  }

  return {
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  };
}

// Create transporter
function createTransporter() {
  const config = getSmtpConfig();
  return nodemailer.createTransport(config);
}

// Send email
export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<void> {
  try {
    console.log('📧 [EMAIL] Starting email send process...', {
      to,
      subject,
      hasHtml: !!html,
      hasText: !!text
    });

    // Check SMTP configuration
    const smtpConfig = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER ? '***configured***' : 'MISSING',
      pass: process.env.SMTP_PASS ? '***configured***' : 'MISSING'
    };
    console.log('📧 [EMAIL] SMTP Configuration:', smtpConfig);

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is incomplete. Missing required environment variables.');
    }

    const transporter = createTransporter();
    const from = process.env.SMTP_USER || 'noreply@inspiredanalyst.com';

    console.log('📧 [EMAIL] Sending email via SMTP...', {
      from,
      to,
      subject
    });

    const result = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML tags for text version
    });

    console.log('✅ [EMAIL] Email sent successfully!', {
      messageId: result.messageId,
      to,
      subject,
      accepted: result.accepted,
      rejected: result.rejected
    });
  } catch (error: any) {
    console.error('❌ [EMAIL] Error sending email:', {
      error: error.message,
      stack: error.stack,
      to,
      subject,
      smtpError: error.code || error.response || error.responseCode
    });
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

// Generic email template function
function generateEmailTemplate(mainContent: string, pageTitle: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0A;font-family:Arial,Helvetica,sans-serif;color:#FFFFFF;">

  <!-- Outer Wrapper Table -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0A0A;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!-- Main Container Table -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;">
          <!-- Logo Section -->
          <tr>
            <td align="left" style="padding-bottom:40px;padding-top:40px;">
              <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/logo.png" 
                   alt="Inspired Analyst Logo" 
                   style="display:block;max-width:100%;height:auto;border:0;" 
                   width="auto" 
                   height="auto" />
            </td>
          </tr>
          
          <!-- Main Card Container -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#121212;border-radius:12px;overflow:hidden;">
                <!-- Gradient Header -->
                <tr>
                  <td style="height:160px;background:linear-gradient(90deg,#1E5AA8,#5A5AD6,#7A4C82);background-color:#1E5AA8;">
                    &nbsp;
                  </td>
                </tr>
                
                <!-- Content Section -->
                <tr>
                  <td style="text-align:left;padding:32px;background-color:#191919;">
                    ${mainContent}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer Section -->
          <tr>
            <td style="padding-top:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;">
                <!-- Logo and Social Media Icons Row -->
                <tr>
                  <td style="padding-bottom:24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <!-- Logo -->
                        <td align="left" valign="middle" style="padding-right:16px;">
                          <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/logo.png" 
                               alt="Logo" 
                               style="display:block;vertical-align:middle;border:0;" 
                               width="auto" 
                               height="auto" />
                        </td>
                        
                        <!-- Social Media Icons -->
                        <td align="right" valign="middle" style="padding-left:16px;">
                          <table cellpadding="0" cellspacing="0" border="0" align="right">
                            <tr>
                              <td style="padding:0 4px;">
                                <a href="https://x.com/inspirdanalyst" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/TwitterIcon.png" alt="Twitter" style="display:block;border:0;" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding:0 4px;">
                                <a href="https://www.tiktok.com/@inspiredanalyst" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/TicktockIcon.png" alt="TikTok" style="display:block;border:0;" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding:0 4px;">
                                <a href="https://www.facebook.com/inspiredanalyst/" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/FacebookIcon.png" alt="Facebook" style="display:block;border:0;" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding:0 4px;">
                                <a href="https://instagram.com/inspiredanalyst/" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/InstaIcon.png" alt="Instagram" style="display:block;border:0;" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding:0 4px;">
                                <a href="https://www.youtube.com/@inspiredanalyst" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/YoutubeIcon.png" alt="YouTube" style="display:block;border:0;" width="24" height="24" />
                                </a>
                              </td>
                              <td style="padding:0 4px;">
                                <a href="https://www.linkedin.com/in/inspiredanalyst" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;">
                                  <img src="https://exnrmjojhrivshxdknae.supabase.co/storage/v1/object/public/Inspired%20Analyst/LinkedinIcon.png" alt="LinkedIn" style="display:block;border:0;" width="24" height="24" />
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Privacy Policy Links -->
                <tr>
                  <td align="center" style="padding-bottom:12px;">
                    <table cellpadding="0" cellspacing="0" border="0" align="center">
                      <tr>
                        <td style="padding:0 8px;">
                          <a href="https://inspiredanalyst.com/privacy" style="color:#667EEA;text-decoration:none;font-size:14px;font-family:Arial,Helvetica,sans-serif;">Privacy Policy</a>
                        </td>
                        <td style="padding:0 8px;">
                          <a href="https://inspiredanalyst.com/terms" style="color:#667EEA;text-decoration:none;font-size:14px;font-family:Arial,Helvetica,sans-serif;">Terms & Conditions</a>
                        </td>
                        <td style="padding:0 8px;">
                          <a href="https://inspiredanalyst.com/#collaboration" style="color:#667EEA;text-decoration:none;font-size:14px;font-family:Arial,Helvetica,sans-serif;">Contact</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Copyright -->
                <tr>
                  <td align="center" style="padding-bottom:8px;">
                    <p style="margin:0;color:#909090;font-size:14px;font-family:Arial,Helvetica,sans-serif;">
                      © 2025 Inspired Analyst. All Rights Reserved
                    </p>
                  </td>
                </tr>
                
                <!-- Unsubscribe -->
                <tr>
                  <td align="center">
                    <p style="margin:0;color:#909090;font-size:14px;font-family:Arial,Helvetica,sans-serif;">
                      You're receiving this email because you signed up for Inspired Analyst.
                      <a href="#" style="color:#667EEA;text-decoration:underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

// Email verification email
export async function sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

  const mainContent = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Heading -->
      <tr>
        <td align="center" style="padding-bottom:12px;">
          <h1 style="margin:0;font-size:22px;font-weight:600;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            Welcome to Inspired Analyst
          </h1>
        </td>
      </tr>
      
      <!-- Description Text -->
      <tr>
        <td style="padding-bottom:24px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            Thank you for signing up! Please verify your email address to complete your registration.<br>
            Click the button below to verify your email:
          </p>
        </td>
      </tr>
      
      <!-- Verify Button -->
      <tr>
        <td align="left" style="padding-bottom:30px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background-color:#FFFFFF;border-radius:24px;">
                <a href="${verificationUrl}" 
                   style="display:inline-block;padding:12px 22px;border-radius:24px;background-color:#FFFFFF;color:#000000;text-decoration:none;font-size:14px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">
                  Verify Email Address
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Link Text -->
      <tr>
        <td style="padding-bottom:8px;">
          <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            Or copy and paste this link into your browser:
          </p>
        </td>
      </tr>
      
      <!-- Verification URL -->
      <tr>
        <td style="padding-bottom:30px;">
          <p style="margin:0;font-size:12px;color:#FFFFFF;word-break:break-all;font-family:Arial,Helvetica,sans-serif;">
            ${verificationUrl}
          </p>
        </td>
      </tr>
      
      <!-- Expiry Notice -->
      <tr>
        <td style="padding-bottom:20px;">
          <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            This link will expire in 24 hours.
          </p>
        </td>
      </tr>
      
      <!-- Ignore Notice -->
      <tr>
        <td>
          <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = generateEmailTemplate(mainContent, 'Inspired Analyst');

  await sendEmail({
    to: email,
    subject: 'Verify Your Email Address - Inspired Analyst',
    html,
  });
}

// Password reset email
export async function sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const mainContent = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <!-- Heading -->
      <tr>
        <td align="center" style="padding-bottom:12px;">
          <h1 style="margin:0;font-size:22px;font-weight:600;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            Reset Your Password
          </h1>
        </td>
      </tr>
      
      <!-- Description Text -->
      <tr>
        <td style="padding-bottom:24px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
           We received a request to reset your password for your Inspired Analyst account
          </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
          Click the button below to reset your password:
          </p>
        </td>
      </tr>
      
      <!-- Reset Button -->
      <tr>
        <td align="left" style="padding-bottom:30px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="center" style="background-color:#FFFFFF;border-radius:24px;">
                <a href="${resetUrl}" 
                   style="display:inline-block;padding:12px 22px;border-radius:24px;background-color:#FFFFFF;color:#000000;text-decoration:none;font-size:14px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">
                 Reset Password
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      
      <!-- Link Text -->
      <tr>
        <td style="padding-bottom:8px;">
          <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            Or copy and paste this link into your browser:
          </p>
        </td>
      </tr>
      
      <!-- Reset URL -->
      <tr>
        <td style="padding-bottom:30px;">
          <p style="margin:0;font-size:12px;color:#FFFFFF;word-break:break-all;font-family:Arial,Helvetica,sans-serif;">
            ${resetUrl}
          </p>
        </td>
      </tr>
      
      <!-- Expiry Notice -->
      <tr>
        <td style="padding-bottom:20px;">
          <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            This link will expire in 1 hour.
          </p>
        </td>
      </tr>
      
      <!-- Ignore Notice -->
      <tr>
        <td>
          <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
  `;

  const html = generateEmailTemplate(mainContent, 'Reset Your Password');

  await sendEmail({
    to: email,
    subject: 'Reset Your Password - Inspired Analyst',
    html,
  });
}

// Bootcamp enrollment email - requires signup
export async function sendBootcampSignupRequiredEmail(
  email: string, 
  customerName: string, 
  bootcampTitle: string, 
  bootcampId: string
): Promise<void> {
  console.log('📧 [BOOTCAMP EMAIL] Preparing bootcamp signup required email...', {
    email,
    customerName,
    bootcampTitle,
    bootcampId
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  const signupUrl = `${baseUrl}/signin`;
  
  console.log('📧 [BOOTCAMP EMAIL] Email configuration:', {
    baseUrl,
    signupUrl
  });

  const mainContent = `
 <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <!-- Heading -->
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <h1 style="margin:0;font-size:22px;font-weight:600;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         Welcome to ${bootcampTitle}!
        </h1>
      </td>
    </tr>
    
    <!-- Description Text -->
    <tr>
      <td style="padding-bottom:24px;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         Hi ${customerName || 'there'},
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         Great news! Your payment for <strong>${bootcampTitle}</strong> has been successfully processed.
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
        To access your bootcamp videos and materials, you'll need to create an account on our platform using the same email address you used for payment: <strong>${email}</strong></p>
        </p>
         
        
      </td>
    </tr>
    
    <!-- Verify Button -->
    <tr>
      <td align="left" style="padding-bottom:30px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="background-color:#FFFFFF;border-radius:24px;">
              <a href="${signupUrl}" 
                 style="display:inline-block;padding:12px 22px;border-radius:24px;background-color:#FFFFFF;color:#000000;text-decoration:none;font-size:14px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">
                Sign Up to Access Bootcamp
              </a>
              
              
              
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Link Text -->
    <tr>
      <td style="padding-bottom:8px;">
        <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         Once you sign up and verify your email, you'll have full access to all bootcamp content, including:
           <ul style="font-size: 14px; color: #fff; margin-top: 15px; padding-left: 20px;">
            <li>All video lessons</li>
            <li>Course materials and resources</li>
            <li>Progress tracking</li>
            <li>Community access</li>
          </ul>
        </p>
      </td>
    </tr>
    
    <!-- Verification URL -->
    
    
    <!-- Expiry Notice -->
    <tr>
      <td style="padding-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         If you have any questions, feel free to reach out to our support team
        </p>
         <p style="font-size: 14px; color: #fff; margin-top: 20px;">Happy learning!<br> <br>The Inspired Analyst Team</p>
      </td>
    </tr>
    
    
  </table>
`;

  console.log('📧 [BOOTCAMP EMAIL] Calling sendEmail function...');
  const html = generateEmailTemplate(mainContent, 'Inspired Analyst');
  
  try {
    await sendEmail({
      to: email,
      subject: `Complete Your Enrollment - ${bootcampTitle}`,
      html,
    });
    console.log('✅ [BOOTCAMP EMAIL] Bootcamp signup required email sent successfully!', {
      email,
      bootcampTitle
    });
  } catch (error: any) {
    console.error('❌ [BOOTCAMP EMAIL] Failed to send bootcamp signup required email:', {
      error: error.message,
      email,
      bootcampTitle,
      bootcampId
    });
    throw error;
  }
}

// Bootcamp enrollment email - for existing users
export async function sendBootcampEnrollmentEmail(
  email: string,
  customerName: string,
  bootcampTitle: string,
  bootcampId: string,
  bootcampDescription?: string
): Promise<void> {
  console.log('📧 [BOOTCAMP ENROLLMENT EMAIL] Preparing bootcamp enrollment email...', {
    email,
    customerName,
    bootcampTitle,
    bootcampId
  });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  const bootcampUrl = `${baseUrl}/bootcamp/${bootcampId}/progress`;

  console.log('📧 [BOOTCAMP ENROLLMENT EMAIL] Email configuration:', {
    baseUrl,
    bootcampUrl
  });

  const mainContent = `
 <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <!-- Heading -->
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <h1 style="margin:0;font-size:22px;font-weight:600;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         Welcome to ${bootcampTitle}!
        </h1>
      </td>
    </tr>
    
    <!-- Description Text -->
    <tr>
      <td style="padding-bottom:24px;">
      <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         Hi ${customerName || 'there'},
        </p>
       
        <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
       Congratulations! Your enrollment in <strong>${bootcampTitle}</strong> has been confirmed.
        </p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
      You now have full access to all bootcamp content. Click the button below to start your learning journey:
        </p>
         
        
      </td>
    </tr>
    
    <!-- Verify Button -->
    <tr>
      <td align="left" style="padding-bottom:30px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="background-color:#FFFFFF;border-radius:24px;">
              <a href="${bootcampUrl}" 
                 style="display:inline-block;padding:12px 22px;border-radius:24px;background-color:#FFFFFF;color:#000000;text-decoration:none;font-size:14px;font-weight:600;font-family:Arial,Helvetica,sans-serif;">
                Access Bootcamp
              </a>
              
              
              
            </td>
          </tr>
        </table>
      </td>
    </tr>
    
    <!-- Link Text -->
    <tr>
      <td style="padding-bottom:8px;">
        <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
        Or copy and paste this link into your browser:
          
        </p>
        <p style="font-size: 14px; color: #fffff; word-break: break-all;">${bootcampUrl}</p>
         <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
       As an enrolled student, you have access to:
          
        </p>
        <ul style="font-size: 14px; color: #ffff; margin-top: 15px; padding-left: 20px;">
            <li>All video lessons and tutorials</li>
            <li>Course materials and resources</li>
            <li>Progress tracking and analytics</li>
            <li>Community access and support</li>
          </ul>
       
      </td>
    </tr>
    
    <!-- Verification URL -->
    
    
    <!-- Expiry Notice -->
    <tr>
      <td style="padding-bottom:20px;">
        <p style="margin:0;font-size:14px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
         If you have any questions, feel free to reach out to our support team
        </p>
         <p style="font-size: 14px; color: #fff; margin-top: 20px;">Happy learning!<br> <br>The Inspired Analyst Team</p>
      </td>
    </tr>
    
    
  </table>
`;

  const html = generateEmailTemplate(mainContent, 'Inspired Analyst');
  console.log('📧 [BOOTCAMP ENROLLMENT EMAIL] Calling sendEmail function...');
  
  try {
    await sendEmail({
      to: email,
      subject: `Welcome to ${bootcampTitle} - Inspired Analyst`,
      html,
    });
    console.log('✅ [BOOTCAMP ENROLLMENT EMAIL] Bootcamp enrollment email sent successfully!', {
      email,
      bootcampTitle
    });
  } catch (error: any) {
    console.error('❌ [BOOTCAMP ENROLLMENT EMAIL] Failed to send bootcamp enrollment email:', {
      error: error.message,
      email,
      bootcampTitle,
      bootcampId
    });
    throw error;
  }
}


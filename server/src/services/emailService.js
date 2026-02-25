const nodemailer = require('nodemailer');


const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       
    port: process.env.EMAIL_PORT,      
    auth: {
      user: process.env.EMAIL_USER,     
      pass: process.env.EMAIL_PASS      
    }
  });

  return transporter;
};

const sendEmail = async (options) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"FreelanceHub" <${process.env.EMAIL_FROM}>`, 
    to: options.to,           
    subject: options.subject, 
    html: options.html        
  };

  await transporter.sendMail(mailOptions);
};




const sendVerificationEmail = async (email, name, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
        .header { background-color: #16a34a; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .otp-box { background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #16a34a; letter-spacing: 8px; }
        .footer { background-color: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 12px; }
        .warning { color: #ef4444; font-size: 13px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 FreelanceHub</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}! 👋</h2>
          <p>Welcome to FreelanceHub! Please verify your email address by entering the following code:</p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #6b7280;">Your verification code</p>
            <div class="otp-code">${otp}</div>
          </div>
          
          <p class="warning">⚠️ This code expires in <strong>10 minutes</strong>. Do not share this code with anyone.</p>
          
          <p>If you didn't create an account on FreelanceHub, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Verify Your Email - FreelanceHub',
    html
  });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; }
        .header { background-color: #16a34a; padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
        .content { padding: 40px 30px; }
        .button { display: inline-block; background-color: #16a34a; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0; }
        .footer { background-color: #f9fafb; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 12px; }
        .warning { color: #ef4444; font-size: 13px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 FreelanceHub</h1>
        </div>
        <div class="content">
          <h2>Hi ${name}! 👋</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          
          <p class="warning">⚠️ This link expires in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Reset Your Password - FreelanceHub',
    html
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail
};
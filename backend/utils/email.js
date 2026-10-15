const nodemailer = require('nodemailer');

// Create reusable transporter — configured via .env SMTP settings
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT, 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null; // Email not configured — caller should handle gracefully
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
};

/**
 * Send a password reset email.
 * @param {string} to - recipient email
 * @param {string} resetUrl - full URL with token
 * @returns {Promise<boolean>} true if sent, false if email is not configured
 */
const sendPasswordResetEmail = async (to, resetUrl) => {
  const transporter = createTransporter();
  if (!transporter) return false;

  const from = process.env.EMAIL_FROM || `Every Day Better <${process.env.SMTP_USER}>`;

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset Your Password — Every Day Better',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #111827; color: #e5e7eb; border-radius: 16px;">
        <h2 style="color: #3b82f6; margin-top: 0;">📚 Every Day Better</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password. Click the button below to set a new one:</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; font-weight: bold; padding: 12px 32px; border-radius: 12px; text-decoration: none; font-size: 14px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 13px; color: #9ca3af;">This link expires in <strong>30 minutes</strong>. If you didn't request a reset, ignore this email — your password is safe.</p>
        <hr style="border: none; border-top: 1px solid #374151; margin: 24px 0;" />
        <p style="font-size: 11px; color: #6b7280;">Every Day Better — Master English in 60 Days 🚀</p>
      </div>
    `,
    text: `Reset your password: ${resetUrl}\n\nThis link expires in 30 minutes. If you didn't request a reset, ignore this email.`,
  });

  return true;
};

module.exports = { sendPasswordResetEmail };

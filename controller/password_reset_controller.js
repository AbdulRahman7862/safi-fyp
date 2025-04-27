import crypto from 'crypto';
import { Sequelize } from 'sequelize';
import PasswordReset from '../model/password_reset_model.js';
import User from '../model/user_model.js';
import sendEmail from '../utils/send_email.js';

// Generate OTP (6 digits)
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();  // Generate a 6-digit OTP
};

const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate and normalize email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const trimmedEmail = email.trim().toLowerCase();

    // Check if the email exists in the users table (case-insensitive)
    console.log('Checking email in users table:', trimmedEmail);
    const user = await User.findOne({
      where: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('email')),
        trimmedEmail
      ),
    });

    if (!user) {
      console.log('Email not found in users table');
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate OTP and set expiration (10 minutes)
    const otp = generateOTP();
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000);

    // Create or update a record in the passwordReset table
    console.log('Upserting into passwordReset table for email:', trimmedEmail);
    await PasswordReset.upsert({
      email: trimmedEmail,
      otp,
      otpExpiration,
      resetPasswordToken: null,
    });

    // Send OTP via email
    console.log('Sending OTP email to:', trimmedEmail);
    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`;
    await sendEmail(trimmedEmail, subject, text);

    return res.status(200).json({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error in sendResetOTP:', error.message, error.stack);
    return res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// Controller to verify the OTP
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  // Validate inputs
  if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
    return res.status(400).json({ message: 'Invalid email or OTP' });
  }
  const trimmedEmail = email.trim().toLowerCase();

  // Find the password reset record
  const passwordReset = await PasswordReset.findOne({
    where: {
      email: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('email')),
        trimmedEmail
      ),
      otp: otp,
      otpExpiration: { [Sequelize.Op.gt]: new Date() },
    },
  });

  if (!passwordReset) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  return res.status(200).json({ message: 'OTP verified successfully' });
};

// Controller to reset the password
const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  const trimmedEmail = email.trim().toLowerCase();

  // Find the password reset record with a valid OTP
  const passwordReset = await PasswordReset.findOne({
    where: {
      email: Sequelize.where(
        Sequelize.fn('LOWER', Sequelize.col('email')),
        trimmedEmail
      ),
    },
  });

  if (!passwordReset || !passwordReset.otp || new Date() > new Date(passwordReset.otpExpiration)) {
    return res.status(400).json({ message: 'No valid OTP found or OTP expired' });
  }

  // Find the user by email
  const user = await User.findOne({
    where: Sequelize.where(
      Sequelize.fn('LOWER', Sequelize.col('email')),
      trimmedEmail
    ),
  });

  if (!user) {
    return res.status(400).json({ message: 'Email not found' });
  }

  // Update the user's password and clear the OTP fields in the password reset table
  await user.update({ password: newPassword });
  await PasswordReset.destroy({ where: { email: trimmedEmail } });

  return res.status(200).json({ message: 'Password reset successful' });
};

export { resetPassword, sendResetOTP, verifyOTP };

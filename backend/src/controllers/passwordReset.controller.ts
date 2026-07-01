import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.model";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import otpModel from "../models/otp.model";
import userModel from "../models/user.model";

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({
      message: "Please enter the email associated with the account.",
      success: false
    });

    const user = await UserModel.findOne({ email });

    if (!user) return res.status(400).json({
      message: "Account not found. Try with another email.",
      success: false
    });

    const emailSplit = user.email.split('@');

    const otp = generateOTP();
    sendOTPEmail(email, otp, res);

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 5);

    await otpModel.create({
      otp: hashedOTP,
      userId: user._id,
      expireAt: expirationDate,
      attemps: 0
    });

    res.status(200).json({
      message: `Please check the email inbox of "${emailSplit[0].slice(0, 5)}*******${emailSplit[0].slice(emailSplit[0].length - 2, emailSplit[0].length)}${emailSplit[1]}" for your one time passcode.`,
      success: true,
      userId: user._id
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
}

async function sendOTPEmail(userEmail: string, otp: string, res: Response) {
  // Create transporter using Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: `MooreTube <${process.env.EMAIL}>`,
    to: userEmail,
    subject: "Your One-Time Passcode (OTP)",
    html: `
      <div>
        <h2>One Time Passcode</h2>
        <p>Your one-time passcode is: <strong>${otp}</strong></p>
        <p>Please bear in mind that this code expires in exactly 5 minutes and never share it with anyone!</p>
        <p>Please never reply to this email for it's an automated message</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions);

  } catch (error) {
    res.status(500).json({
      message: "Failed to send OTP email",
      success: false,
      error
    });
  }
}

function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export const checkOTP = async (req: Request, res: Response) => {
  try {
    const { userId, otp } = req.body;
    const otpDoc = await otpModel.findOne({ userId }).sort({ createdAt: -1 }).lean().exec();

    if (!otpDoc) return res.status(404).json({
      message: "Your one time passcode has already expired",
      success: false
    });

    const isCorrectOtp = await bcrypt.compare(otp, otpDoc.otp);
    if (!isCorrectOtp) return res.status(400).json({
      message: "Incorrect passcode",
      success: false,
    });

    res.status(200).json({
      message: "Correct passcode",
      success: true,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, userId } = req.body;

    if (password.length < 8) return res.status(400).json({
      message: "The new password has to be at least 8 characters long",
      success: false
    });

    if (!userId) return res.status(400).json({
      message: "No user Id has been provided",
      success: false
    });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({
      message: "User not found",
      success: false
    });

    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(password, salt);

    user.password = newHashedPassword;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "Your password has been reset successfully",
      success: true,
      token
    });

  } catch (error) {
    res.status(500).json({
      message: 'Internal Server Error',
      success: false,
      error
    });
  }
}
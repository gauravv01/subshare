import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";
import twilio from "twilio";
import sessionService from "./sessions";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signup = async (userEmail: string, userPassword: string, userAgent: string, ip: string ) => {
  const validated = signupSchema.parse({ email: userEmail, password: userPassword });

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  const user = await prisma.user.create({
    data: { 
      email: validated.email, 
      password: hashedPassword 
    },
  });

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });

  const userResponse = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    status: user.status,
    name: user.name,
    avatar: user.avatar,
    phoneNumber: user.phoneNumber,

  
  };

  await sessionService.createSession(user.id, token, userAgent, ip);

  return { user: userResponse, token };
};

export const login = async (email: string, password: string, userAgent: string, ip: string) => {
  const validated = signupSchema.parse({ email: email, password: password });

  const user = await prisma.user.findUnique({
    where: { email: validated.email },
  });
  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(validated.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '6h' });
  const userResponse = {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: user.role,
    status: user.status,
    name: user.name,
    avatar: user.avatar,
    phoneNumber: user.phoneNumber,

  
  };

  // Create a new session
  await sessionService.createSession(user.id, token, userAgent, ip);

  return { user: userResponse, token };
};

export const updatePassword = async ( req: any) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });
  if (!user) {
    throw new Error('User not found');
  }

const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
if (!isPasswordValid) {
  throw new Error('Invalid old password');
}

const hashedPassword = await bcrypt.hash(newPassword, 10);

const updatedUser = await prisma.user.update({
  where: { id: req.user.id },
  data: { password: hashedPassword },
});

return updatedUser;

};

export const setup2FA = async (userId: string, method: '2FA_APP' | 'SMS' | 'EMAIL') => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  switch (method) {
    case '2FA_APP': {
      const secret = speakeasy.generateSecret();
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: secret.base32,
          twoFactorMethod: method,
          twoFactorEnabled: false, // Will be enabled after verification
        },
      });
      return {
        secret: secret.base32,
        otpauthUrl: secret.otpauth_url,
      };
    }
    case 'SMS': {
      const secret = speakeasy.generateSecret();
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: secret.base32,
          twoFactorMethod: method,
          twoFactorEnabled: false,
        },
      });
      return { message: 'SMS verification setup initiated' };
    }
    case 'EMAIL': {
      const secret = speakeasy.generateSecret();
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorSecret: secret.base32,
          twoFactorMethod: method,
          twoFactorEnabled: false,
        },
      });
      return { message: 'Email verification setup initiated' };
    }
    default:
      throw new Error('Invalid 2FA method');
  }
};

export const verify2FA = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) {
    throw new Error('2FA not set up');
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorEnabled: true },
    });
    return { message: '2FA enabled successfully' };
  }

  throw new Error('Invalid verification code');
};

export const disable2FA = async (userId: string, token: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) {
    throw new Error('2FA not set up');
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: null,
        twoFactorEnabled: false,
        twoFactorMethod: null,
      },
    });
    return { message: '2FA disabled successfully' };
  }

  throw new Error('Invalid verification code');
};

export const send2FACode = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFactorSecret) {
    throw new Error('2FA not set up');
  }

  const code = speakeasy.totp({
    secret: user.twoFactorSecret,
    encoding: 'base32',
  });

  switch (user.twoFactorMethod) {
    case 'SMS': {
      // Send SMS using Twilio
      const twilioClient = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      await twilioClient.messages.create({
        body: `Your verification code is: ${code}`,
        to: user.phoneNumber!,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      break;
    }
    case 'EMAIL': {
      // Send email using nodemailer
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Your verification code',
        text: `Your verification code is: ${code}`,
        html: `<p>Your verification code is: <strong>${code}</strong></p>`,
      });
      break;
    }
    default:
      throw new Error('Invalid 2FA method');
  }

  return { message: 'Verification code sent' };
};



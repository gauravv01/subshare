import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signup = async (userEmail: string, userPassword: string) => {
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

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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
 

  return { user: userResponse, token };
};

const login = async (userEmail: string, userPassword: string) => {
  const validated = signupSchema.parse({ email: userEmail, password: userPassword });

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

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

  return { user: userResponse, token };
};

export default {
  signup,
  login,
};

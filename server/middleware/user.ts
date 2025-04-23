import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const getUser = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET is not set" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    req.user = user;
    
    next();
};
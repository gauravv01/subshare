import prisma from "../db";
import bcrypt from "bcrypt";
import { z } from "zod";
import {UAParser} from "ua-parser-js";
import geoip from "geoip-lite";

interface SessionInfo {
  device: string;
  browser: string;
  os: string;
  location?: string;
  ip?: string;
}

const getSessionInfo = (userAgent: string, ip: string): SessionInfo => {
  const parser = new UAParser(userAgent);
  const geo = geoip.lookup(ip);

  return {
    device: parser.getDevice().model || "Unknown Device",
    browser: parser.getBrowser().name || "Unknown Browser",
    os: parser.getOS().name || "Unknown OS",
    location: geo ? `${geo.city}, ${geo.country}` : undefined,
    ip: ip,
  };
};

const createSession = async (userId: string, token: string, userAgent: string, ip: string) => {
  const sessionInfo = getSessionInfo(userAgent, ip);
  const tokenHash = await bcrypt.hash(token, 10);

  const session = await prisma.session.create({
    data: {
      userId,
      token: tokenHash,
      ...sessionInfo,
    },
  });

  return session;
};

const getSessions = async (userId: string) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      isActive: true,
    },
    orderBy: {
      lastUsed: 'desc',
    },
  });

  return sessions;
};

const terminateSession = async (sessionId: string, userId: string) => {
  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    throw new Error('Session not found');
  }

  await prisma.session.update({
    where: { id: sessionId },
    data: { isActive: false },
  });

  return { message: 'Session terminated successfully' };
};

const terminateAllOtherSessions = async (userId: string, currentSessionId: string) => {
  await prisma.session.updateMany({
    where: {
      userId,
      id: { not: currentSessionId },
      isActive: true,
    },
    data: { isActive: false },
  });

  return { message: 'All other sessions terminated successfully' };
};

const validateSession = async (token: string): Promise<boolean> => {
  const session = await prisma.session.findFirst({
    where: {
      token: token,
      isActive: true,
    },
  });

  return !!session;
};

const updateSessionActivity = async (sessionId: string) => {
  await prisma.session.update({
    where: { id: sessionId },
    data: { lastUsed: new Date() },
  });
};

export default {
  createSession,
  getSessions,
  terminateSession,
  terminateAllOtherSessions,
  validateSession,
  updateSessionActivity,
}; 
/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client';
import logger from '../helpers/logger';

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

if (!global.__db) {
  global.__db = new PrismaClient();
}

export const prisma = global.__db;

export async function connectDB() {
  try {
    await prisma.$connect();
    logger.info('? Database connected successfully');
  } catch (error) {
    logger.info(error);
    await prisma.$disconnect();
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

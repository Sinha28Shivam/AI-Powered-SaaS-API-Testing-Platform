import { PrismaClient } from '@prisma/client';

// Extremely basic singleton to avoid hitting connection limits
export const prisma = new PrismaClient();

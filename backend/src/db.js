import { loadEnvFile } from 'node:process';

import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from 'pg';

import { PrismaClient } from './generated/prisma/client.ts';

loadEnvFile();

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

export const prisma = new PrismaClient({ adapter });

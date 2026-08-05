import { loadEnvFile } from 'node:process';

import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client.ts';

loadEnvFile();

// Flip DB_TARGET=local in .env to point the app at LOCAL_DATABASE_URL instead
// of Neon. DATABASE_URL (Neon) is never touched, so switching back just means
// removing/commenting that one line.
const useLocal = process.env.DB_TARGET === 'local';

const adapter = useLocal
  ? new PrismaPg(process.env.LOCAL_DATABASE_URL)
  : new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const prisma = new PrismaClient({ adapter });

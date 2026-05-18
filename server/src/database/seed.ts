import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { Role } from '../common/enums/role.enum';

const logger = new Logger('SeedScript');

// ONE password for all accounts — evaluator-friendly
const SEED_PASSWORD = 'QuickCred@123';

const SEED_USERS = [
  { email: 'admin@quickcred.com', role: Role.Admin, fullName: 'Admin User' },
  { email: 'sales@quickcred.com', role: Role.Sales, fullName: 'Sales Executive' },
  { email: 'sanction@quickcred.com', role: Role.Sanction, fullName: 'Sanction Executive' },
  {
    email: 'disbursement@quickcred.com',
    role: Role.Disbursement,
    fullName: 'Disbursement Executive',
  },
  { email: 'collection@quickcred.com', role: Role.Collection, fullName: 'Collection Executive' },
  { email: 'borrower@quickcred.com', role: Role.Borrower, fullName: 'Test Borrower' },
] as const;

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  let created = 0;
  let skipped = 0;

  const hashed = await bcrypt.hash(SEED_PASSWORD, 10);

  for (const seedUser of SEED_USERS) {
    const exists = await userModel.findOne({ email: seedUser.email });

    if (exists) {
      logger.log(`⏭  Skipping ${seedUser.email} — already exists`);
      skipped++;
      continue;
    }

    await userModel.create({
      email: seedUser.email,
      password: hashed,
      role: seedUser.role,
      fullName: seedUser.fullName,
      profileCompleted: seedUser.role !== Role.Borrower,
    });

    logger.log(`✅  Created [${seedUser.role}] ${seedUser.email}`);
    created++;
  }

  logger.log(`\n🌱 Seed complete — ${created} created, ${skipped} skipped`);
  logger.log(`\n📋 All accounts use password: ${SEED_PASSWORD}`);
  logger.log('\n┌─────────────────────────────────────┬──────────────────┐');
  logger.log('│ Email                               │ Role             │');
  logger.log('├─────────────────────────────────────┼──────────────────┤');
  for (const u of SEED_USERS) {
    logger.log(`│ ${u.email.padEnd(35)} │ ${u.role.padEnd(16)} │`);
  }
  logger.log('└─────────────────────────────────────┴──────────────────┘');

  await app.close();
}

seed().catch((err) => {
  logger.error('Seed failed', err);
  process.exit(1);
});

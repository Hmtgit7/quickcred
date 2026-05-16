import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AppModule } from '../app.module';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { Role } from '../common/enums/role.enum';

const logger = new Logger('SeedScript');

const SEED_USERS = [
  { email: 'admin@quickcred.com', password: 'Admin@123', role: Role.Admin, fullName: 'Admin User' },
  {
    email: 'sales@quickcred.com',
    password: 'Sales@123',
    role: Role.Sales,
    fullName: 'Sales Executive',
  },
  {
    email: 'sanction@quickcred.com',
    password: 'Sanction@123',
    role: Role.Sanction,
    fullName: 'Sanction Executive',
  },
  {
    email: 'disburse@quickcred.com',
    password: 'Disburse@123',
    role: Role.Disbursement,
    fullName: 'Disbursement Executive',
  },
  {
    email: 'collection@quickcred.com',
    password: 'Collect@123',
    role: Role.Collection,
    fullName: 'Collection Executive',
  },
  {
    email: 'borrower@quickcred.com',
    password: 'Borrow@123',
    role: Role.Borrower,
    fullName: 'Test Borrower',
  },
] as const;

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const userModel = app.get<Model<UserDocument>>(getModelToken(User.name));

  let created = 0;
  let skipped = 0;

  for (const seedUser of SEED_USERS) {
    const exists = await userModel.findOne({ email: seedUser.email });

    if (exists) {
      logger.log(`⏭  Skipping ${seedUser.email} — already exists`);
      skipped++;
      continue;
    }

    const hashed = await bcrypt.hash(seedUser.password, 10);
    await userModel.create({
      email: seedUser.email,
      password: hashed,
      role: seedUser.role,
      fullName: seedUser.fullName,
      profileCompleted: seedUser.role !== Role.Borrower,
    });

    logger.log(`✅  Created ${seedUser.role}: ${seedUser.email}`);
    created++;
  }

  logger.log(`\n🌱 Seed complete — ${created} created, ${skipped} skipped`);
  await app.close();
}

seed().catch((err) => {
  logger.error('Seed failed', err);
  process.exit(1);
});

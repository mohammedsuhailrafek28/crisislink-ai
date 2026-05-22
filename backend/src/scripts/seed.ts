import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';

dotenv.config({ path: process.cwd() + '/.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER ?? 'kinship',
  password: process.env.DB_PASS ?? 'kinship',
  database: process.env.DB_NAME ?? 'kinship_db',
  entities: [User],
});

async function run() {
  try {
    console.log('Initializing datasource...');
    await AppDataSource.initialize();

    const repo = AppDataSource.getRepository(User);

    const existing = await repo.count();
    if (existing > 0) {
      console.log(`Database already has ${existing} users — skipping seed.`);
      await AppDataSource.destroy();
      process.exit(0);
    }

    const users = [
      {
        fullName: 'Alice Singer',
        email: 'alice@example.com',
        password: 'password123',
        talentType: 'Singer',
        city: 'Austin',
        country: 'USA',
        bio: 'Vocalist and songwriter',
        skills: ['vocals', 'songwriting'],
        verified: true,
      },
      {
        fullName: 'Bob Chef',
        email: 'bob@example.com',
        password: 'password123',
        talentType: 'Chef',
        city: 'Portland',
        country: 'USA',
        bio: 'Culinary creator',
        skills: ['cooking', 'recipe development'],
        verified: false,
      },
    ];

    for (const u of users) {
      const passwordHash = await bcrypt.hash(u.password, 10);
      const entity = repo.create({
        email: u.email,
        passwordHash,
        fullName: u.fullName,
        talentType: u.talentType,
        city: u.city,
        country: u.country,
        bio: u.bio,
        skills: u.skills,
        verified: u.verified,
      } as Partial<User>);

      await repo.save(entity);
      console.log(`Created user ${u.email}`);
    }

    await AppDataSource.destroy();
    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    try {
      await AppDataSource.destroy();
    } catch {}
    process.exit(1);
  }
}

run();

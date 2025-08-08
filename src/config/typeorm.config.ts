import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { Meditation, Record, User } from '../entities';

config();

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432;

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: dbPort,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'meditation_tracker',
  entities: [User, Meditation, Record],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

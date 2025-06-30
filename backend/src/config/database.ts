import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Court } from '../models/Court';
import { Booking } from '../models/Booking';
import { Tournament } from '../models/Tournament';
import { Match } from '../models/Match';
import { UserStats } from '../models/UserStats';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DB_NAME || 'padel.db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Court, Booking, Tournament, Match, UserStats],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    throw error;
  }
};
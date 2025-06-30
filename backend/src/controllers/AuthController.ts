import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import { UserStats } from '../models/UserStats';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { validate } from 'class-validator';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const statsRepository = AppDataSource.getRepository(UserStats);

      // Check if user already exists
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      // Create new user
      const user = new User();
      user.email = email;
      user.password = await hashPassword(password);
      user.firstName = firstName;
      user.lastName = lastName;
      user.phone = phone;
      user.role = UserRole.PLAYER;

      // Validate user data
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: errors.map(err => err.constraints)
        });
      }

      // Save user
      const savedUser = await userRepository.save(user);

      // Create initial user stats
      const userStats = new UserStats();
      userStats.userId = savedUser.id;
      userStats.user = savedUser;
      await statsRepository.save(userStats);

      // Generate token
      const token = generateToken(savedUser);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });

      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const userRepository = AppDataSource.getRepository(User);
      const statsRepository = AppDataSource.getRepository(UserStats);

      const user = await userRepository.findOne({ 
        where: { id: userId },
        select: ['id', 'email', 'firstName', 'lastName', 'phone', 'role', 'createdAt']
      });

      const stats = await statsRepository.findOne({ where: { userId } });

      res.json({
        user,
        stats
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
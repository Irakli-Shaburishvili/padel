import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { Booking } from './Booking';
import { Match } from './Match';
import { UserStats } from './UserStats';

export enum UserRole {
  PLAYER = 'player',
  ADMIN = 'admin'
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Length(2, 50)
  firstName: string;

  @Column()
  @Length(2, 50)
  lastName: string;

  @Column()
  password: string;

  @Column()
  @Length(10, 15)
  phone: string;

  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.PLAYER
  })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, booking => booking.user)
  bookings: Booking[];

  @OneToMany(() => Match, match => match.player1)
  matchesAsPlayer1: Match[];

  @OneToMany(() => Match, match => match.player2)
  matchesAsPlayer2: Match[];

  @OneToMany(() => UserStats, stats => stats.user)
  statistics: UserStats[];
}
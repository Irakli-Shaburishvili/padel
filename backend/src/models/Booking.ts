import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsDate } from 'class-validator';
import { User } from './User';
import { Court } from './Court';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bookings)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Court, court => court.bookings)
  @JoinColumn({ name: 'courtId' })
  court: Court;

  @Column()
  courtId: number;

  @Column('datetime')
  @IsDate()
  startTime: Date;

  @Column('datetime')
  @IsDate()
  endTime: Date;

  @Column({
    type: 'simple-enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  @IsEnum(BookingStatus)
  status: BookingStatus;

  @Column('decimal', { precision: 8, scale: 2 })
  totalAmount: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  playerNames: string; // JSON string of additional player names

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Booking } from './Booking';

export enum CourtType {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor'
}

export enum CourtStatus {
  AVAILABLE = 'available',
  MAINTENANCE = 'maintenance',
  UNAVAILABLE = 'unavailable'
}

@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'simple-enum',
    enum: CourtType,
    default: CourtType.OUTDOOR
  })
  @IsEnum(CourtType)
  type: CourtType;

  @Column({
    type: 'simple-enum',
    enum: CourtStatus,
    default: CourtStatus.AVAILABLE
  })
  @IsEnum(CourtStatus)
  status: CourtStatus;

  @Column('decimal', { precision: 8, scale: 2 })
  @IsNumber()
  @Min(0)
  hourlyRate: number;

  @Column('decimal', { precision: 8, scale: 2 })
  @IsNumber()
  @Min(0)
  peakHourRate: number;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, booking => booking.court)
  bookings: Booking[];
}
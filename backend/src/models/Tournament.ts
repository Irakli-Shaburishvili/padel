import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEnum, IsDate, IsNumber, Min } from 'class-validator';
import { Match } from './Match';

export enum TournamentType {
  SINGLE_ELIMINATION = 'single_elimination',
  DOUBLE_ELIMINATION = 'double_elimination',
  ROUND_ROBIN = 'round_robin'
}

export enum TournamentStatus {
  REGISTRATION = 'registration',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({
    type: 'simple-enum',
    enum: TournamentType,
    default: TournamentType.SINGLE_ELIMINATION
  })
  @IsEnum(TournamentType)
  type: TournamentType;

  @Column({
    type: 'simple-enum',
    enum: TournamentStatus,
    default: TournamentStatus.REGISTRATION
  })
  @IsEnum(TournamentStatus)
  status: TournamentStatus;

  @Column('datetime')
  @IsDate()
  startDate: Date;

  @Column('datetime')
  @IsDate()
  endDate: Date;

  @Column('datetime')
  @IsDate()
  registrationDeadline: Date;

  @Column()
  @IsNumber()
  @Min(4)
  maxParticipants: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  entryFee: number;

  @Column('decimal', { precision: 8, scale: 2, default: 0 })
  @IsNumber()
  @Min(0)
  prizePool: number;

  @Column('text', { nullable: true })
  rules: string;

  @Column('json', { nullable: true })
  bracket: any; // Tournament bracket structure

  @Column('json', { nullable: true })
  participants: any; // Array of participant IDs

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Match, match => match.tournament)
  matches: Match[];
}
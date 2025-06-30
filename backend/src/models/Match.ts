import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsEnum, IsDate, IsNumber, Min, Max } from 'class-validator';
import { User } from './User';
import { Court } from './Court';
import { Tournament } from './Tournament';

export enum MatchStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.matchesAsPlayer1)
  @JoinColumn({ name: 'player1Id' })
  player1: User;

  @Column()
  player1Id: number;

  @ManyToOne(() => User, user => user.matchesAsPlayer2)
  @JoinColumn({ name: 'player2Id' })
  player2: User;

  @Column()
  player2Id: number;

  @ManyToOne(() => Court, court => court.bookings)
  @JoinColumn({ name: 'courtId' })
  court: Court;

  @Column()
  courtId: number;

  @ManyToOne(() => Tournament, tournament => tournament.matches, { nullable: true })
  @JoinColumn({ name: 'tournamentId' })
  tournament: Tournament;

  @Column({ nullable: true })
  tournamentId: number;

  @Column('datetime')
  @IsDate()
  scheduledTime: Date;

  @Column({
    type: 'simple-enum',
    enum: MatchStatus,
    default: MatchStatus.SCHEDULED
  })
  @IsEnum(MatchStatus)
  status: MatchStatus;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(3)
  player1Sets: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  @Max(3)
  player2Sets: number;

  @Column('json', { nullable: true })
  setScores: any; // Array of set scores like [{p1: 6, p2: 4}, {p1: 7, p2: 5}]

  @Column({ nullable: true })
  winnerId: number;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
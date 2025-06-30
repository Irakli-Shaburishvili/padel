import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNumber, Min } from 'class-validator';
import { User } from './User';

@Entity()
export class UserStats {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.statistics)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  matchesPlayed: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  matchesWon: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  matchesLost: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  setsWon: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  setsLost: number;

  @Column({ default: 1000 })
  @IsNumber()
  @Min(0)
  eloRating: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  tournamentsPlayed: number;

  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  tournamentsWon: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Computed properties
  get winRate(): number {
    return this.matchesPlayed > 0 ? (this.matchesWon / this.matchesPlayed) * 100 : 0;
  }

  get setWinRate(): number {
    const totalSets = this.setsWon + this.setsLost;
    return totalSets > 0 ? (this.setsWon / totalSets) * 100 : 0;
  }
}
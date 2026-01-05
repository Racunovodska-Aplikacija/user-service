import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    // Stored as a bcrypt hash; required on creation
    @Column()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsNotEmpty()
    lastName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

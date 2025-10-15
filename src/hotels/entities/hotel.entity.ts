import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hotel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    name: string;

    @Column()
    address: string;

    @OneToOne(() => User, {nullable: false})
    @JoinColumn({ name: 'managerId'})
    manager: User;
}
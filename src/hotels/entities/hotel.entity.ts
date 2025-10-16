import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Hotel{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false, unique: true})
    name: string;

    @Column()
    address: string;

    @OneToOne(() => User, {
        nullable: false, 
        onDelete: 'CASCADE'})
    @JoinColumn({ name: 'managerId'})
    manager: User;

    @OneToMany(() => Room, (room) => room.hotel, {
        cascade: true, 
    })
    rooms: Room[];

}
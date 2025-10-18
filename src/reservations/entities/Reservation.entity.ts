import { Room } from "src/rooms/entities/room.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Reservation{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.reservations, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'userId'})
    user: User;

    @ManyToOne(() => Room, (room) => room.reservations, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'roomId'})
    room: Room;

    @Column({type: 'date'})
    startDate: Date;

    @Column({type: 'date'})
    endDate: Date;

    @Column({type: 'decimal', nullable:false, scale:2})
    totalPrice: number;

}
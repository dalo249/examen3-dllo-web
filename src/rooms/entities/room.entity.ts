import { Hotel } from "src/hotels/entities/hotel.entity";
import { Reservation } from "src/reservations/entities/Reservation.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum RoomType {
    BASICA = "basica",
    DOBLE = "doble",
    SUIT = "suit"
}

@Entity()
export class Room{
    
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ nullable: false })
    numberRoom: number; 
    
    @Column({ type: 'enum', enum: RoomType, default: RoomType.BASICA,})
    type: RoomType;

    @Column({type: 'decimal', nullable:false, scale:2})
    price: number

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'hotelId'})
    hotel: Hotel;

    @OneToMany(() => Reservation, (reservation) => reservation.room,{
            cascade: true
        })
        reservations: Reservation[];

}
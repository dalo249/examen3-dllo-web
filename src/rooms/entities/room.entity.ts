import { Hotel } from "src/hotels/entities/hotel.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => Hotel, (hotel) => hotel.rooms, {
        nullable: false, 
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'hotelId'})
    hotel: Hotel;

}
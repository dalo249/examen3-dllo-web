import { ConflictException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Room } from "../entities/room.entity";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class RoomValidator{

    constructor(
        @InjectRepository(Room) 
        private readonly roomRepository: Repository<Room>,
    
    ){}

    async validateRoomUnique(hotelId: number, numberRoom:number): Promise<void>{
        const roomExist = await this.roomRepository.findOne({
            where:{
                hotel: { id: hotelId},
                numberRoom
            },
        });
        if (roomExist){
            throw new ConflictException(`Habitacion numero ${numberRoom} ya existe en el hotel`)
        }
    }

    validateManagerOwnsRoom(room: Room, user: User): void {
        if(room.hotel.manager.id !== user.id){
            throw new ForbiddenException(`El gerente con id ${user.id}, no es propietario del hotel que contiene la habitacion`);
        }
    }
}
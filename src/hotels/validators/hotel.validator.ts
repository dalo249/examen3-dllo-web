import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Hotel } from "../entities/hotel.entity";
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";


@Injectable()
export class HotelValidator{

    constructor(
        @InjectRepository(Hotel) 
        private readonly hotelRepository: Repository<Hotel>,
    
    ){}

    async validateHotelNameUnique(hotelName: string): Promise<void>{
        const hotel = await this.hotelRepository.findOneBy({name: hotelName});
        if (hotel){
            throw new BadRequestException('Ya existe un hotel con el nombre ingresado');
        } 
    }

    async validateManagerNotAssignedAnotherHotel(id: number): Promise<void>{
        console.log(`Entro  ${id}`)
        const existHotel = await this.hotelRepository.findOneBy({manager: { id: id }});
        if(existHotel){
            console.log(`Entro  ${existHotel}`)
            throw new BadRequestException(`Gerente con id: ${id} Ya tiene un hotel asignado`);
        }
    }

    async validateManagerOwnsHotel(hotel: Hotel, user: User): Promise<void>{
        if(hotel.manager.id !== user.id){
            throw new ForbiddenException(`El gerente con id: ${hotel.id}, No tiene asignado el hotel: ${hotel.name}`);
        }
    }
}
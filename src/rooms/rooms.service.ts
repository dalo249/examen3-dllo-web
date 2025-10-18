import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './entities/dto/create-room.dto';
import { Role, User } from 'src/users/entities/user.entity';
import { RoomResponseDto } from './entities/dto/room-response.dto';
import { Hotel } from 'src/hotels/entities/hotel.entity';
import { HotelsService } from 'src/hotels/hotels.service';
import { RoomValidator } from './validators/room.validator';
import { UpdateRoomDto } from './entities/dto/update-room.dto';

@Injectable()
export class RoomsService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        private readonly roomValidator: RoomValidator,
        private readonly hotelsService: HotelsService,
    ){}

    async create(createRoomDto: CreateRoomDto, user: User): Promise <RoomResponseDto>{

        let hotel:Hotel
        if (user.roles == Role.ADMIN){
            if (!createRoomDto.hotelId){
                throw new BadRequestException('Como admin: debe ingresar hotelId para asociarlo a la habitacion');
            }
            hotel = await this.hotelsService.findEntityById(createRoomDto.hotelId);
        }else {
            hotel = await this.hotelsService.findHotelByManagerId(user.id);
        }
        await this.roomValidator.validateRoomUnique(hotel.id, createRoomDto.numberRoom)
        const room = this.roomRepository.create({
            ...createRoomDto,
            hotel,
        })
        const roomSaved = this.roomRepository.save(room);
        return new RoomResponseDto(room);
    }

    async findAll(): Promise<RoomResponseDto[]>{
        const rooms = await this.roomRepository.find();
        return rooms.map(r => new RoomResponseDto(r));
    }

    async findRoomsByHotel(hotelId: number): Promise<RoomResponseDto[]>{
        const hotel = await this.hotelsService.findEntityById(hotelId);
        const rooms = await this.roomRepository.findBy({hotel});
        return rooms.map(r => new RoomResponseDto(r));
    }

    async findOneById(id: number): Promise<RoomResponseDto>{
        const room = await this.roomRepository.findOneBy({ id });
        if (!room){
            throw new NotFoundException(`No existe una habitacion con id: ${id}`);
        }
        return new RoomResponseDto(room);
    }


    async findEntityById(id: number): Promise<Room>{
        const room = await this.roomRepository.findOne({
            where: {id},
            relations: ['hotel', 'hotel.manager'],
        });
        if (!room) {
            throw new NotFoundException(`No existe una habitacion con id: ${id}`);
        }
        return room;
    }

    async update(roomId: number, updateRoomDto: UpdateRoomDto, user: User): Promise<RoomResponseDto>{
        const room = await this.findEntityById(roomId);
        if(user.roles == Role.MANAGER){
            this.roomValidator.validateManagerOwnsRoom(room, user);
        }
        Object.assign(room, updateRoomDto);
        const savedRoom = await this.roomRepository.save(room);
        return new RoomResponseDto(savedRoom);

    }

    async delete(roomId: number, user: User): Promise<void>{
        const room = await this.findEntityById(roomId);
        if(user.roles == Role.MANAGER){
            this.roomValidator.validateManagerOwnsRoom(room, user);
        }
        await this.roomRepository.remove(room);
    }
}

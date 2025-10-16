import { BadRequestException, ConflictException, ConsoleLogger, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { Repository } from 'typeorm';
import { createHotelDto } from './entities/dto/create-hotel.dto';
import { Role, User } from 'src/users/entities/user.entity';
import { HotelResponseDto } from './entities/dto/hotel-response.dto';
import { HotelValidator } from './validators/hotel.validator';
import { UpdateHotelDto } from './entities/dto/update-hotel.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class HotelsService {
    constructor(
        @InjectRepository(Hotel) 
        private readonly hotelRepository: Repository<Hotel>,
        private readonly hotelValidator: HotelValidator,
        private readonly usersService: UsersService
    ){}


    async create(createHotelDto: createHotelDto, user: User): Promise<HotelResponseDto>{
        console.log(user.id);
        await this.hotelValidator.validateHotelNameUnique(createHotelDto.name);
        let manager: User;

        if(user.roles == Role.ADMIN){
            if(!createHotelDto.managerId){
                throw new BadRequestException('Como admin: debe ingresar un gerenteId para asociarlo al hotel');
            }
            manager = await this.usersService.findEntityById(createHotelDto.managerId);
        }else {
            manager = user;
        }

        await this.hotelValidator.validateManagerNotAssignedAnotherHotel(manager.id);      
        
        const hotel = this.hotelRepository.create({
            ...createHotelDto,
            manager,
        })
        const savedHotel = await this.hotelRepository.save(hotel);
        return new HotelResponseDto(savedHotel);
    }

    async findAll(): Promise<HotelResponseDto[]>{
        const users = await this.hotelRepository.find();
        return users.map(u => new HotelResponseDto(u));
    }

    async findOneById(id: number): Promise<HotelResponseDto>{
        const hotel = await this.hotelRepository.findOneBy({ id });

        if (!hotel){
            throw new NotFoundException(`No existe hotel con id: ${id}`)
        }
        return new HotelResponseDto(hotel);
    }

    async findEntityById(id: number): Promise<Hotel>{
        const hotel = await this.hotelRepository.findOne({ 
            where: { id },
            relations: ['manager'],
         });

        if (!hotel){
            throw new NotFoundException(`No existe hotel con id: ${id}`)
        }
        return hotel;
    }

    async findHotelByManagerId(userId: number): Promise<Hotel> {
        const hotel = await this.hotelRepository.findOne({
            where: {manager: {id: userId}},
        });

        if (!hotel){
            throw new NotFoundException(`No existe ningun hotel, relacionado con el usuario id: ${userId}`)
        }
        return hotel;  
    }

    async update(hotelId: number, updateHotelDto: UpdateHotelDto, user: User){
        const hotel = await this.findEntityById(hotelId);
        if (user.roles == Role.MANAGER){
            this.hotelValidator.validateManagerOwnsHotel(hotel, user);
        }
        Object.assign(hotel, updateHotelDto);
        const savedHotel = await this.hotelRepository.save(hotel);
        return new HotelResponseDto(savedHotel);
    }

    async delete(id: number): Promise<void>{
      const hotel = await this.findEntityById(id);
      await this.hotelRepository.remove(hotel);
    }

}

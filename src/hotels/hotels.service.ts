import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

        await this.hotelValidator.validateHotelNameUnique(createHotelDto.name);
        let manager: User;

        if(user.roles == Role.ADMIN){
            if(!createHotelDto.managerId){
                throw new ForbiddenException('Como admin: debe asginar un gerenteId al crear hotel');
            }
            manager = await this.usersService.findEntityById(createHotelDto.managerId);
        }else{
            console.log(`Aca llego ${user.roles}`)
            manager = user;
            console.log(`Asignoo ${manager.roles}`)
        }
        await this.hotelValidator.validateManagerNotAssignedAnotherHotel(manager.id);      
        
        const hotel = this.hotelRepository.create({
            ...createHotelDto,
            manager,
        })
        const savedHotel = await this.hotelRepository.save(hotel);
        return new HotelResponseDto(savedHotel);
    }

    async findOneById(id: number): Promise<Hotel>{
        const hotel = await this.hotelRepository.findOneBy({ id });

        if (!hotel){
            throw new NotFoundException(`No existe hotel con id: ${id}`)
        }
        return hotel;
    }

    async findOneByName(name: string): Promise<Hotel | null>{
        return await this.hotelRepository.findOneBy({name});
    }

    async update(hotelId: number, updateHotelDto: UpdateHotelDto, user: User){
        const hotel = await this.findOneById(hotelId);
        if (user.roles == Role.MANAGER){
            await this.hotelValidator.validateManagerOwnsHotel(hotel, user);
        }
        Object.assign(hotel, updateHotelDto);

        const savedHotel = await this.hotelRepository.save(hotel);
        return new HotelResponseDto(savedHotel);
    }


}

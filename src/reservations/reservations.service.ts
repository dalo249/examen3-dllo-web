import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/Reservation.entity';
import { Repository } from 'typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateReservationDto } from './entities/dto/create-reservation.dto';
import { Role, User } from 'src/users/entities/user.entity';
import { ReservationResponseDto } from './entities/dto/reservation-response.dto';
import { ReservationValidator } from './validators/reservation.validator';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class ReservationsService {

    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository : Repository<Reservation>,
        private readonly roomsService : RoomsService,
        private readonly reservationValidator: ReservationValidator,
    ){}

    async create(createReservationDto: CreateReservationDto, user : User): Promise<ReservationResponseDto>{

        const { roomId, startDate, endDate} = createReservationDto;
        const room = await this.roomsService.findEntityById(roomId);

        this.reservationValidator.validateDatesRange(startDate, endDate);
        await this.reservationValidator.validateReservationOverAnother(roomId, startDate, endDate);
        const totalPrice = this.calculateTotalPrice(room, startDate, endDate);

        const reservation = this.reservationRepository.create({
            user,
            room,
            startDate,
            endDate,
            totalPrice
        });
        const savedReservation = await this.reservationRepository.save(reservation);
        return new ReservationResponseDto(savedReservation);
    }

    private calculateTotalPrice(room: Room, startDate:Date, endDate: Date): number{
        const diffInMiliseconds = endDate.getTime() - startDate.getTime();
        const nights = Math.ceil(diffInMiliseconds / (1000 * 60 * 60 * 24));
        return room.price * nights; 
    }

    async findAll(user: User): Promise<ReservationResponseDto[]>{
        let reservations: Reservation[];
        if( user.roles == Role.CLIENT){
            reservations = await this.reservationRepository.find({
                where: { user: {id: user.id}},
                relations: ['user','room', 'room.hotel']
            });
        } else {
            reservations = await this.reservationRepository.find({
                relations : ['user', 'room', 'room.hotel']
            });
        }
        return reservations.map(r => new ReservationResponseDto(r));
    }
    
    async findEntityById(id: number): Promise<Reservation>{
        const reservation = await this.reservationRepository.findOne({ 
            where: {id},
            relations: ['user', 'room', 'room.hotel'],
         });

         if(!reservation){
            throw new NotFoundException(`No existe una reserva con id: ${id}`)
         }
         return reservation;
    }

    async delete(reservationId: number, user: User): Promise<void>{
        const reservation = await this.findEntityById(reservationId);
        if (user.roles == Role.CLIENT){
            this.reservationValidator.validateUserOwnsReservation(reservation, user);
        }
        this.reservationValidator.validateCanDeleteReservation(reservation);
        await this.reservationRepository.remove(reservation);
    }
}

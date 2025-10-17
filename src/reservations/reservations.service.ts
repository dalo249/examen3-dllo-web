import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/Reservation.entity';
import { Repository } from 'typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateReservationDto } from './entities/dto/create-reservation.dto';
import { User } from 'src/users/entities/user.entity';
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
}

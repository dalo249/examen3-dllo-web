import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "../entities/Reservation.entity";
import { LessThan, MoreThan, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { ReservationResponseDto } from "../entities/dto/reservation-response.dto";

@Injectable()
export class ReservationValidator{
    constructor(
            @InjectRepository(Reservation)
            private readonly reservationRepository : Repository<Reservation>,
        ){}

    validateDatesRange(startDate: Date, endDate: Date): void{
        if(startDate < new Date()){
            throw new BadRequestException('No puedes crear reservas con fechas anteiores a la de hoy');
        }

        if (startDate >= endDate){
            throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
        }
    }

    async validateReservationOverAnother(roomId: number, startDate: Date, endDate: Date): Promise<void>{
        const reservationConflict = await this.reservationRepository.findOne({
            where: {
                room: {id: roomId},
                startDate: LessThan(endDate),
                endDate: MoreThan(startDate),
            },
        });

        if (reservationConflict){
            throw new BadRequestException(`Ya existe una reserva para la habitacion id:${roomId}, en el rango de fechas ingresado`)
        };
    }

    validateUserOwnsReservation(reservation: Reservation, user: User): void{
        if(reservation.user.id !== user.id){
            throw new ForbiddenException(`El cliente con id ${user.id}, no es dueño de la reserva`);
        }
    }

    validateCanDeleteReservation(reservation: Reservation): void{
        if(reservation.startDate <= new Date()){
            throw new BadRequestException('Solo puede eliminar reservas que no han comenzado');
        
        };
    }
}
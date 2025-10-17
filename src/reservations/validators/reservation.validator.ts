import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Reservation } from "../entities/Reservation.entity";
import { LessThan, MoreThan, Repository } from "typeorm";

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
}
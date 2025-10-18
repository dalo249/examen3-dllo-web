import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/Reservation.entity';
import { RoomsModule } from 'src/rooms/rooms.module';
import { ReservationValidator } from './validators/reservation.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    RoomsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationValidator],
  exports: [ReservationsService]
})
export class ReservationsModule {}

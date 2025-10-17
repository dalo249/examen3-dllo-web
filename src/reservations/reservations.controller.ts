import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Role, User } from 'src/users/entities/user.entity';
import { CreateReservationDto } from './entities/dto/create-reservation.dto';
import { StandardResponseDto } from 'src/shared/dto/standard-response.dto';
import { ReservationResponseDto } from './entities/dto/reservation-response.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {

    constructor(private readonly reservationsService : ReservationsService){}

    @Post()
    @Roles(Role.CLIENT)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(
        @Body() createReservationDto: CreateReservationDto, 
        @GetUser() user: User
    ): Promise<StandardResponseDto<ReservationResponseDto>> {
        const reservationDto = await this.reservationsService.create(createReservationDto, user);
        return new StandardResponseDto(reservationDto, 'Created', 201);
    }
}

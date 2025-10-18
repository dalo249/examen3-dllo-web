import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
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

    @Get()
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async findAll(@GetUser() user: User): Promise<StandardResponseDto<ReservationResponseDto[]>>{
        const reservations = await this.reservationsService.findAll(user);
        return new StandardResponseDto(reservations);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.CLIENT)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<StandardResponseDto<null>>{
        await this.reservationsService.delete(id, user);
        return new StandardResponseDto(null, "No content: se elimino la reserva exitosamente", 204);
            
    }
}

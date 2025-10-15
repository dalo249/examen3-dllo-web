import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role, User } from 'src/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { StandardResponseDto } from 'src/shared/dto/standard-response.dto';
import { HotelResponseDto } from './entities/dto/hotel-response.dto';
import { createHotelDto } from './entities/dto/create-hotel.dto';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { read } from 'fs';
import { UpdateHotelDto } from './entities/dto/update-hotel.dto';

@Controller('hotels')
export class HotelsController {
    constructor(private readonly hotelsService: HotelsService){}

    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(
        @Body() createHotelDto: createHotelDto, 
        @GetUser() user: User): Promise<StandardResponseDto<HotelResponseDto>> {
            const hotelDto = await this.hotelsService.create(createHotelDto, user);
            return new StandardResponseDto(hotelDto, 'Created', 201);
        }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(): Promise<StandardResponseDto<HotelResponseDto[]>> {
        const hotelsDto = await this.hotelsService.findAll();
        return new StandardResponseDto(hotelsDto);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateHotelDto: UpdateHotelDto,
        @GetUser() user: User,
    ): Promise<StandardResponseDto<HotelResponseDto>>{
        const updatedHotel = await this.hotelsService.update(id, UpdateHotelDto, user);
        return new StandardResponseDto(updatedHotel);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
        async delete(@Param('id', ParseIntPipe) id: number): Promise<StandardResponseDto<null>>{
            await this.hotelsService.delete(id);
            return new StandardResponseDto(null, "No content: se elimino el hotel exitosamente", 204);
        }
}

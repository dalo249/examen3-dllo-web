import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Role, User } from 'src/users/entities/user.entity';
import { CreateRoomDto } from './entities/dto/create-room.dto';
import { RoomsService } from './rooms.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { GetUser } from 'src/shared/decorators/get-user.decorator';
import { StandardResponseDto } from 'src/shared/dto/standard-response.dto';
import { RoomResponseDto } from './entities/dto/room-response.dto';
import { UpdateRoomDto } from './entities/dto/update-room.dto';

@Controller('rooms')
export class RoomsController{

    constructor(
        private readonly roomsService : RoomsService
    ){}

    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async create(
        @Body() createRoomDto: CreateRoomDto, 
        @GetUser() user: User): Promise<StandardResponseDto<RoomResponseDto>> {
            const roomDto = await this.roomsService.create(createRoomDto, user);
            return new StandardResponseDto(roomDto, 'Created', 201);
        }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(): Promise<StandardResponseDto<RoomResponseDto[]>>{
        const roomsDto  = await this.roomsService.findAll();
        return new StandardResponseDto(roomsDto);
    }

    @Get('hotel/:hotelId')
    @UseGuards(AuthGuard('jwt'))
    async findRoomsByHotel(@Param('hotelId', ParseIntPipe) hotelId: number): Promise<StandardResponseDto<RoomResponseDto[]>>{
        const roomsDto = await this.roomsService.findRoomsByHotel(hotelId);
        return new StandardResponseDto(roomsDto);
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findOneById(@Param('id', ParseIntPipe) id: number): Promise<StandardResponseDto<RoomResponseDto>>{
        const roomsDto = await this.roomsService.findOneById(id);
        return new StandardResponseDto(roomsDto);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateRoomDto: UpdateRoomDto,
        @GetUser() user: User,
    ): Promise<StandardResponseDto<RoomResponseDto>>{
        const updatedRoom = await this.roomsService.update(id, UpdateRoomDto, user);
        return new StandardResponseDto(updatedRoom);
    }
    
    @Delete(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async delete(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User,
    ): Promise<StandardResponseDto<null>>{
        await this.roomsService.delete(id, user);
        return new StandardResponseDto(null, "No content: se elimino la habitacion exitosamente", 204);
    }
    
        
}



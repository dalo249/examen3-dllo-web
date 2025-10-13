import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './entities/dto/create-user.dto';
import { StandardResponseDto } from 'src/shared/dto/standard-response.dto';
import { UsersService } from './users.service';
import { UserResponseDto } from './entities/dto/user-response.dto';
import { UpdateUserDto } from './entities/dto/update-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly userService: UsersService){}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createUserDto: CreateUserDto): Promise<StandardResponseDto<UserResponseDto>>{
        const userDto = await this.userService.create(createUserDto);
        return new StandardResponseDto(userDto, 'Created', 201);
    }

    @Get(':id')
    async findOneById(@Param('id', ParseIntPipe) id: number): Promise<StandardResponseDto<UserResponseDto>> {
        const userDto = await this.userService.findOneById(id); 
        return new StandardResponseDto(userDto); 
    }

    @Get()
    async findAll(): Promise<StandardResponseDto<UserResponseDto[]>> {
        const usersDto = await this.userService.findAll();
        return new StandardResponseDto(usersDto);
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto){
        const userDto = await this.userService.update(id, updateUserDto);
        return new StandardResponseDto(userDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<StandardResponseDto<null>>{
        await this.userService.delete(id);
        return new StandardResponseDto(null, "No content: se elimino el usuario exitosamente", 204);
    }
}

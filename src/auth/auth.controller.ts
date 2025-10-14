import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './entities/dto/register-user.dto';
import { StandardResponseDto } from 'src/shared/dto/standard-response.dto';
import { UserResponseDto } from 'src/users/entities/dto/user-response.dto';
import { LoginUserDto } from './entities/dto/login-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register/client')
    async registerClient( @Body() registerUserDto: RegisterUserDto): Promise<StandardResponseDto<UserResponseDto>>{
        const savedUser = await this.authService.registerClient(registerUserDto);
        return new StandardResponseDto(savedUser, 'Created: cliente registrado', 201);
    }

    @Post('register/manager')
    async registerManager( @Body() registerUserDto: RegisterUserDto): Promise<StandardResponseDto<UserResponseDto>>{
        const savedUser = await this.authService.registerManager(registerUserDto);
        return new StandardResponseDto(savedUser, 'Created: gerente registrado', 201);
    }

    @Post('login')
    async login(@Body() loginUserDto : LoginUserDto){
        const token = await this.authService.login(loginUserDto);
        return new StandardResponseDto(token);
    }

}

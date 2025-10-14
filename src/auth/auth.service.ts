import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './entities/dto/register-user.dto';
import { UserResponseDto } from 'src/users/entities/dto/user-response.dto';
import { StandardResponseDto } from 'src/shared/dto/standard-response.dto';
import { PasswordService } from 'src/shared/services/password.service';
import { CreateUserDto } from 'src/users/entities/dto/create-user.dto';
import { LoginUserDto } from './entities/dto/login-user.dto';
import { LoginResponseDto } from './entities/dto/login-response.dto';
import { Role } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly passwordService: PasswordService
    ){}

    private async register(registerUserDto : RegisterUserDto, role: Role): Promise<UserResponseDto>{
        const user = await this.usersService.findOneByEmail(registerUserDto.email);
        if (user) {
            throw new ConflictException('Ya existe un usuario registrado con el email ingresado')
        }
        const hashedPassword = await this.passwordService.hashPassword(registerUserDto.password);
        return await this.usersService.create({
            ...registerUserDto, 
            password: hashedPassword,
            roles: role
        });
    }

    async registerClient(registerUserDto: RegisterUserDto): Promise<UserResponseDto>{
        return await this.register(registerUserDto, Role.CLIENT);
    }

    async registerManager(registerUserDto: RegisterUserDto): Promise<UserResponseDto>{
        return await this.register(registerUserDto, Role.MANAGER);
    }


    private async validateUser(email: string, password: string): Promise<UserResponseDto | null>{
        const user = await this.usersService.findOneByEmail(email);
        if(user && await this.passwordService.comparePassword(password, user?.password)){
            return new UserResponseDto(user);
        }
        return null;
    }

    async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
        const validatedUser = await this.validateUser(loginUserDto.email, loginUserDto.password);
        if (!validatedUser){
            throw new UnauthorizedException('email o password invalidos');
        }
        const payload = {
            sub: validatedUser.id,
            email: validatedUser.email,
            roles: validatedUser.roles
        };
        return {access_token: this.jwtService.sign(payload)}  
    }


}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './shared/decorators/roles.decorator';
import { Role, User } from './users/entities/user.entity';
import { RolesGuard } from './shared/guards/roles.guard';
import { GetUser } from './shared/decorators/get-user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  publica(): string {
    return 'ruta publica aaceso permitido';
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@GetUser() user: User){
    return {
      message: 'info perfil usuario autenticado cualquier rol',
      user: user
    };
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getAdmin(@GetUser() user: User){
    return {
      message: 'info perfil usuario rol admin',
      user: user
    };
  }
}

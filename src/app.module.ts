import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { HotelsModule } from './hotels/hotels.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({ 
        type: 'mysql', 
        host: configService.get<string>('DB_HOST'), 
        port: Number(configService.get<number>('DB_PORT')) || 3306,
        username: configService.get<string>('DB_USERNAME'), 
        password: configService.get<string>('DB_PASSWORD'), 
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true, 
        synchronize: true, 
        }),
      }),
      UsersModule,
      AuthModule,
      SharedModule,
      HotelsModule,
      RoomsModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

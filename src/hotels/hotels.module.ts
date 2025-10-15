import { Module } from '@nestjs/common';
import { HotelsController } from './hotels.controller';
import { HotelsService } from './hotels.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { SharedModule } from 'src/shared/shared.module';
import { HotelValidator } from './validators/hotel.validator';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel]),
    SharedModule,
    UsersModule
  ],
  controllers: [HotelsController],
  providers: [HotelsService, HotelValidator],
  exports: [HotelsService]
})
export class HotelsModule {}

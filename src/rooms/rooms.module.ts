import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelsModule } from 'src/hotels/hotels.module';
import { RoomValidator } from './validators/room.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    HotelsModule,
  ],
  controllers: [RoomsController],
  providers: [RoomsService, RoomValidator]
})
export class RoomsModule {}

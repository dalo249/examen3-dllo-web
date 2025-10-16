import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { RoomType } from "../room.entity";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  numberRoom: number;

  @IsOptional()
  @IsEnum(RoomType)
  type: RoomType;

  @IsOptional()
  @IsNumber()
  hotelId?: number; 
}
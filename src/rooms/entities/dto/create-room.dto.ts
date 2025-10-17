import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { RoomType } from "../room.entity";

export class CreateRoomDto {
  @IsNotEmpty()
  @IsNumber()
  numberRoom: number;

  @IsOptional()
  @IsEnum(RoomType)
  type: RoomType;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsNumber()
  hotelId?: number; 
}
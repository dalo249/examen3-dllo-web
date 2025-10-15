import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class createHotelDto{

    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name:string;

    @IsOptional()
    @IsString()
    address: string;

    @IsOptional()
    @IsNumber()
    managerId?: number
}
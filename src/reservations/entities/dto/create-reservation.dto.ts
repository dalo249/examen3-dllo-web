import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateReservationDto{
    @IsNotEmpty()
    @IsNumber()
    roomId: number;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    endDate: Date;
}
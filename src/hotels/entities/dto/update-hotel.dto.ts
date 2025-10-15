import { PartialType } from "@nestjs/mapped-types";
import { createHotelDto } from "./create-hotel.dto";

export class UpdateHotelDto extends PartialType(createHotelDto){}
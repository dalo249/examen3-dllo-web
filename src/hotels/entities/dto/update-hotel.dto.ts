import { OmitType, PartialType } from "@nestjs/mapped-types";
import { createHotelDto } from "./create-hotel.dto";

export class UpdateHotelDto extends PartialType(OmitType(createHotelDto, ['managerId'] as const)){}
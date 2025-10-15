import { Hotel } from "../hotel.entity";

export class HotelResponseDto{
    id: number;
    name: string;
    address: string

    constructor(hotel: Hotel){
        this.id = hotel.id;
        this.name = hotel.name;
        this.address = hotel.address
    }
}
import { Reservation } from "../Reservation.entity";

export class ReservationResponseDto{
    id: number;
    startDate: Date;
    endDate: Date;
    totalPrice: number;

    room: {
        number: number;
        hotelName: string;
    }

    user: { id: number};

    constructor(reservation : Reservation){
        this.id= reservation.id;
        this.startDate = reservation.startDate;
        this.endDate = reservation.endDate;
        this.totalPrice = reservation.totalPrice;
        this.room = {
            number: reservation.room.numberRoom,
            hotelName: reservation.room.hotel.name
        }
        this.user = { 
            id: reservation.user.id
        }
    }
}
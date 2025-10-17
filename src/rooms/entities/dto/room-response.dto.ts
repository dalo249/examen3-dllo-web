import { Room, RoomType } from "../room.entity";

export class RoomResponseDto{
    
    id: number;
    numberRoom: number;
    type: RoomType;
    price: number

    constructor(room: Room){
        this.id = room.id;
        this.numberRoom = room.numberRoom;
        this.price = room.price;
        this.type = room.type
    }
}
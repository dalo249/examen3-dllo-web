import { Room, RoomType } from "../room.entity";

export class RoomResponseDto{
    
    id: number;
    numberRoom: number;
    type: RoomType;

    constructor(room: Room){
        this.id = room.id;
        this.numberRoom = room.numberRoom;
        this.type = room.type
    }
}
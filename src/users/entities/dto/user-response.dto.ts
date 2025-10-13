import { Role, User } from "../user.entity";

export class UserResponseDto{
    id: number;
    email:string;
    roles: Role;

    constructor(user: User){
        this.id = user.id;
        this.email = user.email;
        this.roles = user.roles;
    }
}
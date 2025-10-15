import { Hotel } from "src/hotels/entities/hotel.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    ADMIN = "admin",
    CLIENT = "client",
    MANAGER = "manager"
}

@Entity()
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    email: string;

    @Column({nullable: false})
    password: string;

    @Column({type: 'enum', default: Role.CLIENT, enum: Role})
    roles: Role;

    @OneToOne(() => Hotel, hotel => hotel.manager, {nullable: true})
    hotel?: Hotel;
}
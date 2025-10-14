import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../user.entity";
import { Transform } from "class-transformer";

export class CreateUserDto{

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @Transform(({ value }) => value.trim())
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsEnum(Role)
    roles?: Role
}
import { OmitType } from "@nestjs/mapped-types";

import { CreateUserDto } from "src/users/entities/dto/create-user.dto";

export class RegisterUserDto extends OmitType(CreateUserDto, ['roles'] as const){}
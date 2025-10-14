import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "src/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor (
        private configService: ConfigService,
        private readonly usersService: UsersService
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET') || "",
            ignoreExpiration: false
        })
    }

    validate(payload: any){
        return {
            userId: payload.sub, 
            email: payload.email,
            roles: payload.roles
        }
    }
}

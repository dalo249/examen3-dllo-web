import { Module } from '@nestjs/common';
import { PasswordService } from './services/password.service';
import { RolesGuard } from './guards/roles.guard';
import { Reflector } from '@nestjs/core';

@Module({
    providers: [PasswordService, RolesGuard, Reflector],
    exports: [PasswordService, RolesGuard]
})
export class SharedModule {}

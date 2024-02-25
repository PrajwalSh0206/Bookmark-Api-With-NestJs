import {  Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/decorator/getUser.decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    @HttpCode(HttpStatus.OK)
    @Get('me')
    getUser(@GetUser() user: string) {
        return user
    }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../decorator/getUser.decorator';
import { User } from '@prisma/client';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Get('me')
    getUser(@GetUser() user: User) {
        return user
    }
    @Patch()
    editUser(@GetUser('id') id: number, @Body() dto: EditUserDto) {
        return this.userService.editUser(id, dto);
    }
}

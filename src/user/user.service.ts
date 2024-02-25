import { Injectable } from '@nestjs/common';
import { EditUserDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {

    }

    async editUser(userId: number, updateData: EditUserDto) {
        const user = await this.prisma.user.update({
            data: updateData,
            where: {
                id: userId
            }
        })
        delete user.hash
        return user
    }
}

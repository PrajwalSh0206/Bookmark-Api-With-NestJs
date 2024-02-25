import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookMarkDto } from './dto/createbookmark.dto';
import { EditBookMarkDto } from './dto';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService) { }
    createBookMark(userId: number, dto: CreateBookMarkDto) {
        return this.prisma.bookmark.create({ data: { userId, ...dto } })
    }

    getBookMarks(userId: number) {
        return this.prisma.bookmark.findMany({ where: { userId } })
    }

    getBookMarkById(userId: number, id: number) {
        return this.prisma.bookmark.findFirst({ where: { userId, id } })
    }

    async editBookMarkById(userId: number, bookmarkId: number, dto: EditBookMarkDto) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        })
        if (!bookmark) {
            throw new ForbiddenException("Invalid Bookmark Id Provided")
        }
        return this.prisma.bookmark.update({
            data: dto,
            where: {
                id: bookmarkId,
                userId
            }
        })
    }

    async deleteBookMarkById(userId: number, bookmarkId: number) {
        const bookmark = await this.prisma.bookmark.findFirst({
            where: {
                id: bookmarkId,
                userId
            }
        })
        if (!bookmark) {
            throw new ForbiddenException("Invalid Bookmark Id Provided")
        }
        await this.prisma.bookmark.delete({ where: { userId, id: bookmarkId } })
    }
}

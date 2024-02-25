import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../decorator';
import { CreateBookMarkDto, EditBookMarkDto } from './dto';
import { BookmarkService } from './bookmark.service';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private bookmarkService: BookmarkService) {

    }
    @Post()
    createBookMark(@GetUser('id') userId: number, @Body() dto: CreateBookMarkDto) {
        return this.bookmarkService.createBookMark(userId, dto)
    }

    @Get()
    async getBookMarks(@GetUser('id') userId: number) {
        return { bookmarks: await this.bookmarkService.getBookMarks(userId) }
    }

    @Get(':id')
    async getBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return { bookmark: await this.bookmarkService.getBookMarkById(userId, bookmarkId) }
    }

    @Patch(':id')
    editBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookMarkDto) {
        return this.bookmarkService.editBookMarkById(userId, bookmarkId, dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(":id")
    deleteBookMarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.bookmarkService.deleteBookMarkById(userId, bookmarkId)
    }

}

import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(
        private bookmarkService: BookmarkService,
    ) {}

    @Get()
    getBookmarks(@GetUser('id') userId: number){
        return this.bookmarkService.getBookmarks(userId)
    }

    @Get(':id')
    getBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmardId: number
    ){
        return this.bookmarkService.getBookmarkById(userId, bookmardId)
    }

    @Post()
    createBookmark(
        @GetUser('id') userId: number, 
        @Body() dto: CreateBookmarkDto
    ){
        return this.bookmarkService.createBookmark(userId, dto)
    }

    @Patch(":id")
    editBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmardId: number,
        @Body() dto: EditBookmarkDto
){
        return this.bookmarkService.editBookmarkById(userId, bookmardId, dto)
    }

    @Delete(':id')
    deleteBookmarkById(
        @GetUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmardId: number
    ){
        return this.bookmarkService.deleteBookmarkById(userId, bookmardId)
    }


}

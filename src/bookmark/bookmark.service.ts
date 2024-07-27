import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    getBookmarks(userId: number){}

    getBookmarkById(userId: number, bookmardId: number){}

    createBookmark(userId: number, dto: CreateBookmarkDto){}

    editBookmarkById(userId: number, bookmardId, dto: EditBookmarkDto){}

    deleteBookmarkById(userId: number, bookmardId: number){}
}

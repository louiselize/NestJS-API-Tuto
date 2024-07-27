import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
    constructor(private prisma: PrismaService){}

    getBookmarks(userId: number){
        return this.prisma.bookmark.findMany({
            where:{
                userId
            }
        })
    }

    getBookmarkById(userId: number, bookmardId: number){
        return this.prisma.bookmark.findFirst({
            where:{
                id: bookmardId,
                userId
            }
        })
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto){
        const bookmark = await this.prisma.bookmark.create({
            data: {
                userId,
                ...dto,
            }
        })

        return bookmark
    }

    editBookmarkById(userId: number, bookmardId, dto: EditBookmarkDto){}

    deleteBookmarkById(userId: number, bookmardId: number){}
}

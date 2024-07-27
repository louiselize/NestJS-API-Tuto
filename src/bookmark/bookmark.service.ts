import { ForbiddenException, Injectable } from '@nestjs/common';
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

    async editBookmarkById(userId: number, bookmardId: number, dto: EditBookmarkDto){
        const bookmark = await this.prisma.bookmark.findUnique({
            where:{
                id: bookmardId,
            }
        })

        if(!bookmark || bookmark.userId !== userId){
            throw new ForbiddenException(
                'Access to resources denied'
            )
        }

        return this.prisma.bookmark.update({
            where:{
                id: bookmardId,
            },
            data: {
                ...dto,
            }
        })
    }

    deleteBookmarkById(userId: number, bookmardId: number){}
}

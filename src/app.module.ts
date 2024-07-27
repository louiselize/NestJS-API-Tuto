import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BookmarkController } from './bookmark/bookmark.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule, 
    UserModule, 
    BookmarkModule, 
    PrismaModule,
  ],
  controllers: [BookmarkController],
  providers: [],
})
export class AppModule {}

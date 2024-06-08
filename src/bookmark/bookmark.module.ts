import { Module } from '@nestjs/common';
import { BookmarkResolver } from './bookmark.resolver';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [BookmarkResolver, BookmarkService,PrismaService]
})
export class BookmarkModule {}
